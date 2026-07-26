# NEXOSxLPIN — cold install

**Product:** NEXOSxLPIN **1.7.0**  
**Requires:** Node.js LTS with `node` and `npm` on PATH  

Design reference: [`NEXOSxLPIN_UI_Supercharge_Spec_v1.0.md`](./NEXOSxLPIN_UI_Supercharge_Spec_v1.0.md)  
Doc hub: [`DOC_INDEX.md`](./DOC_INDEX.md)  
PII: [`PII_AND_AGNOSTIC_POLICY.md`](./PII_AND_AGNOSTIC_POLICY.md)

## From installable zip

1. Extract the zip to a **local disk** directory (any path you choose).  
2. Open a terminal in that folder (the **product root**).  
3. Install:

### Windows

```bat
INSTALL.bat
```

Or:

```bat
npm.cmd install
npm.cmd run build
```

4. Start:

```bat
START.bat
```

Opens **http://127.0.0.1:5173/** (see console banner).  
Production preview after build: `npm.cmd run preview`.

### macOS / Linux

```bash
chmod +x install.sh start.sh
./install.sh
./start.sh
```

5. Header: **Web | Mobile** · story switcher (family → desk) · Immersive stage.

## Desktop launchers (Windows)

From product root:

```bat
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\create-desktop-shortcut.ps1
```

Creates `NEXOSxLPIN.lnk` on your Desktop (and a local launcher folder when available).  
The script resolves the product root from its own location — **no fixed username path**.

## Verify

```bat
npm test
npm run lint
npm run build
node scripts\smoke-sme-congress.mjs
```

## Notes

- Zip does **not** require pre-shipped `node_modules` — install on the target machine.  
- Prefer local disk over cloud-sync folders for performance.  
- Sample desks are **training data** — not legal advice; no client PII.  
- Paths in docs are portable (`<product-root>`, relative `docs/…`).

## Counts (1.7.0 packaging / 1.6.1 content core)

| Pack | Count |
|------|------:|
| Investigation desks (tops) | 100 |
| SME lenses / LENS_RULES | 252 |
| Congressional desks | 56 |
| Mesh families | 105 |

Open docs: [`OPEN_DEVELOPMENT.md`](./OPEN_DEVELOPMENT.md) · [`RESEARCH_PIPELINES.md`](./RESEARCH_PIPELINES.md) · [`FORKING_A_TOPIC_PACK.md`](./FORKING_A_TOPIC_PACK.md)
