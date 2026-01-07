from newspaper import Article
import requests
from bs4 import BeautifulSoup

url = "https://www.fogaonet.com/noticias-do-botafogo/botafogo-fortaleza-campeonato-brasileiro-2025/"

print(f"Testing URL: {url}")

# Method 1: Newspaper3k (Current method)
print("\n--- Method 1: Newspaper3k ---")
try:
    article = Article(url)
    article.download()
    article.parse()
    print(f"Top Image: {article.top_image}")
    print(f"Images found: {len(article.images)}")
except Exception as e:
    print(f"Newspaper error: {e}")

# Method 2: BeautifulSoup (Custom extraction)
print("\n--- Method 2: BeautifulSoup ---")
try:
    headers = {'User-Agent': 'Mozilla/5.0'}
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Try different common meta tags for images
    og_image = soup.find("meta", property="og:image")
    print(f"og:image: {og_image['content'] if og_image else 'Not found'}")
    
    twitter_image = soup.find("meta", name="twitter:image")
    print(f"twitter:image: {twitter_image['content'] if twitter_image else 'Not found'}")
    
    # Try finding the first substantial image in the body
    content_img = soup.find("div", class_="entry-content")
    if content_img:
        first_img = content_img.find("img")
        print(f"First content image: {first_img['src'] if first_img else 'Not found'}")
        
except Exception as e:
    print(f"BS4 error: {e}")
