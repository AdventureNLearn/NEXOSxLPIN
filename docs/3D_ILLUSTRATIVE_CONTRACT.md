# 3D Illustrative Contract (M0)

**Status:** Locked for open development  
**Product:** NEXOSxLPIN ≥ 1.6.1  
**Code anchors:** `objectReasoning.ts` · `generators.ts` · `MassingViewerModule.tsx` · `claimStatus.ts`

---

## 1. Purpose

Define what 3D **is allowed to mean** so forks, exports, and marketing cannot accidentally launder sketches into “proof.”

---

## 2. Hard rules

1. **Illustrative only.** Meshes are stand-ins derived from scored claims and curated story models.  
2. **Never forensic.** No UI copy may say survey-grade, reconstruction of crime scene, certified accuracy, or “proven by the model.”  
3. **Score drives material.** Colors/rims follow verifiability from claim score + sources — never the reverse.  
4. **−1 never looks settled +1.** Disputed objects use distinct treatment (`disputed_unverifiable`).  
5. **+1 without source = plausible/unverified**, not verified.  
6. **Disclaimer is mandatory chrome** in Full and Solo, and on any still/Unity export path.  
7. **Geometry follows the ledger.** When evidence changes, scene regenerates (confirm if operator dirtied placement).  
8. **Curated storyModels outrank weak keyword hits.**  

### Required disclaimer (minimum)

> Illustrative geometry only — not a certified survey, forensic reconstruction, or product design.

Variants may add: “Derived from operator-scored claims.”

---

## 3. Status token alignment

Use a **single source** of claim status tokens (`src/lib/ui/claimStatus.ts` + UI Supercharge Spec).  
Forge accents currently map verifiability → hex in `meshAccentColor` — M2 must bind these to the same token system to prevent drift.

| Score / state | Scene must communicate |
|---------------|------------------------|
| +1 + sources | Supported sketch |
| +1 no sources | Plausible / unverified |
| 0 | Not proven |
| −1 | Disputed / contested locus |
| Narrative language @ non-+1 | Narrative-only risk |

---

## 4. Acceptance (contract tests)

Automated (target):

- [ ] unit: +1 no source → `plausible_unverified`  
- [ ] unit: −1 → `disputed_unverifiable` + contested flags  
- [ ] unit: curated item importance ≥ critical band  
- [ ] unit: disclaimer string present on generated assets/meta  

Manual:

- [ ] Disclaimer visible Full + Solo without hunting  
- [ ] Mixed scores distinguishable  
- [ ] Export blocked or labeled if disclaimer cannot render (M6)  

---

## 5. Forbidden product language

- “AI verified the scene”  
- “Digital twin of the incident”  
- “Court-ready reconstruction” (unless a human surveyor product is separately certified — **out of scope**)  
- Soft confidence percentages replacing tri-state  

---

## 6. Change control

Edits to this contract require a docs PR and update to `docs/WORKING_DOCUMENT.md`.  
Code that weakens rules is a **reject**.

**America First | Truth-Seeking**
