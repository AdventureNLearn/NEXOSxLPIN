"""Generate Open Ecosystem Development Plan v2.0 experimental overview PDF."""
from pathlib import Path
import shutil

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
)

OUT = Path("docs/NEXOSxLPIN_Open_Ecosystem_Development_Plan_v2.pdf")
SLATE = HexColor("#0f172a")
MUTED = HexColor("#64748b")


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(
        0.75 * inch,
        0.45 * inch,
        "NEXOSxLPIN  ·  Open Ecosystem Development Plan v2.0  ·  EXPERIMENTAL  ·  Transparent · Evidence-First",
    )
    canvas.drawRightString(letter[0] - 0.75 * inch, 0.45 * inch, str(doc.page))
    canvas.restoreState()


def main() -> None:
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="CoverTitle",
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=26,
            textColor=SLATE,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="CoverSub",
            fontName="Helvetica",
            fontSize=11,
            leading=15,
            textColor=MUTED,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="H1",
            fontName="Helvetica-Bold",
            fontSize=14,
            leading=18,
            textColor=SLATE,
            spaceBefore=14,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Body",
            fontName="Helvetica",
            fontSize=9.5,
            leading=13,
            textColor=SLATE,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="PlanBullet",
            fontName="Helvetica",
            fontSize=9.5,
            leading=12.5,
            textColor=SLATE,
            leftIndent=12,
            spaceAfter=3,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Meta",
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=MUTED,
            spaceAfter=4,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Spine",
            fontName="Helvetica-Oblique",
            fontSize=9,
            leading=12,
            textColor=MUTED,
            spaceBefore=8,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Cell",
            fontName="Helvetica",
            fontSize=8.5,
            leading=11,
            textColor=SLATE,
        )
    )
    styles.add(
        ParagraphStyle(
            name="CellH",
            fontName="Helvetica-Bold",
            fontSize=8.5,
            leading=11,
            textColor=SLATE,
        )
    )

    story = []
    story.append(Spacer(1, 1.2 * inch))
    story.append(Paragraph("NEXOSxLPIN", styles["CoverTitle"]))
    story.append(Paragraph("Open Ecosystem Development Plan", styles["CoverTitle"]))
    story.append(Spacer(1, 0.15 * inch))
    story.append(
        Paragraph(
            "Experimental public verification workbench — branching civic topics with full transparency, "
            "skill citations, visual assistant coherence, 3D illustrative path, and an open iteration model anyone can run.",
            styles["CoverSub"],
        )
    )
    story.append(Spacer(1, 0.2 * inch))
    story.append(
        Paragraph(
            "<b>Version 2.0</b> · 26 July 2026 · Channel: <b>EXPERIMENTAL</b> · Designed for open distribution",
            styles["Meta"],
        )
    )
    story.append(
        Paragraph("America First · Truth-Seeking · Evidence over narrative", styles["Meta"])
    )
    story.append(
        Paragraph(
            "Prefer primary records over posts. Prefer instruments over headlines. Never launder uncertainty into certainty.",
            styles["Spine"],
        )
    )
    story.append(
        Paragraph(
            "<b>GitHub:</b> https://github.com/AdventureNLearn/NEXOSxLPIN &nbsp;·&nbsp; "
            "<b>Skills:</b> https://github.com/AdventureNLearn/AOS-v3---LPIN",
            styles["Meta"],
        )
    )
    story.append(PageBreak())

    story.append(Paragraph("1. Purpose of this document", styles["H1"]))
    story.append(
        Paragraph(
            "This plan explains how the full NEXOSxLPIN + LPIN skill stack moves beyond any single first domain "
            "into dynamic civic topics while preserving evidence discipline. It is written for <b>open distribution</b>: "
            "every claim about architecture is traceable to public skill and product surfaces, and every contribution path is explicit.",
            styles["Body"],
        )
    )
    story.append(
        Paragraph(
            "The stack has two permanent layers: (1) the <b>skill / governance layer</b> (LPIN / AOS v3.0) that enforces "
            "Evidence / Inference / Assumption separation, Layer-0 gates, and multi-agent orchestration; and (2) the "
            "<b>runnable verification workbench</b> that turns those rules into desks, claim ledgers, maps, and illustrative 3D scenes. "
            "The workbench is deliberately domain-swappable. Version 2.0 adds an <b>experimental public channel</b>, "
            "a Visual Assistant coach, quieter immersive chrome, and OPSEC durability for public clones.",
            styles["Body"],
        )
    )

    story.append(
        Paragraph("2. Non-negotiable discipline (must survive every branch)", styles["H1"])
    )
    story.append(
        Paragraph("Any fork or topic adaptation is only valid if these remain intact:", styles["Body"])
    )
    for b in [
        "<b>Evidence-gated claims</b> — Statements appear only after primary or strong secondary sources are bound. No invented numbers.",
        "<b>Tri-state + honesty flag</b> — +1 Supported, 0 Not proven, −1 Disputed. No soft intermediate scores.",
        "<b>Layer-0 export gates</b> — High-stakes actions blocked while unresolved −1 claims exist.",
        "<b>Progressive disclosure</b> — Families before desks; Experts closed by default; advanced 3D after verification loops.",
        "<b>Explicit export only</b> — Nothing auto-downloads. Share packs are deliberate operator actions.",
        "<b>Illustrative geometry only</b> — 3D stand-ins from scored claims. Never forensic reconstructions.",
        "<b>Experimental honesty</b> — Channel labels remain visible until maturity is earned.",
        "<b>OPSEC / PII</b> — No secrets, no private personal data in sample packs; high-level selectors until focus is defined.",
    ]:
        story.append(Paragraph("• " + b, styles["PlanBullet"]))

    story.append(Paragraph("3. Relevant GitHub skills and how they map", styles["H1"]))
    story.append(
        Paragraph(
            "Permanent governance layer: AdventureNLearn/AOS-v3---LPIN. "
            "Skills most exercised when the workbench branches into new civic topics:",
            styles["Body"],
        )
    )
    skill_data = [
        [
            Paragraph("<b>Skill</b>", styles["CellH"]),
            Paragraph("<b>Role in branching topics</b>", styles["CellH"]),
            Paragraph("<b>Typical activation</b>", styles["CellH"]),
        ],
        [
            Paragraph("evidence-gate", styles["Cell"]),
            Paragraph("Forces +1 / 0 / −1; blocks export on open −1", styles["Cell"]),
            Paragraph("Every claim score and export path", styles["Cell"]),
        ],
        [
            Paragraph("sovereign-lens", styles["Cell"]),
            Paragraph("Module-0 routing + narrative integrity", styles["Cell"]),
            Paragraph("High-stakes or media-adjacent desks", styles["Cell"]),
        ],
        [
            Paragraph("4-agent-orchestration", styles["Cell"]),
            Paragraph("Structured multi-agent hand-offs", styles["Cell"]),
            Paragraph("Complex multi-source audits (Deep run planned)", styles["Cell"]),
        ],
        [
            Paragraph("mission-spine-guard", styles["Cell"]),
            Paragraph("Truth-seeking primacy alignment", styles["Cell"]),
            Paragraph("All Tier-1 outputs", styles["Cell"]),
        ],
        [
            Paragraph("civic-intelligence-coordinator", styles["Cell"]),
            Paragraph("Permits, public-records, oversight, jurisdiction", styles["Cell"]),
            Paragraph("Any civic domain fork", styles["Cell"]),
        ],
        [
            Paragraph("public-records-forensics", styles["Cell"]),
            Paragraph("Permits, contracts, minutes analysis", styles["Cell"]),
            Paragraph("Source binding and ledger hygiene", styles["Cell"]),
        ],
        [
            Paragraph("oversight-kit-builder", styles["Cell"]),
            Paragraph("Evidence bundles for citizen accountability", styles["Cell"]),
            Paragraph("Share / Export Kit generation", styles["Cell"]),
        ],
        [
            Paragraph("gis-layer", styles["Cell"]),
            Paragraph("Leaflet/map layers, public spatial data", styles["Cell"]),
            Paragraph("Map + investigation layers", styles["Cell"]),
        ],
    ]
    t = Table(skill_data, colWidths=[1.55 * inch, 2.85 * inch, 2.1 * inch])
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), HexColor("#e2e8f0")),
                ("GRID", (0, 0), (-1, -1), 0.4, HexColor("#cbd5e1")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ]
        )
    )
    story.append(t)
    story.append(Spacer(1, 0.1 * inch))
    story.append(
        Paragraph(
            "In-repo abstracts: docs/skills-reference/INDEX.md. LLM adoption: docs/LLM_REASONING_FRAMEWORK.md.",
            styles["Body"],
        )
    )

    story.append(Paragraph("4. Workbench surfaces (v2.0 experimental)", styles["H1"]))
    story.append(
        Paragraph(
            "Runnable product: github.com/AdventureNLearn/NEXOSxLPIN · MIT · Node LTS.",
            styles["Body"],
        )
    )
    surf = [
        [
            Paragraph("<b>Surface</b>", styles["CellH"]),
            Paragraph("<b>Maturity</b>", styles["CellH"]),
            Paragraph("<b>Role</b>", styles["CellH"]),
        ],
        [
            Paragraph("First-run picker", styles["Cell"]),
            Paragraph("Beta", styles["Cell"]),
            Paragraph("Single clean path before chrome unlocks", styles["Cell"]),
        ],
        [
            Paragraph("Claims ledger", styles["Cell"]),
            Paragraph("Stable-ish core", styles["Cell"]),
            Paragraph("Atomic +1 / 0 / −1 board of truth", styles["Cell"]),
        ],
        [
            Paragraph("Map + basemaps", styles["Cell"]),
            Paragraph("Beta", styles["Cell"]),
            Paragraph("Public geography; investigation layers", styles["Cell"]),
        ],
        [
            Paragraph("Visual Assistant", styles["Cell"]),
            Paragraph("Beta", styles["Cell"]),
            Paragraph("Here / Why / Next coach; coherence spine", styles["Cell"]),
        ],
        [
            Paragraph("Immersive stage", styles["Cell"]),
            Paragraph("Beta", styles["Cell"]),
            Paragraph("Claims toggle; Experts off by default; 5 Focus tabs", styles["Cell"]),
        ],
        [
            Paragraph("Experts (252 SME)", styles["Cell"]),
            Paragraph("Lab", styles["Cell"]),
            Paragraph("Confirm-apply checklists — not licenses", styles["Cell"]),
        ],
        [
            Paragraph("3D / Massing / Forge", styles["Cell"]),
            Paragraph("Lab", styles["Cell"]),
            Paragraph("Illustrative stand-ins; scale-accurate inspect", styles["Cell"]),
        ],
        [
            Paragraph("Share pack", styles["Cell"]),
            Paragraph("Stable-ish core", styles["Cell"]),
            Paragraph("Hard-block on open −1; Layer-0 ACK; experimental disclaimer", styles["Cell"]),
        ],
    ]
    t2 = Table(surf, colWidths=[1.5 * inch, 1.1 * inch, 3.9 * inch])
    t2.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), HexColor("#e2e8f0")),
                ("GRID", (0, 0), (-1, -1), 0.4, HexColor("#cbd5e1")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 3),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
            ]
        )
    )
    story.append(t2)

    story.append(Paragraph("5. Operator loop (high agency)", styles["H1"]))
    story.append(
        Paragraph(
            "<b>Orient → Score → Source → Place → Challenge (−1) → optional Model → Share</b>",
            styles["Body"],
        )
    )
    story.append(
        Paragraph(
            "If lost: read the Assistant bar and press Go. Experts, Rules, Depth, and Commands stay optional.",
            styles["Body"],
        )
    )

    story.append(Paragraph("6. Branching a new civic topic (fork path)", styles["H1"]))
    for b in [
        "Clone the workbench; keep Layer-0 and tri-state intact.",
        "Add a desk pack (stories, honest default claims, public sources only).",
        "Bind map pins only with public lat/lng; no private homes.",
        "Optional mesh families for illustrative sketches — claim-linked.",
        "Run npm test, lint, build, and smoke.",
        "Document maturity (stable / beta / lab) for anything unfinished.",
    ]:
        story.append(Paragraph("• " + b, styles["PlanBullet"]))
    story.append(
        Paragraph(
            "Detail: docs/FORKING_A_TOPIC_PACK.md · docs/OPEN_DEVELOPMENT.md.",
            styles["Body"],
        )
    )

    story.append(Paragraph("7. Experimental channel and honesty", styles["H1"]))
    story.append(
        Paragraph(
            "This release is explicitly <b>EXPERIMENTAL</b>. UI will change. Assistive autonomy "
            "(claim miner, contradiction scan, SME top-3) is planned, not fully shipped. "
            "In-product amber badge, Share disclaimer, Guide status, and README callout prevent finished-product misread.",
            styles["Body"],
        )
    )
    story.append(Paragraph("See docs/EXPERIMENTAL_STATUS.md.", styles["Body"]))

    story.append(Paragraph("8. OPSEC and local machine safety", styles["H1"]))
    story.append(
        Paragraph(
            "Public tree excludes secrets, path-bound maintainer handoffs, dogfood screenshots, and release zips. "
            "Install scripts only run local npm install/build and bind Vite to 127.0.0.1. "
            "No admin elevation, no credential harvest, no destructive system scripts.",
            styles["Body"],
        )
    )
    story.append(
        Paragraph(
            "docs/OPSEC_PUBLIC_RELEASE.md · docs/LOCAL_MACHINE_SAFETY.md · docs/PII_AND_AGNOSTIC_POLICY.md.",
            styles["Body"],
        )
    )

    story.append(Paragraph("9. 3D refinement path", styles["H1"]))
    story.append(
        Paragraph(
            "Geometry remains illustrative. Scale-accurate map features use public basemaps and meter footprints. "
            "Auto-scale eases zoom for inspection. Full-scene status rims and Solo claim panel remain backlog. "
            "Contract: docs/3D_ILLUSTRATIVE_CONTRACT.md.",
            styles["Body"],
        )
    )

    story.append(Paragraph("10. Roadmap (post-publish)", styles["H1"]))
    for b in [
        "Wire map layer toggles to pin visibility",
        "SME top-3 recommender (confirm-apply)",
        "Claim miner (propose at score 0 only)",
        "Contradiction assistant to proposed −1",
        "Mobile chrome diet / Solo-map default preference",
        "Optional Deep-run multi-agent behind explicit button",
    ]:
        story.append(Paragraph("• " + b, styles["PlanBullet"]))

    story.append(Paragraph("11. Quality gates", styles["H1"]))
    story.append(
        Paragraph(
            "npm test &amp;&amp; npm run lint &amp;&amp; npm run build &amp;&amp; node scripts/smoke-sme-congress.mjs",
            styles["Body"],
        )
    )
    story.append(
        Paragraph(
            "v2.0.0-experimental verified prior to publish: unit tests green · 0 lint · production build · smoke OK.",
            styles["Body"],
        )
    )

    story.append(Paragraph("12. Spine", styles["H1"]))
    story.append(
        Paragraph(
            "Noise arrives → you score claims → you demand sources → you map without fake forensics → "
            "you share only what survives → narratives get smashed; supported truth gets projected — "
            "tools raise human agency; they do not replace judgment.",
            styles["Spine"],
        )
    )
    story.append(Paragraph("America First | Truth-Seeking", styles["Meta"]))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=letter,
        leftMargin=0.75 * inch,
        rightMargin=0.75 * inch,
        topMargin=0.7 * inch,
        bottomMargin=0.7 * inch,
        title="NEXOSxLPIN Open Ecosystem Development Plan v2.0",
        author="NEXOSxLPIN",
    )
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print("WROTE", OUT, OUT.stat().st_size)

    for d in [
        Path(r"C:\LocalDesktop"),
        Path.home() / "LocalDesktop",
        Path.home() / "Desktop",
        Path.home() / "OneDrive" / "Desktop",
    ]:
        if d.is_dir():
            dest = d / "NEXOSxLPIN_Open_Ecosystem_Development_Plan_v2.pdf"
            try:
                shutil.copy2(OUT, dest)
                print("COPIED", dest)
            except OSError as e:
                print("copy fail", d, e)


if __name__ == "__main__":
    main()
