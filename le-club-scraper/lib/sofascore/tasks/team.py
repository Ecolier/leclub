import time
import random
from datetime import datetime

from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask

class Task(ScrapDatabaseTask, ApiTask):
    def on_success(self, team, task_id, args, kwargs):
        self.scrap_db.sofascore_teams.update_one({'_id': team['_id']}, {'$set': team}, upsert=True)

@app.task(bind=True, base=Task, ignore_result=True, rate_limit="5000/m")
def team(self, team_slug, team_id):
    return {
            '_id': team_id,
            'slug': team_slug,
            'informations': self.api.team_informations(team_id),
            'players': self.api.team_players(team_id),
            }
