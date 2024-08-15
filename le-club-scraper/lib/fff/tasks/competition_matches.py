import time
import random
from datetime import datetime

from .match_details import match_details
from ..ApiTask import ApiTask
from ...celery import app

@app.task(bind=True, base=ApiTask, ignore_result=True)
def competition_matches(self, cp_id, cp_ph):
    data = self.api.competition_matches(cp_id, cp_ph)
    for day in data['match']:
        for group in data['match'][day]:
            for match_key in data['match'][day][group].keys():
                for match in data['match'][day][group][match_key]:
                    match_details.delay(match['ma_no'])
