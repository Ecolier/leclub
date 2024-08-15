import requests_cache
from pymongo import MongoClient
import urllib
from .const import API_ENDPOINT, SSO, OAUTH_PATH, LOGIN_CHECK_PATH, REDIRECT_URI, OAUTH_ID

class FFFApiOauth:
    access_token=None
    refresh_token=None
    expires_in=None

    def __init__(self, username, password):
        s = requests_cache.CachedSession('requests-cache-fff-oauth', backend="mongodb", expire_after=60*60, allowable_codes=(200, 302, 404), allowable_methods=('GET', 'POST'), connection=MongoClient('mongodb://mongodb:27017/')) # one hour cache
        s.headers.update({
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.87 Safari/537.36',
            })

        s.post(f"{SSO}/{LOGIN_CHECK_PATH}", data=dict(
            _username=username,
            _password=password
        ))

        res = s.post(f"{SSO}/{OAUTH_PATH}", allow_redirects=False, params=dict(
            client_id=OAUTH_ID,
            redirect_uri=REDIRECT_URI,
            response_type="code"
        ))

        parsedUrl = urllib.parse.urlparse(res.headers.get('Location'))
        queries = urllib.parse.parse_qs(parsedUrl.query)

        oauthCode = queries.get('code')
        if oauthCode is None:
            s.cache.clear()
            raise Exception('unable to acquire oauth code')

        data = s.post(f"{API_ENDPOINT}/api/access/token.json", json=True, data=dict(
            code=oauthCode,
            redirect_uri=REDIRECT_URI
        )).json()
        
        self.refresh_token = data.get('refresh_token')
        self.access_token = data.get('access_token')
        self.expires_in = data.get('expires_in')

    def refresh(self):
        pass # TODO
