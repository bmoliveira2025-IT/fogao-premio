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

def fix_boavista_match():
    matches_ref = db.collection('matches')
    # Use exact teams to find it
    docs = matches_ref.where('home_team', 'in', ['Boavista', 'Boa Vista']).stream()
    
    found = False
    for doc in docs:
        data = doc.to_dict()
        if data.get('away_team') == 'Botafogo':
            found = True
            is_semi = "Semifinal" in doc.id or "semifinal" in (data.get('championship') or "").lower()
            championship = "Carioca Série A · Semifinal" if is_semi else "Carioca Série A"
            
            print(f"Updating match {doc.id} ({data.get('home_team')}) to {championship}...")
            doc.reference.update({
                'championship': championship
            })
    
    # Also check away
    docs = matches_ref.where('away_team', 'in', ['Boavista', 'Boa Vista']).stream()
    for doc in docs:
        data = doc.to_dict()
        if data.get('home_team') == 'Botafogo':
            found = True
            is_semi = "Semifinal" in doc.id or "semifinal" in (data.get('championship') or "").lower()
            championship = "Carioca Série A · Semifinal" if is_semi else "Carioca Série A"
            
            print(f"Updating match {doc.id} (Away {data.get('away_team')}) to {championship}...")
            doc.reference.update({
                'championship': championship
            })

    if found:
        print("Successfully updated Boavista x Botafogo championship details.")
        # Trigger next_match update to sync the pointer
        import subprocess
        subprocess.run(["python", "backend/update_next_match_real.py"])
    else:
        print("Boavista x Botafogo match not found.")

if __name__ == "__main__":
    fix_boavista_match()
