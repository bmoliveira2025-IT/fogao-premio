import os
from datetime import datetime
import pytz
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase
if not firebase_admin._apps:
    cred_path = "backend/service-account-new.json"
    if not os.path.exists(cred_path):
        cred_path = "service-account-new.json"
    
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

# São Paulo timezone
tz = pytz.timezone('America/Sao_Paulo')
now = datetime.now(tz)
today_str = now.strftime('%Y-%m-%d')

print(f"Current time: {now.strftime('%Y-%m-%d %H:%M:%S')}")
print(f"\n{'='*70}")
print("ENSURING VASCO X BOTAFOGO MATCH EXISTS")
print(f"{'='*70}\n")

# Match details
match_id = f"vas_v_bot_{today_str.replace('-', '_')}"
match_date = f'{today_str}T18:00:00-03:00'

match_data = {
    'match_id': match_id,
    'home_team': 'Vasco',
    'away_team': 'Botafogo',
    'date': match_date,
    'championship': 'Campeonato Carioca',
    'stadium': 'São Januário',
    'location': 'São Januário',
    'transmission': 'Globo e Premier',
    'status': 'Agendado',
    'home_score': 0,
    'away_score': 0,
    'home_team_logo': '',
    'away_team_logo': ''
}

# Check if match already exists
existing = db.collection('matches').document(match_id).get()

if existing.exists:
    print(f"✅ Match {match_id} already exists in database")
    print(f"   Updating to ensure correct data...")
    db.collection('matches').document(match_id).update({
        'date': match_date,
        'transmission': 'Globo e Premier',
        'championship': 'Campeonato Carioca',
        'status': 'Agendado'
    })
    print(f"   ✅ Updated successfully")
else:
    print(f"📝 Creating new match: {match_id}")
    db.collection('matches').document(match_id).set(match_data)
    print(f"   ✅ Created successfully")

# Force update next_match to this game
print(f"\n{'='*70}")
print("UPDATING next_match DOCUMENT")
print(f"{'='*70}\n")

db.collection('matches').document('next_match').set(match_data)
print(f"✅ Set next_match to: Vasco x Botafogo")
print(f"   Date/Time: {match_date} (18:00)")
print(f"   Transmission: Globo e Premier")
print(f"   Championship: Campeonato Carioca")

print(f"\n{'='*70}")
print("✅ DONE! Match is now set as next_match")
print(f"   It will remain until 18:15 (start time + 15min grace period)")
print(f"{'='*70}\n")
