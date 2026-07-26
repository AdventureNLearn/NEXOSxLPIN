# UX integration checklist — Roadside Surveillance Compliance

**For you + Hermes.** Work top-down. Check boxes as we clear them.

---

## A. Smoke test (you do in browser) — 10 min

After `npm.cmd run dev` + hard refresh:

- [ ] **A1** Desktop icons open only one window per type (no duplicate Analyst tabs)
- [ ] **A2** Ctrl+K palette opens/closes smoothly (ESC + click outside)
- [ ] **A3** Run **Sample Atlanta** — layout tiles + locks; log shows USASpending + Census lines
- [ ] **A4** Design Lab: change **State** → product list updates without freeze
- [ ] **A5** Change **Device type** → products filter; massing updates within ~100ms
- [ ] **A6** Change **Product** → condition list valid; massing pole/arm updates
- [ ] **A7** Change **Installation condition** → deploy color panel transitions; public-infra note visible when prohibited
- [ ] **A8** **Apply** → log appends one MODELER line (history kept); Research gets Deployment note; massing stays
- [ ] **A9** Detail Ladder L0–L4 clicks do **not** hang (no full API re-enrich)
- [ ] **A10** Unlock one tab (titlebar lock) → drag free; re-lock sticks
- [ ] **A11** Format Layout re-tiles without losing audit content
- [ ] **A12** Deflock Live load → pin Audit works; modeler can pick suggested drawing

Report any fail as: `A# · what stuck · screenshot if possible`

---

## B. Already fixed this session (Hermes) — no action

| Item | Fix |
|------|-----|
| Sticky modeler selection loop | Live massing no longer calls `selectDrawing` |
| Ladder re-ran full USASpending/Census | Escalate-only now |
| Apply wiped session log | Appends last 40 lines |
| Product/condition filter desync | Auto-pick valid product; keep condition if allowed |
| Palette open feel | Framer fade/scale; deferred run |
| Taskbar bounce | Tween instead of heavy spring |
| Condition/product panels | AnimatePresence transitions |
| MassingViewer remount key | Clean geometry swap on product change |

---

## C. Needs **your** input / credentials / decision

### C1 — Free API keys (you create; Hermes wires)
- [ ] **SAM.gov** free API key → `samListings.ts`
- [ ] **Congress.gov** free API key → statute spine
- [ ] **CourtListener** free key (optional) → case law pack  
Paste keys only into local `.env` (never commit). Tell Hermes: “keys in `.env` as `SAM_API_KEY=` …”

### C2 — Content / catalog decisions
- [ ] Which **states** beyond GA need full product packs first? (list 3–5)
- [ ] Confirm **device classes** to keep in dropdown (ALPR, CCTV, Traffic_Camera, …)
- [ ] Any **OEM brands** to add/remove from engineering catalog
- [ ] Default install condition preference (curb & gutter vs flush shoulder)

### C3 — UX preferences
- [ ] Auto-lock tabs on audit complete: keep **ON** or default **OFF**?
- [ ] Performance mode default: keep **ON** (lighter 3D) or OFF for prettier massing?
- [ ] Should **Apply** also open Research tab, or Design Lab only?
- [ ] GIS: auto-load Deflock when audit has coords? (Y/N — network cost)

### C4 — Checkpoints
- [ ] Authorize **git init + first commit** (or keep zip-only)
- [ ] Confirm production host for Vite proxies (or Node bridge later)

---

## D. Hermes can do next (no keys) — pick order

- [ ] **D1** Menu strip refresh: group desktop icons (Audit / Design / GIS / System); remove legacy clutter labels
- [ ] **D2** Strip/hide leftover non-RSD demo paths (WTC / X-ingest / LPIN autonomous) behind “Advanced” or delete
- [ ] **D3** Product chips (click brand cards) above dropdown for faster selection
- [ ] **D4** Massing smooth lerp between pole heights (instead of remount flash)
- [ ] **D5** Jurisdiction note: merge Census + state posture into one panel in Research
- [ ] **D6** Grants.gov **bulk** free file loader (no key)
- [ ] **D7** Municipal open-data **pilot** (you pick city portal URL)
- [ ] **D8** NDAA list refresh from public bulk file URL
- [ ] **D9** Clean unused App.tsx dead code (lint warnings)
- [ ] **D10** E2E Playwright smoke for modeler + audit layout

---

## E. Known residual (not blockers)

| Risk | Mitigation |
|------|------------|
| Live APIs need `npm.cmd run dev` proxies | Documented; prod needs same pattern |
| Recipient heuristic → USASpending zero-hits | Valid Evidence; improve after Census |
| No git yet | Zip baseline exists; commit when you say |
| Two Canvas in Design Lab (massing + extra) | Optional merge later for GPU |

---

## Start here (recommended sequence)

1. You: **A1–A12** smoke (report fails)  
2. You: **C2 + C3** preferences (one message)  
3. Hermes: **D1 + D2 + D9** menu/freshness cleanup  
4. You: **C1** keys when ready → Hermes SAM/Congress  
5. You: **C4** git checkpoint  

---

*Dynamic RSD mode. Evidence-gated. In-app first.*
