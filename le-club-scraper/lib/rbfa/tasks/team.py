import time
import random
from datetime import datetime

from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from pymongo import UpdateOne

class Task(ScrapDatabaseTask, ApiTask):
    def on_success(self, team, task_id, args, kwargs):
        team['_id'] = team.pop('id')
        self.scrap_db.rbfa_teams.update_one({'_id': team['_id']}, {'$set': team}, upsert=True)

@app.task(bind=True, base=Task, ignore_result=True)
def team(self, team_id):
    return self.api.team(team_id)
