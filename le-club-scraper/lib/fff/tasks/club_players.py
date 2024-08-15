import time
import random
from datetime import datetime

from .team_players import team_players
from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask

class Task(ScrapDatabaseTask, ApiTask):
    def on_success(self, players, task_id, args, kwargs):
        pass

@app.task(bind=True, base=Task, ignore_result=True, rate_limit="30/m")
def club_players(self, club, season):
    if not isinstance(club, dict):
        club_id = club
        club = self.api.club(club_id)
        if club is None:
            raise Exception(f"Unable to find club with id: {club_id}")

    teams = self.api.teams(club['cl_no'], season)
    for team in teams:
        team_players.delay(team['team_id'])
