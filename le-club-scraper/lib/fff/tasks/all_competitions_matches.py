import time
import random
from datetime import datetime

from .competition_matches import competition_matches
from ...scrap_db_task import ScrapDatabaseTask
from ...celery import app

@app.task(bind=True, base=ScrapDatabaseTask, ignore_result=True)
def all_competitions_matches(self):
    competitions = self.scrap_db.fff_matches.aggregate([
        {'$group': {
            '_id': {
                'id': '$competition.id',
                'stage': '$competition.stage',
                }
        }}
    ])
    for cp in competitions:
        cp = cp['_id']
        competition_matches.delay(cp['id'], cp['stage'])
