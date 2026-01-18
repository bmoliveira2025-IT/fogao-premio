import requests
from bs4 import BeautifulSoup
from newspaper import Article

url = "https://ge.globo.com/futebol/times/botafogo/noticia/2025/01/18/botafogo-demonstra-interesse-em-enzo-diaz-do-river-plate-alvo-do-botafogo.ghtml" # URL constructed from bits
# Wait, let me try to verify the URL first. 
# Actually, I'll use a more generic script that takes the URL from the previous output if possible.
# But I can just test a likely GE URL.

urls = [
    "https://ge.globo.com/futebol/times/botafogo/noticia/2026/01/18/veloz-habilidoso-e-temperamental-conheca-enso-gonzalez-alvo-do-botafogo.ghtml"
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}

for url in urls:
    print(f"\nTesting URL: {url}")
    try:
        # Test with Newspaper
        article = Article(url)
        article.download()
        article.parse()
        print(f"Newspaper top_image: {article.top_image}")
        
        # Test with BeautifulSoup (og:image)
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, 'html.parser')
        og_image = soup.find('meta', property='og:image')
        print(f"OG Image (BeautifulSoup): {og_image['content'] if og_image else 'Not found'}")
        
        # Test specific GE structure if needed
        # GE sometimes has image in <img class="content-media__image">
        content_img = soup.find('img', class_='content-media__image')
        print(f"Content Media Image: {content_img['src'] if content_img else 'Not found'}")

    except Exception as e:
        print(f"Error: {e}")
