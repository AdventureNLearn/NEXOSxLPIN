# Experimental status — NEXOSxLPIN 2.0.0

**Channel:** `experimental`  
**Product:** Local evidence / training desk  
**Not:** Legal advice, medical advice, forensic reconstruction, production OSINT SaaS  

---

## Public message (reuse everywhere)

> Experimental evidence desk — training and research workbench.  
> Claim scores are operator judgments. Maps and 3D are illustrative.  
> Not legal, medical, or forensic software. UI will change.

---

## Maturity matrix

### Stable-ish core

- Story / desk selection  
- Claim ledger scores **+1 / 0 / −1**  
- Share hard-block on open **−1**  
- Layer-0 acknowledge before high-stakes export  

### Beta

- Leaflet map + public basemaps  
- Immersive stage (rails toggleable)  
- Visual Assistant next-step coach  
- Plain-language module names  

### Lab (expect rough edges)

- 3D / Massing / Procedural Forge sketches  
- Full 252 SME lens catalog (no top-3 recommender yet)  
- Scale-accurate auto-zoom inspection  
- Mobile / narrow layouts  
- Map layer panel (educational; pin filter wiring incomplete)  

### Planned (not shipped as product)

- Claim miner (propose claims at score 0)  
- Contradiction detector  
- SME top-K recommender  
- Map layer toggles bound to geometry visibility  
- In-app multi-agent “Deep run”  

---

## In-product labels

| Surface | Label |
|---------|--------|
| Header | amber **EXPERIMENTAL** badge |
| First-run | EXPERIMENTAL + training + illustrative |
| Assistant | EXPERIMENTAL + coach-only disclaimer |
| Status bar | Experimental · training · not legal advice · illustrative |
| Share pack | Experimental export — not certified evidence |
| 3D / Massing | Illustrative contract (existing + reinforced) |
| Immersive footer | Experimental · spine mantra |

Source of truth: `src/lib/product/maturity.ts`

---

## Operator expectations

1. You are the adjudicator.  
2. Treat unfinished chrome as optional.  
3. Prefer Story → Claims → Map → Share.  
4. Open Experts only when a checklist would change a score.  
5. Never present desk output as court or lab proof.

---

*Last aligned with experimental public packaging pass.*
