from celery import Task
from .api import TmktApi

class ApiTask(Task):
    _api = None

    @property
    def api(self):
        if self._api is None:
            self._api = TmktApi()
        return self._api
