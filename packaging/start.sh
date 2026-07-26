#!/usr/bin/env bash
# AOS Nexus LPIN v2 — launch dev server (Linux / macOS)
set -euo pipefail
cd "$(dirname "$0")"

echo ""
echo "AOS Nexus LPIN v2"
echo "http://localhost:5173"
echo ""

if ! command -v npm >/dev/null 2>&1; then
  echo "[ERROR] npm not found. Run ./install.sh first."
  exit 1
fi

if [[ ! -d node_modules ]]; then
  echo "node_modules missing — npm install..."
  npm install
fi

# Open browser when possible
URL="http://localhost:5173/"
if command -v xdg-open >/dev/null 2>&1; then
  (sleep 1.5; xdg-open "$URL") &
elif command -v open >/dev/null 2>&1; then
  (sleep 1.5; open "$URL") &
fi

npm run dev
