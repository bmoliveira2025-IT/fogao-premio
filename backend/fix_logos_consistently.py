import firebase_admin
from firebase_admin import credentials, firestore
import os
import re

def fix_logos():
    # Initialize Firebase
    if not firebase_admin._apps:
        cred_path = "backend/service-account-new.json"
        if not os.path.exists(cred_path):
            cred_path = "service-account-new.json"
        
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
        else:
            print("No credentials found!")
            return

    db = firestore.client()
    
    # Mapping of common team names to their local logo files
    TEAM_LOGOS = {
        "boavista": "/logos/boavista.png",
        "botafogo": "/logos/botafogo.png",
        "bangu": "/logos/bangu.png",
        "flamengo": "/logos/flamengo.png",
        "vasco": "/logos/vasco.png",
        "cruzeiro": "/logos/cruzeiro.png",
        "athletico-pr": "/logos/athletico-pr.png",
        "bragantino": "/logos/bragantino.png",
        "corinthians": "/logos/corinthians.png",
        "sao-paulo": "/logos/sao-paulo.png",
        "gremio": "/logos/gremio.png",
        "internacional": "/logos/internacional.png",
        "vitoria": "/logos/vitoria.png",
        "volta-redonda": "/logos/volta-redonda.png",
        "portuguesa-rj": "/logos/portuguesa-rj.png",
        "sampaio-correa-rj": "/logos/sampaio-correa-rj.png",
        "palmeiras": "/logos/palmeiras.png"
    }

    def get_local_logo(team_name, current_logo):
        if not team_name:
            return current_logo
        
        slug = re.sub(r'[^a-zA-Z0-9]', '-', team_name.lower())
        if slug in TEAM_LOGOS:
            return TEAM_LOGOS[slug]
        
        # If it's already a local path, keep it
        if current_logo and current_logo.startswith('/logos/'):
            return current_logo
            
        return current_logo

    print("--- FIXING MATCHES COLLECTION ---")
    matches_ref = db.collection("matches").stream()
    
    for doc in matches_ref:
        data = doc.to_dict()
        updates = {}
        
        # 1. Handle field name aliases
        home_logo = data.get("home_team_logo") or data.get("home_logo")
        away_logo = data.get("away_team_logo") or data.get("away_logo")
        
        # 2. Normalize to local paths if known
        new_home_logo = get_local_logo(data.get("home_team"), home_logo)
        new_away_logo = get_local_logo(data.get("away_team"), away_logo)
        
        if new_home_logo != data.get("home_team_logo"):
            updates["home_team_logo"] = new_home_logo
        if new_away_logo != data.get("away_team_logo"):
            updates["away_team_logo"] = new_away_logo
            
        # 3. Clean up old field names if they exist
        if "home_logo" in data:
            updates["home_logo"] = firestore.DELETE_FIELD
        if "away_logo" in data:
            updates["away_logo"] = firestore.DELETE_FIELD
            
        if updates:
            print(f"Updating match {doc.id}: {data.get('home_team')} vs {data.get('away_team')}")
            db.collection("matches").document(doc.id).update(updates)

    print("--- DONE ---")

if __name__ == "__main__":
    fix_logos()
