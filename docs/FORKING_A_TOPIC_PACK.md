# Forking a Topic Pack (Civic Domain Branch)

**Goal:** Specialize NEXOSxLPIN for a civic topic without forking the governance spine.  
**Examples:** ALPR · body-worn cameras · municipal CCTV · facial recognition · UAS · smart poles · public Wi-Fi/kiosks · air-quality sensors · transit AVL · school-zone monitoring.

---

## Fixed (do not fork away)

- Tri-state +1 / 0 / −1  
- Layer-0 export blocks on open −1  
- Explicit export only  
- Progressive disclosure patterns  
- Illustrative-only 3D + disclaimer  
- OPSEC: no secrets/PII in samples  
- Quality gates: test · lint · build · smoke  

---

## Swappable (this is your pack)

| Concern | Typical paths |
|---------|----------------|
| Desk / story catalog | `src/data/useCases/catalog.ts`, `stories.ts`, packs |
| Congress-style seeds (if used) | `src/data/useCases/congressDesks*` |
| Condition matrices | `designMatrices.ts` (or Design Lab data) |
| Sources list | `activeSources.ts` / desk sources |
| Story models (3D curated) | `src/data/useCases/storyModels.ts` |
| Default forge asset | `forgeAssetType` on simulation / desk meta |
| SME recommendations | lens `focusTags`; desk evidence tags |
| Spatial tags / pins | atlas pins, scenePoints, Overpass tags if enabled |
| Smoke assertions | `scripts/smoke-*.mjs` |

---

## Gates 0–5 (same every time)

### Gate 0 — Intent lock

Write in working document:

- Topic name  
- Operator success metric (usually: “score claims; export only when clean”)  
- Non-negotiables restated  
- Out of scope (what you will **not** claim)

### Gate 1 — Catalog + engine

1. Clone nearest existing desk as template  
2. Rename ids/labels (agnostic where possible — avoid embedding real client PII)  
3. Replace products, mounting/conditions, audit keywords  
4. Replace or add sources (public URLs only in samples)  
5. **Do not** edit Layer-0 / evidence type semantics  

### Gate 2 — Visual parity

1. Claim status colors still from `claimStatus` / Supercharge tokens  
2. storyModels: 3–6 **critical** objects with `relatedClaimHint`  
3. Mesh family keywords cover domain nouns  
4. Map pins kinds consistent  

### Gate 3 — Quality gates

```bat
cd /d C:\NEXOSxLPIN
npm.cmd run test
npm.cmd run lint
npm.cmd run build
node scripts\smoke-sme-congress.mjs
```

Add topic smoke if counts change meaningfully.

### Gate 4 — Working document

- Decisions  
- Evidence items  
- Open −1 list  
- 3D disclaimer acknowledged  

### Gate 5 — Package

```bat
npm.cmd run build
python scripts\build_share_zip.py
```

Share zip + short README delta for the pack.

---

## Fidelity checklist (must all pass)

From Open Ecosystem Plan §7:

1. Build/lint/tests clean  
2. Sample jurisdiction produces layout + log lines from public/bound sources  
3. Design Lab cascade does not freeze / sticky massing  
4. State→City (or equivalent) unlocks spatial density when applicable  
5. Conflict lists visible  
6. Export deliberate + Layer-0 aware  
7. Claim status consistent ledger/map/scene  
8. 3D illustrative + disclaimer  
9. Working document trail  
10. No secrets/PII; safe URLs  

---

## Suggested PR titles

- `feat(pack): municipal CCTV desk pack (gates unchanged)`  
- `feat(pack): BWC storyModels + mesh tags`  
- `test(pack): smoke counts for AQ sensor desks`  

Never: `feat: allow export with open -1` · `feat: remove 3D disclaimer`

---

## Skills to load (Hermes / human operators)

Prefer portable skills from **AOS-v3---LPIN**: evidence-gate, public-records-forensics, jurisdiction-ops, permit-coordinator, oversight-kit-builder, gis-layer, working-doc-manager, ops-hardening-architect.

---

**America First | Truth-Seeking**
