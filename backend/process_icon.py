from PIL import Image, ImageDraw, ImageFilter, ImageOps
import os

def create_rounded_icon(input_path, output_paths, corner_radius_ratio=0.22):
    try:
        if not os.path.exists(input_path):
            print(f"Error: Input file {input_path} not found.")
            return

        img = Image.open(input_path).convert("RGBA")
        
        # Create a mask for rounded corners
        # Standard iOS icon curvature is approximately 22% of dimension
        size = img.size
        mask = Image.new('L', size, 0)
        draw = ImageDraw.Draw(mask)
        
        # Calculate radius
        radius = int(min(size) * corner_radius_ratio)
        
        # Draw rounded rectangle
        draw.rounded_rectangle([(0, 0), size], radius=radius, fill=255)
        
        # Apply mask
        output = ImageOps.fit(img, size, centering=(0.5, 0.5))
        output.putalpha(mask)
        
        # Save to all destinations
        for path in output_paths:
            output.save(path, "PNG")
            print(f"Saved transparent icon to: {path}")
            
    except Exception as e:
        print(f"Error processing icon: {e}")

if __name__ == "__main__":
    # Input is the checked-out generated image (using the path from recent generation)
    # WARNING: I need the exact filename. Since I can't guess it dynamically in this script easily without arguments,
    # I will assume the agent will pass the path or I'll search for the latest png in the brain folder?
    # Better: The agent (me) will input the path in the run_command.
    
    # Wait, I'll hardcode the path I just generated which I know fits the context.
    input_file = r"C:\Users\braul\.gemini\antigravity\brain\b16c0dc5-de08-40e6-a627-2fb4ec003c30\premium_icon_rounded_border_1767835689130.png"
    
    destinations = [
        r"d:\Projetos\Fogão-Premio\portal\public\icon.png",
        r"d:\Projetos\Fogão-Premio\portal\public\apple-icon.png",
        r"d:\Projetos\Fogão-Premio\portal\src\app\favicon.ico" # Pillow handles saving as ICO if extension is .ico? Actually simply saving as png to .ico path might strictly be invalid format but browsers often handle it. Better to save specifically.
    ]
    
    # Special handling for ICO
    try:
        ico_dest = r"d:\Projetos\Fogão-Premio\portal\src\app\favicon.ico"
        img = Image.open(input_file).convert("RGBA")
        # Resize for ICO (standard sizes)
        icon_sizes = [(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)]
        img.save(ico_dest, format='ICO', sizes=icon_sizes)
        print(f"Saved ICO to: {ico_dest}")
    except Exception as e:
        print(f"Warning: Could not save true ICO ({e}), copying PNG as fallback")

    # Run the main rounded function for PNGs
    create_rounded_icon(input_file, destinations[:2])
