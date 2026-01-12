import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Firebase
cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
# If env var is "service-account.json" (relative) but we are running from root, it might not find it if it is in backend/
if cred_path and not os.path.exists(cred_path):
    possible_fix = os.path.join("backend", cred_path)
    if os.path.exists(possible_fix):
        cred_path = possible_fix

if not cred_path or not os.path.exists(cred_path):
    # Fallback
    cred_path = os.path.join(os.path.dirname(__file__), "service-account-new.json")

print(f"Loading credentials from: {cred_path}")

if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def remove_botafogosp():
    print("Searching for 'Botafogo-SP' news...")
    
    # We can't easily query "contains" in Firestore, so we fetch all (or recent) and filter in memory.
    # Given the volume might be manageable, let's process reasonable batches or all if small.
    
    # Let's target the 'news' collection
    docs = db.collection('news').stream()
    
    count = 0
    deleted = 0
    
    batch = db.batch()
    batch_count = 0
    
    for doc in docs:
        count += 1
        data = doc.to_dict()
        title = data.get('title', '').lower()
        content_raw = data.get('content', '')
        if isinstance(content_raw, list):
            content = " ".join([str(c) for c in content_raw]).lower()
        else:
            content = str(content_raw).lower()
        url = data.get('original_url', '').lower()
        
        # Check for Botafogo-SP variations
        if 'botafogo-sp' in title or 'botafogo sp' in title or \
           'botafogo-sp' in content or 'botafogo sp' in content or \
           'botafogo-sp' in url:
            
            print(f"Found unwanted article: {data.get('title')} ({doc.id})")
            batch.delete(doc.reference)
            batch_count += 1
            deleted += 1
            
            if batch_count >= 400:
                batch.commit()
                batch = db.batch()
                batch_count = 0

    if batch_count > 0:
        batch.commit()
        
    print(f"Scanned {count} articles. Deleted {deleted} 'Botafogo-SP' articles.")

if __name__ == "__main__":
    remove_botafogosp()
