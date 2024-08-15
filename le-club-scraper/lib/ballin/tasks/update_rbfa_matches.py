import time
import random
from datetime import datetime

from .update_rbfa_match import update_rbfa_match
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from pymongo import UpdateOne

class Task(ScrapDatabaseTask):
    pass

@app.task(bind=True, base=Task, ignore_result=True)
def update_rbfa_matches(self):
    ids = self.scrap_db.rbfa_matches.distinct('_id')
    for match_id in ids:
        update_rbfa_match.delay(match_id)
