import time
import random
from datetime import datetime

from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask

class Task(ScrapDatabaseTask, ApiTask):
    def on_success(self, team, task_id, args, kwargs):
        self.scrap_db.tmkt_teams.update_one({'_id': team['_id']}, {'$set': team}, upsert=True)

@app.task(bind=True, base=Task, ignore_result=True)
def team_details(self, team_id):
    seasons = self.api.team_seasons(team_id)
    return {
            '_id': team_id,
            'informations': self.api.team_informations(team_id),
            'seasons': seasons,
            'current_season_players': self.api.team_players(team_id, seasons[0]['id'])
            }