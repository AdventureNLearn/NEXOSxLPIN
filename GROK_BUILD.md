# GROK BUILD — FULL OWNERSHIP · FINAL POLISH + DESKTOP DEPLOY

**Status:** COMPLETE — 1.4.0 Enterprise Hub shipped (2026-07-26 01:15 UTC)  
**Codename:** NEXOSxLPIN **1.4.0 Enterprise Hub**  
**Root (mandatory cwd):** `C:\NEXOSxLPIN`  
**Baseline (do not regress):** **1.3.0** Hermes-verified  
**Baseline zip:** `releases\NEXOSxLPIN-1.3.0-20260725-2058.zip`  
**Ship zip:** `releases\NEXOSxLPIN-1.4.0-20260725-2115.zip`  
**Return:** `docs\HANDOFF_RETURN_TO_HERMES.md` (filled)  

Ownership run finished: expand → polish → test → desktop deploy → zip → Hermes return.

---

## Mission (single sentence)

Take NEXOSxLPIN from solid 1.3.0 training hub to **enterprise-ready 1.4.0 full hub**: expand **every category and subcategory by +40%**, clean logo + desktop shortcuts, **togglable Web / Mobile UI**, production install path, full test/smoke, one deployable zip and live desktop launchers — **intelligent, deduped, usable, no fluff twins**.

---

## Hard rules (non-negotiable)

1. **cwd = `C:\NEXOSxLPIN` only** (local disk). Never product-on-OneDrive.  
2. **`npm.cmd`** for all npm scripts on Windows.  
3. **No git commit/push** unless human asks.  
4. **No secrets / client PII** in sample packs.  
5. Preserve AOS spine: **+1 / 0 / −1**, Layer-0, working doc, **confirm before Apply scores**.  
6. **Keep all existing ids** (`sme-*`, `cong-01…40`, trend ids). Add new ids only.  
7. **+40% means exact targets in tables below** (round half up already applied).  
8. Every new SME lens: full `SmeLens` fields + **specialized** `LENS_RULES[id]` (not anonymous domain-only).  
9. **Dedup:** unique `id`, `short`, no near-duplicate twins (tag Jaccard >0.85 + same domain → rewrite).  
10. Training desks ≠ legal advice; no invented statutes/vote tallies.  
11. Bundle stays **chunked** (do not collapse to ~1.8MB single main).  
12. Zip cold-installable: Node LTS → INSTALL → START on a clean machine.  
13. Desktop: clean stale shortcuts; install fresh branded launchers on **LocalDesktop + user Desktop**.  
14. Finish with **Hermes return handoff** fully filled.

---

## Baseline snapshot (1.3.0)

| Asset | Count |
|-------|------:|
| SME lenses | 180 |
| LENS_RULES | 180 |
| Congressional desks | 40 |
| Product modules | 10 |
| Main JS (chunked) | ~289 kB entry |

Modules today: `information`, `atlas`, `design-lab`, `research-hub`, `analyst`, `sme-lenses`, `audit-ladder`, `procedural-forge`, `massing-viewer`, `export-kit`.

---

# OUTLINE — follow in order (WP0→WP9)

```
WP0  Baseline confirm (green gates on 1.3.0)
WP1  +40% SME lenses by domain (180 → 252) + rules + dedup + tests
WP2  +40% congressional desks (40 → 56) + stories/sources/sims
WP3  +40% platform abilities (commands, sources depth, story surfaces, analyst, export gates)
WP4  Enterprise UI: Web ↔ Mobile toggle + responsive best practices
WP5  Clean logo / brand system + multi-size ICO
WP6  Desktop shortcut cleanup + branded deploy launchers
WP7  Installability: INSTALL/START/QUICKSTART/README · one-shot hub package
WP8  Full test · smoke · build · optional preview dogfood
WP9  Version 1.4.0 · share zip · HANDOFF_RETURN_TO_HERMES.md · COMPLETE
```

Do **not** stop after planning. Ship through WP9 in one continuous ownership run.

---

## WP0 — Baseline confirm

```bat
cd /d C:\NEXOSxLPIN
npm.cmd run test
npm.cmd run lint
npm.cmd run build
node scripts\smoke-sme-congress.mjs
```

Must be green before expansion. If red, fix first.

---

## WP1 — SME bank +40% per domain (180 → 252)

### Exact domain targets

| Domain | Now | **Target (+40%)** | Add |
|--------|----:|------------------:|----:|
| core-governance | 14 | **20** | +6 |
| public-records | 14 | **20** | +6 |
| jurisdiction | 14 | **20** | +6 |
| oversight | 14 | **20** | +6 |
| sector-regulatory | 16 | **22** | +6 |
| method-process | 8 | **11** | +3 |
| mechanical-engineering | 12 | **17** | +5 |
| civil-structural | 8 | **11** | +3 |
| electrical-electronics | 10 | **14** | +4 |
| chemical-process | 6 | **8** | +2 |
| aerospace-defense-tech | 6 | **8** | +2 |
| materials-manufacturing | 8 | **11** | +3 |
| energy-nuclear | 6 | **8** | +2 |
| biomedical-systems | 6 | **8** | +2 |
| computing-cyberphysical | 10 | **14** | +4 |
| mathematics-statistics | 14 | **20** | +6 |
| theoretical-physics | 10 | **14** | +4 |
| applied-physical-sciences | 4 | **6** | +2 |
| **TOTAL** | **180** | **252** | **+72** |

### Quality bar (each NEW lens)

- Unique `id` (`sme-…`), unique `short` (≤18 chars)  
- `name`, `tagline`, `description` (≥2 sentences), full `persona` (≥3 principles)  
- `focusTags` ≥6, `questionBank` ≥3, `preferredSources` ≥2, `publishGates` ≥1  
- Honest `highStakes`  
- **Specialized** `LENS_RULES[id]` that can change score/confidence/gaps/findingNote  
- Intelligent adjudication: engineering = FMEA/measurement; math = assumptions/counterexample; physics = regime/units; gov = primary-record hardness  

### Implementation notes

- Prefer expansion packs: `governanceExpansion.ts`, `technicalExpansion.ts` (or `*Expansion14.ts`) — do not rewrite the original 180.  
- Export merge into `SME_LENSES` remains single source of truth.  
- Tests/smoke: total **252**, per-domain table assert, `assertAllLensesHaveRules()→[]`, unique ids/shorts.  
- SME UI: badge `252 experts`; keep accordion + multi-select + confirm-apply; virtualize catalog if scroll jank.

---

## WP2 — Congressional desks +40% (40 → 56)

| Item | Now | Target |
|------|----:|-------:|
| `family: 'congressional'` desks | 40 | **56** |

- Keep `cong-01…40`. Add **`cong-41…cong-56`** (16 new).  
- Each new desk full depth: report (≥5 mixed claims), story, ≥4–5 official sources, sim + mapPin (jittered).  
- Themes must be **new** industry/private-effect oversight (not clones). Suggestions:

41. AI chip export / foundry capacity oversight  
42. Biometric surveillance vendor procurement ethics  
43. Evacuation / continuity (COOP) contractor readiness  
44. Open-source software security in federal supply chain  
45. Medical device cybersecurity (FDA premarket) industry burden  
46. Autonomous weapons dual-use export compliance  
47. Carbon markets / offsets integrity oversight  
48. Digital identity / login.gov adjacent private IdP effects  
49. Freight logistics data sharing / shipper-broker transparency  
50. Mining claim / hardrock reform private costs  
51. Broadcast / local journalism ownership caps  
52. Pharmacy desert / 340B private hospital effects  
53. Drone BVLOS commercial corridor rules  
54. Nuclear SMRs licensing timeline private capital  
55. Tribal energy / ROWs cross-jurisdiction routing  
56. Disaster debris / recovery contractor oversight  

(Framing: training desks; primary URLs only.)

Update `docs/CONGRESS_DESKS_v1.md`. Smoke asserts **56**.

---

## WP3 — Platform abilities +40% (entire hub)

Expand **skills/abilities** across the product — not only SME count. Minimum deliverables:

### 3.1 Analyst command surface (+40% commands)

- Inventory current `sme` / analyst commands.  
- Add ~40% more **high-signal** commands (examples):  
  `sme domains`, `sme count`, `sme search <q>`, `sme run-domain <domain>`,  
  `desk list`, `desk cong`, `evidence summary`, `layer0 status`, `export check`,  
  `ui web`, `ui mobile`, `help` sections.  
- Keep help text accurate; no dead commands.

### 3.2 Evidence / export / Layer-0 ability depth

- Export Kit: +40% clearer preflight checks (counts of −1, missing sources, Layer-0 ACK).  
- Research Hub: denser claim filters or bulk score actions if missing.  
- Working doc: SME multi-brief commit already exists — ensure batch commit path documented in UI.

### 3.3 Active sources depth

- Shared verify tools + per-desk sources: ensure each desk family averages **+40% source entries** vs 1.3.0 median (or ≥6 sources on new desks).  
- Prefer stable official URLs.

### 3.4 Story / Information surfaces

- Story `surfaces` copy includes **sme-lenses** explicitly on all cong desks.  
- Tab labels consistent.  
- Trend desks (if still in catalog): keep working; do not delete.

### 3.5 Module ability polish (enterprise)

For each of the 10 modules, ship **at least one** concrete UX or capability improvement (empty state, keyboard, density, loading, error, or action). Track in handoff checklist.

---

## WP4 — Enterprise UI: Web ↔ Mobile toggle

### Requirements

1. **Explicit UI mode toggle** in header/status: **`Web` | `Mobile`** (persisted in zustand + localStorage).  
2. **Web mode:** multi-pane / tabs / tiles as today; comfortable dense desktop layouts.  
3. **Mobile mode:**  
   - single-column stage  
   - bottom or top primary nav for modules  
   - larger tap targets (≥44px)  
   - SME accordion full-width; chips wrap  
   - hide low-priority chrome; collapse music dock by default  
   - map taller full-bleed where sensible  
4. **Responsive CSS:** works at 390px–1440px+ even without toggle (toggle forces mobile chrome on desktop for demos).  
5. Best-practice a11y: focus rings, `aria-*` on mode toggle and nav, no keyboard traps.  
6. Respect existing density Dense/Compact/Roomy.  
7. Do not break Immersive mode — define: Mobile overrides immersive to simplified shell OR keep immersive desktop-only (document choice).

### Implementation sketch (you may improve)

- `uiMode: 'web' | 'mobile'` on platform store  
- `App.tsx` / layout shell branches className `ui-web` | `ui-mobile`  
- CSS modules or tailwind variants under `.ui-mobile …`

---

## WP5 — Clean logo design (production brand)

1. Refresh mark: **clean, enterprise, legible at 16–256px**  
   - Night field, compass + dual-lens motif OK but **simplify** for crisp small sizes  
   - No muddy gradients at 16px  
2. Regenerate via `scripts/gen_brand_icon.py` (improve if needed):  
   - `public/brand-mark.svg`, `favicon.svg`  
   - `brand-icon-256.png`, `512.png`  
   - `nexos-lpin.ico` multi-size  
   - **versioned** `nexos-lpin-v140.ico` (cache bust for shortcuts)  
3. Update shortcut script to versioned ICO.  
4. In-app header uses same mark.

---

## WP6 — Desktop shortcuts cleanup + deploy

1. Run / extend `scripts/cleanup-old-shortcuts.ps1`:  
   - Remove stale: `AOS Nexus*`, old `Nexus RSD*`, duplicate NEXOS links, broken targets  
2. `scripts/create-desktop-shortcut.ps1`:  
   - Targets: `C:\LocalDesktop` **and** user Desktop  
   - Name: `NEXOSxLPIN.lnk`  
   - Target: `C:\NEXOSxLPIN\START.bat`  
   - Icon: `nexos-lpin-v140.ico`  
   - Description: `NEXOSxLPIN 1.4.0 Enterprise Hub`  
3. Optional LocalDesktop tools (Grok Build, Hermes) only if targets exist — don’t create broken links.  
4. Write `C:\LocalDesktop\README.txt` with launch path.  
5. Execute shortcut scripts as part of deploy (PowerShell).  
6. `SHChangeNotify` or versioned icon so Explorer refreshes.

---

## WP7 — One-shot hub package (installable anywhere standard)

1. Update `docs/INSTALL.md` + `QUICKSTART.txt` + root `README.md` for **1.4.0**:  
   - Prerequisites: Windows 10/11, Node.js LTS, npm  
   - Extract zip → `INSTALL.bat` → `START.bat`  
   - Open http://localhost:5173  
   - UI mode Web/Mobile toggle location  
2. `INSTALL.bat` / `START.bat` robust errors (no Node → clear message).  
3. `python scripts/build_share_zip.py` produces:  
   `releases\NEXOSxLPIN-1.4.0-<timestamp>.zip`  
4. Zip includes: src, public, scripts, package.json, lock, START/INSTALL, docs, icons, VERSION — **not** node_modules.  
5. Smoke list zip contents for INSTALL/START/package.json/src.

---

## WP8 — Test · confirm · dogfood

### Mandatory gates

```bat
npm.cmd run test
npm.cmd run lint
npm.cmd run build
node scripts\smoke-sme-congress.mjs
```

### Smoke must assert

- version **1.4.0**  
- SME total **252**  
- rules **252** / missing []  
- unique ids/shorts  
- per-domain counts match table  
- congressional desks **56**  
- (optional) uiMode default web  

### Manual confirm checklist (do what you can in-browser via preview)

- [ ] START.bat boots dev server  
- [ ] Web/Mobile toggle switches layout  
- [ ] SME accordion at 252 filters/search  
- [ ] Multi-select Run selected still works  
- [ ] Confirm-apply still two-click  
- [ ] Cong desk 41–56 loads claims + sources  
- [ ] Desktop shortcut launches  
- [ ] Logo visible header + shortcut icon  

---

## WP9 — Version, docs, handoff

1. Bump **1.4.0** in: `package.json`, `VERSION.txt`, catalog `PRODUCT_VERSION`, smoke, `build_share_zip.py`, docs headers, BUILD_STATUS.  
2. Update `docs/SME_LENSES_v1.md`, `docs/CONGRESS_DESKS_v1.md`, `docs/BUILD_STATUS.md`.  
3. Build zip.  
4. Overwrite **`docs/HANDOFF_RETURN_TO_HERMES.md`**.  
5. Set top of this file to **COMPLETE** + timestamp.

---

## Acceptance (done only when all true)

- [ ] SME **252** with exact per-domain targets  
- [ ] Rules **252**, missing **[]**, deduped  
- [ ] Cong desks **56** full depth  
- [ ] Platform abilities +40% (commands + module polish + sources depth) documented in handoff  
- [ ] Web/Mobile toggle shipped and persisted  
- [ ] Clean logo + `nexos-lpin-v140.ico` + shortcuts cleaned/redeployed  
- [ ] test/lint/build/smoke all exit 0  
- [ ] Zip `NEXOSxLPIN-1.4.0-*.zip` installable path documented  
- [ ] Desktop launchers work on LocalDesktop + Desktop  
- [ ] Hermes return handoff complete  

---

## Out of scope

- Real-time Congress API / paid data feeds  
- Invented law or fake quotes  
- Rewriting Nexus `C:\Nexus\dev` publicApi  
- Breaking existing sme/cong ids  
- Shipping node_modules inside zip  

---

## Execution tactics (large one-shot)

1. Generators OK if quality bar held — then **dedupe script** before merge.  
2. Keep expansion files separate; merge arrays only.  
3. Rules: export helpers + per-id registry entries (252 keys).  
4. UI mode first as thin store+css shell so deploy works even if content gen is long.  
5. Logo + shortcuts can parallelize after content counts green.  
6. If turn-budget tight: **WP1+WP2+WP4+WP6+WP8+WP9 are P0**; WP3 module polish P1 but still required for “full hub.”  
7. Use **`--max-turns 100`** class effort; do not exit at plan-only.

---

## Launch commands

```bat
cd /d C:\NEXOSxLPIN
grok --prompt-file C:\NEXOSxLPIN\GROK_BUILD.md --always-approve --max-turns 100 --cwd C:\NEXOSxLPIN
```

Or: `LAUNCH_GROK_BUILD.bat`

---

## Paste prompt (if TUI needs chat text)

```
You have FULL OWNERSHIP of NEXOSxLPIN at C:\NEXOSxLPIN.
Execute C:\NEXOSxLPIN\GROK_BUILD.md end-to-end (WP0–WP9). One-shot final polish + desktop deploy.

Baseline 1.3.0 is green — do not regress. Keep existing sme-* and cong-01…40 ids.

Ship 1.4.0 Enterprise Hub:
1) +40% EVERY SME domain exactly (table → 252 lenses) + specialized LENS_RULES each new id + dedupe
2) +40% congressional desks (40→56) full depth
3) +40% platform abilities (analyst commands, export/Layer-0 checks, sources depth, per-module polish)
4) Enterprise UI: togglable Web | Mobile modes (persisted), responsive best practices
5) Clean production logo + nexos-lpin-v140.ico
6) Clean old desktop shortcuts; deploy branded NEXOSxLPIN.lnk to LocalDesktop + Desktop → START.bat
7) Installable zip for any standard Windows+Node LTS machine
8) npm.cmd run test && lint && build && node scripts\smoke-sme-congress.mjs all green
9) docs\HANDOFF_RETURN_TO_HERMES.md complete for Hermes

Intelligent usable specialists — no fluff twins. Training desks not legal advice. No secrets/PII. Preserve +1/0/−1, Layer-0, confirm-before-apply. Chunked bundle retained.
```

---

## Return template → `docs\HANDOFF_RETURN_TO_HERMES.md`

```markdown
# HANDOFF RETURN → Hermes

**From:** Grok Build  
**To:** Hermes  
**Product:** NEXOSxLPIN  
**Root:** C:\NEXOSxLPIN  
**Finished version:** 1.4.0  
**Time:** <fill>  
**Baseline:** 1.3.0 + GROK_BUILD.md full ownership

## Gates
| Command | Exit | Notes |
|---------|------|-------|
| npm.cmd run test | | |
| npm.cmd run lint | | |
| npm.cmd run build | | |
| node scripts/smoke-sme-congress.mjs | | |

## Counts
- SME total (expect 252):
- Per-domain table:
- Rules missing (expect []):
- Cong desks (expect 56):
- Dedup OK:

## Platform +40% abilities delivered
- Analyst commands added:
- Module polish list:
- Sources depth:

## UI
- Web/Mobile toggle: yes/no · persistence path:
- Responsive notes:

## Brand + desktop
- ICO path:
- Shortcuts cleaned/created:
- LocalDesktop + Desktop verified:

## Bundle
- main JS / chunks:

## Installability
- Zip path:
- Cold install steps:

## Files changed
- 

## Residuals for Hermes
- 

## Risks / do-not-touch
- 

## Next Hermes actions
1. Re-verify gates + counts
2. Dogfood Web/Mobile + desktop shortcut
3. Optional clean-machine zip extract test
```

---

**America First | Truth-Seeking | One-shot enterprise hub — expand +40% — deploy desktop — hand back to Hermes**
