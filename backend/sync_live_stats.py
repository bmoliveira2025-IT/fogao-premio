
import os
import json
import re
import requests
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timezone

# Initialize Firebase
def init_firebase():
    if not firebase_admin._apps:
        # Load from file (local or CI secrets mapped to file)
        cred_path = "backend/service-account-new.json"
        if not os.path.exists(cred_path):
            cred_path = "service-account-new.json"
        
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            return firestore.client()
        else:
            # Try loading from env var for GitHub Actions
            cred_json = os.getenv("FIREBASE_CREDENTIALS_JSON")
            if cred_json:
                cred_dict = json.loads(cred_json)
                cred = credentials.Certificate(cred_dict)
                firebase_admin.initialize_app(cred)
                return firestore.client()
            raise Exception("Firebase credentials not found")
    return firestore.client()

def get_ge_match_stats(match_url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    }
    
    try:
        response = requests.get(match_url, headers=headers, timeout=15)
        if response.status_code != 200:
            return None, None
        
        text = response.text
        
        # 1. Look for match ID
        id_match = re.search(r'"match":{"id":(\d+)', text)
        m_id = id_match.group(1) if id_match else None
        
        if not m_id:
            return None, None

        # 2. Extract stats
        stats = {}
        
        # Helper to convert array to object
        def to_obj(val_home, val_away):
            return {"home": int(val_home), "away": int(val_away)}

        # Possession
        posse_match = re.search(r'"label":"posse de bola","valorHome":"(\d+)","valorAway":"(\d+)"', text)
        if posse_match:
            stats['possession'] = to_obj(posse_match.group(1), posse_match.group(2))
            
        # Shots
        sh_match = re.search(r'"label":"finalizações","valorHome":"(\d+)","valorAway":"(\d+)"', text)
        if sh_match:
            stats['shots'] = to_obj(sh_match.group(1), sh_match.group(2))
            
        # Cards
        cy_match = re.search(r'"label":"cartões amarelos","valorHome":"(\d+)","valorAway":"(\d+)"', text)
        if cy_match:
            stats['yellow_cards'] = to_obj(cy_match.group(1), cy_match.group(2))
        
        cr_match = re.search(r'"label":"cartões vermelhos","valorHome":"(\d+)","valorAway":"(\d+)"', text)
        if cr_match:
            stats['red_cards'] = to_obj(cr_match.group(1), cr_match.group(2))

        # Fouls
        fl_match = re.search(r'"label":"faltas cometidas","valorHome":"(\d+)","valorAway":"(\d+)"', text)
        if fl_match:
            stats['fouls'] = to_obj(fl_match.group(1), fl_match.group(2))

        # Corners
        cn_match = re.search(r'"label":"escanteios","valorHome":"(\d+)","valorAway":"(\d+)"', text)
        if cn_match:
            stats['corners'] = to_obj(cn_match.group(1), cn_match.group(2))

        # 3. Extract match info (Score, Status, Teams)
        m_info = {
            "id": m_id,
            "match_id": m_id,
            "status": "ENCERRADA",
            "home_team": "Botafogo",
            "away_team": "Opponent",
            "home_score": 0,
            "away_score": 0,
            "date": datetime.now(timezone.utc).isoformat() # Fallback
        }
        
        # Try to extract date from script blocks
        # "startDate":"2026-01-24T21:00"
        date_match = re.search(r'"startDate":"([^"]+)"', text)
        if date_match:
            m_info["date"] = date_match.group(1)

        ht_match = re.search(r'"homeTeam":{[^}]*"name":"([^"]+)"[^}]*"score":(\d+)', text)
        at_match = re.search(r'"awayTeam":{[^}]*"name":"([^"]+)"[^}]*"score":(\d+)', text)
        st_match = re.search(r'"status":"([^"]+)"', text)
        
        if ht_match:
            m_info["home_team"] = ht_match.group(1)
            m_info["home_score"] = int(ht_match.group(2))
        if at_match:
            m_info["away_team"] = at_match.group(1)
            m_info["away_score"] = int(at_match.group(2))
        
        m_info["score"] = f"{m_info['home_score']} - {m_info['away_score']}"
        
        if st_match:
            m_info["status"] = st_match.group(1)
            
        return m_info, stats
    except Exception as e:
        print(f"Error fetching stats from {match_url}: {e}")
        return None, None

def sync_botafogo_live():
    # Primary tournaments to check
    urls = [
        "https://ge.globo.com/rj/futebol/campeonato-carioca/",
        "https://ge.globo.com/futebol/brasileirao-serie-a/"
    ]
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    }
    
    db = init_firebase()
    
    found_live = False
    game_urls = []
    
    for url in urls:
        print(f"Checking {url} for live Botafogo matches...")
        try:
            response = requests.get(url, headers=headers, timeout=15)
            if response.status_code == 200:
                # Find match URLs
                matches = re.findall(r'href="(https://ge\.globo\.com/[^"]*botafogo[^"]*\.ghtml)"', response.text)
                game_urls.extend([u for u in matches if "/jogo/" in u])
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            
    # Fallback for testing/debugging if tournament pages are shells
    if not game_urls:
        print("DEBUG: No game URLs found in tournament pages. Using fallback for testing.")
        game_urls = ["https://ge.globo.com/rj/futebol/campeonato-carioca/jogo/24-01-2026/botafogo-bangu.ghtml"]

    # Remove duplicates
    game_urls = list(set(game_urls))
    
    for m_url in game_urls:
        print(f"Syncing match from: {m_url}")
        m_info, live_stats = get_ge_match_stats(m_url)
        
        if m_info:
            game_data = {
                **m_info,
                "last_sync": datetime.now(timezone.utc).isoformat(),
                "url": m_url
            }
            if live_stats:
                game_data["stats"] = live_stats
            
            # Upsert
            m_id = m_info["id"]
            db.collection("match_stats").document(m_id).set(game_data, merge=True)
            print(f"Successfully synced match {m_id} ({m_info['home_team']} x {m_info['away_team']})")
            
            if m_info["status"] in ["AO_VIVO", "EM_ANDAMENTO"]:
                found_live = True

    # Logic to use manual override
    manual_path = os.path.join(os.path.dirname(__file__), "manual_live_game.json")
    if os.path.exists(manual_path):
        with open(manual_path, "r", encoding="utf-8") as f:
            manual_data = json.load(f)
            
        if manual_data.get("active"):
            print("USING MANUAL LIVE GAME DATA") # Upsert detailed stats
            m_id = manual_data.get("match_id", "manual_match")
            # Ensure timestamp
            manual_data["last_sync"] = datetime.now(timezone.utc).isoformat()
            
            db.collection("match_stats").document(m_id).set(manual_data, merge=True)
            print(f"Successfully synced MANUAL match {m_id} to match_stats")
            found_live = True

            # ALSO update 'matches/next_match' for the Home Page Widget
            # This ensures the home page shows the live score without needing full stats
            try:
                # Map specific fields expected by the frontend MatchData interface
                home_score = manual_data["home_score"]
                away_score = manual_data["away_score"]
                status = manual_data.get("status", "AO_VIVO")
                # Create a specific status label if needed, e.g., "INTERVALO", "2T 15'"
                # But 'status' field is usually generic. Let's send the specific time as well if possible?
                # The frontend might use 'status' for logic.
                
                matches_update = {
                    "home_score": home_score,
                    "away_score": away_score,
                    "status": status,
                    "display_time": manual_data.get("display_time", ""), # Pass specific time like "15'"
                    "updated_at": firestore.SERVER_TIMESTAMP
                }
                
                db.collection("matches").document("next_match").set(matches_update, merge=True)
                print("Successfully updated matches/next_match with live score.")
            except Exception as e:
                print(f"Error updating matches/next_match: {e}")

    if not found_live:
        print("No live match active for Botafogo at this moment.")

if __name__ == "__main__":
    sync_botafogo_live()
