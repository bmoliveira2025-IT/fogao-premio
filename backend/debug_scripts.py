
import os
from bs4 import BeautifulSoup
import json

filepath = "debug_sync_campeonato-carioca.html"
if os.path.exists(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'html.parser')
    scripts = soup.find_all('script')
    print(f"Total script tags: {len(scripts)}")
    
    for i, script in enumerate(scripts):
        if script.string:
            s_content = script.string.strip()
            if len(s_content) > 100:
                print(f"--- Script {i} (len: {len(s_content)}) ---")
                print(s_content[:200] + "...")
                # Search for keywords in this script
                if "Botafogo" in s_content:
                    print(">>> FOUND BOTAFOGO IN THIS SCRIPT! <<<")
                    with open(f"debug_script_{i}.js", "w", encoding="utf-8") as fs:
                        fs.write(s_content)
else:
    print("File not found")
