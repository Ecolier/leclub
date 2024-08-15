import time
import random
from datetime import datetime

from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from pymongo import UpdateOne

class Task(ScrapDatabaseTask, ApiTask):
    def on_success(self, match, task_id, args, kwargs):
        match['_id'] = match.pop('id')
        self.scrap_db.rbfa_matches.update_one({'_id': match['_id']}, {'$set': match}, upsert=True)

@app.task(bind=True, base=Task, ignore_result=True)
def match_details(self, match_id):
    return self.api.match(match_id)
