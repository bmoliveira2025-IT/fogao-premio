import os
import json
from datetime import datetime, timezone
import pytz
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase
cred_path = "backend/service-account-new.json"
if not os.path.exists(cred_path):
    cred_path = "service-account-new.json"

if os.path.exists(cred_path):
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    
    # Get all matches
    matches_ref = db.collection('matches')
    docs = matches_ref.stream()
    
    # São Paulo timezone
    tz = pytz.timezone('America/Sao_Paulo')
    now = datetime.now(tz)
    today_date = now.date()
    
    print(f"Current time: {now.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Today's date: {today_date}")
    print("\n=== TODAY'S AND FUTURE MATCHES ===\n")
    
    future_matches = []
    
    for doc in docs:
        if doc.id == 'next_match':
            continue
            
        data = doc.to_dict()
        date_raw = data.get('date')
        
        if date_raw:
            try:
                if isinstance(date_raw, str):
                    match_date = datetime.fromisoformat(date_raw.replace('Z', '+00:00'))
                else:
                    match_date = date_raw.replace(tzinfo=timezone.utc)
                
                match_date_sp = match_date.astimezone(tz)
                match_date_only = match_date_sp.date()
                
                # Today's and future matches
                if match_date_only >= today_date:
                    is_today = match_date_only == today_date
                    future_matches.append({
                        'id': doc.id,
                        'date': match_date_sp,
                        'home': data.get('home_team', ''),
                        'away': data.get('away_team', ''),
                        'championship': data.get('championship', ''),
                        'stadium': data.get('stadium', ''),
                        'transmission': data.get('transmission', ''),
                        'is_today': is_today
                    })
            except Exception as e:
                print(f"Error parsing date for {doc.id}: {e}")
    
    # Sort by date
    future_matches.sort(key=lambda x: x['date'])
    
    # Display
    for i, match in enumerate(future_matches[:10], 1):
        marker = ">>> TODAY <<<" if match['is_today'] else ""
        print(f"{i}. {match['home']} x {match['away']} {marker}")
        print(f"   ID: {match['id']}")
        print(f"   Data/Hora: {match['date'].strftime('%Y-%m-%d %H:%M')}")
        print(f"   Campeonato: {match['championship']}")
        print(f"   Estádio: {match['stadium']}")
        print(f"   Transmissão: {match['transmission']}")
        print()
    
    # Check next_match document
    print("\n=== CURRENT next_match DOCUMENT ===")
    next_match_doc = db.collection('matches').document('next_match').get()
    if next_match_doc.exists:
        nm = next_match_doc.to_dict()
        print(f"Home: {nm.get('home_team')}")
        print(f"Away: {nm.get('away_team')}")
        print(f"Date: {nm.get('date')}")
        print(f"Championship: {nm.get('championship')}")
    else:
        print("No next_match document found!")
        
else:
    print("Credentials not found")
