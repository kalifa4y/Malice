from PIL import Image

img = Image.open("assets/Alice_upscayl_4x_upscayl-standard-4x.png").convert("RGBA")
width, height = img.size

# Load pixels
pixels = img.load()

for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        # Calculate perceived brightness
        brightness = (r * 299 + g * 587 + b * 114) / 1000
        if brightness <= 15:
            pixels[x, y] = (r, g, b, 0)
        elif brightness <= 60:
            new_a = int(((brightness - 15) / 45.0) * 255)
            pixels[x, y] = (r, g, b, min(a, new_a))

img.save("public/assets/maison-alice-logo-transparent.png", "PNG")
img.save("assets/maison-alice-logo-transparent.png", "PNG")
print("Successfully generated transparent logo with pure PIL! Size:", img.size)
