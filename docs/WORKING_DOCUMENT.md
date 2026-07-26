# NEXOSxLPIN — Working Document (platform)

**Product:** NEXOSxLPIN  
**Version:** 1.6.1  
**Root:** `C:\NEXOSxLPIN`  
**Updated:** 2026-07-26  

Session-level decisions may also live in the in-app working document.  
This file is the **repo-level** durable trail for open development.

---

## Locked principles

1. Evidence language is tri-state only: `+1` / `0` / `−1`  
2. Layer-0 pre-filter on high-stakes paths (export, ladder depth, pack replace, session clear, forge publish)  
3. Explicit export only — never auto-download on mount or generate  
4. Agnostic samples — no client PII/secrets; avoid embedding political/religious identity as product chrome  
5. Domain content lives in loadable **packs**, not hard-coded module identity  
6. 3D is **illustrative only** — never forensic / certified survey  
7. Skills constitution remains portable: AOS-v3---LPIN  

---

## Active modules (10)

| Module | Role |
|--------|------|
| Information | Story / desk brief |
| Atlas | Spatial map + pins |
| Design Lab | Condition matrices |
| Research Hub | Claim ledger |
| Analyst | Command surface |
| SME Lenses | 252 specialists |
| Audit Ladder | L0→L4 progressive depth |
| Procedural Forge | Illustrative mesh generate |
| Massing Viewer | Full / Solo 3D |
| Export Kit | Explicit packages + Layer-0 |

---

## Open development decisions (2026-07-26)

| Decision | Score | Note |
|----------|-------|------|
| Benchmark = live 1.6.1 (no fresh rewrite) | **+1** | Smoke/test/build green |
| GitHub publish after doc + smoke freeze | **+1** intent | Repo not created yet |
| Open docs package authored | **+1** | OPEN_DEVELOPMENT, pipelines, 3D classify, fork guide, gaps |
| 3D full PDF §5 legibility | **0** | M0–M6 backlog remains |
| Enterprise multi-tenant | **0** | Future track; not blocking open benchmark |

---

## Smoke evidence (2026-07-26)

```text
npm test  → 14 files / 68 tests passed
npm lint  → 0 errors (warnings remain)
npm build → pass
node scripts/smoke-sme-congress.mjs → SMOKE OK (v1.6.1 counts)
```

---

## Open −1 / follow-ups

| Item | Owner track |
|------|-------------|
| Public GitHub remote absent | Ops — after human cold install walk optional |
| `withAtlas` unused in platformStore | Eng fix |
| Full-scene status rims / Solo panel / export still disclaimer | 3D M2/M3/M6 |
| Pack external schema | Architecture P1 |
| releases/ must stay out of git | .gitignore |

---

## Operator smoke path

1. `START.bat` → Information  
2. Pick desk → Research Hub score claims  
3. Optional SME → confirm apply  
4. Atlas orient  
5. Forge → Massing (disclaimer on)  
6. Clear or document −1 → Export Kit ACK  

Pipelines: `docs/RESEARCH_PIPELINES.md`

---

## Verify

```bat
cd /d C:\NEXOSxLPIN
npm.cmd run test
npm.cmd run lint
npm.cmd run build
node scripts\smoke-sme-congress.mjs
```

**America First | Truth-Seeking**
