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
docs = db.collection('matches').stream()
with open('matches_list_audit.txt', 'w', encoding='utf-8') as f:
    for doc in docs:
        if doc.id == 'next_match': continue
        data = doc.to_dict()
        f.write(f"{doc.id} -> {data.get('home_team')} x {data.get('away_team')} | {data.get('date')} | {data.get('championship')}\n")
print("Done")
