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

# 1. Update existing matches to ensure match_id is present
print("Updating match_id in 'matches' collection...")
matches = db.collection("matches").stream()
for m in matches:
    data = m.to_dict()
    home = data.get('home_team', '').lower()
    away = data.get('away_team', '').lower()
    
    m_id = None
    if 'botafogo' in home and 'cruzeiro' in away:
        m_id = "bot_v_cruz_2026_01_29"
    elif 'cruzeiro' in home and 'botafogo' in away:
        m_id = "bot_v_cruz_2026_01_29"
    
    if m_id and data.get('match_id') != m_id:
        print(f"Updating match {m.id} with match_id: {m_id}")
        db.collection("matches").document(m.id).update({"match_id": m_id})

print("Done.")
