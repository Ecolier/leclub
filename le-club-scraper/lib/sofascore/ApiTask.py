from celery import Task
from .api import SofascoreApi

class ApiTask(Task):
    _api = None

    @property
    def api(self):
        if self._api is None:
            self._api = SofascoreApi()
        return self._api
