import time
import re
import random
import pandas as pd
from datetime import datetime

from ...celery import app
from ...scrap_db_task import ScrapDatabaseTask
from pymongo import UpdateOne, InsertOne

class Task(ScrapDatabaseTask):
    def sofascore_players_search(self, complete_name, birthdate=None):
        where = {
                '$text': {'$search': complete_name}
                }
        if birthdate is not None:
            where.update({'informations.birthdate': birthdate})
        return list(self.scrap_db.sofascore_players.aggregate([
            {
                '$match': where
                }
            ]))
    def tmkt_players_search(self, complete_name, birthdate=None):
        where = {
                '$text': {'$search': complete_name}
                }
        if birthdate is not None:
            where.update({'informations.date_of_birth': birthdate})
        return list(self.scrap_db.tmkt_players.aggregate([
            {
                '$match': where
                }
            ]))

    def soccerway_players_search(self, complete_name, birthdate=None):
        where = {
                '$text': {'$search': complete_name}
                }
        if birthdate is not None:
            where.update({'informations.birth_date': birthdate})
        return list(self.scrap_db.soccerway_players.aggregate([
            {
                '$match': where
                }
            ]))

    def create_index(self, main_key, soccerway_id, sofascore_id, tmkt_id):
        players_index = {}
        if soccerway_id is not None:
            players_index.update({'soccerway': soccerway_id})
        if sofascore_id is not None:
            players_index.update({'sofascore': sofascore_id})
        if tmkt_id is not None:
            players_index.update({'tmkt': tmkt_id})
        self.scrap_db.pro_players_indexes.update_one({main_key: players_index[main_key]}, {'$set': players_index}, upsert=True)

@app.task(bind=True, base=Task, ignore_result=True)
def create_soccerway_player_index(self, player_id):
    player = self.scrap_db.soccerway_players.find_one({'_id': player_id})
    first_name = player['informations'].get('first_name', '')
    last_name = player['informations'].get('last_name', '')
    complete_name = first_name + " " + last_name
    birthdate = player['informations'].get('birth_date')

    sofascore_players = self.sofascore_players_search(complete_name, birthdate)
    tmkt_players = self.tmkt_players_search(complete_name, birthdate)

    sofascore_id = sofascore_players[0]['_id'] if len(sofascore_players) > 0 else None
    tmkt_id = tmkt_players[0]['_id'] if len(tmkt_players) > 0 else None
    self.create_index('soccerway', player['_id'], sofascore_id, tmkt_id)

@app.task(bind=True, base=Task, ignore_result=True)
def create_sofascore_player_index(self, player_id):
    player = self.scrap_db.sofascore_players.find_one({'_id': player_id})
    complete_name = player['informations'].get('complete_name')
    birthdate = player['informations'].get('birthdate')

    soccerway_players = self.soccerway_players_search(complete_name, birthdate)
    tmkt_players = self.tmkt_players_search(complete_name, birthdate)

    soccerway_id = soccerway_players[0]['_id'] if len(soccerway_players) > 0 else None
    tmkt_id = tmkt_players[0]['_id'] if len(tmkt_players) > 0 else None
    self.create_index('sofascore', soccerway_id, player['_id'], tmkt_id)

@app.task(bind=True, base=Task, ignore_result=True)
def create_tmkt_player_index(self, player_id):
    player = self.scrap_db.tmkt_players.find_one({'_id': player_id})
    complete_name = player['informations'].get('complete_name')
    birthdate = player['informations'].get('date_of_birth')

    soccerway_players = self.soccerway_players_search(complete_name, birthdate)
    sofascore_players = self.sofascore_players_search(complete_name, birthdate)

    soccerway_id = soccerway_players[0]['_id'] if len(soccerway_players) > 0 else None
    sofascore_id = sofascore_players[0]['_id'] if len(sofascore_players) > 0 else None
    self.create_index('tmkt', soccerway_id, sofascore_id, player['_id'])

