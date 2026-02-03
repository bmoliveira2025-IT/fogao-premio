import firebase_admin
from firebase_admin import credentials, firestore
import os

if not firebase_admin._apps:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    cred_path = os.path.join(script_dir, "service-account-new.json")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def aggressive_cleanup():
    print("Aggressively cleaning matches collection...")
    batch = db.batch()
    docs = db.collection('matches').stream()
    count = 0
    for doc in docs:
        batch.delete(doc.reference)
        count += 1
        if count >= 400: # Batch limit
            batch.commit()
            batch = db.batch()
            count = 0
    batch.commit()
    print("Cleanup complete.")

if __name__ == "__main__":
    aggressive_cleanup()
