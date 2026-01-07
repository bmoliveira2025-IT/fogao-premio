import requests
from bs4 import BeautifulSoup

url = "https://www.lance.com.br/botafogo/alel-telles-revela-papel-de-luiz-henrique-em-chegada-ao-botafogo.html"
# Using a likely real URL based on previous output or finding a fresh one if needed.
# Since the previous output was truncated, I'll rely on the one I saw or just test with a known structure.
# Let's actually use the one from the truncated output or a generic one if I can. 
# "https://www.lance.com.br/botafogo/alex-telles-revela-papel-de-luiz-henrique-em-chegada-ao-botafogo.html" seems plausible from the truncated title "Alex Telles e o CT do Botafogo" 

headers = {'User-Agent': 'Mozilla/5.0'}

try:
    print(f"Fetching {url}...")
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Check og:image
    og_image = soup.find('meta', property='og:image')
    if og_image:
        print(f"Found og:image: {og_image.get('content')}")
        
    # Check other potential tags
    classes = ['img-responsive', 'article-image', 'main-image']
    for cls in classes:
        img = soup.find('img', class_=cls)
        if img:
             print(f"Found img with class {cls}: {img.get('src')}")
    
    imgs = soup.find_all('img')
    print(f"Total images: {len(imgs)}")
    for i in imgs[:5]:
        print(i.get('src'))

except Exception as e:
    print(f"Error: {e}")
