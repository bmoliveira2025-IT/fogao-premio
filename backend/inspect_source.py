import requests
from bs4 import BeautifulSoup

def inspect():
    url = "https://ge.globo.com/futebol/times/botafogo/agenda-de-jogos-do-botafogo/"
    print(f"Inspecting: {url}")
    headers = {'User-Agent': 'Mozilla/5.0'}
    try:
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Look for script tags that might contain NEXT_DATA
        scripts = soup.find_all('script')
        for script in scripts:
            if script.string and 'json' in script.string:
                print(f"Found JSON in script: {script.string[:200]}...")

        # Also look for regular text
        target = soup.find(string=lambda t: t and ("Próximos jogos" in t))
        if target:
            print("Found 'Próximos jogos' text!")
            # Convert to string to search for img tags in the vicinity
            parent_html = target.find_parent().find_parent().find_parent().prettify()
            # Find all img tags in this block
            soup_fragment = BeautifulSoup(parent_html, 'html.parser')
            imgs = soup_fragment.find_all('img')
            for img in imgs:
                print(f"Image found: {img.get('src')} - Alt: {img.get('alt')}")
        else:
            print("Text 'Próximos jogos' not found in static HTML.")

    except Exception as e:
        print(e)

inspect()
