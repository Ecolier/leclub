from celery import Task
from .api.api import RBFAApi

class ApiTask(Task):
    _api = None

    @property
    def api(self):
        if self._api is None:
            self._api = RBFAApi()
        return self._api
