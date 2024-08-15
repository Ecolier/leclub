import time
import random
import pandas as pd
from datetime import datetime

from pymongo import MongoClient

scrap_db = MongoClient('mongodb://mongodb:27017/').scrapping

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

matches = scrap_db.fff_matches.find({'compositions.0': { '$exists': True }})[0:10000]
data = []
for match in matches:
    sheets = match.get('compositions', [])
    
    home_team = scrap_db.fff_teams.find_one({'teamId': match['home']['team']})
    away_team = scrap_db.fff_teams.find_one({'teamId': match['away']['team']})

    for sheet in sheets:
        is_home = sheet['teamId'] == match['home']['team']
        team = home_team if is_home else away_team

        if team is None:
            continue

        in_evt = next(filter(lambda x: x.get('in') == sheet['player']['id'], match['events']), None)
        out_evt = next(filter(lambda x: x.get('out') == sheet['player']['id'], match['events']), None)

        out_at = sheet['outAt'] or (match['regularTime'] + match['prologationTime'])
        have_played = sheet['lineup'] or in_evt is not None
        time_played = out_at - sheet['inAt'] if have_played else 0

        data.append({
            'match_id': match['_id'],
            'match_date': match['date'],
            'season': '2019-2020',
            'home_score': match['home']['score'],
            'away_score': match['away']['score'],
            'competition_name': match['competition']['name'],
            'competition_type': match['competition']['type'],
            'player_id': sheet['player']['id'],
            'player_year': pd.Timestamp(sheet['player'].get('birthdate'),  unit='s').year,
            'player_team': team['name'],
            'player_team_home': is_home,
            'player_team_visitor': is_home == False,
            'player_goals': len(sheet['goals']),
            'player_position': PLAYER_POSITION_BY_NUMBER.get(sheet['number']),
            'player_number': sheet['number'],
            'player_capitain': sheet['capitain'],
            'player_min_played': time_played,
            'player_in_at': sheet['inAt'],
            'player_out_at': out_at,
            })
        # print(out_at, sheet['inAt'])

df = pd.DataFrame(data=data)
df.to_csv('/tmp/players_sheets.csv')
