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

# Get all videos
videos_ref = db.collection('videos')
docs = videos_ref.limit(20).stream()

print("=" * 70)
print("CHECKING VIDEO SOURCES:")
print("=" * 70)

for doc in docs:
    data = doc.to_dict()
    source = data.get('source', 'NO SOURCE')
    title = data.get('title', 'NO TITLE')
    
    print(f"\nTitle: {title[:60]}...")
    print(f"Source: '{source}'")
    print(f"Source Upper: '{source.upper() if source else 'NONE'}'")

print("\n" + "=" * 70)
