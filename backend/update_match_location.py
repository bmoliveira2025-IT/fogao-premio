import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

load_dotenv()

if not firebase_admin._apps:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    cred_path = os.path.join(script_dir, "service-account-new.json")
    try:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    except:
        cred_path = os.path.join(script_dir, "service-account.json")
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)

db = firestore.client()

def update_location():
    # Update in the main matches collection
    matches_ref = db.collection('matches')
    query = matches_ref.where('home_team', '==', 'Grêmio').where('away_team', '==', 'Botafogo').where('date', '==', '2026-02-04T21:30:00-03:00')
    docs = query.get()
    
    updated = False
    for doc in docs:
        doc.reference.update({'location': 'Arena do Grêmio'})
        print(f"Updated match in collection 'matches': {doc.id}")
        updated = True
        
    # Also update the next_match document if it refers to this game
    next_match_ref = db.collection('matches').document('next_match')
    next_match = next_match_ref.get()
    if next_match.exists:
        data = next_match.to_dict()
        if data.get('home_team') == 'Grêmio' and data.get('away_team') == 'Botafogo':
            next_match_ref.update({'location': 'Arena do Grêmio'})
            print("Updated 'next_match' document.")
            updated = True

    if not updated:
        print("Match not found or already updated.")

if __name__ == "__main__":
    update_location()
