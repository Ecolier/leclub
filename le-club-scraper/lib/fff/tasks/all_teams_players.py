import random
from datetime import datetime

from .team_players import team_players
from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask

@app.task(bind=True, base=ScrapDatabaseTask, ignore_result=True)
def all_teams_players(self):
    teams = self.scrap_db.fff_teams.distinct('teamId')
    random.shuffle(teams)
    for team in teams:
        team_players.delay(team)

