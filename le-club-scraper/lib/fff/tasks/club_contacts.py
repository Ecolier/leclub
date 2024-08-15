import time
import random
from datetime import datetime

from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask

class Task(ScrapDatabaseTask, ApiTask):
    def on_success(self, contacts, task_id, args, kwargs):
        club_scl = args[0]
        self.scrap_db.fff_clubs.update_one({'scl': str(club_scl)}, {'$set': {'contacts': contacts}})

@app.task(bind=True, base=Task, ignore_result=True, rate_limit="30/m")
def club_contacts(self, club_scl):
    contacts = []
    for contact in self.scrap_api.club_contacts(club_scl):
        contacts.append(contact)
    return contacts
