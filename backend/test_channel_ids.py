
import requests
from bs4 import BeautifulSoup

ids = [
    "UCZDrLCOCHkUCu632AmMQ", # The one I was using
    "UCFxjZDrLCOCHkUCu632AmMQ", # The one found in HTML?
    "UC4z6Z9-7-08e06-9" # Random check
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}

for cid in ids:
    url = f"https://www.youtube.com/feeds/videos.xml?channel_id={cid}"
    print(f"Testing {cid}...")
    try:
        res = requests.get(url, headers=headers, timeout=5)
        print(f"Status: {res.status_code}")
        if res.status_code == 200:
            soup = BeautifulSoup(res.content, 'xml')
            entries = soup.find_all('entry')
            print(f"Entries: {len(entries)}")
            if len(entries) > 0:
                print(f"Sample Title: {entries[0].find('title').text}")
                print(">>> SUCCESS <<<")
        else:
            print("Failed.")
    except Exception as e:
        print(f"Error: {e}")
    print("-" * 20)
