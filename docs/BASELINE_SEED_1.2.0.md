# Baseline seed — NEXOSxLPIN 1.2.0 expansion (Hermes orchestrated)

**Status:** Implementation delegated to Grok Build via brief  
`.hermes/briefs/expand-sme50-congress20-1.2.0.md`

## Product intent
- Full reasoning specialist bank: **40 civic/governance + 50 technical** = **90 SME lenses**
- UI: accordion domains, checkbox multi-select, polished SME module
- Content: **20** high-stakes congressional/industry-effect training desks
- Production gates: test + lint + build + smoke
- Output baseline: `docs/BASELINE_HANDOFF_1.2.0.md` for final polish agent

## Verify after Build
```bat
cd C:\NEXOSxLPIN
npm.cmd run test
npm.cmd run lint
npm.cmd run build
```

## Counts gate
- SME_LENSES.length === 90
- assertAllLensesHaveRules().length === 0
- USE_CASE_CATALOG filter family congressional|oversight-congress === 20
- No TS errors

## Non-goals this pass
- Real-time Congress API ingestion
- Legal conclusions / partisan framing
- Rewriting unrelated Nexus publicApi modules
