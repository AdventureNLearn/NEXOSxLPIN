#!/usr/bin/env bash
# AOS Nexus LPIN v2 — one-shot install (Linux / macOS)
set -euo pipefail
cd "$(dirname "$0")"

echo ""
echo "============================================================"
echo " AOS Nexus LPIN v2 — install (Linux / macOS)"
echo "============================================================"
echo ""

if ! command -v node >/dev/null 2>&1; then
  echo "[ERROR] Node.js not found. Install Node 20+ LTS from https://nodejs.org/"
  exit 1
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "[ERROR] npm not found."
  exit 1
fi

echo "[OK] Node $(node -v) · npm $(npm -v)"
echo ""
echo "[1/3] npm install..."
npm install
echo "[OK] Dependencies"

echo ""
echo "[2/3] npm run build..."
if npm run build; then
  echo "[OK] dist/ ready (preview + iOS static host)"
else
  echo "[WARN] Build failed — dev server may still work"
fi

echo ""
echo "[3/3] Optional desktop helpers"
if [[ "$(uname -s)" == "Linux" ]] && [[ -x ./scripts/create-desktop-entry.sh ]]; then
  ./scripts/create-desktop-entry.sh || true
fi
if [[ "$(uname -s)" == "Darwin" ]] && [[ -x ./scripts/create-macos-alias.sh ]]; then
  ./scripts/create-macos-alias.sh || true
fi

echo ""
echo "Done. Start with:  ./start.sh"
echo "  Dev:     http://localhost:5173"
echo "  Preview: npm run preview"
echo ""
