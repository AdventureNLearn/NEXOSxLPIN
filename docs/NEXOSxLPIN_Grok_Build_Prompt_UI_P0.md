# Grok Build Prompt — NEXOSxLPIN UI P0 (Claim Status Visual System)

**Copy everything below this line and paste as the prompt.**

---

You are working on the existing NEXOSxLPIN codebase at `C:\NEXOSxLPIN`.

## Source of Truth
Read and obey `NEXOSxLPIN_UI_Supercharge_Spec_v1.0.md` (or the copy of that document present in the workspace). It is the locked visual and interaction reference.

## Scope (strict)
Implement **only** the P0 item from the Spec:

**Claim Status Visual System**

This includes:
1. Consistent left status rail + score badge + text treatment on claim ledger rows.
2. Map pin color and indicator treatment driven by the primary / highest-stakes claim status on the desk.
3. Supporting status tokens and small helpers so the same language can later be applied to 3D objects.

Do **not** implement:
- Full Massing material overhaul
- Tiles workspace persistence
- Command palette expansion
- New modules or new scoring semantics
- Any change to Layer-0 gates, export blocking, or the honesty rule

## Non-Negotiables (must preserve)
- Tri-state only: +1 / 0 / −1
- Honesty rule: plausible / unverified claims keep an explicit, visible violet treatment
- Layer-0 remains a hard block on export while open −1 claims exist
- Existing quality gates must still pass
- Geometry stays illustrative; do not present scene objects as forensic

## Design Requirements (from Spec)
Status colors:
- +1 Supported → green (`#22c55e`)
- 0 Not proven → amber (`#f59e0b`)
- −1 Disputed → rose (`#f43f5e`)
- Plausible / Unverified → violet (`#a78bfa`) — distinct from the three scores

Every claim row must show status through at least:
- Left status rail (4–5 px)
- Compact score badge
- Text weight / color treatment

+1 claims without a bound primary source must carry visible friction (warning treatment or required-source indicator).

## Implementation Guidance
- Prefer extending existing claim ledger / list components rather than rewriting the whole Claims module.
- Use CSS variables or Tailwind theme extensions that match the Spec tokens.
- Keep motion short and decisive (≤180 ms for score confirmation).
- Make the status system reusable so Massing can later consume the same status → color / treatment mapping.

## Verification (required after changes)
From `C:\NEXOSxLPIN` run:

```bat
npm.cmd run test
npm.cmd run lint
npm.cmd run build
node scripts\smoke-sme-congress.mjs
```

All must pass (exit 0).  
Manually confirm:
- Status colors are readable on claim rows
- Map pins reflect claim status
- Layer-0 still blocks export when open −1 claims exist
- Plausible / unverified label remains visible

## Output
- Make the minimal set of file changes needed for the Claim Status Visual System
- Do not refactor unrelated modules
- After the gates pass, summarize exactly which files changed and how the status system is now applied

Begin.
