import time
import random
from datetime import datetime

from .club_teams import club_teams
from ..ApiTask import ApiTask
from ...celery import app

@app.task(bind=True, base=ApiTask, ignore_result=True)
def all_club_teams(self, season):
    for club in self.api.clubs():
        club_teams.delay(club, season)

