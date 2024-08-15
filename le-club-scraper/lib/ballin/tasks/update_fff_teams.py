import time
import random
from datetime import datetime

from .update_fff_team import update_fff_team
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from pymongo import UpdateOne

class Task(ScrapDatabaseTask):
    pass

@app.task(bind=True, base=Task, ignore_result=True)
def update_fff_teams(self):
    teams = self.scrap_db.fff_teams.find({ 'teamId': { '$regex': '^2019' }}, {'teamId': 1})
    for team in teams:
        update_fff_team.delay(team['teamId'])
