import time
import random
from datetime import datetime

from .club import club as scrap_club
from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from pymongo import UpdateOne

class Task(ScrapDatabaseTask):
    pass

@app.task(bind=True, base=Task, ignore_result=True)
def clubs(self):
    clubs_ids = self.scrap_db.rbfa_teams.distinct('clubId', { 'clubId': { '$ne': None }})
    for club_id in clubs_ids:
        scrap_club.delay(club_id)
