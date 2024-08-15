import time
import random
from datetime import datetime

from ...celery import app
from ...ballin_db_task import BallinDatabaseTask
from ...search_db_task import SearchDatabaseTask
from pymongo import UpdateOne

class Task(BallinDatabaseTask, SearchDatabaseTask):
    pass

@app.task(bind=True, base=Task, ignore_result=True)
def update_ballin_users(self):

    operations = []
    users_stats = self.ballin_db.userseasonstats.aggregate([
        # {'$match': {'season': '2019-2020'}},
        {'$lookup': {
            'from': 'users',
            'localField': 'user',
            'foreignField': '_id',
            'as': 'user'
            }},
        {'$unwind': '$user'},
        {'$lookup': {
            'from': 'teams',
            'localField': 'team',
            'foreignField': '_id',
            'as': 'team'
            }},
        {'$unwind': '$team'},
        ])

    for user_stat in users_stats:
        print(user_stat['team'])
        if 'user' not in user_stat or 'team' not in user_stat:
            continue
        user = user_stat['user']
        team = user_stat['team']
        data = {
            '_id': user.get('_id'),
            'name': user.get('completeName'),
            'picture': user.get('picture'),
            'team': team.get('name'),
            'division': team.get('division'),
            'level': team.get('level'),
            }
        operations.append(UpdateOne({'_id': data['_id']}, {'$set': data}, upsert=True))
    if len(operations) > 0:
        self.search_db.users.bulk_write(operations)
