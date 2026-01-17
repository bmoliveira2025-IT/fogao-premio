import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Firebase
cred_path = os.getenv("SERVICE_ACCOUNT_PATH")

if not cred_path or not os.path.exists(cred_path):
    possible_paths = [
        os.path.join(os.path.dirname(__file__), "service-account-new.json"),
        os.path.join(os.path.dirname(__file__), "service-account.json"),
        os.path.join(os.getcwd(), "backend", "service-account.json"),
        "service-account.json"
    ]
    for p in possible_paths:
        if os.path.exists(p):
            cred_path = p
            break

print(f"Loading credentials from: {cred_path}")

if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def remove_night_live():
    print("Scanning for 'Night Live' news...")
    
    docs = db.collection('news').stream()
    
    count = 0
    deleted = 0
    batch = db.batch()
    batch_count = 0
    
    for doc in docs:
        count += 1
        data = doc.to_dict()
        title = data.get('title', '')
        
        # Check specifically for "Night Live" (case insensitive)
        if "night live" in title.lower():
            print(f"Flagged for DELETION: {title}")
            batch.delete(doc.reference)
            batch_count += 1
            deleted += 1
            
            if batch_count >= 400:
                batch.commit()
                batch = db.batch()
                batch_count = 0

    if batch_count > 0:
        batch.commit()
        
    print(f"Scanned {count} articles. Deleted {deleted} 'Night Live' articles.")

if __name__ == "__main__":
    remove_night_live()
