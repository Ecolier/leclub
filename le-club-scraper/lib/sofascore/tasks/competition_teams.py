import time
import random
from datetime import datetime

from .team import team as scrap_team
from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask

class Task(ScrapDatabaseTask, ApiTask):
    pass

@app.task(bind=True, base=Task, ignore_result=True, rate_limit="300/m")
def competition_teams(self, cp_scope, cp_slug, cp_id):
    seasons = self.api.competition_seasons(cp_scope, cp_slug, cp_id)
    for season in seasons[:1]:
        teams = self.api.competition_teams(cp_id, season['id'])
        for team in teams:
            scrap_team.delay(team['slug'], team['id'])
