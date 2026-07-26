# NEXOSxLPIN — build status

**Version:** **1.4.1**  
**Owner:** **Grok Build** (final ownership — not Hermes)  
**Root:** `C:\NEXOSxLPIN`  
**Status doc:** [`docs/GROK_BUILD_OWNERSHIP.md`](./GROK_BUILD_OWNERSHIP.md)

## Live

- SME **252** · Cong **56** · Rules **252**
- Web | Mobile · Export preflight · Analyst commands
- Blueprint PDF · install zip under `releases\`
- Desktop: `NEXOSxLPIN.lnk` → `START.bat`

## Gates

```bat
cd /d C:\NEXOSxLPIN
npm.cmd run test
npm.cmd run lint
npm.cmd run build
node scripts\smoke-sme-congress.mjs
```

## Archive

- Prior Hermes handoffs remain under `docs/HANDOFF_RETURN_TO_HERMES.md` for history only.
