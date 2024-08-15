from celery import Task
from .api import SoccerwayApi

class ApiTask(Task):
    _api = None

    @property
    def api(self):
        if self._api is None:
            self._api = SoccerwayApi()
        return self._api
