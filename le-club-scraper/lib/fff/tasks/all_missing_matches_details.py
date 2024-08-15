import random
from datetime import datetime

from .match_details import match_details
from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask

@app.task(bind=True, base=ScrapDatabaseTask, ignore_result=True)
def all_missing_matches_details(self):
    matches = self.scrap_db.fff_matches.distinct('_id', {
        'away.score': {
            '$eq': None
            },
        'date': {
            '$lt': datetime.utcnow()
            }
        })
    for match in matches:
        match_details.delay(match)

