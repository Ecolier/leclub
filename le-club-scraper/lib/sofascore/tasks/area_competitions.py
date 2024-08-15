import time
import random
from datetime import datetime

from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from pymongo import UpdateOne

class Task(ScrapDatabaseTask, ApiTask):
    def on_success(self, competitions, task_id, args, kwargs):        
        operations = []
        for competition in competitions:
            competition['_id'] = competition.pop('id')
            operations.append(UpdateOne({'_id': competition['_id']}, {'$set': competition}, upsert=True))
        if len(operations) > 0:
            self.scrap_db.sofascore_competitions.bulk_write(operations)


@app.task(bind=True, base=Task, ignore_result=True, rate_limit="30/m")
def area_competitions(self, area_id):
    return self.api.area_competitions(area_id)
