import re
import json
import requests_cache
from pymongo import MongoClient
from datetime import datetime
from bs4 import BeautifulSoup
from ..scrapoxy.scrapoxy import Scrapoxy

ONE_DAY = 60*60*24
SIX_DAY = ONE_DAY*6

# safe parse int
def safeint(s):
    try:
        return int(s)
    except:
        return 0

class SofascoreApi:
    def __init__(self):
        http_client = requests_cache.CachedSession('requests-cache', backend="mongodb", expire_after=SIX_DAY, connection=MongoClient('mongodb://mongodb:27017/'))
        http_client.headers = {
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Brave Chrome/80.0.3987.163 Safari/537.36'
                }

        self._scrapoxy = Scrapoxy(http_client)
    
    def __club_data_from_link(self, link):
        link_data_re = re.compile(r"\/team\/football\/(.+)\/(.+)")
        matches = link_data_re.match(link)
        return {
                'slug': matches.group(1),
                'id': safeint(matches.group(2)),
                }

    def areas(self):
        data = self._scrapoxy.get('https://api.sofascore.com/api/v1/sport/football/categories').json()
        areas = []
        for category in data.get('categories', []):
            areas.append({
                'id': category.get('id'),
                'slug': category.get('slug'),
                'label': category.get('name'),
                })
        return areas
    
    def area_competitions(self, cat_id):
        data = self._scrapoxy.get(f'https://api.sofascore.com/api/v1/category/{cat_id}/unique-tournaments').json()
        competitions = []
        for group in data.get('groups', []):
            for tournament in group.get('uniqueTournaments'):
                competitions.append({
                    'id': tournament.get('id'),
                    'category_id': cat_id,
                    'slug': tournament.get('slug'),
                    'scope': tournament.get('category', {}).get('slug'),
                    'label': tournament.get('name'),
                    })
        return competitions

    def competition_seasons(self, scope, slug, cp_id):
        data = self._scrapoxy.get(f'https://api.sofascore.com/api/v1/unique-tournament/{cp_id}/seasons').json()

        seasons = []
        for season in data.get('seasons', []):
            seasons.append({
                'id': season.get('id'),
                'label': season.get('year')
                })
        return seasons

    def competition_teams(self, cp_id, season_id):
        data = self._scrapoxy.get(f'https://api.sofascore.com/api/v1/unique-tournament/{cp_id}/season/{season_id}/standings/total').json()
        teams = []
        for standing in data.get('standings', []):
            for row in standing.get('rows', []):
                team = row['team']
                teams.append({
                    'id': team['id'],
                    'name': team['name'],
                    'gender': team['gender'],
                    'national': team['national'],
                    'slug': team['slug']
                    })
        return teams

    def team_informations(self, team_id):
        data = self._scrapoxy.get(f'https://api.sofascore.com/api/v1/team/{team_id}').json()
        team = data['team']
        return {
                'name': team['name'],
                'country': team['country']['name'],
                'logo': f'https://api.sofascore.com/api/v1/team/{team_id}/image',
                'gender': team['gender']
                }
    
    def team_players(self, team_id):
        data = self._scrapoxy.get(f'https://api.sofascore.com/api/v1/team/{team_id}/players').json()
        players = []
        for player in data.get('players', []):
            players.append({
                'id': player['player']['id'],
                'slug': player['player']['slug'],
                'complete_name': player['player']['name'],
                })
        return players

    def player_club(self, player_id):
        data = self._scrapoxy.get(f'https://api.sofascore.com/api/v1/player/{player_id}').json()
        player = data['player']
        return {
                'id': player['team']['id'],
                'slug': player['team']['slug'],
                'name': player['team']['name']
                }

    def player_informations(self, player_id):
        data = self._scrapoxy.get(f'https://api.sofascore.com/api/v1/player/{player_id}').json()
        player = data['player']
        return {
                'id': player_id,
                'picture': f'https://www.sofascore.com/images/player/image_{player_id}.png',
                'complete_name': player.get('name'),
                'slug': player.get('slug'),
                'position': player.get('position'),
                'birthdate': player.get('dateOfBirthTimestamp'),
                'national': player['team']['national'],
                'height': player.get('height'),
                'shirt_number': player.get('shirt_number'),
                'preferred_foot': player.get('shirt_number'),
                }

    def player_attributes(self, player_id):
        data = self._scrapoxy.get(f'https://api.sofascore.com/api/v1/player/{player_id}/attribute-overviews').json()
        return data.get('averageAttributeOverviews', {})

    def player_positions(self, player_id):
        data = self._scrapoxy.get(f'https://api.sofascore.com/api/v1/player/{player_id}/characteristics').json()
        return data.get('positions', [])

    def player_transfers(self, player_id):
        data = self._scrapoxy.get(f'https://api.sofascore.com/api/v1/player/{player_id}/transfer-history').json()
        return data.get('transferHistory', [])

    def player_season_statistic(self, player_id, cp_id, season_id):
        data = self._scrapoxy.get(f'https://api.sofascore.com/api/v1/player/{player_id}/unique-tournament/{cp_id}/season/{season_id}/statistics/overall').json()
        return data.get('statistics', {})

    def player_statistics(self, player_id):
        data = self._scrapoxy.get(f'https://api.sofascore.com/api/v1/player/{player_id}/statistics/seasons').json()
        statistics = []
        tournaments = data.get('uniqueTournamentSeasons', [])
        for tournament in data.get('uniqueTournamentSeasons', []):
            tournament_data = tournament.get('uniqueTournament', {})
            cp_id = tournament_data['id']
            for season in tournament['seasons']:
                season_id = season.get('id')
                stats = self.player_season_statistic(player_id, cp_id, season_id)
                statistics.append({
                    'season': {
                        'id': season['id'],
                        'year': season['year'],
                        },
                    'tournament_id': tournament_data['id'],
                    'tournament_name': tournament_data['name'],
                    'averageRating': 0,
                    'statistics': stats,
                    })
        return statistics
