import os
import json
import firebase_admin
from firebase_admin import credentials, firestore

def dump_gremio_to_json():
    cred_path = "backend/service-account-new.json"
    if not os.path.exists(cred_path):
        cred_path = "service-account-new.json"
    
    if os.path.exists(cred_path):
        if not firebase_admin._apps:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        db = firestore.client()
        
        matches_ref = db.collection('matches')
        docs = matches_ref.stream()
        
        found_matches = []
        for doc in docs:
            data = doc.to_dict()
            home = data.get('home_team', '')
            away = data.get('away_team', '')
            if 'Grêmio' in home or 'Grêmio' in away or 'Gremio' in home or 'Gremio' in away:
                match_info = {}
                for key, value in data.items():
                    if hasattr(value, 'isoformat'):
                        match_info[key] = value.isoformat()
                    else:
                        match_info[key] = value
                match_info['id'] = doc.id
                found_matches.append(match_info)
        
        with open('gremio_matches.json', 'w', encoding='utf-8') as f:
            json.dump(found_matches, f, ensure_ascii=False, indent=2)
            
        print(f"Dumped {len(found_matches)} matches to gremio_matches.json")
            
    else:
        print("Credentials not found")

if __name__ == "__main__":
    dump_gremio_to_json()
