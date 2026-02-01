
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
        print("DEBUG: No game URLs found in tournament pages. Using fallback/manual options.")
        
    # Check for manual GE URL override
    manual_path = os.path.join(os.path.dirname(__file__), "manual_live_game.json")
    if os.path.exists(manual_path):
        try:
            with open(manual_path, "r", encoding="utf-8") as f:
                manual_conf = json.load(f)
            if manual_conf.get("ge_url"):
                print(f"Adding Manual GE URL: {manual_conf['ge_url']}")
                game_urls.append(manual_conf['ge_url'])
            
            # AUTOMATIC FALLBACK: Construct URL from manual data
            try:
                from datetime import timedelta
                m_date = datetime.fromisoformat(manual_conf["date"].replace("Z", "+00:00"))
                now_utc = datetime.now(timezone.utc)
                
                # Time Window: Start checking 1 hour before, stop 4 hours after start
                start_window = m_date - timedelta(hours=1)
                end_window = m_date + timedelta(hours=4)
                
                if start_window <= now_utc <= end_window:
                    date_str = m_date.strftime("%d-%m-%Y")
                    home_slug = manual_conf["home_team"].lower().replace(" ", "-")
                    away_slug = manual_conf["away_team"].lower().replace(" ", "-")
                    
                    # Try RJ base first (most common for Botafogo context)
                    auto_url = f"https://ge.globo.com/rj/futebol/brasileirao-serie-a/jogo/{date_str}/{home_slug}-{away_slug}.ghtml"
                    print(f"Time window matches! Trying Auto-Constructed URL: {auto_url}")
                    game_urls.append(auto_url)
                else:
                    print(f"Match is not strictly 'live' (Window: {start_window} to {end_window}). Skipping auto-URL construction to save resources.")

            except Exception as e:
                print(f"Error constructing auto URL: {e}")

        except Exception as e:
            print(f"Error reading manual config for URL: {e}")

    if not game_urls:
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
            
            # Check if match just finished and needs analysis
            if m_info["status"] == "ENCERRADA":
                 try:
                    # Check if analysis exists (using a key like 'motm_data' as marker)
                    # We need to read the current doc to see if it has analysis, 
                    # OR we can just blindly run analyze_match_data since it has its own check.
                    # But game_data here is fresh from GE, it doesn't have the analysis yet.
                    # We need to fetch the FULL doc from Firestore to get players stats (not just GE summary)
                    # if we want to do a deep analysis. 
                    # However, analyze_match_data relies on 'player_stats' which GE scrape doesn't provide fully here.
                    # If 'player_stats' are missing, analysis might be weak.
                    
                    # Let's try to run it on what we have + what's in DB.
                    current_doc = db.collection("match_stats").document(m_id).get()
                    if current_doc.exists:
                        full_data = current_doc.to_dict()
                        # update with latest info from GE
                        full_data.update(game_data)
                        
                        from auto_analysis import analyze_match_data
                        analyzed_data = analyze_match_data(full_data)
                        
                        if "motm_data" in analyzed_data and "motm_data" not in current_doc.to_dict():
                             print(f"Stats analysis generated for {m_id}")
                             db.collection("match_stats").document(m_id).set(analyzed_data, merge=True)
                 except Exception as e:
                    print(f"Error running auto-analysis for {m_id}: {e}")

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
                home_team = manual_data["home_team"]
                away_team = manual_data["away_team"]
                home_score = manual_data["home_score"]
                away_score = manual_data["away_score"]
                status = manual_data.get("status", "AO_VIVO")
                # Create a specific status label if needed, e.g., "INTERVALO", "2T 15'"
                # But 'status' field is usually generic. Let's send the specific time as well if possible?
                # The frontend might use 'status' for logic.
                
                matches_update = {
                    "home_team": home_team,
                    "away_team": away_team,
                    "home_score": home_score,
                    "away_score": away_score,
                    "status": status,
                    "display_time": manual_data.get("display_time", ""), # Pass specific time like "15'"
                    "match_id": m_id,
                    "updated_at": firestore.SERVER_TIMESTAMP
                }
                
                db.collection("matches").document("next_match").set(matches_update, merge=True)
                
                # Also save to permanent history and update any duplicates in matches collection
                db.collection("matches").document(m_id).set(matches_update, merge=True)
                
                # Query matches collection for any other docs with same teams on same date to update them too
                try:
                    # Using date prefix match (YYYY-MM-DD)
                    date_prefix = manual_data.get("date", "").split('T')[0]
                    if date_prefix:
                        other_matches = db.collection("matches").where("date", ">=", date_prefix).where("date", "<=", date_prefix + "T23:59:59").stream()
                        for om in other_matches:
                            om_data = om.to_dict()
                            if (om_data.get("home_team") == home_team and om_data.get("away_team") == away_team):
                                if om.id != "next_match" and om.id != m_id:
                                    db.collection("matches").document(om.id).update({
                                        "home_score": home_score,
                                        "away_score": away_score,
                                        "status": status,
                                        "match_id": m_id
                                    })
                                    print(f"Propagated scores to duplicate match doc: {om.id}")
                except Exception as propagation_err:
                    print(f"Error propagating scores: {propagation_err}")

                print(f"Successfully updated matches/next_match and matches/{m_id} with live score.")
            except Exception as e:
                print(f"Error updating matches/next_match: {e}")

    if not found_live:
        print("No live match active for Botafogo at this moment.")
    
    # --- AUTO-SWITCH TO NEXT MATCH LOGIC (Projected for 2026-01-30 00:01) ---
    try:
        # Time to switch: Jan 30, 2026 at 00:01 (Subtitle: "Amanhã as 00:01")
        # Assuming local time -03:00. 
        # 00:01 Local = 03:01 UTC.
        
        switch_time_iso = "2026-01-30T13:00:00+00:00"
        switch_time = datetime.fromisoformat(switch_time_iso)
        now_time = datetime.now(timezone.utc)
        
        manual_path = os.path.join(os.path.dirname(__file__), "manual_live_game.json")
        if os.path.exists(manual_path):
            with open(manual_path, "r", encoding="utf-8") as f:
                current_conf = json.load(f)
            
            # Only switch if we are still on the OLD match (bot_v_cruz) AND time has passed
            if current_conf.get("match_id") == "bot_v_cruz_2026_01_29" and now_time >= switch_time:
                print(f"⏰ It is past {switch_time_iso}. Switching to NEXT MATCH (Botafogo x Fluminense)...")
                
                new_conf = current_conf.copy()
                new_conf["match_id"] = "bot_v_flu_2026_02_01"
                new_conf["home_team"] = "Botafogo"
                new_conf["away_team"] = "Fluminense"
                new_conf["date"] = "2026-02-01T20:30:00-03:00"
                new_conf["home_score"] = 0
                new_conf["away_score"] = 0
                new_conf["status"] = "AGENDADO"
                new_conf["display_time"] = ""
                new_conf["ge_url"] = "" # Reset URL for auto-discovery later
                new_conf["stats"] = {} # Clear stats
                new_conf["events"] = [] # Clear events
                new_conf["player_stats"] = {"home": [], "away": []} # Clear players
                new_conf.pop("motm_data", None)
                new_conf.pop("goalkeeper_stats", None)
                new_conf.pop("pass_stats", None)
                
                with open(manual_path, "w", encoding="utf-8") as f:
                    json.dump(new_conf, f, indent=4, ensure_ascii=False)
                    
                print("✅ Successfully auto-switched config to Botafogo x Fluminense!")
                # Re-run sync logic immediately to update DB? 
                # Better to let the next loop handle it or just rely on the script logic above if it was re-entrant. 
                # For safety, we just updated the file. The next scheduled run (or manual run) will pick it up.
                
    except Exception as e:
        print(f"Error in auto-switch logic: {e}")

if __name__ == "__main__":
    sync_botafogo_live()
