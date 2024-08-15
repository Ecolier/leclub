# Scrappers BALLIN

---
## Technologies
docker
docker-compose
scrapoxy (Proxy to avoid blacklisting)
celery (Task management)

---
## Pré-requis

Avant de commencer, assurez-vous d’avoir docker, docker-compose d’installer sur votre machine ou dans la machine virtuel que vous souhaitez utiliser.
De plus des connaissances en python, mongodb, docker sont fortement conseillées.
Il vous faudra aussi avoir un compte AWS ou un autre provider proposer par scrapoxy de setup pour faire fonctionner les scrappers.

---
## Mise en route des scrappers

Pour mettre en route les scrappers, cloner le projet puis rendez vous dans le dossier du projet et ouvrez le fichier docker-compose.yml avec un éditeur de texte, ici il faudra modifier à votre guise les paramètres des services suivant:
mongodb: Changer le chemin du volumes vers un dossier déjà existant, c’est tres important, ca va permettre la persistance de la base de donnée même si vous supprimer le service par inadvertance
scrapoxy: Il vous faudra configurer scrapoxy pour qu’il fonctionne avec le provider de votre choix, a Ballin nous avons fait le choix d’utiliser AWS mais vous pouvez en utiliser d'autres. (Les configurations possible sont listés ici dans le code de scrapoxy) https://scrapoxy.readthedocs.io/en/master/standard/providers/awsec2/index.html

Une fois ces deux services configurés vous pouvez taper la commande suivante: docker-compose up. Normalement si tout se passe bien vous devriez avoir les services suivant de up:
scrapper
dashboard
redis
mongodb
TOR (c'était l’ancien proxy, si il ne tourne pas c’est pas grave il n’est plus utilisé, il reste la en backup)
scrapoxy

Assurez-vous bien que vous puissiez accéder au dashboard via le port 5555. 

---
## Comment fonctionne les scrappers

Les scrappers doivent être trigger manuellement via des requête HTTP, et fonctionnent en plusieurs étapes, chaque étape doivent être trigger a la main par l'opérateur. Pour vérifier qu’une étape est fini il vous suffit de regarder l'activité des scrappers via le dashboard accessible sur le port 5555, c’est également ce dashboard qui va vous permettre de lancer des opérations de scrapping

De plus, les scrappers ne stockent rien dans la base de données de production, car la donnée scrappée est la plus brute possible et doit être transformée afin de la faire correspondre avec l’architecture de la BDD de la plateforme.

Il est à noter que les sites scrappés sont susceptibles de changer et donc de casser certains des scrappers. Il vous faudra donc des connaissances en Python pour les réparer.

(Toutes les commandes qui vont suivre seront des commandes CURL vous pouvez très bien utiliser postman ou un autre logiciel afin de faire vos requêtes HTTP. Il vous faudra aussi remplacer l'adresse en fonction de la votre)

(Toutes les routes disponibles sont listées dans ce fichier: “lib/celery.py”)

---
### Scrapper la FFF

Pour scrapper la FFF il vous faudra exécuter les commandes suivantes dans cet ordre et bien attendre que chaque scrap ai bien fini.

On commence par scrapper tous les clubs, c’est notre point d'entrée.
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.fff.tasks.clubs.clubs"

Une fois les clubs scrappés on peut scrapper les équipes.
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.fff.tasks.all_club_teams.all_club_teams"

Une fois les équipes scrappées on peut scrapper les joueurs
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.fff.tasks.all_teams_players.all_teams_players"

Une fois les équipes scrappées on peut scrapper les tous les matches
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.fff.tasks.all_teams_matches.all_teams_matches"

Une fois que vous avez tous les joueurs, vous pouvez récupérer tous les détails des joueurs
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.fff.tasks.all_players_details.all_players_details"

Pour mettre à jours tous les matches dont la date est dépassée et ou il manque le score
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.fff.tasks.all_missing_matches_details.all_missing_matches_details"

---
### Scrapper la RBFA (Belgique)

Pour scrapper la RBFA il vous faudra exécuter les commandes suivantes dans cet ordre et bien attendre que chaque scrap ai bien fini.

On récupère les compétitions
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.rbfa.tasks.competitions.competitions"

On récupère les équipes
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.rbfa.tasks.teams.teams"

On récupère les clubs
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.rbfa.tasks.clubs.clubs"

On récupère les matches
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.rbfa.tasks.matches.matches"

---
### Scrapper Soccerway

Pour scrapper Soccerway il vous faudra exécuter les commandes suivantes dans cet ordre et bien attendre que chaque scrap ai bien fini.

On récupère toutes les régions
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.soccerway.tasks.areas.areas"

On récupère toutes les compétitions
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.soccerway.tasks.all_areas_competitions.all_areas_competitions"

On récupère toutes les équipes
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.soccerway.tasks.all_competitions_teams.all_competition_teams"

On récupère tous les joueurs
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.soccerway.tasks.all_teams_players.all
_teams_players"

---
### Scrapper Sofascore

Pour scrapper Sofascore il vous faudra exécuter les commandes suivantes dans cet ordre et bien attendre que chaque scrap ai bien fini.

On récupère toutes les régions
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.sofascore.tasks.areas.areas"

On récupère toutes les compétitions
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.sofascore.tasks.all_areas_competitions.all_areas_competitions"
On récupère toutes les équipes
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.sofascore.tasks.all_competitions_teams.all_competitions_teams"

On récupère tous les joueurs
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.sofascore.tasks.all_teams_players_details.all_teams_players_details"

---
### Scrapper Transfermarkt

Pour scrapper Transfermarkt il vous faudra exécuter les commandes suivantes dans cet ordre et bien attendre que chaque scrap ai bien fini.

On récupère toutes les compétitions
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.tmkt.tasks.all_competitions.all_competitions"

On récupère toutes les équipes
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.tmkt.tasks.all_competitions_teams.all_competitions_teams"

On récupère tous les joueurs
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.tmkt.tasks.all_players_details.all_players_details"

---
### Mettre à jour la plateforme

Une fois la data scrappée il vous faudra mettre a jours la plateforme, vous avez donc à votre disposition plusieurs scripts.

Attention: De base les scripts fonctionnent avec la BDD locale qui est gérée par docker-compose, ce fonctionnement permet de bien vérifier la data avant de l’exporter vers la production. Vous pouvez soit garder ce fonctionnement mais vous devrez exporter à la main les données vers votre BDD de production. Ou vous pouvez modifier l’url de la BDD dans le fichier suivant: “lib/ballin_db_task.py” ainsi que celui-ci “lib/search_db_task.py” pour la BDD de recherche

Il vous faudra toujours exécuter les scripts dans cet ordre:

---
### Mettre à jour les data de la FFF
### Mettre à jours les clubs de la FFF (optionnel si il n’y a aucun club a mettre a jour):
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.ballin.tasks.update_fff_clubs.update_fff_clubs"

Mettre à jours les équipes de la FFF (optionnel si il n’y a aucune équipe a mettre a jour):
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.ballin.tasks.update_fff_teams.update_fff_teams"

Mettre à jours les matches de la FFF (optionnel si il n’y a aucun matches à mettre à jour):
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.ballin.tasks.update_fff_matches.update_fff_matches"

Mettre à jours les feuilles de matches des joueurs de la FFF (optionnel):
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.ballin.tasks.update_fff_match_players_sheets.update_fff_matches_players_sheets"

---
### Mettre à jour les data de la RBFA

Mettre à jours les clubs de la RBFA (optionnel si il n’y a aucun club a mettre a jour):
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.ballin.tasks.update_rbfa_clubs.update_rbfa_clubs"

Mettre à jours les équipes de la RBFA (optionnel si il n’y a aucune équipe a mettre a jour):
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.ballin.tasks.update_rbfa_teams.update_rbfa_teams"

Mettre à jours les matches de la RBFA (optionnel si il n’y a aucun matches à mettre à jour):
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.ballin.tasks.update_rbfa_matches.update_rbfa_matches"

---
### Mettre à jour la recherche des joueurs pro

Vu que les joueurs pro ont un ID différent sur soccerway, sofascore et transfermarkt nous avons besoin de croiser la data des différentes plateforme afin d'éviter tout doublon potentiel.

On creer une table d’index qui match les index des joueurs sur les différents sites:
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.pro.tasks.create_players_indexes.create_players_indexes"

Puis on met a jours:
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.pro.tasks.update_search_engine.update_search_engine"

---
### Mettre à jour la recherche des clubs et des utilisateurs ballin

Mise a jours des joueurs Ballin:
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.ballin_search.tasks.update_ballin_users.update_ballin_users"

Mise a jours de la recherches des clubs:
curl -X POST -d '{"args": []}' "http://localhost:5555/api/task/async-apply/lib.ballin_search.tasks.update_ballin_clubs.update_ballin_clubs"