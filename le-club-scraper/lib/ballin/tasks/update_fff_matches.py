import time
import random
from datetime import datetime

from .update_fff_match import update_fff_match
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from pymongo import UpdateOne

class Task(ScrapDatabaseTask):
    pass

@app.task(bind=True, base=Task, ignore_result=True)
def update_fff_matches(self):
    matches = self.scrap_db.fff_matches.find({}, {'_id': 1})
    for match in matches:
        update_fff_match.delay(match['_id'])
