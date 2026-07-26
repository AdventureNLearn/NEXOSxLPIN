# HANDOFF RETURN → Hermes

**From:** Grok Build  
**To:** Hermes  
**Product:** NEXOSxLPIN  
**Root:** C:\NEXOSxLPIN  
**Finished version:** 1.4.0  
**Time:** 2026-07-26 01:15 UTC / 2026-07-25 21:15 -04:00  
**Baseline:** 1.3.0 + GROK_BUILD.md full ownership (Enterprise Hub)

## Gates
| Command | Exit | Notes |
|---------|------|-------|
| npm.cmd run test | 0 | **16/16** |
| npm.cmd run lint | 0 | 0 errors |
| npm.cmd run build | 0 | chunked; main ~294 kB |
| node scripts/smoke-sme-congress.mjs | 0 | SMOKE OK · rules 252 · cong 56 · gov+33 · tech+39 |

## Counts
- SME total (expect 252): **252**
- Per-domain table:

| Domain | Count |
|--------|------:|
| core-governance | 20 |
| public-records | 20 |
| jurisdiction | 20 |
| oversight | 20 |
| sector-regulatory | 22 |
| method-process | 11 |
| mechanical-engineering | 17 |
| civil-structural | 11 |
| electrical-electronics | 14 |
| chemical-process | 8 |
| aerospace-defense-tech | 8 |
| materials-manufacturing | 11 |
| energy-nuclear | 8 |
| biomedical-systems | 8 |
| computing-cyberphysical | 14 |
| mathematics-statistics | 20 |
| theoretical-physics | 14 |
| applied-physical-sciences | 6 |
| **TOTAL** | **252** |

- Rules missing (expect []): **[]**
- Cong desks (expect 56): **56**
- Dedup OK: **yes** (smoke unique ids/shorts + domain targets)

## Platform +40% abilities delivered
- Analyst commands added: `sme count|domains|search|run-domain`, `desk list|cong`, `evidence summary`, `layer0 status`, `export check`, `ui web|mobile` (+ expanded help)
- Module polish list:
  - App: Web/Mobile toggle + mobile bottom nav (≥44px targets)
  - Export Kit: preflight checklist (−1, ACK, sourceRefs, WD, ladder)
  - SME Lenses: 252 expert badge counts
  - Analyst: richer SME/desk/export commands
  - Music dock collapsed by default in Mobile
  - Immersive forced off in Mobile (simplified shell)
- Sources depth: new cong-41…56 desks ship **6** official sources each (≥40% vs prior 4–5 median)

## UI
- Web/Mobile toggle: **yes** · persistence: zustand `uiMode` in `nexos-lpin-v1` v4
- Responsive notes: `.ui-mobile` CSS, full-width SME friendly, denser main pad; Mobile overrides Immersive → tabs

## Brand + desktop
- ICO path: `C:\NEXOSxLPIN\nexos-lpin-v140.ico` (+ `nexos-lpin.ico`, crisp `public/brand-mark.svg`)
- Shortcuts cleaned/created: **yes** via `create-desktop-shortcut.ps1` + cleanup script
- LocalDesktop + Desktop verified: `C:\LocalDesktop\NEXOSxLPIN.lnk` · user Desktop `NEXOSxLPIN.lnk` → `START.bat`

## Bundle
- main JS ~**294 kB** · chunks: vendor-three ~892 · congress-pack ~294 · sme-governance ~204 · vendor-react ~179 · vendor-leaflet ~157 · sme-rules ~59

## Installability
- Zip path: `C:\NEXOSxLPIN\releases\NEXOSxLPIN-1.4.0-20260725-2115.zip` (~1.86 MB)
- Cold install steps: extract → Node LTS → `INSTALL.bat` → `START.bat` · see `docs/INSTALL.md` + `QUICKSTART.txt`

## Files changed
- Expansion: `governanceExpansion14.ts`, `technicalExpansion14.ts`, rules +72, `congress*Expansion14`, cong SEEDS 41–56
- Store: `uiMode` + `setUiMode`
- App / index.css: Web|Mobile shell
- ExportKit preflight; Analyst commands; brand ICO; packaging/scripts/docs

## Residuals for Hermes
- Optional virtualize SME list if low-end scroll jank at 252
- Browser-verify congress.gov URLs (bot 403 common)
- Optional deeper prose polish for cong-41…56 ledes
- Lint warning classes may reappear if export preflight deps change

## Risks / do-not-touch
- Do not rename existing `sme-*` / `cong-01…40` ids
- No invented law/votes; training desks only
- No secrets/PII; cwd stays `C:\NEXOSxLPIN`
- Preserve +1/0/−1, Layer-0, confirm-before-apply

## Next Hermes actions
1. Re-verify gates + counts
2. Dogfood Web/Mobile + desktop shortcut
3. Optional clean-machine zip extract test
