import time
import random
from datetime import datetime

from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from pymongo import UpdateOne

class Task(ScrapDatabaseTask, ApiTask):
    def on_success(self, matches, task_id, args, kwargs):
        operations = []
        last_week = 0
        day = 0
        for match in matches:
            match_date = self.convert_date(match['startDate'])
            if match_date is None:
                continue

            match_week = match_date.strftime('%V')
            if match_week != last_week:
                day = day + 1
                last_week = match_week

            match['_id'] = match.pop('id')
            match['startDate'] = match_date
            match['day'] = day
            operations.append(UpdateOne({'_id': match['_id']}, {'$set': match}, upsert=True))
        if len(operations) > 0:
            self.scrap_db.rbfa_matches.bulk_write(operations)

    def convert_date(self, date_str):
        try:
            return datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%S')
        except:
            return None

@app.task(bind=True, base=Task, ignore_result=True)
def competition_matches(self, cp_id):
    return self.api.competition_calendar(cp_id, '2019/01/01', '2020/12/31')
