import requests
import json

def test_sofascore(event_id):
    # Common endpoints
    base_url = "https://api.sofascore.com/api/v1"
    endpoints = {
        "event": f"{base_url}/event/{event_id}",
        "statistics": f"{base_url}/event/{event_id}/statistics",
        "incidents": f"{base_url}/event/{event_id}/incidents"
    }

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://www.sofascore.com/",
        "Origin": "https://www.sofascore.com",
        "Cache-Control": "max-age=0",
        "Connection": "keep-alive"
    }

    results = {}

    for name, url in endpoints.items():
        print(f"Testing {name}: {url}")
        try:
            response = requests.get(url, headers=headers, timeout=10)
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                results[name] = data
                # print(json.dumps(data, indent=2)[:500] + "...")
            else:
                print(f"Failed: {response.text[:200]}")
        except Exception as e:
            print(f"Error: {e}")
    
    return results

if __name__ == "__main__":
    # ID from user URL: https://www.sofascore.com/pt/football/match/botafogo-cruzeiro/eOsiO#id:15237885
    event_id = "15237885" 
    data = test_sofascore(event_id)
    
    if data.get("event") and data.get("statistics"):
        print("\nSUCCESS! Found data.")
        evt = data["event"]["event"]
        print(f"Match: {evt['homeTeam']['name']} x {evt['awayTeam']['name']}")
        print(f"Status: {evt['status']['description']}")
        print(f"Score: {evt['homeScore']['current']} - {evt['awayScore']['current']}")
        
        stats = data["statistics"]["statistics"][0] # usually period "ALL"
        print("Stats groups found:", [g['groupName'] for g in stats['groups']])
