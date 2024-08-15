import time
import random
from datetime import datetime

from pymongo import UpdateOne
from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask

class Task(ScrapDatabaseTask, ApiTask):
    def on_success(self, team, task_id, args, kwargs):
        self.scrap_db.soccerway_teams.update_one({'_id': team['_id']}, {'$set': team}, upsert=True)

@app.task(bind=True, base=Task, ignore_result=True, rate_limit="30/m")
def team(self, team_id):
    return {
            '_id': team_id,
            'informations': self.api.team_informations(team_id),
            'seasons': list(map(lambda x: x['id'], self.api.team_seasons(team_id)))
            }
