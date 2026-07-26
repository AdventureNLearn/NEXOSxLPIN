# 3D Object Classification Logic

**Code truth:** `src/lib/forge/objectReasoning.ts`  
**Catalog:** `src/data/forge/meshCatalog.ts` (~105 families)  
**Curated packs:** `src/data/useCases/storyModels.ts`  
**Layout / terrain:** `spatialSceneLayout.ts`, `terrainFromMap.ts`  
**Render:** `MassingCanvas.tsx`, `MassingViewerModule.tsx`, `generators.ts`  

**Law:** 3D objects are **illustrative stand-ins derived from scored claims**.  
They are **never** forensic reconstructions, certified surveys, or proof of fact.

Disclaimer string (code):

> Illustrative geometry only — not a certified survey, forensic reconstruction, or product design.

---

## 1. Pipeline (claim → mesh)

```text
Story + Claims[] + Evidence[] + optional StoryModelPack
        │
        ▼
 deskContext()
   · concatenate title, lede, stakes, congress seed, claim text
   · industries from seed
   · SME domains from lens focusTags hit on text
   · cong-* desks add oversight / public-records / sector-regulatory
        │
        ▼
 computeOperationalOverlap(smeDomains, text)   # tag ↔ SME many-to-many
        │
        ▼
 Curated storyModels (if pack exists)  ──► fromCurated()  [always high priority]
        │
        ▼
 selectMeshFamiliesForContext(..., 20)  # industry + SME + overlap
 + keyword force-include from claim/evidence text (up to 24 families)
        │
        ▼
 fromFamily() per mesh
   · bind best matching claim/evidence score + sourceIds
   · flagFromScore() → verifiability + flags + reasoning bullets
   · importanceScore → critical | supporting | background
        │
        ▼
 If any claim score === -1 → force/replace mf-env-smoke-locus disputed object
 cong-* thin scenes → seed docket / foundry / smoke
 empty → civic path / crowd / docket fallback
        │
        ▼
 dedupeByText → sort by importanceScore → top 14
 selectedIds = critical (max 6)
        │
        ▼
 generators + spatial layout + terrain → Massing Full/Solo
```

---

## 2. How importance is classified

`importanceScore` (higher = more story-critical):

| Factor | Points (approx) |
|--------|-----------------|
| Base | 10 |
| Score +1 | +4 |
| Score −1 | +5 (contested = salient) |
| Score 0 | +1 |
| Has bound source ids | +3 |
| Curated pack item | +4 |
| Family keyword richness | +0.2 × n |
| Family multi-SME (≥2 domains) | +2 |
| Overlap hit ≥2 domains | +3 |

**Bands:**

| Band | Threshold | Scene role |
|------|-----------|------------|
| **critical** | ≥ 16 | Default selected; Solo-first |
| **supporting** | ≥ 12 | Visible Full scene |
| **background** | &lt; 12 | Fill / context |

**Curated pack items** without a resolved family still get **importance = critical** and score **16** — curated always wins weak noun hits.

---

## 3. How verifiability is classified (`flagFromScore`)

| Condition | Verifiability | Intent |
|-----------|---------------|--------|
| Score +1 **and** has sources | `verified_supported` | Sketch as supported — still not forensic |
| Score +1 **without** sources | `plausible_unverified` | Prevents fake certainty |
| Score −1 | `disputed_unverifiable` | Contested locus; flags `DO_NOT_TREAT_AS_FACT` |
| Score 0 + viral/rumor language | `narrative_only` | Social channel risk |
| Score 0 otherwise | `plausible_unverified` | Default honesty |

**Narrative language detector (regex):**  
`viral|rumor|social post|influencer|trending|allegedly|unconfirmed clip`

**Accent colors (meshAccentColor):**

| Flag | Color (hex) |
|------|-------------|
| verified_supported | `#34d399` |
| disputed_unverifiable | `#fb7185` |
| narrative_only | `#a78bfa` |
| method_gate | `#64748b` |
| plausible_unverified | `#fbbf24` |

> **Gap (M2):** Full-scene small meshes still need emissive rims/pips so these colors stay legible at distance.

---

## 4. How research context steers mesh choice

### 4.1 Desk text context

Built from story title/lede/stakes + congress seed industry/agency/tags + all claim plain text + evidence titles/summaries.

### 4.2 SME domain activation

For each SME lens, if any `focusTags` appears in desk text → that lens’s **domain** joins the active set.  
Training desks always include `method-process`.  
`cong-*` desks also pull oversight / public-records / sector-regulatory.

### 4.3 Catalog selection

`selectMeshFamiliesForContext` ranks families by industry match + SME domain membership + operational tag overlap.  
Then **keyword force-include**: if a family keyword (length &gt; 2) appears in claims/evidence/context, it enters the candidate set (cap 24 before object build).

### 4.4 Claim binding per family

For each family, first claim whose text contains a family keyword wins the **score** and **sourceIds**.  
Else first matching evidence item.  
Else score defaults to **0** with synthetic source text from family name + desk.

### 4.5 Contested locus

Any claim with score **−1** forces mesh family `mf-env-smoke-locus` into the scene (replace same family if present) so dispute is visually unavoidable.

---

## 5. Reasoning bullets (what operators should read)

Each `EvidentiaryObject.reasoning[]` includes:

1. Mesh family id, layout, seed, depth  
2. Multi-SME association note  
3. Overlap note from tag↔SME engine  
4. Activated tags or industry lock note  
5. Score-derived honesty lines (primary linked / plausible / disputed / narrative)

**Product gap (M3):** Solo Massing panel must surface claim text + these bullets without opening Research Hub.

---

## 6. What the classifier is good at vs weak at

| Good at (+1) | Weak (0) |
|--------------|----------|
| Binding score → material language | Near-duplicate families both surviving |
| Elevating curated story models | Generic keyword hits (e.g. “path”, “stack”) |
| Surfacing −1 as contested locus | Temporal before/after pairs |
| Multi-SME overlap notes | Full-scene status legibility |
| Hard cap ~14 objects | Operator-facing “why” panel depth |

---

## 7. Rules for contributors changing 3D logic

1. **Score drives material, not the reverse.**  
2. **−1 never looks settled fact.**  
3. **+1 without source ≠ verified_supported.**  
4. **Curated storyModels outrank weak automatic nouns.**  
5. **Disclaimer is chrome + export**, not only a tooltip.  
6. **Geometry is a function of the ledger** — regenerate when evidence changes (confirm if dirty).  
7. Add/adjust tests in `objectReasoning.test.ts` for every ranking change.  
8. New civic topics: prefer **storyModels pack** (3–6 critical objects) over hoping keywords alone work.

See milestones M0–M7 in  
[`NEXOSxLPIN_Open_Ecosystem_Overview_and_3D_Build_Plan.md`](./NEXOSxLPIN_Open_Ecosystem_Overview_and_3D_Build_Plan.md).

---

## 8. Manual acceptance (3D)

- [ ] Mixed +1 / 0 / −1 objects distinguishable at default Full zoom  
- [ ] Solo shows claim + score + sources + why (after M3)  
- [ ] −1 cannot be misread as supported  
- [ ] Disclaimer visible Full + Solo  
- [ ] Export still includes honesty labeling (after M6)  
- [ ] No sticky massing loop when Design Lab conditions change  

---

**America First | Truth-Seeking**  
3D is illustrative — derived from scored claims — not forensic fact.
