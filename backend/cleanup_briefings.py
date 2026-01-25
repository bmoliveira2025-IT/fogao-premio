
import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env.local"))

def initialize_firebase():
    if not firebase_admin._apps:
        cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
        firebase_creds_json = os.getenv("FIREBASE_CREDENTIALS_JSON")

        if firebase_creds_json:
            cred_dict = json.loads(firebase_creds_json)
            cred = credentials.Certificate(cred_dict)
        elif cred_path and os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
        else:
            possible_paths = [
                os.path.join(os.path.dirname(__file__), "service-account-new.json"),
                os.path.join(os.path.dirname(__file__), "service-account.json"),
                "service-account.json",
                "backend/service-account.json"
            ]
            for p in possible_paths:
                if os.path.exists(p):
                    cred = credentials.Certificate(p)
                    break
            else:
                print("Error: No credentials found.")
                return None
        
        firebase_admin.initialize_app(cred)
    
    return firestore.client()

def cleanup_daily_briefings():
    db = initialize_firebase()
    if not db:
        return

    print("Cleaning up Daily Briefings...")
    
    # Get all briefings ordered by creation date (descending)
    briefings_ref = db.collection('daily_briefings')
    docs = briefings_ref.order_by('created_at', direction=firestore.Query.DESCENDING).get()

    if not docs:
        print("No briefings found to cleanup.")
        return

    # Keep the first one (most recent)
    keep_id = docs[0].id
    print(f"Keeping most recent briefing: {keep_id} ({docs[0].to_dict().get('created_at')})")

    # Delete the others
    deleted_count = 0
    for doc in docs[1:]:
        print(f"Deleting old briefing: {doc.id}")
        doc.reference.delete()
        deleted_count += 1

    print(f"Cleanup complete! Deleted {deleted_count} old briefings.")

if __name__ == "__main__":
    cleanup_daily_briefings()
