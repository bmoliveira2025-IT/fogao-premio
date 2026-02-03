import schedule
import time
import subprocess
import os
from datetime import datetime

# Script Paths
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
SCRAPER_SCRIPT = os.path.join(BACKEND_DIR, "scraper.py")
VIDEOS_SCRIPT = os.path.join(BACKEND_DIR, "fetch_videos.py")
PODCASTS_SCRIPT = os.path.join(BACKEND_DIR, "fetch_podcasts.py")
SQUAD_SCRIPT = os.path.join(BACKEND_DIR, "seed_squad.py")
MATCHES_SCRIPT = os.path.join(BACKEND_DIR, "seed_matches.py")
TABLE_SCRIPT = os.path.join(BACKEND_DIR, "fetch_table.py")
BRASILEIRAO_SCRIPT = os.path.join(BACKEND_DIR, "fetch_brasileirao.py")
LIVE_STATS_SCRIPT = os.path.join(BACKEND_DIR, "sync_live_stats.py")

def run_script(script_path, name):
    print(f"[{datetime.now()}] Starting {name}...")
    try:
        # Pass SINGLE_RUN=true to ensure scripts exit after one pass
        env = os.environ.copy()
        env["SINGLE_RUN"] = "true"
        subprocess.run(["python", script_path], check=True, cwd=BACKEND_DIR, env=env)
        print(f"[{datetime.now()}] {name} completed successfully.")
    except Exception as e:
        print(f"[{datetime.now()}] Error running {name}: {e}")

def job_news():
    run_script(SCRAPER_SCRIPT, "News Scraper")

def job_videos_podcasts():
    run_script(VIDEOS_SCRIPT, "Video Fetcher")
    run_script(PODCASTS_SCRIPT, "Podcast Fetcher")

def job_system_update():
    run_script(SQUAD_SCRIPT, "Squad Seeder")
    run_script(MATCHES_SCRIPT, "Match Seeder")

def job_table_update():
    run_script(TABLE_SCRIPT, "Carioca Table Fetcher")
    run_script(BRASILEIRAO_SCRIPT, "Brasileirão Table Fetcher")

def job_live_stats():
    run_script(LIVE_STATS_SCRIPT, "Live Stats Sync")

# --- Schedule Configuration ---

# 0. Live Stats: Every 1 minute (Critical for game days)
schedule.every(1).minutes.do(job_live_stats)

# 1. News: Every 20 minutes
schedule.every(20).minutes.do(job_news)

# 2. Videos & Podcasts: Every 24 hours
schedule.every(24).hours.do(job_videos_podcasts)

# 3. Squad & Matches: Every 20 days
schedule.every(20).days.do(job_system_update)

# 4. Table: Every 6 hours
schedule.every(6).hours.do(job_table_update)

print("--- Botafogo Portal Scheduler Started ---")
print("Schedule:")
print("- News: Every 20 minutes")
print("- Videos/Podcasts: Every 24 hours")
print("- Squad/Matches: Every 20 days")
print("- Table (Carioca/Brasileirão): Every 6 hours")

# Run all jobs immediately on startup to ensure fresh data
print("Running initial jobs...")
job_news()
job_videos_podcasts()
job_table_update()
# Skipping heavy squad/match update on startup unless empty? User implied "updates", so maybe just schedule.
# run_script(SQUAD_SCRIPT, "Squad Seeder") # Optional on startup

while True:
    schedule.run_pending()
    time.sleep(60)
