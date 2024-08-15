import time
import random
from datetime import datetime

from pymongo import UpdateOne
from .team_details import team_details
from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask

class Task(ScrapDatabaseTask, ApiTask):
    def on_success(self, competitions, task_id, args, kwargs):
        pass

@app.task(bind=True, base=Task, ignore_result=True)
def competition_teams(self, slug, name_abbr):
    seasons = self.api.competition_seasons(slug, name_abbr)
    for season in seasons[0:1]:
        teams = self.api.competition_teams(slug, name_abbr, season['id'])
        for team in teams:
            team_details.delay(team['club_id'])
