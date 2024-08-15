import re
import requests_cache
from bs4 import BeautifulSoup
from pymongo import MongoClient

ONE_DAY = 60*60*24
SIX_DAY = ONE_DAY*6

class ScrapFFFApi:
    def __init__(self):
        self._http = requests_cache.CachedSession('requests-cache', backend="mongodb", expire_after=SIX_DAY, connection=MongoClient('mongodb://mongodb:27017/'))
        self._http.proxies = {
                'http': 'http://tor:16379',
                'https': 'https://tor:16379',
                }

    def club_contacts(self, club_id):
        html = self._http.get(f"https://lgef.fff.fr/recherche-clubs/?scl={club_id}&tab=staff").text
        soup = BeautifulSoup(html, features="html.parser")
        contacts = list()
        for contact in soup.find_all(class_="type-staff"):
            role = contact.find(class_='widgettitle').text.lower().strip()
            name = contact.find(class_='name-correspondant').text.strip()
            contact_methods = list()

            contact_methods_cat = contact.find(class_="club-staff").find_all("p")
            for contact_methods_el in contact_methods_cat:
                methods = [s.strip() for s in contact_methods_el.text.strip().split("\n")]
                for method in methods:
                    match = re.match("(\w.+) : (.*)", method, flags=re.MULTILINE)
                    if match is None:
                        continue
                    c_method = dict(
                        type=match.group(1).lower(),
                        value=match.group(2),
                    )
                    # we dont care about adresses
                    if c_method.get('type') == "adresse":
                        continue
                    contact_methods.append(c_method)

            contacts.append(dict(
                role=role,
                name=name,
                contact_methods=contact_methods
                ))

        return contacts
