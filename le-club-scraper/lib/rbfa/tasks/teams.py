import time
import random
from datetime import datetime

from .competition_teams import competition_teams as scrap_competition_teams
from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from pymongo import UpdateOne

class Task(ScrapDatabaseTask):
    pass

@app.task(bind=True, base=Task, ignore_result=True)
def teams(self):
    competitions = self.scrap_db.rbfa_competitions.distinct('_id')
    for cp_id in competitions:
        scrap_competition_teams.delay(cp_id)
