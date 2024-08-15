import time
import random
from datetime import datetime

from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from ...ballin_db_task import BallinDatabaseTask
from pymongo import UpdateOne

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


class Task(ScrapDatabaseTask, BallinDatabaseTask):
    def get_club(self, scl):
        club = self.ballin_db.clubs.find_one({'scl': str(scl)})
        if club is None:
            raise Exception(f"Unable to find club with scl: {scl}")
        return club

    def get_team(self, team_id):
        team = self.ballin_db.teams.find_one({'teamId': team_id})
        if team is None:
            raise Exception(f"Unable to find team with id: {team_id}")
        return team

    def get_match(self, match_id):
        match = self.ballin_db.matchv2.find_one({'matchId': str(match_id)})
        if match is None:
            raise Exception(f"Unable to find match with id: {match_id}")
        return match

@app.task(bind=True, base=Task, ignore_result=True)
def update_fff_matches_players_sheets(self, match_id):
    match_ids = self.scrap_db.fff_matches.distinct('_id', {'compositions.0': { '$exists': True }})
    for match_id in match_ids:
        update_fff_match_players_sheets.delay(match_id)

@app.task(bind=True, base=Task, ignore_result=True)
def update_fff_match_players_sheets(self, match_id):
    fff_match = self.scrap_db.fff_matches.find_one({'_id': match_id})
    if fff_match is None:
        raise Exception(f'There is no match with id: {match_id}')

    sheets = fff_match.get('compositions', [])
    if len(sheets) == 0:
        raise Exception(f'There is no player sheets for match with id: {match_id}')

    operations = []

    ballin_match = self.get_match(match_id)
    ballin_home_club = self.get_club(fff_match['home']['id'])
    ballin_home_team = self.get_team(fff_match['home']['team'])
    ballin_away_club = self.get_club(fff_match['away']['id'])
    ballin_away_team = self.get_team(fff_match['away']['team'])

    for sheet in sheets:
        is_home = sheet['teamId'] == fff_match['home']['team']

        in_evt = next(filter(lambda x: x.get('in') == sheet['player']['id'], fff_match['events']), None)
        out_evt = next(filter(lambda x: x.get('out') == sheet['player']['id'], fff_match['events']), None)

        out_at = sheet['outAt'] or (fff_match['regularTime'] + fff_match['prologationTime'])
        have_played = sheet['lineup'] or in_evt is not None
        time_played = out_at - sheet['inAt'] if have_played else 0

        update_filter = {
                'match': ballin_match['_id'],
                'player': sheet['player']['id'],
                }
        operations.append(UpdateOne(update_filter, { '$set': {
            'club': ballin_home_club['_id'] if is_home else ballin_away_club['_id'],
            'team': ballin_home_team['_id'] if is_home else ballin_away_team['_id'],
            'match': ballin_match['_id'],
            'player': str(sheet['player']['id']),
            'season': '2019-2020',
            'positions': PLAYER_POSITION_BY_NUMBER.get(sheet.get('number'), []),
            'assists': 0,
            'playerNumber': sheet.get('number'),
            'goals': len(sheet.get('goals', [])),
            'timePlayed': time_played,
            'inTime': sheet.get('inAt'),
            'outTime': out_at,
            'yellowCard': False,
            'secondYellowCard': False,
            'redCard': False,
            }}, upsert=True))

    if len(operations) > 0:
        self.ballin_db.fffplayersheets.bulk_write(operations)
