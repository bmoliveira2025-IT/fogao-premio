
import os

filepath = "match_page_large.html"
if os.path.exists(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Search for "posse" and print context
    pos = 0
    while True:
        pos = content.lower().find("posse", pos)
        if pos == -1:
            break
        print(f"--- Found 'posse' at {pos} ---")
        context = content[max(0, pos-100):min(len(content), pos+500)]
        print(context)
        print("-" * 50)
        pos += 5
else:
    print("File not found")
