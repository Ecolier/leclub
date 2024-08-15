import time
import requests
from .commander import Commander

class Scrapoxy:
    def __init__(self, http_client):
        self._http = http_client
        self._commander = Commander('http://scrapoxy:8889/api', 'scrapoxy_123_@_password')
        self._status_codes_blacklist = [503, 403]

        self._http.proxies = {
            'http': 'http://scrapoxy:8888',
            'https': 'http://scrapoxy:8888',
            }

    def get(self, url):
        try:
            res = self._http.get(url)
            if res.status_code == 407:
                raise requests.exceptions.ProxyError()
            if res.status_code in self._status_codes_blacklist:
                print('Request blacklisted waiting ...')
                self._stop_and_sleep(res.headers.get('x-cache-proxyname'))
                return self.get(url)
            return res

        except requests.exceptions.ProxyError as e:
            print('There is no scrapoxy proxies started, waiting ...')
            time.sleep(10)
            return self.get(url)

    def _stop_and_sleep(self, name):
        if name:
            print('Restarting {} instance'.format(name))
            alive = self._commander.stop_instance(name)
        time.sleep(120)

