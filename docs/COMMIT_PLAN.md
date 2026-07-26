# Commit plan — NEXOSxLPIN experimental public stack

**Goal:** Clean, reviewable history for first public GitHub push.  
**Branch:** `main`  
**Do not force-push** once public collaborators exist.

---

## Current local state (pre-plan)

| Item | Notes |
|------|--------|
| Existing commit | `6e27e7c` — v2.0.0 baseline (plain language, spatial layers, open pack) |
| Dirty tree | Assistant, first-run, CSP, auto-scale, experimental labels, OPSEC |
| Untracked | `src/lib/assist/`, `VisualAssistant`, dogfood script, new docs |
| Must not commit | `dogfood-output/`, `docs/archive-local/`, `releases/`, `.hermes/`, `node_modules/` |

---

## Recommended commit sequence

### Commit 1 — OPSEC hygiene (paths & ignore)

**Message:**
```
chore(opsec): ignore local artifacts; quarantine path-bound builder notes
```

**Include:**
- `.gitignore` → `dogfood-output/`, `docs/archive-local/`
- Move (not delete) absolute-path handoffs into `docs/archive-local/`:
  - `GROK_BUILD.md`, `GROK_BUILD_FINDME.txt`, `LAUNCH_GROK_BUILD.bat` (optional keep portable stub)
  - `docs/GROK_BUILD_*`, `docs/BASELINE_*`, `docs/HANDOFF_*`, `docs/LOCAL_STORAGE_MIGRATION.md`, `docs/AUDIT_*` if path-bound
- Leave portable stubs only if something still references them

**Exclude:** binary PDFs you still want public (Open Ecosystem plan) — keep those in `docs/`.

---

### Commit 2 — Experimental maturity surface

**Message:**
```
feat(product): experimental channel labels across UI and docs
```

**Include:**
- `src/lib/product/maturity.ts`
- `src/App.tsx`, `StatusBar.tsx`, `VisualAssistant.tsx`, `ImmersiveStage.tsx`, `ExportKitModule.tsx`
- `README.md`, `QUICKSTART.txt`, `VERSION.txt`, `index.html` title
- `docs/EXPERIMENTAL_STATUS.md`, `docs/OPSEC_PUBLIC_RELEASE.md`
- `package.json` description field if set
- `src/store` / `catalog` version strings already 2.0.0

---

### Commit 3 — Visual assistant + immersive simplification

**Message:**
```
feat(assist): visual assistant coach and quieter immersive stage
```

**Include:**
- `src/lib/assist/analysisCoach.ts` + test
- `src/components/layout/VisualAssistant.tsx`
- `src/components/layout/ImmersiveStage.tsx`
- `src/components/layout/UseCaseSwitcher.tsx`
- `docs/VISUAL_ASSISTANT_INSTRUCTION_SET.md`

---

### Commit 4 — First-run gate + CSP map durability

**Message:**
```
fix(ux): clean first-run picker; allow public basemap tiles under CSP
```

**Include:**
- `src/App.tsx` (first-run only path — if not fully in commit 2)
- `index.html` CSP
- `public/images/*` leaflet markers if new

---

### Commit 5 — Auto-scale polish

**Message:**
```
fix(map): softer scale gates and plain-language inspect zoom
```

**Include:**
- `src/lib/map/geoScale.ts` + test
- `ScaleAccurateMapStage.tsx`, `MassingViewerModule.tsx`

---

### Commit 6 — Tooling & smoke (optional squash with 2)

**Message:**
```
chore(qa): dogfood script + smoke paths for experimental pack
```

**Include:**
- `scripts/dogfood-full-run.mjs` (no screenshots)
- `scripts/smoke-sme-congress.mjs` updates
- `package.json` / lock if playwright added as devDependency

---

### Commit 7 — Docs index + commit plan

**Message:**
```
docs: experimental status, OPSEC release, commit plan, DOC_INDEX
```

**Include:**
- `docs/DOC_INDEX.md` links
- `docs/COMMIT_PLAN.md` (this file)
- `docs/V2_BUILD_PLAN.md` if touched

---

## Single-squash alternative (fastest public)

If you prefer one public commit after baseline:

```
feat: v2.0.0-experimental — assistant, OPSEC, first-run, public pack
```

Still keep **baseline `6e27e7c` + one squash of the dirty tree** so history is two clear steps.

---

## Pre-commit commands (mandatory)

```bash
cd <product-root>
npm test
npm run lint
npm run build
node scripts/smoke-sme-congress.mjs
# OPSEC greps from docs/OPSEC_PUBLIC_RELEASE.md §4
```

---

## Push sequence (when you authorize)

```bash
# after commits
gh repo create AdventureNLearn/NEXOSxLPIN --public --source=. --remote=origin --push
# or
git remote add origin https://github.com/AdventureNLearn/NEXOSxLPIN.git
git push -u origin main
```

**GitHub settings to set on create:**
- Description = text from `GITHUB_DESCRIPTION` in `maturity.ts`
- Topics: `experimental`, `civic-tech`, `osint-training`, `react`, `typescript`
- LICENSE MIT detected automatically

**Do not upload:** `releases/*.zip` into git — use **Release assets** if sharing install zips.

---

## Post-push

1. Open Issues from P1 list (layer→pin, SME top-3, claim miner, mobile chrome)  
2. Attach optional zip to GitHub Release `v2.0.0-experimental`  
3. Pin README experimental callout  

---

## What we will not rewrite in history

- Authorship of salvage commits  
- Secret-scrubbing requires filter only if a secret actually lands  

---

*Execute commits only when operator says go — this file is the plan, not the push.*
