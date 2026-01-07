
import requests

candidates = [
    "https://www.youtube.com/feeds/videos.xml?user=BotafogoTV",
    "https://www.youtube.com/feeds/videos.xml?user=botafogooficial",
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCF_4kjpnLhM9eIeF_M-kZHg",
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCZDrLCOCHkUCu632AmMQ", 
    "https://www.youtube.com/feeds/videos.xml?channel_id=UCZDrLCOCHkUCu632AmMQg" # Trying to guess missing char if any?
]

for url in candidates:
    try:
        print(f"Testing {url}...")
        res = requests.get(url, timeout=5)
        print(f"Status: {res.status_code}")
        if res.status_code == 200:
            print(f"Content Start: {res.text[:100]}")
            if "<entry>" in res.text:
                print("SUCCESS: Entries found!")
            else:
                print("WARNING: No entries found.")
        else:
             print("FAILED.")
    except Exception as e:
        print(f"Error: {e}")
    print("-" * 20)
