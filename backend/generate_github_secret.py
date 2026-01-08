import json
import os

def generate():
    try:
        # Look for service-account.json in the same directory
        path = os.path.join(os.path.dirname(__file__), 'service-account.json')
        if not os.path.exists(path):
             print(f"Error: {path} not found.")
             return

        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        # Convert to compact JSON string
        compact_json = json.dumps(data, separators=(',', ':'))
        
        print("\n=== COPIE O CONTEÚDO ABAIXO PARA O GITHUB SECRET 'FIREBASE_CREDENTIALS_JSON' ===\n")
        print(compact_json)
        print("\n===============================================================================\n")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    generate()
