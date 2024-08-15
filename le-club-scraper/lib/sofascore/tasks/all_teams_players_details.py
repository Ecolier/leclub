import time
import random
from datetime import datetime

from .player_details import player_details
from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask

class Task(ScrapDatabaseTask, ApiTask):
    pass

@app.task(bind=True, base=Task, ignore_result=True, rate_limit="30/m")
def all_teams_players_details(self):
    teams = self.scrap_db.sofascore_teams.find()
    for team in teams:
        for player in team.get('players', []):
            player_details.delay(player['id'])
