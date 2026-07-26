# Layer Separation & Potentials System

**Status:** Feature design · M3.5 extension  
**Product:** NEXOSxLPIN ≥ 2.0.0-experimental  
**Branch:** `feature/mapping-rendering-layer-separation-and-potentials`  
**Non-negotiables:** 3D illustrative only · score-driven geometry · tri-state · Layer-0 · honesty disclaimer · curated storyModels outrank weak keywords  

---

## 1. Goal

Separate **Mapping Layer** (location foundation) from **Rendering Layer** (context-driven potentials) so text + location scenarios can grow granular 3D detail without confusing place with proof. Every candidate object starts as a **Potential** and only refines as the claim ledger evolves. Speculative details stay **open** until an operator resolves them.

---

## 2. Mapping Layer (location foundation)

| Property | Rule |
|----------|------|
| Contents | Basemap, terrain (`terrainFromMap.ts`), orientation / origin pins, public WGS84 scene points |
| Drivers | **Location data only** (desk pin, scene points, pack spatial points) |
| Stability | **Never mutates** when claim scores or story text change |
| Visual | Neutral ground plane / public map — always available as place context |
| Code | `AtlasModule`, `ScaleAccurateMapStage` basemap + origin pin, `terrainFromMap`, ENU origin |

**Invariant:** `mappingFingerprint(origin, scenePoints)` is independent of `evidence[]` and claim scores.

---

## 3. Rendering Layer (context overlay)

| Property | Rule |
|----------|------|
| Contents | All **PotentialObject**s and refined claim-linked meshes |
| Drivers | Selected story + claim ledger + curated storyModels |
| Regeneration | When ledger / desk context changes |
| Visual | Score materials when refined; **ghost/dashed** when potential or speculative |
| Code | `objectReasoning.ts`, `potentials.ts`, `MassingCanvas` non-terrain parts, forge assets |

---

## 4. PotentialObject model

```ts
status: "potential" | "refined-supported" | "refined-disputed" | "speculative" | "resolved"
importanceBand: "critical" | "supporting" | "background"
spatialRole: "surface" | "activity-locus" | "actor" | "prop" | "other"
layer: "rendering"  // claim-driven objects never enter Mapping Layer
```

- Every extracted noun/activity begins as **`potential`** (or **`speculative`** if narrative-only / unsourced fog).  
- Multi-mode actions create **parallel** potentials (e.g. “reading” → book / phone / tablet / paper).  
- Activity surfaces are first-class (e.g. “eating” → table / counter / tray).  
- Speculative items remain visible and labeled until the operator marks **resolved** (or ledger forces refine/dispute).  
- **Curated storyModels** still outrank weak keyword hits when building the set.

### Status refinement (automatic from ledger)

| Ledger signal | Potential status |
|---------------|------------------|
| +1 with sources | `refined-supported` |
| +1 without sources | stays `speculative` or `potential` (plausible/unverified) |
| −1 | `refined-disputed` |
| 0 / narrative-only | `potential` or `speculative` |
| Operator explicit close | `resolved` (open loop closed by human) |

---

## 5. UI

- Layer toggle: **Mapping only | Rendering only | Both (default)**  
- Ghost material for `potential` | `speculative`  
- Score-driven materials for refined statuses  
- **Solo panel** lists status + reasoning bullets for every Potential  
- Mandatory illustrative disclaimer on every 3D view (unchanged contract)

---

## 6. Walkthrough — “person in location eating and reading”

1. **Mapping:** public lat/lng pin + basemap/terrain for the place. Unchanged if claims flip.  
2. **Story text / claims** mention a person eating and reading outdoors.  
3. **Rendering potentials (parallel):**  
   - actor locus (person / crowd strip) — potential  
   - eating → surface potentials: table, counter, tray  
   - reading → prop potentials: book, phone, tablet, paper  
4. Operator scores “Person was at the plaza” **+1** with a primary → actor may become **refined-supported**.  
5. “Ate at a formal dining table” stays **0** → table potential remains **potential/speculative**, not forced closed.  
6. Export still burns honesty labels; Layer-0 still blocks on open −1.

---

## 7. What must never happen

- Claim scores rewriting basemap/terrain origin  
- Speculative meshes labeled forensic / digital twin / certified  
- Auto-closing open story loops without operator resolve  
- Weak keyword hits outranking curated storyModels  

---

## 8. Code map

| Concern | Path |
|---------|------|
| Potentials model + activity expand | `src/lib/forge/potentials.ts` |
| Dan per-item optimize | `src/lib/forge/itemOptimize.ts` · `docs/PROCEDURAL_ITEM_OPTIMIZATION.md` |
| Evidentiary reasoning | `src/lib/forge/objectReasoning.ts` |
| Mapping fingerprint pure | `src/lib/map/mappingLayer.ts` |
| Massing UI layers | `MassingViewerModule.tsx` |
| Ghost materials | `MassingCanvas.tsx` |
| Seed models | `seedEvidentiaryModels` → assembleSceneFromPotentials |
| Contract | `docs/3D_ILLUSTRATIVE_CONTRACT.md` |

---

## 9. Acceptance

- [x] Mapping fingerprint stable across claim score changes  
- [x] New objects exposed as Potentials with status  
- [x] Speculative remain open and labeled  
- [x] Score → material pipeline preserved for refined  
- [x] Disclaimer + Layer-0 unchanged  
- [x] Layer toggle: mapping / rendering / both  

America First | Truth-Seeking
