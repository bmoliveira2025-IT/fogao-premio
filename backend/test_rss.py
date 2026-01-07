import requests

url = "https://www.youtube.com/feeds/videos.xml?user=botafogooficial"

try:
    print(f"Fetching {url}...")
    response = requests.get(url)
    if response.status_code == 200:
        print("Success! Feed found.")
        print(response.text[:500])
    else:
        print(f"Failed: {response.status_code}")
except Exception as e:
    print(f"Error: {e}")
