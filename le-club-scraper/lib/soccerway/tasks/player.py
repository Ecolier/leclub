import time
import random
from datetime import datetime

from pymongo import UpdateOne
from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask

class Task(ScrapDatabaseTask, ApiTask):
    def on_success(self, player, task_id, args, kwargs):
        self.scrap_db.soccerway_players.update_one({'_id': player['_id']}, {'$set': player}, upsert=True)

@app.task(bind=True, base=Task, ignore_result=True, rate_limit="5000/m")
def player(self, player_id):
    return {
            '_id': player_id,
            'informations': self.api.player_informations(player_id),
            'transfers': self.api.player_transfers(player_id),
            'sidelines': self.api.player_sidelines(player_id),
            'trophies': self.api.player_trophies(player_id),
            'statistics': self.api.player_stats(player_id),
            }
