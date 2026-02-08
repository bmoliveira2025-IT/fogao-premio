import os
import firebase_admin
from firebase_admin import credentials, firestore

if not firebase_admin._apps:
    cred_path = "backend/service-account-new.json"
    if not os.path.exists(cred_path):
        cred_path = "service-account-new.json"
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

print("=" * 70)
print("SEARCHING FOR FLUMINENSE X BOTAFOGO MATCH")
print("=" * 70)

# Search for Fluminense match
matches_ref = db.collection('matches')
found = False

for doc in matches_ref.stream():
    if doc.id == 'next_match':
        continue
    
    data = doc.to_dict()
    home = str(data.get('home_team', '')).lower()
    away = str(data.get('away_team', '')).lower()
    
    if ('fluminense' in home or 'fluminense' in away):
        print(f"\nFound: {data.get('home_team')} x {data.get('away_team')}")
        print(f"ID: {doc.id}")
        print(f"Date: {data.get('date')}")
        print(f"Current Championship: {data.get('championship')}")
        
        # Update to Brasileirão
        db.collection('matches').document(doc.id).update({
            'championship': 'Brasileirão'
        })
        print(f"✅ Updated championship to: Brasileirão")
        
        # If this is the next_match, update it too
        next_match = db.collection('matches').document('next_match').get()
        if next_match.exists:
            next_data = next_match.to_dict()
            if next_data.get('match_id') == doc.id:
                db.collection('matches').document('next_match').update({
                    'championship': 'Brasileirão'
                })
                print(f"✅ Also updated next_match document")
        
        found = True
        break

if not found:
    print("\n❌ Fluminense match not found!")

print("\n" + "=" * 70)
