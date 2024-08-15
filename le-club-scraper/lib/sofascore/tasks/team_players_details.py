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
def team_players_details(self, team_id):
    team = self.scrap_db.sofascore_teams.find_one({'_id': team_id})
    for player in team.get('players', []):
        player_details.delay(player['id'])
