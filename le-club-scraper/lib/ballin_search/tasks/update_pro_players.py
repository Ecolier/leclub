import time
import re
import random
from datetime import datetime

from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from ...search_db_task import SearchDatabaseTask
from pymongo import UpdateOne

class Task(ScrapDatabaseTask, SearchDatabaseTask):
    _soccerway_teams = {}
    _soccerway_competitions = {}

    _sofascore_teams = {}
    _tmkt_teams = {}

    def get_soccerway_team(self, team_id):
        if team_id not in self._soccerway_teams:
            self._soccerway_teams[team_id] = self.scrap_db.soccerway_teams.find_one({'_id': team_id})
        return self._soccerway_teams.get(team_id)

    def get_sofascore_team(self, team_id):
        if team_id not in self._sofascore_teams:
            self._sofascore_teams[team_id] = self.scrap_db.sofascore_teams.find_one({'_id': team_id})
        return self._sofascore_teams.get(team_id)

    def get_tmkt_team(self, team_id):
        if team_id not in self._tmkt_teams:
            self._tmkt_teams[team_id] = self.scrap_db.tmkt_teams.find_one({'_id': team_id})
        return self._tmkt_teams.get(team_id)

    def get_soccerway_competition(self, competition_id):
        if competition_id not in self._soccerway_competitions:
            self._soccerway_competitions[competition_id] = self.scrap_db.soccerway_competitions.find_one({'_id': competition_id})
        return self._soccerway_competitions.get(competition_id)

    def get_soccerway_player_team(self, player):
        for season_stat in player['soccerway']['statistics']:
            if '2020' in season_stat['season']['label']:
                return self.get_soccerway_team(season_stat['team'])

    def get_player_last_name(self, player):
        if 'soccerway' in player:
            return player['soccerway']['informations']['last_name']
        if 'sofascore' in player:
            return player['sofascore']['informations']['complete_name'].split(' ')[-1]
        if 'tmkt' in player:
            return player['tmkt']['informations']['complete_name'].split(' ')[-1]

    def get_player_first_name(self, player):
        if 'soccerway' in player:
            return player['soccerway']['informations']['first_name']
        if 'sofascore' in player:
            return player['sofascore']['informations']['complete_name'].split(' ')[0]
        if 'tmkt' in player:
            return player['tmkt']['informations']['complete_name'].split(' ')[0]

    def get_player_birthdate(self, player):
        if 'tmkt' in player:
            return player['tmkt']['informations'].get('date_of_birth')
        if 'soccerway' in player:
            return player['soccerway']['informations']['birth_date']
        if 'sofascore' in player:
            return player['sofascore']['informations']['birthdate']

    def get_player_picture(self, player):
        if 'soccerway' in player:
            return player['soccerway']['informations']['picture']
        if 'sofascore' in player:
            return player['sofascore']['informations']['picture']
        # if 'tmkt' in player:
            # return player['tmkt']['informations']['picture']

    def get_player_country(self, player):
        if 'soccerway' in player:
            return player['soccerway']['informations'].get('nationality')
        if 'sofascore' in player:
            return player['sofascore']['informations'].get('nationality')
        if 'tmkt' in player:
            return player['tmkt']['informations']['citizenship'][0]

    def get_player_height(self, player):
        if 'soccerway' in player:
            return player['soccerway']['informations'].get('height')
        if 'sofascore' in player:
            return player['sofascore']['informations'].get('height')
        if 'tmkt' in player:
            return player['tmkt']['informations'].get('height')

    def get_player_weight(self, player):
        if 'soccerway' in player:
            return player['soccerway']['informations'].get('weight')
        if 'sofascore' in player:
            return player['sofascore']['informations'].get('weight')
        if 'tmkt' in player:
            return player['tmkt']['informations'].get('weight')

    def get_player_lateralite(self, player):
        if 'soccerway' in player:
            return player['soccerway']['informations'].get('foot')
        if 'tmkt' in player:
            return player['tmkt']['informations'].get('foot')
        if 'sofascore' in player:
            return player['sofascore']['informations'].get('preferred_foot')

    def get_player_gender(self, player):
        if 'tmkt' in player:
            return player['tmkt']['informations'].get('gender')
        if 'soccerway' in player:
            team = self.get_soccerway_player_team(player)
            print(team)
            if team is not None:
                return team['informations'].get('gender')
        if 'sofascore' in player:
            team_id = player['sofascore'].get('club', {}).get('id')
            team = self.get_sofascore_team(team_id)
            if team is not None:
                return team['informations'].get('gender')

    def get_player_national_appearances(self, player):
        appearances = 0
        if 'soccerway' in player:
            for season_stat in player['soccerway']['statistics']:
                if season_stat.get('type') == 'international':
                    appearances += season_stat.get('appearances')
        return appearances

    def get_player_end_contract(self, player):
        if 'tmkt' in player:
            return player['tmkt']['informations'].get('contract_expires')

    def get_player_previous_transfert(self, player):
        pass

    def get_player_contract_type(self, player):
        pass

    def get_player_current_club(self, player):
        if 'soccerway' in player:
            team = self.get_soccerway_player_team(player)
            if team is not None:
                return {
                    'name': team['informations'].get('name'),
                    'country': team['informations'].get('country'),
                    'logo': team['informations'].get('logo'),
                    }
        if 'sofascore' in player:
            team_id = player['sofascore'].get('club', {}).get('id')
            team = self.get_sofascore_team(team_id)
            if team is not None:
                return {
                    'name': team['informations'].get('name'),
                    'country': team['informations'].get('country'),
                    'logo': team['informations'].get('logo')
                    }
        if 'tmkt' in player:
            team_id = player['tmkt'].get('club', {}).get('id')
            team = self.get_tmkt_team(team_id)
            if team is not None:
                return {
                    'name': team['informations'].get('name'),
                    'country': team['informations'].get('country'),
                    'logo': team['informations'].get('logo'),
                    }

    def get_player_current_stats(self, player):
        statistics = {
            'teams': set(),
            'countries': set(),
            'competitions': set(),
            'appearances': 0,
            'goals': 0,
            'lineups': 0,
            'minutesPlayed': 0,
            'assists': 0,
            }
        if 'soccerway' in player:
            for season_stat in player['soccerway']['statistics']:
                if '2020' in season_stat['season']['label']:
                    team = self.get_soccerway_team(season_stat['team'])
                    competition = self.get_soccerway_competition(season_stat['competition'])
                    if team is None or competition is None:
                        continue
                    statistics['teams'].add(team['informations']['name'])
                    statistics['countries'].add(team['informations']['country'])
                    statistics['competitions'].add(competition['label'])

                    statistics['appearances'] += season_stat.get('appearances')
                    statistics['goals'] += season_stat.get('goals')
                    statistics['lineups'] += season_stat.get('lineups')
                    statistics['minutesPlayed'] += season_stat.get('played_time')
                    statistics['assists'] += 0

        statistics['teams'] = list(statistics['teams'])
        statistics['countries'] = list(statistics['countries'])
        statistics['competitions'] = list(statistics['competitions'])
        return statistics

@app.task(bind=True, base=Task, ignore_result=True, rate_limit="30/m")
def update_pro_players(self):
    players_agg = self.scrap_db.pro_players_indexes.aggregate([
        {
            '$lookup': {
                'from': 'sofascore_players',
                'localField': 'sofascore',
                'foreignField': '_id',
                'as': 'sofascore'
                },
            },
        {
            '$lookup': {
                'from': 'soccerway_players',
                'localField': 'soccerway',
                'foreignField': '_id',
                'as': 'soccerway'
                },
            },
        {
            '$lookup': {
                'from': 'tmkt_players',
                'localField': 'tmkt',
                'foreignField': '_id',
                'as': 'tmkt'
                },
            },
        {'$unwind': {'path': '$sofascore', 'preserveNullAndEmptyArrays': True}},
        {'$unwind': {'path': '$soccerway', 'preserveNullAndEmptyArrays': True}},
        {'$unwind': {'path': '$tmkt', 'preserveNullAndEmptyArrays': True}}
    ])
    operations = []
    for player in players_agg:
        data = {
            '_id': player['_id'],
            'first_name': self.get_player_first_name(player),
            'last_name': self.get_player_last_name(player),
            'birthdate': self.get_player_birthdate(player),
            'picture': self.get_player_picture(player),
            'country': self.get_player_country(player),
            'height': self.get_player_height(player),
            'weight': self.get_player_weight(player),
            'lateralite': self.get_player_lateralite(player),
            'gender': self.get_player_gender(player),
            'nationalAppearances': self.get_player_national_appearances(player),
            'endContract': self.get_player_end_contract(player),
            'priviousTransfert': self.get_player_previous_transfert(player),
            'contractType': self.get_player_contract_type(player),
            'curentClub': self.get_player_current_club(player),
            'currentSeasonStats': self.get_player_current_stats(player),
            }
        operations.append(UpdateOne({'_id': data['_id']}, {'$set': data}, upsert=True))

    if len(operations) > 0:
        self.search_db.pro_players.bulk_write(operations)
