# Visual Assistant Instruction Set  
## NEXOSxLPIN as a best-practice research analysis surface

**Audience:** Professional research analysts · civic investigators · trained operators · product maintainers  
**Goal:** Visual **simplicity** with **comprehensive** capacity — humans reason from a **high-agency** position  
**Version:** 2.0 · companion to immersive simplification  

---

## 1. Problem diagnosis (current system)

### 1.1 Too much chrome, not enough coherence

| Symptom | Root cause | Analyst impact |
|---------|------------|----------------|
| Dual module strips (app header + stage pills + story-specific labels) | Historical tiles + immersive + storyTabLabel | “Where do I click?” tax |
| Experts rail always open (252 lenses) | Immersive fixed right rail | Attention capture without a question |
| Claims + Evidence + Sources repeated 2–3 times | Left rail + map brief + right sources | Dead space / duplicate truth |
| “Sole mode” badge with no action | Dead chrome | Fake control |
| Auto-scale zoom gates too strict | CAD-style minZoom/minPx | Clunky flyTo thrash; feels broken |
| No “you are here → next” spine | Modules added faster than orchestration | Low agency: tool drives operator |
| Jargon residual (SME, Layer-0, Massing) in secondary chrome | Dual labeling eras | Non-analysts bounce; analysts waste decode time |

### 1.2 What “immersive” should mean

Immersive is **not** “show everything at once.”  
Immersive is: **one stage in focus**, rails **on demand**, and a **persistent assistant** that maps tools to the investigation loop.

```text
GOOD immersive:  Stage (map/3D) + Claims (toggle) + Assistant (always)
BAD immersive:   Claims + Map + Brief + Experts + Sources + 3 tab rows + density + music
```

---

## 2. Design principles (professional research assistant)

1. **One question at a time** — The assistant states the active decision.  
2. **Scores are the spine** — UI exists to create, challenge, place, and export scores.  
3. **Progressive disclosure** — Experts, Rules, Depth, Commands stay secondary until needed.  
4. **No duplicate truth surfaces** — A claim appears in one primary ledger; others link to it.  
5. **Explain mapping, don’t decorate** — Every panel header answers “what this feeds.”  
6. **Auto-scale serves inspection** — Zoom to make a feature legible; never punish clicks.  
7. **Autonomy assists; humans adjudicate** — Agents propose; operators score and share.  
8. **High agency** — Operator can ignore any rail and still complete Story → Claims → Map → Share.

---

## 3. Coherent product loop (instruction set for operators)

### The only loop that matters

```text
1. ORIENT   Pick a story (question + stakes)
2. SCORE    Atomic claims → Supported / Not proven / Disputed
3. SOURCE   Bind records (or leave honest holes)
4. PLACE    Map layers: Where → Claims → Sources → optional Sketch
5. CHALLENGE  Open −1 lines until resolved or residual risk is explicit
6. MODEL    Optional sketch/3D — illustrative only
7. SHARE    Explicit pack when Layer-0 allows
```

### How modules map (memorize this)

| Step | Module | Feeds |
|------|--------|--------|
| Orient | Story / Guide | Question |
| Score | Claims | Board of truth |
| Place | Map | Geography of claims |
| Challenge | Claims + Share gate | Integrity |
| Optional depth | Experts, Rules, Depth | Checklist / conditions |
| Optional spatial | Sketch / 3D | Reasoning aid |
| Exit | Share | External artifact |

**Commands** are optional. If you do not need them, never open them.

### Assistant strip (in-app)

After a story is picked, the **Assistant** bar shows:

- **Here** — board state in one line  
- **Why** — agency reason  
- **Next** — one action + **Go** button  
- **How it maps** — expandable spine of all modules  

Dismissible; does not block the stage.

---

## 4. Full improvement inventory

### P0 — Coherence & simplicity (product law)

| ID | Improvement | Done? |
|----|-------------|-------|
| P0.1 | Clean first-run (no HUD under picker) | Yes (prior) |
| P0.2 | Visual Assistant coach + coherence spine | **Yes (this pass)** |
| P0.3 | Immersive: Experts **closed by default**; Claims toggleable | **Yes** |
| P0.4 | Stage spine = 5 primaries (Map, Claims, 3D, Experts, Share) | **Yes** |
| P0.5 | Remove dead “Sole mode” badge | **Yes** |
| P0.6 | Soften auto-scale gates + plain status copy | **Yes** |
| P0.7 | Single “how this maps” footer mantra | **Yes** |
| P0.8 | De-dupe header shortcuts (Stage / Map / 3D / Share) | **Yes** |

### P1 — Eliminate remaining duplicity

| ID | Improvement | Wire |
|----|-------------|------|
| P1.1 | Kill story-specific tab renames on primary spine (`storyTabLabel` only for Story module) | `stories.ts` / Workspace |
| P1.2 | Map brief sources = Claims sources (one component, one data path) | Atlas + ActiveSourcesList |
| P1.3 | Hide app-level density/music until “More” menu | `App.tsx` |
| P1.4 | Evidence board vs Claims ledger merge or clearly parent/child | ResearchHub |
| P1.5 | Layer toggles **filter** map geometry (not only explain) | Atlas + investigationLayers |
| P1.6 | Solo map default after pick for non-pro density preference | workspace profile |

### P2 — Auto-scale & spatial craft

| ID | Improvement | Wire |
|----|-------------|------|
| P2.1 | “Inspect mode”: one click always selects + smooth ease zoom | ScaleAccurateMapStage |
| P2.2 | Disable auto-scale toggle for power users | store + map chrome |
| P2.3 | Breadcrumb World → Site → Scene → Object | investigationLayers |
| P2.4 | Contested locus pair view for −1 | Massing M4 |
| P2.5 | Cluster pins at low zoom; expand at site zoom | Atlas |

### P3 — Autonomous analytical capability (agent wiring)

These give **full assistive analysis** while keeping humans as adjudicator:

| Capability | What to wire | Human agency rule |
|------------|--------------|-------------------|
| **A. Claim miner** | Ingest story text → propose atomic claims (score default 0) | Operator must accept/edit scores |
| **B. Source binder** | Suggest public URLs / desk sources by keyword | Operator binds; no silent +1 |
| **C. Contradiction detector** | Flag claim pairs that conflict → propose −1 | Operator confirms dispute |
| **D. SME recommender** | Rank 3 lenses from claim tags (not 252 dump) | Confirm-apply only |
| **E. Place linker** | Geocode public sites only → scene points | No private homes |
| **F. Sketch proposer** | Run objectReasoning → show plan before generate | Operator clicks Generate |
| **G. Share preflight agent** | Checklist narrative + open −1 list | Operator ACK + download |
| **H. Working-doc scribe** | Auto-append decisions when scores change | Editable, never hidden |
| **I. Coach persistence** | Store dismissed steps / pinned next action | Operator can reset |
| **J. Multi-agent optional** | 4-agent orchestration behind “Deep run” | Explicit start; timeout; summary only |

**Not autonomous:** auto-publish, auto-+1, auto-clear −1, forensic 3D claims, PII scrape.

### P4 — Visual system best practices

| Pattern | Spec |
|---------|------|
| Type scale | 9–11px chrome · 12–14px claims · 15–22px first-run only |
| Density | Default **Compact**; Dense = pro; Roomy = training |
| Color | Score tokens only for truth state; cyan for navigation |
| Empty states | Always say **what to click next** (coach-driven) |
| Motion | Prefer 200–300ms ease; no multi-flyTo chains |
| Focus rings | Keep WCAG-visible on all icon buttons |
| Dead space | No empty Expert panel on load; no dual source lists |

---

## 5. Target information architecture

```text
┌─────────────────────────────────────────────────────────────┐
│ Header: Brand · Desk switcher · Web/Mobile · More… · Jump   │
├─────────────────────────────────────────────────────────────┤
│ ASSISTANT: Here · Why · Next [Go Claims] [How it maps]       │
├──────────────┬──────────────────────────────┬───────────────┤
│ Claims rail  │ STAGE (Map | 3D | Share…)     │ Experts rail  │
│ (toggle)     │ one module, full height       │ (toggle OFF)  │
│              │                               │               │
└──────────────┴──────────────────────────────┴───────────────┘
│ Footer: status · spine mantra · Layer-0 when relevant        │
└─────────────────────────────────────────────────────────────┘
```

**Default after pick:** Claims ON · Stage = Map · Experts OFF · Assistant ON.

---

## 6. Auto-scale policy (revised)

| Class | Select from zoom | Behavior on click |
|-------|------------------|-------------------|
| Region | ≥3 | Ease to overview |
| Corridor | ≥7 | Ease along path |
| Site | ≥10 | Ease to site (default incident) |
| Structure | ≥12 | Ease to building footprint |
| Vehicle | ≥14 | Ease to vehicle scale |
| Detail | ≥15 | Ease to equipment |

- Screen footprint gate: **8px** (was 14)  
- Status copy: plain language via `autoScalePlain()`  
- Future: user toggle **“Always allow select”**

---

## 7. Instruction card (print / in-app Guide)

**You are the adjudicator. The desk is the instrument.**

1. Pick one story.  
2. On **Claims**, make every important sentence Supported, Not proven, or Disputed.  
3. If Supported, demand a **source**. If you cannot, leave Not proven.  
4. Open **Map**. Read layers. Trust pins only after: claim → record → score.  
5. Open **Experts** only when a checklist would change a score — then Confirm apply.  
6. Use **3D/Sketch** only to think about space — never as proof.  
7. **Share** only with no open Disputed lines (or documented residual risk).  

If lost: read the **Assistant** bar. Press **Go**.

---

## 8. Maintainer wiring checklist (autonomy backlog)

```text
[ ] tools/claimMiner.ts + researchHub "Propose claims"
[ ] tools/sourceSuggest.ts (public URLs only)
[ ] tools/contradictionScan.ts → −1 proposals
[ ] sme/recommendTopK(claims, k=3)
[ ] map/publicGeocode.ts (opt-in)
[ ] forge/proposeScene() preview before seed
[ ] export/preflightNarrative.md builder
[ ] coach: pin step + session memory
[ ] Deep run: delegate_task orchestrator gated button
[ ] E2E: first-run → score → map → share happy path
```

---

## 9. Success metrics

| Metric | Target |
|--------|--------|
| Time to first honest score | &lt; 2 min for new operator |
| Clicks to Share preflight | ≤ 6 after story pick |
| Open Expert rail rate on first session | &lt; 30% (optional) |
| Auto-scale rage-clicks (repeat click &lt;1s) | Near zero |
| Operator can explain spine without docs | Yes |

---

## 10. What shipped in this pass

- `src/lib/assist/analysisCoach.ts` + tests  
- `VisualAssistant` strip  
- Immersive simplification (rails, spine, no Sole mode)  
- Softer geoScale + plain auto-scale messages  
- Header shortcut de-dupe  

**Still open:** P1–P3 wiring above — iterate after you validate the calmer stage.

---

**America First | Truth-Seeking**  
Prefer primary records over posts. Prefer instruments over headlines.  
Never launder uncertainty into certainty.  
Tools raise human agency — they do not replace judgment.
