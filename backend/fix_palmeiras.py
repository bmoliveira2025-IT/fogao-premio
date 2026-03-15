import requests
import os
import firebase_admin
from firebase_admin import credentials, firestore

def fix_palmeiras():
    url = "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Palmeiras_logo.svg/500px-Palmeiras_logo.svg.png"
    output_path = "d:/Projetos/Fogão-Premio/portal/public/logos/palmeiras.png"
    
    # Download the logo
    headers = {'User-Agent': 'Mozilla/5.0'}
    print("Downloading Palmeiras logo...")
    res = requests.get(url, headers=headers)
    if res.status_code == 200:
        with open(output_path, "wb") as f:
            f.write(res.content)
        print("Saved palmeiras.png")
    else:
        print(f"Failed to download: {res.status_code}")
        return

    # Initialize Firebase
    if not firebase_admin._apps:
        cred_path = "service-account-new.json"
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        else:
            print("No credentials found!")
            return

    db = firestore.client()
    
    # Update all matches where Palmeiras is playing
    matches = db.collection('matches').stream()
    for doc in matches:
        data = doc.to_dict()
        home = data.get('home_team', '').lower()
        away = data.get('away_team', '').lower()
        
        updates = {}
        if 'palmeiras' in home:
            updates['home_team_logo'] = '/logos/palmeiras.png'
            if 'home_logo' in data:
                updates['home_logo'] = firestore.DELETE_FIELD
        if 'palmeiras' in away:
            updates['away_team_logo'] = '/logos/palmeiras.png'
            if 'away_logo' in data:
                updates['away_logo'] = firestore.DELETE_FIELD
                
        if updates:
            print(f"Updating match {doc.id}...")
            db.collection('matches').document(doc.id).update(updates)
            
    print("Firestore updated.")

if __name__ == "__main__":
    fix_palmeiras()
