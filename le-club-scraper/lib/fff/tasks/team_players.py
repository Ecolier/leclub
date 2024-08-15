import time
import random
from datetime import datetime

from pymongo import UpdateOne
from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask

class Task(ScrapDatabaseTask, ApiTask):
    def on_success(self, players, task_id, args, kwargs):
        operations = []
        for player in players:
            data = {
                'id': player['in_no'],
                'license': player['li_no'],
                'firstName': player['in_prenom'],
                'tmpLastName': player['in_nom'],
                'clubId': player['cl_no'],
                'teamId': player['team_id']
                }
            operations.append(UpdateOne(dict(id=data['id']), {'$set': data}, upsert=True))
        if len(operations) > 0:
            self.scrap_db.fff_players.bulk_write(operations)


@app.task(bind=True, base=Task, ignore_result=True, rate_limit="100/m")
def team_players(self, team_id):
    return self.api.team_players(team_id)

