import time
import random
from datetime import datetime

from pymongo import MongoClient

ballin_db = MongoClient('mongodb://mongodb:27017').test

COMPETITIONS_TYPES = {
        'CHAMPIONSHIP': 'CHP',
        'CUP': 'CUP'
        }

valid_teams = ballin_db.teams.find({'country': 'BE', 'competitions': { '$exists': True }})[:1000]
for team in valid_teams:
    competitions = team['competitions']
    for cp in competitions:
        cp_id = "{}_{}".format(COMPETITIONS_TYPES.get(cp['type']), cp['id'])
        old_teams = ballin_db.teams.distinct('_id', { 'competitionId': cp_id, 'affiliateId': team['affiliateId'] })
        print(old_teams)
