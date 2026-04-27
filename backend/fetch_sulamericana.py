import requests
import re
import json
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

# Initialize Firebase
cred = credentials.Certificate('backend/service-account-new.json')
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)
db = firestore.client()

def fetch_sulamericana_table():
    print("Fetching Sulamericana table from GE...")
    url = "https://ge.globo.com/futebol/copa-sul-americana/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(f"Error fetching page: {response.status_code}")
        return

    # Extract JSON classification
    pattern = r'classificacao\s*=\s*(\{.*?\});'
    match = re.search(pattern, response.text)
    
    if match:
        json_str = match.group(1)
        data = json.loads(json_str)
        
        # Sulamericana has groups (A-H)
        # We need to flatten them or store them in a way the frontend understands
        # The frontend LeagueTable expects a list of teams with stats
        
        all_teams = []
        for group in data:
            group_name = group.get('nome', '')
            teams = group.get('classificacao', [])
            for t in teams:
                team_data = {
                    'team': t.get('nome_popular'),
                    'points': t.get('pontos'),
                    'played': t.get('jogos'),
                    'won': t.get('vitorias'),
                    'drawn': t.get('empates'),
                    'lost': t.get('derrotas'),
                    'goals_for': t.get('gols_pro'),
                    'goals_against': t.get('gols_contra'),
                    'goal_difference': t.get('saldo_gols'),
                    'group': group_name,
                    'logo': t.get('escudo')
                }
                all_teams.append(team_data)
        
        # Update Firestore
        db.collection('league_tables').document('sulamericana').set({
            'championship': 'Copa Sul-Americana',
            'last_updated': firestore.SERVER_TIMESTAMP,
            'teams': all_teams
        })
        print("Sulamericana table updated successfully.")
    else:
        print("Classification JSON not found in page source.")

def fetch_sulamericana_matches():
    print("Fetching Sulamericana matches...")
    # Matches are usually in a different JSON or structure in GE
    # For now, let's just focus on the classification as the user explicitly asked for the table
    # But I should also find matches to populate the homepage
    pass

if __name__ == "__main__":
    fetch_sulamericana_table()
