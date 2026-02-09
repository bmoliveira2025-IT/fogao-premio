import requests

def find_context():
    url = "https://ge.globo.com/rj/futebol/campeonato-carioca/"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            return

        text = response.text
        target = "Taça Guanabara"
        index = text.find(target)
        while index != -1:
            print(f"--- Found {target} at {index} ---")
            print(text[index-100:index+500])
            index = text.index(target, index + 1)
            # Just do 3 for now
            if index > text.find(target) + 10000: break

    except Exception as e:
        print(f"Done or Error: {e}")

if __name__ == "__main__":
    find_context()
