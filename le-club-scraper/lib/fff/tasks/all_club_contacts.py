import time
import random
from datetime import datetime

from .club_contacts import club_contacts
from ..ApiTask import ApiTask
from ...celery import app

@app.task(bind=True, base=ApiTask, ignore_result=True, rate_limit="30/m")
def all_club_contacts(self):
    for club in self.scrap_db.fff_clubs.find():
        club_contacts.delay(club['scl'])

