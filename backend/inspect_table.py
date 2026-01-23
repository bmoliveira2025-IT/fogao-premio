
import firebase_admin
from firebase_admin import credentials, firestore
import os
import json

if not firebase_admin._apps:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    cred_path = os.path.join(current_dir, "service-account-new.json")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

doc = db.collection('championship_table').document('carioca_2026').get()

if doc.exists:
    data = doc.to_dict()
    standings = data.get('standings', [])
    print(f"Table Name: {data.get('name')}")
    print(f"Updated At: {data.get('updated_at')}")
    
    print("\n--- Group A ---")
    for s in [x for x in standings if x.get('group') == 'Grupo A']:
        print(f"{s.get('position')}. {s.get('team')}: {s.get('points')} pts ({s.get('games')} games)")
    
    print("\n--- Group B ---")
    for s in [x for x in standings if x.get('group') == 'Grupo B']:
        print(f"{s.get('position')}. {s.get('team')}: {s.get('points')} pts ({s.get('games')} games)")
else:
    print("No table data found for carioca_2026")
