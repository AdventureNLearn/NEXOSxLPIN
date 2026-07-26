# How to use the UI Supercharge kit (P0 → next)

## Files

| File | Role |
|------|------|
| `NEXOSxLPIN_UI_Supercharge_Spec_v1.0.md` | Locked design reference (all polish passes) |
| `NEXOSxLPIN_Grok_Build_Prompt_UI_P0.md` | Build-agent prompt for **this** pass only |
| `NEXOSxLPIN_UI_ClaimStatus_Components.tsx.ref` | Concrete reference patterns (copy/adapt; not compiled) |
| `NEXOSxLPIN_Imagine_15_Prompt_Sequence.md` | Visual reference generation only — **no code changes** |

## Pattern

1. **Paste the Grok Build Prompt** into the build agent — it scopes work to one Spec item and forbids governance changes.
2. **Use the component file as the concrete reference** so status language stays consistent (rail + badge + text + pin hex).
3. **Implement in the real tree** (`src/lib/ui/claimStatus.ts`, `src/components/ui/ClaimStatus.tsx`), not only in docs.
4. **Green gates** before the next Spec item:

```bat
npm.cmd run test
npm.cmd run lint
npm.cmd run build
node scripts\smoke-sme-congress.mjs
```

## P0 delivered (Claim Status Visual System)

- Tokens: CSS vars in `src/index.css` + `STATUS_VISUAL` in `src/lib/ui/claimStatus.ts`
- Components: `ScoreBadge`, `StatusRail`, `ClaimStatusRow` in `src/components/ui/ClaimStatus.tsx`
- Wired: Research Hub ledger, Atlas claims + pin color, Story strip
- Map pins: highest-stakes claim (−1 > 0 > +1)
- Honesty: `plausible / unverified` violet path + +1 missing-source friction
- **Not** in P0: Massing materials, Tiles persistence, command palette

## Next Spec items (same pattern)

1. Write a short Grok Build Prompt scoped to **one** Spec section (e.g. Massing status materials).
2. Optionally add a reference snippet file.
3. Paste prompt → implement → green gates → stop.

America First · Truth-Seeking · Prefer primary records · Never launder uncertainty into certainty.
