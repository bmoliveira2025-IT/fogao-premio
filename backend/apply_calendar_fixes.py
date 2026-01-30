
import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
from dotenv import load_dotenv

load_dotenv()
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env.local"))

if not firebase_admin._apps:
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def apply_fixes():
    # 1. Update Bangu match
    bangu_id = "GPJWeOHYGaanin9G4HAN"
    db.collection('matches').document(bangu_id).update({
        "status": "ENCERRADA",
        "home_score": 1,
        "away_score": 0,
        "display_time": "FIM DE JOGO"
    })
    print(f"Bangu match {bangu_id} updated to 1-0.")

    # 2. Add/Update Cruzeiro match
    # Based on search, BCR8tR44phW5eWiMi09f is a future Cruzeiro x Botafogo (July).
    # We need a Jan 29 match. Let's create a specific ID or check for duplicates again.
    # The previous list_matches_full showed 'next_match' was Cruzeiro.
    # We want to keep Jan 29 historical.
    
    cruzeiro_match = {
        "home_team": "Botafogo",
        "away_team": "Cruzeiro",
        "home_score": 4,
        "away_score": 0,
        "date": "2026-01-29T21:30:00-03:00",
        "location": "Estádio Nilton Santos • Rio de Janeiro",
        "championship": "Brasileirão Betano",
        "status": "ENCERRADA",
        "display_time": "FIM DE JOGO",
        "home_team_logo": "https://upload.wikimedia.org/wikipedia/commons/5/52/Botafogo_de_Futebol_e_Regatas_logo.svg",
        "away_team_logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Cruzeiro_Esporte_Clube_%28logo%29.svg/330px-Cruzeiro_Esporte_Clube_%28logo%29.svg.png",
        "match_id": "bot_v_cruz_2026_01_29"
    }
    
    # Add to matches collection
    db.collection('matches').document(cruzeiro_match["match_id"]).set(cruzeiro_match)
    print("Cruzeiro match (Jan 29) added/updated in 'matches' collection.")

    # 3. Add Analysis for Cruzeiro
    # Load from manual_live_game.json
    manual_path = os.path.join(os.getcwd(), "manual_live_game.json")
    if not os.path.exists(manual_path):
        # Fallback if executing from different dir
        manual_path = os.path.join(os.path.dirname(__file__), "manual_live_game.json")
        
    with open(manual_path, "r", encoding="utf-8") as f:
        analysis_data = json.load(f)
    
    # Ensure it's the right one
    analysis_data["match_id"] = "bot_v_cruz_2026_01_29"
    analysis_data["status"] = "ENCERRADA"
    
    db.collection('match_stats').document(analysis_data["match_id"]).set(analysis_data)
    print("Cruzeiro match analysis added to 'match_stats' collection.")

    # 4. Verify next_match is still Fluminense
    next_match_doc = db.collection('matches').document('next_match').get().to_dict()
    if next_match_doc:
        print(f"Current next_match: {next_match_doc.get('home_team')} x {next_match_doc.get('away_team')} on {next_match_doc.get('date')}")

if __name__ == "__main__":
    apply_fixes()
