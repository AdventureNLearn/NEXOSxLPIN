# AOS Nexus LPIN — Build status (resume point)

**Saved:** 2026-07-25  
**Version:** 2.1.5 (story-first layer on top of 2.1.4)  
**Active root:** `C:\Nexus\v2.1`  
**Share path:** Desktop shortcut **AOS Nexus LPIN v2.1** → `C:\Nexus\v2.1\START.bat`  
**Persist key:** `aos-nexus-lpin-v2.1` (store version **7**)

Use this file if the session is cut off. Continue from **Next work** at the bottom.

---

## Product intent (locked for share build)

| Layer | Role | Audience |
|-------|------|----------|
| **Workspace (Tabs / Tiles)** | Stable shareable product | Peers, journalists, demos |
| **Immersive (HUD)** | Customizable personal shell | Operator laptop; Jarvis-style |
| **Unity** | Optional later 3D / nodes | Not required for share zip |

**Laptop constraints:** no heavy always-on 3D; Immersive is CSS/HTML HUD + existing R3F only when Massing tab opens. Music is lightweight HTMLAudio streams.

---

## What works now (v2.1.4)

### Investigations
- 10 trend desks with full reports, evidence (+1/0/−1), ladder, analyst logs, forge assets
- Map: all desks as pins; **active = color**, **inactive = grey**; **click pin to switch**
- Scene pins for active desk; sources with **live URLs**
- Simulations: `src/data/useCases/simulations.ts`
- Sources: `src/data/useCases/activeSources.ts`

### Design Lab (NEW — story-driven CJ)
- Per-investigation **jurisdictional intelligence** matrices (not roads/structures)
- Axes: legal forum · claim class · source access · platform risk · verification depth · harm exposure
- Loaded on `setUseCase` via `src/data/useCases/designMatrices.ts`
- UI shows intelligence brief + apply effects

### Workspace
- **Tabs** (default): full-height modules, Expand all = 9 tabs, drag reorder
- **Tiles**: cyan splitters, unlock → drag resize (pointer capture fixed)
- **Immersive**: Jarvis-style HUD (center stage + glass rails + sources)
- Header: Investigation switcher · view mode · Expand all · Music

### Music
- `MusicDock` in header — SomaFM ambient presets + custom HTTPS URL
- Volume + localStorage preference (`aos-nexus-music-v1`)
- Low CPU; no extra npm deps

### Quality
- `npm run lint` / `npm run build` must be re-run after this cut (see commands)

---

## Key paths

```
C:\Nexus\v2.1\                 ← ACTIVE ROOT
  START.bat                    ← launch
  src\App.tsx
  src\store\platformStore.ts
  src\components\layout\
    Workspace.tsx              ← tabs/tiles/immersive
    ImmersiveStage.tsx         ← Jarvis HUD v1
    MusicDock.tsx
    ActiveSourcesPanel.tsx
  src\data\useCases\
    catalog.ts                 ← 10 desks + reports
    simulations.ts             ← full mock sessions
    activeSources.ts           ← clickable URLs
    designMatrices.ts          ← CJ Design Lab per story
  docs\BUILD_STATUS_v2.1.4.md  ← THIS FILE
  docs\USE_CASES_AND_WORKSPACE.md

C:\Nexus\archive\dev-pre-v2.1-*   ← older snapshot
C:\Nexus\dev                      ← legacy tree; do not launch for demos
C:\Nexus\releases\                ← share zips
```

---

## Commands (Windows)

```bat
cd /d C:\Nexus\v2.1
npm.cmd run lint
npm.cmd run build
npm.cmd run dev
```

Rebuild share zip:

```bat
python C:\Nexus\v2.1\scripts\build_share_zip.py
```

---

## Immersive / Jarvis roadmap (not blocking share)

1. **Stabilize share workspace** (Tabs + Tiles + sources + Design Lab) ← current priority  
2. Immersive: **node graph of investigation connections** (edges between desks / claims / sources)  
3. Optional voice → Analyst commands (Web Speech API, laptop mic)  
4. Unity: only if needed for offline 3D; keep web path primary for accessibility  
5. Music: allow local `public/music/*` playlist  

---

## Next work (continue here)

1. ~~Design Lab story matrices~~ done in 2.1.4  
2. **Immersive node graph** — show how claims/sources/desks connect (force-directed or fixed layout, CSS/canvas, laptop OK)  
3. **Export pack** includes Design snapshot + sources list  
4. **Smoke script** or checklist for share handoff (all 10 desks click map + Design Lab changes)  
5. Optional: rebuild zip + refresh desktop shortcut after smoke  

---

## Evidence scores (as of this save)

| Gate | Score | Notes |
|------|-------|--------|
| Build path | **+1** | lint 0 · build 0 on 2.1.4 |
| Investigations + map | +1 | Implemented |
| Sources with links | +1 | Implemented |
| Design Lab CJ dynamic | +1 | Implemented this cut |
| Workspace resize/tabs | +1 | 2.1.3 |
| Immersive nodes | 0 | HUD only; node graph next |
| Music | +1 | Dock added |
| Share zip fresh | 0 | Rebuild after verify |

---

*Handoff complete. Resume: open this file + `C:\Nexus\v2.1`, run lint/build, then Immersive node graph.*
