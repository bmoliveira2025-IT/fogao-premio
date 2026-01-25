
import requests
import re
import json

def test_scrape_ge_carioca():
    url = "https://ge.globo.com/rj/futebol/campeonato-carioca/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
    }
    
    print(f"Fetching {url}...")
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        print(f"Failed to fetch page: {response.status_code}")
        return

    print(f"Page size: {len(response.text)}")
    
    # Save a snippet
    with open("ge_carioca_snippet.html", "w", encoding="utf-8") as f:
        f.write(response.text[:10000])
    print("Saved ge_carioca_snippet.html")

    # Look for any JSON-like scripts
    scripts = re.findall(r'<script.*?>\s*(.*?)\s*</script>', response.text, re.DOTALL)
    print(f"Found {len(scripts)} scripts.")
    
    for i, script in enumerate(scripts):
        if "Botafogo" in script:
            print(f"Script {i} contains 'Botafogo'. Saving to script_{i}.js")
            with open(f"script_{i}.js", "w", encoding="utf-8") as f:
                f.write(script)
        
        if "const " in script and "{" in script:
            # Try to find what's being defined
            var_match = re.search(r'const\s+(\w+)\s*=', script)
            if var_match:
                print(f"Found constant: {var_match.group(1)}")

    # Specific common GE ones
    for marker in ['classificacao', 'agenda', 'rodada', 'jogos', 'INITIAL_STATE']:
        match = re.search(rf'const {marker}\s*=\s*({{.*?}});', response.text, re.DOTALL)
        if match:
            print(f"Found {marker} data!")
        else:
            match = re.search(rf'{marker}\s*:\s*({{.*?}})', response.text, re.DOTALL)
            if match:
                print(f"Found {marker} in object property!")

if __name__ == "__main__":
    test_scrape_ge_carioca()
