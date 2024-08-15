from celery import Task
from pymongo import MongoClient

class BallinDatabaseTask(Task):
    _ballin_db = None

    @property
    def ballin_db(self):
        if self._ballin_db is None:
            self._ballin_db = MongoClient('mongodb://mongodb:27017/').test
        return self._ballin_db
