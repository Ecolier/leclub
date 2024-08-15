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
def update_ballin_clubs(self):
    operations = []
    for club in self.ballin_db.clubs.find():
        data = {
                '_id': club.get('_id'),
                'name': club.get('name'),
                'country': club.get('country'),
                'urlLogo': club.get('urlLogo'),
                'affiliateId': club.get('affiliateId'),
                }
        operations.append(UpdateOne({'_id': data['_id']}, {'$set': data}, upsert=True))
    if len(operations) > 0:
        self.search_db.clubs.bulk_write(operations)
