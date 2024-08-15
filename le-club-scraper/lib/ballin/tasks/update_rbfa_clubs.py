import time
import random
from datetime import datetime

from .update_fff_match import update_fff_match
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from ...ballin_db_task import BallinDatabaseTask
from pymongo import UpdateOne

class Task(ScrapDatabaseTask, BallinDatabaseTask):
    pass

@app.task(bind=True, base=Task, ignore_result=True)
def update_rbfa_clubs(self):
    clubs = self.scrap_db.rbfa_clubs.find({})
    operations = []
    for club in clubs:
        data = {
                'affiliateId': club.get('registrationNumber'),
                'department': 'LIGUE DE LA BELGIQUE',
                'region': 'LIGUE DE LA BELGIQUE',
                'name': club.get('name'),
                'scl': club.get('_id'),
                'isActive': True,
                'country': 'BE',
                }
        operations.append(UpdateOne({'country': 'BE', 'affiliateId': data['affiliateId']}, {'$set': data}, upsert=True))
    if len(operations) > 0:
        self.ballin_db.clubs.bulk_write(operations)
