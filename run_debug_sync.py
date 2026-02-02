
import os
import json
import requests
import re
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timezone

# Initialize Firebase (simplified)
def init_firebase():
    if not firebase_admin._apps:
        cred_path = "./backend/service-account-new.json"
        if not os.path.exists(cred_path):
             # Try absolute path based on known structure
             cred_path = r"d:\Projetos\Fogão-Premio\backend\service-account-new.json"
        
        print(f"Loading creds from {cred_path}")
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
        return firestore.client()
    return firestore.client()

def get_ge_match_stats(match_url):
    print(f"Fetching {match_url}...")
    headers = {'User-Agent': 'Mozilla/5.0 ...'}
    response = requests.get(match_url, headers=headers)
    print(f"Status: {response.status_code}")
    if response.status_code != 200: return None, None
    
    match_id = "bot_v_flu_2026_02_01" # Hardcode for this test
    
    # Extract Score
    text = response.text
    ht_match = re.search(r'"homeTeam":{[^}]*"name":"([^"]+)"[^}]*"score":(\d+)', text)
    at_match = re.search(r'"awayTeam":{[^}]*"name":"([^"]+)"[^}]*"score":(\d+)', text)
    
    if ht_match and at_match:
        print(f"Score found: {ht_match.group(1)} {ht_match.group(2)} x {at_match.group(2)} {at_match.group(1)}")
        return {
            "home_score": int(ht_match.group(2)),
            "away_score": int(at_match.group(2)),
            "status": "ENCERRADA",
            "match_id": match_id
        }, {}
        
    return None, None

def run():
    try:
        db = init_firebase()
        url = "https://ge.globo.com/rj/futebol/campeonato-carioca/jogo/01-02-2026/botafogo-fluminense.ghtml"
        
        m_info, stats = get_ge_match_stats(url)
        
        if m_info:
            print("Updating DB...")
            db.collection("match_stats").document(m_info["match_id"]).set(m_info, merge=True)
            
            # Simple Analysis Trigger (Mock)
            with open("sync_success.txt", "w") as f:
                f.write(f"SUCCESS: {m_info['home_score']} - {m_info['away_score']}")
            print("Done. Wrote sync_success.txt")
        else:
            print("Failed to parse match info")
            
    except Exception as e:
        print(f"Error: {e}")
        with open("sync_error.txt", "w") as f:
             f.write(str(e))

if __name__ == "__main__":
    run()
