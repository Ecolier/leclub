import re
import time
import random
from datetime import datetime

from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask

def safe_strdate_timestamp(strdate):
    try:
        d = datetime.fromisoformat(strdate)
        return int(d.timestamp())
    except:
        return None

class Task(ScrapDatabaseTask, ApiTask):
    def on_success(self, match, task_id, args, kwargs):
        match['_id'] = match.pop('matchId')
        self.scrap_db.fff_matches.update_one({'_id': match['_id']}, {'$set': match}, upsert=True)

def get_competition_type(code, name):
    friendly_reg = re.compile(r"amicaux", flags=re.IGNORECASE)
    trophy_reg = re.compile(r"trophee", flags=re.IGNORECASE)
    if code == 'CP' or trophy_reg.search(name):
        return 'CUP'
    if code == 'CH':
        return 'CHAMPIONSHIP'

    # here its little bit tricky since AC should be only use for friendly matches
    # but FFF use it also for championship
    if friendly_reg.search(name):
        return 'FRIENDLY'
    if code == 'AC':
        return 'CHAMPIONSHIP'

def extract_match_events(match):
    events = match.get('match_feuille', {}).get('match_feuille_evenement', [])
    ret = list()
    for event in events:
        evt_min = event.get('cfe_min', 0)
        evt_min_sup = event.get('cfe_min_sup')
        at = evt_min + (int(evt_min_sup) if evt_min_sup != '' and evt_min_sup != None else 0)
        if event['cfe_typ'] == 'BU':
            ret.append({ 'at': at, 'type': 'goal', 'player': event['l1_li_no'], 'goalType': event['cfe_typ_but'] })
        if event['cfe_typ'] == 'R1':
            ret.append({ 'at': at, 'type': 'red_card', 'player': event['l1_li_no'] })
        if event['cfe_typ'] == 'J1':
            ret.append({ 'at': at, 'type': 'yellow_card', 'player': event['l1_li_no'] })
        if event['cfe_typ'] == 'ES':
            ret.append({ 'at': at, 'type': 'sub', 'in': event['l2_li_no'], 'out': event['l1_li_no'] })
    return ret

def extract_match_compos(match, events):
    compositions = match.get('match_feuille', {}).get('match_feuille_compo', [])
    home_team = match.get('home_team')
    away_team = match.get('away_team')

    ret = list()
    for player in compositions:
        if player.get('cfi_typ_role') != 'J':
            continue

        lineup = player.get('cfi_role') == 'T'
        goals = []
        in_at = 0 if lineup else None
        out_at = None
        
        for evt in events:
            if evt['type'] == 'goal' and evt['player'] == player.get('li_no'):
                goals.append({ 'at': evt['at'], 'type': evt['goalType'] })
            if evt['type'] == 'sub' and evt['in'] == player.get('li_no'):
                in_at = evt['at']
            if evt['type'] == 'sub' and evt['out'] == player.get('li_no'):
                out_at = evt['at']
        
        team = home_team if home_team.get('cl_no') == player.get('cfi_cl_no') else away_team
        ret.append({
            'player': {
                'id': player.get('in_no'),
                'license': player.get('li_no'),
                'birthdate': safe_strdate_timestamp(player.get('in_dat_nais'))
            },
            'number': player.get('cfi_maillot'),
            'capitain': player.get('cfi_capi') == 'C',
            'teamId': team['team_id'],
            'lineup': lineup,
            'goals': goals,
            'inAt': in_at,
            'outAt': out_at,
        })
    return ret

@app.task(bind=True, base=Task, ignore_result=True, rate_limit="1000/m")
def match_details(self, match_id):
    match = self.api.match(match_id)
    home_team = match.get('home_team')
    away_team = match.get('away_team')

    if home_team is not None:
        score = home_team.get('nb_but')
        home_team = {
            'id': home_team.get('cl_no'),
            'affiliateId': home_team.get('cl_cod'),
            'team': home_team.get('team_id'),
            'score': int(score) if score != '' else None,
            'forfeit': home_team.get('forf_gene') != 'N'
        }
    if away_team is not None:
        score = away_team.get('nb_but')
        away_team = {
            'id': away_team.get('cl_no'),
            'affiliateId': away_team.get('cl_cod'),
            'team': away_team.get('team_id'),
            'score': int(score) if score != '' else None,
            'forfeit': away_team.get('forf_gene') != 'N'
        }

    day = match.get('pj_no')
    infos = match['infos_match']
    match_date_str = infos.get('ma_dat')
    match_date = None
    if match_date_str != '' and match_date_str != None:
        match_date = datetime.fromisoformat(match_date_str)
        try:
            match_hour = datetime.strptime(infos['ma_heure'], '%HH%M')
            match_date = match_date.replace(hour=match_hour.hour, minute=match_hour.minute)
        except:
            pass

    match_sheet = match.get('match_feuille')
    events = extract_match_events(match)
    compositions = extract_match_compos(match, events)
    tab = None

    if match_sheet is not None:
        if match_sheet.get('chbx_tirs_au_but') is True:
            tab = {
                'home': match_sheet.get('cr_nb_tir_but'),
                'away': match_sheet.get('cv_nb_tir_but')
                }

    return dict(
        matchId=match.get('ma_no'),
        country='FR',
        date=match_date,
        competition={
            'id': match.get('cp_no'),
            'stage': match.get('ph_no'),
            'group': match.get('gp_no'),
            'name': match.get('cp_nom'),
            'type': get_competition_type(match.get('ph_typ'), match.get('cp_nom'))
        },
        season=match.get('sa_no'),
        day=int(day) if day is not None else None,
        home=home_team,
        away=away_team,
        tab=tab,
        events=events,
        compositions=compositions,
        regularTime=infos.get('ph_duree_periode'),
        prologationTime=infos.get('ph_duree_prol'),
        matchIsCancelled=(
            home_team is None or
            away_team is None or
            home_team.get('forfeit') == True or 
            away_team.get('forfeit') == True
            ),
        )

