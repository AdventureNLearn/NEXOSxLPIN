#!/usr/bin/env bash
# Linux .desktop launcher for AOS Nexus LPIN v2
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP="${XDG_DATA_HOME:-$HOME/.local/share}/applications"
mkdir -p "$APP"
DESKTOP="$APP/aos-nexus-lpin-v2.desktop"
START="$ROOT/start.sh"
chmod +x "$START" 2>/dev/null || true

cat > "$DESKTOP" <<EOF
[Desktop Entry]
Type=Application
Name=AOS Nexus LPIN v2
Comment=Nexus modular intelligence platform
Exec=bash -lc 'cd "$ROOT" && ./start.sh'
Path=$ROOT
Terminal=true
Categories=Development;Education;
EOF
chmod +x "$DESKTOP"
echo "Desktop entry: $DESKTOP"
# Copy to Desktop if present
if [[ -d "$HOME/Desktop" ]]; then
  cp "$DESKTOP" "$HOME/Desktop/AOS Nexus LPIN v2.desktop" 2>/dev/null || true
  echo "Also: $HOME/Desktop/AOS Nexus LPIN v2.desktop"
fi
