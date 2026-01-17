import requests
import re

url = "https://www.transfermarkt.com.br/ythallo/profil/spieler/987979"
headers = {
    'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

try:
    response = requests.get(url, headers=headers)
    # Search for the specific image pattern
    # https://img.a.transfermarkt.technology/portrait/medium/987979-1709599661.jpg?lm=1
    match = re.search(r'(https://img\.a\.transfermarkt\.technology/portrait/medium/987979-\d+\.jpg\?lm=1)', response.text)
    
    if match:
        print(f"FOUND_IMAGE: {match.group(1)}")
    else:
        # Try finding any portrait/medium for this ID
        match2 = re.search(r'(https://img\.a\.transfermarkt\.technology/portrait/medium/987979-[^"]+)', response.text)
        if match2:
            print(f"FOUND_IMAGE_V2: {match2.group(1)}")
        else:
            print("Image not found in source.")

except Exception as e:
    print(f"Error: {e}")
