
import requests
import re

handle = "@fogaodomeucoracao"
# url = f"https://www.youtube.com/{handle}"
url = "https://www.youtube.com/@fogaodomeucoracao"
print(f"Checking {url}...")

try:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        # Look for the canonical link which always contains the UC... ID
        match = re.search(r'link rel="canonical" href="https://www.youtube.com/channel/(UC[\w-]+)"', response.text)
        if match:
            print(f"FOUND_CHANNEL_ID (canonical): {match.group(1)}")
        else:
            match = re.search(r'"channelId":"(UC[\w-]+)"', response.text)
            if match:
                print(f"FOUND_CHANNEL_ID (JSON): {match.group(1)}")
            else:
                # Try search for browseId
                match = re.search(r'"browseId":"(UC[\w-]+)"', response.text)
                if match:
                    print(f"FOUND_CHANNEL_ID (browseId): {match.group(1)}")
                else:
                    print("Channel ID not found in response text.")
                    # print(response.text[:5000]) # Debug
    else:
        print(f"Failed to fetch page: {response.status_code}")
except Exception as e:
    print(f"Error: {e}")
