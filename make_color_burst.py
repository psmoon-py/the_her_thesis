# file: make_starburst_rosalind_webp.py
#
# Usage (from PowerShell in this folder):
#   python make_starburst_rosalind_webp.py
#
# Input:
#   rosand.jpg  -> real Rosalind Franklin portrait
#
# Output:
#   starburst_rosalind.webp  (animated, transparent background)
#
# Effect:
#   Transparent -> white starburst + Rosalind in a circle -> fade back to transparent

import os, math
import numpy as np
from PIL import Image, ImageOps, ImageFilter

PORTRAIT_FILE = "rosalind.png"
OUTPUT_FILE   = "curie_starburst.webp"

SIZE      = 768   # canvas size (square)
FPS       = 24
FRAMES_IN = 12    # burst grows in
FRAMES_HOLD = 12  # fully visible
FRAMES_OUT = 12   # fade out
TOTAL_FRAMES = FRAMES_IN + FRAMES_HOLD + FRAMES_OUT

if not os.path.exists(PORTRAIT_FILE):
    raise FileNotFoundError(f"Place the portrait as {PORTRAIT_FILE} in this folder.")

# --- Load and prep Rosalind portrait ---
portrait = Image.open(PORTRAIT_FILE).convert("RGB")

# where the circular window will be
radius = int(SIZE * 0.28)
diam   = radius * 2
cx = cy = SIZE // 2

# fit portrait into that circle
portrait_fitted = ImageOps.fit(
    portrait, (diam, diam),
    method=Image.LANCZOS,
    centering=(0.5, 0.5)
).filter(ImageFilter.GaussianBlur(radius=0.5))

# circular alpha mask for the portrait
mask = Image.new("L", (diam, diam), 0)
m_draw = ImageDraw = Image.Draw = __import__("PIL.ImageDraw", fromlist=["ImageDraw"]).ImageDraw
m = mask
draw = m_draw(mask)
draw.ellipse((0, 0, diam-1, diam-1), fill=255)

portrait_rgba = portrait_fitted.convert("RGBA")
portrait_rgba.putalpha(mask)

# --- Precompute coordinate grid for starburst ---
y, x = np.mgrid[0:SIZE, 0:SIZE].astype(np.float32)
cx_f = (SIZE - 1) / 2.0
cy_f = (SIZE - 1) / 2.0
dx = x - cx_f
dy = y - cy_f
r  = np.sqrt(dx*dx + dy*dy) / (SIZE / 2.0)  # normalized radius 0 at center, ~1 at edge
theta = np.arctan2(dy, dx)  # -pi..pi

# Base radial falloff for rays (brighter near circle, fading outward)
radial = np.exp(-((r - 0.4)**2) / (2 * (0.18**2)))  # ring around the portrait

# Angular spikes: cos(kθ) pattern
SPIKES = 64
spikes = np.cos(theta * SPIKES)

# Normalize to 0..1 and sharpen
spikes_norm = (spikes + 1.0) / 2.0  # 0..1
spikes_norm = spikes_norm**1.8

# Combine radial + spikes into a base intensity map
base_intensity = radial * spikes_norm  # 0..1

def smoothstep(t: float) -> float:
    return t*t*(3 - 2*t)

frames = []

for i in range(TOTAL_FRAMES):
    # envelope for opening, hold, closing
    if i < FRAMES_IN:
        t = i / max(1, FRAMES_IN - 1)
        env = smoothstep(t)
    elif i < FRAMES_IN + FRAMES_HOLD:
        env = 1.0
    else:
        j = i - FRAMES_IN - FRAMES_HOLD
        t = j / max(1, FRAMES_OUT - 1)
        env = 1.0 - smoothstep(t)

    # optional pulsing of spikes over time
    phase = i / TOTAL_FRAMES
    pulsate = 0.85 + 0.15*math.sin(2*math.pi*phase*1.5)

    intensity = base_intensity * env * pulsate  # 0..~1

    # Build RGBA starburst on transparent background
    alpha_star = np.clip(intensity * 1.4, 0, 1)  # scale up for stronger rays
    # Color is white
    star_rgb = np.ones((SIZE, SIZE, 3), dtype=np.float32) * 255.0

    # Start with transparent canvas
    canvas = np.zeros((SIZE, SIZE, 4), dtype=np.float32)

    # Put starburst (RGB + alpha)
    canvas[..., 0:3] = star_rgb * alpha_star[..., None]
    canvas[..., 3]   = alpha_star * 255.0

    # Composite portrait in the center (full opacity inside circle)
    # Convert portrait_rgba to numpy in same size with transparent background
    full_portrait = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    full_portrait.paste(
        portrait_rgba,
        (cx - radius, cy - radius),
        portrait_rgba
    )
    p_np = np.array(full_portrait).astype(np.float32)

    # Alpha composite: portrait over starburst
    alpha_p = p_np[..., 3:4] / 255.0
    alpha_c = canvas[..., 3:4] / 255.0

    out_rgb = p_np[..., 0:3] * alpha_p + canvas[..., 0:3] * (1 - alpha_p)
    out_a   = alpha_p + alpha_c * (1 - alpha_p)

    out = np.zeros_like(canvas)
    out[..., 0:3] = out_rgb
    out[..., 3]   = out_a[..., 0] * 255.0

    # Small blur to soften rays
    frame_img = Image.fromarray(np.clip(out, 0, 255).astype("uint8"), mode="RGBA")
    frame_img = frame_img.filter(ImageFilter.GaussianBlur(radius=0.4))
    frames.append(frame_img)

# --- Save animated WebP with full alpha (transparent background) ---
frames[0].save(
    OUTPUT_FILE,
    save_all=True,
    append_images=frames[1:],
    duration=int(1000 / FPS),
    loop=0,
    format="WEBP",
    lossless=True,
)

print("Saved:", OUTPUT_FILE)
