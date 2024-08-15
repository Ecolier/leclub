import time
import random
from datetime import datetime

from pymongo import UpdateOne
from .competition_teams import competition_teams
from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask

class Task(ScrapDatabaseTask, ApiTask):
    def on_success(self, competitions, task_id, args, kwargs):
        pass

@app.task(bind=True, base=Task, ignore_result=True)
def all_competitions_teams(self):
    competitions = self.scrap_db.tmkt_competitions.find()
    for cp in competitions:
        competition_teams.delay(cp['slug'], cp['name_abbr'])
