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

output_file = "next_match_info.txt"

with open(output_file, "w", encoding="utf-8") as f:
    if next_match.exists:
        data = next_match.to_dict()
        f.write("="*60 + "\n")
        f.write("CURRENT next_match DOCUMENT:\n")
        f.write("="*60 + "\n")
        f.write(f"Home Team: {data.get('home_team')}\n")
        f.write(f"Away Team: {data.get('away_team')}\n")
        f.write(f"Date: {data.get('date')}\n")
        f.write(f"Championship: {data.get('championship')}\n")
        f.write(f"Stadium: {data.get('stadium')}\n")
        f.write(f"Location: {data.get('location')}\n")
        f.write(f"Transmission: {data.get('transmission')}\n")
        f.write(f"Status: {data.get('status')}\n")
        f.write("="*60 + "\n")
        print(f"Output saved to {output_file}")
    else:
        f.write("No next_match found!\n")
        print("No next_match found!")
