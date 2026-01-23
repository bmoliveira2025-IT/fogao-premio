
import requests
import xml.etree.ElementTree as ET

CHANNEL_ID = "UCFxjZDrLCOCHkUCu632AmMQ" # Botafogo TV
RSS_URL = f"https://www.youtube.com/feeds/videos.xml?channel_id={CHANNEL_ID}"

print(f"Fetching {RSS_URL}...")
response = requests.get(RSS_URL)
if response.status_code == 200:
    root = ET.fromstring(response.content)
    ns = '{http://www.w3.org/2005/Atom}'
    yt = '{http://www.youtube.com/xml/schemas/2015}'
    media = '{http://search.yahoo.com/mrss/}'
    
    for entry in root.findall(f'{ns}entry')[:3]:
        video_id = entry.find(f'{yt}videoId').text
        title = entry.find(f'{ns}title').text
        media_group = entry.find(f'{media}group')
        thumbnail_elem = media_group.find(f'{media}thumbnail')
        thumbnail_url = thumbnail_elem.attrib['url'] if thumbnail_elem is not None else "MISSING"
        
        # Check for hidden characters
        print(f"Video ID: {repr(video_id)}")
        print(f"Title: {repr(title)}")
        print(f"Thumbnail URL: {repr(thumbnail_url)}")
        print("-" * 20)
else:
    print(f"Failed: {response.status_code}")
