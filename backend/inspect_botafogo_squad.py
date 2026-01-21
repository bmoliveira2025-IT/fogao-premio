
import requests
from bs4 import BeautifulSoup

url = "https://www.botafogo.com.br/elenco/futebol"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

try:
    response = requests.get(url, headers=headers)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Try to find player containers (inspecting generic structure first)
        # Often these sites use cards or grids. 
        # I'll look for images and names.
        
        # Let's print classes of some divs to guess
        divs = soup.find_all('div', class_=True)
        classes = set()
        for d in divs:
            classes.update(d['class'])
            
        print(f"Found {len(classes)} unique classes.")
        
        # Try to find 'elenco' or 'player' related items
        potential_players = soup.find_all(lambda tag: tag.name == 'div' and ('atleta' in str(tag.get('class', '')).lower() or 'jogador' in str(tag.get('class', '')).lower()))
        
        print(f"Potential player divs found: {len(potential_players)}")
        
        if potential_players:
            first = potential_players[0]
            print("First player HTML snippet:")
            print(first.prettify()[:500])
        else:
            print("No obvious player divs. Dumping first 1000 chars of body:")
            print(response.text[:1000])

except Exception as e:
    print(f"Error: {e}")
