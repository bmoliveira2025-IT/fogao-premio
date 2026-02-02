import firebase_admin
from firebase_admin import credentials, firestore
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

if not firebase_admin._apps:
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
    
    # Try multiple paths
    possible_paths = [
        cred_path,
        "backend/service-account-new.json",
        "service-account-new.json",
        os.path.join(os.path.dirname(__file__), "service-account-new.json")
    ]
    
    loaded = False
    for p in possible_paths:
        if p and os.path.exists(p):
            try:
                cred = credentials.Certificate(p)
                firebase_admin.initialize_app(cred)
                print(f"Loaded credentials from: {p}")
                loaded = True
                break
            except Exception as e:
                print(f"Failed to load {p}: {e}")
    
    if not loaded:
        print("No valid credential found. checked:", possible_paths)
        exit(1)

db = firestore.client()

def list_future_matches():
    print("Listing matches after 2026-02-02...")
    matches_ref = db.collection('matches')
    # Simple query
    docs = matches_ref.stream()
    
    future_matches = []
    
    now_str = "2026-02-02T00:00:00"
    
    count = 0
    for doc in docs:
        if doc.id == 'next_match': continue
        
        data = doc.to_dict()
        date = data.get('date')
        if not date: continue
        
        # Normalize date string
        # Assuming ISO format
        if date > now_str:
            future_matches.append(data)
        count += 1

    print(f"Total matches scanned: {count}")
    print(f"Future matches found: {len(future_matches)}")
    
    # Sort by date
    future_matches.sort(key=lambda x: x['date'])
    
    for m in future_matches[:5]:
        print(f"{m['date']} - {m.get('home_team')} x {m.get('away_team')} ({m.get('championship')})")

if __name__ == "__main__":
    list_future_matches()
