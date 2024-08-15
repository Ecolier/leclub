import re
import json
import requests_cache
from pymongo import MongoClient
from datetime import datetime
from bs4 import BeautifulSoup
from pymongo import MongoClient

ONE_DAY = 60*60*24
SIX_DAY = ONE_DAY*6

# safe parse int
def safeint(s):
    try:
        return int(s)
    except:
        return 0

class SoccerwayApi:
    def __init__(self):
        self._http = requests_cache.CachedSession('requests-cache', backend="mongodb", expire_after=SIX_DAY, connection=MongoClient('mongodb://mongodb:27017/'))
        self._http.headers = {
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko)'
                }
        self._http.proxies = {
                'http': 'http://tor:16379',
                'https': 'https://tor:16379',
                }

    def __team_id_from_link(self, link):
        reg = re.compile(r".+/(\d+)/$")
        matches = reg.match(link)
        if matches is not None:
            return safeint(matches.group(1))

    def __season_id_from_link(self, link):
        reg = re.compile(r"\/.+\/.+\/.+\/.+\/(.+)\/")
        matches = reg.match(link)
        if matches is not None:
            return int(matches.group(1)[1:])

    def __competition_details_from_link(self, link):
        competition_re = re.compile(r"\/(.+)\/(.+)\/.+\/(.+)\/")
        matches = competition_re.match(link)
        if matches is not None:
            return {
                'type': matches.group(1),
                'region': matches.group(2),
                'id': safeint(matches.group(3)[1:])
                }

    def areas(self):
        html = self._http.get(f'https://us.soccerway.com/competitions/').text
        soup = BeautifulSoup(html, features='html.parser')
        area_list = soup.find('ul', 'areas').find_all('li', 'expandable')
        areas = []
        for area_el in area_list:
            areas.append({
                'id': safeint(area_el.attrs.get('data-area_id')),
                'label': area_el.find('a').text.strip()
                })
        return areas

    def team_seasons(self, team_id):
        req = self._http.get(f'https://us.soccerway.com/teams/-/-/{team_id}/')
        soup = BeautifulSoup(req.text, features='html.parser')

        seasons = []
        season_select_el = soup.find('select', attrs={'name': 'season_id'})
        if season_select_el is None:
            return []
        for group_el in season_select_el.find_all('optgroup'):
            for season_el in group_el.find_all('option'):
                seasons.append({
                    'cp_label': group_el['label'],
                    'id': safeint(season_el['value']),
                    'label': season_el.text,
                    })
        return seasons

    def team_informations(self, team_id):
        html = self._http.get(f'https://us.soccerway.com/teams/-/-/{team_id}/').text
        soup = BeautifulSoup(html, features='html.parser')

        info_el = soup.find('div', id="page_team_1_block_team_info_6")
        informations = {}
        keys = map(lambda x: x.text.lower(), info_el.find_all('dt'))
        values = map(lambda x: x.text.strip(), info_el.find_all('dd'))
        for (key, value) in zip(keys, values):
            if key == 'address':
                value = value.replace('\n', ',')
                value = re.compile(r"\s+").sub(' ', value).strip()
            informations.update({key: value})

        informations.update({
            'logo': soup.find('img')['src'],
            'name': soup.find('div', id='subheading').find('h1').text,
            'gender': self.team_gender(team_id, informations['country'])
            })
        return informations    

    def team_gender(self, team_id, country):
        res = self._http.get(f'https://int.women.soccerway.com/teams/{country}/')
        soup = BeautifulSoup(res.text, 'html.parser')
        for team_el in soup.select('.competitions_tree a.item-link'):
            if team_id == self.__team_id_from_link(team_el['href']):
                return 'F'
        return 'M'

    def area_competitions(self, area_id):
        data = self._http.get('https://us.soccerway.com/a/block_competitions_index_club_domestic', params={
            'block_id': "page_competitions_1_block_competitions_index_club_domestic_4",
            'callback_params': json.dumps({
                'level': 2
            }),
            'action': 'expandItem',
            'params': json.dumps({
                'area_id': area_id,
                'level': 2,
                'item_key': 'area_id'
                })
            }).json()
        soup = BeautifulSoup(data['commands'][0]['parameters']['content'], features="html.parser")
        competitions = []
        for row in soup.find_all('div', 'row'):
            link = row.find('a')
            details = self.__competition_details_from_link(link['href'])
            competitions.append({
                'id': details['id'],
                'area_id': area_id,
                'region': details['region'],
                'scope': details['type'],
                'label': link.text,
                'type': row.find('span', 'type').text,
                })
        return competitions
    
    def competition_seasons(self, cp_id, scope, region='-', slug='-'):
        req = self._http.get(f'https://us.soccerway.com/{scope}/{region}/{slug}/c{cp_id}/')
        soup = BeautifulSoup(req.text, 'html.parser')
        seasons = []
        for row in soup.select('select[name="season_id"] option'):
            seasons.append({
                'id': self.__season_id_from_link(row['value']),
                'label': row.text
                })
        return seasons

    def competition_teams(self, cp_id, season_id):
        data = self._http.get('https://us.soccerway.com/a/block_teams_index_club_teams', params={
            'block_id': "page_teams_1_block_teams_index_club_teams_2",
            'callback_params': json.dumps({
                'level': 2
            }),
            'action': 'expandItem',
            'params': json.dumps({
                'competition_id': cp_id,
                'season_id': season_id,
                'level': 3,
                'item_key': 'competition_id'
                })
            }).json()
        soup = BeautifulSoup(data['commands'][0]['parameters']['content'], features="html.parser")
        teams = []
        for row in soup.find_all('div', 'row'):
            link = row.find('a', 'team')
            teams.append({
                'id': safeint(self.__team_id_from_link(link['href'])),
                'season_id': season_id,
                'label': link.text
                })
        return teams

    def player_informations(self, player_id):
        html = self._http.get(f'https://us.soccerway.com/players/-/{player_id}/').text
        soup = BeautifulSoup(html, features='html.parser')
        passport = soup.find(class_="block_player_passport")
        if passport is None:
            return {}
        fields = passport.find_all('dd')
        data = {}
        for field in fields:
            if field.has_attr('data-first_name'):
                data.update({'first_name': field.text})
            if field.has_attr('data-last_name'):
                data.update({'last_name': field.text})
            if field.has_attr('data-nationality'):
                data.update({'nationality': field.text})
            if field.has_attr('data-date_of_birth'):
                data.update({'birth_date': datetime.strptime(field.text, '%d %B %Y')})
            if field.has_attr('data-place_of_birth'):
                data.update({'birthplace': field.text})
            if field.has_attr('data-position'):
                data.update({'position': field.text})
            if field.has_attr('data-height'):
                data.update({'height': field.text})
            if field.has_attr('data-weight'):
                data.update({'weight': field.text})
            if field.has_attr('data-foot'):
                data.update({'foot': field.text})
        data.update({'picture': passport.find('img')['src']})
        return data

    def player_transfers(self, player_id):
        html = self._http.get(f'https://us.soccerway.com/players/-/{player_id}/').text
        soup = BeautifulSoup(html, features='html.parser')
        transfers_table_el = soup.find('table', class_="transfers")
        if transfers_table_el is None:
            return []
        transfers = []
        for row in transfers_table_el.find_all('tr', class_=['odd', 'even']):
            teams = row.find_all(class_="team")
            transfers.append({
                'date': datetime.strptime(row.find(class_='date').text, "%d/%m/%y"),
                'from': teams[0].text,
                'to': teams[1].text,
                'type': row.find(class_='type').text,
            })
        return transfers

    def player_sidelines(self, player_id):
        html = self._http.get(f'https://us.soccerway.com/players/-/{player_id}/').text
        soup = BeautifulSoup(html, features='html.parser')
        sidelines_table_el = soup.find('table', class_="sidelined")
        if sidelines_table_el is None:
            return []
        sidelines = []
        for row in sidelines_table_el.find_all('tr', class_=['odd', 'even']):
            sidelines.append({
                'type': row.find(class_='icon').attrs['title'],
                'start': datetime.strptime(row.find(class_='startdate').text, "%d/%m/%y"),
                'end': datetime.strptime(row.find(class_='enddate').text, "%d/%m/%y"),
            })
        return sidelines

    def player_trophies(self, player_id):
        html = self._http.get(f'https://us.soccerway.com/players/-/{player_id}/').text
        soup = BeautifulSoup(html, features='html.parser')
        table_el = soup.find('table', class_="trophies-table")
        if table_el is None:
            return []
        trophies = []
        current_competition = None
        for row in table_el.find_all('tr', lambda class_: class_ is None):
            cp_link_el = row.find('td', class_="competition").find('a')
            if cp_link_el is not None:
                current_competition = self.__competition_details_from_link(cp_link_el.attrs.get('href')) or current_competition
                rank = row.find('td', class_="label").text
                seasons = []
                for season in row.find('td', class_="seasons").find_all(['a', 'span']):
                    season_link = season.attrs.get('href')
                    seasons.append({
                        'id': self.__season_id_from_link(season_link) if season_link else None,
                        'label': season.text
                        })
                trophies.append({
                    'competition': current_competition.get('id'),
                    'rank': rank,
                    'seasons': seasons
                })
        return trophies

    def player_stats(self, player_id):
        statistics = []
        types = ['club', 'international']

        for t in types:
            data = self._http.get('https://us.soccerway.com/a/block_player_career', params={
                'block_id': "page_player_1_block_player_career_6",
                'callback_params': json.dumps({
                    'people_id': player_id
                }),
                'action': 'changeTab',
                'params': json.dumps({
                    'type': t,
                    'formats': ['Domestic league', 'Domestic cup', 'Domestic super cup'] if t == 'club' else None
                    })
                }).json()
            soup = BeautifulSoup(data['commands'][0]['parameters']['content'], features="html.parser")
            rows = soup.find_all('tr', attrs={'data-season_id': re.compile("\d+")})
            for row in rows:
                competition = self.__competition_details_from_link(row.find('td', class_="competition").find('a').get('href'))
                team_id = self.__team_id_from_link(row.find('td', class_="team").find('a').get('href'))

                statistics.append({
                    'type': t,
                    'season': {
                        'id': safeint(row.get('data-season_id')),
                        'label': row.select_one('td.season a').text
                        },
                    'team': safeint(team_id),
                    'competition': competition.get('id') if competition is not None else None,
                    'played_time': safeint(row.find(class_='game-minutes').text),
                    'appearances': safeint(row.find(class_='appearances').text),
                    'lineups': safeint(row.find(class_='lineups').text),
                    'sub_in': safeint(row.find(class_='subs-in').text),
                    'sub_out': safeint(row.find(class_='subs-out').text),
                    'sub_bench': safeint(row.find(class_='subs-on-bench').text),
                    'goals': safeint(row.find(class_='goals').text),
                    'yellow': safeint(row.find(class_='yellow-cards').text),
                    'second_yellow': safeint(row.find(class_='2nd-yellow-cards').text),
                    'red': safeint(row.find(class_='red-cards').text)
                })
        return statistics

    def team_players(self, team_id, season_id):
        data = self._http.get('https://us.soccerway.com/a/block_team_squad', params={
            'block_id': "page_team_1_block_team_squad_8",
            'callback_params': json.dumps({
                'team_id': str(team_id)
            }),
            'action': 'changeSquadSeason',
            'params': json.dumps({
                'season_id': str(season_id),
                })
            }).json()
        soup = BeautifulSoup(data['commands'][0]['parameters']['content'], features="html.parser")
        players = []
        for row in soup.find('table', 'squad').find_all('tr'):
            if row.has_attr('data-people_id'):
                players.append(int(row['data-people_id']))
        return players
