import firebase_admin
from firebase_admin import credentials, firestore
import os

def init_firebase():
    if not firebase_admin._apps:
        cred_path = "backend/service-account-new.json"
        if not os.path.exists(cred_path):
            cred_path = "service-account-new.json"
        
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            return firestore.client()
    return firestore.client()

db = init_firebase()

update_data = {
    "home_team": "Botafogo",
    "away_team": "Cruzeiro",
    "home_score": 4,
    "away_score": 0,
    "status": "ENCERRADA",
    "display_time": "FIM DE JOGO",
    "match_id": "bot_v_cruz_2026_01_29",
    "championship": "Campeonato Brasileiro"
}

print("Forcing update on matches/next_match...")
db.collection("matches").document("next_match").set(update_data, merge=True)
print("Update complete.")
