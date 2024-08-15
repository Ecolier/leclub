import time
import random
from datetime import datetime

from .team_competitions import team_competitions as scrap_team_competitions
from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from pymongo import UpdateOne

@app.task(bind=True, base=ScrapDatabaseTask, ignore_result=True)
def all_teams_competitions(self):
    teams_ids = self.scrap_db.rbfa_teams.distinct('_id')
    for team_id in teams_ids:
        scrap_team_competitions.delay(team_id)
