import sys
import os

# Add the current directory to sys.path so we can import backend.scraper
current_dir = os.getcwd()
sys.path.append(current_dir)

try:
    from backend import scraper
    print("Imported scraper successfully.")
    print("Running update_next_match()...")
    scraper.update_next_match()
    print("Done.")
except Exception as e:
    print(f"Error: {e}")
    # Try alternate import if running from inside backend dir
    try:
        import scraper
        print("Imported scraper (direct).")
        scraper.update_next_match()
    except Exception as e2:
        print(f"Direct import failed too: {e2}")
