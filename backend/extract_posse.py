
import os

filepath = "match_page_full.html"
if os.path.exists(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Search for "posse" around 247161
    search_pos = 247161
    start = max(0, search_pos - 1000)
    end = min(len(content), search_pos + 5000)
    
    snippet = content[start:end]
    print("--- SNIPPET AROUND POSSE ---")
    print(snippet)
    
    with open("match_data_snippet.txt", "w", encoding="utf-8") as f:
        f.write(snippet)
else:
    print("File not found")
