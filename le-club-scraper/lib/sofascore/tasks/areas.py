import time
import random
from datetime import datetime

from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from pymongo import UpdateOne

class Task(ScrapDatabaseTask, ApiTask):
    def on_success(self, areas, task_id, args, kwargs):        
        operations = []
        for area in areas:
            area['_id'] = area.pop('id')
            operations.append(UpdateOne({'_id': area['_id']}, {'$set': area}, upsert=True))
        if len(operations) > 0:
            self.scrap_db.sofascore_areas.bulk_write(operations)

@app.task(bind=True, base=Task, ignore_result=True, rate_limit="30/m")
def areas(self):
    return self.api.areas()
