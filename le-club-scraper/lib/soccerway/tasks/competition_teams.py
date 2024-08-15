import time
import random
from datetime import datetime

from pymongo import UpdateOne
from .team import team as scrap_team
from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask

class Task(ScrapDatabaseTask, ApiTask):
    pass

@app.task(bind=True, base=Task, ignore_result=True, rate_limit="30/m")
def competition_teams(self, cp_id, season_id):
    teams = self.api.competition_teams(cp_id, season_id)
    for team in teams:
        scrap_team.delay(team['id'])
