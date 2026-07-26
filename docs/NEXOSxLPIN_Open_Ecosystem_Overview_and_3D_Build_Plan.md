# NEXOSxLPIN — Platform Overview & Open Ecosystem Build Plan

**Product root (workspace):** `C:\NEXOSxLPIN`  
**Live version:** **1.6.1** (Immersive-forward · map-terrain Massing)  
**Share zip:** `releases\NEXOSxLPIN-1.6.1-20260725-2249.zip`  
**Companion doc (operator intent):** *NEXOSxLPIN Open Ecosystem Development Plan* (v1.0 · 26 Jul 2026)  
**Skill layer (portable):** https://github.com/AdventureNLearn/AOS-v3---LPIN  
**Spine:** America First · Truth-Seeking · Evidence over narrative  

This document is the **GitHub-facing overview**: what is built, how it customizes by use case, and the **3D / Forge–Massing build plan** that implements Section 5 of the Open Ecosystem plan without diluting Layer-0 or tri-state discipline.

---

## 1. Two-layer stack (permanent)

| Layer | What it is | Where it lives | What must never break |
|-------|------------|----------------|------------------------|
| **A. Governance / skill layer** | LPIN / AOS v3.0 skills: Evidence Gate, Layer-0, 4-agent, civic-intel, GIS, visual systems, working-doc | GitHub `AOS-v3---LPIN` + local Hermes skills | Tri-state scoring, Layer-0 export blocks, working-doc durability, OPSEC |
| **B. Runnable workbench** | Vite · React · TS · Zustand app: desks, ledgers, maps, SME lenses, Forge/Massing | **`C:\NEXOSxLPIN`** (this repo / workspace) | Domain-swappable **data**, fixed **gates** |

**Rule for every GitHub commit narrative:**  
*Domain depth lives in packs, catalogs, engines, and labels — not in new product brands or forks of the governance layer.*

---

## 2. What is built now (live inventory · 1.6.1)

### 2.1 Product shell

| Surface | State |
|---------|--------|
| Root | Local disk `C:\NEXOSxLPIN` (not OneDrive) |
| Launch | `START.bat` · `INSTALL.bat` · Desktop `NEXOSxLPIN.lnk` |
| Stack | Vite 8 · React 19 · TypeScript · Zustand · Leaflet · Three / R3F |
| UI shells | **Web / Mobile** toggle (`uiMode`); Immersive as primary investigative stage |
| Claim status visual system | UI Supercharge Spec + P0 rail/badge/pin/honesty (`docs/NEXOSxLPIN_UI_Supercharge_Spec_v1.0.md`, `docs/UI_P0_HOW_TO_USE.md`) |
| Quality gates | `npm.cmd run test` · `lint` · `build` · smoke scripts |

### 2.2 Ten workbench modules

| ModuleId | Role |
|----------|------|
| `information` | Story / desk brief |
| `atlas` | World + scene pins (Leaflet) |
| `design-lab` | Condition matrices / story rules cascade |
| `research-hub` | Claim ledger + notes |
| `analyst` | Command surface (`sme …`, desk ops) |
| `sme-lenses` | 252 specialist personas · accordion · multi-select · confirm-apply |
| `audit-ladder` | Progressive depth L0–L4 |
| `procedural-forge` | Generate illustrative meshes from story/claims |
| `massing-viewer` | Full / Solo 3D stage · terrain-from-map · scale-accurate layout |
| `export-kit` | Explicit export · Layer-0 ACK · preflight |

### 2.3 Content banks

| Bank | Count | Notes |
|------|------:|-------|
| **SME lenses** | **252** | 18 domains; each id has specialized `LENS_RULES` |
| **Congressional training desks** | **56** | Industry / private-effect oversight themes |
| **Investigation desks (catalog tops)** | **~100** | Geopolitical + topical tops kept (VERSION) |
| **Mesh families** | **~105** | Multi-select spatial stage; tag↔SME overlap |
| **Story model packs** | Curated per trend desk | Path, vehicle, crowd, vessel, docket, etc. |

#### SME domains (current)

| Domain | n | Domain | n |
|--------|--:|--------|--:|
| core-governance | 20 | mechanical-engineering | 17 |
| public-records | 20 | civil-structural | 11 |
| jurisdiction | 20 | electrical-electronics | 14 |
| oversight | 20 | chemical-process | 8 |
| sector-regulatory | 22 | aerospace-defense-tech | 8 |
| method-process | 11 | materials-manufacturing | 11 |
| mathematics-statistics | 20 | energy-nuclear | 8 |
| theoretical-physics | 14 | biomedical-systems | 8 |
| computing-cyberphysical | 14 | applied-physical-sciences | 6 |

### 2.4 3D / spatial stack (current capability)

| Component | Path | Does |
|-----------|------|------|
| Object reasoning | `src/lib/forge/objectReasoning.ts` | Claim nouns → mesh families; score → verifiability; importance ranking; SME/tag overlap |
| Mesh catalog | `src/data/forge/meshCatalog` (via imports) | 100+ families with industry + SME domain tags |
| Scene meshes | `src/lib/forge/sceneMeshes.ts` | Primitive recipes per asset type |
| Generators | `src/lib/forge/generators.ts` | `ProceduralAsset` + Unity C# emit; accent by status |
| Spatial layout | `src/lib/forge/spatialSceneLayout.ts` | Multi-object placement; collision-aware layout path |
| Terrain from map | `src/lib/forge/terrainFromMap.ts` | Public basemap → Massing terrain context |
| Massing UI | `MassingViewerModule.tsx` · `MassingCanvas.tsx` | Full/Solo; scale-accurate meters; zoom-gated select |
| Story models | `src/data/useCases/storyModels.ts` | Curated per-desk physical items |
| Honesty | `MODEL_DISCLAIMER` in core | Illustrative — not forensic |

**1.6.1 spatial posture:** Immersive Massing with **scale-accurate public map**, ENU meter-offsets, OSM/Esri basemaps — **not** a decorative diorama.

### 2.5 Evidence discipline (shipped)

- Tri-state **+1 / 0 / −1** everywhere claims are scored  
- **Confirm before Apply** SME scores to ledger  
- **Layer-0** blocks high-stakes export while −1 open  
- Working document for durable decisions  
- Training desks ≠ legal advice; scores = operator hygiene  

---

## 3. How the Open Ecosystem Plan maps to this product

| Plan section | Product reality |
|--------------|-----------------|
| §2 Non-negotiables | Implemented as store gates + Export Kit + claim UI + MODEL_DISCLAIMER |
| §3 Skills (LPIN repo) | SME lenses + module workflows **exercise** skills; skills remain portable MIT pack |
| §4 Branching beyond roadside / ALPR | Mechanism = **use-case packs + catalogs + matrices + spatial tags**, not new brands |
| §5 3D polish gaps | See §6 build plan below (primary engineering backlog) |
| §6 Open iteration gates 0–5 | Same cadence: intent → catalog/engine → visual parity → quality gates → WD → zip |
| §7 Fidelity checklist | Release acceptance for any domain fork / GitHub PR |
| §8 Transparency | Agnostic packs; cite skills; primary sources; illustrative geometry labeled |

### First domain vs template

| | First domain (plan) | Workbench template (now) |
|--|---------------------|---------------------------|
| Example | Roadside surveillance / ALPR | Civic training desks + congressional industry desks + story trends |
| Swappable | Device catalog, install matrix, audit rules, Overpass tags | Desk catalog, SME focus, storyModels, forgeAssetType, sources |
| Fixed | Gates, ledger, map+3D shell, export path | Same |

---

## 4. Customizing for different use cases (GitHub positioning)

### 4.1 Recommended monorepo / workspace story

**Position `NEXOSxLPIN` as the single runnable workspace.**  
**Position `AOS-v3---LPIN` as the skill constitution.**

```
AdventureNLearn/
  AOS-v3---LPIN/          ← skills, governance, OPSEC, SKILL.md (portable)
  NEXOSxLPIN/             ← this app (desks, UI, forge, tests, releases)
```

Commit messages should say:

- *“Add topic pack X to workbench; skills unchanged.”*  
- *“Harden objectReasoning ranking; illustrative disclaimer retained.”*  
- Never: *“Fork governance to soften export.”*

### 4.2 What you change per use case (swap list)

| Swap target | Files / areas | Example topics (from plan §4.3) |
|-------------|-----------------|----------------------------------|
| Desk catalog | `src/data/useCases/catalog.ts`, `stories.ts`, packs | Body-worn cameras, municipal CCTV, UAS, AQ sensors |
| Condition matrices | `designMatrices.ts` | Mounting, retention, jurisdiction cascade |
| Sources | `activeSources.ts`, desk-specific sources | Agency + FOIA + map tools |
| Story models | `storyModels.ts` | Camera pole, cabinet, mast, path, vessel |
| Forge default asset | `forgeAssetType` on simulations | `mast-enclosure-a`, `cabinet-node-b`, mesh family ids |
| SME recommendations | lens `focusTags` + desk evidence tags | privacy, permit, procurement |
| Spatial tags | atlas pins, Overpass/public tags (when live APIs on) | city/state unlock density |
| Smoke | `scripts/smoke-*.mjs` | Topic-equivalent count gates |

### 4.3 What you never swap

- Tri-state type + evidence-gate semantics  
- Layer-0 blocked actions on open −1  
- Explicit export only  
- Illustrative-only 3D posture  
- OPSEC: no secrets/PII in sample packs  

### 4.4 Ready topic families (plan) → customization recipe

For each family (BWC, ALPR, CCTV, FR, UAS, smart poles, public Wi-Fi, AQ sensors, transit AVL, school-zone monitoring):

1. **Intent lock** — topic + success metric (“score claims; export only when clean”).  
2. **Catalog + engine** — products, matrices, audit keywords.  
3. **Visual parity** — claim colors, pin kinds, mesh families.  
4. **Quality gates** — test/lint/build/smoke 0.  
5. **Working document** — decisions + open −1.  
6. **Package** — zip with INSTALL/START.  

Fidelity = Section 7 checklist in the Open Ecosystem PDF.

---

## 5. Operator loop (any desk)

```
1. Pick desk (header / map pin / congressional family)
2. Read Story (Information)
3. Score Claims (Research Hub) — +1 / 0 / −1
4. Optional: SME Lenses → Run / multi-select → confirm apply
5. Design Lab rules / conditions
6. Atlas orientation
7. Procedural Forge → seed objects from claims/storyModels
8. Massing Viewer — Full scene or Solo object reasoning
9. Audit ladder depth
10. Export Kit only when −1 cleared + Layer-0 ACK
```

---

## 6. 3D modeling & logic — build plan (implements plan §5)

### 6.1 Problem statement (from your PDF + code)

**Have:** claim→object reasoning, 100+ mesh families, status accents, Full/Solo Massing, terrain-from-map, multi-select, SME overlap scoring.  

**Still weak for investigative insight:**

1. Claim-to-object fidelity (generic / near-dupe objects)  
2. Status legibility at distance in Full-scene  
3. Solo reasoning panel depth (claim text, source binding, why-this-object)  
4. Temporal / relational scenes (before-after, contested locus pairs)  
5. Persistent honesty labeling on export stills  
6. LOD / layout under many objects  

### 6.2 Architecture (target)

```
EvidenceItem[] + StoryClaimCard[] + StoryModelPack?
        │
        ▼
 objectReasoning.ts
   · noun extract · mesh family resolve · rank · dedupe
   · score → verifiability · importance
   · tag↔SME overlap
        │
        ▼
 EvidentiaryObject[]  (+ selectedIds)
        │
        ├─► generators.ts → ProceduralAsset (parts, accent, meta)
        ├─► spatialSceneLayout.ts → positions (ENU meters, no collision)
        └─► terrainFromMap.ts → basemap terrain context
        │
        ▼
 MassingCanvas / MassingViewerModule
   · Full: status rims + labels LOD
   · Solo: ReasoningPanel (claim, score, sources, why)
   · ContestedPair mode (optional)
   · Disclaimer chrome always on
        │
        ▼
 Export still / Unity snippet — disclaimer burned in or mandatory footer
```

### 6.3 Work packages (recommended GitHub milestones)

#### **M0 — Spec lock (docs only · 0.5 day)**

- [ ] Freeze status tokens from UI Supercharge Spec (colors for +1 / 0 / −1 / plausible)  
- [ ] Write `docs/3D_ILLUSTRATIVE_CONTRACT.md`: never forensic; required disclaimer strings  
- [ ] Acceptance tests list (below §6.5)  

#### **M1 — objectReasoning fidelity (P0 · 2–4 days)**

**Files:** `objectReasoning.ts`, tests, `meshCatalog`, `dedupe`

| Task | Done when |
|------|-----------|
| Stricter ranking | Only `importance ≥ supporting` seed Full scene by default |
| Near-dupe removal | Same mesh family or Jaccard(name/role)>threshold → keep highest importanceScore |
| Curated pack priority | `storyModels` items always win over weak noun hits |
| Max objects | Cap Full scene (e.g. 8–12) with “+N more in catalog” |
| Tests | Fixtures: viral −1 rumor does not spawn “fact” vehicle; +1 primary binds `verified_supported` |

#### **M2 — Status materials & Full-scene legibility (P0 · 2–3 days)**

**Files:** `MassingCanvas.tsx`, `generators.ts`, `sceneObjectMeta.ts`, claimStatus tokens

| Task | Done when |
|------|-----------|
| Emissive rim by verifiability | Readable at default Full camera |
| Icon billboard or status pip | Small objects still show +1/0/−1/plausible |
| Color tokens | Single source (`claimStatus.ts` / Supercharge) — no hard-coded drift |
| Reduced motion | Respect prefers-reduced-motion for pulses |

#### **M3 — Solo reasoning panel (P0 · 2–3 days)**

**Files:** `MassingViewerModule.tsx`, store selection, maybe `sceneObjectMeta.ts`

Solo view **always** shows:

1. Object name + role  
2. Linked claim text (full)  
3. Score badge + verifiability label  
4. Source binding state (bound ids / “none”)  
5. `reasoning[]` bullets (“why this object”)  
6. Fixed disclaimer strip  

#### **M4 — Contested-locus & light temporal (P1 · 3–5 days)**

| Task | Done when |
|------|-----------|
| Contested pair mode | Same family under two scores side-by-side (e.g. 0 vs −1) |
| Sequence markers | If claim/timeline has order, show index badge 1…n |
| Path strips | Optional connector mesh between related objects |

#### **M5 — Performance & layout (P1 · 2–4 days)**

| Task | Done when |
|------|-----------|
| LOD | Far objects: pip only; near: full mesh |
| Layout | `spatialSceneLayout` collision-free at 12 objects |
| Terrain | Optional toggle; never obscure status pips |
| Stress test | Desk with 20 claims does not freeze UI |

#### **M6 — Export honesty (P0 · 1–2 days)**

| Task | Done when |
|------|-----------|
| Still export | Canvas capture includes disclaimer footer **or** blocked without it |
| Unity emit | Header comment retains `MODEL_DISCLAIMER` |
| Export Kit cross-link | Pack notes include “3D is illustrative” if scene attached |

#### **M7 — Domain pack kit for 3D (P1 · ongoing)**

Per new civic topic:

- [ ] `storyModels` pack (3–6 critical objects)  
- [ ] mesh family tags for industry + SME domains  
- [ ] default `forgeAssetType` on simulation  
- [ ] smoke: desk loads → ≥1 object with non-empty reasoning  

### 6.4 Logic rules (product law for 3D)

1. **Score drives material, not the reverse.**  
2. **−1 never looks “settled fact”** (broken rim / hatch / red pip).  
3. **+1 without source → plausible_unverified**, not verified_supported.  
4. **Narrative/viral language** → narrative_only flag when not +1 primary.  
5. **Curated story models** outrank weak automatic nouns.  
6. **Disclaimer is UI chrome + export**, not only a tooltip.  
7. **Geometry is a function of the ledger** — regenerate when evidence set changes (with operator confirm if scene dirty).

### 6.5 Acceptance tests (3D)

Automated:

- [ ] unit: ranking / dedupe / verifiability mapping  
- [ ] unit: accent application skips ground plane  
- [ ] smoke: sample desk produces ≥1 evidentiary object  

Manual:

- [ ] Full scene: three objects of mixed scores — status distinguishable at default zoom  
- [ ] Solo: claim text visible without opening Research Hub  
- [ ] −1 object cannot be misread as supported  
- [ ] Disclaimer visible Full + Solo  
- [ ] Export still includes honesty labeling  
- [ ] No sticky massing loop when Design Lab conditions change (plan §7.3)  

### 6.6 Suggested GitHub issue titles

1. `feat(forge): stricter objectReasoning rank + near-dupe cull`  
2. `feat(massing): status emissive rims + LOD pips from claimStatus tokens`  
3. `feat(massing): Solo reasoning panel (claim, sources, why)`  
4. `feat(massing): contested-locus pair view`  
5. `feat(export): burn-in illustrative disclaimer on scene stills`  
6. `perf(massing): layout cap + collision-free placement under load`  
7. `docs: 3D_ILLUSTRATIVE_CONTRACT + domain pack 3D checklist`  

---

## 7. Quality gates (anyone · any PR)

```bat
cd /d C:\NEXOSxLPIN
npm.cmd run test
npm.cmd run lint
npm.cmd run build
node scripts\smoke-sme-congress.mjs
```

Plus Open Ecosystem §7 fidelity checklist (state→city unlock, Design Lab cascade, Layer-0 export, claim colors consistent ledger/map/scene, no secrets in packs).

---

## 8. Releases & install

| Artifact | Role |
|----------|------|
| `releases\NEXOSxLPIN-1.6.1-*.zip` | Share / cold install |
| `INSTALL.bat` / `START.bat` | Node LTS → install → dev server |
| `docs/INSTALL.md` | Operator install |
| Desktop `NEXOSxLPIN.lnk` | Daily launch |

---

## 9. What to put in the GitHub README blurb (short)

> **NEXOSxLPIN** is an evidence-first verification workbench: claim ledgers (+1/0/−1), Layer-0 export gates, civic and congressional training desks, 252 SME lenses, and **illustrative** 3D massing derived from scored claims — never forensic reconstruction.  
> Domain topics (ALPR, BWC, CCTV, sensors, …) are **data packs** on a fixed governance spine.  
> Skills constitution: [AOS-v3---LPIN](https://github.com/AdventureNLearn/AOS-v3---LPIN).  
> Discipline: primary records over posts; instruments over headlines; never launder uncertainty into certainty.

---

## 10. Recommended next 30 days (if 3D is the bottleneck)

| Week | Focus | Outcome |
|------|--------|---------|
| 1 | M0 + M1 + M3 | Trustworthy object set + Solo panel |
| 2 | M2 + M6 | Readable Full scene + honest export |
| 3 | M4 + M5 | Contested pairs + performance |
| 4 | One domain pack (e.g. ALPR or BWC) end-to-end | Proves §4 branching on GitHub |

---

## 11. Hermes standing assessment

| Claim | Score |
|-------|-------|
| Workbench exists as domain-swappable hub | **+1** |
| SME + congressional depth for training | **+1** |
| Evidence / Layer-0 spine intact in product design | **+1** |
| 3D stack present and wired to claims | **+1** |
| 3D meets full investigative legibility of plan §5 | **0** (gaps listed; plan above closes them) |
| Open ecosystem PDF aligned with code architecture | **+1** |

---

**America First | Truth-Seeking**  
Prefer primary records over posts. Prefer instruments over headlines.  
Never launder uncertainty into certainty.  
3D is illustrative — derived from scored claims — not forensic fact.
