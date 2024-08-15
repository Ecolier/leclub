import time
import random
from datetime import datetime

from .match_details import match_details
from ..ApiTask import ApiTask
from ...celery import app

@app.task(bind=True, base=ApiTask, ignore_result=True)
def team_matches(self, team_id):
    agenda = self.api.team_agenda(team_id, 0, 0)
    matches = list()

    # when team has no agenda, response is an empty array instead of an object
    if isinstance(agenda, list):
        return []

    for month_events in agenda.get('events', []):
        for event in month_events.get('events', []):
            if event.get('event_type') != 'match':
                continue
            match = event.get('match')
            match_details.delay(match['ma_no'])


