import requests_cache
from pymongo import MongoClient

from .const import API_ENDPOINT
from .oauth import FFFApiOauth

ONE_DAY = 60*60*24
SIX_DAY = ONE_DAY*6

class FFFApi:
    def __init__(self, username, password):
        self._oauth = FFFApiOauth(username, password)
        self._http = requests_cache.CachedSession('requests-cache', backend="mongodb", expire_after=SIX_DAY, connection=MongoClient('mongodb://mongodb:27017/'))
        self._match_http = requests_cache.CachedSession('requests-cache', backend="mongodb", expire_after=SIX_DAY, connection=MongoClient('mongodb://mongodb:27017/'))

        # TODO: On token refresh, refresh this too
        self._http.headers.update(dict(Authorization=self._oauth.access_token))
        self._match_http.headers.update(dict(Authorization=self._oauth.access_token))

    def player_stat(self, cp_id, team_id, p_license, p_id):
        return self._http.get(f"{API_ENDPOINT}/api/joueur/stats/{cp_id}/{team_id}/{p_license}/{p_id}.json").json()

    def competition_matches(self, cp_id, cp_stage):
        return self._http.get(f"{API_ENDPOINT}/api/competition/calendrier/resultats/{cp_id}/{cp_stage}.json").json()

    def clubs(self):
        return self._http.get(f"{API_ENDPOINT}/api/clubs.json?query=").json()

    def teams(self, club_id, season):
        return self._http.get(f"{API_ENDPOINT}/api/club/{club_id}/{season}/teams.json").json()

    def team_players(self, team_id):
        return self._http.get(f"{API_ENDPOINT}/api/players/{team_id}.json").json()

    def team_agenda(self, team_id, date_start, date_end):
        return self._http.get(f"{API_ENDPOINT}/api/plannings/{team_id}/{date_start}/{date_end}.json").json()

    def match(self, match_id):
        return self._match_http.get(f"{API_ENDPOINT}/api/matchs/match/{match_id}.json").json()
    
    def team(self, needle):
        return self._http.get(f"{API_ENDPOINT}/api/teams/{needle}.json").json()

    def match_goals(self, match_id):
        return self._http.get(f"{API_ENDPOINT}/api/match/{match_id}/goals.json").json()

    def club(self, club_id):
        results = self._http.get(f"{API_ENDPOINT}/api/club/{club_id}.json").json()
        return results[0] if len(results) > 0 else None
    
    def player_details(self, player_id, club_id):
        teams = self.teams(club_id, '2019')
        for team in teams:
            players = team.get('last_match', {}).get('match_feuille', {}).get('match_feuille_compo', [])
            for player in players:
                if player.get('in_no') == player_id:
                    return player
