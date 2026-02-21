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
                # Handle various ISO formats
                clean_date = match_date_raw.replace('Z', '+00:00')
                match_date = datetime.fromisoformat(clean_date)
            else:
                # Firestore Timestamp
                match_date = match_date_raw
            
            if match_date.tzinfo is None:
                match_date = match_date.replace(tzinfo=pytz.UTC)
        except Exception as e:
            print(f"Date parse error {match_date_raw}: {e}")
            continue

        # Convert to SP time for comparison
        match_date_sp = match_date.astimezone(tz)
        
        # LOGGING
        print(f"Checking {data.get('home_team')} x {data.get('away_team')}: {match_date_sp}")

        # Check if match is upcoming (future)
        # We also include matches that started very recently (last 2 hours)
        from datetime import timedelta
        if match_date_sp > (now - timedelta(hours=2)):
            data['match_id'] = doc.id
            future_matches.append((match_date_sp, data))

    # Sort by date
    future_matches.sort(key=lambda x: x[0])
    
    if not future_matches:
        print("No future matches found.")
        return

    # Check current next_match
    try:
        current_next = db.collection('matches').document('next_match').get()
        if current_next.exists:
            current_data = current_next.to_dict()
            current_date_raw = current_data.get('date')
            
            if current_date_raw:
                if isinstance(current_date_raw, str):
                    current_match_date = datetime.fromisoformat(current_date_raw.replace('Z', '+00:00'))
                else:
                    current_match_date = current_date_raw
                
                if current_match_date.tzinfo is None:
                    current_match_date = current_match_date.replace(tzinfo=pytz.UTC)
                    
                current_match_sp = current_match_date.astimezone(tz)
                
                # If current match is today AND hasn't finished yet, KEEP IT
                # A match is "finished" in this context if we are 3 hours past start time
                # OR if it's explicitly marked as Finalizado
                is_finished = current_data.get('status', '').lower() == 'finalizado'
                if current_match_sp.date() == now.date() and now < (current_match_sp + timedelta(hours=3)) and not is_finished:
                    print(f"KEEPING TODAY'S MATCH: {current_data.get('home_team')} x {current_data.get('away_team')}")
                    return

    except Exception as e:
        print(f"Error checking current next_match: {e}")

    # Pick the absolute next match
    next_match = future_matches[0][1]
    print(f"SELECTED NEXT MATCH: {next_match['home_team']} x {next_match['away_team']} at {next_match['date']}")
    
    # Update next_match doc
    db.collection('matches').document('next_match').set(next_match)
    print("Successfully updated matches/next_match")

if __name__ == "__main__":
    update_next_match()

if __name__ == "__main__":
    update_next_match()
