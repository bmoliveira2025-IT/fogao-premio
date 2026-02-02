
import os
import json

manual_path = os.path.join("backend", "manual_live_game.json")
print(f"Checking path: {os.path.abspath(manual_path)}")
if os.path.exists(manual_path):
    print("File exists.")
    with open(manual_path, "r", encoding="utf-8") as f:
        data = json.load(f)
        print(f"ge_url: '{data.get('ge_url')}'")
else:
    print("File DOES NOT exist.")
