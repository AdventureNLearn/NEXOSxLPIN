"""
Nexus RSD — Grok Rebuild Brief PDF (polished, no runoff).
Human-readable + machine-executable. Tables wrap via Paragraph cells.
"""
from __future__ import annotations

from pathlib import Path
import shutil
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white, Color
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    PageBreak,
    Table,
    TableStyle,
    KeepTogether,
    Flowable,
    HRFlowable,
    ListFlowable,
    ListItem,
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.pdfgen import canvas as pdfcanvas
from pypdf import PdfReader

OUT = Path(r"C:\Nexus\releases\Nexus-RSD-Grok-Rebuild-Brief-v0.4.1.pdf")
DESK = Path(r"C:\Users\Chris\OneDrive\Desktop") / OUT.name

# ── palette ──────────────────────────────────────────────────────────
INK = HexColor("#0f172a")
MUTED = HexColor("#475569")
LIGHT = HexColor("#f1f5f9")
CARD = HexColor("#f8fafc")
CYAN = HexColor("#0e7490")
CYAN_LT = HexColor("#ecfeff")
AMBER = HexColor("#b45309")
AMBER_LT = HexColor("#fffbeb")
GREEN = HexColor("#047857")
GREEN_LT = HexColor("#ecfdf5")
VIOLET = HexColor("#6d28d9")
VIOLET_LT = HexColor("#f5f3ff")
RED = HexColor("#b91c1c")
BORDER = HexColor("#cbd5e1")
HEADER_BG = HexColor("#0f172a")

PAGE_W, PAGE_H = letter
LM = 0.6 * inch
RM = 0.6 * inch
CONTENT_W = PAGE_W - LM - RM


def styles_build():
    s = getSampleStyleSheet()
    s.add(
        ParagraphStyle(
            "CoverH",
            fontName="Helvetica-Bold",
            fontSize=20,
            leading=24,
            textColor=INK,
            alignment=TA_CENTER,
            spaceAfter=4,
        )
    )
    s.add(
        ParagraphStyle(
            "CoverS",
            fontName="Helvetica",
            fontSize=10,
            leading=13,
            textColor=MUTED,
            alignment=TA_CENTER,
            spaceAfter=3,
        )
    )
    s.add(
        ParagraphStyle(
            "H1",
            fontName="Helvetica-Bold",
            fontSize=12.5,
            leading=15,
            textColor=INK,
            spaceBefore=12,
            spaceAfter=5,
        )
    )
    s.add(
        ParagraphStyle(
            "H2",
            fontName="Helvetica-Bold",
            fontSize=10,
            leading=12.5,
            textColor=CYAN,
            spaceBefore=8,
            spaceAfter=3,
        )
    )
    s.add(
        ParagraphStyle(
            "Body",
            fontName="Helvetica",
            fontSize=8.5,
            leading=11,
            textColor=INK,
            alignment=TA_JUSTIFY,
            spaceAfter=3,
        )
    )
    s.add(
        ParagraphStyle(
            "Small",
            fontName="Helvetica",
            fontSize=7.5,
            leading=9.5,
            textColor=MUTED,
            spaceAfter=2,
        )
    )
    s.add(
        ParagraphStyle(
            "Cell",
            fontName="Helvetica",
            fontSize=7.5,
            leading=9.5,
            textColor=INK,
            wordWrap="CJK",  # force wrap long tokens
        )
    )
    s.add(
        ParagraphStyle(
            "CellB",
            fontName="Helvetica-Bold",
            fontSize=7.5,
            leading=9.5,
            textColor=INK,
            wordWrap="CJK",
        )
    )
    s.add(
        ParagraphStyle(
            "CellH",
            fontName="Helvetica-Bold",
            fontSize=7.5,
            leading=9.5,
            textColor=white,
            wordWrap="CJK",
        )
    )
    s.add(
        ParagraphStyle(
            "Mono",
            fontName="Courier",
            fontSize=7,
            leading=9,
            textColor=HexColor("#134e4a"),
            wordWrap="CJK",
        )
    )
    s.add(
        ParagraphStyle(
            "MonoSm",
            fontName="Courier",
            fontSize=6.5,
            leading=8.2,
            textColor=HexColor("#134e4a"),
            wordWrap="CJK",
        )
    )
    s.add(
        ParagraphStyle(
            "BulletItem",
            fontName="Helvetica",
            fontSize=8,
            leading=10.5,
            textColor=INK,
            leftIndent=10,
            bulletIndent=0,
            spaceAfter=1.5,
        )
    )
    s.add(
        ParagraphStyle(
            "Callout",
            fontName="Helvetica",
            fontSize=8,
            leading=10.5,
            textColor=HexColor("#78350f"),
            alignment=TA_LEFT,
        )
    )
    s.add(
        ParagraphStyle(
            "Footer",
            fontName="Helvetica",
            fontSize=7,
            leading=9,
            textColor=MUTED,
            alignment=TA_CENTER,
        )
    )
    s.add(
        ParagraphStyle(
            "UILabel",
            fontName="Helvetica-Bold",
            fontSize=6.5,
            leading=8,
            textColor=HexColor("#e2e8f0"),
            alignment=TA_CENTER,
        )
    )
    s.add(
        ParagraphStyle(
            "UISub",
            fontName="Helvetica",
            fontSize=5.5,
            leading=7,
            textColor=HexColor("#94a3b8"),
            alignment=TA_CENTER,
        )
    )
    return s


S = styles_build()


def P(text: str, style="Body"):
    return Paragraph(str(text), S[style])


def C(text: str, bold=False):
    return Paragraph(str(text), S["CellB" if bold else "Cell"])


def CH(text: str):
    return Paragraph(str(text), S["CellH"])


def M(text: str, sm=False):
    # soft-break long paths for wrap
    t = (
        str(text)
        .replace("\\", "\\&#8203;")
        .replace("/", "/&#8203;")
        .replace(".", ".&#8203;")
        .replace("_", "_&#8203;")
        .replace("-", "-&#8203;")
    )
    return Paragraph(t, S["MonoSm" if sm else "Mono"])


def hr():
    return HRFlowable(width="100%", thickness=0.7, color=BORDER, spaceBefore=3, spaceAfter=5)


def bullets(items: list[str]):
    out = []
    for i in items:
        out.append(Paragraph(f"• {i}", S["BulletItem"]))
    return out


def section(n: str, title: str):
    return KeepTogether([Paragraph(f"{n}.  {title}", S["H1"]), hr()])


def h2(title: str):
    return Paragraph(title, S["H2"])


def make_table(headers, rows, col_widths, header_bg=HEADER_BG):
    data = [[CH(h) for h in headers]]
    for row in rows:
        cells = []
        for i, val in enumerate(row):
            if isinstance(val, tuple):
                text, kind = val
                if kind == "mono":
                    cells.append(M(text, sm=True))
                elif kind == "bold":
                    cells.append(C(text, bold=True))
                else:
                    cells.append(C(text))
            else:
                # first col often bold label
                cells.append(C(val, bold=(i == 0 and len(headers) <= 3)))
        data.append(cells)

    t = Table(data, colWidths=col_widths, repeatRows=1)
    style_cmds = [
        ("BACKGROUND", (0, 0), (-1, 0), header_bg),
        ("TEXTCOLOR", (0, 0), (-1, 0), white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 7.5),
        ("BACKGROUND", (0, 1), (-1, -1), CARD),
        ("GRID", (0, 0), (-1, -1), 0.4, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 4),
        ("RIGHTPADDING", (0, 0), (-1, -1), 4),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [CARD, LIGHT]),
    ]
    t.setStyle(TableStyle(style_cmds))
    return t


def callout_box(title: str, body: str, bg=AMBER_LT, fg=AMBER):
    inner = Table(
        [[P(f"<b>{title}</b>", "Callout")], [P(body, "Callout")]],
        colWidths=[CONTENT_W - 12],
    )
    inner.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), bg),
                ("BOX", (0, 0), (-1, -1), 1, fg),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    return inner


def code_panel(lines: list[str], title: str | None = None):
    """Wrapped mono lines in a bordered panel — no horizontal runoff."""
    cells = []
    if title:
        cells.append([P(f"<b>{title}</b>", "Small")])
    for line in lines:
        # break long lines at ~92 chars with soft hyphens via zero-width
        safe = (
            line.replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
            .replace("\\", "\\&#8203;")
            .replace("/", "/&#8203;")
            .replace(" ", " ")
        )
        cells.append([Paragraph(f"<font face='Courier' size='6.5' color='#134e4a'>{safe}</font>", S["Cell"])])
    t = Table(cells, colWidths=[CONTENT_W - 10])
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), GREEN_LT),
                ("BOX", (0, 0), (-1, -1), 0.8, GREEN),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 2),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    return t


class UIWorkspaceMock(Flowable):
    """Visual mock of the post-audit 2×2 + log layout."""

    def __init__(self, width=CONTENT_W, height=2.15 * inch):
        super().__init__()
        self.width = width
        self.height = height

    def wrap(self, aw, ah):
        return self.width, self.height

    def draw(self):
        c = self.canv
        w, h = self.width, self.height
        # outer frame
        c.setFillColor(HexColor("#0a0e18"))
        c.roundRect(0, 0, w, h, 6, fill=1, stroke=0)
        # title bar
        c.setFillColor(HexColor("#111827"))
        c.rect(0, h - 16, w, 16, fill=1, stroke=0)
        c.setFillColor(HexColor("#22d3ee"))
        c.setFont("Helvetica-Bold", 7)
        c.drawString(8, h - 11, "NEXUS OS  ·  POST-AUDIT WORKSPACE (locked tiles)")

        pad = 6
        gap = 4
        top = h - 20
        # board area
        board_h = h - 28 - 28  # leave log strip
        cell_w = (w - pad * 2 - gap) / 2
        cell_h = (board_h - gap) / 2

        tiles = [
            (pad, top - cell_h, "ANALYST", "Audit workbench · Run Privacy Audit", HexColor("#1e3a5f")),
            (pad + cell_w + gap, top - cell_h, "RESEARCH", "Notes · Funding · Jurisdiction", HexColor("#14532d")),
            (pad, top - cell_h * 2 - gap, "DESIGN LAB", "Modeler · Massing · Conditions", HexColor("#4c1d95")),
            (pad + cell_w + gap, top - cell_h * 2 - gap, "GIS ATLAS", "Deflock · Map · State/City", HexColor("#155e75")),
        ]
        for x, y, title, sub, col in tiles:
            c.setFillColor(col)
            c.roundRect(x, y, cell_w, cell_h, 4, fill=1, stroke=0)
            c.setFillColor(white)
            c.setFont("Helvetica-Bold", 8)
            c.drawCentredString(x + cell_w / 2, y + cell_h / 2 + 4, title)
            c.setFont("Helvetica", 5.5)
            c.setFillColor(HexColor("#cbd5e1"))
            c.drawCentredString(x + cell_w / 2, y + cell_h / 2 - 8, sub)

        # log strip
        c.setFillColor(HexColor("#1c1917"))
        c.roundRect(pad, 6, w - pad * 2, 22, 3, fill=1, stroke=0)
        c.setFillColor(HexColor("#fbbf24"))
        c.setFont("Helvetica-Bold", 6.5)
        c.drawString(pad + 6, 14, "LOG  ·  RSD COMPLIANCE  ·  DYNAMIC  ·  EVIDENCE-GATED")
        c.setFillColor(HexColor("#a8a29e"))
        c.setFont("Helvetica", 5.5)
        c.drawString(pad + 6, 8, "USASpending · Census · Deflock status lines append here")


class UIModelerMock(Flowable):
    """Visual of Design Lab selection cascade."""

    def __init__(self, width=CONTENT_W, height=1.15 * inch):
        super().__init__()
        self.width = width
        self.height = height

    def wrap(self, aw, ah):
        return self.width, self.height

    def draw(self):
        c = self.canv
        w, h = self.width, self.height
        c.setFillColor(HexColor("#0c1220"))
        c.roundRect(0, 0, w, h, 5, fill=1, stroke=0)
        c.setFillColor(HexColor("#c4b5fd"))
        c.setFont("Helvetica-Bold", 7)
        c.drawString(8, h - 12, "DESIGN LAB · SELECTION CASCADE (no sticky loops)")

        labels = ["1 STATE", "2 DEVICE TYPE", "3 PRODUCT", "4 CONDITION", "5 APPLY"]
        n = len(labels)
        gap = 4
        bw = (w - 16 - gap * (n - 1)) / n
        y = 14
        bh = h - 28
        colors = [
            HexColor("#164e63"),
            HexColor("#1e3a8a"),
            HexColor("#5b21b6"),
            HexColor("#9a3412"),
            HexColor("#065f46"),
        ]
        for i, (lab, col) in enumerate(zip(labels, colors)):
            x = 8 + i * (bw + gap)
            c.setFillColor(col)
            c.roundRect(x, y, bw, bh, 3, fill=1, stroke=0)
            c.setFillColor(white)
            c.setFont("Helvetica-Bold", 6.5)
            c.drawCentredString(x + bw / 2, y + bh / 2 - 2, lab)
            if i < n - 1:
                c.setStrokeColor(HexColor("#64748b"))
                c.setLineWidth(0.8)
                c.line(x + bw + 0.5, y + bh / 2, x + bw + gap - 0.5, y + bh / 2)


class UIJurisdictionMock(Flowable):
    def __init__(self, width=CONTENT_W, height=0.95 * inch):
        super().__init__()
        self.width = width
        self.height = height

    def wrap(self, aw, ah):
        return self.width, self.height

    def draw(self):
        c = self.canv
        w, h = self.width, self.height
        c.setFillColor(HexColor("#0c1220"))
        c.roundRect(0, 0, w, h, 5, fill=1, stroke=0)
        c.setFillColor(HexColor("#fcd34d"))
        c.setFont("Helvetica-Bold", 7)
        c.drawString(8, h - 12, "JURISDICTION · CITY GATED ON STATE")

        # state box
        c.setFillColor(HexColor("#1e293b"))
        c.roundRect(8, 10, w * 0.38, h - 28, 3, fill=1, stroke=0)
        c.setStrokeColor(HexColor("#22d3ee"))
        c.setLineWidth(1)
        c.roundRect(8, 10, w * 0.38, h - 28, 3, fill=0, stroke=1)
        c.setFillColor(HexColor("#67e8f9"))
        c.setFont("Helvetica-Bold", 7)
        c.drawString(14, h / 2 + 2, "STATE  [active]")
        c.setFillColor(HexColor("#94a3b8"))
        c.setFont("Helvetica", 6)
        c.drawString(14, h / 2 - 10, "TX — Texas")

        # arrow
        c.setFillColor(HexColor("#64748b"))
        c.setFont("Helvetica-Bold", 10)
        c.drawCentredString(w * 0.48, h / 2 - 3, "→")

        # city box unlocked
        c.setFillColor(HexColor("#1e293b"))
        c.roundRect(w * 0.52, 10, w * 0.44, h - 28, 3, fill=1, stroke=0)
        c.setStrokeColor(HexColor("#34d399"))
        c.roundRect(w * 0.52, 10, w * 0.44, h - 28, 3, fill=0, stroke=1)
        c.setFillColor(HexColor("#6ee7b7"))
        c.setFont("Helvetica-Bold", 7)
        c.drawString(w * 0.52 + 6, h / 2 + 2, "CITY  [unlocked]")
        c.setFillColor(HexColor("#94a3b8"))
        c.setFont("Helvetica", 6)
        c.drawString(w * 0.52 + 6, h / 2 - 10, "Austin → Deflock bbox load")


def footer(canv, doc):
    canv.saveState()
    canv.setStrokeColor(BORDER)
    canv.setLineWidth(0.4)
    canv.line(LM, 0.48 * inch, PAGE_W - RM, 0.48 * inch)
    canv.setFont("Helvetica", 7)
    canv.setFillColor(MUTED)
    canv.drawString(LM, 0.32 * inch, "Nexus RSD · Grok Rebuild Brief v0.4.1 · Human-readable · Machine-executable")
    canv.drawRightString(PAGE_W - RM, 0.32 * inch, f"{doc.page}")
    canv.restoreState()


def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    story = []

    # COVER
    story.append(Spacer(1, 0.35 * inch))
    story.append(P("NEXUS OS", "CoverH"))
    story.append(P("Roadside Surveillance Device Compliance Kit", "CoverS"))
    story.append(P("GROK LIVE REBUILD BRIEF  ·  v0.4.1  ·  2026-07-24", "CoverS"))
    story.append(hr())
    story.append(
        P(
            "This document is dual-purpose: <b>humans</b> can follow it top-to-bottom; "
            "<b>Grok / coding agents</b> can execute sections 10–11 as a build plan. "
            "All tables wrap. Long paths soft-break. UI mockups show the target shell."
        )
    )

    story.append(
        make_table(
            ["Field", "Value"],
            [
                ["Product class", "Roadside Surveillance Device Compliance Audit (device-agnostic)"],
                ["Pillars", "Funding · Distribution · Data Sharing · Density · Public Accountability"],
                ["Stack", "React 19 · TypeScript · Vite 8 · Tailwind 4 · Zustand · R3F · Leaflet"],
                ["Package", "nexus @ 0.4.1 (private)"],
                ["Default path", ("C:\\Nexus\\dev (or unzip target)", "mono")],
                ["One-shot launch", "INSTALL.bat → START.bat → http://localhost:5173"],
                ["Share zip", ("Nexus-RSD-Compliance-v0.4.0-YYYYMMDD.zip (~3.2 MB, no node_modules)", "mono")],
                ["Verify command", ("npm.cmd run build", "mono")],
            ],
            [1.35 * inch, CONTENT_W - 1.35 * inch],
            header_bg=CYAN,
        )
    )
    story.append(Spacer(1, 8))
    story.append(
        callout_box(
            "NON-NEGOTIABLES (do not violate)",
            "1) In-app first — never auto-download or auto-export.  "
            "2) Export Oversight Kit is explicit-only.  "
            "3) Every claim is Evidence / Inference / Assumption.  "
            "4) No religious or partisan branding.  "
            "5) Not a vendor-named audit class.  "
            "6) Public infrastructure mounts are typically prohibited without formal agreement.  "
            "7) Dynamic RSD-only session — no legacy cross-domain fixtures.  "
            "8) City dropdown stays disabled until a state is selected.  "
            "9) Live massing must not call selectDrawing (sticky-loop ban).",
        )
    )

    # 1 MISSION
    story.append(section("1", "Mission"))
    story.append(
        P(
            "Build a desktop-style web OS (“Nexus”) that audits roadside surveillance devices "
            "(ALPR and related). Analyst starts the audit; Research, Design Lab, GIS, and Log "
            "populate automatically. Live public APIs enrich funding and jurisdiction. After audit, "
            "tiles lock into a scaled workspace."
        )
    )
    story.append(h2("Core flows"))
    story.append(
        make_table(
            ["#", "Flow", "Result"],
            [
                ["1", "Run Privacy / ALPR Audit", "Notes + massing + layout lock"],
                ["2", "State → City (gated)", "Deflock / OSM density on map"],
                ["3", "Design Lab cascade", "Device → product → condition → massing"],
                ["4", "Deflock pin → Audit", "Site becomes full compliance package"],
                ["5", "Export Oversight Kit", "Only when user clicks Export"],
            ],
            [0.35 * inch, 1.9 * inch, CONTENT_W - 2.25 * inch],
        )
    )

    # UI visuals
    story.append(section("2", "Target UI (visual contract)"))
    story.append(P("Post-audit workspace — recreate this structure, not pixel-perfect chrome."))
    story.append(Spacer(1, 4))
    story.append(UIWorkspaceMock())
    story.append(Spacer(1, 8))
    story.append(UIModelerMock())
    story.append(Spacer(1, 8))
    story.append(UIJurisdictionMock())
    story.append(Spacer(1, 6))
    story.append(
        make_table(
            ["Surface", "Role", "Key interactions"],
            [
                ["Analyst", "Entry + workbench", "Run audit · Sample Atlanta · escalate ladder"],
                ["Research", "Session notes", "Funding · Jurisdiction · Privacy · Deployment"],
                ["Design Lab", "Modeler + matrix", "State/type/product/condition · Apply"],
                ["GIS Atlas", "Map + Deflock", "Jurisdiction picker · pins · Audit site"],
                ["Log", "RSD dynamic log", "Append-only status · Clear session only"],
            ],
            [1.1 * inch, 1.5 * inch, CONTENT_W - 2.6 * inch],
            header_bg=VIOLET,
        )
    )

    # 3 STACK
    story.append(section("3", "Stack and scripts"))
    story.append(
        make_table(
            ["Script", "Command", "Purpose"],
            [
                [("dev", "bold"), ("npm.cmd run dev", "mono"), "Vite dev server :5173"],
                [("build", "bold"), ("npm.cmd run build", "mono"), "tsc && vite build — must exit 0"],
                [("lint", "bold"), ("npm.cmd run lint", "mono"), "oxlint — 0 errors required"],
                [("preview", "bold"), ("npm.cmd run preview", "mono"), "Serve production dist"],
            ],
            [0.9 * inch, 2.0 * inch, CONTENT_W - 2.9 * inch],
        )
    )
    story.append(Spacer(1, 4))
    story.append(
        make_table(
            ["Layer", "Packages"],
            [
                ["UI", "react@19, react-dom, framer-motion, lucide-react, clsx, cva, tailwind-merge"],
                ["State", "zustand"],
                ["Map", "leaflet, react-leaflet"],
                ["3D", "three, @react-three/fiber, @react-three/drei"],
                ["Tooling", "vite@8, typescript~6, tailwindcss@4, @tailwindcss/postcss, oxlint"],
            ],
            [0.9 * inch, CONTENT_W - 0.9 * inch],
        )
    )
    story.append(P("<b>Windows rule:</b> always use <font face='Courier'>npm.cmd</font> — PowerShell npm.ps1 can block."))

    # 4 TREE
    story.append(section("4", "Repository layout"))
    story.append(
        make_table(
            ["Path", "Owns"],
            [
                [("src/App.tsx", "mono"), "Window OS, populateFromAudit, jurisdiction→Deflock, log"],
                [("src/store/nexusStore.ts", "mono"), "Audits, massing, selectDrawing, replaceActiveAudit"],
                [("src/lib/auditEngine.ts", "mono"), "runAudit — findings, ladder, massing seed"],
                [("src/lib/privacyEngine.ts", "mono"), "4A · distribution · funding separation"],
                [("src/lib/workspaceLayout.ts", "mono"), "2×2 + log strip geometry + lock"],
                [("src/lib/deflockService.ts", "mono"), "Overpass query, cache, Atlanta fallback"],
                [("src/lib/publicApi/*", "mono"), "USASpending, Census, OpenFEMA, bridges"],
                [("src/data/usJurisdiction.ts", "mono"), "50 states + ~201 cities + bboxes"],
                [("src/data/installationConditions.ts", "mono"), "Speed/curb/public-asset matrix"],
                [("src/data/engineeringCatalog.ts", "mono"), "Products per state + condition resolve"],
                [("src/components/ProductModeler.tsx", "mono"), "Cascade UI; no sticky selectDrawing"],
                [("src/components/JurisdictionPicker.tsx", "mono"), "City gated; conflict matrix panel"],
                [("vite.config.ts", "mono"), "Dev proxies for live public APIs"],
                [("INSTALL.bat / START.bat", "mono"), "One-shot install + launch"],
            ],
            [2.45 * inch, CONTENT_W - 2.45 * inch],
        )
    )

    # 5 PROXIES
    story.append(section("5", "Vite proxies (live browser data)"))
    story.append(
        make_table(
            ["Browser path", "Upstream", "Notes"],
            [
                [("/api/overpass", "mono"), ("https://overpass-api.de", "mono"), "Rewrite → /api/interpreter"],
                [("/api/usaspending", "mono"), ("https://api.usaspending.gov", "mono"), "Strip prefix"],
                [("/api/census", "mono"), ("https://geocoding.geo.census.gov", "mono"), "Geocoder"],
                [("/api/nominatim", "mono"), ("https://nominatim.openstreetmap.org", "mono"), "Rate-limit politely"],
                [("/api/openfema", "mono"), ("https://www.fema.gov", "mono"), "OpenFEMA JSON"],
            ],
            [1.45 * inch, 2.5 * inch, CONTENT_W - 3.95 * inch],
            header_bg=CYAN,
        )
    )
    story.append(P("In browser, clients call /api/*; in Node, fall back to absolute HTTPS."))

    # 6 ENGINE
    story.append(PageBreak())
    story.append(section("6", "Audit pipeline"))
    story.append(
        make_table(
            ["Step", "Function", "Writes"],
            [
                ["1", ("runAudit(opts)", "mono"), "device, spatial, findings, privacy, ladder, massing"],
                ["2", ("startAudit → store", "mono"), "activeAuditId + audit record"],
                ["3", ("enrichAuditWithUsaSpending", "mono"), "funding.liveUsaSpending + findings"],
                ["4", ("enrichAuditWithJurisdiction", "mono"), "Census/OpenFEMA notes + log"],
                ["5", "createMarkdown notes", "Research cards (session-bound)"],
                ["6", ("openAuditWorkspace", "mono"), "Tile + lock windows; contentZoom"],
            ],
            [0.4 * inch, 2.2 * inch, CONTENT_W - 2.6 * inch],
        )
    )
    story.append(h2("Evidence bridge (USASpending)"))
    story.append(
        make_table(
            ["Condition", "Class", "Rule"],
            [
                ["Award id + strong ALPR/plate text", "Evidence", "Cite award + description snippet"],
                ["Weak camera/surveillance text", "Inference", "Label as possible; not proof"],
                ["HTTP OK, zero hits", "Evidence", "Searched; none found (valid)"],
                ["Network / CORS fail", "Assumption", "missingData; never invent $"],
                ["Grants + contracts codes mixed", "—", "FORBIDDEN — split into two POSTs"],
            ],
            [2.2 * inch, 0.9 * inch, CONTENT_W - 3.1 * inch],
            header_bg=GREEN,
        )
    )

    # 7 JURISDICTION
    story.append(section("7", "Jurisdiction + Deflock"))
    story.append(
        make_table(
            ["Action", "Behavior"],
            [
                ["Select state", "City dropdown unlocks; optional state density Deflock (wide bbox, zoom ~7)"],
                ["Select city", "Metro Deflock load (tight bbox, zoom ~12); map fly; save location on active audit"],
                ["Clear", "Reset state/city; clear Deflock result note"],
                ["Reload button", "Re-run Overpass for current selection"],
                ["Overpass fail", "Fall back to Atlanta sample; log FAIL with reason"],
                ["Cache", "5-minute session cache per bbox key"],
            ],
            [1.3 * inch, CONTENT_W - 1.3 * inch],
        )
    )
    story.append(
        P(
            "Data: <font face='Courier'>usJurisdiction.ts</font> — 50 states + ~201 major cities "
            "with lat/lng and deflockDeltaDeg. Coordinates are public centroids, not survey monuments."
        )
    )

    # 8 MODELER
    story.append(section("8", "Design Lab + install matrix"))
    story.append(
        make_table(
            ["Rule", "Detail"],
            [
                ["Cascade order", "State → Device type → Product → Installation condition"],
                ["Live massing", "Debounced; updates activeMassing only — never selectDrawing"],
                ["Apply", "selectDrawing + Deployment note + append log (keep history)"],
                ["Preferred state", "Follows JurisdictionPicker state when set"],
                ["Public assets", "Each condition lists publicAssetConflicts[] with human labels"],
            ],
            [1.35 * inch, CONTENT_W - 1.35 * inch],
            header_bg=VIOLET,
        )
    )
    story.append(h2("Installation conditions (must ship full set)"))
    story.append(
        make_table(
            ["ID suffix", "Edge / context", "Typical allowance"],
            [
                ["local-curb-low-speed", "Curb & gutter · 25–35 mph", "Conditional"],
                ["local-sidewalk", "Sidewalk / furniture zone", "Conditional"],
                ["collector-curb", "Collector · 35–45 mph", "Conditional"],
                ["arterial-flush", "Flush shoulder · 45–55", "Typically prohibited"],
                ["arterial-barrier", "Barrier edge", "Typically prohibited"],
                ["freeway-clear-zone", "Controlled access", "Typically prohibited"],
                ["median", "Median multi-lane", "Typically prohibited"],
                ["bike-buffer", "Bike facility adjacent", "Typically prohibited"],
                ["school-zone", "School reduced speed", "Typically prohibited"],
                ["bridge-structure", "Bridge / overpass", "Typically prohibited"],
                ["private-lot-hoa", "Private / HOA lot", "Typically allowed"],
                ["signal-attachment", "Signal / ITS attach", "Typically prohibited"],
                ["luminaire-attachment", "Street light pole", "Typically prohibited"],
            ],
            [1.55 * inch, 2.0 * inch, CONTENT_W - 3.55 * inch],
        )
    )
    story.append(
        P(
            "Public-asset conflict types: traffic_signal, luminaire, its_cabinet, bridge_structure, "
            "guardrail, sign_structure, utility_pole_public, school_zone_device, transit_shelter, "
            "fire_hydrant_clearance, ada_path."
        )
    )

    # 9 APIS
    story.append(section("9", "API access tiers"))
    story.append(
        make_table(
            ["Source", "Auth", "Status", "Agent action"],
            [
                ["USASpending.gov", "None", "LIVE", "Keep; do not rewrite if green"],
                ["Overpass / OSM", "None", "LIVE", "Harden tags + cache"],
                ["Nominatim", "None*", "LIVE", "Forward + reverse"],
                ["Census Geocoder", "None", "LIVE", "New module OK"],
                ["OpenFEMA", "None", "LIVE", "Context only"],
                ["NDAA §889", "Static", "In-repo", "Snapshot date label"],
                ["SAM.gov", "Free key", "Not wired", "Need user key"],
                ["Congress.gov", "Free key", "Not wired", "Need user key"],
                ["CourtListener", "Free opt.", "Not wired", "Optional later"],
                ["Google / Mapbox", "PAID", "Skip", "Use Census/Nominatim"],
                ["LegiScan commercial", "PAID", "Skip", "Unless budgeted"],
            ],
            [1.35 * inch, 0.85 * inch, 0.85 * inch, CONTENT_W - 3.05 * inch],
            header_bg=GREEN,
        )
    )
    story.append(P("* Nominatim: no key, but strict usage policy — cache and rate-limit."))

    # 10 REBUILD
    story.append(section("10", "Rebuild sequence (machine-executable)"))
    story.append(P("Execute in order. Smallest compiling diff wins. Stop when build is green."))
    story.append(
        make_table(
            ["Step", "Do this", "Done when"],
            [
                ["0", "Scaffold Vite React-TS; add deps §3; Tailwind 4; proxies §5", ("package.json exists", "mono")],
                ["1", "types/audit + types/deflock + all data catalogs §4/§8", "Types compile"],
                ["2", "libs: audit, privacy, layout, deflock, location, publicApi/*", "Imports resolve"],
                ["3", "zustand store with replaceActiveAudit + locations", "startAudit works"],
                ["4", "Components: modeler, jurisdiction, deflock, massing, palette, ladder", "UI mounts"],
                ["5", "App.tsx shell + populateFromAudit + jurisdiction handlers", "Sample Atlanta layouts"],
                ["6", "INSTALL.bat, START.bat, shortcut script, README", "One-shot path clear"],
                ["7", ("npm.cmd run lint && npm.cmd run build", "mono"), "Exit code 0"],
            ],
            [0.45 * inch, 3.5 * inch, CONTENT_W - 3.95 * inch],
            header_bg=HEADER_BG,
        )
    )

    # 11 PROMPT
    story.append(section("11", "Paste-ready Grok prompt"))
    story.append(P("Copy the green panel into Grok Live / Build. Attach this PDF."))
    story.append(Spacer(1, 4))
    story.append(
        code_panel(
            [
                "You are rebuilding Nexus OS v0.4.1 — Roadside Surveillance Device Compliance Audit.",
                "GOAL: Working Vite+React+TS app per this PDF. Windows-friendly (npm.cmd).",
                "",
                "NON-NEGOTIABLES:",
                "- In-app first; Export Oversight Kit explicit-only",
                "- Evidence|Inference|Assumption; never invent award amounts",
                "- Device-agnostic class; no religious/partisan branding",
                "- Public infrastructure mounts typically_prohibited without formal agreement",
                "- Dynamic RSD-only session (no DOD/legacy fixtures)",
                "- City dropdown disabled until state selected",
                "- After audit: tile Analyst|Research / Design|GIS / Log; scale+lock",
                "- Live massing must NOT call selectDrawing",
                "- Detail ladder escalate must NOT re-run full live API enrich",
                "",
                "IMPLEMENT sections 3–10 of this brief in order.",
                "DONE WHEN: npm.cmd run build exits 0; Sample Atlanta layouts;",
                "modeler updates massing; state→city loads Deflock path.",
                "RETURN: file tree, key module summaries, residual risks.",
            ],
            title="MACHINE PROMPT — COPY ALL LINES BELOW THIS TITLE",
        )
    )

    # 12 PITFALLS
    story.append(section("12", "Pitfalls (do not regress)"))
    story.append(
        make_table(
            ["Risk", "Fix"],
            [
                ["USASpending mixed award_type_codes", "Separate grants POST and contracts POST"],
                ["Grok CLI MSYS paths", "Use C:\\ paths for --cwd and --prompt-file; no bare -p with --prompt-file"],
                ["Parallel agents thrash same file", "One owner per file; freeze publicApi/usaspending when green"],
                ["State Overpass empty/slow", "Prefer city bbox for density demos"],
                ["Sticky modeler selection", "Massing preview ≠ selectDrawing"],
                ["npm PowerShell shim", "Always npm.cmd"],
            ],
            [2.3 * inch, CONTENT_W - 2.3 * inch],
            header_bg=RED,
        )
    )

    # 13 ACCEPTANCE
    story.append(section("13", "Acceptance checklist"))
    story.append(
        make_table(
            ["ID", "Check", "Pass?"],
            [
                ["A1", "One window per type (no duplicate Analyst)", "☐"],
                ["A2", "Ctrl+K palette open/close smooth", "☐"],
                ["A3", "Sample Atlanta → layout + USASpending/Census log lines", "☐"],
                ["A4", "Design Lab cascade without freeze; massing updates", "☐"],
                ["A5", "Apply appends MODELER log + Deployment note", "☐"],
                ["A6", "Ladder escalate does not hang on full API re-enrich", "☐"],
                ["A7", "Tab lock / unlock / drag works", "☐"],
                ["A8", "Format Layout re-tiles board", "☐"],
                ["A9", "State select unlocks city; city loads Deflock on map", "☐"],
                ["A10", "Public-asset conflicts visible on prohibited conditions", "☐"],
                ["A11", "Export Oversight Kit only on button — never auto", "☐"],
                ["A12", "npm.cmd run build exit 0", "☐"],
            ],
            [0.45 * inch, CONTENT_W - 1.15 * inch, 0.7 * inch],
        )
    )

    story.append(Spacer(1, 10))
    story.append(hr())
    story.append(
        P(
            "End of brief · Nexus RSD Compliance v0.4.1 · Evidence-gated · America First | Truth-Seeking",
            "Footer",
        )
    )
    story.append(
        P(
            "Human locus of responsibility. Not legal advice. Public-data models are not certified surveys.",
            "Footer",
        )
    )

    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=letter,
        leftMargin=LM,
        rightMargin=RM,
        topMargin=0.55 * inch,
        bottomMargin=0.6 * inch,
        title="Nexus RSD Grok Rebuild Brief v0.4.1",
        author="AdventureNLearn / Nexus OS",
        subject="Human-readable machine-executable rebuild specification",
    )
    doc.build(story, onFirstPage=footer, onLaterPages=footer)

    r = PdfReader(str(OUT))
    text = "\n".join((pg.extract_text() or "") for pg in r.pages)
    checks = {
        "pages": len(r.pages),
        "GROK": "GROK" in text,
        "NON-NEGOTIABLES": "NON-NEGOTIABLES" in text,
        "MACHINE PROMPT": "MACHINE PROMPT" in text or "Paste-ready" in text,
        "npm.cmd run build": "npm.cmd run build" in text,
        "usJurisdiction": "usJurisdiction" in text,
        "selectDrawing": "selectDrawing" in text,
    }
    shutil.copy2(OUT, DESK)
    print("OUT", OUT, OUT.stat().st_size)
    print("DESK", DESK)
    for k, v in checks.items():
        print(k, v)


if __name__ == "__main__":
    build()
