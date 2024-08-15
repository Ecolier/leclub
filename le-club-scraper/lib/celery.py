from celery import Celery
from celery.schedules import crontab

app = Celery('scrappers', 
        broker='redis://redis',
        include=[
            'lib.fff.tasks.clubs',
            'lib.fff.tasks.team_matches',
            'lib.fff.tasks.club_contacts',
            'lib.fff.tasks.club_teams',
            'lib.fff.tasks.team_players',
            'lib.fff.tasks.club_players',
            'lib.fff.tasks.match_details',
            'lib.fff.tasks.all_teams_matches',
            'lib.fff.tasks.all_teams_players',
            'lib.fff.tasks.all_missing_matches_details',
            'lib.fff.tasks.all_club_contacts',
            'lib.fff.tasks.all_club_teams',
            'lib.fff.tasks.all_players_details',
            'lib.fff.tasks.player_details',
            'lib.fff.tasks.competition_matches',
            'lib.fff.tasks.all_competitions_matches',

            'lib.rbfa.tasks.competitions',
            'lib.rbfa.tasks.teams',
            'lib.rbfa.tasks.team',
            'lib.rbfa.tasks.competition_teams',
            'lib.rbfa.tasks.competition_matches',
            'lib.rbfa.tasks.matches',
            'lib.rbfa.tasks.match_details',
            'lib.rbfa.tasks.clubs',
            'lib.rbfa.tasks.club',
            'lib.rbfa.tasks.team_competitions',
            'lib.rbfa.tasks.all_teams_competitions',

            'lib.soccerway.tasks.areas',
            'lib.soccerway.tasks.area_competitions',
            'lib.soccerway.tasks.all_areas_competitions',
            'lib.soccerway.tasks.all_competitions_teams',
            'lib.soccerway.tasks.competition_teams',
            'lib.soccerway.tasks.all_teams_players',
            'lib.soccerway.tasks.team_players',
            'lib.soccerway.tasks.team',
            'lib.soccerway.tasks.player',

            'lib.sofascore.tasks.all_areas_competitions',
            'lib.sofascore.tasks.all_competitions_teams',
            'lib.sofascore.tasks.all_teams_players_details',
            'lib.sofascore.tasks.area_competitions',
            'lib.sofascore.tasks.areas',
            'lib.sofascore.tasks.competition_teams',
            'lib.sofascore.tasks.player_details',
            'lib.sofascore.tasks.team_players_details',
            'lib.sofascore.tasks.team',

            'lib.tmkt.tasks.all_competitions',
            'lib.tmkt.tasks.competition_teams',
            'lib.tmkt.tasks.all_competitions_teams',
            'lib.tmkt.tasks.team_details',
            'lib.tmkt.tasks.player_details',
            'lib.tmkt.tasks.team_players',
            'lib.tmkt.tasks.all_players_details',

            'lib.ballin.tasks.update_fff_matches',
            'lib.ballin.tasks.update_fff_match',
            'lib.ballin.tasks.update_fff_clubs',
            'lib.ballin.tasks.update_fff_teams',
            'lib.ballin.tasks.update_fff_team',
            'lib.ballin.tasks.update_fff_match_players_sheets',

            'lib.ballin.tasks.update_rbfa_clubs',
            'lib.ballin.tasks.update_rbfa_teams',
            'lib.ballin.tasks.update_rbfa_team',
            'lib.ballin.tasks.update_rbfa_match',
            'lib.ballin.tasks.update_rbfa_matches',

            'lib.ballin_search.tasks.update_fff_players',
            'lib.ballin_search.tasks.update_pro_players',
            'lib.ballin_search.tasks.update_ballin_clubs',
            'lib.ballin_search.tasks.update_ballin_users',

            'lib.pro.tasks.create_players_indexes',
            'lib.pro.tasks.create_player_index',
            'lib.pro.tasks.update_search_engine',
            ]
        )

app.conf.beat_schedule = {
    # ==== FFF ====
    # teams
    'fff-teams-auto-scrap': {
        'task': 'lib.fff.tasks.all_club_teams.all_club_teams',
        'schedule': crontab(day_of_month=1)
        },

    # calendars
    'fff-matches-auto-scrap': {
        'task': 'lib.fff.tasks.all_competitions_matches.all_competitions_matches',
        'schedule': crontab(day_of_week=2)
        },
    
    # players
    'fff-players-auto-scrap': {
        'task': 'lib.fff.tasks.all_teams_players.all_teams_players',
        'schedule': crontab(day_of_week=3)
        },

    # missing match scores, match sheets
    'fff-missing-matches-details-auto-scrap': {
        'task': 'lib.fff.tasks.all_missing_matches_details.all_missing_matches_details',
        # Daily at 18h
        'schedule': crontab(hour=18)
        },

    # ==== SOCCERWAY ====
    # get all areas
    'soccerway-areas-auto-scrap': {
        'task': 'lib.soccerway.tasks.areas.areas',
        'schedule': crontab(day_of_month=4, hour=0)
        },

    # get all competitions from all areas in db
    'soccerway-competitions-auto-scrap': {
        'task': 'lib.soccerway.tasks.all_areas_competitions.all_areas_competitions',
        'schedule': crontab(day_of_month=4, hour=2)
        },

    # get all teams from all competitions in db
    'soccerway-teams-auto-scrap': {
        'task': 'lib.soccerway.tasks.all_competitions_teams.all_competitions_teams',
        'schedule': crontab(day_of_month=5)
        },

    # get all players from all teams in db
    'soccerway-players-auto-scrap': {
        'task': 'lib.soccerway.tasks.all_teams_players.all_teams_players',
        'schedule': crontab(day_of_month=6)
        },

    # ==== SOFASCORE ====
    # get all areas
    'sofascore-areas-auto-scrap': {
        'task': 'lib.sofascore.tasks.areas.areas',
        'schedule': crontab(day_of_month=4, hour=4)
        },

    # get all competitions from all areas in db
    'sofascore-competitions-auto-scrap': {
        'task': 'lib.sofascore.tasks.all_areas_competitions.all_areas_competitions',
        'schedule': crontab(day_of_month=4, hour=6)
        },

    # get all teams from all competitions in db
    'sofascore-teams-auto-scrap': {
        'task': 'lib.sofascore.tasks.all_competitions_teams.all_competitions_teams',
        'schedule': crontab(day_of_month=7)
        },

    # get all players from all teams in db
    'sofascore-players-auto-scrap': {
        'task': 'lib.sofascore.tasks.all_teams_players_details.all_teams_players_details',
        'schedule': crontab(day_of_month=11)
        },

    # ==== TMKT ====
    # get all competitions
    'tmkt-competitions-auto-scrap': {
        'task': 'lib.tmkt.tasks.all_competitions.all_competitions',
        'schedule': crontab(day_of_month=4, hour=8)
        },

    # get all teams from all competitions in db
    'tmkt-teams-auto-scrap': {
        'task': 'lib.tmkt.tasks.all_competitions_teams.all_competitions_teams',
        'schedule': crontab(day_of_month=14)
        },

    # get all players from all teams in db
    'tmkt-players-auto-scrap': {
        'task': 'lib.tmkt.tasks.all_players_details.all_players_details',
        'schedule': crontab(day_of_month=18)
        },

    # ==== PRO PLAYERS ====
    # Create index for tmkt, sofascore, soccerway players
    'pro-players-indexing': {
        'task': 'lib.pro.tasks.create_players_indexes.create_players_indexes',
        'schedule': crontab(day_of_month=20)
        },

    # === BALLIN UPDATE ====
    'ballin-fff_missing_matches-update': {
        'task': 'lib.ballin.tasks.update_fff_matches.update_fff_matches',
        # daily at 22h
        'schedule': crontab(hour=22)
        },
    # 'ballin-fff_teams-update': {
        # 'task': 'lib.ballin.tasks.update_fff_teams.update_fff_teams',
        # 'schedule': crontab(day_of_month=1)
        # },

    # 'ballin-search-pro_players-update': {
        # 'task': 'lib.ballin_search.tasks.update_pro_players.update_pro_players',
        # 'schedule': crontab(day_of_month=1)
        # },

    }



app.conf.timezone = 'UTC'
