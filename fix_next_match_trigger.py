import os
import firebase_admin
from firebase_admin import credentials, firestore
import pytz
from datetime import datetime, timedelta

# Import the logic or just reimplement it briefly for the trigger
def trigger_update():
    cred_path = "backend/service-account-new.json"
    if not os.path.exists(cred_path):
        cred_path = "service-account-new.json"
    
    if os.path.exists(cred_path):
        if not firebase_admin._apps:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        db = firestore.client()
        
        print("Triggering next match update...")
        
        # We'll use the logic from scraper.py (simplified/standalone)
        tz = pytz.timezone('America/Sao_Paulo')
        now = datetime.now(tz)
        
        matches_ref = db.collection('matches')
        docs = matches_ref.stream()
        
        future_matches = []
        for doc in docs:
            if doc.id == 'next_match': continue
            data = doc.to_dict()
            if 'date' not in data: continue
            
            match_date_raw = data['date']
            try:
                if isinstance(match_date_raw, str):
                    match_date = datetime.fromisoformat(match_date_raw.replace('Z', '+00:00'))
                else:
                    match_date = match_date_raw
                if match_date.tzinfo is None:
                    match_date = match_date.replace(tzinfo=pytz.UTC)
            except: continue

            match_date_sp = match_date.astimezone(tz)
            
            # Include upcoming matches or very recent ones
            if match_date_sp > (now - timedelta(hours=2.5)):
                data['match_id'] = doc.id
                future_matches.append((match_date_sp, data))

        future_matches.sort(key=lambda x: x[0])
        
        # Filter out finished ones
        next_match_candidates = [m for _, m in future_matches if m.get('status') not in ['ENCERRADA', 'Finalizado', 'FINALIZADO']]
        
        if next_match_candidates:
            next_match = next_match_candidates[0]
            print(f"UPDATING next_match to: {next_match.get('home_team')} x {next_match.get('away_team')}")
            db.collection('matches').document('next_match').set(next_match)
            print("Done.")
        else:
            print("No suitable next match found.")
            
    else:
        print("Credentials not found")

if __name__ == "__main__":
    trigger_update()
