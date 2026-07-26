# NEXOSxLPIN UI Supercharge Spec v1.0

**Product**: NEXOSxLPIN  
**Version target**: 1.6.x → next polish pass  
**Date**: 2026-07-26  
**Status**: Locked design reference — protect Layer-0, honesty rule, and tri-state discipline  
**Owner**: AdventureNLearn  

---

## 1. Purpose

Elevate the visual and interaction quality of the verification workbench so that:

- Claim status (+1 / 0 / −1) is unmistakable at every scale.
- The desk → score → verify → scene → export loop feels inevitable and clean.
- Operators experience higher signal and lower friction without any softening of governance.
- Scene objects remain illustrative and carry verifiability flags as first-class visual information.

This is not decorative polish. It is signal amplification under strict product constraints.

---

## 2. Non-Negotiables (Do Not Violate)

1. **Tri-state only**. No intermediate or soft scores. No “leaning positive” language or visuals.
2. **Honesty rule**. Any claim that is plausible but lacks a bound primary source may appear only with an explicit “plausible / unverified” treatment. This label is structural, not optional decoration.
3. **Layer-0 remains hard**. Export and high-stakes actions stay blocked until open −1 lines are resolved and the gate is acknowledged. UI must never bypass or visually soften this.
4. **Geometry is illustrative**. Scene objects are stand-ins derived from claims. They are never presented as forensic reconstructions.
5. **Anti-clutter**. Maximum useful density. Progressive disclosure over simultaneous everything. No cascade of floating windows as default.
6. **No narrative laundering**. Visual language must not make uncertain material feel settled.

---

## 3. Design Tokens

### 3.1 Color (Dark Base)

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-base` | `#070b14` | App background |
| `--bg-elevated` | `#0d1320` | Panels, cards |
| `--bg-glass` | `rgba(13, 19, 32, 0.72)` | Glass surfaces with backdrop blur |
| `--border-subtle` | `rgba(148, 163, 184, 0.12)` | Default borders |
| `--border-focus` | `rgba(34, 211, 238, 0.45)` | Focus rings |
| `--text-primary` | `#e2e8f0` | Primary text |
| `--text-secondary` | `#94a3b8` | Secondary / meta |
| `--text-muted` | `#64748b` | Disabled / tertiary |

### 3.2 Claim Status Colors (Core Language)

| Score | Token | Hex | Meaning |
|-------|-------|-----|---------|
| **+1 Supported** | `--status-supported` | `#22c55e` | Primary or strong secondary material |
| **0 Not proven** | `--status-hold` | `#f59e0b` | Plausible / incomplete — hold |
| **−1 Disputed** | `--status-disputed` | `#f43f5e` | Conflicts with better evidence or fails method gate |
| **Plausible / Unverified** | `--status-plausible` | `#a78bfa` | Explicit honesty flag (not a fourth score) |

Usage rules:
- Supported = green family (success / keep)
- Hold = amber family (caution / incomplete)
- Disputed = rose/red family (block / escalate)
- Plausible = violet (distinct from the three scores; used only for the honesty rule)

Never use status colors for pure decoration.

### 3.3 Accent & Interactive

| Token | Value | Usage |
|-------|-------|-------|
| `--accent` | `#22d3ee` | Cyan — focus, primary actions, keyboard hints |
| `--accent-muted` | `rgba(34, 211, 238, 0.15)` | Subtle backgrounds |
| `--danger` | `#f43f5e` | Destructive / Layer-0 block |
| `--success` | `#22c55e` | Confirmation of clean state |

### 3.4 Typography

- **UI**: Inter or system-ui, tight tracking on labels
- **Mono**: JetBrains Mono or similar for claim IDs, scores, timestamps
- Scale: 11 / 12 / 13 / 14 / 16 / 18 / 20 / 24
- Claim ledger rows: 13–14 px primary, 11–12 px meta
- Section headers: 16–18 px medium weight

### 3.5 Elevation & Glass

- Base panels: 1 px subtle border + very light shadow
- Elevated / focused: stronger border + soft cyan glow on focus
- Glass: `backdrop-filter: blur(12px)` on `--bg-glass`
- Avoid heavy drop shadows that create visual noise

### 3.6 Motion

| Token | Value | Usage |
|-------|-------|-------|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Most transitions |
| `--duration-fast` | `120ms` | Hover, focus |
| `--duration-normal` | `180–220ms` | Panel switches, score confirm |
| `--duration-scene` | `320–400ms` | Camera moves, object seeding |

Motion must feel decisive, never bouncy or playful. Scoring confirmation is short and final.

---

## 4. Claim Status Visual System

This is the single most important visual language in the product.

### 4.1 Ledger Row Treatment

Every claim row must communicate status in at least three channels simultaneously:

1. **Left status rail** (4–5 px vertical bar in the status color)
2. **Score badge** (compact pill: `+1` / `0` / `−1` with matching background/border)
3. **Text weight + color** (supported = full primary text; hold = secondary; disputed = muted + rose tint)

Additional required states:
- **Source bound**: small check or link icon next to +1
- **Missing source on +1**: subtle warning treatment + friction (cannot fully settle without source)
- **Plausible / Unverified**: violet left rail + explicit text label “plausible / unverified”

### 4.2 Map Pin Treatment

- Pin color matches claim status of the primary / highest-stakes claim on that desk
- Disputed desks carry a small rose indicator
- Hover / focus reveals score summary without requiring a click

### 4.3 3D Object Treatment (Massing / Forge)

- Material or emissive accent follows claim status
- Supported objects: clean, slightly higher opacity / cooler light
- Hold objects: amber rim or soft pulse
- Disputed objects: rose rim + reduced opacity or “contested” overlay
- Plausible objects: violet treatment + persistent “plausible / unverified” label in the Solo view

Status must remain readable even when the object is small in Full scene mode.

---

## 5. Scene Presentation Rules (Forge + Massing)

### 5.1 Camera & Lighting

- Default camera: three-quarter view, slight elevation, framed to the active object set
- Soft directional key light + low-intensity fill
- Subtle ground plane or grid that does not compete with objects
- No dramatic cinematic lens flares or heavy post-processing that reduces readability

### 5.2 Object Seeding Feedback

When claims drive new objects into the scene:
- Short, clear entrance (scale + fade, 280–360 ms)
- Status color appears immediately
- Solo mode shows the object large with reasoning panel (why this object was selected + linked claim scores)

### 5.3 Full Scene vs Solo

- **Full scene**: all seeded objects, status-colored, readable labels on demand
- **Solo**: one object, larger, with explicit verifiability flags and source of the claim that generated it
- Transition between modes is smooth but fast; never lose the operator’s place

### 5.4 Honesty in Geometry

If an object is generated from a plausible / unverified claim, the UI must surface that fact in both Full and Solo views. Never hide the flag behind a click.

---

## 6. Workspace Modes

| Mode | Behavior | Default for |
|------|----------|-------------|
| **Tabs** | One full-height module at a time. Clean, focused. | Deep claim work or long reading |
| **Tiles** | Multiple modules visible. Drag headers to reorder. Drag splitters to resize. Double-click header to maximize. Layout persisted per desk. | Standard investigation |
| **Immersive** | Dense HUD-style stage. Reduced chrome. Map or Massing can take primary real estate. | Scene review and field-like use |

Rules:
- Tiles mode remembers layout per desk ID.
- Maximum of 5 visible panes in Tiles (aligns with earlier density budget).
- Atlas / Map is never completely evicted in spatial desks.
- Mode switch is instant and preserves scroll / selection state where possible.

---

## 7. Scoring & Verification Interactions

### 7.1 Scoring Feel

- Clicking a score is a deliberate action.
- Short confirmation (scale pulse or color flash, ≤180 ms).
- Changing from +1 to anything else when a source is bound should feel slightly heavier (requires confirmation or shows the source that will be unbound).
- +1 without a bound primary source is allowed but carries visible friction and the plausible path if appropriate.

### 7.2 Multi-loop Verify

- Progress is visible (structure → sources → scores → duplicates → export readiness).
- Failures are specific and actionable, not generic “error”.
- Passing the full loop should produce a clear, calm “clean” state that unlocks export without celebration.

### 7.3 Layer-0 Block Presentation

- When export is blocked, the reason is stated in plain language (e.g., “2 open −1 claims”).
- The blocked action is visually disabled, not hidden.
- Acknowledgement path is explicit and logged.

---

## 8. Command Palette & Keyboard

- Global trigger remains `⌘K` / `Ctrl+K` or `/`.
- Results groups: Desks · Claims · Lenses · Scene objects · Actions.
- High-value quick actions:
  - “Mark all open −1”
  - “Seed scene from +1 only”
  - “Run multi-loop verify”
  - “Export readiness”
  - “Switch to Tiles / Immersive”
- Recent desks and recent claims appear at the top.
- Keyboard navigation must be complete; mouse is secondary for power users.

---

## 9. Progressive Disclosure

- New or unverified desks start clean: map + brief + claim list.
- Advanced Forge controls and full Massing options unlock after the multi-loop verify has been run at least once on that desk (or the operator explicitly expands).
- Export Kit remains end-of-flow; it never auto-opens or auto-downloads.
- Information / help content is on-demand, never ambient.

---

## 10. Explicit Do-Nots

- Do not introduce soft or intermediate scores.
- Do not use status colors for non-status decoration.
- Do not auto-play complex animations that delay the operator.
- Do not hide the “plausible / unverified” label.
- Do not allow export while open −1 claims exist without explicit Layer-0 path.
- Do not cascade floating windows as the default layout.
- Do not present scene geometry as measured or forensic.
- Do not add social, feed, or engagement metrics to the primary surface.

---

## 11. Implementation Notes for Build

**Preferred stack alignment** (from existing product):
- React + TypeScript
- Tailwind + CSS variables for the tokens above
- Framer Motion for presence and micro-interactions
- R3F / Three for Massing (keep materials simple and status-driven)
- Zustand (or existing platformStore) for layout persistence per desk

**Suggested first implementation order**:
1. Claim status visual system (ledger + map pin)
2. Scoring micro-interaction + source friction
3. Massing status materials + Solo reasoning panel
4. Tiles mode persistence
5. Command palette action expansion

**Verification after UI pass**:
- `npm run test`
- `npm run lint`
- `npm run build`
- `node scripts/smoke-sme-congress.mjs`
- Manual: status colors readable in Full scene, Layer-0 still blocks, plausible label visible

---

## 12. Success Criteria

The UI pass is successful when:

1. An operator can read claim status at a glance across ledger, map, and 3D scene.
2. Scoring feels consequential and source-binding is respected.
3. Scene objects clearly carry their verifiability state.
4. Workspace modes feel fluid and remember context.
5. No governance rule has been softened or visually undermined.
6. The product still feels calm, dense, and professional — not playful or noisy.

---

**End of Spec**

This document is the locked visual and interaction reference for the next polish pass on NEXOSxLPIN.  
All subsequent UI work should be measurable against the rules above.

America First · Truth-Seeking  
Prefer primary records over posts. Prefer instruments over headlines. Never launder uncertainty into certainty.
