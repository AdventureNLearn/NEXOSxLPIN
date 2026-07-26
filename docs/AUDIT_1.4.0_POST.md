# Full resource audit — NEXOSxLPIN 1.4.0 (post-share pack)

**Date:** 2026-07-25  
**Root:** C:\NEXOSxLPIN  
**Result:** **PASS** — gates green; placeholders expanded; install zip confirmed; blueprint PDF shipped.

## Inventory audit

| Resource | Status | Notes |
|----------|--------|-------|
| 10 modules | Working | Information guide expanded to full hub |
| SME 252 + rules 252 | Working | assertAllLensesHaveRules [] |
| Cong desks 56 | Working | sources/stories/sims wired |
| Sample pack | Expanded | No “placeholder” −1 copy; 5 evidence + 3 sources |
| Research Hub | Expanded | Filter + bulk rescore on filtered set |
| Export Kit | Working | Preflight checklist |
| Analyst | Working | Full command set |
| Web/Mobile UI | Working | Persisted uiMode |
| Status bar | Expanded | +1/0/−1 counts · UI mode · SME sel |
| Brand / ICO | Working | brand-mark.svg · nexos-lpin-v140.ico |
| Desktop shortcuts | Refreshed | LocalDesktop + user Desktop |
| INSTALL/START | Working | Node LTS path documented |
| Smoke script | Working | 1.4.0 · 252 · 56 |

## Placeholders resolved this pass

1. Sample pack Sensor Delta −1 text rewritten as real demo claim with tags  
2. Sample pack +2 evidence items + 2 sources  
3. Information ProductGuide → full 1.4.0 surface catalog  
4. Research Hub empty filter state + bulk actions  

## Remaining (non-blocking)

- Leaflet marker image path warnings at build (pre-existing)  
- Immersive node graph still lightweight (by design)  
- congress.gov bot 403 on HEAD (URLs retained for browser)

## Gates

```
npm.cmd run test   → 16/16
npm.cmd run lint   → 0
npm.cmd run build  → 0
node scripts/smoke-sme-congress.mjs → SMOKE OK
```

## Deliverables

| Artifact | Path |
|----------|------|
| Blueprint PDF | `docs\NEXOSxLPIN_1.4.0_Platform_Blueprint.pdf` |
| Install zip | `releases\NEXOSxLPIN-1.4.0-*.zip` |
| Launch | `START.bat` / desktop `NEXOSxLPIN.lnk` |
