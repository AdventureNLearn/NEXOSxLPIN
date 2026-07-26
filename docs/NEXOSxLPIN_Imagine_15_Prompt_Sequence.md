# NEXOSxLPIN — Imagine 15-Prompt Sequence
**Auto-Mapping Package · Visual Reference Generation**

---

## ROUTING & AUTO-MAPPING HEADER
*(Read this first. Any build agent or Grok Build instance must respect these bindings.)*

**Product**  
NEXOSxLPIN (verification workbench) — root expected at `C:\NEXOSxLPIN`

**This document is**  
A controlled sequence of 15 Imagine prompts that produce the canonical visual reference set for the Claim Status system, scene language, and key workbench states.

**Automatic mappings (do not ignore)**

| This package maps to | Location / Artifact | Relationship |
|----------------------|---------------------|--------------|
| UI Supercharge Spec | `NEXOSxLPIN_UI_Supercharge_Spec_v1.0.md` | Source of truth for colors, honesty rules, status language, do-nots |
| Claim Status Components | `NEXOSxLPIN_UI_ClaimStatus_Components.tsx` | Concrete React implementation of the same status system |
| Grok Build Prompt (P0) | `NEXOSxLPIN_Grok_Build_Prompt_UI_P0.md` | Code-side implementation of the Claim Status Visual System |
| Product surfaces | Claims ledger, Map pins, Massing / Forge scene objects, Desk cards, Export Kit, Verify pipeline | Visual references only — not production assets |
| Skills alignment | `visual-systems-architect`, `glyphos`, `evidence-gate`, `sovereign-lens`, `mission-spine-guard` | Visuals must remain subordinate to evidence discipline and Layer-0 |
| Quality gates | `npm run test`, `npm run lint`, `npm run build`, `node scripts/smoke-sme-congress.mjs` | Image generation does **not** modify code; gates remain untouched |

**What this package is allowed to do**  
- Generate illustrative reference images that follow the locked status colors and honesty rules  
- Produce visual targets that the UI implementation (Spec + Components + P0 Build) can match against  

**What this package is forbidden to do**  
- Modify any source code  
- Soften Layer-0, the honesty rule, or tri-state scoring  
- Present geometry as forensic or measured  
- Introduce new status values or intermediate scores  
- Bypass the 5-image batch limit  

**Integration rule for Build agents**  
When this document is received:  
1. Treat the UI Supercharge Spec as the governing visual contract.  
2. Treat the generated images as **reference targets**, not as code or production assets.  
3. Keep any subsequent code work (Claim Status system, Massing materials, etc.) aligned to both the Spec and these visual references.  
4. Never let image style drift into cinematic, social, or narrative-laundering aesthetics.

**Image Limit Control (hard)**  
Every prompt below requires: generate **at most 5 images**, then stop and wait for the user to say **“continue”** (or give a new instruction). Do not auto-advance the sequence.

---

## Global Rules (apply to every prompt)

- Status colors (locked):  
  +1 Supported = `#22c55e` (emerald)  
  0 Not proven = `#f59e0b` (amber)  
  −1 Disputed = `#f43f5e` (rose)  
  Plausible / Unverified = `#a78bfa` (violet)  
- Dark professional base (`#070b14` family). Clean, dense, calm.  
- Geometry and scenes are **illustrative only — never forensic or measured**.  
- Never launder uncertainty into certainty. Plausible items must remain visually distinct.  
- No soft intermediate scores. Tri-state + plausible flag only.  
- Style: high-end verification workbench, not cinematic drama or social-media aesthetic.

**How to run the sequence**  
1. Execute Prompt 1.  
2. After the ≤5 image batch finishes, user says **continue**.  
3. Proceed to the next prompt.  
4. Stop at any time or after Prompt 15.

---

## Prompt 1 — Master Status System Reference
Generate a single clean reference board that shows the four status treatments side-by-side for a claim row:  
+1 Supported, 0 Not proven, −1 Disputed, and Plausible / Unverified.  
Each row must include the left status rail, score badge, text treatment, and (where relevant) source-binding indicator.  
Dark background. Exact Spec colors. No extra decoration. Label the board “NEXOSxLPIN Claim Status System — Locked”.

Generate at most 5 images. Stop when done and wait for “continue”.

---

## Prompt 2 — Claim Status Board (Desk Overview)
Create a dark verification dashboard showing a realistic mix of 8–10 claims on one desk.  
Include a clear distribution of +1, 0, −1, and at least one plausible/unverified item.  
Show left rails, badges, and source-bound indicators.  
Title the board with a neutral desk name (e.g. “Desk 14 — Corridor Event”).  
Keep layout dense but readable. No narrative imagery.

Generate at most 5 images. Stop when done and wait for “continue”.

---

## Prompt 3 — Map Pin Status Set
Generate a clean set of map pin designs for the four statuses:  
Supported (emerald), Hold (amber), Disputed (rose), Plausible (violet).  
Show each pin in isolation on a dark map-like background, plus a small cluster of mixed pins.  
Pins must be simple, high-contrast, and readable at small size.  
Label the sheet “Map Pin Status Language”.

Generate at most 5 images. Stop when done and wait for “continue”.

---

## Prompt 4 — Full Scene (Supported Dominant)
Illustrative 3D-style scene containing: vehicle, path strip, and docket stack.  
Majority of objects carry Supported (emerald) status.  
One secondary object may be Hold.  
Dark environment, soft professional lighting, clear status accent colors on objects.  
Include a small legend. Explicitly label the image “Illustrative — derived from scored claims / not forensic”.

Generate at most 5 images. Stop when done and wait for “continue”.

---

## Prompt 5 — Full Scene (Mixed / Contested)
Same object set as Prompt 4 (vehicle, path, docket stack) but with mixed statuses:  
at least one Supported, one Hold, one Disputed, and one Plausible/Unverified.  
Status colors must be clearly readable on the objects.  
Keep the same “Illustrative — not forensic” label.  
Calm, dense composition suitable for a verification workbench.

Generate at most 5 images. Stop when done and wait for “continue”.

---

## Prompt 6 — Solo Object with Reasoning Panel
Single large illustrative object (choose vehicle or docket stack) in Solo view.  
Show clear status coloring and a side panel that lists:  
- Linked claim text (short)  
- Score  
- Source status (bound / missing / plausible)  
Dark UI chrome. Professional, not dramatic.  
Label “Solo Object — Verifiability Visible”.

Generate at most 5 images. Stop when done and wait for “continue”.

---

## Prompt 7 — Contested Locus Comparison
Side-by-side comparison of the same illustrative object under two states:  
Left = 0 Not proven (amber treatment)  
Right = −1 Disputed (rose treatment)  
Identical composition except for status treatment.  
Clear labels on each side. Dark background.  
Purpose: show how status change is visually unmistakable.

Generate at most 5 images. Stop when done and wait for “continue”.

---

## Prompt 8 — Timeline with Status Flags
Horizontal or vertical timeline of 6–8 events.  
Each event carries a status flag (+1 / 0 / −1 / plausible) using the locked colors.  
Clean typography, dark background, minimal decoration.  
Title “Event Sequence — Status Visible”.  
No dramatic illustrations — status and order are the content.

Generate at most 5 images. Stop when done and wait for “continue”.

---

## Prompt 9 — Source–Claim Relationship Graph
Node-and-edge diagram.  
Nodes = claims and sources.  
Edges show binding.  
Node color or border follows claim status.  
Unsupported or plausible claims are visually distinct.  
Dark background, clear labels, no chart junk.  
Title “Claim–Source Graph”.

Generate at most 5 images. Stop when done and wait for “continue”.

---

## Prompt 10 — Desk Overview Card
Compact card representing one investigation desk.  
Show: desk name, primary map pin status, claim count by status (small counters), and a one-line stakes summary.  
Use the locked status colors for the counters and pin.  
Dark elevated card style. Suitable for a desk switcher UI.

Generate at most 5 images. Stop when done and wait for “continue”.

---

## Prompt 11 — Layer-0 Blocked Export State
UI concept of the Export Kit or export button in the blocked state.  
Clearly show that export is disabled because open −1 claims exist.  
Include a plain-language reason (e.g. “2 open −1 claims”).  
Status colors and calm warning treatment only — no alarmist graphics.  
Label “Layer-0 Gate — Export Blocked”.

Generate at most 5 images. Stop when done and wait for “continue”.

---

## Prompt 12 — Multi-Loop Verify Progress
Visual representation of the verification pipeline stages:  
Structure → Sources → Scores → Duplicates → Export Readiness.  
Show a clean progress state (some stages complete, one in progress or failed).  
Dark UI, precise labels, status colors only where a stage has failed on score hygiene.  
No gamification.

Generate at most 5 images. Stop when done and wait for “continue”.

---

## Prompt 13 — Field / Mobile Claim Scoring
Mobile or narrow-viewport concept for scoring a single claim.  
Large, tappable +1 / 0 / −1 targets using the locked colors.  
Show source-binding status and the plausible flag if relevant.  
Clean, high-contrast, thumb-friendly.  
Dark theme consistent with the desktop system.

Generate at most 5 images. Stop when done and wait for “continue”.

---

## Prompt 14 — Status Legend & Color System Sheet
Single reference sheet that documents the four treatments with:  
- Color swatch  
- Name  
- Short meaning  
- Example rail + badge  
Exact hex values visible.  
Title “NEXOSxLPIN Status Legend — Locked”.  
This is the canonical color reference for all other visuals.

Generate at most 5 images. Stop when done and wait for “continue”.

---

## Prompt 15 — Score Change Before/After
Two-state visual of the same claim row:  
Before = 0 Not proven  
After = +1 Supported (with source now bound)  
Show the visual transition of rail, badge, text weight, and source indicator.  
Side-by-side or clear before/after labels.  
Purpose: demonstrate that status change is the primary visual event.

Generate at most 5 images. Stop when done and wait for “continue”.

---

**End of Sequence**

When all 15 prompts are complete, the full visual reference set exists.  
All images remain subordinate to the UI Supercharge Spec, the Claim Status components, Layer-0, and the honesty rule.  
Build agents must treat the outputs as reference targets that the code-side P0 implementation is expected to match.
