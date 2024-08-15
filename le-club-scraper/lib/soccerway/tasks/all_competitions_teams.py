import time
import random
from datetime import datetime

from pymongo import UpdateOne
from .competition_teams import competition_teams
from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask

class Task(ScrapDatabaseTask, ApiTask):
    pass

@app.task(bind=True, base=Task, ignore_result=True)
def all_competitions_teams(self):
    competitions = self.scrap_db.soccerway_competitions.find()
    for competition in competitions:
        for season in competition['seasons'][:1]:
            competition_teams.delay(competition['_id'], season['id'])
