
import json
import os
import random

def generate_analysis(file_path):
    if not os.path.exists(file_path):
        print("File not found.")
        return

    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Only generate if finished and missing data
    if data.get("status") not in ["ENCERRADA", "FINALIZADO"]:
        print("Match not finished. Skipping analysis generation.")
        return

    if "motm_data" in data and "pass_stats" in data:
        print("Analysis already exists. Skipping.")
        return

    print("Generating Post-Match Analysis...")

    # 1. Determine MOTM (Man of the Match)
    home_players = data.get("player_stats", {}).get("home", [])
    if home_players:
        # Sort by rating (descending)
        best_player = sorted(home_players, key=lambda x: x.get("rating", 0), reverse=True)[0]
        
        contribution_text = "Teve uma atuação sólida."
        if best_player.get("goals", 0) > 0:
            contribution_text = f"Decisivo com {best_player['goals']} gol(s)."
        elif best_player.get("assists", 0) > 0:
            contribution_text = f"O maestro do time com {best_player['assists']} assistência(s)."
        elif best_player.get("rating", 0) > 8.0:
            contribution_text = "Dominou as ações e controlou o ritmo do jogo."

        data["motm_data"] = {
            "name": best_player["name"],
            "rating": best_player["rating"],
            "position": best_player["position"],
            "contribution": contribution_text
        }
    
    # 2. Generate GK Stats (Neto?)
    # Estimate based on opponent shots
    away_shots_on_target = data["stats"]["shots_on_target"]["away"]
    saves = max(0, away_shots_on_target - data["away_score"]) # Crude estimate
    
    # Find home GK
    gk = next((p for p in home_players if p["position"] == "GOL"), {"name": "Goleiro"})
    
    data["goalkeeper_stats"] = {
        "name": gk["name"],
        "saves": saves,
        "saves_inside_box": max(0, saves - 1),
        "punched_clear": random.randint(0, 3),
        "high_claims": random.randint(1, 5),
        "clean_sheet": data["away_score"] == 0
    }

    # 3. Generate Pass Stats
    # Estimate based on possession
    poss_home = data["stats"]["possession"]["home"]
    base_passes_home = poss_home * 8 # approx 480 for 60%
    base_passes_away = (100 - poss_home) * 8
    
    data["pass_stats"] = {
        "accurate_passes": {
            "home": int(base_passes_home * 0.9), "away": int(base_passes_away * 0.85),
            "home_total": int(base_passes_home), "away_total": int(base_passes_away)
        },
        "sideways_passes": {
            "home": int(base_passes_home * 0.3), "away": int(base_passes_away * 0.3),
            "home_total": int(base_passes_home), "away_total": int(base_passes_away)
        },
        "final_third_entries": {
            "home": int(base_passes_home * 0.15), "away": int(base_passes_away * 0.10),
            "home_total": int(base_passes_home), "away_total": int(base_passes_away)
        },
        "final_third_accuracy": {
            "home": 82, "away": 70, "home_total": 100, "away_total": 100
        },
        "long_passes": {
            "home": int(base_passes_home * 0.05), "away": int(base_passes_away * 0.08),
            "home_total": int(base_passes_home), "away_total": int(base_passes_away)
        },
        "crosses": {
            "home": data["stats"]["corners"]["home"] * 3, "away": data["stats"]["corners"]["away"] * 3,
            "home_total": 0, "away_total": 0
        }
    }

    # Save back
    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
        
    print("Analysis generated and saved.")

if __name__ == "__main__":
    generate_analysis(os.path.join(os.path.dirname(__file__), "manual_live_game.json"))
