import os
import firebase_admin
from firebase_admin import credentials, firestore
import json
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env.local"))

def initialize_firebase():
    if not firebase_admin._apps:
        cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
        firebase_creds_json = os.getenv("FIREBASE_CREDENTIALS_JSON")

        if firebase_creds_json:
            cred_dict = json.loads(firebase_creds_json)
            cred = credentials.Certificate(cred_dict)
        elif cred_path and os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
        else:
            possible_paths = [
                os.path.join(os.path.dirname(__file__), "service-account-new.json"),
                os.path.join(os.path.dirname(__file__), "service-account.json"),
                "service-account.json",
                "backend/service-account.json"
            ]
            for p in possible_paths:
                if os.path.exists(p):
                    cred = credentials.Certificate(p)
                    break
            else:
                print("Error: No credentials found.")
                return None
        
        firebase_admin.initialize_app(cred)
    
    return firestore.client()

def seed_match_stats():
    db = initialize_firebase()
    if not db:
        return

    print("Seeding Match Statistics...")

    # Real data for Botafogo matches in Carioca 2026
    statsBatch = [
        {
            "match_id": "bot_v_bang_2026_01_24",
            "home_team": "Botafogo",
            "away_team": "Bangu",
            "date": "2026-01-24T21:00:00-03:00",
            "score": "2 - 0",
            "championship": "Campeonato Carioca",
            "stats": {
                "possession": {"home": 74, "away": 26},
                "shots": {"home": 11, "away": 4},
                "shots_on_target": {"home": 6, "away": 2},
                "shots_off_target": {"home": 3, "away": 1},
                "shots_blocked": {"home": 2, "away": 1},
                "corners": {"home": 9, "away": 2},
                "fouls": {"home": 11, "away": 16},
                "yellow_cards": {"home": 2, "away": 3},
                "red_cards": {"home": 0, "away": 0},
                "pass_accuracy": {"home": 89, "away": 72},
                "tackles_won": {"home": 14, "away": 10},
                "tackles_suffered": {"home": 10, "away": 14},
                "interceptions": {"home": 8, "away": 12},
                "duels_won_percent": {"home": 61, "away": 39}
            },
            "motm_data": {
                "name": "Santi Rodríguez",
                "rating": 8.7,
                "position": "Meia Atacante",
                "contribution": "1 Gol de Falta, 4 Passes Decisivos"
            },
            "goalkeeper_stats": {
                "name": "Neto",
                "saves": 1,
                "saves_inside_box": 1,
                "punched_clear": 1,
                "high_claims": 2,
                "clean_sheet": True
            },
            "pass_map_data": [
                {"from": "Danilo", "to": "Santi Rodríguez", "weight": 28},
                {"from": "Vitinho", "to": "Nathan", "weight": 22},
                {"from": "Alex Telles", "to": "Santi Rodríguez", "weight": 24},
                {"from": "Barboza", "to": "Danilo", "weight": 19},
                {"from": "Mateo Ponte", "to": "Arthur Cabral", "weight": 15}
            ],
            "events": [
                {"minute": 30, "team": "home", "type": "yellow_card", "player": "Alexander Barboza"},
                {"minute": 45, "team": "away", "type": "substitution", "player_in": "Anderson Khun", "player_out": "Somália"},
                {"minute": 54, "team": "home", "type": "goal", "player": "Santi Rodríguez", "assist": "Falta Direta"},
                {"minute": 62, "team": "away", "type": "yellow_card", "player": "Felipe Soares"},
                {"minute": 65, "team": "home", "type": "substitution", "player_in": "Matheus Martins", "player_out": "Montoro"},
                {"minute": 74, "team": "home", "type": "goal", "player": "Alex Telles", "assist": "Pênalti"},
                {"minute": 80, "team": "home", "type": "substitution", "player_in": "Alexander Telles", "player_out": "Nathan"},
                {"minute": 85, "team": "away", "type": "yellow_card", "player": "Walber"},
                {"minute": 90, "team": "home", "type": "substitution", "player_in": "Kauan Toledo", "player_out": "Arthur Cabral"},
            ],
            "pass_stats": {
                "accurate_passes": {"home": 642, "away": 135, "home_total": 720, "away_total": 190},
                "sideways_passes": {"home": 20, "away": 14, "home_total": 20, "away_total": 14},
                "final_third_entries": {"home": 80, "away": 32, "home_total": 80, "away_total": 32},
                "final_third_accuracy": {"home": 122, "away": 30, "home_total": 156, "away_total": 53},
                "long_passes": {"home": 19, "away": 15, "home_total": 32, "away_total": 41},
                "crosses": {"home": 5, "away": 3, "home_total": 18, "away_total": 9}
            },
            "updated_at": firestore.SERVER_TIMESTAMP
        },
        {
            "match_id": "bot_v_volt_2026_01_21",
            "home_team": "Botafogo",
            "away_team": "Volta Redonda",
            "date": "2026-01-21T19:00:00-03:00",
            "score": "1 - 0",
            "championship": "Campeonato Carioca",
            "stats": {
                "possession": {"home": 54, "away": 46},
                "shots": {"home": 12, "away": 8},
                "shots_on_target": {"home": 5, "away": 2},
                "corners": {"home": 6, "away": 4},
                "fouls": {"home": 14, "away": 12},
                "yellow_cards": {"home": 2, "away": 2},
                "red_cards": {"home": 0, "away": 0},
                "pass_accuracy": {"home": 84, "away": 81}
            },
            "events": [
                {"minute": 66, "team": "home", "type": "goal", "player": "Álvaro Montoro", "assist": "Artur Jorge (Tático)"},
                {"minute": 75, "team": "home", "type": "yellow_card", "player": "Alexander Barboza"},
                {"minute": 88, "team": "home", "type": "yellow_card", "player": "Montoro"},
                {"minute": 40, "team": "away", "type": "yellow_card", "player": "Dener"},
                {"minute": 85, "team": "away", "type": "yellow_card", "player": "MV"}
            ],
            "updated_at": firestore.SERVER_TIMESTAMP
        },
        {
            "match_id": "samp_v_bot_2026_01_18",
            "home_team": "Sampaio Corrêa-RJ",
            "away_team": "Botafogo",
            "date": "2026-01-18T20:30:00-03:00",
            "score": "2 - 1",
            "championship": "Campeonato Carioca",
            "stats": {
                "possession": {"home": 42, "away": 58},
                "shots": {"home": 8, "away": 14},
                "shots_on_target": {"home": 4, "away": 6},
                "corners": {"home": 3, "away": 9},
                "fouls": {"home": 16, "away": 10},
                "yellow_cards": {"home": 3, "away": 2},
                "red_cards": {"home": 0, "away": 1},
                "pass_accuracy": {"home": 72, "away": 81}
            },
            "events": [
                {"minute": 20, "team": "away", "type": "goal", "player": "Kauan Toledo", "assist": "Base"},
                {"minute": 35, "team": "away", "type": "red_card", "player": "Rogerinho"},
                {"minute": 44, "team": "home", "type": "goal", "player": "Rodrigo Andrade"},
                {"minute": 78, "team": "home", "type": "goal", "player": "Lucas Marreta"}
            ],
            "updated_at": firestore.SERVER_TIMESTAMP
        },
        {
            "match_id": "port_v_bot_2026_01_15",
            "home_team": "Portuguesa-RJ",
            "away_team": "Botafogo",
            "date": "2026-01-15T19:00:00-03:00",
            "score": "0 - 2",
            "championship": "Campeonato Carioca",
            "stats": {
                "possession": {"home": 48, "away": 52},
                "shots": {"home": 7, "away": 11},
                "shots_on_target": {"home": 2, "away": 5},
                "corners": {"home": 5, "away": 4},
                "fouls": {"home": 15, "away": 13},
                "yellow_cards": {"home": 2, "away": 1},
                "red_cards": {"home": 0, "away": 0},
                "pass_accuracy": {"home": 78, "away": 82}
            },
            "events": [
                {"minute": 42, "team": "away", "type": "goal", "player": "Caio Valle", "assist": "Base"},
                {"minute": 85, "team": "away", "type": "goal", "player": "Lucas Camilo", "assist": "Base"}
            ],
            "updated_at": firestore.SERVER_TIMESTAMP
        }
    ]

    for stat in statsBatch:
        db.collection('match_stats').document(stat['match_id']).set(stat)
        print(f"Added stats for: {stat['home_team']} vs {stat['away_team']}")

    print("Seed complete!")

if __name__ == "__main__":
    seed_match_stats()
