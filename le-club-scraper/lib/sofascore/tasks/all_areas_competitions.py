import time
import random
from datetime import datetime

from .area_competitions import area_competitions
from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask

class Task(ScrapDatabaseTask, ApiTask):
    pass

@app.task(bind=True, base=Task, ignore_result=True, rate_limit="30/m")
def all_areas_competitions(self):
    areas = self.scrap_db.sofascore_areas.find()
    for area in areas:
        area_competitions.delay(area['_id'])
