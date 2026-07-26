# NEXOSxLPIN — Open Development & Forkability

**Benchmark product:** NEXOSxLPIN **1.6.1** at `C:\NEXOSxLPIN`  
**Skill constitution (separate repo):** https://github.com/AdventureNLearn/AOS-v3---LPIN  
**Companion plan:** [`NEXOSxLPIN_Open_Ecosystem_Development_Plan.pdf`](./NEXOSxLPIN_Open_Ecosystem_Development_Plan.pdf)  
**3D + overview:** [`NEXOSxLPIN_Open_Ecosystem_Overview_and_3D_Build_Plan.md`](./NEXOSxLPIN_Open_Ecosystem_Overview_and_3D_Build_Plan.md)

This document answers: *Is this a fresh rewrite?* **No.**  
*What is the public benchmark?* **This workbench.**  
*How do small teams fork it into their expertise?* **Packs + pipelines, not new brands.**

---

## 1. Purpose of the open repo (when published)

NEXOSxLPIN is an **evidence-first civic verification workbench** that small teams and motivated individuals can:

1. **Install** on a local machine (Node LTS + `INSTALL.bat` / `install.sh`)  
2. **Run** desks, score claims, map, SME lenses, Forge/Massing, explicit export  
3. **Fork domain depth** toward their beat (ALPR, BWC, permits, AQ sensors, …)  
4. **Keep** the governance spine intact (tri-state, Layer-0, illustrative 3D only)  
5. **Learn** by walking research pipelines with training desks (not legal advice)

It is **not** a news CMS, not a surveillance product, and not a forensic 3D survey tool.

---

## 2. Two permanent layers

| Layer | Repo / path | Job |
|-------|-------------|-----|
| **A. Skills / constitution** | `AOS-v3---LPIN` | Evidence-gate, Layer-0, civic-intel, GIS, working-doc, OPSEC |
| **B. Runnable workbench** | **This tree** | Desks, UI, ledger, map, SME, Forge, Massing, Export Kit |

**Rule:** Domain depth lives in **data packs** (catalogs, stories, matrices, storyModels, mesh tags).  
**Never** softens gates, invents “soft scores,” or rebrands a fork as a new product that drops honesty labels.

---

## 3. Fresh build vs continue (decision)

| Option | Verdict |
|--------|---------|
| Completely fresh rewrite | **No.** Burns working install kits, 252 SME lenses, 56 congress desks, 100 tops, 3D stack, and smoke gates. |
| Publish 1.6.1 as benchmark + harden docs/gates/3D | **Yes.** This is the enterprise-ready path. |
| Parallel “clean room” demos only | Optional later for marketing sandboxes — not the source of truth. |

**Evidence (local smoke 2026-07-26):**

| Gate | Result |
|------|--------|
| `npm test` | **68/68 pass** |
| `npm run lint` | **0 errors** (warnings remain; see gaps doc) |
| `npm run build` | **pass** |
| `node scripts/smoke-sme-congress.mjs` | **SMOKE OK** · v1.6.1 counts verified |
| Install kit | `INSTALL.bat` / `START.bat` / zip under `releases/` present |
| GitHub repo | Not created yet — prep on disk first |

---

## 4. What a stranger does in one session

```text
1. Install Node.js LTS
2. Clone or unzip → local path (prefer C:\NEXOSxLPIN, not OneDrive)
3. INSTALL.bat  (or npm install && npm run build)
4. START.bat    → http://127.0.0.1:5173
5. Pick a desk → Story → score claims → optional SME → Forge → Massing → Export (if clean)
6. Fork: copy a desk pack / storyModels / matrix → rename topic → re-run quality gates
```

Details: [`INSTALL.md`](./INSTALL.md) · [`RESEARCH_PIPELINES.md`](./RESEARCH_PIPELINES.md) · [`FORKING_A_TOPIC_PACK.md`](./FORKING_A_TOPIC_PACK.md)

---

## 5. Contribution surfaces (open iteration)

| Surface | Change freely | Never change without governance review |
|---------|---------------|----------------------------------------|
| Desk catalogs / stories / sources | Yes | — |
| Design Lab matrices | Yes | — |
| storyModels + mesh family tags | Yes | Present meshes as forensic fact |
| SME lens content (training) | Yes | Soften +1/0/−1 semantics |
| Visual / 3D legibility | Yes | Remove illustrative disclaimer |
| Smoke / tests | Yes | Skip Layer-0 on export |
| Skills (AOS repo) | Via skill PRs | Bypass Layer-0 / psyop scan on Tier-1 |

Cadence (PDF §6.3): **Gate 0 intent → 1 catalog → 2 visual parity → 3 quality → 4 working doc → 5 package.**

---

## 6. Enterprise civic tooling — direction (not a rewrite)

To take this from “strong training hub” to **general public civic tooling** used by small orgs:

| Track | Near-term | Enterprise-grade later |
|-------|-----------|------------------------|
| **Trust** | Tri-state + Layer-0 + WD already | Multi-operator audit trail, signed export manifests, retention policies |
| **Packs** | Manual TS catalogs | Versioned pack schema + import UI + pack registry |
| **Sources** | Bound source ids + training lists | Connector adapters (public APIs only) with citation objects |
| **3D** | Claim-linked illustrative massing | M0–M6 plan (fidelity, Solo panel, contested, export honesty) |
| **Deploy** | Local Vite + zip | Optional offline Electron shell; still **no** forced telemetry |
| **Governance** | In-app + AOS skills | Org playbooks that still forbid narrative laundering |
| **Hardening** | test/lint/build/smoke | CI on every PR; release attestation; SBOM |

Enterprise does **not** mean soften evidence. It means **more operators can reproduce the same honesty**.

---

## 7. Repo layout (forker map)

```text
NEXOSxLPIN/
  INSTALL.bat · START.bat · install.sh · start.sh
  package.json                 # version = product truth
  src/
    components/modules/        # Information…Export Kit
    data/useCases/             # desks, stories, storyModels, congress
    data/sme/ · data/forge/    # lenses, mesh catalog
    lib/forge/                 # objectReasoning, layout, terrain, generators
    lib/ui/claimStatus.ts      # +1/0/−1 visual tokens
    store/platformStore.ts     # session + Layer-0 paths
  scripts/smoke-sme-congress.mjs
  docs/                        # open-dev, pipelines, 3D, install
  releases/                    # local share zips (not for git by default)
```

---

## 8. Non-negotiables (must survive every fork)

1. Evidence-gated claims — no invented award IDs or numbers without sources  
2. Tri-state only: **+1 / 0 / −1** (+ explicit plausible/unverified treatment)  
3. Layer-0 blocks high-stakes export while open **−1** remains  
4. Progressive disclosure (state→city / cascade / advanced Forge after loops)  
5. Explicit export only  
6. **3D is illustrative** — never forensic reconstruction  
7. No secrets/PII in sample packs  
8. Training desks ≠ legal advice; scores = operator hygiene  

---

## 9. Related docs in this package

| Doc | Use |
|-----|-----|
| [`STRENGTHS_AND_SUPPORT_GAPS.md`](./STRENGTHS_AND_SUPPORT_GAPS.md) | Honest map of strong vs thin |
| [`RESEARCH_PIPELINES.md`](./RESEARCH_PIPELINES.md) | Operator pipelines by role |
| [`3D_OBJECT_CLASSIFICATION.md`](./3D_OBJECT_CLASSIFICATION.md) | How stories → mesh importance |
| [`FORKING_A_TOPIC_PACK.md`](./FORKING_A_TOPIC_PACK.md) | How to branch a civic topic |
| [`CONTRIBUTING.md`](../CONTRIBUTING.md) | PR / quality / tone |
| Overview + 3D milestones | [`NEXOSxLPIN_Open_Ecosystem_Overview_and_3D_Build_Plan.md`](./NEXOSxLPIN_Open_Ecosystem_Overview_and_3D_Build_Plan.md) |

---

**America First | Truth-Seeking**  
Prefer primary records over posts. Prefer instruments over headlines.  
Never launder uncertainty into certainty.
