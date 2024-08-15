from celery import Task
from pymongo import MongoClient

class SearchDatabaseTask(Task):
    _search_db = None

    @property
    def search_db(self):
        if self._search_db is None:
            self._search_db = MongoClient('mongodb://mongodb:27017/').search_db
        return self._search_db
