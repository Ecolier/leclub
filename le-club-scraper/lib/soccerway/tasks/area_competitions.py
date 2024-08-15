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
            competition['_id'] = competition.pop('id')
            operations.append(UpdateOne({'_id': competition['_id']}, {'$set': competition}, upsert=True))
        if len(operations) > 0:
            self.scrap_db.soccerway_competitions.bulk_write(operations)

@app.task(bind=True, base=Task, ignore_result=True)
def area_competitions(self, area_id):
    competitions = self.api.area_competitions(area_id)
    for competition in competitions:
        competition.update({
            'seasons': self.api.competition_seasons(competition['id'], competition['scope'])
            })
    return competitions
