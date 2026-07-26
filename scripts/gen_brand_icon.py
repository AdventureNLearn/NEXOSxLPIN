#!/usr/bin/env python3
"""Generate NEXOSxLPIN brand icon assets (PNG + multi-size ICO) — 1.1.1 redesign.

Motif: night tile · dual SME lens aperture · compass rose · hub network.
Pure Pillow (no cairo). Writes:
  public/brand-icon-256.png
  public/brand-icon-512.png
  public/brand-logo.jpg
  brand-logo.jpg
  nexos-lpin.ico
  compass-rose.ico  (legacy alias)
"""
from __future__ import annotations

import math
import struct
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def mix(c1: tuple[int, int, int], c2: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    return (
        int(lerp(c1[0], c2[0], t)),
        int(lerp(c1[1], c2[1], t)),
        int(lerp(c1[2], c2[2], t)),
    )


def draw_icon(size: int) -> Image.Image:
    """Render crisp icon at `size` (square)."""
    s = float(size)
    scale = s / 64.0

    # Night field gradient
    field = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    fd = ImageDraw.Draw(field)
    for y in range(size):
        t = y / max(1, size - 1)
        col = mix((7, 16, 28), (3, 6, 13), t) + (255,)
        fd.line([(0, y), (size - 1, y)], fill=col)

    # Rounded tile mask
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        [0, 0, size - 1, size - 1], radius=max(2, int(15 * scale)), fill=255
    )
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    img.paste(field, (0, 0), mask)
    d = ImageDraw.Draw(img)

    # Border
    pad = max(1, int(1.25 * scale))
    d.rounded_rectangle(
        [pad, pad, size - 1 - pad, size - 1 - pad],
        radius=max(2, int(13.75 * scale)),
        outline=(34, 211, 238, 155),
        width=max(1, int(1.5 * scale)),
    )

    cx, cy = 32 * scale, 33 * scale

    # Soft glow
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gr = 22.5 * scale
    gd.ellipse([cx - gr, cy - gr, cx + gr, cy + gr], fill=(34, 211, 238, 60))
    glow = glow.filter(ImageFilter.GaussianBlur(radius=max(1.0, 2.2 * scale)))
    img = Image.alpha_composite(img, glow)
    d = ImageDraw.Draw(img)

    # Aperture rings
    for rad, col, w in (
        (20.5 * scale, (103, 232, 249, 215), max(1, int(1.8 * scale))),
        (15.25 * scale, (22, 78, 99, 210), max(1, int(1.1 * scale))),
    ):
        d.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], outline=col, width=w)

    # Dual lens facets
    def ellipse_at(ecx: float, ecy: float, rx: float, ry: float, fill):
        d.ellipse([ecx - rx, ecy - ry, ecx + rx, ecy + ry], fill=fill)

    ellipse_at(27.5 * scale, cy, 9.5 * scale, 12 * scale, (34, 211, 238, 95))
    ellipse_at(36.5 * scale, cy, 9.5 * scale, 12 * scale, (99, 102, 241, 115))
    ellipse_at(cx, cy, 7.2 * scale, 9.5 * scale, (14, 165, 233, 45))

    # Compass spikes
    def spike(angle_deg: float, length: float, half_w: float, color):
        a = math.radians(angle_deg)
        tx = cx + math.sin(a) * length
        ty = cy - math.cos(a) * length
        px = math.cos(a) * half_w
        py = math.sin(a) * half_w
        bx = cx + math.sin(a) * (length * 0.22)
        by = cy - math.cos(a) * (length * 0.22)
        d.polygon([(tx, ty), (bx + px, by + py), (cx, cy), (bx - px, by - py)], fill=color)

    spike(0, 19.5 * scale, max(1.2 * scale, 2.1 * scale), (236, 254, 255, 250))
    spike(180, 18.5 * scale, max(1.1 * scale, 1.9 * scale), (34, 211, 238, 215))
    spike(90, 18.0 * scale, max(1.0 * scale, 1.8 * scale), (165, 243, 252, 225))
    spike(270, 18.0 * scale, max(1.0 * scale, 1.8 * scale), (165, 243, 252, 225))
    for ang in (45, 135, 225, 315):
        col = (103, 232, 249, 180) if ang in (45, 315) else (99, 102, 241, 170)
        spike(ang, 14.5 * scale, max(0.9 * scale, 1.25 * scale), col)

    # Hub + network
    hr = max(2.0, 3.5 * scale)
    d.ellipse([cx - hr, cy - hr, cx + hr, cy + hr], fill=(255, 255, 255, 255))
    ir = max(1.0, 1.5 * scale)
    d.ellipse([cx - ir, cy - ir, cx + ir, cy + ir], fill=(14, 116, 144, 255))

    nodes = [
        (22 * scale, 26 * scale, max(1.0, 1.6 * scale), (165, 243, 252, 255)),
        (42 * scale, 26 * scale, max(1.0, 1.6 * scale), (165, 243, 252, 255)),
        (22 * scale, 40 * scale, max(1.0, 1.35 * scale), (103, 232, 249, 255)),
        (42 * scale, 40 * scale, max(1.0, 1.35 * scale), (103, 232, 249, 255)),
    ]
    lw = max(1, int(1.15 * scale))
    for nx, ny, nr, ncol in nodes:
        d.line([(nx, ny), (cx, cy)], fill=(165, 243, 252, 165), width=lw)
        d.ellipse([nx - nr, ny - nr, nx + nr, ny + nr], fill=ncol)

    # North cap
    d.polygon(
        [
            (32 * scale, 7.0 * scale),
            (30.0 * scale, 12.4 * scale),
            (34.0 * scale, 12.4 * scale),
        ],
        fill=(103, 232, 249, 255),
    )
    stem_w = max(1.0, 1.7 * scale)
    d.rounded_rectangle(
        [cx - stem_w / 2, 13.0 * scale, cx + stem_w / 2, 16.4 * scale],
        radius=max(1, int(0.6 * scale)),
        fill=(34, 211, 238, 255),
    )

    # Clean corners
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(img, (0, 0), mask)
    return out


def write_ico(path: Path, frames: dict[int, Image.Image]) -> None:
    """Write a multi-size ICO with PNG-compressed frames (Vista+)."""
    sizes = sorted(frames)
    images = [frames[s].convert("RGBA") for s in sizes]
    # Encode each frame as PNG bytes
    png_blobs: list[bytes] = []
    for im in images:
        from io import BytesIO

        buf = BytesIO()
        im.save(buf, format="PNG")
        png_blobs.append(buf.getvalue())

    # ICONDIR + ICONDIRENTRY*n + image data
    count = len(images)
    header = struct.pack("<HHH", 0, 1, count)
    entries = bytearray()
    offset = 6 + 16 * count
    data = bytearray()
    for im, blob in zip(images, png_blobs):
        w, h = im.size
        # 0 means 256 in ICO directory
        wb = 0 if w >= 256 else w
        hb = 0 if h >= 256 else h
        entries += struct.pack("<BBBBHHII", wb, hb, 0, 0, 1, 32, len(blob), offset)
        data += blob
        offset += len(blob)
    path.write_bytes(header + bytes(entries) + bytes(data))


def main() -> None:
    PUBLIC.mkdir(parents=True, exist_ok=True)

    frames = {s: draw_icon(s) for s in (16, 32, 48, 64, 128, 256, 512)}

    frames[256].save(PUBLIC / "brand-icon-256.png", format="PNG", optimize=True)
    frames[512].save(PUBLIC / "brand-icon-512.png", format="PNG", optimize=True)

    logo = Image.new("RGB", (1024, 1024), (5, 7, 15))
    big = frames[512].resize((960, 960), Image.Resampling.LANCZOS)
    # Prefer native 512 upscale from draw for sharpness at 960
    big = draw_icon(960)
    logo.paste(big, ((1024 - 960) // 2, (1024 - 960) // 2), big)
    logo.save(PUBLIC / "brand-logo.jpg", format="JPEG", quality=92, optimize=True)
    logo.save(ROOT / "brand-logo.jpg", format="JPEG", quality=92, optimize=True)

    ico_path = ROOT / "nexos-lpin.ico"
    write_ico(ico_path, {s: frames[s] for s in (16, 32, 48, 64, 128, 256)})
    alias = ROOT / "compass-rose.ico"
    alias.write_bytes(ico_path.read_bytes())
    # Versioned copy so Windows shortcut cache invalidates on redesign
    ver_ico = ROOT / "nexos-lpin-v111.ico"
    ver_ico.write_bytes(ico_path.read_bytes())

    print("Wrote", PUBLIC / "brand-icon-256.png")
    print("Wrote", PUBLIC / "brand-icon-512.png")
    print("Wrote", PUBLIC / "brand-logo.jpg")
    print("Wrote", ROOT / "brand-logo.jpg")
    print("Wrote", ico_path, ico_path.stat().st_size, "bytes")
    print("Wrote", alias)
    print("Wrote", ver_ico)
    for s in (16, 32, 48, 64, 128, 256):
        print(f"  ico frame {s}x{s}")


if __name__ == "__main__":
    main()
