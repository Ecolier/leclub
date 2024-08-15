import time
import traceback
import re
import random
from datetime import datetime

from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from pymongo import UpdateOne

class Task(ScrapDatabaseTask):
    _soccerway_teams = {}
    _soccerway_competitions = {}

    def get_soccerway_team(self, team_id):
        if team_id not in self._soccerway_teams:
            self._soccerway_teams[team_id] = self.scrap_db.soccerway_teams.find_one({'_id': team_id})
        return self._soccerway_teams.get(team_id)

    def get_soccerway_competition(self, competition_id):
        if competition_id not in self._soccerway_competitions:
            self._soccerway_competitions[competition_id] = self.scrap_db.soccerway_competitions.find_one({'_id': competition_id})
        return self._soccerway_competitions.get(competition_id)

    def get_player_ids(self, player):
        ids = {}
        if 'soccerway' in player:
            ids.update({'soccerway': player['soccerway']['_id'] })
        if 'sofascore' in player:
            ids.update({'sofascore': player['sofascore']['_id'] })
        if 'tmkt' in player:
            ids.update({'tmkt': player['tmkt']['_id'] })
        return ids

    def get_player_last_name(self, player):
        if 'soccerway' in player:
            return player['soccerway']['informations']['last_name']
        if 'sofascore' in player:
            return player['sofascore']['informations']['complete_name'].split(' ')[-1]
        if 'tmkt' in player:
            return player['tmkt']['informations']['complete_name'].split(' ')[-1]

    def get_player_first_name(self, player):
        if 'soccerway' in player:
            return player['soccerway']['informations']['first_name']
        if 'sofascore' in player:
            return player['sofascore']['informations']['complete_name'].split(' ')[0]
        if 'tmkt' in player:
            return player['tmkt']['informations']['complete_name'].split(' ')[0]

    def get_player_birthdate(self, player):
        if 'tmkt' in player:
            d = player['tmkt']['informations'].get('date_of_birth')
            if d:
                return int(d.timestamp()) * 1000
        elif 'soccerway' in player:
            d = player['soccerway']['informations'].get('birth_date')
            if d:
                return int(d.timestamp()) * 1000
        elif 'sofascore' in player:
            return player['sofascore']['informations'].get('birthdate') * 1000


    def get_player_picture(self, player):
        if 'soccerway' in player:
            return player['soccerway']['informations']['picture']
        if 'sofascore' in player:
            return player['sofascore']['informations']['picture']
        # if 'tmkt' in player:
            # return player['tmkt']['informations']['picture']

    def get_player_country(self, player):
        if 'soccerway' in player:
            return player['soccerway']['informations']['nationality']
        if 'sofascore' in player:
            return player['sofascore']['informations']['nationality']
        if 'tmkt' in player:
            return player['tmkt']['informations']['citizenship'][0]

    def get_player_height(self, player):
        if 'soccerway' in player:
            return player['soccerway']['informations'].get('height')
        if 'sofascore' in player:
            return player['sofascore']['informations'].get('height')
        if 'tmkt' in player:
            return player['tmkt']['informations'].get('height')

    def get_player_weight(self, player):
        if 'soccerway' in player:
            return player['soccerway']['informations'].get('weight')
        if 'sofascore' in player:
            return player['sofascore']['informations'].get('weight')
        if 'tmkt' in player:
            return player['tmkt']['informations'].get('weight')

    def get_player_lateralite(self, player):
        if 'soccerway' in player:
            return player['soccerway']['informations'].get('foot')
        if 'tmkt' in player:
            return player['tmkt']['informations'].get('foot')
        if 'sofascore' in player:
            return player['sofascore']['informations'].get('preferred_foot')

    def get_player_gender(self, player):
        current_club = self.get_player_current_club(player)
        if current_club:
            club_gender = current_club.get('gender', 'M')
            return 1 if club_gender == 'F' else 0
        else:
            return 0

    def get_player_national_appearances(self, player):
        appearances = 0
        if 'soccerway' in player:
            for season_stat in player['soccerway']['statistics']:
                if season_stat.get('type') == 'international':
                    appearances += season_stat.get('appearances')
        return appearances

    def get_player_end_contract(self, player):
        if 'tmkt' in player:
            d = player['tmkt']['informations'].get('contract_expires')
            if d:
                return int(d.timestamp()) * 1000

    def get_player_previous_transfert(self, player):
        if 'soccerway' in player:
            transfers = player['soccerway'].get('transfers')
            if transfers:
                value_str = transfers[0].get('type', '')
                if value_str:
                    res = re.compile("€ (.*)(M|K)").search(value_str)
                    if res:
                        amount = float(res.group(1))
                        unit = res.group(2)
                        if unit == 'K':
                            return amount * 1000
                        if unit == 'M':
                            return amount * 1000000
        return None

    def get_player_contract_type(self, player):
        pass

    def get_player_positions(self, player):
        if 'sofascore' in player:
            return player['sofascore'].get('positions', [])
        if 'soccerway' in player:
            position = player['soccerway']['informations'].get('position')
            if position == 'Goalkeeper':
                return ['GK']
            if position == 'Defender':
                return ['DC', 'DR', 'DL']
            if position == 'Midfielder':
                return ['DM', 'MC', 'MR', 'ML', 'AM']
            if position == 'Attacker':
                return ['ST', 'RW', 'LW']
        return []

    def get_player_value(self, player):
        if 'tmkt' in player:
            value_str = player['tmkt']['market'].get('current_value', '')
            if value_str:
                res = re.compile("€(.*)(m|th)", re.RegexFlag.IGNORECASE).search(value_str)
                if res:
                    amount = float(res.group(1))
                    unit = res.group(2).lower()
                    if unit == 'th':
                        return amount * 1000
                    if unit == 'm':
                        return amount * 1000000
        return 0

    def get_player_injuries(self, player):
        injuries = []
        if 'soccerway' in player:
            for s in player['soccerway'].get('sidelines', []):
                if s['type'] != 'Suspended':
                    injuries.append({
                        'label': s['type'],
                        'startdate': s['start'].strftime('%d/%m/%Y'),
                        'enddate': s['end'].strftime('%d/%m/%Y'),
                        })
        return injuries

    def get_player_current_club(self, player):
        if 'soccerway' in player:
            for season_stat in player['soccerway']['statistics']:
                if '2021' in season_stat['season']['label']:
                    team = self.get_soccerway_team(season_stat['team'])
                    if team is None:
                        return None
                    return {
                            'name': team['informations']['name'],
                            'country': team['informations']['country'],
                            'gender': team['informations']['gender'],
                            'logo': team['informations']['logo'],
                            }

    def get_player_current_stats(self, player):
        statistics = {
            'teams': set(),
            'countries': set(),
            'competitions': set(),
            'appearances': 0,
            'goals': 0,
            'lineups': 0,
            'minutesPlayed': 0,
            'assists': 0,
            }
        if 'soccerway' in player:
            for season_stat in player['soccerway']['statistics']:
                if '2021' in season_stat['season']['label']:
                    team = self.get_soccerway_team(season_stat['team'])
                    competition = self.get_soccerway_competition(season_stat['competition'])
                    if team is None or competition is None:
                        continue
                    statistics['teams'].add(team['informations']['name'])
                    statistics['countries'].add(team['informations']['country'])
                    statistics['competitions'].add(competition['label'])

                    statistics['appearances'] += season_stat.get('appearances')
                    statistics['goals'] += season_stat.get('goals')
                    statistics['lineups'] += season_stat.get('lineups')
                    statistics['minutesPlayed'] += season_stat.get('played_time')
                    statistics['assists'] += 0

        statistics['teams'] = list(statistics['teams'])
        statistics['countries'] = list(statistics['countries'])
        statistics['competitions'] = list(statistics['competitions'])
        return statistics

    def on_success(self, players, task_id, args, kwargs):
        operations = []
        for player in players:
            operations.append(UpdateOne({'_id': player['_id']}, {'$set': player}, upsert=True))
        if len(operations) > 0:
            self.scrap_db.search_pro_players.bulk_write(operations)

@app.task(bind=True, base=Task, ignore_result=True, rate_limit="30/m")
def update_search_engine(self):
    players_agg = self.scrap_db.pro_players_indexes.aggregate([
        {
            '$lookup': {
                'from': 'sofascore_players',
                'localField': 'sofascore',
                'foreignField': '_id',
                'as': 'sofascore'
                },
            },
        {
            '$lookup': {
                'from': 'soccerway_players',
                'localField': 'soccerway',
                'foreignField': '_id',
                'as': 'soccerway'
                },
            },
        {
            '$lookup': {
                'from': 'tmkt_players',
                'localField': 'tmkt',
                'foreignField': '_id',
                'as': 'tmkt'
                },
            },
        {'$unwind': {'path': '$sofascore', 'preserveNullAndEmptyArrays': True}},
        {'$unwind': {'path': '$soccerway', 'preserveNullAndEmptyArrays': True}},
        {'$unwind': {'path': '$tmkt', 'preserveNullAndEmptyArrays': True}}
    ])
    players = []
    for player in players_agg:
        try:
            players.append({
                '_id': player['_id'],
                'ids': self.get_player_ids(player),
                'firstName': self.get_player_first_name(player),
                'lastName': self.get_player_last_name(player),
                'birthdate': self.get_player_birthdate(player),
                'picture': self.get_player_picture(player),
                'country': self.get_player_country(player),
                'height': self.get_player_height(player),
                'weight': self.get_player_weight(player),
                'lateralite': self.get_player_lateralite(player),
                'gender': self.get_player_gender(player),
                'nationalAppearances': self.get_player_national_appearances(player),
                'endContract': self.get_player_end_contract(player),
                'priviousTransfert': self.get_player_previous_transfert(player),
                'contractType': self.get_player_contract_type(player),
                'currentClub': self.get_player_current_club(player),
                'positions': self.get_player_positions(player),
                'currentSeasonStats': self.get_player_current_stats(player),
                'playerValue': self.get_player_value(player),
                'woundenArray': self.get_player_injuries(player),
                })
        except:
            traceback.print_exc() 
    return players
