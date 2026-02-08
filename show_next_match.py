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

next_match = db.collection('matches').document('next_match').get()

if next_match.exists:
    data = next_match.to_dict()
    print("\n" + "="*60)
    print("CURRENT next_match DOCUMENT:")
    print("="*60)
    print(f"Home Team: {data.get('home_team')}")
    print(f"Away Team: {data.get('away_team')}")
    print(f"Date: {data.get('date')}")
    print(f"Championship: {data.get('championship')}")
    print(f"Stadium: {data.get('stadium')}")
    print(f"Transmission: {data.get('transmission')}")
    print("="*60)
else:
    print("No next_match found!")
