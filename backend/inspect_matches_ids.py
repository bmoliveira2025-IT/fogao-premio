import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
from datetime import datetime

def init_firebase():
    if not firebase_admin._apps:
        cred_path = "backend/service-account-new.json"
        if not os.path.exists(cred_path):
            cred_path = "service-account-new.json"
        
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            return firestore.client()
    return firestore.client()

db = init_firebase()

print("--- Matches Collection (List) ---")
matches = db.collection("matches").order_by("date", direction=firestore.Query.DESCENDING).limit(5).stream()
for m in matches:
    data = m.to_dict()
    print(f"ID: {m.id} | Date: {data.get('date')} | {data.get('home_team')} x {data.get('away_team')}")

print("\n--- Match Stats Collection (Details) ---")
stats = db.collection("match_stats").stream()
found = False
for s in stats:
    if "cruzeiro" in s.id.lower() or "bot_v_cruz" in s.id.lower():
        print(f"Detail ID found: {s.id}")
        found = True

if not found:
    print("No detail doc found matching 'cruzeiro' or 'bot_v_cruz'")
