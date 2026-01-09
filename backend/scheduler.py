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

def run_script(script_path, name):
    print(f"[{datetime.now()}] Starting {name}...")
    try:
        subprocess.run(["python", script_path], check=True, cwd=BACKEND_DIR)
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

# --- Schedule Configuration ---

# 1. News: Every 20 minutes
schedule.every(20).minutes.do(job_news)

# 2. Videos & Podcasts: Every 24 hours
schedule.every(24).hours.do(job_videos_podcasts)

# 3. Squad & Matches: Every 20 days
schedule.every(20).days.do(job_system_update)

print("--- Botafogo Portal Scheduler Started ---")
print("Schedule:")
print("- News: Every 20 minutes")
print("- Videos/Podcasts: Every 24 hours")
print("- Squad/Matches: Every 20 days")

# Run all jobs immediately on startup to ensure fresh data
print("Running initial jobs...")
job_news()
job_videos_podcasts()
# Skipping heavy squad/match update on startup unless empty? User implied "updates", so maybe just schedule.
# run_script(SQUAD_SCRIPT, "Squad Seeder") # Optional on startup

while True:
    schedule.run_pending()
    time.sleep(60)
