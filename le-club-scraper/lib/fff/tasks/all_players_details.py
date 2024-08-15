import random
from datetime import datetime

from .player_details import player_details
from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask

@app.task(bind=True, base=ScrapDatabaseTask, ignore_result=True)
def all_players_details(self):
    players_ids = self.scrap_db.fff_players.distinct('id', {'lastName': {'$exists': False}})
    for player_id in players_ids:
        player_details.delay(player_id)
