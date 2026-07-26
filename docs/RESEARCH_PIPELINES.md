# Research Pipelines — Operator Instruction Guides

**Product:** NEXOSxLPIN 1.6.1  
**Audience:** Independent researchers, civic tech volunteers, student teams, oversight staff in training  
**Spine:** Score claims honestly → place in space → illustrate without laundering → export only when clean  

Training desks are **not legal advice**. Scores are **operator hygiene**, not judicial findings.

---

## Universal loop (every pipeline)

```text
Pick desk
  → Information (story / stakes)
  → Research Hub (claims +1/0/−1 + sources)
  → optional SME Lenses (run → confirm apply)
  → Design Lab (conditions / what-must-be-true)
  → Atlas (pins / orientation)
  → Procedural Forge (seed illustrative objects)
  → Massing Viewer (Full / Solo — read status)
  → Audit Ladder (only as deep as evidence supports)
  → Export Kit (Layer-0 ACK; blocked if open −1)
```

**Honesty rule:** Prefer primary records and instruments over posts and headlines.  
If you cannot defend a +1, leave it at 0.

---

## Pipeline A — Viral claim triage (citizen / journalist)

**Goal:** Stop a circulating claim from becoming “fact” without sources.

| Step | Module | Action |
|------|--------|--------|
| A1 | Header desk pick | Choose a claim-heavy story or training desk |
| A2 | Information | Read lede + stakes; note what would change your mind |
| A3 | Research Hub | Split into atomic claims; score each |
| A4 | Research Hub | Bind sources or mark “none” — **+1 without source is not verified** |
| A5 | SME Lenses | Multi-select 1–3 method/oversight lenses → Run → **Confirm apply** |
| A6 | Audit Ladder | Stay L0–L1 until primary appears |
| A7 | Forge / Massing | Optional — only after scores exist; treat 3D as sketch |
| A8 | Export Kit | Export brief only if no open −1 (or document residual −1 in WD) |

**Done when:** Every claim has score + rationale; viral language claims are 0 or −1 unless primary attached.

---

## Pipeline B — Public-record / FOIA trail

**Goal:** Build a source-backed ledger for permits, contracts, minutes, awards.

| Step | Module | Action |
|------|--------|--------|
| B1 | Desk | Use public-record oriented desk or fork pack |
| B2 | Research Hub | One claim per document assertion (date, $ amount, party) |
| B3 | Sources | Bind document id / URL / agency name (no secrets) |
| B4 | SME | public-records + jurisdiction + oversight lenses |
| B5 | Design Lab | Capture retention / disclosure conditions as matrices |
| B6 | Atlas | Pin facilities or corridors only with public coords |
| B7 | Export | Oversight kit when Layer-0 clear |

**Done when:** Dollar figures and award IDs only appear on +1 with bound source.

---

## Pipeline C — Site / scene verify (spatial)

**Goal:** Compare statements to place without inventing geometry.

| Step | Module | Action |
|------|--------|--------|
| C1 | Atlas | Orient to desk pin; note basemap honesty |
| C2 | Research Hub | Claims about location, sightlines, device placement |
| C3 | Design Lab | Installation conditions / conflicts list |
| C4 | Forge | Generate stand-ins from claims + storyModels |
| C5 | Massing | Full scene for relations; Solo for one object’s claim bind |
| C6 | Check | Disclaimer visible; no “survey accurate” language in notes |

**Done when:** Spatial claims are scored separately from device capability claims; 3D remains illustrative.

---

## Pipeline D — Congressional / industry oversight training

**Goal:** Practice multi-domain SME on industry × agency themes (56 desks).

| Step | Module | Action |
|------|--------|--------|
| D1 | Pick `cong-*` desk | Read industry + agency framing |
| D2 | Research Hub | Score seed claims; mark narrative risk |
| D3 | SME | Multi-select domain + method lenses (confirm apply) |
| D4 | Forge/Massing | Expect docket / foundry / contested locus patterns from reasoning |
| D5 | Export | Training packet only; label as simulation |

**Done when:** Operator can explain *why* a mesh appeared (keyword, curated pack, or SME overlap) — not “the AI decided.”

---

## Pipeline E — Topic fork (new civic domain)

**Goal:** Specialize the workbench (BWC, CCTV, UAS, AQ, …) without forking governance.

Follow [`FORKING_A_TOPIC_PACK.md`](./FORKING_A_TOPIC_PACK.md) Gates 0–5.

Minimal proof:

1. New/renamed desk loads  
2. Claims scoreable  
3. ≥1 evidentiary object with non-empty `reasoning[]`  
4. test/lint/build/smoke exit 0  
5. Export path still Layer-0 gated  

---

## Pipeline F — Adversarial / contested narrative

**Goal:** Hold −1 and 0 without collapsing to a single story.

| Step | Action |
|------|--------|
| F1 | Enter competing claims as separate ledger rows |
| F2 | Score −1 only with contradiction evidence; else 0 |
| F3 | Massing: look for disputed locus object (`mf-env-smoke-locus` path) |
| F4 | Do **not** export a “resolved” kit while −1 open |
| F5 | Working document: log residual uncertainty |

---

## Pipeline G — Quality gate / release check (maintainer)

```bat
cd /d C:\NEXOSxLPIN
npm.cmd run test
npm.cmd run lint
npm.cmd run build
node scripts\smoke-sme-congress.mjs
```

Manual:

- [ ] State→City (or equivalent) unlock behaves  
- [ ] Design Lab cascade does not freeze / sticky massing loop  
- [ ] Export is button-only  
- [ ] Claim colors consistent ledger ↔ map ↔ scene  
- [ ] 3D disclaimer present Full + Solo  
- [ ] No secrets/PII in sample packs  

Zip (after build):

```bat
python scripts\build_share_zip.py
```

---

## Scoring quick reference

| Score | Meaning | 3D verifiability (typical) |
|-------|---------|----------------------------|
| **+1** | Supported by bound primary/strong secondary | `verified_supported` if sources; else `plausible_unverified` |
| **0** | Not proven / incomplete | `plausible_unverified` or `narrative_only` |
| **−1** | Disputed / contradicted | `disputed_unverifiable` — never looks “settled” |

---

## Module cheat sheet

| ModuleId | When to open |
|----------|----------------|
| `information` | Always first on new desk |
| `research-hub` | Every pipeline |
| `sme-lenses` | Multi-domain or method stress |
| `design-lab` | Conditions / constraints |
| `atlas` | Spatial claims |
| `procedural-forge` | Seed meshes |
| `massing-viewer` | Read scene / Solo reasoning (improve under M3) |
| `audit-ladder` | Depth only as earned |
| `export-kit` | Last; explicit |
| `analyst` | Power users / commands |

---

**America First | Truth-Seeking**
