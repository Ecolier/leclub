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
def update_fff_clubs(self):
    clubs = self.scrap_db.fff_clubs.find({})
    operations = []
    for club in clubs:
        data = {
                'affiliateId': club.get('affiliateId'),
                'department': club.get('department'),
                'name': club.get('name'),
                'region': club.get('region'),
                'scl': club.get('scl'),
                }
        operations.append(UpdateOne({'country': 'FR', 'affiliateId': data['affiliateId']}, {'$set': data}, upsert=True))
    if len(operations) > 0:
        self.ballin_db.clubs.bulk_write(operations)
