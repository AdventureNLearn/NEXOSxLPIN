#!/usr/bin/env bash
# macOS: place a double-clickable launcher on Desktop
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DESKTOP="$HOME/Desktop"
mkdir -p "$DESKTOP"
APP="$DESKTOP/AOS Nexus LPIN v2.command"
cat > "$APP" <<EOF
#!/bin/bash
cd "$ROOT"
exec ./start.sh
EOF
chmod +x "$APP"
echo "macOS launcher: $APP"
echo "Double-click it (first time: right-click → Open if Gatekeeper prompts)."
