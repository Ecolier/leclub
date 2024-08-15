import time
import random
from datetime import datetime

from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from pymongo import UpdateOne

class Task(ScrapDatabaseTask, ApiTask):
    def on_success(self, competitions, task_id, args, kwargs):
        operations = []
        for cp in competitions:
            cp['_id'] = cp.pop('id')
            operations.append(UpdateOne({'_id': cp['_id']}, {'$set': cp}, upsert=True))
        if len(operations) > 0:
            self.scrap_db.rbfa_competitions.bulk_write(operations)

@app.task(bind=True, base=Task, ignore_result=True)
def competitions(self):
    return self.api.competitions()
