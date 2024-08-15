import time
import random
from datetime import datetime

from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from ...ballin_db_task import BallinDatabaseTask
from pymongo import UpdateOne

class Task(ScrapDatabaseTask, BallinDatabaseTask):
    _clubs = {}
    _competitions = None

    def get_club(self, club_scl):
        if club_scl not in self._clubs:
            club = self.ballin_db.clubs.find_one({'scl': club_scl})
            self._clubs.update({club_scl: club})
        return self._clubs.get(club_scl)

    @property
    def competitions(self):
        if self._competitions is None:
            competitions = self.scrap_db.fff_matches.aggregate([
                {'$match': {
                    'competition.name': {'$exists': True},
                    }},
                {'$group': {
                    '_id': {
                        'id': '$competition.id',
                        'group': '$competition.group',
                        'stage': '$competition.stage',
                        'name': '$competition.name',
                        'type': '$competition.type',
                        },
                    'home_teams': {'$addToSet': '$home.team'},
                    'away_teams': {'$addToSet': '$away.team'}
                    }},
                ])
            self._competitions = list(map(lambda x: {
                'id': x['_id']['id'],
                'group': x['_id']['group'],
                'stage': x['_id']['stage'],
                'name': x['_id']['name'],
                'type': x['_id']['type'],
                'teams': set(x['home_teams']).union(set(x['away_teams']))
                }, competitions))
        return self._competitions

    def get_team_competitions(self, team_id):
        competitions = []
        for cp in self.competitions:
            if team_id in cp['teams']:
                competitions.append({
                    'id': cp['id'],
                    'group': cp['group'],
                    'stage': cp['stage'],
                    'name': cp['name'],
                    'type': cp['type'],
                    })
        return competitions

@app.task(bind=True, base=Task, ignore_result=True)
def update_fff_team(self, team_id):
    team = self.scrap_db.fff_teams.find_one({'teamId': team_id})
    if team is None:
        raise Exception(f"unable to find team with id: {team_id}")
    club = self.get_club(str(team['clubId']))
    if club is None:
        raise Exception(f"unable to find club with id: {team['clubId']}")

    competitions = self.get_team_competitions(team['teamId'])
    if len(competitions) == 0:
        return

    competitions.sort(key=lambda x: 1 if x['type'] == 'CHAMPIONSHIP' else 0, reverse=True)
    team_name = "{} - {}".format(team['name'], competitions[0]['name'])
    if team.get('teamCod', 1) > 1:
        team_name += ' ({})'.format(team['teamCod'])
    data = {
        'clubId': club['_id'],
        'teamId': team['teamId'],
        'name': team_name,
        'category': team['category'],
        'gender': team['gender'],
        'season': '2019-2020',
        'isActive': True,
        'country': team['country'],
        'affiliateId': club['affiliateId'],
        'teamNo': team.get('teamCod', 1),
        'competitions': competitions,
        }
    self.ballin_db.teams.update_one({
        'teamId': data['teamId'],
        'clubId': data['clubId'],
        }, {'$set': data}, upsert=True)

