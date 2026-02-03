import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

if not firebase_admin._apps:
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH", "backend/service-account-new.json")
    if not os.path.exists(cred_path):
        cred_path = "backend/service-account-new.json"
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def get_logo(team):
    logos = {
        "Botafogo": "https://upload.wikimedia.org/wikipedia/commons/5/52/Botafogo_de_Futebol_e_Regatas_logo.svg",
        "Fluminense": "https://upload.wikimedia.org/wikipedia/commons/a/ad/Fluminense_FC_escudo.png",
        "Grêmio": "/logos/gremio.png",
        "Vasco": "/logos/vasco.png",
        "Nacional Potosí": "/logos/nacional-potosi.png",
        "Cruzeiro": "/logos/cruzeiro.png"
    }
    return logos.get(team, "https://via.placeholder.com/64?text=" + team[:3])

def sync_matches():
    feb_matches = [
        { 
            "match_id": "bot_flu_2026_02_01",
            "date": "2026-02-01T20:30:00-03:00", 
            "championship": "Campeonato Carioca", 
            "location": "Estádio Nilton Santos", 
            "home_team": "Botafogo", 
            "away_team": "Fluminense", 
            "round": "Rodada 5",
            "status": "ENCERRADA",
            "home_score": 0,
            "away_score": 1,
            "display_time": "FIM DE JOGO"
        },
        { 
            "match_id": "gre_bot_2026_02_04",
            "date": "2026-02-04T16:00:00-03:00", 
            "championship": "Brasileirão 2026", 
            "location": "Arena do Grêmio", 
            "home_team": "Grêmio", 
            "away_team": "Botafogo", 
            "round": "Rodada 2",
            "status": "AGENDADO"
        },
        { 
            "match_id": "vas_bot_2026_02_08",
            "date": "2026-02-08T18:00:00-03:00", 
            "championship": "Campeonato Carioca", 
            "location": "São Januário", 
            "home_team": "Vasco", 
            "away_team": "Botafogo", 
            "round": "Rodada 6",
            "status": "AGENDADO"
        },
        { 
            "match_id": "flu_bot_2026_02_12",
            "date": "2026-02-12T19:30:00-03:00", 
            "championship": "Campeonato Carioca", 
            "location": "Maracanã", 
            "home_team": "Fluminense", 
            "away_team": "Botafogo", 
            "round": "Rodada 7",
            "status": "AGENDADO"
        },
        { 
            "match_id": "nac_bot_2026_02_18",
            "date": "2026-02-18T21:30:00-03:00", 
            "championship": "Libertadores", 
            "location": "Víctor Ugarte", 
            "home_team": "Nacional Potosí", 
            "away_team": "Botafogo", 
            "round": "Fase Preliminar",
            "status": "AGENDADO"
        },
        { 
            "match_id": "bot_nac_2026_02_25",
            "date": "2026-02-25T21:30:00-03:00", 
            "championship": "Libertadores", 
            "location": "Nilton Santos", 
            "home_team": "Botafogo", 
            "away_team": "Nacional Potosí", 
            "round": "Fase Preliminar",
            "status": "AGENDADO"
        }
    ]

    print("Syncing February matches...")
    for m in feb_matches:
        m['home_team_logo'] = get_logo(m['home_team'])
        m['away_team_logo'] = get_logo(m['away_team'])
        m['home_score'] = m.get('home_score', 0)
        m['away_score'] = m.get('away_score', 0)
        
        # Update or Add to main matches collection
        # We search for existing match by teams and approximate date if match_id isn't enough
        # But here we'll use match_id as document ID for consistency
        db.collection('matches').document(m['match_id']).set(m)
        print(f" > Synced: {m['home_team']} vs {m['away_team']} ({m['date']})")

    # Update next_match document
    # Current time is 2026-02-03. Next match is Grêmio vs Botafogo on Feb 4.
    next_match = feb_matches[1] # Grêmio vs Botafogo
    db.collection('matches').document('next_match').set(next_match)
    print(f"Updated 'next_match' to: {next_match['home_team']} vs {next_match['away_team']}")

if __name__ == "__main__":
    sync_matches()
