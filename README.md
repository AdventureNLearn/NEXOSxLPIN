# NEXOSxLPIN

### Figure out what is true — before the story runs away with itself.

**Version 2.0.0** · Evidence-first civic truth desk  
**For:** parents, neighbors, journalists, students, staffers — anyone who wants more **human agency**  
**Not:** a social feed, a courtroom, or a forensic crime lab  

---

## What this is (plain English)

The internet is full of confident claims. NEXOSxLPIN is a **desk** where you:

1. **Pick a story** (or a training topic)  
2. **Break it into claims**  
3. Mark each one **Supported**, **Not proven yet**, or **Disputed**  
4. **Put it on a map**  
5. Optionally **sketch** simple 3D stand-ins (never “proof”)  
6. **Share a pack only when the shaky lines are cleaned up**

That is how narratives get checked — and how solid claims get projected with receipts.

---

## Quick start (anyone with a computer)

**Need:** [Node.js LTS](https://nodejs.org/) (free)

### Windows

1. Unzip or clone this folder anywhere on your computer  
2. Double-click **`INSTALL.bat`**  
3. Double-click **`START.bat`**  
4. Browser opens to **http://127.0.0.1:5173**  
5. Optional: run `scripts\create-desktop-shortcut.ps1` for a desktop icon  

### Mac / Linux

```bash
chmod +x install.sh start.sh
./install.sh
./start.sh
```

---

## The five buttons that matter

| Button | What it means |
|--------|----------------|
| **Story** | Read what happened and why it matters |
| **Claims** | Score each sentence: Supported / Not proven / Disputed |
| **Map** | See the place; flip layers (Where, Claims, Sources, Sketch) |
| **3D** | Optional sketch models — **illustrative only** |
| **Share** | Download a pack **only when you choose** (blocked while Disputed remains) |

Experts, Rules, and Depth are optional power tools. Most people live in Story → Claims → Map → Share.

---

## Map layers (spatial, human-readable)

Inspired by layered atlases and hierarchical site maps (public patterns, civic rewrite):

- **Where** — the place  
- **Levels** — world → this place → scenes → sketch objects  
- **Claims** — what is being said  
- **Sources** — what can be cited  
- **Sketch models** — drawings from scores, not court exhibits  

**Before you trust a pin:** (1) what was claimed → (2) what record exists → (3) your score.

---

## Rules we will not bend

- Only three scores: **+1 / 0 / −1**  
- No automatic downloads  
- 3D is **never** sold as forensic truth  
- Sample packs stay free of private personal data  
- Training desks are **not legal advice**  

---

## For builders & LLMs

| Doc | Why |
|-----|-----|
| [`docs/DOC_INDEX.md`](./docs/DOC_INDEX.md) | Full doc hub |
| [`docs/V2_BUILD_PLAN.md`](./docs/V2_BUILD_PLAN.md) | v2 plan + spatial integration notes |
| [`docs/FORKING_A_TOPIC_PACK.md`](./docs/FORKING_A_TOPIC_PACK.md) | Add a new topic without breaking honesty |
| [`docs/LLM_REASONING_FRAMEWORK.md`](./docs/LLM_REASONING_FRAMEWORK.md) | How any AI should use this framework |
| [`docs/PII_AND_AGNOSTIC_POLICY.md`](./docs/PII_AND_AGNOSTIC_POLICY.md) | Privacy & public-safe content |
| [`docs/3D_OBJECT_CLASSIFICATION.md`](./docs/3D_OBJECT_CLASSIFICATION.md) | How sketches are chosen from claims |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | How to help |

Skills constitution (portable companion): see `docs/skills-reference/`.

---

## Verify (maintainers)

```bash
npm test
npm run lint
npm run build
node scripts/smoke-sme-congress.mjs
```

All must pass with **zero errors** before release commits.

---

## License

MIT — see [`LICENSE`](./LICENSE).  
Training content is educational only.

---

**America First · Truth-Seeking**  
Primary records over posts. Instruments over headlines.  
Never launder uncertainty into certainty.  
Your judgment stays in the loop — that is the point.
