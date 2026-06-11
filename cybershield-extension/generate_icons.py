#!/usr/bin/env python3
"""
Run this once to generate placeholder icons for CyberShield X extension.
Requires Pillow: pip install Pillow
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os

    sizes = [16, 32, 48, 128]
    os.makedirs("icons", exist_ok=True)

    for size in sizes:
        img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)

        # Background circle
        draw.ellipse([2, 2, size - 2, size - 2], fill=(0, 200, 255, 220))

        # Shield shape (simplified)
        margin = size // 5
        mid = size // 2
        draw.polygon([
            (mid, margin),
            (size - margin, margin + size // 6),
            (size - margin, mid),
            (mid, size - margin),
            (margin, mid),
            (margin, margin + size // 6),
        ], fill=(10, 10, 20, 255))

        img.save(f"icons/icon{size}.png")
        print(f"Created icons/icon{size}.png")

    print("\nAll icons created! Now load the extension in Edge.")

except ImportError:
    print("Pillow not installed. Run: pip install Pillow")
    print("Or just use any 16x16, 32x32, 48x48, 128x128 PNG files named icon16.png etc.")
    print("The extension will work without icons — Edge will show a default placeholder.")
