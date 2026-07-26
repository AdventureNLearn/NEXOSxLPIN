# NEXOSxLPIN v2.0 — Build Plan (REFINE complete path)

**Mission:** Increase **human agency**. Smash lazy narratives. Project and support what is actually true.  
**Audience:** Everyday people first — not only developers.  
**Version:** **2.0.0**

---

## 1. What we learned from teslasolar (spatial + clarity)

Public patterns reviewed (ideas only — civic-safe rewrite, no branding copy):

| Source | Insight we keep | How it lands in NEXOS |
|--------|-----------------|------------------------|
| **bodyatlas** layered rings | Stacked transparent layers with plain jobs | `investigationLayers` — Where / Levels / Claims / Sources / Sketch |
| **GITSCADA site-map** | Hierarchy: enterprise → site → areas | Scale ladder: World → This place → Scenes → Sketch objects |
| **LookingGlass / gridlock mesh3d** | Selectable nodes, fog/grid for readability | Existing Massing + ENU scale; layer chrome for focus |
| **Hallucination triad benchmark** | Ground before confidence | Perception → Record → Score panel on map layers |
| **filecabinet modular 3D** | Small modular viz pieces | Keep generators/sceneMeshes modular; plain labels |

We **do not** import vulgar product names, private identity, or server-dependent SCADA stacks.  
We **do** take: layer toggles, hierarchy honesty, grounding-before-score, readable 3D posture.

---

## 2. v2 product law (unchanged spine)

1. +1 / 0 / −1 only  
2. Layer-0 blocks share while open −1  
3. Explicit share only  
4. 3D illustrative only  
5. High-level selectors until a story is chosen  
6. No private PII in sample packs  
7. Training ≠ legal advice  

---

## 3. Plain-language surface (wine-mom test)

| Old jargon | v2 everyday label |
|------------|-------------------|
| Information | Story & guide |
| Atlas | Map |
| Research Hub | Claims |
| SME Lenses | Expert check |
| Procedural Forge | Build sketch |
| Massing Viewer | 3D view |
| Export Kit | Share pack |
| Audit Ladder | How deep? |

Welcome banner states the job in one breath: pick a story → score claims → map → optional sketch → share only when clean.

---

## 4. Spatial integration work (done in 2.0.0)

- [x] `src/lib/map/investigationLayers.ts` + tests  
- [x] `SpatialLayerStack` on Map (focus mode)  
- [x] Grounding triad copy (perception / record / score)  
- [x] Hierarchy bands plain labels  
- [x] Massing `origin` memoized (lint clean)  
- [x] MODULE_META plain language  
- [x] WelcomeBanner agency framing  

### Follow-on spatial (iterate after master commits)

- [ ] Wire layer visibility into pin filtering (show/hide claim pins by layer)  
- [ ] Hierarchy breadcrumb on Map + 3D  
- [ ] Contested-locus pair view (M4)  
- [ ] Solo panel depth (M3)  
- [ ] Status rims at distance (M2)  

---

## 5. Professional repo posture

- MIT LICENSE · CONTRIBUTING · DOC_INDEX  
- README written for humans first  
- Portable install (no personal paths required)  
- `git` master folder at product root for iteration  
- Smoke enforces open docs + progressive selectors + layers  

---

## 6. Quality bar for “begin commits”

| Gate | Required |
|------|----------|
| `npm test` | 0 fail |
| `npm run lint` | **0 errors** |
| `npm run build` | 0 fail |
| smoke | SMOKE OK · 2.0.0 |
| Dashboard | Boots without red overlay; welcome + map layers visible |

---

## 7. Human agency loop (product north star)

```text
Noise arrives
  → You open a story (not a doomscroll feed)
  → You score claims with your judgment
  → You demand sources
  → You see place without fake forensics
  → You share only what survives
  → Narrative weakens; supported truth projects
```

Tools and skills amplify the operator — they never replace responsibility.

---

**America First | Truth-Seeking**  
Prefer primary records over posts. Prefer instruments over headlines.  
Never launder uncertainty into certainty.
