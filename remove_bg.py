from rembg import remove
from PIL import Image

input_path = r"C:\Users\braul\.gemini\antigravity-ide\brain\bb7e6ada-66ef-475a-9a29-e3b3d637c732\flame_logo_white_bg_1780883636977.png"
output_path = r"d:\Projetos\Fogão-Premio\portal\public\logo-premium.png"

with open(input_path, 'rb') as i:
    with open(output_path, 'wb') as o:
        input = i.read()
        output = remove(input)
        o.write(output)
print("Background removed successfully!")
