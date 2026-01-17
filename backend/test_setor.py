import requests
import xml.etree.ElementTree as ET

def test_feed():
    channel_id = "UC_JIxHLpOkTGw6LDjq50_oQ"
    url = f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"
    print(f"Testing feed for {channel_id}...")
    
    response = requests.get(url)
    if response.status_code != 200:
        print(f"Error: {response.status_code}")
        return
        
    root = ET.fromstring(response.content)
    ns = '{http://www.w3.org/2005/Atom}'
    
    entries = root.findall(f'{ns}entry')
    print(f"Found {len(entries)} entries.")
    
    for entry in entries[:3]:
        title = entry.find(f'{ns}title').text
        print(f"- {title}")

if __name__ == "__main__":
    test_feed()
