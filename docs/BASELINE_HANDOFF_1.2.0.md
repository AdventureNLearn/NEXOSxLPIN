# Baseline handoff — NEXOSxLPIN 1.2.0

**For:** final Grok Build polish pass → see root **`GROK_BUILD.md`** (canonical execute brief)  
**Root:** `C:\NEXOSxLPIN`  
**Version:** 1.2.0  
**Date:** 2026-07-25  
**Status:** Feature-complete expansion — **Hermes audited green** (test/lint/build/smoke)  
**Share:** `releases\NEXOSxLPIN-1.2.0-20260725-2029.zip`  
**Active job:** `C:\NEXOSxLPIN\GROK_BUILD.md`  
**Return channel:** `docs\HANDOFF_RETURN_TO_HERMES.md`  

## Hermes verification (2026-07-25)

| Gate | Result |
|------|--------|
| `npm.cmd run test` | **14/14** pass |
| `npm.cmd run lint` | **0** warnings / errors |
| `npm.cmd run build` | exit **0** |
| `node scripts/smoke-sme-congress.mjs` | **SMOKE OK** · tech 50 · rules 90 · cong 20 |
| Live URL sample | NIST/SBA/Treasury **200**; congress.gov/gao **403** to bot UA (canonical URLs retained) |

## Verify commands

```bat
cd C:\NEXOSxLPIN
npm.cmd run test
npm.cmd run lint
npm.cmd run build
node scripts\smoke-sme-congress.mjs
```

## Counts gate

| Gate | Expected |
|------|----------|
| `SME_LENSES.length` | **90** |
| Governance | **40** |
| Technical | **50** |
| `assertAllLensesHaveRules()` | **[]** |
| Congressional desks (`family === 'congressional'`) | **20** |
| package.json / VERSION.txt | **1.2.0** |

## File map

### SME bank

| Path | Role |
|------|------|
| `src/types/sme.ts` | SmeDomain + SME_DOMAIN_META (civic + technical) |
| `src/data/sme/lenses.ts` | GOVERNANCE 40 + merge to SME_LENSES |
| `src/data/sme/technicalLenses.ts` | TECHNICAL 50 |
| `src/lib/sme/rules.ts` | LENS_RULES all 90 ids + technical helpers |
| `src/lib/sme/analyze.ts` | Engine |
| `src/lib/sme/analyze.test.ts` | Unit tests incl. technical demotions |
| `src/lib/sme/smoke.test.ts` | Smoke: 90/rules/gov+tech/20 desks |
| `src/components/modules/SmeLensesModule.tsx` | Accordion + checkboxes + multi-run UI |
| `src/store/platformStore.ts` | multi-select + runSelected + briefing set |
| `src/components/modules/AnalystModule.tsx` | sme list/tech/select/run |

### Congressional desks

| Path | Role |
|------|------|
| `src/data/useCases/congressDesks.ts` | 20 UseCaseProfile + full reports |
| `src/data/useCases/congressSources.ts` | Official ActiveSource URLs |
| `src/data/useCases/congressStories.ts` | InvestigationStory layer |
| `src/data/useCases/congressSimulations.ts` | Sim stubs |
| `src/data/useCases/catalog.ts` | Merges desks; FAMILY_LABELS; PRODUCT_VERSION |
| `src/data/useCases/activeSources.ts` | Resolves congress sources |
| `src/data/useCases/stories.ts` | Merges congress stories |
| `src/data/useCases/simulations.ts` | Merges congress sims into pin set |

### Docs / packaging

| Path | Role |
|------|------|
| `docs/SME_LENSES_v1.md` | 90-lens inventory + UI |
| `docs/CONGRESS_DESKS_v1.md` | 20-desk inventory + source hierarchy |
| `docs/BASELINE_HANDOFF_1.2.0.md` | This file |
| `VERSION.txt` | 1.2.0 notes |
| `package.json` | 1.2.0 |
| `scripts/smoke-sme-congress.mjs` | File-level smoke |
| `releases/NEXOSxLPIN-1.2.0-20260725-2029.zip` | Share artifact |

## Product behavior notes

- AOS spine preserved: tri-state +1/0/−1, Layer-0, working doc, **confirm before apply scores**.
- SME multi-select is independent of active detail lens; **Run selected** fills `lastSmeBriefingSet`.
- Congressional desks open **sme-lenses** in default panes; map pins near capital/agency hubs.
- Framing: **training desks**, industry/private effects, not legal advice.

## Known residuals / polish backlog (feed next Build)

1. **Perf / code-split** — main bundle ~1.78 MB; dynamic `import()` for technical + congress packs.
2. **Deeper per-lens physics** — deepen formula-specific demotions per technical id.
3. **Bill-specific URLs** — attach enrolled bill numbers where confident; browser-check congress.gov.
4. **Design matrices** — optional compliance-axis matrices for cong desks.
5. **Story models** — optional dedicated storyModel packs.
6. **Leaflet image warnings** — pre-existing.
7. **UI polish** — accordion keyboard a11y, selected-chip overflow, denser multi-brief panel.
8. **publicApi** — **DO NOT rewrite** (N/A).

## Non-goals (remain)

- Real-time Congress API ingestion
- Legal conclusions / partisan framing
- Secrets or client PII in sample packs

## Handoff checklist for polish agent

- [x] Confirm counts 90 / 20 / rules []
- [ ] Manual UI: accordion, multi-select, Run selected
- [ ] Switch a cong desk; atlas pin; open sources
- [ ] Optional code-split
- [ ] Optional deeper bill links
- [x] Share zip built

## Feed prompt (copy to next Grok Build)

```
You are Grok Build in C:\NEXOSxLPIN on baseline 1.2.0 (see docs/BASELINE_HANDOFF_1.2.0.md).
Do NOT re-implement SME 90 or 20 cong desks from scratch.
Polish only: (1) dynamic import code-split for technicalLenses + congress* modules,
(2) UI a11y on SME accordion/checkboxes, (3) attach stronger bill-specific congress.gov
enrolled links where confident, (4) keep test/lint/build green.
Done when npm.cmd run test && lint && build exit 0 and main JS is split or smaller.
```
