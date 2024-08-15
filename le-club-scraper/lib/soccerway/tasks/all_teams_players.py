import time
import random
from datetime import datetime

from pymongo import UpdateOne
from .team_players import team_players
from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask

class Task(ScrapDatabaseTask, ApiTask):
    pass

@app.task(bind=True, base=Task, ignore_result=True)
def all_teams_players(self):
    teams = self.scrap_db.soccerway_teams.find({"seasons.0":{"$exists": True}})
    for team in teams:
        for season in team['seasons'][:1]:
            team_players.delay(team['_id'], season)
