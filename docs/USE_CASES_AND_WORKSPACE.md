# Nexus — Cross-Industry Utility & Citizen Journalism Positioning

**Product:** Nexus v3 agnostic intelligence platform  
**Audience focus:** Citizen journalists and independent researchers  
**Core job:** Separate **signal** from **noise** — classify claims as **+1 / 0 / −1**, hold conjecture as 0, escalate contradictions as −1, package only what survives Layer-0.

This document is strategy. Implementation lives in the Grok Build brief:
`C:\Nexus\dev\.hermes\briefs\GROK_BUILD_USECASE_WORKSPACE.md`

---

## 1. What Nexus is good for (utility spine)

Nexus is not a newsroom CMS and not a single-issue app. It is a **portable evidence workbench**:

| Capability | Journalistic value |
|------------|-------------------|
| Tri-state scoring (+1 / 0 / −1) | Forces claim hygiene; kills vibes-as-fact |
| Layer-0 gate | Blocks export of unresolved contradictions |
| Working document | Replicable trail of decisions and rewrites |
| Research Hub | Structured notes with mandatory scores |
| Audit Ladder L0→L4 | Progressive depth — don’t dump everything at once |
| Atlas (map + graph) | Place claims in space and process networks |
| Design Lab | Model constraints / conditions without narrative spin |
| Analyst commands | Fast triage ops without UI thrash |
| Export Kit (explicit) | Shareable packs only when operator intends |
| Data packs / use-case profiles | Same shell, different domains — no fork per beat |

**Signal-through-noise loop (canonical):**
1. Capture claim or question  
2. Score material (+1 primary, 0 incomplete/contested, −1 contradicted)  
3. Place on map/graph if spatial or relational  
4. Apply constraints in Design Lab when “what would have to be true” matters  
5. Climb Audit Ladder only as evidence supports  
6. ACK Layer-0 → export kit for peers/editors/public

---

## 2. Cross-industry / cross-beat use cases (displayable, not hardcoded identity)

Use cases are **profiles** (data), never baked brand or place identity in core UI.

### Tier A — Citizen journalism (default showcase set)

| Use-case ID | Label (generic) | What they do in Nexus | Primary panes |
|-------------|-----------------|----------------------|---------------|
| `cj-claim-triage` | Claim triage desk | Score a viral claim; split fact / inference / conjecture | Research, Audit Ladder, Analyst |
| `cj-public-record` | Public record trail | Index sources, primary vs secondary, FOIA gap list | Research, Export Kit, WD |
| `cj-site-verify` | Site / scene verify | Pin locations, compare statements to map geometry | **Atlas**, Research, Design Lab |
| `cj-network-map` | Actor / flow map | Graph money, data, or influence hops with scores | Atlas (graph), Research |
| `cj-constraint-test` | “Could this even work?” | Condition matrices for siting, process, or policy constraints | **Design Lab**, Massing/Forge optional |
| `cj-package-brief` | Publishable brief | Layer-0 cleared export for peers | Export Kit, WD, Ladder L3–L4 |

### Tier B — Same shell, other domains (swap pack, same layout rules)

| Domain family | Example pack themes (generic) | Atlas | Research | Design |
|---------------|-------------------------------|-------|----------|--------|
| Infrastructure / siting | Corridor nodes, clearance rules | Heavy | Medium | Heavy |
| Regulatory / compliance | Control matrices, gap analysis | Light | Heavy | Medium |
| Supply / distribution | Hop graphs, disclosure gaps | Graph-heavy | Heavy | Light |
| Environmental / land use | Spatial layers + condition rules | Heavy | Medium | Heavy |
| Corporate / contracting | Award trails, entity graphs | Medium | Heavy | Light |
| Science / technical claims | Ladder depth, component models | Light | Heavy | Forge optional |
| Civic process / meetings | Timeline + source ledger | Light | Heavy | Light |

**Rule:** Domain depth lives in the **pack + use-case profile**, not new top-level product brands.

---

## 3. How to show many use cases without clutter

### Principle: one active profile, many available

- **Use Case Switcher** (single control in header or Information): picks a profile.
- Profile sets: default open panes, layout preset, sample evidence, suggested workflow, pack binding.
- **Not** nine equal tabs fighting for attention.
- **Not** a marketing carousel inside every module.

### Information architecture

```
Sidebar (modules)     → always available, never duplicates windows
Use Case strip        → 1 active profile; others one click away
Workspace (tiled)     → 3–5 panes max visible; rest docked/available
Focus mode            → single module full-bleed when needed
```

### Density budget (anti-overwhelm)

| Zone | Budget | Content |
|------|--------|---------|
| Primary | ≥55% viewport | Atlas always fully visible when in spatial profiles; else Research |
| Secondary | ~25–30% | Research and/or Design Lab |
| Tertiary | ≤15–20% | Analyst log, Ladder chips, Export status — compact |
| Hidden | 0 chrome | Forge, Massing, full Export, Information — open on demand or via profile |

### Progressive disclosure

1. **L0 session** — claim list + scores only  
2. **L1** — add Atlas pins  
3. **L2** — Design constraints  
4. **L3+** — Forge/massing/systems only if profile needs them  
5. **Export** — never ambient; button + Layer-0  

---

## 4. Workspace layout (tiling, not cascading)

### Problem (legacy / avoided)

Floating windows cascade, overlap, and hide Atlas.

### Solution

**Locked tile grid** with depth-aware flex:

```
┌──────────────┬─────────────────┬────────────┐
│              │  Research Hub   │  Ladder /  │
│    ATLAS     │  (primary text) │  Analyst   │
│  (map+graph) │                 │  compact   │
│   ALWAYS     ├─────────────────┤            │
│   VISIBLE*   │  Design Lab     │  WD peek   │
│              │  (when active)  │            │
└──────────────┴─────────────────┴────────────┘
 Status: Layer-0 · WD · mode · pack · use-case
```

\*Atlas column visible whenever use-case `primaryPanes` includes atlas OR user pins Atlas.

### Layout engine rules

1. **No free-float cascade** in default mode. Optional “unlock pane” is advanced only.
2. **Tile + lock** after profile load and on “Format layout”.
3. **Depth weight** `w ∈ [1..5]` per pane from:
   - use-case profile weights  
   - evidence count / note length  
   - ladder current level  
   - whether map has points  
4. **Min sizes:** Atlas min 40% width when primary; Research min 280px; never crush Atlas below readable map.
5. **Responsive breakpoints:**
   - ≥1400px: 3-column  
   - 1100–1399: Atlas top or left 50%; Research+Design stack  
   - <1100: tabbed primary with Atlas/Research/Design as first-class tabs (still no cascade)
6. **Resize:** drag splitters; lock state persists per use-case id.
7. **Open module from sidebar:** if already tiled, focus it; if not in layout, replace lowest-priority tertiary slot — don’t spawn unbounded windows.

---

## 5. Citizen journalist north-star demos (what to ship in-app)

Ship **generic** sample profiles (no real org/place branding):

1. **Claim triage** — 5 sample claims mixed +1/0/−1; teach scoring  
2. **Site verify** — 4 generic nodes on Atlas; one −1 pin “unverified sighting”  
3. **Network hops** — capture→store→share graph with disclosure 0  
4. **Constraint test** — Matrix Alpha; “extended clearance” changes massing  
5. **Export discipline** — blocked by −1 until resolved; then Layer-0 ACK → kit  

Information tab section: **“For independent researchers”** — short, practical, no hype.

---

## 6. What we deliberately will not do

- Nine simultaneous equal windows  
- Domain-specific product renames per beat  
- Auto-opening every module on pack load  
- Auto-download exports  
- Hard-coded real jurisdictions as identity  
- Turning Research into a social feed  

---

## 7. Success metrics (product)

| Metric | Target |
|--------|--------|
| Time to first scored claim | < 2 minutes for new user |
| Max visible panes default | ≤ 5 |
| Atlas occlusion | 0 in spatial profiles |
| Export without ACK or with open −1 | Blocked |
| Use-case switch | 1 control, layout reformats without cascade |
| Agnostic scrub | Clean on active shell |

---

## 8. Execution

Implement via Grok Build brief:

```bat
grok -p --prompt-file "C:\Nexus\dev\.hermes\briefs\GROK_BUILD_USECASE_WORKSPACE.md" --always-approve --max-turns 50 --output-format plain --cwd "C:\Nexus\dev"
```

Hermes verifies after: layout behavior, agnostic scrub, build/lint, citizen-journo smoke path.
