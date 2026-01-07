
import shutil
import os

source_dir = r"C:\Users\braul\.gemini\antigravity\brain\0634e48c-cf31-4339-bdb6-a15ec2466e90"
dest_dir = r"d:\Projetos\Fogão-Premio\portal\public\premium"

files = {
    "premium_tactics_defense_1767723697222.png": "tactics.png",
    "premium_ct_training_1767723715101.png": "ct.png",
    "premium_future_stadium_1767723732925.png": "future.png"
}

for src_name, dest_name in files.items():
    src_path = os.path.join(source_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name)
    
    try:
        if os.path.exists(src_path):
            shutil.copy2(src_path, dest_path)
            print(f"Copied {src_name} to {dest_name}")
        else:
            print(f"Source not found: {src_name}")
    except Exception as e:
        print(f"Error copying {src_name}: {e}")
