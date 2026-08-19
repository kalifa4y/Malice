from PIL import Image

img = Image.open("public/assets/maison-alice-logo-transparent.png")
# Create web-optimized version
img_web = img.resize((1600, int(1600 * img.size[1] / img.size[0])), Image.Resampling.LANCZOS)
img_web.save("public/assets/maison-alice-logo.png", "PNG", optimize=True)
img_web.save("assets/maison-alice-logo.png", "PNG", optimize=True)
print("Web version saved! Size:", img_web.size)
