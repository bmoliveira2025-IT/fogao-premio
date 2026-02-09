import json
import re

def find_table_json():
    try:
        with open("full_page_source.txt", "r", encoding="utf-8") as f:
            text = f.read()

        # Find all JSON-like objects that contain "grupos" and "classificacao"
        # We search for "grupos" : [ and then try to find the balancing closing bracket
        matches = list(re.finditer(r'"grupos"\s*:\s*\[', text))
        print(f"Found {len(matches)} occurrences of 'grupos' : [")

        for i, match in enumerate(matches):
            start = match.start()
            # Find the start of the enclosing object (try to find the nearest '{' before)
            obj_start = text.rfind('{', 0, start)
            if obj_start == -1: continue
            
            # Simple bracket counting to find the end of the object
            count = 0
            obj_end = -1
            for j in range(obj_start, len(text)):
                if text[j] == '{': count += 1
                elif text[j] == '}': count -= 1
                
                if count == 0:
                    obj_end = j + 1
                    break
            
            if obj_end != -1:
                json_str = text[obj_start:obj_end]
                try:
                    data = json.loads(json_str)
                    groups = data.get('grupos', [])
                    if groups and len(groups) > 0:
                        teams = groups[0].get('classificacao', [])
                        if teams:
                            print(f"SUCCESS! Found valid classification JSON at {obj_start}")
                            print(f"Teams found: {len(teams)}")
                            with open(f"valid_table_{i}.json", "w", encoding="utf-8") as out:
                                json.dump(data, out, indent=2)
                            return data
                except:
                    continue
        print("No valid table classification found.")
        return None

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    find_table_json()
