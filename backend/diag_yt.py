
import requests
import re

id = 'UCGYyVRxyMn-7YuConcWEqYQ'
rss_url = f'https://www.youtube.com/feeds/videos.xml?channel_id={id}'
live_url = f'https://www.youtube.com/channel/{id}/live'

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

print(f"Checking RSS: {rss_url}")
r = requests.get(rss_url, headers=headers)
print(f"RSS Status: {r.status_code}")
print(f"RSS Length: {len(r.text)}")
if r.status_code != 200:
    print(r.text[:500])

print(f"Checking Live: {live_url}")
rl = requests.get(live_url, headers=headers)
print(f"Live Status: {rl.status_code}")
is_live = '"isLive":true' in rl.text
print(f"IsLive in text: {is_live}")

# Extract Video ID if possible
video_id_match = re.search(r'\"videoId\":\"([\w-]+)\"', rl.text)
if video_id_match:
    print(f"Detected Video ID: {video_id_match.group(1)}")
else:
    print("Video ID not found in live page.")
