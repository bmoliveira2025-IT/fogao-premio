
import os
import re

filepath = "debug_sync_campeonato-carioca.html"
if os.path.exists(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Search for "match" (case insensitive, possibly encoded)
    # Common encodings: "match", \u0022match\u0022, &quot;match&quot;
    patterns = [
        r'"match":',
        r'\\u0022match\\u0022:',
        r'&quot;match&quot;:'
    ]
    
    for p in patterns:
        print(f"Searching for pattern: {p}")
        matches = list(re.finditer(p, content))
        print(f"Found {len(matches)} matches.")
        for i, m in enumerate(matches[:5]): # Show first 5
            start = max(0, m.start() - 100)
            end = min(len(content), m.end() + 500)
            print(f"Match {i} at {m.start()}:")
            print(content[start:end])
            print("-" * 50)
else:
    print("File not found")
