import os
import json
import sys
import requests
import firebase_admin
from firebase_admin import credentials, firestore
from bs4 import BeautifulSoup
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup Firebase
if not firebase_admin._apps:
    firebase_creds_json = os.getenv("FIREBASE_CREDENTIALS_JSON")
    
    if firebase_creds_json:
        cred_dict = json.loads(firebase_creds_json)
        cred = credentials.Certificate(cred_dict)
    else:
        # Default to checking local file if env var not set
        local_cred_path = os.path.join(os.path.dirname(__file__), "service-account.json")
        if os.path.exists(local_cred_path):
            cred_path = local_cred_path
        else:
            # Fallback for when running from root
            possible = os.path.join(os.getcwd(), "backend", "service-account.json")
            if os.path.exists(possible):
                cred_path = possible
            else:
                print(f"Error: SERVICE_ACCOUNT_PATH not set and service-account.json not found in {local_cred_path} or {possible}")
                sys.exit(1)
            
        cred = credentials.Certificate(cred_path)

    firebase_admin.initialize_app(cred)

db = firestore.client()

def map_position(pos_text):
    pos_text = pos_text.lower()
    if 'goleiro' in pos_text:
        return 'Goleiros', 'G'
    elif 'zagueiro' in pos_text or 'lateral' in pos_text or 'defensor' in pos_text:
        return 'Defensores', 'D'
    elif 'meia' in pos_text or 'volante' in pos_text or 'medio' in pos_text:
        return 'Meio-Campistas', 'M'
    elif 'atacante' in pos_text or 'ponta' in pos_text or 'avançado' in pos_text:
        return 'Atacantes', 'A'
    return 'Desconhecido', '?'

def scrape_squad():
    url = "https://www.transfermarkt.com.br/botafogo-fr-rio-de-janeiro/startseite/verein/537"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    print(f"Fetching squad from {url}...")
    try:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            print(f"Failed to fetch content: {response.status_code}")
            return

        soup = BeautifulSoup(response.text, 'html.parser')
        
        table = soup.find('table', class_='items')
        
        if not table:
            print("No table with class 'items' found.")
            return

        batch = db.batch()
        count = 0
        
        print("Clearing existing squad...")
        docs = db.collection('squad').stream()
        for doc in docs:
            doc.reference.delete()

        rows = table.find_all('tr', class_=['odd', 'even'])
        print(f"Found {len(rows)} player rows. Processing...")

        for row in rows:
            cols = row.find_all('td')
            if not cols: continue
            
            # Number
            number_div = row.find('div', class_='rn_nummer')
            number = number_div.get_text().strip() if number_div else None
            if number == "-": number = None
            
            # Name & Image & Position
            pos_cell = cols[1]
            inline_table = pos_cell.find('table', class_='inline-table')
            
            name = "Unknown"
            specific_pos = "Unknown"
            image_url = None
            
            if inline_table:
                # Image
                img_tag = inline_table.find('img')
                if img_tag:
                    image_url = img_tag.get('data-src') or img_tag.get('src')
                    name = img_tag.get('title') or img_tag.get('alt')
                
                # Position
                trs = inline_table.find_all('tr')
                if len(trs) > 1:
                    specific_pos = trs[1].get_text().strip()
            
            if name == "Unknown":
                continue

            # Grouping
            group, pos_code = map_position(specific_pos)
            
            # Age (col 2 usually)
            age = cols[2].get_text().strip() if len(cols) > 2 else ""
            # Some cleaning if age has extra text
            if "(" in age: age = age.split("(")[0].strip()

            # Nationality
            country = "Brasil" # Default
            if len(cols) > 3:
                flags = cols[3].find_all('img', class_='flaggenrahmen')
                if flags:
                    country = flags[0].get('title', 'Brasil')

            # Construct ID
            player_id = name.lower().replace(' ', '-')
            
            player_doc = {
                "name": name,
                "group": group, 
                "position": pos_code, 
                "specific_position": specific_pos,
                "number": number,
                "age": age,
                "country": country,
                "image": image_url,
                "source": "transfermarkt"
            }
            
            doc_ref = db.collection('squad').document(player_id)
            batch.set(doc_ref, player_doc)
            count += 1
            print(f"  Found: {name} ({specific_pos})")

        batch.commit()
        print(f"Successfully updated {count} players.")

    except Exception as e:
        print(f"Error scraping squad: {e}")

if __name__ == "__main__":
    scrape_squad()
