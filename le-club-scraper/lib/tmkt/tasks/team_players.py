import time
import random
from datetime import datetime

from .player_details import player_details
from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask

class Task(ScrapDatabaseTask, ApiTask):
    def on_success(self, competitions, task_id, args, kwargs):
        pass

@app.task(bind=True, base=Task, ignore_result=True)
def team_players(self, team_id, season_id):
    for player in self.api.team_players(team_id, season_id):
        player_details.delay(player['id'])
