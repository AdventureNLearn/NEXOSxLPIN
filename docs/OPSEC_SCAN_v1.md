# NEXOSxLPIN — OPSEC scan (v1.0.0)

**Date:** 2026-07-25  
**Root:** `C:\NEXOSxLPIN`  
**Separation:** Product moved off `C:\Nexus\*` and OneDrive; primary workbench is local disk only.

## Findings & mitigations

| Area | Finding | Mitigation |
|------|---------|------------|
| Path coupling | Prior builds lived under `C:\Nexus\…` and OneDrive Desktop | New root `C:\NEXOSxLPIN`; shortcuts target this path |
| Operator identity | Scripts referenced user Desktop/OneDrive | Shortcut helper prefers `C:\Users\Public\Desktop` then local Desktop; no hard-coded usernames in product UI |
| Secrets | No API keys in app source | publicApi remains optional; no keys committed |
| Sample stories | Public-event training narratives | Labeled as simulation/training — not operational case files |
| node_modules | Not shipped in clean clone | `npm install` on first run |
| Legacy domain UI | Excluded from clone | `src/legacy` not in NEXOSxLPIN tree |
| Hermes/Grok launcher scripts | Operator-tooling paths | Omitted from NEXOSxLPIN clone |
| PII | No personal emails/phones in product src | Verified by path scan; keep case PII out of packs |

## Residual risks

- Demo stories name real public events (Berlin, fires, etc.) — intentional training corpus; replace with private packs for client work  
- Third-party streams (music, map tiles) leave the machine when used  
- Browser localStorage keys are namespaced (`nexos-lpin-v1`) — clear site data when handing a shared laptop  

## Operator checklist

- [ ] Launch only from `C:\NEXOSxLPIN`  
- [ ] Do not copy client PII into `src/data`  
- [ ] Rebuild zip from this root for sharing  
- [ ] Prefer Dense UI on 14" laptops  
