
import requests
url = "https://ge.globo.com/rj/futebol/campeonato-carioca/"
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}
response = requests.get(url, headers=headers)
with open("ge_carioca.html", "w", encoding="utf-8") as f:
    f.write(response.text)
print("Saved ge_carioca.html")
