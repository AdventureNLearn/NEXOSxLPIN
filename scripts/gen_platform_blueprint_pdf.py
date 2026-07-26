#!/usr/bin/env python3
"""
NEXOSxLPIN 1.4.0 — Professional Platform Blueprint PDF
Shareable rebuild guide with UI/UX wireframes for LLM coding tools.
"""
from __future__ import annotations

from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    Flowable,
    KeepTogether,
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "NEXOSxLPIN_1.4.0_Platform_Blueprint.pdf"

# Palette
BG = colors.HexColor("#0b1220")
SURFACE = colors.HexColor("#121a2b")
CYAN = colors.HexColor("#22d3ee")
SLATE = colors.HexColor("#94a3b8")
WHITE = colors.HexColor("#e2e8f0")
MUTED = colors.HexColor("#64748b")
ROSE = colors.HexColor("#fb7185")
EMERALD = colors.HexColor("#34d399")
AMBER = colors.HexColor("#fbbf24")
LINE = colors.HexColor("#334155")


class WireframeShell(Flowable):
    """Schematic app chrome for UI/UX examples."""

    def __init__(self, kind: str = "web", width: float = 6.5 * inch, height: float = 2.6 * inch):
        super().__init__()
        self.kind = kind
        self.width = width
        self.height = height

    def draw(self):
        c = self.canv
        w, h = self.width, self.height
        # outer
        c.setFillColor(colors.HexColor("#05070f"))
        c.setStrokeColor(LINE)
        c.roundRect(0, 0, w, h, 6, fill=1, stroke=1)
        if self.kind == "web":
            # sidebar
            c.setFillColor(colors.HexColor("#070b14"))
            c.rect(0, 0, w * 0.14, h, fill=1, stroke=0)
            c.setStrokeColor(LINE)
            c.line(w * 0.14, 0, w * 0.14, h)
            # header
            c.setFillColor(colors.HexColor("#070b14"))
            c.rect(w * 0.14, h - 22, w * 0.86, 22, fill=1, stroke=0)
            c.setStrokeColor(LINE)
            c.line(w * 0.14, h - 22, w, h - 22)
            # logo
            c.setFillColor(CYAN)
            c.circle(w * 0.14 + 12, h - 11, 5, fill=1, stroke=0)
            c.setFillColor(WHITE)
            c.setFont("Helvetica-Bold", 7)
            c.drawString(w * 0.14 + 22, h - 14, "NEXOSxLPIN  ·  Web")
            # toggles
            c.setFillColor(SURFACE)
            c.roundRect(w - 95, h - 18, 38, 12, 2, fill=1, stroke=0)
            c.setFillColor(CYAN)
            c.roundRect(w - 55, h - 18, 40, 12, 2, fill=1, stroke=0)
            c.setFillColor(colors.HexColor("#05070f"))
            c.setFont("Helvetica", 5.5)
            c.drawCentredString(w - 76, h - 14, "Web")
            c.drawCentredString(w - 35, h - 14, "Mobile")
            # nav items
            c.setFillColor(MUTED)
            c.setFont("Helvetica", 5.5)
            for i, lab in enumerate(["Info", "Atlas", "Research", "SME", "Analyst", "Export"]):
                y = h - 40 - i * 14
                if lab == "SME":
                    c.setFillColor(CYAN)
                    c.roundRect(4, y - 3, w * 0.14 - 8, 12, 2, fill=1, stroke=0)
                    c.setFillColor(colors.HexColor("#05070f"))
                else:
                    c.setFillColor(MUTED)
                c.drawString(8, y, lab)
            # main panes mock
            c.setFillColor(SURFACE)
            c.roundRect(w * 0.16, 28, w * 0.5, h - 58, 4, fill=1, stroke=0)
            c.roundRect(w * 0.68, 28, w * 0.3 - 6, h - 58, 4, fill=1, stroke=0)
            c.setFillColor(MUTED)
            c.setFont("Helvetica", 6)
            c.drawString(w * 0.18, h - 48, "Atlas / Claims stage")
            c.drawString(w * 0.7, h - 48, "SME / Sources")
            # map pin dots
            c.setFillColor(MUTED)
            c.circle(w * 0.35, h * 0.45, 3, fill=1, stroke=0)
            c.setFillColor(CYAN)
            c.circle(w * 0.42, h * 0.55, 4, fill=1, stroke=0)
            # status
            c.setFillColor(colors.HexColor("#060a12"))
            c.rect(w * 0.14, 0, w * 0.86, 18, fill=1, stroke=0)
            c.setFillColor(EMERALD)
            c.setFont("Helvetica", 5.5)
            c.drawString(w * 0.16, 6, "Layer-0 Idle  ·  +3  0=2  -1=0  ·  UI web")
        else:
            # mobile
            c.setFillColor(colors.HexColor("#070b14"))
            c.rect(0, h - 28, w, 28, fill=1, stroke=0)
            c.setFillColor(CYAN)
            c.circle(16, h - 14, 6, fill=1, stroke=0)
            c.setFillColor(WHITE)
            c.setFont("Helvetica-Bold", 8)
            c.drawString(28, h - 17, "NEXOSxLPIN  ·  Mobile")
            c.setFillColor(SURFACE)
            c.roundRect(8, 40, w - 16, h - 78, 4, fill=1, stroke=0)
            c.setFillColor(MUTED)
            c.setFont("Helvetica", 7)
            c.drawCentredString(w / 2, h * 0.55, "Single-column stage")
            c.drawCentredString(w / 2, h * 0.48, "(Atlas / SME / Claims full width)")
            # bottom nav
            c.setFillColor(colors.HexColor("#070b14"))
            c.rect(0, 0, w, 32, fill=1, stroke=0)
            c.setStrokeColor(LINE)
            c.line(0, 32, w, 32)
            c.setFont("Helvetica", 6)
            for i, lab in enumerate(["Map", "Claims", "SME", "Analyst", "Export", "Info"]):
                x = 8 + i * (w - 16) / 6
                if lab == "SME":
                    c.setFillColor(CYAN)
                    c.roundRect(x, 6, (w - 16) / 6 - 4, 20, 3, fill=1, stroke=0)
                    c.setFillColor(colors.HexColor("#05070f"))
                else:
                    c.setFillColor(MUTED)
                c.drawCentredString(x + (w - 16) / 12 - 2, 13, lab)


class ScoreRow(Flowable):
    def __init__(self, width=6.5 * inch):
        super().__init__()
        self.width = width
        self.height = 36

    def draw(self):
        c = self.canv
        items = [
            (EMERALD, "+1", "Supported — primary / multi-source"),
            (AMBER, "0", "Not proven — hold / gather"),
            (ROSE, "−1", "Disputed — blocks export"),
        ]
        x = 0
        for col, lab, desc in items:
            c.setFillColor(SURFACE)
            c.setStrokeColor(LINE)
            c.roundRect(x, 4, self.width / 3 - 6, 28, 4, fill=1, stroke=1)
            c.setFillColor(col)
            c.setFont("Helvetica-Bold", 10)
            c.drawString(x + 8, 16, lab)
            c.setFillColor(SLATE)
            c.setFont("Helvetica", 6.5)
            c.drawString(x + 8, 8, desc)
            x += self.width / 3


def styles():
    base = getSampleStyleSheet()
    s = {
        "title": ParagraphStyle(
            "T",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=22,
            textColor=WHITE,
            spaceAfter=6,
            alignment=TA_CENTER,
        ),
        "sub": ParagraphStyle(
            "S",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=10,
            textColor=CYAN,
            alignment=TA_CENTER,
            spaceAfter=12,
        ),
        "h1": ParagraphStyle(
            "H1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=14,
            textColor=CYAN,
            spaceBefore=14,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "H2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=11,
            textColor=WHITE,
            spaceBefore=10,
            spaceAfter=5,
        ),
        "body": ParagraphStyle(
            "B",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=9,
            textColor=SLATE,
            leading=12,
            alignment=TA_JUSTIFY,
            spaceAfter=6,
        ),
        "bullet": ParagraphStyle(
            "Bu",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=8.5,
            textColor=SLATE,
            leading=11,
            leftIndent=8,
        ),
        "code": ParagraphStyle(
            "C",
            parent=base["Code"],
            fontName="Courier",
            fontSize=7.5,
            textColor=EMERALD,
            leading=10,
            backColor=SURFACE,
            borderPadding=4,
            spaceAfter=8,
        ),
        "caption": ParagraphStyle(
            "Cap",
            parent=base["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=7.5,
            textColor=MUTED,
            alignment=TA_CENTER,
            spaceBefore=4,
            spaceAfter=10,
        ),
        "footer": ParagraphStyle(
            "F",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=7,
            textColor=MUTED,
            alignment=TA_CENTER,
        ),
        "th": ParagraphStyle("TH", parent=base["Normal"], fontName="Helvetica-Bold", fontSize=8, textColor=WHITE),
        "td": ParagraphStyle("TD", parent=base["Normal"], fontName="Helvetica", fontSize=7.5, textColor=SLATE, leading=10),
    }
    return s


def table(rows, col_w, header=True):
    data = []
    for i, row in enumerate(rows):
        st = styles()["th"] if header and i == 0 else styles()["td"]
        data.append([Paragraph(str(c), st) for c in row])
    t = Table(data, colWidths=col_w, repeatRows=1 if header else 0)
    cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#0e7490")) if header else ("BACKGROUND", (0, 0), (-1, 0), SURFACE),
        ("BACKGROUND", (0, 1), (-1, -1), SURFACE),
        ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
        ("GRID", (0, 0), (-1, -1), 0.4, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]
    if not header:
        cmds[0] = ("BACKGROUND", (0, 0), (-1, -1), SURFACE)
    t.setStyle(TableStyle(cmds))
    return t


def on_page(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(colors.HexColor("#05070f"))
    canvas.rect(0, 0, letter[0], letter[1], fill=1, stroke=0)
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(0.7 * inch, 0.55 * inch, letter[0] - 0.7 * inch, 0.55 * inch)
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 7)
    canvas.drawString(0.7 * inch, 0.38 * inch, "NEXOSxLPIN 1.4.0 · Platform Blueprint · Training rebuild guide")
    canvas.drawRightString(letter[0] - 0.7 * inch, 0.38 * inch, f"Page {doc.page}")
    canvas.restoreState()


def build():
    S = styles()
    story = []

    # COVER
    story.append(Spacer(1, 1.2 * inch))
    story.append(Paragraph("NEXOSxLPIN", S["title"]))
    story.append(Paragraph("1.4.0 Enterprise Hub · Platform Blueprint", S["sub"]))
    story.append(Paragraph(
        "Professional rebuild specification with UI/UX visual examples.<br/>"
        "Designed so an operator or LLM coding agent can ingest this PDF and reconstruct the product.",
        S["body"],
    ))
    story.append(Spacer(1, 0.25 * inch))
    story.append(table(
        [
            ["Field", "Value"],
            ["Product root", "C:\\NEXOSxLPIN (local disk)"],
            ["Stack", "React 19 · TypeScript · Vite · Tailwind · Zustand · Leaflet · R3F"],
            ["SME lenses", "252 (specialized LENS_RULES each)"],
            ["Congressional desks", "56 full-depth training desks"],
            ["Evidence model", "Tri-state +1 / 0 / −1 · Layer-0 · Working Document"],
            ["UI shells", "Web multi-pane · Mobile single-column (persisted toggle)"],
            ["Install", "Node LTS → INSTALL.bat → START.bat → http://localhost:5173"],
            ["Share zip", "releases\\NEXOSxLPIN-1.4.0-*.zip (no node_modules)"],
        ],
        [1.6 * inch, 5.0 * inch],
    ))
    story.append(Spacer(1, 0.3 * inch))
    story.append(Paragraph(
        "<b>America First · Truth-Seeking · Evidence-first.</b> Training desks are not legal advice. "
        "No secrets or client PII in sample packs.",
        S["caption"],
    ))
    story.append(PageBreak())

    # 1 MISSION & PRINCIPLES
    story.append(Paragraph("1. Mission & non-negotiable principles", S["h1"]))
    story.append(Paragraph(
        "NEXOSxLPIN is a <b>Lily Pad Intelligence Network</b> workbench for story-driven investigation: "
        "map places, score claims, run Subject Matter Expert lenses, apply jurisdictional story rules, "
        "and publish only after Layer-0 integrity gates pass.",
        S["body"],
    ))
    story.append(Paragraph("Hard rules", S["h2"]))
    for b in [
        "Tri-state evidence only: <b>+1 Supported</b>, <b>0 Not proven</b>, <b>−1 Disputed</b>.",
        "Layer-0 pre-filter + one-shot ACK before high-stakes export / L3+ ladder.",
        "Working document is durable memory (decisions, notes, exports).",
        "Confirm before Apply SME scores to the evidence ledger (two-click).",
        "Explicit user-triggered export only — never auto-download.",
        "Prefer primary public records over social; no invented statutes or vote tallies.",
        "Product path on local disk (C:\\), not OneDrive; npm.cmd on Windows.",
    ]:
        story.append(Paragraph(f"• {b}", S["bullet"]))
    story.append(Paragraph("Evidence language", S["h2"]))
    story.append(ScoreRow())
    story.append(Paragraph("Figure 1 — Tri-state score badges used across Research, SME, Export, Status.", S["caption"]))
    story.append(PageBreak())

    # 2 UI / UX
    story.append(Paragraph("2. UI / UX visual system", S["h1"]))
    story.append(Paragraph(
        "Shell: night field <font color='#22d3ee'>#05070f</font>, surfaces <font color='#121a2b'>#121a2b</font>, "
        "accent cyan <font color='#22d3ee'>#22d3ee</font>, slate body text. Density: Dense / Compact / Roomy. "
        "Modes: Tabs · Tiles · Immersive (desktop). Header toggle forces <b>Web</b> or <b>Mobile</b> chrome.",
        S["body"],
    ))
    story.append(Paragraph("2.1 Web shell (multi-pane)", S["h2"]))
    story.append(WireframeShell("web"))
    story.append(Paragraph(
        "Figure 2 — Web layout: left module rail, header with brand + Web/Mobile + density, "
        "primary stage (Atlas/Claims), secondary SME/Sources, Layer-0 status bar.",
        S["caption"],
    ))
    story.append(Paragraph("2.2 Mobile shell (single-column)", S["h2"]))
    story.append(WireframeShell("mobile", height=2.3 * inch))
    story.append(Paragraph(
        "Figure 3 — Mobile: full-width stage, ≥44px bottom nav (Map · Claims · SME · Analyst · Export · Info). "
        "Music dock and dense chrome hidden. Immersive forced off.",
        S["caption"],
    ))
    story.append(Paragraph("2.3 Operator loop (UX journey)", S["h2"]))
    story.append(table(
        [
            ["Step", "Surface", "User action", "Success signal"],
            ["1", "Picker / Switcher", "Choose story or cong desk", "useCasePicked · map pin active"],
            ["2", "Atlas", "Review pins; click grey pin to switch", "Active pin cyan; others grey"],
            ["3", "Research Hub", "Score claims; open sources", "Ledger +1/0/−1 · source links"],
            ["4", "SME Lenses", "Select experts · Run selected", "Batch briefings · posture badges"],
            ["5", "Design Lab", "Set story rules / conditions", "WD condition entry"],
            ["6", "Audit Ladder", "Populate L0→L4", "Ladder scores filled"],
            ["7", "Export Kit", "ACK Layer-0 · clear −1 · Download", "File download · WD export log"],
        ],
        [0.5 * inch, 1.1 * inch, 2.4 * inch, 2.5 * inch],
    ))
    story.append(PageBreak())

    # 3 ARCHITECTURE
    story.append(Paragraph("3. Architecture & tech stack", S["h1"]))
    story.append(Paragraph(
        "Single-page app: Vite bundles React 19 + TypeScript. State: Zustand with persist "
        "(key <font face='Courier'>nexos-lpin-v1</font>). Spatial: Leaflet. 3D: React Three Fiber. "
        "Styling: Tailwind v4. Lint: oxlint. Test: vitest. Package manager: npm.cmd on Windows.",
        S["body"],
    ))
    story.append(Paragraph("Directory map (product root C:\\NEXOSxLPIN)", S["h2"]))
    story.append(Paragraph(
        "<font face='Courier' size='7.5'>"
        "src/App.tsx — shell Web|Mobile<br/>"
        "src/store/platformStore.ts — all runtime state + SME + uiMode<br/>"
        "src/types/{core,sme,useCase}.ts — contracts<br/>"
        "src/data/sme/ — 252 lenses (core + expansion packs)<br/>"
        "src/lib/sme/{analyze,rules}.ts — engine + 252 specialized rules<br/>"
        "src/data/useCases/ — catalog, stories, sims, congress packs<br/>"
        "src/components/modules/* — 10 product surfaces<br/>"
        "src/components/layout/* — Workspace, Sidebar, StatusBar<br/>"
        "public/ — brand-mark.svg, favicon, icons<br/>"
        "scripts/ — smoke, zip, brand, generators<br/>"
        "docs/ — INSTALL, handoff, this blueprint<br/>"
        "START.bat · INSTALL.bat · QUICKSTART.txt"
        "</font>",
        S["body"],
    ))
    story.append(Paragraph("Core state (platformStore)", S["h2"]))
    story.append(table(
        [
            ["Slice", "Role"],
            ["activeModule / workspace", "Tabs·Tiles·Immersive, panes, fractions, locks"],
            ["uiMode web|mobile", "Shell chrome; persisted"],
            ["activeUseCaseId + setUseCase", "Loads sim, evidence, sources, design, assets"],
            ["evidence / researchNotes", "Tri-state ledger + notes"],
            ["layer0 / layer0AckToken", "Integrity gate + one-shot ACK"],
            ["workingDocument", "Durable decisions / exports / SME briefs"],
            ["activeSmeLensId / selectedSmeLensIds", "Detail + multi-select"],
            ["lastSmeBriefing(Set)", "Advisor outputs"],
            ["conditions / ladder / assets", "Design Lab, Audit L0–4, Forge meshes"],
        ],
        [2.2 * inch, 4.4 * inch],
    ))
    story.append(PageBreak())

    # 4 MODULES
    story.append(Paragraph("4. Module surface catalog (all working)", S["h1"]))
    story.append(table(
        [
            ["Module id", "Label", "Capability (1.4.0)"],
            ["information", "Information", "Story body + SME help + full product guide"],
            ["atlas", "Atlas", "All investigation pins; grey inactive; click switch; scene graph"],
            ["design-lab", "Design Lab", "Story/jurisdiction condition matrices; apply → WD"],
            ["research-hub", "Research Hub", "Claims, sources, notes; filter + bulk rescore"],
            ["analyst", "Analyst", "Command runtime (sme/desk/export/ui)"],
            ["sme-lenses", "SME Lenses", "252 experts; accordion; multi-run; confirm apply"],
            ["audit-ladder", "Audit Ladder", "L0–L4 progression with scores/notes"],
            ["procedural-forge", "Procedural Forge", "Story-linked mesh gen; Unity C# + Three export"],
            ["massing-viewer", "Massing Viewer", "Live R3F runtime for active asset"],
            ["export-kit", "Export Kit", "Preflight checklist; ACK; explicit download"],
        ],
        [1.35 * inch, 1.15 * inch, 4.0 * inch],
    ))
    story.append(Paragraph("SME Lenses UX (must preserve)", S["h2"]))
    for b in [
        "Domain accordion with aria-expanded / aria-controls",
        "Checkbox + label association; click tagline opens detail",
        "Sticky filter + Expand/Collapse; horizontal selected chips + Clear all",
        "Recommended chips from tag relevance",
        "Run SME analysis · Run selected · Commit WD · Apply scores (confirm)",
        "Batch briefings list with short name, urgency, posture badge",
    ]:
        story.append(Paragraph(f"• {b}", S["bullet"]))
    story.append(PageBreak())

    # 5 SME SYSTEM
    story.append(Paragraph("5. SME system — 252 lenses", S["h1"]))
    story.append(Paragraph(
        "Each lens is a professional research persona. Engine: deterministic offline "
        "<font face='Courier'>analyzeWithLens</font> + specialized "
        "<font face='Courier'>LENS_RULES[id]</font>. "
        "assertAllLensesHaveRules() must return [].",
        S["body"],
    ))
    story.append(table(
        [
            ["Domain", "Count", "Focus"],
            ["core-governance", "20", "Evidence, Layer-0, narrative, custody, harm"],
            ["public-records", "20", "FOIA, dockets, permits, title, bid tabs"],
            ["jurisdiction", "20", "Authority maps, preemption, admin law"],
            ["oversight", "20", "Influence, ethics, IG, lobby, grants"],
            ["sector-regulatory", "22", "Env, health, cyber, export, finance…"],
            ["method-process", "11", "Verify, sources, metrics, uncertainty"],
            ["mechanical-engineering", "17", "Statics, fatigue, CFD, NVH…"],
            ["civil-structural", "11", "Structural, seismic, bridge, flood"],
            ["electrical-electronics", "14", "Power, EMC, embedded, battery"],
            ["chemical-process", "8", "Process, LOPA, catalysis"],
            ["aerospace-defense-tech", "8", "Flight, GNC, mission assurance"],
            ["materials-manufacturing", "11", "Metallurgy, AM, welding, quality"],
            ["energy-nuclear", "8", "Grid, nuclear safety, H2, CCS"],
            ["biomedical-systems", "8", "Devices, clinical, biocompatibility"],
            ["computing-cyberphysical", "14", "CPS, security, ML systems, SBOM"],
            ["mathematics-statistics", "20", "Stats, causal, Bayesian, PDE…"],
            ["theoretical-physics", "14", "Classical→QFT literacy, regimes"],
            ["applied-physical-sciences", "6", "Metrology, remote sensing, acoustics"],
            ["TOTAL", "252", ""],
        ],
        [2.1 * inch, 0.7 * inch, 3.7 * inch],
    ))
    story.append(Paragraph("Lens field contract (every NEW lens)", S["h2"]))
    story.append(Paragraph(
        "id, short (≤18), name, domain, tagline, description (≥2 sentences), persona "
        "(title, credential, voice, ≥3 principles), focusTags ≥6, questionBank ≥3, "
        "preferredSources ≥2, publishGates ≥1, highStakes bool, LENS_RULES[id] specialized.",
        S["body"],
    ))
    story.append(PageBreak())

    # 6 CONGRESS
    story.append(Paragraph("6. Congressional / industry desks — 56", S["h1"]))
    story.append(Paragraph(
        "Family <font face='Courier'>congressional</font>. Each desk: UseCaseReport (≥5 mixed claims), "
        "InvestigationStory, ≥5–6 official ActiveSources, simulation + mapPin (jittered). "
        "Framing: training / industry-effect — not legal advice.",
        S["body"],
    ))
    story.append(Paragraph(
        "cong-01…20 original · cong-21…40 1.3 expansion · cong-41…56 1.4 themes "
        "(AI chip export, biometric procurement, COOP, OSS federal, med-device cyber, AWS dual-use, "
        "carbon offsets, digital ID, freight data, hardrock, broadcast, 340B, BVLOS, SMR, tribal energy, debris).",
        S["body"],
    ))
    story.append(Paragraph("Source hierarchy", S["h2"]))
    for b in [
        "1. Congress.gov bill/search",
        "2. Named agency primary (FDA, BIS, FCC, FEMA…)",
        "3. GAO",
        "4. CRS",
        "5. GovInfo / authenticated pubs",
    ]:
        story.append(Paragraph(f"• {b}", S["bullet"]))
    story.append(PageBreak())

    # 7 ANALYST
    story.append(Paragraph("7. Analyst command surface", S["h1"]))
    story.append(Paragraph(
        "<font face='Courier' size='8'>"
        "help · modules · open &lt;module&gt; · ack [reason] · layer0 &lt;action|status&gt;<br/>"
        "score &lt;+1|0|-1&gt; &lt;title&gt; :: &lt;summary&gt;<br/>"
        "conditions apply · ladder &lt;0-4&gt; · forge generate &lt;type&gt;<br/>"
        "sme list|tech|count|domains|search &lt;q&gt;|select &lt;id&gt;|run|run-domain &lt;d&gt;|&lt;lens-id&gt;<br/>"
        "desk list|cong · evidence summary · export check · ui web|mobile · status"
        "</font>",
        S["body"],
    ))
    story.append(PageBreak())

    # 8 DATA CONTRACTS
    story.append(Paragraph("8. Key TypeScript contracts (rebuild skeleton)", S["h1"]))
    story.append(Paragraph(
        "<font face='Courier' size='7'>"
        "type EvidenceScore = 1 | 0 | -1<br/>"
        "type ModuleId = 'information'|'atlas'|'design-lab'|'research-hub'|'analyst'|"
        "'sme-lenses'|'audit-ladder'|'procedural-forge'|'massing-viewer'|'export-kit'<br/>"
        "interface SmeLens { id; short; name; domain; tagline; description; persona; "
        "focusTags; questionBank; preferredSources; publishGates; highStakes }<br/>"
        "interface SmeBriefing { posture; urgency; claimReads; actions; workingDocMarkdown; stats }<br/>"
        "interface UseCaseProfile { id; label; family; report?; mapPin?; defaultOpen; paneWeights… }<br/>"
        "WorkspaceViewMode = 'tabs'|'tiles'|'immersive' · uiMode = 'web'|'mobile'"
        "</font>",
        S["body"],
    ))
    story.append(Paragraph("9. Install &amp; verify", S["h1"]))
    story.append(Paragraph(
        "<font face='Courier' size='8'>"
        "cd /d C:\\NEXOSxLPIN<br/>"
        "INSTALL.bat          :: npm.cmd install &amp;&amp; npm.cmd run build<br/>"
        "START.bat            :: npm.cmd run dev → http://localhost:5173<br/>"
        "npm.cmd run test<br/>"
        "npm.cmd run lint<br/>"
        "npm.cmd run build<br/>"
        "node scripts\\smoke-sme-congress.mjs<br/>"
        "powershell -File scripts\\create-desktop-shortcut.ps1"
        "</font>",
        S["body"],
    ))
    story.append(Paragraph("Acceptance gates (1.4.0)", S["h2"]))
    story.append(table(
        [
            ["Gate", "Expect"],
            ["SME_LENSES.length", "252"],
            ["assertAllLensesHaveRules()", "[]"],
            ["congressionalDesks().length", "56"],
            ["Per-domain counts", "Exact table in §5"],
            ["Unique ids/shorts", "No collisions"],
            ["Export", "Blocked on −1; needs ACK"],
            ["Apply scores", "Two-click confirm"],
            ["Bundle", "Chunked (main ≪ 1.8MB)"],
        ],
        [2.5 * inch, 4.0 * inch],
    ))
    story.append(PageBreak())

    # 10 LLM REBUILD PROMPT
    story.append(Paragraph("10. LLM rebuild prompt (copy into coding agent)", S["h1"]))
    story.append(Paragraph(
        "Paste the following into Claude / Grok / Cursor / Codex with this PDF attached:",
        S["body"],
    ))
    story.append(Paragraph(
        "<font face='Courier' size='7.2' color='#a5f3fc'>"
        "You are building NEXOSxLPIN 1.4.0 Enterprise Hub from the attached Platform Blueprint PDF. "
        "Stack: React 19 + TypeScript + Vite + Tailwind + Zustand (persist) + Leaflet + R3F. "
        "Implement all 10 modules, Web|Mobile uiMode, tri-state evidence +1/0/−1, Layer-0 ACK, "
        "working document, SME engine with 252 specialized lenses/rules (domain counts exact), "
        "56 congressional training desks with reports/stories/sources/sims, Analyst commands listed "
        "in §7, Export Kit preflight, confirm-before-apply scores, chunked Vite manualChunks, "
        "INSTALL.bat/START.bat, smoke tests asserting 252/56/rules[]. "
        "cwd local disk only; npm.cmd on Windows; no secrets/PII; training desks not legal advice; "
        "no invented statutes. Prefer expansion packs over rewriting core ids. "
        "Match UI wireframes in §2 (night theme, cyan accent, status bar Layer-0)."
        "</font>",
        S["body"],
    ))
    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph("11. Benchmark snapshot (post-audit 1.4.0)", S["h1"]))
    story.append(table(
        [
            ["Metric", "Value"],
            ["SME lenses / rules", "252 / 252"],
            ["Congressional desks", "56"],
            ["Vitest", "16/16 (analyze + smoke)"],
            ["Main JS (approx)", "~294 kB entry · chunked vendors"],
            ["Cold install", "Node LTS + INSTALL + START"],
            ["Desktop", "NEXOSxLPIN.lnk → START.bat · v140.ico"],
        ],
        [2.2 * inch, 4.3 * inch],
    ))
    story.append(Spacer(1, 0.35 * inch))
    story.append(Paragraph(
        "© Operator training materials · NEXOSxLPIN · Evidence-first · Explicit export only",
        S["footer"],
    ))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=letter,
        leftMargin=0.7 * inch,
        rightMargin=0.7 * inch,
        topMargin=0.65 * inch,
        bottomMargin=0.7 * inch,
        title="NEXOSxLPIN 1.4.0 Platform Blueprint",
        author="NEXOSxLPIN",
        subject="Rebuild specification with UI/UX visual examples",
    )
    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print("Wrote", OUT, OUT.stat().st_size)


if __name__ == "__main__":
    build()
