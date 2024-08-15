from celery import Task
from pymongo import MongoClient

class ScrapDatabaseTask(Task):
    _scrap_db = None

    @property
    def scrap_db(self):
        if self._scrap_db is None:
            self._scrap_db = MongoClient('mongodb://mongodb:27017/').scrapping
        return self._scrap_db
