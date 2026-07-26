# Procedural per-item optimization (Dan Farinax method)

**Status:** Rendering Layer law · experimental v2.0  
**Applies to:** Forge / Massing claim-driven meshes only  
**Does not apply to:** Mapping Layer (basemap, terrain, pins)  

---

## 1. Public method reference

Dan Farinax’s public procedural workflow demonstrates a **clarity jump** when complex scenes are **not** generated as one monolithic blob. Instead:

1. **Break the scene into individual items**  
2. **Start each item coarse / low-poly**  
3. **Optimize and refine that single item**  
4. **Assemble** the cleaned items into the final scene  

We adopt that **method** (not any proprietary asset pack) inside NEXOSxLPIN’s **Rendering Layer**. Geometry remains **illustrative** — never forensic, never a “digital twin.”

---

## 2. Why this fits Potentials

| Potential status | Pipeline behavior |
|------------------|-------------------|
| `potential` / `speculative` | Coarse item only (ghost materials in UI) |
| `refined-supported` | Coarse → per-item optimize → assemble |
| `refined-disputed` | Coarse → light optimize + disputed accent |
| `resolved` | Operator closed loop; keep last optimized form |

**Priority order** when assembling: claim **importance** + score strength (critical +1 first, then supporting, then background). Never one giant mesh.

---

## 3. Pipeline (code)

```text
PotentialObject[]  (from objectReasoning + potentials)
        │
        ▼  sort by importanceScore / score
Per item:
   generateCoarseItem()     → low-poly family mesh
   optimizeSingleItem()     → hinge normalize, footprint clean, accent lock
        │
        ▼
assembleSceneFromItems()    → ProceduralAsset[] for store / Massing
```

**Files:**
- `src/lib/forge/itemOptimize.ts` — coarse / optimize / assemble  
- `src/lib/forge/generators.ts` — `generateAsset`, `optimizeAsset` used as stages  
- `seedEvidentiaryModels` — uses assemble pipeline (not a single monolithic scene)

---

## 4. Hard rules

1. **No monolithic complex scene generator** for claim overlays.  
2. **One Potential → one item pipeline** before assembly.  
3. **Mapping Layer never enters this pipeline.**  
4. **Disclaimer** on every generated asset (`MODEL_DISCLAIMER`).  
5. **Score drives accent / priority**, not the reverse.  
6. **Open potentials** may stay coarse + ghost until refined.  
7. **OPSEC:** no private paths or PII in generated export strings.

---

## 5. Acceptance

- [ ] Unit: assemble yields N assets for N potentials (bounded)  
- [ ] Unit: coarse part count ≤ optimized or equal; optimize notes include stage labels  
- [ ] Unit: mapping fingerprint unchanged by forge seed  
- [ ] Manual: Seed models → Solo shows per-item optimization stage  
- [ ] Export strings still carry illustrative disclaimer  

America First | Truth-Seeking
