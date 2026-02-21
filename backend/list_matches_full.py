
import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
from datetime import datetime
import pytz

def init_firebase():
    if not firebase_admin._apps:
        cred_path = "backend/service-account-new.json"
        if not os.path.exists(cred_path):
            cred_path = "service-account-new.json"
        
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            return firestore.client()
        else:
            print("Credentials not found")
            exit(1)
    return firestore.client()

db = init_firebase()

def list_all_matches():
    docs = db.collection('matches').stream()
    tz = pytz.timezone('America/Sao_Paulo')
    
    matches = []
    for doc in docs:
        if doc.id == 'next_match': continue
        data = doc.to_dict()
        data['id'] = doc.id
        
        match_date_raw = data.get('date')
        if not match_date_raw: continue
        
        try:
            if isinstance(match_date_raw, str):
                match_date = datetime.fromisoformat(match_date_raw.replace('Z', '+00:00'))
            else:
                match_date = match_date_raw
            
            if match_date.tzinfo is None:
                match_date = match_date.replace(tzinfo=pytz.UTC)
            
            data['date_obj'] = match_date.astimezone(tz)
            matches.append(data)
        except Exception as e:
            print(f"Error parsing date for {doc.id}: {e}")

    # Sort by date
    matches.sort(key=lambda x: x['date_obj'])
    
    output = []
    output.append(f"\nTotal matches found: {len(matches)}")
    output.append(f"{'ID':<20} | {'Date (SP)':<20} | {'Match':<40} | {'Competition'}")
    output.append("-" * 110)
    for m in matches:
        date_str = m['date_obj'].strftime('%Y-%m-%d %H:%M')
        match_str = f"{m.get('home_team')} x {m.get('away_team')}"
        comp = m.get('competition', m.get('league', 'N/A'))
        output.append(f"{m['id'][:20]:<20} | {date_str:<20} | {match_str:<40} | {comp}")
    
    with open('backend/matches_list_output.txt', 'w', encoding='utf-8') as f:
        f.write("\n".join(output))
    print(f"Results written to backend/matches_list_output.txt")

if __name__ == "__main__":
    list_all_matches()
