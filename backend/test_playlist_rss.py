
import requests

# ZDrLCOCHkUCu632AmMQ is the ID part
# UC -> Channel
# UU -> Uploads Playlist
playlist_id = "UUZDrLCOCHkUCu632AmMQ"
url = f"https://www.youtube.com/feeds/videos.xml?playlist_id={playlist_id}"

print(f"Testing {url}...")
try:
    res = requests.get(url, timeout=10)
    print(f"Status: {res.status_code}")
    if res.status_code == 200:
        print("Success!")
        print(res.text[:200])
        if "<entry>" in res.text:
            print("Entries found!")
            # Print titles
            from bs4 import BeautifulSoup
            soup = BeautifulSoup(res.content, 'xml')
            for e in soup.find_all('entry')[:3]:
                print(f"- {e.find('title').text} ({e.find('published').text})")
        else:
            print("No entries.")
    else:
        print("Failed.")
except Exception as e:
    print(f"Error: {e}")
