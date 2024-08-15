import time
import random
from datetime import datetime

from .competition_teams import competition_teams as scrap_competition_teams
from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from pymongo import UpdateOne

class Task(ScrapDatabaseTask, ApiTask):
    def on_success(self, club, task_id, args, kwargs):
        club['_id'] = club.pop('id')
        self.scrap_db.rbfa_clubs.update_one({'_id': club['_id']}, {'$set': club}, upsert=True)

@app.task(bind=True, base=Task, ignore_result=True)
def club(self, club_id):
    return self.api.club(club_id)
