import requests
from bs4 import BeautifulSoup
import sys

# Force UTF-8 encoding for output
sys.stdout.reconfigure(encoding='utf-8')

def test_fogaonet_scraping():
    url = "https://www.fogaonet.com/"
    print(f"Testing URL: {url}")
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers)
        
        if response.status_code != 200:
            print(f"Failed to fetch page. Status: {response.status_code}")
            return

        soup = BeautifulSoup(response.text, 'html.parser')
        
        all_links = [a['href'] for a in soup.find_all('a', href=True)]
        
        with open("links_output.txt", "w", encoding="utf-8") as f:
            for link in all_links:
                f.write(link + "\n")
        
        print("Links written to links_output.txt")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_fogaonet_scraping()
