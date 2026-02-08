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

print("="*60)
print(f"CURRENT TIME: {now.strftime('%Y-%m-%d %H:%M:%S %Z')}")
print("="*60)

# Check next_match document
print("\n1. CURRENT next_match DOCUMENT:")
print("-" * 60)
next_match_doc = db.collection('matches').document('next_match').get()
if next_match_doc.exists:
    nm = next_match_doc.to_dict()
    print(f"   Home Team: {nm.get('home_team')}")
    print(f"   Away Team: {nm.get('away_team')}")
    print(f"   Date: {nm.get('date')}")
    print(f"   Championship: {nm.get('championship')}")
    print(f"   Stadium: {nm.get('stadium')}")
    print(f"   Transmission: {nm.get('transmission')}")
else:
    print("   ❌ No next_match document found!")

# Search for Vasco match
print("\n2. SEARCHING FOR VASCO MATCHES:")
print("-" * 60)
matches_ref = db.collection('matches')
all_matches = matches_ref.stream()

vasco_matches = []
for doc in matches_ref.stream():
    if doc.id == 'next_match':
        continue
    data = doc.to_dict()
    home = data.get('home_team', '').lower()
    away = data.get('away_team', '').lower()
    
    if 'vasco' in home or 'vasco' in away:
        date_str = data.get('date', '')
        vasco_matches.append({
            'id': doc.id,
            'home': data.get('home_team'),
            'away': data.get('away_team'),
            'date': date_str,
            'championship': data.get('championship', '')
        })

for vm in sorted(vasco_matches, key=lambda x: x['date']):
    print(f"\n   Match ID: {vm['id']}")
    print(f"   {vm['home']} x {vm['away']}")
    print(f"   Date: {vm['date']}")
    print(f"   Championship: {vm['championship']}")

print("\n" + "="*60)
