"""Generate Nexus v3 SuperGrok Project Brief PDF."""
from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

from pypdf import PdfReader
from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    HRFlowable,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

OUT = Path(r"C:\Nexus\dev\docs\Nexus_v3_SuperGrok_Project_Brief.pdf")
OUT.parent.mkdir(parents=True, exist_ok=True)

NAVY = HexColor("#0a0e18")
CYAN = HexColor("#0891b2")
CYAN_LT = HexColor("#22d3ee")
SLATE = HexColor("#334155")
TEXT = HexColor("#0f172a")
MUTED = HexColor("#475569")
LIGHT_BG = HexColor("#f8fafc")
ROW_ALT = HexColor("#f1f5f9")

PAGE_W, PAGE_H = letter
MARGIN = 0.7 * inch


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, PAGE_H - 36, PAGE_W, 36, fill=1, stroke=0)
    canvas.setFillColor(CYAN_LT)
    canvas.setFont("Helvetica-Bold", 9)
    canvas.drawString(MARGIN, PAGE_H - 22, "NEXUS v3.0")
    canvas.setFillColor(HexColor("#94a3b8"))
    canvas.setFont("Helvetica", 8)
    canvas.drawRightString(
        PAGE_W - MARGIN,
        PAGE_H - 22,
        "SuperGrok Project Brief  ·  Agnostic Intelligence Platform",
    )
    canvas.setFillColor(HexColor("#e2e8f0"))
    canvas.rect(0, 0, PAGE_W, 32, fill=1, stroke=0)
    canvas.setStrokeColor(CYAN)
    canvas.setLineWidth(1.5)
    canvas.line(0, 32, PAGE_W, 32)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(MARGIN, 14, "C:\\Nexus\\dev  ·  Working brief for iteration")
    canvas.drawRightString(PAGE_W - MARGIN, 14, f"Page {doc.page}")
    canvas.restoreState()


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="CoverTitle",
        fontName="Helvetica-Bold",
        fontSize=28,
        leading=34,
        textColor=NAVY,
        alignment=TA_LEFT,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="CoverSub",
        fontName="Helvetica",
        fontSize=12,
        leading=16,
        textColor=MUTED,
        spaceAfter=6,
    )
)
styles.add(
    ParagraphStyle(
        name="H1N",
        fontName="Helvetica-Bold",
        fontSize=16,
        leading=20,
        textColor=NAVY,
        spaceBefore=16,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="H2N",
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=15,
        textColor=CYAN,
        spaceBefore=12,
        spaceAfter=6,
    )
)
styles.add(
    ParagraphStyle(
        name="H3N",
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=13,
        textColor=TEXT,
        spaceBefore=8,
        spaceAfter=4,
    )
)
styles.add(
    ParagraphStyle(
        name="BodyN",
        fontName="Helvetica",
        fontSize=9.5,
        leading=13,
        textColor=TEXT,
        alignment=TA_JUSTIFY,
        spaceAfter=6,
    )
)
styles.add(
    ParagraphStyle(
        name="BulletN",
        fontName="Helvetica",
        fontSize=9.5,
        leading=12.5,
        textColor=TEXT,
        leftIndent=12,
        spaceAfter=2,
    )
)
styles.add(
    ParagraphStyle(
        name="CodeN",
        fontName="Courier",
        fontSize=7.5,
        leading=10,
        textColor=HexColor("#1e293b"),
        backColor=ROW_ALT,
        leftIndent=4,
        rightIndent=4,
        spaceBefore=2,
        spaceAfter=2,
    )
)
styles.add(
    ParagraphStyle(
        name="Callout",
        fontName="Helvetica",
        fontSize=9.5,
        leading=13,
        textColor=TEXT,
        leftIndent=8,
        rightIndent=8,
        spaceBefore=4,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="Small",
        fontName="Helvetica",
        fontSize=8,
        leading=10,
        textColor=MUTED,
        spaceAfter=4,
    )
)
styles.add(
    ParagraphStyle(
        name="TableCell",
        fontName="Helvetica",
        fontSize=8,
        leading=10,
        textColor=TEXT,
    )
)
styles.add(
    ParagraphStyle(
        name="TableHeader",
        fontName="Helvetica-Bold",
        fontSize=8,
        leading=10,
        textColor=white,
    )
)
styles.add(
    ParagraphStyle(
        name="FooterNote",
        fontName="Helvetica-Oblique",
        fontSize=8,
        leading=10,
        textColor=MUTED,
        spaceBefore=8,
    )
)


def P(text: str, style: str = "BodyN"):
    return Paragraph(text.replace("\n", "<br/>"), styles[style])


def hr():
    return HRFlowable(
        width="100%", thickness=0.8, color=HexColor("#cbd5e1"), spaceBefore=4, spaceAfter=8
    )


def make_table(headers, rows, col_widths=None):
    data = [[Paragraph(str(c), styles["TableHeader"]) for c in headers]]
    for r in rows:
        data.append([Paragraph(str(c), styles["TableCell"]) for c in r])
    t = Table(data, colWidths=col_widths, repeatRows=1)
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), NAVY),
                ("TEXTCOLOR", (0, 0), (-1, 0), white),
                ("BACKGROUND", (0, 1), (-1, -1), LIGHT_BG),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [LIGHT_BG, ROW_ALT]),
                ("GRID", (0, 0), (-1, -1), 0.4, SLATE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    return t


def main() -> None:
    story = []
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")

    # Cover
    story.append(Spacer(1, 1.2 * inch))
    story.append(P("NEXUS", "CoverTitle"))
    story.append(P("v3.0 Sovereign Edition — Agnostic Intelligence Platform", "CoverSub"))
    story.append(hr())
    story.append(P("<b>SuperGrok Project Brief</b> — full context for iteration", "BodyN"))
    story.append(
        P(
            "Purpose: give SuperGrok (or any coding agent) a complete, portable picture of what "
            "Nexus is, what is already built at <font face='Courier'>C:\\Nexus\\dev</font>, "
            "citizen-journalist utility, cross-industry use cases, workspace rules, constraints, "
            "file map, Grok Build handoffs, and next iteration targets — without dumping the repo.",
            "BodyN",
        )
    )
    story.append(Spacer(1, 10))
    story.append(
        make_table(
            ["Field", "Value"],
            [
                ["Product", "Nexus (name only — no other branding)"],
                ["Version", "3.0.0"],
                ["Root", "C:\\Nexus\\dev"],
                [
                    "Stack",
                    "TypeScript · React 19 · Vite 8 · Tailwind 4 · Zustand · Leaflet · R3F/Three",
                ],
                [
                    "Audience",
                    "Citizen journalists + independent researchers (cross-industry capable)",
                ],
                [
                    "Core job",
                    "Signal vs noise — score claims +1 / 0 / −1; export only after Layer-0",
                ],
                ["Brief date", now],
                ["Build gate", "npm.cmd run lint &amp;&amp; npm.cmd run build (exit 0)"],
            ],
            [1.3 * inch, 5.5 * inch],
        )
    )
    story.append(Spacer(1, 14))
    story.append(
        P(
            "<b>How to use with SuperGrok:</b> Attach this PDF and say: "
            "“This is the current Nexus project brief. Iterate from this state. "
            "Respect KEEP publicApi, agnostic rules, and the tiled workspace plan. "
            "Repo is at C:\\Nexus\\dev.”",
            "Callout",
        )
    )
    story.append(PageBreak())

    # TOC
    story.append(P("1. Contents", "H1N"))
    for t in [
        "2. Executive summary",
        "3. Product principles (non-negotiable)",
        "4. What is already built (current state)",
        "5. Architecture and file map",
        "6. Modules (roles and interactions)",
        "7. Evidence system, Layer-0, working document, export",
        "8. Citizen journalism — utility and signal/noise loop",
        "9. Cross-industry use cases (profiles, not forks)",
        "10. Anti-clutter UX and density budget",
        "11. Tiled workspace specification (no cascade)",
        "12. Planned use-case catalog (IDs)",
        "13. Procedural Forge and massing",
        "14. Data packs and publicApi boundary",
        "15. Grok Build handoffs and commands",
        "16. Iteration backlog (prioritized)",
        "17. Verification gates and evidence language",
        "18. Explicit non-goals",
        "19. Prompt seed for SuperGrok sessions",
    ]:
        story.append(P(t, "BulletN"))
    story.append(PageBreak())

    # 2
    story.append(P("2. Executive summary", "H1N"))
    story.append(hr())
    story.append(
        P(
            "Nexus is a <b>domain-agnostic modular intelligence and modeling platform</b>. "
            "It is not a single-issue surveillance app and not a newsroom CMS. It is a portable "
            "<b>evidence workbench</b>: researchers load generic data packs, score material with "
            "mandatory tri-state language, place claims in space and networks, model constraints, "
            "progress through an audit ladder, and export packages only when Layer-0 clears.",
            "BodyN",
        )
    )
    story.append(
        P(
            "The active product at <font face='Courier'>C:\\Nexus\\dev</font> is a runnable React shell "
            "with nine modules, Sample Pack Alpha, Layer-0 gating, working-document persistence, "
            "Procedural Forge dual export (Unity C# + Three/R3F), and an Export Kit. "
            "Legacy domain-specific UI is archived under <font face='Courier'>src/legacy/</font> "
            "and is <b>out of product path</b>. Optional public API adapters remain under "
            "<font face='Courier'>src/lib/publicApi/*</font> and must be <b>KEEP</b>ed.",
            "BodyN",
        )
    )
    story.append(
        P(
            "Strategic north star for release: <b>citizen journalists and independent researchers</b> "
            "who need to validate claims, classify conjecture, and ship brief packages peers can audit. "
            "The same shell serves infrastructure, regulatory, network, environmental, contracting, "
            "and technical beats via use-case profiles + packs — without clutter or product forks.",
            "BodyN",
        )
    )
    story.append(P("Next major product step (briefed for Grok Build):", "H3N"))
    story.append(
        P(
            "Use-case profile switcher + depth-aware <b>tiled locked workspace</b> (max 5 panes), "
            "Atlas fully visible in spatial profiles, Research + Design Lab as primaries, "
            "no cascading floating windows. Strategy: docs/USE_CASES_AND_WORKSPACE.md · "
            "Build brief: .hermes/briefs/GROK_BUILD_USECASE_WORKSPACE.md",
            "BodyN",
        )
    )

    # 3
    story.append(P("3. Product principles (non-negotiable)", "H1N"))
    story.append(hr())
    story.append(
        make_table(
            ["Principle", "Rule"],
            [
                ["Evidence-first", "Only +1 / 0 / −1. No narrative without scores."],
                ["Layer-0", "Pre-filter on export, ladder L3/L4, pack replace, high-stakes actions."],
                [
                    "Working document",
                    "Auto-log decisions, conditions, evidence, generate/rewrite, exports, Layer-0.",
                ],
                ["Explicit export", "User-triggered only. Never auto-download on mount/generate."],
                [
                    "Agnostic core",
                    "No real place, org, political, or religious branding in UI/default data.",
                ],
                ["Packs not forks", "Domain depth lives in data packs + use-case profiles."],
                ["Name", "Product brand is Nexus only."],
                ["publicApi KEEP", "src/lib/publicApi/* preserved; do not rewrite casually."],
                ["Legacy quarantine", "src/legacy/** excluded from product shell and TS include."],
                [
                    "Density",
                    "≤5 visible panes default; progressive disclosure via ladder + on-demand modules.",
                ],
            ],
            [1.5 * inch, 5.3 * inch],
        )
    )
    story.append(P("Tri-state definitions", "H2N"))
    story.append(
        make_table(
            ["Score", "Meaning", "Export impact"],
            [
                ["+1", "Supported — primary or strongly corroborated", "Safe to carry forward"],
                ["0", "Insufficient or contested — hold claim", "Not a soft pass"],
                ["−1", "Contradicted or disqualifying — escalate", "Hard-blocks export while open"],
            ],
            [0.8 * inch, 3.5 * inch, 2.5 * inch],
        )
    )

    # 4
    story.append(P("4. What is already built (current state)", "H1N"))
    story.append(hr())
    story.append(
        P(
            "Status: production build and lint pass on active tree "
            "(npm.cmd run build / lint → exit 0). App runs via npm.cmd run dev → http://localhost:5173.",
            "BodyN",
        )
    )
    story.append(P("Implemented and functional", "H2N"))
    for b in [
        "App shell: dark navy theme, left module switcher, header, status bar (Layer-0, WD, mode, pack)",
        "Command palette Ctrl/Cmd+K",
        "Nine modules: Information, Atlas, Design Lab, Research Hub, Analyst, Audit Ladder, Procedural Forge, Massing Viewer, Export Kit",
        "Core: layer0.ts, evidence.ts, workingDocument.ts + platformStore (persisted)",
        "Sample Pack Alpha: generic matrices, spatial nodes, graph, two asset types, sample ± evidence",
        "Design Lab → condition snapshot injects into Forge geometry factors",
        "Forge: generate / optimize / deploy hinges / before-after / Unity C# + Three TSX strings",
        "Export Kit: preview + download; ACK + open −1 gate",
        "Information module: full in-app documentation sections",
        "README + strategy doc + Grok Build polish/use-case briefs + launchers",
    ]:
        story.append(P(f"• {b}", "BulletN"))
    story.append(P("Intentionally not in default shell", "H2N"))
    for b in [
        "Old roadside-surveillance compliance product UI (archived in src/legacy)",
        "Deflock/place-specific sample flows as product identity",
        "Floating multi-window cascade as default (planned replacement: tiled workspace)",
        "Auto federal API enrichment in default citizen-journo path",
    ]:
        story.append(P(f"• {b}", "BulletN"))
    story.append(PageBreak())

    # 5
    story.append(P("5. Architecture and file map", "H1N"))
    story.append(hr())
    story.append(P("Active tree (product path)", "H2N"))
    tree = """src/
  App.tsx, main.tsx, index.css
  types/core.ts          — agnostic contracts
  types/audit.ts         — compat for publicApi (KEEP surface)
  core/layer0.ts | evidence.ts | workingDocument.ts
  store/platformStore.ts
  data/packs/samplePack.ts
  layout/                — (planned) tiled engine
  data/useCases/         — (planned) profile catalog
  components/
    layout/ Sidebar, StatusBar, CommandPalette
    ui/ primitives, formClasses
    modules/ Information, Atlas, DesignLab, ResearchHub,
             Analyst, AuditLadder, ProceduralForge,
             MassingViewer, MassingCanvas, ExportKit
  lib/
    forge/generators.ts
    export/exportKit.ts
    locationService.ts   — agnostic geocode helper
    publicApi/*          — KEEP
src/legacy/**            — archived; excluded from tsc
docs/USE_CASES_AND_WORKSPACE.md
.hermes/briefs/GROK_BUILD_*.md"""
    for line in tree.split("\n"):
        story.append(P(line.replace(" ", "&nbsp;"), "CodeN"))

    story.append(P("Runtime split (operator machines)", "H2N"))
    story.append(
        make_table(
            ["Lane", "Tool", "Bill", "Owns"],
            [
                ["Thin orchestrate", "Hermes (API)", "XAI_API_KEY", "Plan, Layer-0, evidence, verify, briefs"],
                ["Heavy code", "Grok Build CLI", "grok.com / SuperGrok", "Multi-file implement, layout, polish"],
                ["Chat iterate", "SuperGrok chat", "Subscription", "Design dialogue using this PDF"],
            ],
            [1.3 * inch, 1.5 * inch, 1.5 * inch, 2.5 * inch],
        )
    )

    # 6
    story.append(P("6. Modules (roles and interactions)", "H1N"))
    story.append(hr())
    story.append(
        make_table(
            ["Module", "Role", "Typical priority"],
            [
                ["Information", "In-app authority docs", "On-demand / first-run"],
                ["Atlas", "Map + network graph", "Primary in spatial profiles"],
                ["Design Lab", "Condition / constraint matrices", "Primary when testing feasibility"],
                ["Research Hub", "Scored notes + evidence ledger", "Primary for claim work"],
                ["Analyst", "Command runtime + Layer-0 ops", "Tertiary / triage"],
                ["Audit Ladder", "L0→L4 progression", "Tertiary chips or research companion"],
                ["Procedural Forge", "Code meshes, hinges, dual export", "On-demand"],
                ["Massing Viewer", "Live 3D", "On-demand / design companion"],
                ["Export Kit", "Explicit packages", "End of workflow / compact strip"],
            ],
            [1.35 * inch, 2.8 * inch, 2.6 * inch],
        )
    )
    story.append(
        P(
            "Interaction spine: Design Lab conditions snapshot into Forge; Research/Analyst write shared "
            "evidence; Ladder records depth; Export packages WD + evidence + optional code; Atlas visualizes "
            "pack spatial/graph layers.",
            "BodyN",
        )
    )

    # 7
    story.append(P("7. Evidence system, Layer-0, working document, export", "H1N"))
    story.append(hr())
    story.append(P("Layer-0 high-stakes actions (representative)", "H2N"))
    for a in [
        "export.kit / export.unity / export.three / export.working-document",
        "ladder.promote.L3 / ladder.promote.L4",
        "datapack.replace / session.clear / forge.publish",
        "Export hard-blocked while unresolved −1 evidence remains",
    ]:
        story.append(P(f"• {a}", "BulletN"))
    story.append(P("Working document auto-logs", "H2N"))
    for a in [
        "Session open; Layer-0 hold/clear; condition apply; evidence add/rescore",
        "Research notes; ladder promote/populate; forge generate/optimize/rewrite; exports",
    ]:
        story.append(P(f"• {a}", "BulletN"))
    story.append(P("Export Kit contents", "H2N"))
    for a in [
        "Session header (pack, conditions, score tallies, ladder)",
        "Full evidence ledger with scores",
        "Optional working document transcript",
        "Optional Unity C# and Three/R3F for active asset",
        "Filename pattern: nexus-export-YYYY-MM-DDThh-mm-ss.md",
    ]:
        story.append(P(f"• {a}", "BulletN"))
    story.append(PageBreak())

    # 8
    story.append(P("8. Citizen journalism — utility and signal/noise loop", "H1N"))
    story.append(hr())
    story.append(
        P(
            "Release positioning: help citizen journalists and independent researchers "
            "<b>validate claims</b>, <b>classify conjecture</b>, and <b>identify signal through noise</b> "
            "with a replicable trail — not hot takes.",
            "BodyN",
        )
    )
    story.append(P("Canonical loop", "H2N"))
    for x in [
        "1. Capture claim or question",
        "2. Score material (+1 primary, 0 incomplete/contested, −1 contradicted)",
        "3. Place on map/graph if spatial or relational",
        "4. Apply constraints in Design Lab when “what would have to be true” matters",
        "5. Climb Audit Ladder only as evidence supports (progressive depth)",
        "6. ACK Layer-0 → Export Kit for peers / editors / public",
    ]:
        story.append(P(x, "BulletN"))
    story.append(P("Journalistic value by capability", "H2N"))
    story.append(
        make_table(
            ["Capability", "Value"],
            [
                ["Tri-state scores", "Kills vibes-as-fact; forces claim hygiene"],
                ["Layer-0", "Cannot quietly export unresolved contradictions"],
                ["Working document", "Replicable methodology trail"],
                ["Research Hub", "Structured notes with mandatory scores"],
                ["Audit Ladder", "Depth on demand — avoid overwhelm"],
                ["Atlas", "Ground statements in space and networks"],
                ["Design Lab", "Feasibility without narrative spin"],
                ["Export Kit", "Shareable packs only when intentional"],
            ],
            [1.8 * inch, 5.0 * inch],
        )
    )

    # 9
    story.append(P("9. Cross-industry use cases (profiles, not forks)", "H1N"))
    story.append(hr())
    story.append(
        P(
            "Rule: domain depth lives in the <b>pack + use-case profile</b>, never new top-level product brands. "
            "Same shell; switch profile; layout retile-locks.",
            "BodyN",
        )
    )
    story.append(P("Tier B domain families", "H2N"))
    story.append(
        make_table(
            ["Family", "Pack themes (generic)", "Atlas", "Research", "Design"],
            [
                ["Infrastructure / siting", "Corridor nodes, clearance", "Heavy", "Med", "Heavy"],
                ["Regulatory / compliance", "Control matrices, gaps", "Light", "Heavy", "Med"],
                ["Supply / distribution", "Hop graphs, disclosure", "Graph", "Heavy", "Light"],
                ["Environmental / land use", "Spatial + conditions", "Heavy", "Med", "Heavy"],
                ["Corporate / contracting", "Award trails, entities", "Med", "Heavy", "Light"],
                ["Science / technical", "Ladder + components", "Light", "Heavy", "Forge opt."],
                ["Civic process", "Timeline + sources", "Light", "Heavy", "Light"],
            ],
            [1.5 * inch, 2.0 * inch, 0.8 * inch, 0.9 * inch, 0.9 * inch],
        )
    )

    # 10
    story.append(P("10. Anti-clutter UX and density budget", "H1N"))
    story.append(hr())
    story.append(P("Principle: one active profile, many available", "H2N"))
    for x in [
        "Use Case Switcher = single header control (not nine equal home screens)",
        "Profile sets default panes, layout preset, sample hints, pack binding",
        "Not a marketing carousel inside every module",
        "Sidebar always available but never duplicates floating windows",
    ]:
        story.append(P(f"• {x}", "BulletN"))
    story.append(P("Density budget", "H2N"))
    story.append(
        make_table(
            ["Zone", "Budget", "Content"],
            [
                ["Primary", "≥55% viewport", "Atlas when spatial; else Research"],
                ["Secondary", "~25–30%", "Research and/or Design Lab"],
                ["Tertiary", "≤15–20%", "Analyst, Ladder chips, Export strip"],
                ["Hidden", "0 chrome", "Forge, Massing, full Info — on demand"],
            ],
            [1.2 * inch, 1.3 * inch, 4.3 * inch],
        )
    )
    story.append(P("Progressive disclosure", "H2N"))
    for x in [
        "L0 — claim list + scores only",
        "L1 — add Atlas pins",
        "L2 — Design constraints",
        "L3+ — Forge/massing/systems only if profile needs them",
        "Export — never ambient; button + Layer-0",
    ]:
        story.append(P(f"• {x}", "BulletN"))
    story.append(PageBreak())

    # 11
    story.append(P("11. Tiled workspace specification (no cascade)", "H1N"))
    story.append(hr())
    story.append(
        P(
            "Problem to eliminate: floating windows cascade, overlap, and hide Atlas. "
            "Solution: locked tile grid with depth-aware flex.",
            "BodyN",
        )
    )
    story.append(P("Target layout (spatial profile)", "H2N"))
    layout_art = """
+------------------+-------------------+------------+
|                  |  Research Hub     | Ladder /   |
|      ATLAS       |  (primary text)   | Analyst    |
|   (map+graph)    |                   | compact    |
|  ALWAYS VISIBLE  +-------------------+            |
|                  |  Design Lab       | WD peek    |
|                  |  (when active)    |            |
+------------------+-------------------+------------+
 Status: Layer-0 · WD · mode · pack · use-case"""
    for line in layout_art.strip("\n").split("\n"):
        story.append(P(line.replace(" ", "&nbsp;"), "CodeN"))
    story.append(P("Engine rules", "H2N"))
    for x in [
        "Default mode = tiled + locked (no free-float cascade)",
        "Format Layout recomputes from viewport + preset + pane weights + depth signals",
        "Depth weight w in [1..5] from profile, evidence counts, note length, ladder level, map point count",
        "Mins: Atlas ≥ ~40% width when primary; Research min ~280px; never crush map",
        "≥1400px 3-column; 1100–1399 2-column; <1100 tabbed primary (still no cascade)",
        "Max 5 visible panes; open module focuses or replaces lowest unpinned tertiary",
        "Pinned Atlas never evicted in spatial profiles",
        "Resize via splitters; persist per use-case id; double-click reset",
        "Maximize/focus allowed; cascade forbidden in default mode",
    ]:
        story.append(P(f"• {x}", "BulletN"))
    story.append(P("Planned implementation files", "H2N"))
    for x in [
        "src/layout/{types,measure,presets,depthWeights,formatLayout}.ts",
        "src/components/layout/{Workspace,PaneFrame,SplitTree}.tsx",
        "src/data/useCases/catalog.ts + store setUseCase()",
        "App.tsx: Sidebar | Header+UseCaseSwitcher+FormatLayout | Workspace | StatusBar",
    ]:
        story.append(P(f"• {x}", "BulletN"))

    # 12
    story.append(P("12. Planned use-case catalog (IDs)", "H1N"))
    story.append(hr())
    story.append(
        make_table(
            ["ID", "Label", "Layout", "Default open panes"],
            [
                ["cj-claim-triage", "Claim triage desk", "triage-compact", "Research, Ladder, Analyst"],
                ["cj-site-verify", "Site / scene verify", "spatial-primary", "Atlas (pin), Research, Design"],
                ["cj-network-map", "Actor / flow map", "spatial-primary", "Atlas, Research, Analyst"],
                [
                    "cj-public-record",
                    "Public record trail",
                    "research-first",
                    "Research, Ladder, Export compact",
                ],
                [
                    "cj-constraint-test",
                    "Constraint test",
                    "design-primary",
                    "Design, Atlas/Massing, Research",
                ],
                [
                    "cj-package-brief",
                    "Publishable brief",
                    "export-review",
                    "Research, Ladder, Export, Analyst",
                ],
                [
                    "gen-explore",
                    "General explore",
                    "research-first / mild spatial",
                    "Atlas + Research + Design",
                ],
            ],
            [1.35 * inch, 1.35 * inch, 1.2 * inch, 2.9 * inch],
        )
    )
    story.append(
        P(
            "Generic sample claims for triage (examples): +1 public agenda document; "
            "0 vague density claim without count; −1 claim contradicts primary timestamp.",
            "Small",
        )
    )

    # 13
    story.append(P("13. Procedural Forge and massing", "H1N"))
    story.append(hr())
    for x in [
        "Pure code hierarchical meshes; hinge deploy drivers 0→1",
        "Workflow: Generate → Optimize → Animate → Compare → Export",
        "Dual output: Unity C# generator string + Three.js/R3F component string",
        "Active Design Lab conditions inject into dimensions (height, arm, setback, scale)",
        "Every rewrite logged to working document",
        "Asset types in sample pack: Mast Enclosure A, Cabinet Node B",
        "Disclaimer: model from structured inputs — not certified survey/engineering drawing",
    ]:
        story.append(P(f"• {x}", "BulletN"))
    story.append(PageBreak())

    # 14
    story.append(P("14. Data packs and publicApi boundary", "H1N"))
    story.append(hr())
    story.append(P("Data pack", "H2N"))
    story.append(
        P(
            "DataPack interface (core types): meta, conditionMatrices, spatialPoints, graphNodes/Edges, "
            "assetTypes, sampleEvidence, sampleSources. Sample Pack Alpha is fully generic "
            "(Jurisdiction 01, Device Type A, Node Alpha, Condition Matrix Alpha).",
            "BodyN",
        )
    )
    story.append(P("How to add a pack", "H2N"))
    for x in [
        "Implement DataPack under src/data/packs/",
        "Generic labels only",
        "loadDataPack() requires Layer-0 ACK",
        "Optional: register Forge asset builders in generators.ts buildParts()",
    ]:
        story.append(P(f"• {x}", "BulletN"))
    story.append(P("publicApi KEEP boundary", "H2N"))
    story.append(
        P(
            "src/lib/publicApi/* (usaspending, censusGeo, openFema, evidenceBridge, enrich*, rateLimit, types) "
            "is preserved for optional enrichment. Vite proxies in vite.config.ts. "
            "Agnostic shell must not hard-bind product identity to these adapters. "
            "Citizen-journalist default path does not require live federal API calls.",
            "BodyN",
        )
    )

    # 15
    story.append(P("15. Grok Build handoffs and commands", "H1N"))
    story.append(hr())
    story.append(
        make_table(
            ["Task", "Brief path", "Launcher"],
            [
                [
                    "Polish v3 shell",
                    ".hermes/briefs/GROK_BUILD_POLISH.md",
                    "RUN_GROK_BUILD_POLISH.cmd",
                ],
                [
                    "Use cases + tiled workspace",
                    ".hermes/briefs/GROK_BUILD_USECASE_WORKSPACE.md",
                    "RUN_GROK_BUILD_USECASE_WORKSPACE.cmd",
                ],
                ["Strategy (read)", "docs/USE_CASES_AND_WORKSPACE.md", "—"],
            ],
            [1.7 * inch, 3.2 * inch, 1.9 * inch],
        )
    )
    story.append(P("Primary command (use-case workspace)", "H2N"))
    cmd = (
        "cd /d C:\\Nexus\\dev &amp;&amp; set PATH=%USERPROFILE%\\.grok\\bin;%PATH% &amp;&amp; "
        "grok -p --prompt-file "
        '"C:\\Nexus\\dev\\.hermes\\briefs\\GROK_BUILD_USECASE_WORKSPACE.md" '
        "--always-approve --max-turns 50 --output-format plain --cwd "
        '"C:\\Nexus\\dev"'
    )
    story.append(P(cmd, "CodeN"))
    story.append(P("Prerequisites: grok login (grok.com pool), npm.cmd install in repo.", "Small"))
    story.append(P("After Build always verify", "H2N"))
    story.append(P("npm.cmd run lint &amp;&amp; npm.cmd run build &amp;&amp; npm.cmd run dev", "CodeN"))
    story.append(
        P(
            "Smoke: cj-site-verify (Atlas visible, no overlap) · cj-claim-triage (Research-led, ≤5 panes) · "
            "export blocked on open −1 · ACK then download.",
            "BodyN",
        )
    )

    # 16
    story.append(P("16. Iteration backlog (prioritized)", "H1N"))
    story.append(hr())
    story.append(P("P0 — Ship workspace + use cases", "H2N"))
    for x in [
        "Implement use-case catalog + switcher + setUseCase",
        "Tiled Workspace engine + PaneFrame + depth weights",
        "Wire App; Format Layout; persist layout per profile",
        "Information section for independent researchers",
        "Lint/build clean; agnostic scrub",
    ]:
        story.append(P(f"• {x}", "BulletN"))
    story.append(P("P1 — Citizen journalist readiness", "H2N"))
    for x in [
        "Richer generic sample claims/sources for triage profile",
        "Compact Export strip + full Export maximize",
        "Empty states that teach the signal/noise loop in one screen",
        "Optional print-friendly export CSS",
        "Keyboard path completeness (pane focus cycle)",
    ]:
        story.append(P(f"• {x}", "BulletN"))
    story.append(P("P2 — Performance and packaging", "H2N"))
    for x in [
        "Dynamic import code-split for Three/Leaflet if low risk",
        "Desktop launcher polish (existing start-nexus.cmd / launch-nexus.ps1)",
        "Share zip script → releases if desired",
        "E2E smoke (Playwright) for use-case switch + layout",
    ]:
        story.append(P(f"• {x}", "BulletN"))
    story.append(P("P3 — Optional enrichment (not identity)", "H2N"))
    for x in [
        "Opt-in publicApi enrich behind explicit Research actions",
        "New packs for generic infrastructure/regulatory demos",
        "Do not rebrand product around any single domain",
    ]:
        story.append(P(f"• {x}", "BulletN"))
    story.append(PageBreak())

    # 17
    story.append(P("17. Verification gates and evidence language", "H1N"))
    story.append(hr())
    story.append(
        P(
            "All status claims must use tri-state evidence: <b>+1</b> verified by command/output, "
            "<b>0</b> incomplete/untested, <b>−1</b> failed or contradicted. Escalate any −1.",
            "BodyN",
        )
    )
    story.append(
        make_table(
            ["Gate", "Command / check", "Pass"],
            [
                ["Typecheck + build", "npm.cmd run build", "exit 0"],
                ["Lint active tree", "npm.cmd run lint", "exit 0, no active warnings"],
                [
                    "Agnostic scrub",
                    "rg forbidden brands in active UI/pack/README",
                    "no hits",
                ],
                ["publicApi present", "dir src\\lib\\publicApi", "files intact"],
                ["Legacy excluded", "tsconfig exclude src/legacy", "not imported by App"],
                ["Layout integrity", "spatial profile smoke", "Atlas visible, no cascade"],
                [
                    "Export discipline",
                    "open −1 then export",
                    "blocked until resolve/ACK rules",
                ],
            ],
            [1.5 * inch, 3.2 * inch, 2.1 * inch],
        )
    )

    # 18
    story.append(P("18. Explicit non-goals", "H1N"))
    story.append(hr())
    for x in [
        "Nine simultaneous equal windows or cascade stacks as default",
        "Domain-specific product renames per beat",
        "Auto-opening every module on pack load",
        "Auto-download exports",
        "Hard-coded real jurisdictions as product identity",
        "Turning Research into a social feed",
        "Rebuilding legacy roadside compliance UI into the shell",
        "Auth/paywall/social as blockers to local research use",
        "Burning Hermes API via delegate_task for multi-file coding (use Grok Build CLI)",
    ]:
        story.append(P(f"• {x}", "BulletN"))

    # 19
    story.append(P("19. Prompt seed for SuperGrok sessions", "H1N"))
    story.append(hr())
    story.append(P("Copy-paste opener when attaching this PDF:", "BodyN"))
    seed = (
        "You are helping iterate Nexus v3 at C:\\Nexus\\dev. Read this project brief PDF as source of truth "
        "for goals and constraints. Nexus is an agnostic evidence workbench for citizen journalists and "
        "cross-industry research: tri-state +1/0/−1, Layer-0, working document, explicit export, data packs, "
        "nine modules. KEEP src/lib/publicApi/*. Do not reattach src/legacy into the shell. Next build: "
        "use-case profiles + depth-aware tiled workspace (max 5 panes), Atlas fully visible in spatial profiles, "
        "Research + Design primary, no cascading windows. Brief: .hermes/briefs/GROK_BUILD_USECASE_WORKSPACE.md. "
        "Heavy multi-file coding → Grok Build CLI with --prompt-file. Verify with npm.cmd run lint and "
        "npm.cmd run build. Stay agnostic: generic labels only. Propose the smallest next diff that increases "
        "citizen-journalist signal/noise utility."
    )
    story.append(P(seed, "Callout"))
    story.append(Spacer(1, 16))
    story.append(hr())
    story.append(
        P(
            "End of brief. Repo path: C:\\Nexus\\dev · Product: Nexus · Version: 3.0.0 · "
            "Strategy: docs/USE_CASES_AND_WORKSPACE.md · This file: docs/Nexus_v3_SuperGrok_Project_Brief.pdf",
            "FooterNote",
        )
    )
    story.append(
        P(
            "America First | Truth-Seeking — evidence over narrative; portable over branded; explicit export only.",
            "FooterNote",
        )
    )

    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=letter,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=0.75 * inch,
        bottomMargin=0.6 * inch,
        title="Nexus v3.0 — SuperGrok Project Brief",
        author="Nexus / Adventure OS working brief",
        subject="Agnostic intelligence platform — full context for SuperGrok iteration",
    )
    doc.build(story, onFirstPage=header_footer, onLaterPages=header_footer)

    r = PdfReader(str(OUT))
    print(f"WROTE {OUT}")
    print(f"PAGES {len(r.pages)}")
    print(f"BYTES {OUT.stat().st_size}")
    t0 = r.pages[0].extract_text() or ""
    print("PAGE1_HAS_NEXUS", "NEXUS" in t0.upper())


if __name__ == "__main__":
    main()
