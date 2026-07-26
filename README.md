# NEXOSxLPIN

> **Status: EXPERIMENTAL public build (v2.0.0)**  
> Local evidence desk for **training and research**.  
> **Not** a court, clinic, newsroom CMS, crime lab, or finished production intel platform.  
> Claim scores are **yours**. Maps and 3D are **illustrative**. UI will change.

### Figure out what is true — before the story runs away with itself.

**For:** parents, neighbors, journalists, students, staffers — anyone who wants more **human agency**  
**Channel:** `experimental` · MIT  

---

## What this is (plain English)

The internet is full of confident claims. NEXOSxLPIN is an **experimental desk** where you:

1. **Pick a story** (or a training topic)  
2. **Break it into claims**  
3. Mark each one **Supported**, **Not proven yet**, or **Disputed**  
4. **Put it on a map**  
5. Optionally **sketch** simple 3D stand-ins (never “proof”)  
6. **Share a pack only when the shaky lines are cleaned up**

That is how narratives get checked — and how solid claims get projected with receipts.

---

## Experimental honesty

| Tier | Includes |
|------|----------|
| **Stable-ish core** | Story pick, claim scores, Share gate on open −1, Layer-0 ACK |
| **Beta** | Map, immersive stage, Visual Assistant coach |
| **Lab** | 3D/Forge, Potentials layers, Dan per-item seed, full SME catalog, auto-scale, mobile |
| **Planned** | Claim miner, contradiction assist, SME top-3, layer→pin wiring |

See [`docs/EXPERIMENTAL_STATUS.md`](./docs/EXPERIMENTAL_STATUS.md) and [`docs/OPSEC_PUBLIC_RELEASE.md`](./docs/OPSEC_PUBLIC_RELEASE.md).

---

## Quick start

**Need:** [Node.js LTS](https://nodejs.org/) (free)

### Windows

1. Clone or unzip this folder  
2. Double-click **`INSTALL.bat`**  
3. Double-click **`START.bat`**  
4. Open **http://127.0.0.1:5173**  
5. Optional: `scripts\create-desktop-shortcut.ps1`  

### Mac / Linux

```bash
chmod +x install.sh start.sh
./install.sh
./start.sh
```

---

## Rules of the desk

- **+1** needs a real basis you can point at  
- **0** is honest fog — do not inflate it  
- **−1** blocks careless share until resolved or residual risk is explicit  
- **No private personal data** in sample or shared packs  
- **3D = illustrative** — never forensic  
- **You** remain the adjudicator  

---

## Docs

| Doc | Topic |
|-----|--------|
| [`docs/DOC_INDEX.md`](./docs/DOC_INDEX.md) | Full index |
| [`docs/EXPERIMENTAL_STATUS.md`](./docs/EXPERIMENTAL_STATUS.md) | Maturity matrix |
| [`docs/OPSEC_PUBLIC_RELEASE.md`](./docs/OPSEC_PUBLIC_RELEASE.md) | Public OPSEC |
| [`docs/PII_AND_AGNOSTIC_POLICY.md`](./docs/PII_AND_AGNOSTIC_POLICY.md) | PII policy |
| [`docs/VISUAL_ASSISTANT_INSTRUCTION_SET.md`](./docs/VISUAL_ASSISTANT_INSTRUCTION_SET.md) | Analyst IA |
| [`docs/OPEN_DEVELOPMENT.md`](./docs/OPEN_DEVELOPMENT.md) | Fork model |
| [`docs/COMMIT_PLAN.md`](./docs/COMMIT_PLAN.md) | Release commit plan |

---

## Verify (maintainers)

```bash
npm test
npm run lint
npm run build
node scripts/smoke-sme-congress.mjs
```

---

## License

MIT — see [`LICENSE`](./LICENSE).

**America First | Truth-Seeking** · Prefer primary records · Never launder uncertainty into certainty.
