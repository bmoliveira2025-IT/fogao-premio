
import requests
import re
from datetime import datetime

def find_match_link():
    # Specific Agenda URL found in previous step
    url = "https://ge.globo.com/futebol/times/botafogo/agenda-de-jogos-do-botafogo/"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    }
    
    try:
        print(f"Fetching Agenda: {url}...")
        response = requests.get(url, headers=headers, timeout=15)
        
        if response.status_code == 200:
            # Look for ANY link containing "/jogo/"
            # The structure is usually an <a> tag wrapping the game card
            
            # Pattern: href=".../jogo/dd-mm-yyyy/home-away.ghtml"
            game_links = re.findall(r'href="(https?://ge\.globo\.com/[^"]*/jogo/[^"]+)"', response.text)
            
            game_links = list(set(game_links))
            
            print(f"Found {len(game_links)} match links on Agenda:")
            for link in game_links:
                print(f"- {link}")
                
            # Simulate "Sync" logic: Find the one that matches today's date (or next closest)
            today_str = datetime.now().strftime("%d-%m-%Y") # e.g. 29-01-2026
            print(f"Looking for match with date: {today_str}")
            
            today_matches = [l for l in game_links if today_str in l]
            if today_matches:
                print(f"SUCCESS! Found today's match link: {today_matches[0]}")
            else:
                print("No match link found with today's date string.")
                
        else:
            print(f"Failed to fetch page: {response.status_code}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    find_match_link()
