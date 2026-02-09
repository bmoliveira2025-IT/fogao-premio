import json
import re

def find_tg_table():
    try:
        with open("full_page_source.txt", "r", encoding="utf-8") as f:
            text = f.read()

        # Search for "Taça Guanabara" or its escaped version
        target = "Ta\\u00e7a Guanabara"
        if target not in text:
            target = "Taça Guanabara"
            
        print(f"Targeting: {target}")
        
        # Find occurrences of the target
        matches = list(re.finditer(re.escape(target), text))
        for i, match in enumerate(matches):
            start = match.start()
            # Look for "grupos" around this occurrence (it might be before or after)
            # Standings are usually in a large JSON block
            chunk = text[max(0, start-5000): min(len(text), start+50000)]
            
            # Find all JSON-like objects in the chunk
            # Search for objects that have groups and classification
            candidates = list(re.finditer(r'\{[^{}]*"grupos"\s*:\s*\[', chunk))
            for cand in candidates:
                cand_start = cand.start()
                # Find the balancing closing brace
                count = 0
                obj_end = -1
                for k in range(cand_start, len(chunk)):
                    if chunk[k] == '{': count += 1
                    elif chunk[k] == '}': count -= 1
                    if count == 0:
                        obj_end = k + 1
                        break
                
                if obj_end != -1:
                    json_str = chunk[cand_start:obj_end]
                    try:
                        data = json.loads(json_str)
                        # Check if it contains classification
                        if "grupos" in data and len(data["grupos"]) > 0:
                            if "classificacao" in data["grupos"][0]:
                                print(f"FOUND valid standings JSON in chunk around {start}")
                                with open(f"tg_stanking_{i}.json", "w", encoding="utf-8") as out:
                                    json.dump(data, out, indent=2)
                                print(f"Saved to tg_stanking_{i}.json")
                                return data
                    except:
                        continue
        print("No valid TG standings found in searching.")
        return None

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    find_tg_table()
