import time
import re
import random
from datetime import datetime

from .create_player_index import create_soccerway_player_index
from .create_player_index import create_sofascore_player_index
from .create_player_index import create_tmkt_player_index

from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from pymongo import UpdateOne, InsertOne

class Task(ScrapDatabaseTask):
    pass

@app.task(bind=True, base=Task, ignore_result=True)
def create_players_indexes(self):
    for player in self.scrap_db.soccerway_players.find():
        create_soccerway_player_index.delay(player['_id'])
    for player in self.scrap_db.sofascore_players.find():
        create_sofascore_player_index.delay(player['_id'])
    for player in self.scrap_db.tmkt_players.find():
        create_tmkt_player_index.delay(player['_id'])
