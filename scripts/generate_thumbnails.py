from __future__ import annotations

import argparse
from pathlib import Path
from PIL import Image, ImageChops, ImageOps

SUPPORTED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif"}


def build_thumb_name(source: Path) -> str:
    return f"{source.stem}.webp"


def crop_white_margins(image: Image.Image, padding_ratio: float = 0.04) -> Image.Image:
    rgb = image.convert("RGB")
    background = Image.new("RGB", rgb.size, (255, 255, 255))
    diff = ImageChops.difference(rgb, background)
    mask = diff.convert("L").point(lambda p: 255 if p > 10 else 0)
    bbox = mask.getbbox()

    if not bbox:
        return image

    width, height = image.size
    left, top, right, bottom = bbox
    padding = max(10, int(min(width, height) * padding_ratio))

    left = max(0, left - padding)
    top = max(0, top - padding)
    right = min(width, right + padding)
    bottom = min(height, bottom + padding)

    return image.crop((left, top, right, bottom))


def compose_preview_canvas(
    image: Image.Image,
    width: int,
    height: int,
    canvas_padding_ratio: float = 0.08,
) -> Image.Image:
    image = image.convert("RGBA")
    inner_width = max(1, width - int(width * canvas_padding_ratio * 2))
    inner_height = max(1, height - int(height * canvas_padding_ratio * 2))
    fitted = ImageOps.contain(image, (inner_width, inner_height), method=Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (width, height), (255, 255, 255, 255))
    offset_x = (width - fitted.width) // 2
    offset_y = (height - fitted.height) // 2
    canvas.alpha_composite(fitted, (offset_x, offset_y))
    return canvas.convert("RGB")


def generate_thumbnail(source: Path, destination: Path, width: int, height: int, quality: int) -> None:
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image)
        image = crop_white_margins(image)
        image = compose_preview_canvas(image, width, height)

        destination.parent.mkdir(parents=True, exist_ok=True)
        image.save(destination, format="WEBP", quality=quality, method=6)


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate consistent WebP thumbnails for a product image folder.")
    parser.add_argument("source", type=Path, help="Source folder containing product images")
    parser.add_argument("--width", type=int, default=960, help="Thumbnail canvas width in pixels")
    parser.add_argument("--height", type=int, default=640, help="Thumbnail canvas height in pixels")
    parser.add_argument("--quality", type=int, default=72, help="WebP quality setting")
    args = parser.parse_args()

    source_dir = args.source
    if not source_dir.exists() or not source_dir.is_dir():
        raise SystemExit(f"Source folder not found: {source_dir}")

    thumbs_dir = source_dir / "thumbs"
    generated = 0

    for source in sorted(source_dir.iterdir()):
        if not source.is_file() or source.suffix.lower() not in SUPPORTED_EXTENSIONS:
            continue
        destination = thumbs_dir / build_thumb_name(source)
        generate_thumbnail(source, destination, args.width, args.height, args.quality)
        generated += 1

    print(f"Generated {generated} thumbnails in {thumbs_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
