import requests_cache
from pymongo import MongoClient
import json

from .const import CP_DISCIPLINES, CP_COMMITTEES, CP_TYPES

API_ENDPOINT = "https://datalake-prod2018.rbfa.be/graphql"
ONE_DAY = 60*60*24
SIX_DAY = ONE_DAY*6

class RBFAApi:
    def __init__(self):
        self._http = requests_cache.CachedSession('requests-cache', backend='mongodb', expire_after=SIX_DAY, connection=MongoClient('mongodb://mongodb:27017/'))

    def graphql_call(self, operationName, variables, sha256hash):
        params={
            'operationName': operationName,
            'variables': json.dumps(variables),
            'extensions': json.dumps({
                'persistedQuery': {
                    'version': 1,
                    'sha256Hash': sha256hash
                    }
                })
            }
        return self._http.get(API_ENDPOINT, params=params)

    def match(self, match_id):
        variables = {
                'matchId': str(match_id),
                'language': 'fr'
                }
        return self.graphql_call('GetMatchDetail', variables, '3d062f922cd15e587e0880d3c55f88b72576d766a8d2051a5e722618e5ae69b8').json().get('data', {}).get('matchDetail', {})

    def club(self, club_id):
        variables = {
                'clubId': str(club_id),
                'language': 'fr'
                }
        return self.graphql_call('getClubInfo', variables, 'e882264b79eaabb7f66f94101fc81921565fa9496ea0c9604e8c6115b83a527a').json().get('data', {}).get('clubInfo', {})

    def team(self, team_id):
        variables = {
                'teamId': str(team_id),
                'language': 'fr'
                }
        return self.graphql_call('GetTeam', variables, '66888f01d376a6484c0c6824e5f266cb3c3513ab83964e50e0a7c30b8fddb4fa').json().get('data', {}).get('team', {})

    def club_teams(self, club_id):
        variables = {
                'clubId': str(club_id),
                'language': 'fr'
                }
        return self.graphql_call('getClubTeams', variables, 'd44e19259679780fe6932644072463997cfe60b66c223d8ba1f53430b0671728').json().get('data', {}).get('clubTeams', [])

    def team_competitions(self, team_id):
        variables = {
                'teamId': str(team_id),
                'language': 'fr'
                }
        competitions = self.graphql_call('getSeriesAndRankingsQuery', variables, 'ac1d225e713827feea3013deb89bff2740c3c623079807f36374212eb92ea285').json().get('data', {}).get('teamSeriesAndRankings', {}).get('series', []) or []
        return list(map(lambda x: {'id': x['serieId'], 'name': x['name']}, competitions))

    def competition(self, discipline, committee, cp_type):
        variables = {
                'discipline': discipline,
                'committee': committee,
                'competitionType': cp_type,
                'language': 'fr'
                }
        competitions = self.graphql_call('competitions', variables, '30393c7834e50a35ab831b209f71fcd8042db30bd27b57351369a1971b60e8ad').json().get('data', {}).get('competitions', []) or []
        return list(map(lambda x: {'id': x['id'], 'name': x['name'], 'discipline': discipline, 'committee': committee, 'competitionType': cp_type}, competitions))

    def competitions(self):
        competitions = []
        for discipline in CP_DISCIPLINES:
            for committee in CP_COMMITTEES:
                for cp_type in CP_TYPES:
                    competitions = competitions + self.competition(discipline, committee, cp_type)
        return competitions

    def competition_teams(self, cp_id):
        variables = {
                'seriesId': str(cp_id),
                'language': 'fr'
                }
        return self.graphql_call('getTeamsInSeries', variables, 'a31fcc0a45a6befd65be51e1ad601826c2a0bed717d22a60c12c2a5bcf8322da').json().get('data', {}).get('teamsInSeries', []) or []
    
    def competition_calendar(self, cp_id, start_date, end_date):
        variables = {
                'seriesId': cp_id,
                'startDate': start_date,
                'endDate': end_date,
                'language': 'fr'
                }
        return self.graphql_call('GetSeriesCalendar', variables, 'f43cd7dc3195486875f9d663e38396bdbd64e36af5d71d4e4db90435b45df721').json().get('data', {}).get('seriesCalendar', []) or []

# api = RBFAApi()
# print(api.club(2909))
# print(json.dumps(api.club_teams(2541)))
# print(api.team_competitions(155434))
# print(api.competition(CP_DISCIPLINES[0], CP_COMMITTEES[0], CP_TYPES[0]))
# print(api.competitions())
# print(json.dumps(api.competition_calendar('CUP_2118', '2019/01/01', '2020/12/31')))
# print(json.dumps(api.competition_teams('CHP_83631')))
# print(json.dumps(api.team('158242')))
# print(json.dumps(api.competition_teams('CUP_1930')))
# print(api.competition_calendar('CUP_2125', '2019/01/01', '2020/12/31'))
