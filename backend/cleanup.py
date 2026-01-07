import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Firebase
cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
if not cred_path:
    cred_path = "service-account.json" # Fallback

if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def cleanup_duplicates():
    print("Starting duplicate cleanup...")
    docs = db.collection('news').stream()
    
    seen_urls = set()
    total_deleted = 0
    
    for doc in docs:
        data = doc.to_dict()
        url = data.get('original_url')
        title = data.get('title')
        
        # Identifier for duplication (prefer URL, fallback to title)
        identifier = url if url else title
        
        if identifier in seen_urls:
            print(f"Deleting duplicate: {title} ({doc.id})")
            db.collection('news').document(doc.id).delete()
            total_deleted += 1
        else:
            if identifier:
                seen_urls.add(identifier)

    print(f"Cleanup finished. Removed {total_deleted} duplicates.")

if __name__ == "__main__":
    cleanup_duplicates()
