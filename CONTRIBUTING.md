# Contributing to NEXOSxLPIN

Thanks for helping build an **evidence-first**, forkable civic verification workbench.

## Before you start

1. Read [`docs/OPEN_DEVELOPMENT.md`](docs/OPEN_DEVELOPMENT.md)  
2. Read non-negotiables in the Open Ecosystem plan (`docs/NEXOSxLPIN_Open_Ecosystem_Development_Plan.pdf`)  
3. For 3D changes, read [`docs/3D_OBJECT_CLASSIFICATION.md`](docs/3D_OBJECT_CLASSIFICATION.md)  

## Environment

- Node.js LTS  
- Windows: `INSTALL.bat` / `START.bat`  
- macOS/Linux: `./install.sh` / `./start.sh`  
- Prefer a **local disk** path (not OneDrive) for `node_modules` performance  

## Quality gates (required)

```bash
npm test
npm run lint
npm run build
node scripts/smoke-sme-congress.mjs
```

All must exit 0. Manual fidelity checklist: Open Ecosystem §7 / `docs/FORKING_A_TOPIC_PACK.md`.

## What we merge

- Bug fixes with reproduction  
- Topic packs that keep gates intact  
- 3D legibility improvements that keep the illustrative disclaimer  
- Tests, smoke, docs that raise forkability  
- Accessibility and performance wins  

## What we reject

- Soft scores or “confidence %” replacing +1/0/−1  
- Export that bypasses Layer-0 / open −1  
- 3D presented as forensic/survey truth  
- Secrets, credentials, or personal data in sample packs  
- New product brands that fork governance instead of packs  
- Telemetry without explicit opt-in (default is off / absent)  

## Commit style

```
feat(pack): …
feat(forge): …
feat(massing): …
fix(store): …
docs: …
test: …
```

Link skills from [AOS-v3---LPIN](https://github.com/AdventureNLearn/AOS-v3---LPIN) when relevant.

## 3D / Forge PR checklist

- [ ] Ranking/dedupe changes include unit tests  
- [ ] −1 cannot look like settled +1  
- [ ] +1 without source stays plausible/unverified  
- [ ] Disclaimer retained in UI path touched  
- [ ] No sticky massing loops when conditions change  

## Conduct

Be precise. Prefer primary sources. Do not launder uncertainty into certainty.  
Training content is not legal advice.

**America First | Truth-Seeking**
