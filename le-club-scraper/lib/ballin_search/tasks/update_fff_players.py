import time
import random
from datetime import datetime

from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from ...search_db_task import SearchDatabaseTask
from pymongo import UpdateOne

PLAYER_GENDER = {
    'M': 0,
    'F': 1,
    }

PLAYER_POSITION_BY_NUMBER = {
    1: ['GK'],
    2: ['DR'],
    3: ['DL'],
    4: ['DC'],
    5: ['DC'],
    6: ['DM', 'MC', 'ML'],
    7: ['RW'],
    8: ['DM', 'MC', 'MR'],
    9: ['ST'],
    10: ['AM'],
    11: ['LW']
    }

class Task(ScrapDatabaseTask, SearchDatabaseTask):
    pass

@app.task(bind=True, base=Task, ignore_result=True)
def update_fff_players(self):
    player_ids = self.scrap_db.fff_players.distinct('id')
    for player_id in player_ids:
        update_fff_player.delay(player_id)

@app.task(bind=True, base=Task, ignore_result=True)
def update_fff_player(self, player_id):
    player = self.scrap_db.fff_players.find_one({'id': player_id})
    club = self.scrap_db.fff_clubs.find_one({'scl': str(player['clubId'])}, {'name': 1, 'country': 1, 'affiliateId': 1})
    data = {
            '_id': str(player['id']),
            'firstName': player.get('firstName'),
            'lastName': player.get('lastName') or player.get('tmpLastName'),
            'country': 'France',
            'positions': set(),
            'birthdate': player.get('birthdate'),
            'currentClub': {
                'name': club['name'],
                'country': 'FR',
                'affiliateId': club['affiliateId'],
                },
            'gender': 2,
            'currentSeasonStats': {
                'teams': set(),
                'numbers': set(),
                'competitions': set(),
                'appearances': 0,
                'goals': 0,
                'minutesPlayed': 0,
                'captains': 0,
                'lineups': 0,
                'played': 0
                }
            }
    matches = self.scrap_db.fff_matches.find({'compositions.player.id': player['id']})
    for match in matches:
        in_evt = next(filter(lambda x: x.get('in') == player['id'], match['events']), None)
        out_evt = next(filter(lambda x: x.get('out') == player['id'], match['events']), None)

        player_sheet = next(filter(lambda x: x['player']['id'] == player['id'], match['compositions']))
        out_at = player_sheet['outAt'] or (match['regularTime'] + match['prologationTime'])
        have_played = player_sheet['lineup'] or in_evt is not None
        
        team = self.scrap_db.fff_teams.find_one({'teamId': player_sheet['teamId']}, {'name': 1, 'category': 1, 'gender': 1})
        if team is None:
            continue

        if have_played:
            data['currentSeasonStats']['minutesPlayed'] += out_at - player_sheet['inAt']
            data['currentSeasonStats']['goals'] += len(player_sheet['goals'])
            data['currentSeasonStats']['captains'] += 1 if player_sheet['capitain'] else 0
            data['currentSeasonStats']['played'] += 1

        data['currentSeasonStats']['lineups'] += 1 if player_sheet['lineup'] else 0
        data['currentSeasonStats']['appearances'] += 1
        data['currentSeasonStats']['numbers'].add(player_sheet['number'])
        data['currentSeasonStats']['teams'].add('{} - {}'.format(team['name'], team['category']))
        data['currentSeasonStats']['competitions'].add(match['competition']['name'])
        data['gender'] = PLAYER_GENDER.get(team['gender'], 2)

        if 'birthdate' in player_sheet['player'] and player_sheet['player']['birthdate'] is not None:
            data['birthdate'] = player_sheet['player']['birthdate']

        for position in PLAYER_POSITION_BY_NUMBER.get(player_sheet['number'], []):
            data['positions'].add(position)

    data['positions'] = list(data['positions'])
    data['currentSeasonStats']['numbers'] = list(data['currentSeasonStats']['numbers'])
    data['currentSeasonStats']['teams'] = list(data['currentSeasonStats']['teams'])
    data['currentSeasonStats']['competitions'] = list(data['currentSeasonStats']['competitions'])

    if data['birthdate'] is not None:
        data['birthdate'] = float(data['birthdate']) * 1000

    self.search_db.fff_players.update_one({'_id': data['_id']}, {'$set': data}, upsert=True)
