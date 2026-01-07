import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

if not firebase_admin._apps:
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def update_time():
    print("--- UPDATING MATCH TIME to 16:00 (19:00 UTC) ---")
    
    # 19:00 UTC is 16:00 BRT
    new_date = "2026-01-28T19:00:00Z"
    
    db.collection('matches').document('next_match').update({
        'date': new_date
    })
            
    print(f"Time updated successfully to: {new_date}")

if __name__ == "__main__":
    update_time()
