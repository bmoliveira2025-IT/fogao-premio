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

def scrape_squad():
    url = "https://www.espn.com.br/futebol/time/elenco/_/id/6086/bra.botafogo"
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    
    print(f"Fetching squad from {url}...")
    try:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            print(f"Failed to fetch content: {response.status_code}")
            return

        soup = BeautifulSoup(response.text, 'html.parser')
        
        sections = soup.find_all('div', class_='Table__Title')
        
        if not sections:
            print("No sections found.")
            return

        batch = db.batch()
        count = 0
        
        print("Clearing existing squad...")
        docs = db.collection('squad').stream()
        for doc in docs:
            doc.reference.delete()

        for section in sections:
            position_group = section.get_text().strip()
            # print(f"Processing '{position_group}'...")
            
            table = section.find_next('table')
            if not table:
                continue
            
            rows = table.find_all('tr')
            
            for row in rows:
                classes = row.get('class', [])
                
                # Filter out actual sub-headers or header rows if any
                if 'Table__sub-header' in classes:
                     continue
                
                # Check directly if it looks like a header (th)
                if row.find('th'):
                    continue

                # Check if it's a data row
                cols = row.find_all('td')
                if not cols or len(cols) < 2:
                    continue
                        
                # 1. Name and Image
                name_col = cols[0]
                img_tag = name_col.find('img')
                name_link = name_col.find('a')
                
                if not name_link:
                    continue
                
                name = name_link.get_text().strip()
                detail_url = name_link['href']
                
                # Image URL
                image_url = None
                if img_tag and 'src' in img_tag.attrs:
                    image_url = img_tag['src']
                    if "nophoto" in image_url:
                        image_url = None 
                
                # 3. Position (Specific)
                specific_pos = cols[1].get_text().strip() if len(cols) > 1 else position_group
                
                # 4. Age
                age = cols[2].get_text().strip() if len(cols) > 2 else ""
                
                # 5. Nationality
                country = ""
                if len(cols) > 5:
                    country_col = cols[5]
                    stat_value = country_col.get_text().strip()
                    country = stat_value
                
                # Construct ID
                player_id = name.lower().replace(' ', '-')
                
                player_doc = {
                    "name": name,
                    "group": position_group, # Goleiros, Defensores...
                    "position": specific_pos, # G, Z, LE, LD, M...
                    "number": None,
                    "age": age,
                    "country": country,
                    "image": image_url,
                    "espn_url": detail_url
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
