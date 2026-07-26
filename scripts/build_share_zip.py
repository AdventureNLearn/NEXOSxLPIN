# NEXOSxLPIN — fully installable platform zip
from __future__ import annotations

import re
import shutil
import zipfile
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_ROOT = ROOT / "releases"
VER = "2.0.0"
STAMP = datetime.now().strftime("%Y%m%d-%H%M")
NAME = f"NEXOSxLPIN-{VER}-{STAMP}"
STAGE = OUT_ROOT / NAME
ZIP_PATH = OUT_ROOT / f"{NAME}.zip"

INCLUDE_ROOT_FILES = [
    "package.json",
    "package-lock.json",
    "index.html",
    "vite.config.ts",
    "tsconfig.json",
    "tsconfig.app.json",
    "tsconfig.node.json",
    "tailwind.config.js",
    "postcss.config.js",
    ".oxlintrc.json",
    ".gitignore",
    "start-nexus.cmd",
    "compass-rose.ico",
    "nexos-lpin.ico",
    "nexos-lpin-v111.ico",
    "nexos-lpin-v140.ico",
    "brand-logo.jpg",
    "README.md",
    "LICENSE",
    "CONTRIBUTING.md",
    "VERSION.txt",
    "QUICKSTART.txt",
    "START.bat",
    "INSTALL.bat",
    "launch-nexos.cmd",
    "launch-nexos.vbs",
    "start-nexus.cmd",
    "install.sh",
    "start.sh",
]

INCLUDE_DIRS = ["src", "public", "docs", "dist"]

EXCLUDE_DIR_NAMES = {
    "node_modules",
    ".hermes",
    ".git",
    "legacy",
    "__pycache__",
    ".tmp",
    "releases",
}


def should_skip_rel(rel: Path) -> bool:
    if any(part in EXCLUDE_DIR_NAMES for part in rel.parts):
        return True
    if rel.name.lower().endswith(".log"):
        return True
    return False


def main() -> None:
    if not (ROOT / "package.json").exists():
        raise SystemExit(f"Not a package root: {ROOT}")
    dist = ROOT / "dist"
    if not dist.exists() or not any(dist.iterdir()):
        raise SystemExit("dist/ missing — run npm.cmd run build first")

    OUT_ROOT.mkdir(parents=True, exist_ok=True)
    if STAGE.exists():
        shutil.rmtree(STAGE)
    STAGE.mkdir(parents=True)

    for f in INCLUDE_ROOT_FILES:
        src = ROOT / f
        if src.exists():
            shutil.copy2(src, STAGE / f)

    for d in INCLUDE_DIRS:
        src = ROOT / d
        if not src.exists():
            continue
        for p in src.rglob("*"):
            if not p.is_file():
                continue
            rel = p.relative_to(ROOT)
            if should_skip_rel(rel):
                continue
            if p.suffix == ".map":
                continue
            target = STAGE / rel
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(p, target)

    pack = ROOT / "packaging"
    for name in ("INSTALL.bat", "START.bat", "install.sh", "start.sh", "README.md"):
        src = pack / name
        if src.exists():
            # Prefer root copies; packaging as fallback
            if not (STAGE / name).exists():
                shutil.copy2(src, STAGE / name)

    scripts = STAGE / "scripts"
    scripts.mkdir(exist_ok=True)
    for name in (
        "create-desktop-shortcut.ps1",
        "create-desktop-entry.sh",
        "create-macos-alias.sh",
    ):
        for base in (ROOT / "scripts", ROOT / "packaging" / "scripts"):
            src = base / name
            if src.exists():
                shutil.copy2(src, scripts / name)
                break

    icons = STAGE / "icons"
    icons.mkdir(exist_ok=True)
    ico = ROOT / "compass-rose.ico"
    if ico.exists():
        shutil.copy2(ico, icons / "compass-rose.ico")
        shutil.copy2(ico, STAGE / "compass-rose.ico")

    (STAGE / "start-nexus.cmd").write_text(
        "@echo off\r\ncd /d \"%~dp0\"\r\ncall \"%~dp0START.bat\"\r\n",
        encoding="utf-8",
    )

    pkg = STAGE / "package.json"
    if pkg.exists():
        text = pkg.read_text(encoding="utf-8")
        text = re.sub(r'"version"\s*:\s*"[^"]*"', f'"version": "{VER}"', text, count=1)
        text = re.sub(r'"name"\s*:\s*"[^"]*"', '"name": "nexos-lpin"', text, count=1)
        pkg.write_text(text, encoding="utf-8")

    (STAGE / "QUICKSTART.txt").write_text(
            "NEXOSxLPIN — Install & Run\r\n"
            "==========================\r\n"
            "\r\n"
            "WINDOWS\r\n"
            "  1. Install Node.js LTS: https://nodejs.org/\r\n"
            "  2. Unzip to a LOCAL disk folder (any path you choose)\r\n"
            "  3. Double-click INSTALL.bat  (or: npm.cmd install && npm.cmd run build)\r\n"
            "  4. Double-click START.bat\r\n"
            "  5. Browser: http://127.0.0.1:5173/\r\n"
            "  6. Optional desktop shortcut:\r\n"
            "       powershell -NoProfile -ExecutionPolicy Bypass -File scripts\\create-desktop-shortcut.ps1\r\n"
            "\r\n"
            "Prefer local disk over cloud-synced folders for best speed.\r\n"
            "\r\n"
            "LINUX / macOS\r\n"
            "  chmod +x install.sh start.sh && ./install.sh && ./start.sh\r\n"
            "\r\n"
            "Docs: docs\\DOC_INDEX.md · docs\\PII_AND_AGNOSTIC_POLICY.md\r\n"
            "PII: sample packs must stay free of private person identifiers.\r\n"
            "3D: illustrative only — not forensic.\r\n",
            encoding="utf-8",
        )

    for sh in STAGE.rglob("*.sh"):
        data = sh.read_text(encoding="utf-8").replace("\r\n", "\n")
        sh.write_text(data, encoding="utf-8", newline="\n")

    if ZIP_PATH.exists():
        ZIP_PATH.unlink()
    with zipfile.ZipFile(ZIP_PATH, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        for p in STAGE.rglob("*"):
            if p.is_file():
                zf.write(p, arcname=str(Path(NAME) / p.relative_to(STAGE)))

    file_count = sum(1 for p in STAGE.rglob("*") if p.is_file())
    size_mb = ZIP_PATH.stat().st_size / (1024 * 1024)
    print("STAGE", STAGE)
    print("FILES", file_count)
    print("ZIP", ZIP_PATH, f"{size_mb:.2f} MB")


if __name__ == "__main__":
    main()
