# Local machine safety attestation — pre-publish

**Date:** 2026-07-26  
**Tree:** NEXOSxLPIN 2.0.0-experimental  
**Verdict:** **SAFE TO COMMIT AND PUBLISH** for a normal developer workstation.

## What this repo does on your machine

| Action | Risk | Notes |
|--------|------|--------|
| `npm install` | Low | Installs npm deps into local `node_modules` only |
| `npm run dev` | Low | Vite on **127.0.0.1:5173** (not public bind by default) |
| `npm run build` | Low | Writes `dist/` only |
| `INSTALL.bat` / `install.sh` | Low | node/npm check + install + build |
| `START.bat` | Low | Starts local dev server |
| Desktop shortcut | Low | Launches `launch-nexos.vbs` → START.bat in product root |
| Browser map tiles | Low | Loads public OSM/Carto/Esri tiles when online |
| Optional music | Low | External stream only if user enables Music |

## What it does **not** do

- No installer that modifies system services  
- No admin elevation required for normal use  
- No credential harvesting  
- No reverse shells / encoded PowerShell  
- No `rm -rf /`, disk format, or registry wipe scripts  
- No committed API keys or `.env` secrets  
- No auto-download of export packs without user click  

## Residual (normal open-source) residual risk

- **Supply chain:** `npm install` trusts package-lock + registry (standard). Use lockfile; keep Node LTS current.  
- **XSS/content:** App is a local SPA; desk content is training data you control.  
- **CSP:** Restricts scripts to self; allows map image CDNs and optional audio hosts.  

## Attestation

Commit and public push approved from a local-safety standpoint for this experimental verification workbench.
