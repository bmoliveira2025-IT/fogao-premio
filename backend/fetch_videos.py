import firebase_admin
from firebase_admin import credentials, firestore
import requests
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
import os
import re
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase
def init_firebase():
    if not firebase_admin._apps:
        try:
            # Try multiple locations for the service account
            cred_locations = [
                "service-account-new.json", 
                "service-account.json", 
                "backend/service-account-new.json",
                "backend/service-account.json",
                "../service-account-new.json", 
                "../service-account.json"
            ]
            cred = None
            for loc in cred_locations:
                if os.path.exists(loc):
                    print(f"Using credentials from {loc}")
                    cred = credentials.Certificate(loc)
                    break
            
            if cred:
                firebase_admin.initialize_app(cred)
            else:
                print("No service account found, attempting default initialization.")
                firebase_admin.initialize_app()
        except Exception as e:
            print(f"Firebase initialization error: {e}")
    else:
        print("Firebase already initialized.")

init_firebase()
db = firestore.client()

CHANNELS = [
    {"name": "Botafogo TV", "id": "UCFxjZDrLCOCHkUCu632AmMQ"},
    {"name": "Fogão do Meu Coração", "id": "UCGYyVRxyMn-7YuConcWEqYQ"}
]

def check_live_stream(channel):
    """Checks if a channel is currently live and returns a video object if so."""
    name = channel["name"]
    channel_id = channel["id"]
    live_url = f"https://www.youtube.com/channel/{channel_id}/live"
    
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        response = requests.get(live_url, headers=headers, timeout=10)
        if response.status_code != 200:
            return None
            
        # YouTube uses "isLive":true in the JSON data embedded in the page
        if '"isLive":true' in response.text:
            # Try multiple ways to get the video ID
            video_id = None
            
            # 1. Canonical link
            match = re.search(r'link rel="canonical" href="https://www.youtube.com/watch\?v=([\w-]+)"', response.text)
            if match:
                video_id = match.group(1)
            
            # 2. meta og:url
            if not video_id:
                match = re.search(r'meta property="og:url" content="https://www.youtube.com/watch\?v=([\w-]+)"', response.text)
                if match:
                    video_id = match.group(1)
            
            # 3. videoId in JSON
            if not video_id:
                match = re.search(r'"videoId":"([\w-]+)"', response.text)
                if match:
                    video_id = match.group(1)
            
            if video_id:
                # Try to get a clean title
                title_match = re.search(r'<title>(.*?)</title>', response.text)
                title = title_match.group(1).replace(" - YouTube", "") if title_match else f"AO VIVO: {name}"
                
                return {
                    "video_id": video_id,
                    "title": title,
                    "url": f"https://www.youtube.com/watch?v={video_id}",
                    "thumbnail": f"https://i.ytimg.com/vi/{video_id}/maxresdefault.jpg",
                    "published_at": datetime.now(timezone.utc),
                    "source": name,
                    "is_live": True,
                    "created_at": firestore.SERVER_TIMESTAMP
                }
    except Exception as e:
        print(f"Error checking live status for {name}: {e}")
        
    return None

def fetch_channel_videos(channel):
    name = channel["name"]
    channel_id = channel["id"]
    videos = []
    
    # 1. Check for Active Live Stream
    live_v = check_live_stream(channel)
    if live_v:
        print(f"[*] LIVE detected for {name}: {live_v['title']}")
        videos.append(live_v)
    
    # 2. RSS Fetch
    rss_url = f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"
    print(f"[*] Fetching RSS for {name}...")
    try:
        r = requests.get(rss_url, timeout=10)
        if r.status_code == 200:
            root = ET.fromstring(r.content)
            ns = '{http://www.w3.org/2005/Atom}'
            yt = '{http://www.youtube.com/xml/schemas/2015}'
            
            count = 0
            for entry in root.findall(f'{ns}entry'):
                video_id = entry.find(f'{yt}videoId').text
                
                # Deduplicate if same as live
                if any(v['video_id'] == video_id for v in videos):
                    continue
                    
                title = entry.find(f'{ns}title').text
                published = entry.find(f'{ns}published').text
                
                try:
                    dt = datetime.fromisoformat(published.replace('Z', '+00:00'))
                except:
                    dt = datetime.now(timezone.utc)
                    
                videos.append({
                    "video_id": video_id,
                    "title": title,
                    "url": f"https://www.youtube.com/watch?v={video_id}",
                    "thumbnail": f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg",
                    "published_at": dt,
                    "source": name,
                    "is_live": False,
                    "created_at": firestore.SERVER_TIMESTAMP
                })
                count += 1
            print(f"[*] Found {count} RSS videos for {name}.")
        else:
            print(f"[!] RSS failed for {name} (Status: {r.status_code})")
    except Exception as e:
        print(f"[!] RSS error for {name}: {e}")
        
    return videos

def main():
    total_found = 0
    all_videos = []
    
    for channel in CHANNELS:
        chan_videos = fetch_channel_videos(channel)
        all_videos.extend(chan_videos)
        total_found += len(chan_videos)
        
    if not all_videos:
        print("No videos found.")
        return
        
    print(f"Saving {len(all_videos)} videos to Firestore...")
    batch = db.batch()
    count = 0
    for v in all_videos:
        ref = db.collection('videos').document(v['video_id'])
        batch.set(ref, v)
        count += 1
    
    batch.commit()
    print("Execution finished successfully.")

if __name__ == "__main__":
    main()
