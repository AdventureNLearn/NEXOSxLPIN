#!/usr/bin/env python3
"""
BROITSHERE! — Professional NEXOSxLPIN product brief.
Clean typography (Segoe UI / Calibri), high contrast, navigable structure.
"""
from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

from reportlab.lib.colors import HexColor, white
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    Flowable,
    HRFlowable,
    Image,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(r"C:\NEXOSxLPIN")
PDF_NAME = "BROITSHERE!.pdf"
PRODUCT_VER = "1.6.1"
PAGE_W, PAGE_H = letter
MARGIN = 0.7 * inch

# Professional print palette — dark ink on white
INK = HexColor("#0f172a")
MUTED = HexColor("#475569")
NAVY = HexColor("#0b1c2c")
TEAL = HexColor("#0f766e")
TEAL_LT = HexColor("#14b8a6")
LINE = HexColor("#e2e8f0")
ROW = HexColor("#f8fafc")
SOFT = HexColor("#f1f5f9")
GREEN = HexColor("#047857")
AMBER = HexColor("#b45309")
ROSE = HexColor("#be123c")


def register_fonts() -> dict[str, str]:
    """Prefer Segoe UI; fall back to Calibri / Helvetica."""
    windir = Path(r"C:\Windows\Fonts")
    pairs = {
        "Body": ["segoeui.ttf", "calibri.ttf", "arial.ttf"],
        "BodyBold": ["segoeuib.ttf", "calibrib.ttf", "arialbd.ttf"],
        "BodyLight": ["segoeuil.ttf", "calibril.ttf", "segoeui.ttf"],
        "Mono": ["consola.ttf", "cour.ttf"],
    }
    names: dict[str, str] = {}
    for logical, files in pairs.items():
        for f in files:
            p = windir / f
            if p.exists():
                try:
                    pdfmetrics.registerFont(TTFont(f"LPIN_{logical}", str(p)))
                    names[logical] = f"LPIN_{logical}"
                    break
                except Exception:
                    continue
        if logical not in names:
            names[logical] = "Helvetica-Bold" if "Bold" in logical else (
                "Courier" if logical == "Mono" else "Helvetica"
            )
    return names


F = register_fonts()


def esc(s: str) -> str:
    return (
        s.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\n", "<br/>")
    )


def P(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(esc(text), style)


def styles() -> dict[str, ParagraphStyle]:
    return {
        "kicker": ParagraphStyle(
            "kicker",
            fontName=F["BodyBold"],
            fontSize=9,
            textColor=TEAL,
            leading=12,
            spaceAfter=4,
            tracking=0.6,
        ),
        "h_cover": ParagraphStyle(
            "h_cover",
            fontName=F["BodyBold"],
            fontSize=28,
            textColor=NAVY,
            leading=32,
            spaceAfter=8,
        ),
        "sub_cover": ParagraphStyle(
            "sub_cover",
            fontName=F["Body"],
            fontSize=12,
            textColor=MUTED,
            leading=16,
            spaceAfter=6,
        ),
        "mission": ParagraphStyle(
            "mission",
            fontName=F["Body"],
            fontSize=11,
            textColor=INK,
            leading=16,
            alignment=TA_JUSTIFY,
            spaceBefore=4,
            spaceAfter=10,
        ),
        "h1": ParagraphStyle(
            "h1",
            fontName=F["BodyBold"],
            fontSize=14,
            textColor=NAVY,
            leading=18,
            spaceBefore=16,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "h2",
            fontName=F["BodyBold"],
            fontSize=11,
            textColor=TEAL,
            leading=14,
            spaceBefore=12,
            spaceAfter=5,
        ),
        "body": ParagraphStyle(
            "body",
            fontName=F["Body"],
            fontSize=10,
            textColor=INK,
            leading=14.5,
            alignment=TA_JUSTIFY,
            spaceAfter=7,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            fontName=F["Body"],
            fontSize=10,
            textColor=INK,
            leading=14,
            leftIndent=14,
            firstLineIndent=-10,
            spaceAfter=4,
        ),
        "toc": ParagraphStyle(
            "toc",
            fontName=F["Body"],
            fontSize=10,
            textColor=INK,
            leading=16,
            spaceAfter=2,
        ),
        "caption": ParagraphStyle(
            "caption",
            fontName=F["Body"],
            fontSize=8,
            textColor=MUTED,
            leading=10,
            alignment=TA_CENTER,
            spaceBefore=4,
            spaceAfter=10,
        ),
        "cell": ParagraphStyle(
            "cell",
            fontName=F["Body"],
            fontSize=9,
            textColor=INK,
            leading=12,
        ),
        "cellh": ParagraphStyle(
            "cellh",
            fontName=F["BodyBold"],
            fontSize=9,
            textColor=white,
            leading=12,
        ),
        "code": ParagraphStyle(
            "code",
            fontName=F["Mono"],
            fontSize=8.5,
            textColor=INK,
            leading=12,
            spaceAfter=3,
        ),
        "footer": ParagraphStyle(
            "footer",
            fontName=F["Body"],
            fontSize=8,
            textColor=MUTED,
            leading=10,
        ),
        "callout_t": ParagraphStyle(
            "callout_t",
            fontName=F["BodyBold"],
            fontSize=10,
            textColor=NAVY,
            leading=13,
            spaceAfter=3,
        ),
        "callout_b": ParagraphStyle(
            "callout_b",
            fontName=F["Body"],
            fontSize=9.5,
            textColor=INK,
            leading=13.5,
            alignment=TA_JUSTIFY,
        ),
    }


DESKTOPS: list[Path] = []
for p in (
    Path.home() / "OneDrive" / "Desktop",
    Path.home() / "Desktop",
    Path(r"C:\Users\Chris\OneDrive\Desktop"),
    Path(r"C:\LocalDesktop"),
):
    if p.exists() and p not in DESKTOPS:
        DESKTOPS.append(p)

LOGO = next(
    (
        c
        for c in (
            ROOT / "public" / "brand-logo.jpg",
            ROOT / "brand-logo.jpg",
            ROOT / "public" / "compass-rose.jpg",
        )
        if c.exists()
    ),
    None,
)


class CoverBand(Flowable):
    def __init__(self, w=6.6 * inch, h=1.55 * inch):
        super().__init__()
        self.width = w
        self.height = h

    def draw(self):
        c = self.canv
        w, h = self.width, self.height
        c.setFillColor(NAVY)
        c.roundRect(0, 0, w, h, 6, fill=1, stroke=0)
        c.setFillColor(TEAL_LT)
        c.rect(0, h - 5, w, 5, fill=1, stroke=0)
        # simple compass mark
        cx, cy = w - 0.85 * inch, h * 0.48
        c.setStrokeColor(TEAL_LT)
        c.setLineWidth(1.4)
        c.circle(cx, cy, 28, fill=0, stroke=1)
        c.circle(cx, cy, 10, fill=0, stroke=1)
        c.line(cx, cy - 28, cx, cy + 28)
        c.line(cx - 28, cy, cx + 28, cy)
        c.setFillColor(white)
        c.setFont(F["BodyBold"], 8)
        c.drawCentredString(cx, cy - 3, "LPIN")
        c.setFillColor(TEAL_LT)
        c.setFont(F["BodyBold"], 8)
        c.drawString(18, h - 28, "NEXOSxLPIN")
        c.setFillColor(white)
        c.setFont(F["BodyBold"], 20)
        c.drawString(18, h - 54, "Product Brief")
        c.setFont(F["Body"], 10)
        c.setFillColor(HexColor("#94a3b8"))
        c.drawString(18, h - 74, f"Version {PRODUCT_VER}  ·  100 stories  ·  Field edition")
        c.setFont(F["Body"], 8)
        c.drawString(18, 18, "Tools not media  ·  Score · Cite · Model · Flag")


class MiniUI(Flowable):
    """Clean schematic of the workbench — readable print figure."""

    def __init__(self, w=6.6 * inch, h=2.15 * inch):
        super().__init__()
        self.width = w
        self.height = h

    def draw(self):
        c = self.canv
        w, h = self.width, self.height
        c.setFillColor(SOFT)
        c.setStrokeColor(LINE)
        c.setLineWidth(1)
        c.roundRect(0, 0, w, h, 5, fill=1, stroke=1)
        # header
        c.setFillColor(NAVY)
        c.rect(0, h - 20, w, 20, fill=1, stroke=0)
        c.setFillColor(white)
        c.setFont(F["BodyBold"], 8)
        c.drawString(10, h - 13, "Workbench layout")
        c.setFont(F["Body"], 7)
        c.setFillColor(HexColor("#94a3b8"))
        c.drawRightString(w - 10, h - 13, "Map  ·  Claims  ·  Forge  ·  Massing")
        # three columns
        cols = [
            (0.04, "Desk map", "Pins switch stories\nLarge map + brief"),
            (0.36, "Claims", "Score +1 / 0 / −1\nSources attached"),
            (0.68, "Scene", "Story objects in 3D\nVehicle · path · crowd"),
        ]
        for x_frac, title, body in cols:
            x = w * x_frac
            cw = w * 0.28
            c.setFillColor(white)
            c.setStrokeColor(LINE)
            c.roundRect(x, 12, cw, h - 42, 4, fill=1, stroke=1)
            c.setFillColor(TEAL)
            c.setFont(F["BodyBold"], 8)
            c.drawString(x + 8, h - 48, title)
            c.setFillColor(MUTED)
            c.setFont(F["Body"], 7)
            for i, line in enumerate(body.split("\n")):
                c.drawString(x + 8, h - 64 - i * 11, line)
            # tiny visual cue
            if title == "Scene":
                c.setFillColor(TEAL_LT)
                c.rect(x + 14, 28, 28, 14, fill=1, stroke=0)
                c.setFillColor(AMBER)
                c.circle(x + 58, 35, 7, fill=1, stroke=0)
                c.setFillColor(MUTED)
                c.circle(x + 78, 32, 4, fill=1, stroke=0)
                c.circle(x + 88, 36, 4, fill=1, stroke=0)
                c.circle(x + 96, 30, 4, fill=1, stroke=0)


class StepBar(Flowable):
    def __init__(self, w=6.6 * inch, h=0.72 * inch):
        super().__init__()
        self.width = w
        self.height = h

    def draw(self):
        c = self.canv
        steps = ["1 Open desk", "2 Score claims", "3 Verify", "4 Build scene", "5 Export"]
        n = len(steps)
        bw = (self.width - 8) / n - 4
        for i, s in enumerate(steps):
            x = 4 + i * (bw + 4)
            c.setFillColor(white)
            c.setStrokeColor(TEAL if i == 0 else LINE)
            c.setLineWidth(1.2 if i == 0 else 0.8)
            c.roundRect(x, 8, bw, self.height - 16, 4, fill=1, stroke=1)
            c.setFillColor(NAVY)
            c.setFont(F["BodyBold"], 7.5)
            c.drawCentredString(x + bw / 2, self.height / 2 - 2, s)


def header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0, PAGE_H - 30, PAGE_W, 30, fill=1, stroke=0)
    canvas.setFillColor(TEAL_LT)
    canvas.rect(0, PAGE_H - 32, PAGE_W, 2, fill=1, stroke=0)
    canvas.setFillColor(white)
    canvas.setFont(F["BodyBold"], 8)
    canvas.drawString(MARGIN, PAGE_H - 18, "NEXOSxLPIN")
    canvas.setFont(F["Body"], 8)
    canvas.setFillColor(HexColor("#94a3b8"))
    canvas.drawRightString(PAGE_W - MARGIN, PAGE_H - 18, f"Product Brief  ·  {PRODUCT_VER}")
    canvas.setFillColor(SOFT)
    canvas.rect(0, 0, PAGE_W, 26, fill=1, stroke=0)
    canvas.setStrokeColor(TEAL)
    canvas.setLineWidth(1)
    canvas.line(0, 26, PAGE_W, 26)
    canvas.setFillColor(MUTED)
    canvas.setFont(F["Body"], 7.5)
    canvas.drawString(MARGIN, 10, "C:\\NEXOSxLPIN")
    canvas.drawRightString(PAGE_W - MARGIN, 10, f"{doc.page}")
    canvas.restoreState()


def table(headers, rows, widths, st):
    data = [[P(h, st["cellh"]) for h in headers]]
    for r in rows:
        data.append([P(str(c), st["cell"]) for c in r])
    t = Table(data, colWidths=widths, repeatRows=1)
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), NAVY),
                ("BACKGROUND", (0, 1), (-1, -1), white),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, ROW]),
                ("GRID", (0, 0), (-1, -1), 0.5, LINE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    return t


def callout(title: str, body: str, st):
    t = Table(
        [[P(title, st["callout_t"])], [P(body, st["callout_b"])]],
        colWidths=[6.5 * inch],
    )
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), HexColor("#f0fdfa")),
                ("BOX", (0, 0), (-1, -1), 1.5, TEAL),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    return t


def rule():
    return HRFlowable(width="100%", thickness=0.8, color=LINE, spaceBefore=4, spaceAfter=8)


def build(st):
    story = []
    stamp = datetime.now(timezone.utc).strftime("%d %b %Y")

    # —— Cover ——
    story.append(CoverBand())
    story.append(Spacer(1, 12))

    if LOGO and LOGO.exists():
        try:
            logo = Image(str(LOGO), width=0.7 * inch, height=0.7 * inch)
            head = Table(
                [
                    [
                        logo,
                        P(
                            f"<b>Lily Pad Intelligence Network</b><br/>"
                            f"Confidential product brief  ·  {stamp}<br/>"
                            f"Root: C:\\NEXOSxLPIN  ·  {PRODUCT_VER}  ·  100 desks",
                            st["sub_cover"],
                        ),
                    ]
                ],
                colWidths=[0.85 * inch, 5.6 * inch],
            )
            head.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "MIDDLE")]))
            story.append(head)
            story.append(Spacer(1, 6))
        except Exception:
            pass

    story.append(P("MISSION", st["kicker"]))
    story.append(
        P(
            "NEXOSxLPIN is a verification workbench. It helps operators score claims, "
            "attach sources, and build only the scene objects a story actually needs — "
            "without treating rumor as fact.",
            st["mission"],
        )
    )
    story.append(
        callout(
            "Operating principle",
            "Prefer primary records over posts. Prefer instruments over headlines. "
            "If something is only plausible, label it that way. Never launder uncertainty into certainty.",
            st,
        )
    )

    story.append(P("Contents", st["h1"]))
    for line in [
        "1.  What this product is",
        "2.  How to run a desk",
        "3.  Score language",
        "4.  Claims and verification",
        "5.  Story scenes (Forge and Massing)",
        "6.  Platform inventory",
        "7.  Workspace modes",
        "8.  Install and quality gates",
        "9.  Key files for rebuild",
        "10. Security notes",
    ]:
        story.append(P(line, st["toc"]))

    story.append(PageBreak())

    # —— 1 ——
    story.append(P("1. What this product is", st["h1"]))
    story.append(
        P(
            "NEXOSxLPIN is not a news feed and not a social dashboard. It is a structured "
            "surface for investigation training: load a desk, work the claims, run specialist "
            "lenses, and only then export.",
            st["body"],
        )
    )
    story.append(
        P(
            "Each desk ships with a story brief, map pin, claim ledger, sources, and — when "
            "relevant — 3D scene objects derived from those claims (vehicle, path, crowd, "
            "docket stack, vessel, debris, and similar). Geometry is illustrative. It is not "
            "a forensic reconstruction.",
            st["body"],
        )
    )
    story.append(Spacer(1, 4))
    story.append(MiniUI())
    story.append(P("Figure 1. Workbench layout: map, claims, and story scene.", st["caption"]))

    # —— 2 ——
    story.append(P("2. How to run a desk", st["h1"]))
    story.append(StepBar())
    story.append(Spacer(1, 6))
    steps = [
        ("Open a desk", "Use the story switcher or click a map pin. Trend desks and 56 congressional training desks are available."),
        ("Read the brief", "Note stakes, known facts, and open questions before scoring."),
        ("Score claims", "In Claims, set +1 / 0 / −1. Bind +1 lines to sources. Rebuild sourced claims if the ledger looks empty or generic."),
        ("Verify", "Run multi-loop verify: structure, sources, scores, duplicates, export readiness."),
        ("Build the scene", "Open Massing Viewer or Forge. The desk auto-seeds story objects. Use Full scene to see them together."),
        ("Export only when clean", "Clear open −1 blocks and pass Layer-0 gates before publish pack or code export."),
    ]
    for title, body in steps:
        story.append(P(f"• <b>{title}.</b> {body}", st["bullet"]))

    # —— 3 ——
    story.append(P("3. Score language", st["h1"]))
    story.append(
        P(
            "The product uses three scores only. This is intentional. It keeps operators from "
            "sliding into soft language that hides risk.",
            st["body"],
        )
    )
    story.append(
        table(
            ["Score", "Meaning", "Operator action"],
            [
                ["+1 Supported", "Primary or strong secondary material backs the line.", "Keep, cite, model as supported."],
                ["0 Not proven", "Plausible or incomplete — not ready as fact.", "Hold. Model only with an explicit “plausible / unverified” flag."],
                ["−1 Disputed", "Conflicts with better evidence, or fails a method gate.", "Do not treat as fact. May appear as a contested locus in the scene."],
            ],
            [1.2 * inch, 2.55 * inch, 2.75 * inch],
            st,
        )
    )
    story.append(Spacer(1, 8))
    story.append(
        callout(
            "Honesty rule",
            "If a claim is believable but has no bound primary source, it may still appear in the "
            "scene — only with a clear “plausible / unverified” label. That label is part of the product, not decoration.",
            st,
        )
    )

    # —— 4 ——
    story.append(P("4. Claims and verification", st["h1"]))
    story.append(
        P(
            "The Claims module is the ledger. Each line should be story-specific, sourced, and free of "
            "template boilerplate. A multi-loop check runs structure, source binding, score hygiene, "
            "near-duplicate removal, and export readiness.",
            st["body"],
        )
    )
    story.append(
        P(
            "Optional: the Grok research agent builds a verification prompt from the desk context and "
            "opens public Grok (or copies the prompt). No API key is stored in the browser.",
            st["body"],
        )
    )

    story.append(PageBreak())

    # —— 5 ——
    story.append(P("5. Story scenes (Forge and Massing)", st["h1"]))
    story.append(
        P(
            "Procedural Forge and Massing Viewer turn claim language into readable 3D stand-ins. "
            "The system does not invent a city. It selects objects that the story actually mentions "
            "or requires for oversight desks (for example a docket stack and facility massing).",
            st["body"],
        )
    )
    story.append(P("How selection works", st["h2"]))
    for line in [
        "Read claims and evidence for the active desk.",
        "Match physical or process nouns (vehicle, path, crowd, vessel, debris, records, drone, firebreak, and similar).",
        "Merge curated story packs when they exist.",
        "Rank by importance; attach a verifiability flag from the claim score and sources.",
        "Remove near-duplicates; seed the top objects into Massing.",
    ]:
        story.append(P(f"• {line}", st["bullet"]))

    story.append(P("Mesh families (what you see)", st["h2"]))
    story.append(
        table(
            ["If the story involves…", "Scene object"],
            [
                ["Vehicle / car / truck", "Vehicle body (cabin, wheels)"],
                ["Path / sidewalk / corridor", "Path strip with incident pin"],
                ["Crowd / pedestrians", "Crowd cluster"],
                ["Fire / firebreak", "Firebreak line"],
                ["Ship / boat / port", "Vessel hull on water"],
                ["Debris / quake / rescue", "Debris pile"],
                ["Records / bill / export control", "Docket stack on a bench"],
                ["Drone / UAS", "Pad and airframe"],
                ["Building / venue / foundry", "Building massing"],
                ["Media / broadcast", "Media riser"],
                ["Refuge / muster", "Refuge canopy"],
            ],
            [3.0 * inch, 3.5 * inch],
            st,
        )
    )
    story.append(Spacer(1, 8))
    story.append(
        P(
            "Massing offers Full scene (all seeded objects side by side) and Solo object (one mesh with "
            "flags and reasoning). Claim Status P0 locks Spec colors everywhere they appear today: "
            "+1 supported #22c55e, 0 hold #f59e0b, −1 disputed #f43f5e, and plausible / unverified #a78bfa "
            "(honesty flag — not a fourth score). Map pins follow highest-stakes claim on the desk. "
            "Geometry remains illustrative, never forensic.",
            st["body"],
        )
    )

    # —— 6 ——
    story.append(P("6. Platform inventory", st["h1"]))
    story.append(
        table(
            ["Component", "Status"],
            [
                ["Investigation desks", "100 total (kept category tops)"],
                ["Citizen journalism / trends", "10 detailed tops retained"],
                ["Congressional / industry-effect", "56 desks retained"],
                ["Geopolitical (new)", "10 detailed desks (SCS, Sahel, Red Sea, Taiwan, Arctic, Balkans, Caucasus, DPRK, minerals, Caribbean)"],
                ["Topical expansion", "23 desks across infrastructure, health, cyber, climate, markets, elections, tech"],
                ["SME lenses", "252 specialized lenses with adjudication rules"],
                ["Mesh families", "105 unique families · multi-select spatial stage"],
                ["Modules", "10 (Information through Export Kit)"],
                ["Evidence language", "+1 / 0 / −1 only · plausible / unverified honesty flag"],
                ["Claim Status Visual (P0)", "Rail + badge + text · Spec colors · map pin highest-stakes"],
                ["UI Supercharge Spec", "docs\\NEXOSxLPIN_UI_Supercharge_Spec_v1.0.md (locked)"],
                ["Imagine visual sequence", "docs\\NEXOSxLPIN_Imagine_15_Prompt_Sequence.md (reference only)"],
                ["Product version", f"{PRODUCT_VER} · P0 claim status shipped"],
            ],
            [2.2 * inch, 4.3 * inch],
            st,
        )
    )
    story.append(P("Story catalogue (topics)", st["h2"]))
    story.append(
        table(
            ["Topic", "What it trains"],
            [
                ["Geopolitical", "Maritime, corridors, drills, minerals, migration intercepts — primary hierarchy under fog"],
                ["Infrastructure", "Grid, bridges, ports, rail hazmat"],
                ["Public health", "Zoonosis, hospital cyber, drug shortages"],
                ["Cyber security", "Municipal ransomware, telecom outages, synthetic officials"],
                ["Climate & extreme", "Heat, flood gauges, smoke AQI"],
                ["Markets & finance", "Bank rumors, sanctions shipping, commodity squeezes"],
                ["Elections process", "Ballot cure, pollbooks, AI robocalls"],
                ["Tech governance", "App-store remedies, model evals, biometric bans, open-weights export"],
                ["Congressional", "Industry-effect oversight desks (agency + Congress hierarchy)"],
                ["Citizen journalism", "High-velocity trend desks (Berlin CSD top, plus nine retained tops)"],
            ],
            [1.8 * inch, 4.7 * inch],
            st,
        )
    )

    # —— 7 ——
    story.append(P("7. Workspace modes", st["h1"]))
    story.append(
        table(
            ["Mode", "Use when"],
            [
                ["Tabs", "You want one full-height module at a time."],
                ["Tiles", "You want several modules visible; drag headers to reorder; drag splitters to resize; maximize any pane."],
                ["Immersive", "You want a dense HUD-style stage."],
            ],
            [1.4 * inch, 5.1 * inch],
            st,
        )
    )

    story.append(PageBreak())

    # —— 8 ——
    story.append(P("8. Install and quality gates", st["h1"]))
    story.append(P("Launch", st["h2"]))
    story.append(P("Desktop shortcut: NEXOSxLPIN.lnk", st["bullet"]))
    story.append(P("Or: START.bat in C:\\NEXOSxLPIN  →  http://127.0.0.1:5173", st["bullet"]))
    story.append(P("Fresh machine: INSTALL.bat (Node LTS, install, build, shortcuts)", st["bullet"]))

    story.append(P("Quality gates (must pass)", st["h2"]))
    for cmd in [
        "cd /d C:\\NEXOSxLPIN",
        "npm.cmd run test",
        "npm.cmd run lint",
        "npm.cmd run build",
        "node scripts\\smoke-sme-congress.mjs",
    ]:
        story.append(P(cmd, st["code"]))

    story.append(P("Packaging", st["h2"]))
    for cmd in [
        "python scripts\\build_share_zip.py",
        "powershell -File scripts\\create-desktop-shortcut.ps1",
        "python scripts\\gen_broitshere_pdf.py",
    ]:
        story.append(P(cmd, st["code"]))

    story.append(P("Ship locations", st["h2"]))
    story.append(
        table(
            ["Artifact", "Path"],
            [
                ["Product root", "C:\\NEXOSxLPIN"],
                ["Share zip", f"releases\\NEXOSxLPIN-{PRODUCT_VER}-*.zip"],
                ["This brief", "LocalDesktop\\BROITSHERE!.pdf · docs\\BROITSHERE!.pdf"],
                ["Desktop launch", "NEXOSxLPIN.lnk → launch-nexos.vbs → START.bat"],
                ["Imagine refs", "docs\\NEXOSxLPIN_Imagine_15_Prompt_Sequence.md (no code change)"],
                ["Shortcut", "NEXOSxLPIN.lnk"],
                ["Corpus seeds", "src\\data\\useCases\\corpusSeeds100.json + storyCorpus100.ts"],
            ],
            [1.6 * inch, 4.9 * inch],
            st,
        )
    )

    # —— 9 ——
    story.append(P("9. Key files for rebuild", st["h1"]))
    story.append(
        P(
            "Hand this brief and the zip to an engineer or agent. Start with these paths:",
            st["body"],
        )
    )
    story.append(
        table(
            ["Path", "Role"],
            [
                ["src/lib/forge/objectReasoning.ts", "Selects and ranks story objects; verifiability flags"],
                ["src/lib/forge/sceneMeshes.ts", "3D mesh families (vehicle, path, crowd, vessel, …)"],
                ["src/lib/forge/generators.ts", "Asset generation and Unity / Three export"],
                ["src/components/modules/MassingViewerModule.tsx", "Scene and solo 3D view"],
                ["src/components/modules/ProceduralForgeModule.tsx", "Object list, seed, build"],
                ["src/lib/verify/claimLedger.ts", "Sourced claim ledger"],
                ["src/lib/verify/pipeline.ts", "Multi-loop verification"],
                ["src/store/platformStore.ts", "Desk load, seed, workspace state"],
                ["src/data/useCases/", "Stories, desks, sources, simulations"],
            ],
            [3.15 * inch, 3.35 * inch],
            st,
        )
    )

    # —— 10 ——
    story.append(P("10. Security notes", st["h1"]))
    for line in [
        "No secrets or personal data in sample packs.",
        "External links are opened only if they pass a safe-URL check.",
        "Content Security Policy and referrer policy are set in index.html.",
        "Training desks are not legal advice; scores are operator hygiene, not judicial findings.",
        "Export actions can be blocked by Layer-0 until acknowledged and −1 lines are resolved.",
    ]:
        story.append(P(f"• {line}", st["bullet"]))

    story.append(Spacer(1, 16))
    story.append(rule())
    story.append(
        P(
            "End of brief. Regenerate with:  python scripts\\gen_broitshere_pdf.py",
            st["caption"],
        )
    )
    return story


def write(path: Path, st):
    path.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(path),
        pagesize=letter,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=0.55 * inch,
        bottomMargin=0.48 * inch,
        title=f"NEXOSxLPIN Product Brief {PRODUCT_VER}",
        author="NEXOSxLPIN",
    )
    doc.build(build(st), onFirstPage=header_footer, onLaterPages=header_footer)
    print(f"WROTE {path}  ({path.stat().st_size:,} bytes)")


def main():
    st = styles()
    outs = [ROOT / "docs" / PDF_NAME]
    for d in DESKTOPS:
        outs.append(d / PDF_NAME)
    seen: set[str] = set()
    for out in outs:
        key = str(out)
        if key in seen:
            continue
        seen.add(key)
        write(out, st)


if __name__ == "__main__":
    main()
