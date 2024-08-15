import time
import random
from datetime import datetime

from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from ...ballin_db_task import BallinDatabaseTask
from pymongo import UpdateOne

COMPETITION_TYPES = {
        'CUP': 'CUP',
        'CHP': 'CHAMPIONSHIP'
        }

class Task(BallinDatabaseTask, ScrapDatabaseTask):
    def get_team(self, team_id):
        team_id = f"rbfa_{team_id}"
        team = self.ballin_db.teams.find_one({
            'teamId': team_id,
            })
        if team is None:
            raise Exception(f'unable to find team with id {team_id}')
        return team

    def get_competition(self, cp):
        cp_data = cp['id'].split('_')
        cp_type = COMPETITION_TYPES.get(cp_data[0], 'FRIENDLY')
        cp_id = int(cp_data[1])
        return {
            'id': cp_id,
            'name': cp['name'],
            'group': 1,
            'stage': 1,
            'type': cp_type
            }

@app.task(bind=True, base=Task, ignore_result=True)
def update_rbfa_match(self, match_id):
    match = self.scrap_db.rbfa_matches.find_one({'_id': match_id})
    if match is None:
        raise Exception(f'unable to find fff matches with id: {match_id}')

    home_team = self.get_team(match['homeTeam']['id'])
    away_team = self.get_team(match['awayTeam']['id'])
    home_score = match['outcome']['homeTeamGoals']
    away_score = match['outcome']['awayTeamGoals']
    competition = self.get_competition(match['series'])

    data = {
        'clubHome': home_team['clubId'],
        'clubAway': away_team['clubId'],
        'teamHome': home_team['_id'],
        'teamAway': away_team['_id'],
        'competition': competition,
        'date': match['startDate'],
        'day': match['day'],
        'country': 'BE',
        'season': '2019-2020',
        'type': competition['type'].lower(),
        'matchId': str(match['_id']),
        'scoreHome.team': home_team['_id'],
        'scoreAway.team': away_team['_id'],
        }

    if home_score is not None:
        data.update({'scoreHome.score': home_score})
    if away_score is not None:
        data.update({'scoreAway.score': away_score})

    self.ballin_db.matchv2.update_one({'matchId': data['matchId'], 'country': data['country']}, {'$set': data}, upsert=True)

