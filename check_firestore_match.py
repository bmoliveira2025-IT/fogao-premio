
import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

def check_match_data():
    cred_path = "backend/service-account-new.json"
    if not os.path.exists(cred_path):
        cred_path = "service-account-new.json"
    
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        
        match_id = "gre_v_bot_2026_02_04"
        doc_ref = db.collection("match_stats").document(match_id)
        doc = doc_ref.get()
        
        if doc.exists:
            data = doc.to_dict()
            print(f"Match ID: {match_id}")
            print(f"Has Lineups: {'lineups' in data}")
            if 'lineups' in data:
                print(f"Lineup Home Formation: {data['lineups'].get('home', {}).get('formation')}")
                print(f"Lineup Away Formation: {data['lineups'].get('away', {}).get('formation')}")
            print(f"Has pass_stats: {'pass_stats' in data}")
            print(f"Has motm_data: {'motm_data' in data}")
        else:
            print(f"Document {match_id} not found in Firestore!")
    else:
        print("Credentials not found")

if __name__ == "__main__":
    check_match_data()
