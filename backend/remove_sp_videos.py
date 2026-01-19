
import firebase_admin
from firebase_admin import credentials, firestore

# Initialize only if not already initialized
if not firebase_admin._apps:
    try:
        cred = credentials.Certificate("service-account-new.json")
        firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Error init: {e}")
        # Try finding it in upper dir? No, assume cwd is backend as usual.

db = firestore.client()

print("Scanning for Botafogo-SP videos...")

# Get all videos
# Note: In a large DB this would be inefficient, but here it's fine.
docs = db.collection('videos').stream()

deleted_count = 0
for doc in docs:
    data = doc.to_dict()
    title = data.get('title', '').lower()
    
    if "botafogo-sp" in title or "botafogo sp" in title:
        print(f"Deleting: {data.get('title')} ({doc.id})")
        db.collection('videos').document(doc.id).delete()
        deleted_count += 1

print(f"Done! Deleted {deleted_count} videos.")
