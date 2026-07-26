# PRODUCT REVIEW — Deploy or Refine

**Product:** NEXOSxLPIN **1.7.0** (Open Public Benchmark packaging)  
**Review type:** Complete local system before end-to-end public git remote  
**Decision required from owner:** **Deploy** (create public repo + push) or **Refine** (listed deltas first)

---

## 1. Executive recommendation

| Question | Answer |
|----------|--------|
| Fresh rewrite? | **No** — continue this workbench |
| Local installable package ready? | **Yes (+1)** after gates in this review |
| Public high-stakes resource posture? | **Yes (+1)** PII policy + agnostic paths + LLM contract |
| 3D fully investigative per Open Ecosystem §5? | **Partial (0)** — wired + contracted; Solo/rims/export polish remain |
| GitHub publish now? | **Deploy OK** for benchmark **if** you accept 3D polish as public backlog; else **Refine** M2/M3 first |

**Hermes standing call:** **Deploy-with-backlog** is coherent. **Refine-first** if you want first public impression to include Solo reasoning panel.

---

## 2. What “complete package” now contains

### 2.1 Runnable workbench + dashboard (single install)

- Immersive investigative shell (Web/Mobile toggle)
- 10 modules: Information · Atlas · Design Lab · Research Hub · Analyst · SME · Audit Ladder · Forge · Massing · Export
- Intelligent switching: family→desk accordion, Massing/Map/Guide header actions, sidebar modules
- Claim status P0 system
- Scale-accurate map/massing path
- Layer-0 export posture
- 252 SME · 56 congress · 100 story tops · 105 mesh families

### 2.2 Open development docs (portable, in-repo, in-app)

| Artifact | Role |
|----------|------|
| `docs/DOC_INDEX.md` | Hub |
| `docs/OPEN_DEVELOPMENT.md` | Fork model |
| `docs/RESEARCH_PIPELINES.md` | Operator pipelines |
| `docs/FORKING_A_TOPIC_PACK.md` | Add use cases at full fidelity |
| `docs/PII_AND_AGNOSTIC_POLICY.md` | Selector + PII law |
| `docs/LLM_REASONING_FRAMEWORK.md` | Any LLM adopts hygiene without breaking host or repo |
| `docs/3D_*` | Classification + illustrative contract |
| `docs/skills-reference/INDEX.md` | Portable skill roles (civic/core; no exploit pack) |
| `docs/FIDELITY_AUDIT.md` | This release audit |
| `docs/PRODUCT_REVIEW.md` | This decision doc |
| Information module | In-app guide sections mirror the above |

### 2.3 Install kit

- `INSTALL.bat` / `START.bat` / `install.sh` / `start.sh`
- Portable desktop shortcut script
- Share zip via `python scripts/build_share_zip.py` (portable ROOT)
- MIT LICENSE · CONTRIBUTING

---

## 3. PII / agnostic security

| Control | Status |
|---------|--------|
| Selectors high-level until family expanded / desk chosen | **+1** |
| Public docs use product-root language, not personal homes | **+1** |
| Shortcut & zip scripts path-portable | **+1** |
| No secrets pattern in gitignore | **+1** |
| Training content = public-sector / fictionalized framing | **+1** |
| Operator session data still local responsibility on export | Documented |

---

## 4. LLM reference use (without fidelity loss)

`docs/LLM_REASONING_FRAMEWORK.md` defines:

- What to adopt (tri-state, Layer-0, progressive disclosure, illustrative 3D)
- What not to override (host tools; repo gates)
- Optional system prompt fragment
- Fidelity tests for agent output

Skills constitution remains companion abstracts under `docs/skills-reference/` — workbench does **not** embed offensive operator skills.

---

## 5. Fidelity audit summary

See [`FIDELITY_AUDIT.md`](./FIDELITY_AUDIT.md).

| Rollup | Score |
|--------|-------|
| Local open package | **+1** |
| Automated gates | **+1** |
| 3D full §5 legibility | **0** |
| Public remote | **−1** until Deploy action |

---

## 6. Strengths (keep)

1. Evidence spine is real product law, not poster copy  
2. Content depth sufficient for training and fork demos  
3. Install path is one-shot for Node-ready machines  
4. Open docs + in-app guide now aligned  
5. 3D pipeline is claim-linked with honesty flags in code  
6. Companion skill model keeps governance portable  

---

## 7. Support needed (backlog — does not require rewrite)

### P0 public backlog (post-Deploy or pre-Deploy Refine)

1. **M2** Full-scene status rims/pips  
2. **M3** Solo reasoning panel (claim + sources + why + disclaimer)  
3. **M6** Export still disclaimer burn-in  
4. Optional browser E2E smoke  

### P1

5. M1 near-dupe cull / ranking floor  
6. M4 contested pair view  
7. External JSON pack schema  
8. CI workflow on public remote  

### P2 enterprise

9. Multi-operator audit trail  
10. Signed export manifests  
11. Offline shell (optional)

---

## 8. Artifacts produced this pass

| Artifact | Location |
|----------|----------|
| Open docs suite | `docs/*` listed above |
| Progressive UseCaseSwitcher | `src/components/layout/UseCaseSwitcher.tsx` |
| Information guide 1.7 | `src/components/modules/InformationModule.tsx` |
| Portable shortcuts | `scripts/create-desktop-shortcut.ps1` |
| Portable zip builder | `scripts/build_share_zip.py` |
| Smoke 1.7 + open docs checks | `scripts/smoke-sme-congress.mjs` |
| Version | `package.json` **1.7.0** |
| Share zip | `releases/NEXOSxLPIN-1.7.0-*.zip` (after build script) |
| Desktop shortcuts | User Desktop + local launcher folder |

---

## 9. Decision matrix

### Deploy (create public repo now)

Choose if you accept:

- Public benchmark = current gates + honest backlog issues for M2/M3/M6  
- First clones get full install + docs + training depth immediately  

**Actions after Deploy:**

1. `git init` + initial commit (respect `.gitignore`; no `releases/` blobs required in git)  
2. `gh repo create … --public`  
3. Open issues from 3D milestone titles  
4. Attach latest zip as Release asset  

### Refine first

Choose if you require:

- Solo panel + Full-scene status legibility before any public clone  
- Stricter scrub of maintainer-only path docs from the tree  

**Actions:** Grok Build M2+M3 → re-audit → then Deploy.

---

## 10. Owner checklist before clicking Deploy

- [ ] Walk START → family expand → one desk → score → SME confirm → Massing disclaimer visible  
- [ ] Confirm desktop shortcut launches  
- [ ] Skim `docs/PII_AND_AGNOSTIC_POLICY.md` and `docs/LLM_REASONING_FRAMEWORK.md`  
- [ ] Accept backlog items in §7 as public issues  
- [ ] Reply **Deploy** or **Refine** with preference on M2/M3 timing  

---

## 11. Evidence scores (review close)

| Claim | Score |
|-------|-------|
| Single installable workbench+dashboard exists | **+1** |
| Full fidelity automated gates green | **+1** (run log this session) |
| PII/agnostic packaging adequate for public resource | **+1** |
| Use-case fork instructions complete | **+1** |
| LLM can adopt framework without fidelity loss | **+1** |
| 3D meets full investigative legibility | **0** |
| Ready for uncritical “enterprise production” marketing | **0** |
| Fresh rebuild required | **−1** (false) |

---

**America First | Truth-Seeking**  
Prefer primary records over posts. Prefer instruments over headlines.  
Never launder uncertainty into certainty.  
3D is illustrative — derived from scored claims — not forensic fact.

**Awaiting owner decision: Deploy or Refine.**
