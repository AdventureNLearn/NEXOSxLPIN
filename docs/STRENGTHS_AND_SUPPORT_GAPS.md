# Strengths & Support Gaps — NEXOSxLPIN 1.6.1

**Assessed:** 2026-07-26  
**Method:** Live tree inventory + `npm test` / `lint` / `build` / smoke + Open Ecosystem PDF alignment  
**Scoring:** +1 verified · 0 partial · −1 missing/broken

---

## 1. Executive

| Area | Score | One line |
|------|-------|----------|
| Runnable workbench | **+1** | Install + start path exists; product boots as Vite app |
| Evidence spine | **+1** | Tri-state + Layer-0 + confirm-apply designed into product |
| Domain breadth (training) | **+1** | 100 tops · 56 congress · 252 SME rules |
| Map + scale-accurate massing | **+1** | Terrain-from-map + ENU layout shipped |
| Claim→3D pipeline | **+1** present · **0** investigative legibility | Wired; PDF §5 polish incomplete |
| Open-fork docs | **0 → improving** | This package closes the gap |
| Cold-start stranger UX | **0** | Works if Node-ready; docs version drift (fixed in this pass) |
| Git / public benchmark repo | **−1** until published | Local only |
| Enterprise multi-user | **0** | Single-operator local; no org tenancy yet |
| Pack plugin format | **0** | TS-in-tree packs, not external pack registry |

**Do we need a fresh build?** **No (−1 on that idea).** Benchmark and harden **this** tree.

---

## 2. Where the framework is strong

### 2.1 Architecture

- Clear **two-layer** split: skills constitution vs runnable hub  
- **Domain-swappable** content without new product brands  
- Modules cover full loop: Story → Claims → SME → Rules → Map → Forge → Massing → Export  
- Immersive-forward investigative stage (not window clutter)

### 2.2 Evidence discipline (product law)

- +1 / 0 / −1 only  
- +1 without source → **plausible_unverified** in 3D reasoning  
- −1 → disputed locus / do-not-treat-as-fact flags  
- Viral/narrative language → **narrative_only** when not primary +1  
- Explicit export + Layer-0 ACK pattern  
- MODEL disclaimer string in forge path  

### 2.3 Content depth (training)

| Bank | Count (smoke) |
|------|---------------|
| Stories / tops | 100 (67 kept tops + 33 corpus seeds) |
| Geopolitical | 10 |
| Congressional desks | 56 |
| SME rule keys | 252 |
| Mesh families | 105 |

### 2.4 Engineering gates (live)

- **68** unit tests green (forge, SME, claims, map scale, UI status)  
- Production **build** green  
- **smoke-sme-congress.mjs** asserts version + pack counts + feature flags  

### 2.5 Install kits

- Windows: `INSTALL.bat`, `START.bat`, desktop shortcut script  
- POSIX: `install.sh`, `start.sh`  
- Share zip builder: `scripts/build_share_zip.py`  
- Latest zip: `releases/NEXOSxLPIN-1.6.1-20260725-2249.zip` (includes `dist/` + sources)

---

## 3. Where support is needed (priority)

### P0 — Trust & open-fork readiness

| Gap | Why it matters | Support type |
|-----|----------------|--------------|
| No public git remote yet | Cannot fork/PR | Ops: create repo after doc freeze |
| README/QUICKSTART version drift | Strangers see 1.4.x language | Docs (this pass) |
| No LICENSE / CONTRIBUTING | Blocks clean open use | Legal/docs (this pass) |
| Stale `WORKING_DOCUMENT.md` (Nexus paths) | Confuses maintainers | Docs rewrite (this pass) |
| 3D Solo panel thin | Operators can’t see claim/why without Research Hub | Eng: M3 |
| Near-dupe / generic meshes | Scenes look decorative | Eng: M1 |
| Status hard to read Full-scene | Score not legible at distance | Eng: M2 |
| Export still honesty | Stills can strip disclaimer | Eng: M6 |

### P1 — Investigative power

| Gap | Support type |
|-----|--------------|
| Contested-locus pair view | Eng: M4 |
| Temporal sequence markers | Eng: M4 |
| LOD under many objects | Eng: M5 |
| External pack schema (JSON) vs edit-TS-only | Architecture |
| Live public API connectors (optional, cited) | Adapters + OPSEC review |
| CI (GitHub Actions) on PR | DevOps |

### P2 — Enterprise civic tooling

| Gap | Support type |
|-----|--------------|
| Multi-operator roles / shared board | Product (optional kanban/export exchange) |
| Signed export manifests | Security |
| Accessibility audit | UX |
| Offline/air-gap install guide | Docs + Electron optional |
| Translation / locale | i18n later |
| Telemetry | **Do not add** without opt-in; default off forever preferred |

---

## 4. Quality debt (from live lint)

Lint exits **0** but warnings include:

1. `meshCatalog.ts` — useless escape in `19\"` rack string  
2. `platformStore.ts` — `withAtlas` computed then **unused** (spatial default may not apply)  
3. `MassingViewerModule.tsx` — `origin` object recreated each render (hook churn)  
4. Historical **releases/** trees may still get scanned if ignore fails — keep `releases/` out of git  

These are **fix-forward**, not rewrite signals.

---

## 5. Iteration directions that help most

### A. For individuals & small teams (next 30 days)

1. Ship open docs package (this folder)  
2. M0 3D contract + M1 ranking + M3 Solo panel  
3. One exemplar topic pack end-to-end (e.g. BWC or municipal CCTV) as the fork recipe proof  
4. Publish public repo + issues for M1–M6  

### B. For research kit / training programs

1. Pipeline guides per role (already: `RESEARCH_PIPELINES.md`)  
2. “Day-1 desk” walkthrough video or static screenshots (optional)  
3. Smoke per topic pack  

### C. For enterprise / public agencies (90+ days)

1. Pack registry + schema versioning  
2. Export attestation + retention policy templates  
3. Optional SSO-free multi-seat via shared folder / git — still no cloud lock-in  
4. Hardened offline install  

---

## 6. What “done enough to open GitHub” means

Minimum bar:

- [x] test/lint/build/smoke green on active tree  
- [x] Open Ecosystem PDF + overview in `docs/`  
- [x] Install kits present  
- [ ] LICENSE + CONTRIBUTING + open-dev docs (this pass)  
- [ ] README positions forkability + AOS link  
- [ ] `.gitignore` excludes `releases/`, `.hermes/`, secrets  
- [ ] Known P0 eng issues filed as issues (not silent)  
- [ ] Manual 10-minute operator path walked once on clean machine (human)  

---

## 7. Bottom line

| Question | Answer |
|----------|--------|
| Fresh build? | **No** |
| Benchmark? | **1.6.1 this tree** |
| Strong enough core? | **Yes (+1)** for open training workbench |
| Ready for uncritical “enterprise production claims”? | **0** — need 3D legibility + pack format + multi-op story |
| Right next spend? | Docs + 3D M0–M3 + one public topic pack + then GitHub |

**America First | Truth-Seeking**
