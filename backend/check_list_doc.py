import firebase_admin
from firebase_admin import credentials, firestore
import os

def init_firebase():
    if not firebase_admin._apps:
        cred_path = "backend/service-account-new.json"
        if not os.path.exists(cred_path):
            cred_path = "service-account-new.json"
        
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            return firestore.client()
    return firestore.client()

db = init_firebase()

doc_ref = db.collection("matches").document("bot_v_cruz_2026_01_29")
doc = doc_ref.get()

if doc.exists:
    print(f"Document bot_v_cruz_2026_01_29 EXISTS in 'matches'.")
    print(doc.to_dict())
else:
    print(f"Document bot_v_cruz_2026_01_29 DOES NOT EXIST in 'matches'.")

# Check if there's any match on that date
start = "2026-01-29T00:00:00"
end = "2026-01-29T23:59:59"
query = db.collection("matches").where("date", ">=", start).where("date", "<=", end).stream()
print("\nMatches found on Jan 29:")
for q in query:
    print(f"ID: {q.id} => {q.to_dict().get('home_team')} x {q.to_dict().get('away_team')}")
