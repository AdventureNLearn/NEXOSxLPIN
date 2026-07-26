# Grok Build — full work map (reference)

**Product now:** **NEXOSxLPIN** · `C:\NEXOSxLPIN`  
**Date:** 2026-07-25  
**Purpose:** Single map of everything built in Grok Build sessions so you can clean, migrate, and continue safely.

---

## 0. ACTIVE JOB (do this next)

| Item | Path |
|------|------|
| **Execute brief** | `C:\NEXOSxLPIN\GROK_BUILD.md` |
| Baseline | `docs\BASELINE_HANDOFF_1.2.0.md` |
| Return to Hermes | `docs\HANDOFF_RETURN_TO_HERMES.md` |
| Launch | `grok --prompt-file C:\NEXOSxLPIN\GROK_BUILD.md --always-approve --max-turns 50 --cwd C:\NEXOSxLPIN` |

**Job:** 1.2.0 → **1.2.1** polish (code-split, SME a11y, bill links, zip, Hermes handoff).  
**Do not** re-implement 90 SMEs / 20 cong desks from scratch.

---

## 1. End state (use this)

| Item | Path | Role |
|------|------|------|
| **Primary workbench** | `C:\NEXOSxLPIN` | Production LPIN dashboard (local disk) |
| **Install zip** | `C:\NEXOSxLPIN\releases\NEXOSxLPIN-*.zip` | Shareable installer package |
| **Local shortcuts** | `C:\LocalDesktop\` | Non–OneDrive launcher folder |
| **Lineage / archives** | `C:\Nexus\archive\`, `C:\Nexus\dev`, `C:\Nexus\v2.1` | History only — do not demo from here |
| **This map** | `C:\NEXOSxLPIN\docs\GROK_BUILD_WORK_MAP.md` | You are here |

---

## 2. Timeline of Grok Build work

```
Phase 0 — Baseline polish (Nexus v3 agnostic shell)
  · RUN_GROK_BUILD_POLISH brief
  · 9 modules, Layer-0, Export Kit, Sample Pack Alpha
  · Lint/build green; legacy ignored

Phase 1 — Use-case + tiled workspace
  · Profiles, depth weights, Workspace tiles
  · Command palette + status bar use-case chip

Phase 2 — Atlas map priority
  · Map fills pane; graph secondary strip

Phase 3 — Trend desks + full reports
  · 10 citizen-journalism stories
  · Claims, WD, Research injection

Phase 4 — Map linked to all investigations
  · All pins on map; grey inactive; click to switch
  · Full simulation packs per story

Phase 5 — Active sources (URLs)
  · Research + report strip one-click links

Phase 6 — Workspace UX
  · Tabs / Tiles (fixed splitters) / Immersive HUD
  · Expand all modules; density Dense|Compact|Roomy
  · Music dock

Phase 7 — Design Lab dynamic (CJ jurisdictional)
  · Story-specific matrices (forum, claim, access, risk…)

Phase 8 — Story-first language
  · Story strip, plain claims, tab renames (Story/Map/Claims…)

Phase 9 — Story-linked physical models
  · Model tab items change with story

Phase 10 — SME Lenses v1.1.x
  · 40 governance SMEs + rules engine + confirm apply
  · Brand icon + desktop shortcut

Phase 11 — SME technical bank + Congress desks v1.2.0
  · +50 technical/reasoning SMEs (90 total)
  · Accordion + multi-select UI
  · 20 congressional/industry-effect training desks
  · Hermes verified green; zip 1.2.0-20260725-2029

Phase 12 — ACTIVE: polish → 1.2.1 (see GROK_BUILD.md)
  · Code-split · a11y · bill links · Hermes return handoff
```

---

## 3. Feature inventory (NEXOSxLPIN)

| Domain | What’s in |
|--------|-----------|
| **Stories** | 10 trend desks + **20 congressional** training desks + plain-language story layer |
| **Map** | World pins + scene pins; grey = other stories |
| **Claims** | Supported / not proven / disputed (+1/0/−1) |
| **SME Lenses** | **90** experts; accordion + multi-select |
| **Story rules** | Design Lab CJ matrices per story |
| **Sources** | Official / wire / tools with live URLs |
| **Model** | Story-specific physical objects → Forge/Massing |
| **Publish** | Layer-0 gate; open −1 blocks export |
| **Workspace** | Tabs · Tiles · Immersive · Expand all · Density |
| **Music** | Header dock (streams + custom URL) |
| **Analyst** | Command runtime + seeded logs |
| **Audit ladder** | L0–L4 per simulation |

---

## 4. Key source paths (inside product)

```
C:\NEXOSxLPIN\
  START.bat / INSTALL.bat
  src\App.tsx
  src\store\platformStore.ts
  src\components\layout\   Workspace, ImmersiveStage, StoryStrip, MusicDock…
  src\data\useCases\
    catalog.ts          — desks + reports
    simulations.ts      — full mock sessions
    stories.ts          — plain-language narrative
    designMatrices.ts   — CJ Design Lab
    activeSources.ts    — URLs
    storyModels.ts      — physical model items
  docs\
    GROK_BUILD_WORK_MAP.md   ← this file
    BUILD_STATUS.md
    OPSEC_SCAN_v1.md
    LOCAL_STORAGE_MIGRATION.md
  releases\             — install zips
```

---

## 5. What stayed on OneDrive (by design)

| Keep on OneDrive (optional) | Why |
|-----------------------------|-----|
| Personal photos / Personal Vault | Personal, not workbench |
| Documents\Important (if personal) | User choice |
| Cloud-only collaboration folders | When you need sync |

| Keep **off** OneDrive (local C:) | Why |
|----------------------------------|-----|
| `C:\NEXOSxLPIN` | App + node_modules + builds |
| `C:\Nexus\*` archives | Large history |
| `C:\LocalDesktop` | Launchers without cloud thrash |
| `C:\WorkLocal` | Future local projects |

---

## 6. Deferred / next Grok Build work

1. Immersive **node graph** (claims ↔ sources ↔ places)  
2. Private pack loader (no PII in repo)  
3. Optional voice → Analyst  
4. Unity only if needed later (laptop path stays web-first)  

---

## 7. Smoke checklist (post-install)

- [ ] `npm.cmd run lint` exit 0  
- [ ] `npm.cmd run build` exit 0  
- [ ] START.bat opens http://localhost:5173  
- [ ] Pick story → Story strip + Claims populate  
- [ ] Map: grey pins switch stories  
- [ ] Model: story objects list changes with story  
- [ ] Design Lab: story rules matrix (not road siting)  
- [ ] Tabs Expand all; Density Dense works  
- [ ] Immersive Exit works  
- [ ] Music Play (network)  
- [ ] Desktop / LocalDesktop shortcuts open `C:\NEXOSxLPIN`  

---

*Map generated for migration + reference. Primary product: NEXOSxLPIN @ C:\NEXOSxLPIN.*
