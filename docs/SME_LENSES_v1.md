# SME Lenses v1.2 — Governance + Technical bank

**Product:** NEXOSxLPIN 1.3.0  
**Count:** **180** Subject Matter Expert lenses (**80** civic/governance + **100** technical/reasoning)  
**Principles:** civic-intelligence lineage (tri-state evidence, Layer-0, working document, source hierarchy, explicit export) + technical method/measurement discipline

## What it is

Each lens is a **professional research analyst persona**. Selecting a lens and running analysis scores the active investigation’s claims as **+1 / 0 / −1**, produces owner-ready actions, open questions, preferred sources, and publish gates.

**Adjudicator depth:** every lens id has **specialized rescore rules** in `src/lib/sme/rules.ts`. Technical rules demote physical-impossibility and rhetoric-only +1 without method/measurement tags; engineering lenses demand failure-mode / safety-factor / standard anchors; math/physics demand model assumptions.

**UI (1.2.1):** domain **accordion** (`aria-expanded` / `aria-controls`), **checkbox + label** multi-select, sticky filter + catalog toolbar, **Run selected (N)**, horizontal selected chips + Clear all, batch briefings list, confirm-on-apply scores.

## Domains

### Governance (40) — first in catalog order

| Domain | Focus |
|--------|--------|
| Core Governance | Evidence Gate, Layer-0, Working Doc, Narrative Integrity, Claims Adjudicator, Alignment, Anti-Pattern |
| Public Records | Forensics, FOIA, Minutes, Permits, Construction, Contracts, Correspondence |
| Jurisdiction | Ops, Routing, Multi-J conflict, State playbook, Admin law, Cross-border, Legislative |
| Oversight | Oversight kit, Influence map, Procurement ethics, COI, Whistleblower, Fiscal, Coordinator |
| Sector Regulatory | Environment, Public health, Transport, Land use, Assessor, Emergency, Elections, Privacy |
| Method & Process | Audit ladder, Verification playbook, Source hierarchy, Export clearance |

### Technical (50)

| Domain | Count | Examples |
|--------|------:|----------|
| Mechanical Engineering | 6 | Statics/Dynamics, Machine Design, Thermofluids, HVAC, Vibration, Robotics |
| Civil / Structural | 4 | Structural, Geotech, Transport infra, Water resources |
| Electrical / Electronics | 5 | Power, Electronics, RF, Controls, Semiconductor |
| Chemical / Process | 3 | Process, Reaction, LOPA |
| Aerospace / Defense Tech | 3 | Flight, Propulsion, Avionics cert (tech) |
| Materials / Manufacturing | 4 | Metallurgy, Composites, Mfg process, Quality/Reliability |
| Energy / Nuclear | 3 | Grid, Petroleum subsurface, Nuclear systems |
| Biomedical Systems | 3 | Devices, Biomechanics, Physio modeling |
| Computing / Cyber-Physical | 5 | Architecture, Software systems, CPS, Signal proc, Optics |
| Mathematics / Statistics | 7 | Applied, Pure, Probability, Stats, OR, Comp math, Info theory |
| Theoretical Physics | 5 | Classical, EM, Quantum, Stat mech, Relativity |
| Applied Physical Sciences | 2 | Condensed matter, Fluid/Plasma |

## Operator loop

1. Load a story (header / map pin) — including congressional desks.
2. Open **SME Lenses**.
3. Expand domains; checkbox multi-select; click label for detail.
4. **Run SME analysis** or **Run selected**.
5. **Commit to working doc** and/or **Apply scores to ledger** (confirm).
6. Clear −1 items before Export Kit.

## Analyst commands

```
sme list
sme tech
sme select mech-machine-design
sme run
sme evidence-gate
sme mech-machine-design
```

## Code map

- `src/types/sme.ts` — domains + contracts
- `src/data/sme/lenses.ts` — GOVERNANCE (40) + merge
- `src/data/sme/technicalLenses.ts` — TECHNICAL (50)
- `src/lib/sme/analyze.ts` — deterministic advisor engine
- `src/lib/sme/rules.ts` — per-lens specialized adjudicator rules (all 90 ids)
- `src/lib/sme/analyze.test.ts` / `smoke.test.ts` — vitest
- `src/components/modules/SmeLensesModule.tsx` — accordion + multi-select UI
- Store: `activeSmeLensId`, `selectedSmeLensIds`, `lastSmeBriefing`, `lastSmeBriefingSet`, `runSmeLens`, `runSelectedSmeLenses`
