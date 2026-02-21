import os
import firebase_admin
from firebase_admin import credentials, firestore

def fix_data():
    cred_path = "backend/service-account-new.json"
    if not os.path.exists(cred_path):
        cred_path = "service-account-new.json"
    
    if os.path.exists(cred_path):
        if not firebase_admin._apps:
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        db = firestore.client()
        
        # 1. Delete the corrupted match document
        match_id = "gre_v_bot_2026_02_06"
        print(f"Deleting match document: {match_id}")
        db.collection('matches').document(match_id).delete()
        
        # 2. Trigger update of next_match
        print("Triggering next_match update...")
        # Since I have fix_next_match_trigger.py, I can just call the logic or run it
        import fix_next_match_trigger
        fix_next_match_trigger.trigger_update()
        
        print("Data cleanup complete.")
            
    else:
        print("Credentials not found")

if __name__ == "__main__":
    fix_data()
