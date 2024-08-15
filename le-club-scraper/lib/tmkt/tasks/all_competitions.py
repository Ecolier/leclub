import time
import random
from datetime import datetime

from .area_competitions import area_competitions
from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask

class Task(ScrapDatabaseTask, ApiTask):
    pass

@app.task(bind=True, base=Task, ignore_result=True)
def all_competitions(self):
    for area in self.api.areas():
        area_competitions.delay(area)
