# NEXOSxLPIN 1.5.0 — Verification Pipeline

**Root:** `C:\NEXOSxLPIN`  
**Archive:** `releases\archive-1.4.1-*`  
**Ship zip:** `releases\NEXOSxLPIN-1.5.0-*.zip`

## Product doctrine

- **Tools, not media** — primary records, dockets, instruments over narrative.
- **Objective scoring** — tri-state `+1 / 0 / −1` only.
- **Sourced & cited** — every +1 claim should bind to a desk source.
- **No duplicates / no boilerplate** — near-twin and expansion-template packs are rejected and rebuilt.
- **Signal focus** — multi-loop verify before export.

## What changed in 1.5.0

### Tile mode
- **Drag tile headers** to reorder panes (entire tile moves in the layout).
- Splitters still resize.
- ⛶ maximize / Solo map still fullscreen with details.

### Claims
- Desk-specific claim ledger (`src/lib/verify/claimLedger.ts`).
- Boilerplate packs from early generators are auto-replaced.
- Citations open as safe external links.
- **Rebuild sourced claims** + load-time ledger binding on desk open.

### Multi-loop verification
1. Structure  
2. Sources  
3. Scores  
4. Dedupe / boilerplate  
5. Export readiness  

Run from Research Hub → **Multi-loop verify**.

### Grok research agent
- Templates: primary records, claim decomposition, agency docket, industry-effect, counter-evidence, export gate, custom.
- **Ask public Grok** opens/copies a verification prompt (no API key in the browser).
- Prompt also filed as a research note.

### Security hardening
- `safeExternalUrl` / `openSafeExternal` (block javascript:, data:, token leakage).
- CSP + referrer-policy + nosniff on `index.html`.
- Persist merge no longer forces all modules open.

## Operator path

1. Pick a desk.  
2. Claims → review sourced ledger.  
3. Multi-loop verify → clear blocks.  
4. Optional: Grok research agent for primary-hunt template.  
5. Export kit when −1 open lines are resolved.

## Gates

```bat
cd /d C:\NEXOSxLPIN
npm.cmd run test
npm.cmd run lint
npm.cmd run build
node scripts\smoke-sme-congress.mjs
```
