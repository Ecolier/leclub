import re
import time
import random
from datetime import datetime

from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask

class Task(ScrapDatabaseTask, ApiTask):
    pass

def safe_strdate_timestamp(strdate):
    try:
        d = datetime.fromisoformat(strdate)
        return int(d.timestamp())
    except:
        return None


@app.task(bind=True, base=Task, ignore_result=True, rate_limit="1000/m")
def player_details(self, player_id):
    player_id = int(player_id)
    player = self.scrap_db.fff_players.find_one({'id': player_id})
    if player is None:
        raise Exception(f'There is no player with id: {player_id}')

    player_details = self.api.player_details(player_id, player.get('clubId'))
    if player_details is not None:
        self.scrap_db.fff_players.update_one({"id": player_id}, {'$set': {
            'lastName': player_details.get('in_nom'),
            'birthdate': safe_strdate_timestamp(player_details.get('in_dat_nais'))
            }})

