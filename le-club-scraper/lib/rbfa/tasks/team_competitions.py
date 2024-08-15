import time
import random
from datetime import datetime

from .competition_teams import competition_teams as scrap_competition_teams
from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from pymongo import UpdateOne

class Task(ScrapDatabaseTask, ApiTask):
    def on_success(self, data, task_id, args, kwargs):
        self.scrap_db.rbfa_teams.update_one({'_id': data['team_id']}, {'$set': {'competitions': data['competitions']}})

@app.task(bind=True, base=Task, ignore_result=True)
def team_competitions(self, team_id):
    return {
            'team_id': team_id,
            'competitions': self.api.team_competitions(team_id)
            }
