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

print("=== Scanning matches collection ===")
matches = db.collection("matches").stream()
for m in matches:
    data = m.to_dict()
    home = data.get('home_team', '')
    away = data.get('away_team', '')
    if 'botafogo' in home.lower() and 'cruzeiro' in away.lower():
        print(f"Match Found! Doc ID: {m.id}")
        print(f"Data: {data}")
    elif 'cruzeiro' in home.lower() and 'botafogo' in away.lower():
        print(f"Match Found! Doc ID: {m.id}")
        print(f"Data: {data}")
