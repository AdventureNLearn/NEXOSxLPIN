# NEXOSxLPIN — Grok Build ownership

**Status:** ACTIVE PRODUCT · **fully owned by Grok Build**  
**Version:** 1.4.1  
**Root:** `C:\NEXOSxLPIN`  
**Do not route handoffs to Hermes** for this product line unless the operator explicitly re-opens a multi-agent loop.

## What “owned by Grok Build” means

- Feature work, polish, install zip, desktop shortcuts, and gates are executed in Grok Build sessions.
- Hermes briefs / return handoffs are **historical** (`docs/HANDOFF_RETURN_TO_HERMES.md` is archive only).
- Canonical status: **this file** + `VERSION.txt` + `docs/BUILD_STATUS.md`.

## Live inventory (1.4.1)

| Asset | Count / note |
|-------|----------------|
| SME lenses | **252** |
| LENS_RULES | **252** (missing []) |
| Congressional desks | **56** |
| Product modules | **10** |
| UI modes | Web · Mobile (persisted) |
| Workspace | Tabs · Tiles · Immersive |
| Share zip | `releases\NEXOSxLPIN-1.4.1-*.zip` |
| Blueprint PDF | `docs\NEXOSxLPIN_1.4.0_Platform_Blueprint.pdf` |

## Operator gates

```bat
cd /d C:\NEXOSxLPIN
npm.cmd run test
npm.cmd run lint
npm.cmd run build
node scripts\smoke-sme-congress.mjs
powershell -File scripts\create-desktop-shortcut.ps1
START.bat
```

## Final pass (1.4.1)

- Ownership docs re-pointed to Grok Build
- Leaflet marker assets local under `public/images/`
- Command palette: UI Web/Mobile + Run Evidence Gate
- START.bat / VERSION branding
- Fresh install zip + desktop shortcuts

## Non-goals

- No Hermes return required for routine work
- No force-push / secrets / client PII in packs
