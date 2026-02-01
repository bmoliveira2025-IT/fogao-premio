import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

load_dotenv()

if not firebase_admin._apps:
    cred_path = os.getenv("SERVICE_ACCOUNT_PATH")
    if not cred_path or not os.path.exists(cred_path):
        cred_path = os.path.join(os.path.dirname(__file__), "service-account-new.json")
    
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def find_and_fix():
    print("Searching for Botafogo x Fluminense matches...")
    # Try both home/away combinations just in case
    combinations = [
        ('Botafogo', 'Fluminense'),
        ('Fluminense', 'Botafogo')
    ]
    
    new_date = "2026-02-01T20:30:00-03:00"
    
    # Also update 'next_match' specifically
    next_match_doc = db.collection('matches').document('next_match').get()
    if next_match_doc.exists:
        data = next_match_doc.to_dict()
        if (data.get('home_team') == 'Botafogo' and data.get('away_team') == 'Fluminense') or \
           (data.get('home_team') == 'Fluminense' and data.get('away_team') == 'Botafogo'):
            print(f"Updating next_match: {data.get('home_team')} x {data.get('away_team')} from {data.get('date')} to {new_date}")
            db.collection('matches').document('next_match').update({'date': new_date})

    for home, away in combinations:
        docs = db.collection('matches').where('home_team', '==', home).where('away_team', '==', away).stream()
        for doc in docs:
            data = doc.to_dict()
            # Only update if it's today's date (or very close)
            if data.get('date', '').startswith('2026-02-01'):
                print(f"Updating match {doc.id}: {home} x {away} from {data.get('date')} to {new_date}")
                db.collection('matches').document(doc.id).update({'date': new_date})

if __name__ == "__main__":
    find_and_fix()
