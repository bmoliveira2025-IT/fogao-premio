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
print(f"\nUpdating Vasco x Botafogo match to 18:00...")
print("=" * 70)

# Search for today's Vasco match
matches_ref = db.collection('matches')
found_match = None

for doc in matches_ref.stream():
    if doc.id == 'next_match':
        continue
    
    data = doc.to_dict()
    home = str(data.get('home_team', '')).lower()
    away = str(data.get('away_team', '')).lower()
    date_str = str(data.get('date', ''))
    
    # Check if it's Vasco match and today
    if ('vasco' in home or 'vasco' in away) and today_str in date_str:
        print(f"\n✅ FOUND: {data.get('home_team')} x {data.get('away_team')}")
        print(f"   ID: {doc.id}")
        print(f"   Current Date: {date_str}")
        
        found_match = {
            'id': doc.id,
            'data': data
        }
        break

if found_match:
    # Update with correct time: 18:00
    new_date = f'{today_str}T18:00:00-03:00'
    
    match_data = found_match['data'].copy()
    match_data['date'] = new_date
    match_data['transmission'] = 'Globo e Premier'
    match_data['match_id'] = found_match['id']
    
    # Update the match document
    db.collection('matches').document(found_match['id']).update({
        'date': new_date,
        'transmission': 'Globo e Premier'
    })
    print(f"\n✅ Updated match document with new time: 18:00")
    
    # Update next_match
    db.collection('matches').document('next_match').set(match_data)
    print("✅ Updated next_match document")
    
    print(f"\n🎯 next_match now shows: {match_data.get('home_team')} x {match_data.get('away_team')}")
    print(f"   Date/Time: {new_date}")
    print(f"   Transmission: {match_data.get('transmission')}")
    
else:
    print("\n❌ Vasco match not found in database for today!")
    print("\nCreating new match entry...")
    
    # Create new match with correct time
    match_id = f"vas_v_bot_{today_str.replace('-', '_')}"
    new_match = {
        'match_id': match_id,
        'home_team': 'Vasco',
        'away_team': 'Botafogo',
        'date': f'{today_str}T18:00:00-03:00',
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
    
    # Add to matches collection
    db.collection('matches').document(match_id).set(new_match)
    print(f"✅ Created match: {match_id}")
    
    # Update next_match
    db.collection('matches').document('next_match').set(new_match)
    print("✅ Updated next_match document")
    
    print(f"\n🎯 next_match now shows: Vasco x Botafogo at 18:00")
    print(f"   Transmission: Globo e Premier")

print("\n" + "=" * 70)
print("DONE!")
