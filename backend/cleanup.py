import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone

# Load environment variables
load_dotenv()

# ... (imports)

# Move init logic to main block or lazy load
db = None

def get_db():
    global db
    if db:
        return db
    # Initialize if needed (for standalone run)
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
    if not cred_path:
        if os.path.exists("service-account-new.json"):
            cred_path = "service-account-new.json"
        else:
            cred_path = "service-account.json"
            
    if not firebase_admin._apps:
        try:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        except Exception as e:
            print(f"Failed to init firebase: {e}")
            return None
    return firestore.client()

def cleanup_old_news(db_instance=None):
    if db_instance is None:
        db_instance = get_db()
        if not db_instance:
            return

    print("Starting four-day cleanup...")
    try:
        # Keep four complete days of news available to the app.
        cutoff = datetime.now(timezone.utc) - timedelta(days=4)
        
        # Query for older items
        docs = db_instance.collection('news').where('created_at', '<', cutoff).stream()
        
        count = 0
        batch = db_instance.batch()
        
        for doc in docs:
            batch.delete(doc.reference)
            count += 1
            if count % 400 == 0: 
                batch.commit()
                batch = db_instance.batch()
                print(f"Deleted batch of {count}...")
        
        if count % 400 != 0:
            batch.commit()
            
        print(f"Cleanup finished. Removed {count} items older than four days.")
    except Exception as e:
        print(f"Error during cleanup: {e}")

if __name__ == "__main__":
    cleanup_old_news()
