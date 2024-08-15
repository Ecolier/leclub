import time
import random
from datetime import datetime

from .update_rbfa_team import update_rbfa_team
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from pymongo import UpdateOne

class Task(ScrapDatabaseTask):
    pass

@app.task(bind=True, base=Task, ignore_result=True)
def update_rbfa_teams(self):
    teams_ids = self.scrap_db.rbfa_teams.distinct('_id', {'clubId': {'$ne': None}})
    for team_id in teams_ids:
        update_rbfa_team.delay(team_id)
