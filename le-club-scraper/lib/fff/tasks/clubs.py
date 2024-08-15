import time
import random
from datetime import datetime

from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from pymongo import UpdateOne

class Task(ScrapDatabaseTask, ApiTask):
    def on_success(self, clubs, task_id, args, kwargs):
        operations = []
        for club in clubs:
            operations.append(UpdateOne({'affiliateId': club['affiliateId']}, {'$set': club}, upsert=True))
        if len(operations) > 0:
            self.scrap_db.fff_clubs.bulk_write(operations)

@app.task(bind=True, base=Task, ignore_result=True)
def clubs(self):
    clubs = []
    for club in self.api.clubs():
        clubs.append({
            'affiliateId': str(club['cl_cod']),
            'scl': str(club['cl_no']),
            'name': club['cl_nom'],
            'region': club.get('cg_nom_supp'),
            'department': club.get('cg_nom'),
            })
    return clubs
