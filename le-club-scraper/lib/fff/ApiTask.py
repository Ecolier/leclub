from celery import Task
from .fff_api.api import FFFApi
from .fff_api.scrap_api import ScrapFFFApi

class ApiTask(Task):
    _api = None
    _scrap_api = None

    @property
    def api(self):
        if self._api is None:
            self._api = FFFApi("dd.mbappe@yopmail.com", "@SiTuVoisCaC'estQueTuEsPasRGPDMonPetitPote1")
        return self._api

    @property
    def scrap_api(self):
        if self._scrap_api is None:
            self._scrap_api = ScrapFFFApi()
        return self._scrap_api
