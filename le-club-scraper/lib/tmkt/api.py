import re
import json
import requests_cache
from pymongo import MongoClient
from datetime import datetime
from bs4 import BeautifulSoup
from ratelimiter import RateLimiter
from ..scrapoxy.scrapoxy import Scrapoxy

ONE_DAY = 60*60*24
SIX_DAY = ONE_DAY*6

# safe parse int
def safeint(s):
    try:
        return int(s)
    except:
        return 0

class TmktApi:
    def __init__(self):
        http_client = requests_cache.CachedSession('requests-cache', backend="mongodb", expire_after=SIX_DAY, connection=MongoClient('mongodb://mongodb:27017/'))
        http_client.headers = {
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Brave Chrome/80.0.3987.163 Safari/537.36'
                }
        self._scrapoxy = Scrapoxy(http_client)

    def __agent_data_from_link(self, link):
        link_data_re = re.compile('\/(.+)\/.+\/.+\/(.+)')
        data = link_data_re.match(link)
        if data is not None:
            return {
                    'id': safeint(data.group(2)),
                    'slug': data.group(1)
                    }

    def __club_data_from_link(self, link):
        link_data_re = re.compile('\/(.+)\/.+\/.+\/(.+)')
        data = link_data_re.match(link)
        if data is not None:
            return {
                    'id': safeint(data.group(2)),
                    'slug': data.group(1)
                    }

    @RateLimiter(max_calls=20, period=60)
    def _call_api(self, call):
        print("call api")
        return call(self._scrapoxy)

    def areas(self):
        return ["europa", "asien", "amerika", "afrika"]

    def area_competitions(self, area):
        link_data_re = re.compile(r"\/(.+)\/startseite\/wettbewerb\/(.+)")
        competitions = []
        last_page = 1
        page = 0
        tier = None
        while page < last_page:
            page = page + 1
            req = self._call_api(lambda http: http.get(f'https://www.transfermarkt.com/wettbewerbe/{area}?ajax=yw1&page={page}'))
            soup = BeautifulSoup(req.text, 'html.parser')

            pages = soup.select('li.page')
            if len(pages) > 0:
                last_page = safeint(pages[-1].text)

            for row in soup.select('table.items > tbody > tr'):
                link = row.select_one('a[title]')
                if link is None:
                    tier = row.text.strip().replace(' ', '_').lower()
                    continue
                link_data = link_data_re.match(link['href'])
                competitions.append({
                    'slug': link_data.group(1),
                    'tier': tier,
                    'name': link['title'],
                    'name_abbr': link_data.group(2),
                    'area': area,
                    'country': row.select_one('img.flaggenrahmen')['title'].lower()
                    })
        return competitions
    
    def competition_seasons(self, slug, name_abbr):
        req = self._scrapoxy.get(f'https://www.transfermarkt.com/{slug}/startseite/wettbewerb/{name_abbr}')
        soup = BeautifulSoup(req.text, 'html.parser')
        seasons = []
        for row in soup.select('select[name="saison_id"] > option'):
            seasons.append({
                'id': row['value'],
                'label': row.text
                })
        return seasons

    def competition_teams(self, slug, name_abbr, season_id):
        req = self._scrapoxy.get(f'https://www.transfermarkt.com/{slug}/startseite/wettbewerb/{name_abbr}/plus/?saison_id{season_id}')
        soup = BeautifulSoup(req.text, 'html.parser')

        teams = []
        for row in soup.select('table.items > tbody > tr'):
            club_link = row.select_one('td.hauptlink > a.vereinprofil_tooltip')
            if club_link is None:
                continue
            teams.append({
                'season_id': season_id,
                'name': club_link.text,
                'club_id': safeint(club_link.attrs.get('id')),
                })
        return teams

    def team_seasons(self, team_id):
        req = self._scrapoxy.get(f'https://www.transfermarkt.com/-/kader/verein/{team_id}/')
        soup = BeautifulSoup(req.text, 'html.parser')

        seasons = []
        for row in soup.select('select[name="saison_id"] > option'):
            seasons.append({
                'id': row['value'],
                'label': row.text
                })
        return seasons

    def team_informations(self, team_id):
        req = self._scrapoxy.get(f'https://www.transfermarkt.com/-/kader/verein/{team_id}/')
        soup = BeautifulSoup(req.text, 'html.parser')
        informations = {
            'name': soup.select_one('h1[itemprop="name"]').text.strip(),
            'logo': f"https://tmssl.akamaized.net//images/wappen/head/{team_id}.png",
            "country": soup.select_one('.mediumpunkt img')['title'].lower(),
            }
        return informations

    def team_players(self, team_id, season_id):
        req = self._scrapoxy.get(f'https://www.transfermarkt.com/-/kader/verein/{team_id}/saison_id/{season_id}/plus/1')
        soup = BeautifulSoup(req.text, 'html.parser')

        players = []
        for row in soup.select('table.items > tbody > tr'):
            profile_link = row.select_one('a.spielprofil_tooltip')
            data = re.compile(r"/(.*)/profil/spieler/(\d+)").match(profile_link['href'])
            if data:
                players.append({
                    'id': safeint(data.group(2)),
                    'slug': data.group(1),
                    'complete_name': profile_link.text
                    })
        return players

    def player_market(self, player_id, slug):
        req = self._scrapoxy.get(f'https://www.transfermarkt.com/{slug}/profil/spieler/{player_id}')
        soup = BeautifulSoup(req.text, 'html.parser')
        current_value = None
        current_value_el = soup.select_one('.dataMarktwert > a')
        if current_value_el is not None:
            current_value = current_value_el.text.strip().split(' ')[0]
        return {
                'current_value': current_value
                }

    def player_transfers(self, player_id, slug):
        req = self._scrapoxy.get(f'https://www.transfermarkt.com/{slug}/profil/spieler/{player_id}')
        soup = BeautifulSoup(req.text, 'html.parser')
        transfers = []
        for row in soup.select('tr.zeile-transfer'):
            columns = row.find_all('td', class_=['zentriert', 'vereinsname', 'zelle-abloese', 'zelle-mw'])
            values = [c for c in columns if 'show-for-small' not in c.get('class')]

            date = values[1].text.strip()
            if date != '-':
                date = datetime.strptime(date, '%b %d, %Y')
            
            club_from_el = values[2].find('a')
            club_from = {'name': club_from_el.text}
            club_from.update(self.__club_data_from_link(club_from_el['href']))

            club_to_el = values[3].find('a')
            club_to = {'name': club_to_el.text}
            club_to.update(self.__club_data_from_link(club_to_el['href']))

            transfer_value = values[4].text.strip()
            fees = values[5].text.strip()

            transfers.append({
                'season': values[0].text.strip(),
                'date': date,
                'from': club_from,
                'to': club_to,
                'value': values[4].text.strip(),
                'fees': values[5].text.strip(),
                })
        return transfers

    def player_positions(self, player_id, slug):
        req = self._scrapoxy.get(f'https://www.transfermarkt.com/{slug}/profil/spieler/{player_id}')
        soup = BeautifulSoup(req.text, 'html.parser')
        positions = []
        for pos_el in soup.select('div.detailpositionen img[class^="hauptposition"]'):
            positions.append({
                'name': pos_el['title'],
                'type': 'main'
                })
        for pos_el in soup.select('div.detailpositionen img[class^="nebenposition"]'):
            positions.append({
                'name': pos_el['title'],
                'type': 'other'
                })
        return positions

    def player_club(self, player_id, slug):
        req = self._scrapoxy.get(f'https://www.transfermarkt.com/{slug}/profil/spieler/{player_id}')
        soup = BeautifulSoup(req.text, 'html.parser')

        club_el = soup.select_one('.dataZusatzDaten a.vereinprofil_tooltip')
        club = {'name': club_el.text.strip()}
        club.update(self.__club_data_from_link(club_el['href']))

        return club

    def player_informations(self, player_id, slug):
        req = self._scrapoxy.get(f'https://www.transfermarkt.com/{slug}/profil/spieler/{player_id}')
        soup = BeautifulSoup(req.text, 'html.parser')
        informations = {
                'complete_name': soup.select_one('h1[itemprop="name"]').text.strip(),
                'picture': soup.select_one('.dataBild img')['src'].strip(),
                "gender": "M"
                }
        for row in soup.select('table.auflistung > tr'):
            key = row.find('th').text.strip().replace(' ', '_').replace(':', '').lower()
            value = row.find('td').text.strip()
            if value == '-':
                continue
            if key == 'position' or key == 'current_club':
                continue
            if key == 'name_in_home_country':
                key = 'home_name'
            if key == 'date_of_birth':
                value = datetime.strptime(value, '%b %d, %Y')
            if key == 'citizenship':
                value = list(map(lambda x: x['alt'].lower(), row.find('td').find_all('img')))
            if key == 'age':
                value = safeint(value)
            if key == 'player_agent':
                link = row.find('a')
                value = self.__agent_data_from_link(link['href'])
                value.update({'name': link.text})
            if key == 'on_loan_from':
                link = row.find('a')
                value = {'name': value}
                value.update(self.__club_data_from_link(link['href']))
            if key == 'joined':
                value = datetime.strptime(value, '%b %d, %Y')
            if key == 'contract_expires' or key == 'contract_there_expires':
                value = datetime.strptime(value, '%b %d, %Y')
            if key == 'date_of_last_contract_extension':
                value = datetime.strptime(value, '%b %d, %Y')
            if key == 'social_media':
                value = [{'link': e['href'], 'title': e['title']} for e in row.find_all('a')]
            informations.update({key: value})
        return informations

