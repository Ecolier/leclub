import time
import random
from datetime import datetime

from pymongo import UpdateOne
from .player import player as scrap_player
from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask

class Task(ScrapDatabaseTask, ApiTask):
    pass

@app.task(bind=True, base=Task, ignore_result=True, rate_limit="5000/m")
def team_players(self, team_id, season_id):
    players = self.api.team_players(team_id, season_id)
    for player in players:
        scrap_player.delay(player)
