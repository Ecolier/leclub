import time
import random
from datetime import datetime

from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask

class Task(ScrapDatabaseTask, ApiTask):
    def on_success(self, player, task_id, args, kwargs):
        self.scrap_db.tmkt_players.update_one({'_id': player['_id']}, {'$set': player}, upsert=True)

@app.task(bind=True, base=Task, ignore_result=True, rate_limit="500/m")
def player_details(self, player_id, slug):
    return {
            '_id': player_id,
            'informations': self.api.player_informations(player_id, slug),
            'market': self.api.player_market(player_id, slug),
            'transfers': self.api.player_transfers(player_id, slug),
            'positions': self.api.player_positions(player_id, slug),
            'club': self.api.player_club(player_id, slug),
            }
