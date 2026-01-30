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

print("ID | Home x Away | date | status | home_score | away_score | match_id")
print("-" * 100)
matches = db.collection("matches").stream()
for m in matches:
    data = m.to_dict()
    home = data.get('home_team', '').lower()
    away = data.get('away_team', '').lower()
    
    if ('botafogo' in home and 'cruzeiro' in away) or ('cruzeiro' in home and 'botafogo' in away):
        print(f"{m.id} | {data.get('home_team')} x {data.get('away_team')} | {data.get('date')} | {data.get('status')} | {data.get('home_score')} | {data.get('away_score')} | {data.get('match_id')}")
