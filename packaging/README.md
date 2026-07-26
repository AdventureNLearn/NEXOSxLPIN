# AOS Nexus LPIN v2.1 — Share package

**Product:** AOS Nexus LPIN v2.1  
**Platform:** Nexus modular intelligence workbench  
**Version:** 2.1.0  
**Root:** `C:\Nexus\v2.1`  

One zip. Install and run on **Windows**, **Linux**, and **macOS**.  
**iOS / iPadOS:** open the production build in Safari (see below) — Node cannot install natively on iOS.

---

## Requirements

| Platform | Needs |
|----------|--------|
| **Windows 10/11** | [Node.js 20+ LTS](https://nodejs.org/) (includes npm) |
| **Linux** | Node 20+ (`node` + `npm` on PATH) |
| **macOS** | Node 20+ (nodejs.org or Homebrew `brew install node`) |
| **iOS / iPadOS** | Safari + a host serving the `dist/` folder (Mac/PC on same Wi‑Fi, or any static host) |
| **Internet** | First `npm install`; map tiles at runtime |

---

## Windows — one shot

1. Unzip anywhere (example: `C:\Tools\AOS-Nexus-LPIN-v2`)
2. Double-click **`INSTALL.bat`**
3. Desktop shortcut **AOS Nexus LPIN v2** is created
4. Launch from Desktop or **`START.bat`**

Browser: **http://localhost:5173/**

---

## Linux / macOS — one shot

```bash
cd path/to/AOS-Nexus-LPIN-v2
chmod +x install.sh start.sh
./install.sh
./start.sh
```

Optional desktop entry (Linux):

```bash
./scripts/create-desktop-entry.sh
```

macOS: after install, you can keep **`start.sh`** in Dock via “Keep in Dock” on Terminal, or run:

```bash
./scripts/create-macos-alias.sh
```

---

## iOS / iPadOS (Safari)

iOS cannot run Node or the Vite dev server. Use the **prebuilt `dist/`** UI:

### Option A — same Wi‑Fi as a PC/Mac (easiest)

On the computer that has this package:

```bash
# after npm install (or use INSTALL)
npx --yes serve dist -l 4173
```

Then on iPhone/iPad Safari open:

`http://<computer-lan-ip>:4173`

### Option B — any static host

Upload the **`dist/`** folder to Netlify, Cloudflare Pages, GitHub Pages, S3, etc., and open the HTTPS URL in Safari.  
Add to Home Screen for an app-like icon.

### Option C — full research workspace

Run the **dev server on Windows/Linux/macOS** for the complete tiled workspace + trend desks. Use iOS only for read-only review of a hosted `dist/` build.

---

## Manual commands (all desktop OS)

```bash
npm install          # Windows: npm.cmd install
npm run dev          # http://localhost:5173
npm run build
npm run preview      # production preview
npm run lint
```

---

## What you get

- 9-module tiled workspace (no cascading windows)
- **10 citizen-journalist trend desks** with full +1/0/−1 reports
- Map-first Atlas, Layer-0 export gate, working document
- Explicit export only — never auto-download
- Sample Pack Alpha (generic / agnostic core)

---

## Folder map

| Path | Role |
|------|------|
| `INSTALL.bat` / `install.sh` | One-shot install |
| `START.bat` / `start.sh` | Launch dev server + browser |
| `start-nexus.cmd` | Windows alias → START |
| `dist/` | Production static build (iOS / preview) |
| `src/` | Application source |
| `docs/` | Strategy + working notes |
| `scripts/` | Shortcut / desktop helpers |
| `compass-rose.ico` | Windows shortcut icon |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| PowerShell `npm` errors | Use **`npm.cmd`** on Windows |
| Port 5173 in use | Close other Vite apps |
| Shortcut missing (Win) | `powershell -File scripts\create-desktop-shortcut.ps1` |
| Linux no browser open | Open http://localhost:5173 manually |
| iOS blank map tiles | Needs network; allow local network for Option A |
| Offline | Shell loads; live map tiles need network |

---

## Share / license posture

Share freely for research use. Evidence-gated. Human locus of responsibility.  
Not legal advice; models are not certified surveys.

---

*AOS Nexus LPIN v2 · Nexus workbench · Layer-0 · explicit export*
