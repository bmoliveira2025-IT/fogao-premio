
import requests

def check_url(url):
    print(f"Checking {url}...")
    try:
        r = requests.head(url, timeout=5)
        print(f"Status: {r.status_code}")
        if r.status_code == 200:
             # Double check it isn't a soft 404 (GE sometimes redirects to home)
             r2 = requests.get(url, timeout=5)
             if "404" in r2.url:
                 print("Redirected to 404/Home")
             else:
                 print("VALID URL FOUND!")
    except Exception as e:
        print(f"Error: {e}")

urls = [
    "https://ge.globo.com/rj/futebol/brasileirao-serie-a/jogo/29-01-2026/botafogo-cruzeiro.ghtml",
    "https://ge.globo.com/futebol/brasileirao-serie-a/jogo/29-01-2026/botafogo-cruzeiro.ghtml",
    "https://ge.globo.com/rj/futebol/jogo/29-01-2026/botafogo-cruzeiro.ghtml",
    "https://ge.globo.com/sp/futebol/brasileirao-serie-a/jogo/29-01-2026/botafogo-cruzeiro.ghtml", # Sometimes Hosted by away state? No, Botafogo home.
    "https://ge.globo.com/mg/futebol/brasileirao-serie-a/jogo/29-01-2026/botafogo-cruzeiro.ghtml"
]

for u in urls:
    check_url(u)
