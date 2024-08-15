import time
import random
from datetime import datetime

from pymongo import UpdateOne
from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask

class Task(ScrapDatabaseTask, ApiTask):
    def on_success(self, competitions, task_id, args, kwargs):
        operations = []
        for competition in competitions:
            operations.append(UpdateOne({
                'slug': competition['slug'],
                'country': competition['country']}, {'$set': competition}, upsert=True))
        self.scrap_db.tmkt_competitions.bulk_write(operations)

@app.task(bind=True, base=Task, ignore_result=True)
def area_competitions(self, area):
    return self.api.area_competitions(area)
