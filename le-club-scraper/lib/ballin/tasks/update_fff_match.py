import time
import random
from datetime import datetime

from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from ...ballin_db_task import BallinDatabaseTask
from pymongo import UpdateOne

class Task(BallinDatabaseTask, ScrapDatabaseTask):
    def get_club(self, club_id):
        club = self.ballin_db.clubs.find_one({
            'affiliateId': str(club_id)
            })
        if club is None:
            raise Exception(f'unable to find club with affiliateId: {club_id}')
        return club['_id']

    def get_team(self, club_id, competition):
        team = self.ballin_db.teams.find_one({
            'affiliateId': str(club_id),
            'competition.id': str(competition['id']),
            'competition.group': str(competition['group']),
            'competition.stage': str(competition['stage']),
            })
        if team is None:
            raise Exception(f'unable to find team with affiliateId: {club_id}, competition: {competition}')
        return team['_id']

@app.task(bind=True, base=Task, ignore_result=True)
def update_fff_match(self, match_id):
    match = self.scrap_db.fff_matches.find_one({'_id': match_id})
    if match is None:
        raise Exception(f'unable to find fff matches with id: {match_id}')

    home_team = self.get_team(match['home']['affiliateId'], match['competition'])
    away_team = self.get_team(match['away']['affiliateId'], match['competition'])
    home_score = match['home']['score']
    away_score = match['away']['score']

    data = {
        'clubHome': self.get_club(match['home']['affiliateId']),
        'clubAway': self.get_club(match['away']['affiliateId']),
        'teamHome': home_team,
        'teamAway': away_team,
        'competition': match['competition'],
        'date': match['date'],
        'day': match['day'],
        'country': match['country'],
        'season': '2019-2020',
        'type': match['competition']['type'].lower(),
        'matchId': str(match['_id']),
        'scoreHome.team': home_team,
        'scoreAway.team': away_team,
        }

    if home_score is not None:
        data.update({'scoreHome.score': home_score})
    if away_score is not None:
        data.update({'scoreAway.score': away_score})

    self.ballin_db.matchv2.update_one({'matchId': data['matchId'], 'country': data['country']}, {'$set': data}, upsert=True)

