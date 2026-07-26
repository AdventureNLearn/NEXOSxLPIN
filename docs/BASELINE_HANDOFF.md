# Baseline handoff — Phase A complete

**Root:** `C:\Nexus\dev`  
**Status:** Stable build. Do **not** re-implement `src/lib/publicApi/*` unless build breaks.

## Rules for next agents

1. Prefer **new** modules for Phase B / SAM (`censusGeo.ts`, `samListings.ts`) — do not rewrite USASpending.
2. Build with **`npm.cmd run build`** (PowerShell blocks `npm.ps1` on this host).
3. One agent owns a file at a time — no dual-writes to the same doc/module.
4. `hermes/skills/` are optional accelerators; core audit does not need Hermes Desktop online.
5. Live USASpending requires `npm.cmd run dev` (Vite proxy). Production needs the same proxy pattern.
6. Recipient derivation is heuristic — zero-hits are valid Evidence.

## Phase A inventory (KEEP)

- `src/lib/publicApi/{types,rateLimit,usaspending,evidenceBridge,enrichFunding}.ts`
- `vite.config.ts` → `/api/usaspending`
- `src/App.tsx` `populateFromAudit` enrich
- `src/store/nexusStore.ts` `replaceActiveAudit`
- Dynamic RSD-only log (no DOD)

## Next

- Phase B: Census geocoder + Overpass harden
- and/or SAM.gov listings module
- Git init + first commit recommended before parallel Build sessions

## Verify baseline

```bat
cd C:\Nexus\dev
npm.cmd run build
```
