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
def all_players_details(self):
    teams = self.scrap_db.tmkt_teams.find()
    for team in teams:
        players = team.get('current_season_players', [])
        for player in players:
            player_details.delay(player['id'], player['slug'])
