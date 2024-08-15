import time
import random
from datetime import datetime

from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from ...ballin_db_task import BallinDatabaseTask
from pymongo import UpdateOne

TEAM_NUMBER_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
COMPETITION_TYPES = {
        'CUP': 'CUP',
        'CHP': 'CHAMPIONSHIP'
        }

class Task(ScrapDatabaseTask, BallinDatabaseTask):
    _clubs = {}
    _competitions = None

    def get_club(self, club_scl):
        if club_scl not in self._clubs:
            club = self.ballin_db.clubs.find_one({'scl': club_scl})
            self._clubs.update({club_scl: club})
        return self._clubs.get(club_scl)

@app.task(bind=True, base=Task, ignore_result=True)
def update_rbfa_team(self, team_id):
    team = self.scrap_db.rbfa_teams.find_one({'_id': team_id})
    if team is None:
        raise Exception(f"unable to find team with id: {team_id}")
    club = self.get_club(str(team['clubId']))
    if club is None:
        raise Exception(f"unable to find club with id: {team['clubId']}")

    competitions = []
    for cp in team.get('competitions', []):
        cp_data = cp['id'].split('_')
        cp_type = COMPETITION_TYPES.get(cp_data[0], 'FRIENDLY')
        cp_id = int(cp_data[1])
        competitions.append({
            'id': cp_id,
            'name': cp['name'],
            'group': 1,
            'stage': 1,
            'type': cp_type
            })

    competitions.sort(key=lambda x: 1 if x['type'] == 'CHAMPIONSHIP' else 0, reverse=True)
    team_name = "{} - {}".format(team['clubName'], competitions[0]['name'])
    team_no = TEAM_NUMBER_CHARSET.find(team.get('complement', 'A') or 'A')
    if team_no > 1:
        team_name += ' ({})'.format(team_no)
    data = {
        'clubId': club['_id'],
        'teamId': "{}_{}".format('rbfa', team['_id']),
        'name': team_name,
        'category': 'Autre',
        'gender': None,
        'season': '2019-2020',
        'isActive': True,
        'country': 'BE',
        'affiliateId': club['affiliateId'],
        'teamNo': team_no,
        'competitions': competitions,
        }
    self.ballin_db.teams.update_one({
        'teamId': data['teamId'],
        'clubId': data['clubId'],
        }, {'$set': data}, upsert=True)
