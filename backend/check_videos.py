
import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
from datetime import datetime

# Initialize Firebase (same as scraper)
if not firebase_admin._apps:
    cred_path = os.path.join(os.path.dirname(__file__), 'service-account.json')
    if os.path.exists(cred_path):
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    else:
        print("Service account not found.")
        exit(1)

db = firestore.client()

docs = db.collection('videos').limit(5).get()
print(f"Found {len(docs)} videos in DB:")
for doc in docs:
    data = doc.to_dict()
    print(f"- {data.get('title')} ({data.get('video_id')})")
