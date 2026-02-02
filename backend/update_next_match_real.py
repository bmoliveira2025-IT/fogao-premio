import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import pytz
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
        else:
            print("Credentials not found")
            exit(1)
    return firestore.client()

db = init_firebase()

def update_next_match():
    print("Searching for next match...")
    
    # Get current time in Sao Paulo
    tz = pytz.timezone('America/Sao_Paulo')
    now = datetime.now(tz)
    print(f"Current Time: {now}")

    # Get all matches
    matches_ref = db.collection('matches')
    # Filter on client side to avoid index issues for now, or use simple query
    # We want matches after NOW.
    
    docs = matches_ref.stream()
    
    future_matches = []
    
    for doc in docs:
        if doc.id == 'next_match': continue # Skip the pointer doc
        
        data = doc.to_dict()
        if 'date' not in data: continue
        
        # Handle date string or timestamp
        match_date_raw = data['date']
        
        try:
            if isinstance(match_date_raw, str):
                match_date = datetime.fromisoformat(match_date_raw.replace('Z', '+00:00'))
            else:
                # Firestore Timestamp
                match_date = match_date_raw.replace(tzinfo=pytz.UTC) # Assuming stored as UTC
        except Exception as e:
            print(f"Date parse error {match_date_raw}: {e}")
            continue

        # Convert to SP time for comparison
        match_date_sp = match_date.astimezone(tz)
        
        if match_date_sp > now:
            data['match_id'] = doc.id
            future_matches.append((match_date_sp, data))

    # Sort by date
    future_matches.sort(key=lambda x: x[0])
    
    if not future_matches:
        print("No future matches found.")
        return

    next_match = future_matches[0][1]
    print(f"Found next match: {next_match['home_team']} x {next_match['away_team']} at {next_match['date']}")
    
    # Update next_match doc
    update_data = {
        "home_team": next_match.get('home_team'),
        "away_team": next_match.get('away_team'),
        "home_score": 0, # Reset score
        "away_score": 0, # Reset score
        "date": next_match.get('date'),
        "location": next_match.get('location'),
        "championship": next_match.get('championship'),
        "status": "Agendado", # Reset status
        "display_time": "", # Reset display time
        "home_team_logo": next_match.get('home_team_logo'),
        "away_team_logo": next_match.get('away_team_logo'),
        "match_id": next_match.get('match_id')
    }
    
    db.collection('matches').document('next_match').set(update_data)
    print("Successfully updated matches/next_match")

if __name__ == "__main__":
    update_next_match()
