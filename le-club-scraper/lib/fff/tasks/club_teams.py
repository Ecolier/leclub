import time
import random
from datetime import datetime

from ..ApiTask import ApiTask
from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask

class Task(ScrapDatabaseTask, ApiTask):
    def on_success(self, result, task_id, args, kwargs):
        club = result.get('club')
        for team in result.get('teams'):
            data = {
                    'teamId': team['team_id'],
                    'clubId': club['cl_no'],
                    'name': team['eq_nom_ligue'],
                    'category': team['lc_lib'],
                    'country': 'FR',
                    'teamNo': team['eq_no'],
                    'teamCod': team['eq_cod'],
                    'type': team['tl_cod'],
                    'gender': team['lc_sexe'],
                    }
            self.scrap_db.fff_teams.update_one(dict(teamId=data['teamId']), {'$set': data}, upsert=True)

@app.task(bind=True, base=Task, ignore_result=True, rate_limit="1000/h")
def club_teams(self, club, season):
    if not isinstance(club, dict):
        club_id = club
        club = self.api.club(club_id)
        if club is None:
            raise Exception(f"Unable to find club with id: {club_id}")
    return dict(
            club=club,
            teams=self.api.teams(club['cl_no'], season)
            )
