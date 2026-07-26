# Local storage migration — OneDrive → C:

## Goal

- **Workbenches and heavy code** live on **local disk** (`C:\`) for speed and OPSEC.
- **OneDrive** holds only what you explicitly want synced (docs to share, photos, vault).

## Layout after migration

```
C:\NEXOSxLPIN\          ← PRIMARY app (do all product work here)
C:\LocalDesktop\        ← Local shortcuts (not cloud)
C:\WorkLocal\           ← Optional other local projects
C:\Nexus\               ← Lineage/archive (read-only history)
C:\Nexus\archive\       ← Snapshots
C:\Nexus\releases\      ← Older zips (optional cleanup)

OneDrive\
  Desktop\              ← Keep light: a few personal shortcuts only
  Documents\            ← Personal / shared docs (not node_modules)
  Pictures\             ← Personal media OK
```

## What we migrated / fixed

1. Product root already on **`C:\NEXOSxLPIN`** (not under OneDrive).
2. **LocalDesktop** created with NEXOSxLPIN + Grok Build + Hermes launchers.
3. Install **zip** written under `C:\NEXOSxLPIN\releases\`.
4. OneDrive Desktop may still *display* a NEXOSxLPIN shortcut (Windows Desktop is often redirected to OneDrive) — target remains `C:\NEXOSxLPIN`. Prefer launching from **`C:\LocalDesktop`** or pin that folder to Quick Access.

## Recommended OneDrive hygiene (manual, 2 minutes)

1. OneDrive settings → **Sync and backup** → turn **off** “Desktop” backup if you want a true local Desktop later (Windows may recreate a local Desktop after sign-out of folder backup).
2. Do **not** place `node_modules`, `dist`, or full app trees inside OneDrive.
3. Exclude (if offered): any accidental sync of `C:\NEXOSxLPIN` — it should never live under OneDrive.

## Safety / speed tips applied

- App + dependencies on **C:** (faster than cloud placeholders).
- Prefer **Dense** UI density on laptops.
- `npm` cache stays under user profile (normal); project files stay local.
- No force-delete of OneDrive personal data — only workbench relocation.

## Rollback

- Old Nexus trees remain under `C:\Nexus\` until you delete them.
- OneDrive files untouched unless you move them yourself.
