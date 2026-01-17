import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

try:
    import scraper
    print("Scraper imported successfully.")
    
    # Check news count manually first
    from datetime import datetime, timedelta, timezone
    
    dashboard_time = datetime.now(timezone.utc) - timedelta(days=1)
    print(f"Checking news since: {dashboard_time}")
    
    # We can't access db directly easily unless we init, checking how scraper does it
    # scraper.db is initialized at module level.
    
    docs = scraper.db.collection('news').where('created_at', '>=', dashboard_time).get()
    print(f"News found in last 24h: {len(docs)}")
    
    if len(docs) < 3:
        print("CRITICAL: Less than 3 news items found. This allows scraper.py to skip generation.")
        
    print("Attempting to force generate briefing...")
    scraper.generate_daily_briefing(force=True)
    
except Exception as e:
    print(f"Error: {e}")
