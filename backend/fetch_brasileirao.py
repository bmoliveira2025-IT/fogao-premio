import os
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import json
import sys
import re
import requests
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

def fetch_brasileirao():
    db = initialize_firebase()
    if not db:
        return

    print("Fetching Brasileirão Table Data from GE...")
    
    url = "https://ge.globo.com/futebol/brasileirao-serie-a/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            print(f"Failed to fetch page: {response.status_code}")
            return

        match = re.search(r'const classificacao\s*=\s*({.*?});', response.text)
        if not match:
            print("Could not find classification data in page HTML.")
            return

        json_str = match.group(1)
        data = json.loads(json_str)

        standings = []
        
        # New parsing logic for the observed data structure
        # data['classificacao'] is the list of teams directly for Brasileirão
        items = data.get('classificacao', [])
        
        for team in items:
            standings.append({
                "position": team.get('ordem') or team.get('posicao'),
                "team": team.get('nome_popular'),
                "points": team.get('pontos'),
                "games": team.get('jogos'),
                "wins": team.get('vitorias'),
                "draws": team.get('empates'),
                "losses": team.get('derrotas'),
                "goal_diff": team.get('saldo_gols'),
                "logo": team.get('escudo'),
                "group": "Geral" # Brasileirão has no groups
            })

        doc_ref = db.collection('championship_table').document('brasileirao_2026')
        doc_ref.set({
            "updated_at": firestore.SERVER_TIMESTAMP,
            "standings": standings,
            "name": data.get('edicao', {}).get('nome', "Brasileirão 2026"),
            "season": "2026"
        })

        print(f"Brasileirão table updated with {len(standings)} teams.")

    except Exception as e:
        print(f"Error scraping GE Brasileirão: {e}")

if __name__ == "__main__":
    fetch_brasileirao()
