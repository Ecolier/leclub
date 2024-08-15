import time
import random
from datetime import datetime

from .team import team as scrap_team
from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from pymongo import UpdateOne

class Task(ScrapDatabaseTask, ApiTask):
    pass

@app.task(bind=True, base=Task, ignore_result=True)
def competition_teams(self, cp_id):
    teams = self.api.competition_teams(cp_id)
    for team in teams:
        scrap_team.delay(team['id'])
