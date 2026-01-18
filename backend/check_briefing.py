
import firebase_admin
from firebase_admin import credentials, firestore
import os

# Initialize only if not already initialized
if not firebase_admin._apps:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    cred_file = "service-account-new.json"
    cred_path = os.path.join(current_dir, cred_file)
    
    if not os.path.exists(cred_path):
        # Fallback to backend dir if run from root
        cred_path = os.path.join(current_dir, "..", "backend", cred_file)
        
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

docs = db.collection('daily_briefings').order_by('created_at', direction=firestore.Query.DESCENDING).limit(1).get()

if not docs:
    print("No briefings found.")
else:
    for d in docs:
        print(f" Briefing found: {d.id}")
        data = d.to_dict()
        print(f" Summary: {data.get('general_summary')}")
        for story in data.get('top_stories', []):
            print(f"  [{story.get('rank')}] {story.get('title')} (Image: {story.get('image') is not None})")
