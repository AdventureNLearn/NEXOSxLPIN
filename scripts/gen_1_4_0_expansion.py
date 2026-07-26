#!/usr/bin/env python3
"""NEXOSxLPIN 1.4.0 expansion: +72 SME lenses, +16 cong desks, rules fragment."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SPEC = [
    ("core-governance", 6, "gov-primary"),
    ("public-records", 6, "gov-primary"),
    ("jurisdiction", 6, "gov-jurisdiction"),
    ("oversight", 6, "gov-primary"),
    ("sector-regulatory", 6, "sector"),
    ("method-process", 3, "method"),
    ("mechanical-engineering", 5, "eng"),
    ("civil-structural", 3, "eng"),
    ("electrical-electronics", 4, "eng"),
    ("chemical-process", 2, "eng"),
    ("aerospace-defense-tech", 2, "eng"),
    ("materials-manufacturing", 3, "eng"),
    ("energy-nuclear", 2, "eng"),
    ("biomedical-systems", 2, "eng"),
    ("computing-cyberphysical", 4, "eng"),
    ("mathematics-statistics", 6, "theory"),
    ("theoretical-physics", 4, "theory-dim"),
    ("applied-physical-sciences", 2, "method"),
]

SEEDS: dict[str, list[tuple[str, str, str, str, str]]] = {
    "core-governance": [
        ("sme-gov-integrity-score", "Integ Score", "Integrity Scorecard SME", "Scores narrative integrity vs evidence stack for export readiness", "integrity scorecard export narrative evidence stack gate"),
        ("sme-gov-cross-claim", "Cross-Claim", "Cross-Claim Consistency SME", "Detects mutually exclusive claims in the same ledger", "cross claim consistency contradiction ledger exclusive"),
        ("sme-gov-source-decay", "Source Decay", "Source Freshness SME", "Flags stale primaries and outdated docket snapshots", "source freshness stale docket outdated retrieved decay"),
        ("sme-gov-alias-entity", "Entity Alias", "Entity Alias Resolution SME", "Resolves org aliases without inventing edges", "entity alias shell org name resolution identity"),
        ("sme-gov-burden-proof", "Burden Proof", "Burden of Proof Allocator", "Assigns who must produce which record before +1", "burden proof allocate record producer duty evidence"),
        ("sme-gov-escalation-path", "Escalation", "Escalation Path SME", "Maps internal escalation before high-stakes export", "escalation path high-stakes export internal review gate"),
    ],
    "public-records": [
        ("sme-pr-retention", "Retention", "Records Retention SME", "Retention schedules and destruction holds", "retention schedule destruction hold archive purge"),
        ("sme-pr-metadata", "Rec Metadata", "Records Metadata SME", "Metadata completeness on filings and productions", "metadata filing production fields completeness index"),
        ("sme-pr-version-control", "Doc Version", "Document Version Control SME", "Version lineage of ordinances and policy PDFs", "version ordinance policy pdf lineage amendment"),
        ("sme-pr-access-log", "Access Log", "Records Access Log SME", "Who accessed what and when in public portals", "access log portal retrieve custodian audit trail"),
        ("sme-pr-certified-copy", "Cert Copy", "Certified Copy SME", "Certified vs plain copies for material claims", "certified copy plain seal custodian authentic"),
        ("sme-pr-bulk-export", "Bulk Export", "Bulk Records Export SME", "Bulk dump integrity and pagination traps", "bulk export pagination dump integrity portal"),
    ],
    "jurisdiction": [
        ("sme-ju-choice-law", "Choice Law", "Choice of Law Literacy SME", "Which law applies when contracts and forums conflict", "choice law conflict forum governing clause"),
        ("sme-ju-sovereign-immunity", "Sov Immun", "Sovereign Immunity Literacy SME", "Immunity and waiver claims with primary anchors", "sovereign immunity waiver tort claim act"),
        ("sme-ju-agency-capture", "Agency Cap", "Agency Capture Risk SME", "Capture risk held to evidence of revolving edges", "capture revolving edge agency influence risk"),
        ("sme-ju-federalism-funds", "Fed Funds", "Federalism Funding Conditions SME", "Spending-power conditions on state programs", "federalism spending condition grant string"),
        ("sme-ju-emergency-powers", "Emerg Pwr", "Emergency Powers Bound SME", "Time-bounded emergency powers vs permanent rules", "emergency powers declaration sunset temporary"),
        ("sme-ju-compact-clause", "Compact", "Interstate Compact SME", "Compacts and consent requirements", "interstate compact consent congress approval"),
    ],
    "oversight": [
        ("sme-ov-whistle-channel", "Whistle Ch", "Protected Channel Routing SME", "Safe channels and anti-retaliation process literacy", "whistle channel retaliation hotline protected"),
        ("sme-ov-metrics-game", "Metric Game", "Metric Gaming Detector", "Detects Goodharted KPIs without operational defs", "metric gaming goodhart kpi operational definition"),
        ("sme-ov-sole-source", "Sole Source", "Sole-Source Justification SME", "Sole-source awards need public justification text", "sole-source justification award no-bid"),
        ("sme-ov-grant-compliance", "Grant Comp", "Grant Compliance Oversight SME", "Grant terms allowability and reporting clocks", "grant compliance allowability reporting clock"),
        ("sme-ov-shadow-policy", "Shadow Pol", "Shadow Policy Detector", "Unwritten policies claimed as law without primary", "shadow policy unwritten practice memo"),
        ("sme-ov-public-comment", "Pub Comment", "Public Comment Integrity SME", "Comment periods and docket weight", "public comment docket mass campaign period"),
    ],
    "sector-regulatory": [
        ("sme-sr-data-broker", "Data Broker", "Data Broker Regulatory SME", "Broker registration and deletion rights claims", "data broker registration deletion privacy"),
        ("sme-sr-crypto-asset", "Crypto Asset", "Crypto Asset Market SME", "Market structure vs SEC/CFTC public materials", "crypto asset market structure sec cftc"),
        ("sme-sr-ai-safety-eval", "AI Eval", "AI Safety Evaluation SME", "Eval claims need method and threat model", "ai safety evaluation red-team method threat"),
        ("sme-sr-privacy-impact", "PIA", "Privacy Impact Assessment SME", "PIA existence and scope for systems", "privacy impact assessment pia scope system"),
        ("sme-sr-critical-infra", "Crit Infra", "Critical Infrastructure Sector SME", "Sector-specific CI duties with primary", "critical infrastructure sector cisa duty"),
        ("sme-sr-consumer-finance", "Cons Fin", "Consumer Finance Product SME", "Product disclosure and unfair practices claims", "consumer finance disclosure unfair practices cfpb"),
    ],
    "method-process": [
        ("sme-mp-sample-design", "Sample Des", "Sample Design SME", "Sampling frames and selection bias", "sample design frame selection bias survey"),
        ("sme-mp-interrater", "Interrater", "Interrater Reliability SME", "Agreement metrics for human coding", "interrater reliability kappa agreement coding"),
        ("sme-mp-preanalysis", "Pre-Analysis", "Pre-Analysis Plan SME", "Registered plans vs post-hoc fishing", "pre-analysis plan registered fishing post-hoc"),
    ],
    "mechanical-engineering": [
        ("sme-me-rotordynamics", "Rotor Dyn", "Rotordynamics SME", "Critical speeds and imbalance claims", "rotor dynamics critical speed imbalance bearing"),
        ("sme-me-pneumatics", "Pneumatics", "Pneumatics & Fluid Power SME", "Pressure, flow, and safety circuits", "pneumatics fluid power pressure flow valve"),
        ("sme-me-nvh", "NVH", "NVH Engineering SME", "Noise vibration harshness with spectra", "nvh noise vibration spectrum harshness modal"),
        ("sme-me-dfm", "DFM", "Design for Manufacturing SME", "DFM/DFA claims with process capability", "dfm dfa manufacturing capability tolerance"),
        ("sme-me-reliability-growth", "Rel Growth", "Reliability Growth SME", "MTBF growth and test-analyze-fix", "reliability growth mtbf test analyze fix"),
    ],
    "civil-structural": [
        ("sme-cs-fire-life", "Fire Life", "Fire & Life Safety SME", "Egress, fire resistance, and code claims", "fire life safety egress resistance code"),
        ("sme-cs-coastal", "Coastal", "Coastal & Floodplain Engineering SME", "Floodplain and coastal hazard claims", "coastal floodplain hazard surge freb"),
        ("sme-cs-pavement", "Pavement", "Pavement Engineering SME", "Pavement design and distress claims", "pavement distress design load traffic"),
    ],
    "electrical-electronics": [
        ("sme-ee-grounding", "Grounding", "Grounding & Bonding SME", "Grounding systems and safety claims", "grounding bonding earthing equipotential"),
        ("sme-ee-hvdc", "HVDC", "HVDC Systems SME", "HVDC converter and grid interface claims", "hvdc converter grid interface transmission"),
        ("sme-ee-sensor-fusion", "Sensor Fus", "Sensor Fusion SME", "Fusion filters and covariance claims", "sensor fusion kalman covariance observability"),
        ("sme-ee-pcb-signal", "PCB SI", "PCB Signal Integrity SME", "SI/PI claims with stackup and impedance", "pcb signal integrity impedance stackup pi"),
    ],
    "chemical-process": [
        ("sme-ch-catalyst", "Catalyst", "Catalysis Engineering SME", "Catalyst life and selectivity claims", "catalyst selectivity deactivation reactor"),
        ("sme-ch-hazard-ops", "Haz Ops", "Process Hazard Operations SME", "HAZOP/LOPA action item closure", "hazop lopa action item process safety"),
    ],
    "aerospace-defense-tech": [
        ("sme-ad-human-rating", "Human Rate", "Human-Rating Systems SME", "Human-rating and abort criteria", "human-rating abort criteria crew safety"),
        ("sme-ad-mission-assurance", "Msn Assur", "Mission Assurance SME", "Mission assurance gates and anomaly closeout", "mission assurance anomaly closeout gate"),
    ],
    "materials-manufacturing": [
        ("sme-mm-coatings", "Coatings", "Surface Coatings SME", "Coating adhesion and corrosion claims", "coating adhesion corrosion thickness"),
        ("sme-mm-ceramics", "Ceramics", "Ceramics & Glasses SME", "Ceramic toughness and processing claims", "ceramic toughness sintering glass"),
        ("sme-mm-supply-chain", "Mfg Supply", "Manufacturing Supply Chain SME", "Supply risk and dual-source claims", "supply chain dual-source lead time risk"),
    ],
    "energy-nuclear": [
        ("sme-en-hydrogen", "Hydrogen", "Hydrogen Systems SME", "H2 purity, leakage, and materials", "hydrogen purity leakage materials safety"),
        ("sme-en-carbon-capture", "CCS", "Carbon Capture Systems SME", "Capture rate and energy penalty claims", "carbon capture rate energy penalty storage"),
    ],
    "biomedical-systems": [
        ("sme-bm-clinical-eval", "Clin Eval", "Clinical Evaluation SME", "Clinical evidence hierarchy for devices", "clinical evaluation evidence hierarchy device"),
        ("sme-bm-biocompatibility", "Biocompat", "Biocompatibility SME", "ISO-framed biocompatibility claims", "biocompatibility iso cytotoxicity leachables"),
    ],
    "computing-cyberphysical": [
        ("sme-cp-zero-trust", "Zero Trust", "Zero Trust Architecture SME", "ZT claims need policy and identity anchors", "zero trust identity policy microsegmentation"),
        ("sme-cp-observability", "Observabil", "Observability Engineering SME", "SLOs, traces, and alert quality", "observability slo trace alert latency"),
        ("sme-cp-supply-sbom", "SBOM", "Software Supply SBOM SME", "SBOM completeness and provenance", "sbom supply chain provenance vulnerability"),
        ("sme-cp-edge-compute", "Edge Comp", "Edge Computing SME", "Edge latency and offline modes", "edge computing latency offline sync"),
    ],
    "mathematics-statistics": [
        ("sme-ms-measure-theory", "Measure Th", "Measure-Theoretic Probability SME", "Sigma-algebras and almost-sure claims", "measure theory sigma algebra almost sure"),
        ("sme-ms-nonparametrics", "Nonparam", "Nonparametric Statistics SME", "Distribution-free tests and assumptions", "nonparametric rank test distribution free"),
        ("sme-ms-experimental-design", "Exp Design", "Experimental Design SME", "Randomization and power", "experimental design randomization power blocking"),
        ("sme-ms-robust-stats", "Robust St", "Robust Statistics SME", "Outliers and influence functions", "robust statistics outlier influence breakdown"),
        ("sme-ms-stochastic-proc", "Stoch Proc", "Stochastic Processes SME", "Markov and martingale claims", "stochastic process markov martingale stationary"),
        ("sme-ms-info-geometry", "Info Geom", "Information Geometry SME", "Divergences and natural gradients", "information geometry divergence fisher natural"),
    ],
    "theoretical-physics": [
        ("sme-tp-qft-lite", "QFT Lite", "QFT Literacy SME", "Field theory claims with cutoff honesty", "qft field cutoff renormalization literacy"),
        ("sme-tp-gr-tests", "GR Tests", "GR Experimental Tests SME", "GR tests need dataset and model", "general relativity test dataset model"),
        ("sme-tp-stat-field", "Stat Field", "Statistical Field Theory SME", "Critical phenomena and scaling", "statistical field critical scaling universality"),
        ("sme-tp-plasma-kinetics", "Plasma Kin", "Plasma Kinetics SME", "Kinetic vs fluid plasma regimes", "plasma kinetic fluid regime debye"),
    ],
    "applied-physical-sciences": [
        ("sme-ap-remote-sensing", "Remote Sens", "Remote Sensing SME", "Remote sensing claims need sensor and processing", "remote sensing sensor processing calibration"),
        ("sme-ap-instrumentation", "Instrum", "Scientific Instrumentation SME", "Instrument uncertainty and traceability", "instrumentation uncertainty calibration traceability"),
    ],
}

DESKS = [
    ("cong-41-ai-chip-export", "AI chip export", "AI chip export / foundry capacity oversight", "Semiconductors, foundries, EDA", "BIS", "https://www.bis.doc.gov/", "Export controls public materials", "Congress.gov search: semiconductor export", "https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22semiconductor%20export%22%7D", ["semiconductor", "export", "foundry", "bis"]),
    ("cong-42-biometric-procurement", "Biometric proc", "Biometric surveillance vendor procurement ethics", "Integrators, camera vendors, cities", "GAO", "https://www.gao.gov/", "Procurement reviews", "Congress.gov search: biometric surveillance", "https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22biometric%20surveillance%22%7D", ["biometric", "procurement", "surveillance", "ethics"]),
    ("cong-43-coop-contractors", "COOP contract", "Evacuation / COOP contractor readiness", "Continuity vendors, facilities", "FEMA", "https://www.fema.gov/", "Continuity public materials", "Congress.gov search: continuity of operations", "https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22continuity%20of%20operations%22%7D", ["coop", "continuity", "contractor", "emergency"]),
    ("cong-44-oss-federal", "OSS federal", "Open-source software security in federal supply chain", "OSS maintainers, integrators, cloud", "CISA", "https://www.cisa.gov/", "Software supply chain guidance", "Congress.gov search: open source software security", "https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22open%20source%20software%20security%22%7D", ["oss", "sbom", "supply chain", "cisa"]),
    ("cong-45-meddevice-cyber", "MedDevice cyber", "Medical device cybersecurity premarket industry burden", "Device OEMs, hospitals", "FDA", "https://www.fda.gov/medical-devices", "Device cybersecurity materials", "Congress.gov search: medical device cybersecurity", "https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22medical%20device%20cybersecurity%22%7D", ["device", "cybersecurity", "fda", "premarket"]),
    ("cong-46-aws-export", "AWS dual-use", "Autonomous weapons dual-use export compliance", "Defense primes, autonomy vendors", "State DDTC", "https://www.pmddtc.state.gov/", "ITAR public materials", "Congress.gov search: autonomous weapons export", "https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22autonomous%20weapons%22%7D", ["autonomy", "export", "itar", "dual-use"]),
    ("cong-47-carbon-offsets", "Carbon offsets", "Carbon markets / offsets integrity oversight", "Project developers, verifiers, buyers", "EPA", "https://www.epa.gov/", "Climate public materials", "Congress.gov search: carbon offset", "https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22carbon%20offset%22%7D", ["carbon", "offsets", "markets", "integrity"]),
    ("cong-48-digital-identity", "Digital ID", "Digital identity / private IdP effects", "IdPs, banks, platforms", "Login.gov", "https://www.login.gov/", "Public digital identity materials", "Congress.gov search: digital identity", "https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22digital%20identity%22%7D", ["identity", "idp", "login", "privacy"]),
    ("cong-49-freight-data", "Freight data", "Freight logistics data sharing transparency", "Brokers, shippers, carriers", "FMCSA", "https://www.fmcsa.dot.gov/", "Freight public materials", "Congress.gov search: freight broker", "https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22freight%20broker%22%7D", ["freight", "broker", "logistics", "data"]),
    ("cong-50-mining-hardrock", "Hardrock mine", "Mining claim / hardrock reform private costs", "Miners, explorers, communities", "BLM", "https://www.blm.gov/", "Mining public materials", "Congress.gov search: hardrock mining", "https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22hardrock%20mining%22%7D", ["mining", "hardrock", "blm", "claims"]),
    ("cong-51-broadcast-ownership", "Broadcast own", "Broadcast / local journalism ownership caps", "Broadcasters, local news", "FCC", "https://www.fcc.gov/", "Media ownership materials", "Congress.gov search: media ownership", "https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22media%20ownership%22%7D", ["broadcast", "ownership", "journalism", "fcc"]),
    ("cong-52-340b-pharmacy", "340B pharmacy", "Pharmacy desert / 340B private hospital effects", "Hospitals, pharmacies, manufacturers", "HRSA", "https://www.hrsa.gov/opa", "340B program materials", "Congress.gov search: 340B", "https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22340B%22%7D", ["340b", "pharmacy", "hospital", "hrsa"]),
    ("cong-53-drone-bvlos", "Drone BVLOS", "Drone BVLOS commercial corridor rules", "UAS operators, logistics", "FAA UAS", "https://www.faa.gov/uas", "UAS public materials", "Congress.gov search: BVLOS", "https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22BVLOS%22%7D", ["drone", "bvlos", "uas", "faa"]),
    ("cong-54-smr-licensing", "SMR license", "Nuclear SMRs licensing timeline private capital", "SMR developers, utilities", "NRC", "https://www.nrc.gov/", "Advanced reactor materials", "Congress.gov search: small modular reactor", "https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22small%20modular%20reactor%22%7D", ["smr", "nuclear", "nrc", "licensing"]),
    ("cong-55-tribal-energy", "Tribal energy", "Tribal energy / ROWs cross-jurisdiction routing", "Tribes, developers, transmission", "DOI", "https://www.doi.gov/", "Tribal energy materials", "Congress.gov search: tribal energy", "https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22tribal%20energy%22%7D", ["tribal", "energy", "row", "transmission"]),
    ("cong-56-disaster-debris", "Disaster debris", "Disaster debris / recovery contractor oversight", "Debris firms, localities, insurers", "FEMA", "https://www.fema.gov/", "Debris public materials", "Congress.gov search: disaster debris", "https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22disaster%20debris%22%7D", ["disaster", "debris", "contractor", "fema"]),
]


def esc(s: str) -> str:
    return s.replace("\\", "\\\\").replace("'", "\\'")


def tags_from(bag: str, domain: str) -> list[str]:
    parts = bag.lower().replace("/", " ").replace("-", " ").split()
    base: list[str] = []
    for p in parts:
        if len(p) >= 3 and p not in base:
            base.append(p)
    for e in (domain.split("-")[0], "analysis", "evidence"):
        if e not in base:
            base.append(e)
    while len(base) < 6:
        base.append(f"tag{len(base)}")
    return base[:8]


def emit_pack(items: list[dict], name: str, count: int, is_gov: bool) -> str:
    princ = "[P.evidence, P.sources, P.action, P.layer0]" if is_gov else "[T.evidence, T.measure, T.model, T.failure]"
    const = (
        "const P = { evidence: 'Label every material claim +1 / 0 / −1.', sources: 'Prefer primary records.', action: 'End with owner-ready next step.', layer0: 'High-stakes export needs Layer-0 ACK.' }"
        if is_gov
        else "const T = { evidence: 'Label +1/0/−1.', measure: 'Prefer measurement/method.', model: 'State assumptions.', failure: 'Name failure modes/standards.' }"
    )
    lines = [
        "/** AUTO 1.4.0 expansion — generated by scripts/gen_1_4_0_expansion.py */",
        "import type { SmeDomain, SmeLens } from '../../types/sme'",
        "",
        const,
        "type LensDef = { id: string; short: string; name: string; domain: SmeDomain; tagline: string; description: string; credential: string; voice: string; focusTags: string[]; questions: string[]; sources: string[]; gates: string[]; highStakes?: boolean }",
        "function lens(d: LensDef): SmeLens {",
        "  return {",
        "    id: d.id, short: d.short, name: d.name, domain: d.domain, tagline: d.tagline, description: d.description,",
        f"    persona: {{ title: d.name, credential: d.credential, voice: d.voice, principles: {princ} }},",
        "    focusTags: d.focusTags, questionBank: d.questions, preferredSources: d.sources, publishGates: d.gates, highStakes: d.highStakes ?? false,",
        "  }",
        "}",
        f"export const {name}: SmeLens[] = [",
    ]
    for it in items:
        lines.append(
            "  lens({ "
            f"id: '{it['id']}', short: '{esc(it['short'])}', name: '{esc(it['name'])}', domain: '{it['domain']}', "
            f"tagline: '{esc(it['tagline'])}', description: '{esc(it['description'])}', credential: '{esc(it['credential'])}', "
            f"voice: '{esc(it['voice'])}', focusTags: {json.dumps(it['tags'])}, questions: {json.dumps(it['questions'])}, "
            f"sources: {json.dumps(it['sources'])}, gates: {json.dumps(it['gates'])}, highStakes: {str(it['highStakes']).lower()} "
            "}),"
        )
    lines.append("]")
    lines.append(f"if ({name}.length !== {count}) throw new Error(`{name} must be {count}`)")
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    assert sum(c for _, c, _ in SPEC) == 72
    for d, c, _ in SPEC:
        assert len(SEEDS[d]) == c, (d, len(SEEDS[d]), c)

    gov_domains = {
        "core-governance",
        "public-records",
        "jurisdiction",
        "oversight",
        "sector-regulatory",
        "method-process",
    }
    gov_lenses: list[dict] = []
    tech_lenses: list[dict] = []
    rules: list[str] = []

    for domain, _count, kind in SPEC:
        for id_, short, name, tagline, bag in SEEDS[domain]:
            tags = tags_from(bag, domain)
            desc = (
                f"{tagline}. Adjudicates claims with domain-specific primary anchors and refuses rhetoric-only +1. "
                "Training specialist only — not professional licensure or legal advice."
            )
            hs = any(x in bag for x in ("safety", "export", "high-stakes", "nuclear", "device", "mission", "crew"))
            item = {
                "id": id_,
                "short": short[:18],
                "name": name,
                "domain": domain,
                "tagline": tagline,
                "description": desc,
                "credential": f"{name} · NEXOSxLPIN 1.4 pack",
                "voice": "Specialist adjudicator; score-first.",
                "tags": tags,
                "questions": [
                    f"What primary record supports this {short} claim?",
                    "What would falsify it?",
                    "What method/measurement or instrument is cited?",
                ],
                "sources": ["Primary technical or public record", "Method note / standard cite"],
                "gates": [f"{short} +1 requires primary or method anchors"],
                "highStakes": hs,
            }
            (gov_lenses if domain in gov_domains else tech_lenses).append(item)
            tjson = json.dumps(tags[:5])
            label = short.replace("'", "")
            if kind == "gov-primary":
                rules.append(
                    f"  '{id_}': (ctx, base) => requirePrimaryForPlusOne(ctx, base, '{label}', {tjson}),"
                )
            elif kind == "gov-jurisdiction":
                rules.append(
                    f"  '{id_}': (ctx, base) => {{ let r = sectorTagMatch(ctx, base, {tjson}, '{label}'); "
                    f"r = requirePrimaryForPlusOne(ctx, r, '{label}', {tjson}); const text = hay(ctx); "
                    f"if (ctx.original === 1 && !hasAny(text, ['statute','code','section','order','docket','clause']) "
                    f"&& isWeakMaterial(ctx.material)) r = demoteToZero(r, '{label}: lacks instrument anchors', 38); return r }},"
                )
            elif kind == "sector":
                rules.append(
                    f"  '{id_}': (ctx, base) => {{ let r = sectorTagMatch(ctx, base, {tjson}, '{label}'); "
                    f"r = requirePrimaryForPlusOne(ctx, r, '{label}', {tjson}); "
                    f"if (ctx.original === 1 && isSocialOnly(hay(ctx), ctx.material)) "
                    f"r = demoteToZero(r, '{label}: social-only held at 0', 36); return r }},"
                )
            elif kind == "method":
                rules.append(
                    f"  '{id_}': (ctx, base) => {{ let r = sectorTagMatch(ctx, base, {tjson}, '{label}'); "
                    f"const text = hay(ctx); if (ctx.original === 1 && !hasAny(text, "
                    f"['method','protocol','definition','measurement','sample','plan','metric']) "
                    f"&& isWeakMaterial(ctx.material)) r = demoteToZero(r, '{label}: lacks method anchors', 37); return r }},"
                )
            elif kind == "eng":
                rules.append(
                    f"  '{id_}': engineeringRule('{label}', {tjson}, {{ highStakesDefault: {str(hs).lower()} }}),"
                )
            elif kind == "theory":
                rules.append(f"  '{id_}': theoryRule('{label}', {tjson}),")
            elif kind == "theory-dim":
                rules.append(
                    f"  '{id_}': withDimensionlessRegime(theoryRule('{label}', {tjson}), '{label}'),"
                )
            else:
                rules.append(
                    f"  '{id_}': (ctx, base) => requirePrimaryForPlusOne(ctx, base, '{label}', {tjson}),"
                )

    assert len(gov_lenses) == 33, len(gov_lenses)
    assert len(tech_lenses) == 39, len(tech_lenses)
    assert len(rules) == 72

    (ROOT / "src/data/sme/governanceExpansion14.ts").write_text(
        emit_pack(gov_lenses, "GOVERNANCE_EXPANSION_14", 33, True), encoding="utf-8"
    )
    (ROOT / "src/data/sme/technicalExpansion14.ts").write_text(
        emit_pack(tech_lenses, "TECHNICAL_EXPANSION_14", 39, False), encoding="utf-8"
    )
    (ROOT / "scripts/_rules_expansion_14.txt").write_text("\n".join(rules) + "\n", encoding="utf-8")

    # congress seeds fragment
    seed_blocks = []
    for i, d in enumerate(DESKS):
        id_, short, title, industry, agency, aurl, awhy, bhint, burl, tags = d
        lat = 38.8899 + (i % 5) * 0.014 - 0.025
        lng = -77.0091 - (i % 6) * 0.012 + 0.02
        stakes = f"Oversight and potential rules change private compliance cost and market access for {industry}."
        lede = (
            f"Training desk on {title}. Prefer {agency} and Congress primary materials over social-only duty claims. "
            "Not legal advice."
        )
        seed_blocks.append(
            f"""  {{
    id: '{id_}',
    rank: {41 + i},
    short: '{esc(short)}',
    title: '{esc(title)}',
    industry: '{esc(industry)}',
    stakes: '{esc(stakes)}',
    lede: '{esc(lede)}',
    agency: '{esc(agency)}',
    agencyUrl: '{aurl}',
    agencyWhy: '{esc(awhy)}',
    billHint: '{esc(bhint)}',
    billUrl: '{burl}',
    lat: {lat:.4f},
    lng: {lng:.4f},
    cityHint: 'Washington, DC area',
    tags: {json.dumps(tags)},
    extraClaims: [
      {{ statement: '{esc(agency)} publishes primary materials used in compliance planning for {esc(industry)}.', score: 1, material: 'secondary', notes: 'Agency home is a start — cite instruments for +1 duties.' }},
      {{ statement: 'A single social post fully states legal duties for {esc(short)}.', score: -1, material: 'assumption', notes: 'Social-only duty claims are disqualifying.' }},
      {{ statement: 'Oversight can change private compliance cost in {esc(industry)}.', score: 1, material: 'derived', notes: 'Directionally supported; magnitude needs studies.' }},
      {{ statement: 'All firms face identical costs under any rule change.', score: 0, material: 'assumption', notes: 'Heterogeneous impact — hold.' }},
      {{ statement: 'Congress.gov search is not enrolled text for {esc(short)}.', score: 1, material: 'secondary', notes: 'Search ≠ statute.' }},
    ],
  }}"""
        )
    (ROOT / "scripts/_congress_seeds_41_56.txt").write_text(",\n".join(seed_blocks), encoding="utf-8")

    src_lines = [
        "/** Congressional sources expansion cong-41…56 — generated */",
        "import type { ActiveSource } from '../../types/useCase'",
        "function s(id: string, title: string, url: string, why: string, kind: ActiveSource['kind'], publisher?: string, publicRecord = true, tags: string[] = []): ActiveSource {",
        "  return { id, title, url, why, kind, publisher, publicRecord, tags }",
        "}",
        "export const CONGRESS_SOURCES_EXPANSION_14: Record<string, ActiveSource[]> = {",
    ]
    st_lines = [
        "/** Congressional stories expansion cong-41…56 — generated */",
        "import type { EvidenceScore } from '../../types/core'",
        "function st(score: EvidenceScore): 'supported' | 'uncertain' | 'disputed' {",
        "  if (score === 1) return 'supported'",
        "  if (score === -1) return 'disputed'",
        "  return 'uncertain'",
        "}",
        "export const CONGRESS_STORIES_EXPANSION_14: Record<string, any> = {",
    ]
    for d in DESKS:
        id_, short, title, industry, agency, aurl, awhy, bhint, burl, tags = d
        src_lines.append(
            f"  '{id_}': ["
            f"s('{id_}-1','Congress.gov','https://www.congress.gov/','Bill materials','official','Congress.gov',true,{json.dumps(tags)}),"
            f"s('{id_}-2','{esc(agency)}','{aurl}','{esc(awhy)}','official','{esc(agency)}',true,{json.dumps(tags)}),"
            f"s('{id_}-3','{esc(bhint)}','{burl}','Legislation search','official','Congress.gov',true,['legislation']),"
            f"s('{id_}-4','GAO','https://www.gao.gov/','Independent evaluations','official','GAO',true,['audit']),"
            f"s('{id_}-5','CRS','https://crsreports.congress.gov/','Legislative analysis','official','CRS',true,['crs']),"
            f"s('{id_}-6','GovInfo','https://www.govinfo.gov/','Authenticated publications','official','GPO',true,['primary'])"
            "],"
        )
        st_lines.append(
            f"  '{id_}': {{ useCaseId: '{id_}', title: '{esc(title)}', where: 'Washington, DC area', "
            f"lede: 'Training investigation into {esc(title)}. Prefer {esc(agency)} and Congress primary materials. Not legal advice.', "
            f"stakes: 'Oversight can change private compliance cost and market access for {esc(industry)}.', "
            f"knownSoFar: ['Public agency materials are starting points for {esc(short)}.', 'Industry focus: {esc(industry)}.', 'Prefer Congress.gov / agency / GAO hierarchy.'], "
            f"stillOpen: ['Which measures are active vs draft?', 'Quantified cost by firm size?', 'Which claims are social-only?', 'What unlocks export?'], "
            f"claims: ["
            f"{{ plain: '{esc(agency)} publishes materials relevant to compliance planning.', status: st(1), score: 1 as EvidenceScore, why: 'Agency primary start.' }}, "
            f"{{ plain: 'Social posts alone establish legal duties for {esc(short)}.', status: st(-1), score: -1 as EvidenceScore, why: 'Disqualifying without primary.' }}, "
            f"{{ plain: 'Rules can change compliance cost for {esc(industry)}.', status: st(1), score: 1 as EvidenceScore, why: 'Industry-effect direction.' }}, "
            f"{{ plain: 'All firms face identical impacts.', status: st(0), score: 0 as EvidenceScore, why: 'Heterogeneous — hold.' }}, "
            f"{{ plain: 'Congress.gov search is not enrolled bill text.', status: st(1), score: 1 as EvidenceScore, why: 'Method hygiene.' }}"
            f"], surfaces: {{ map: 'Capitol-region pin.', research: 'Score industry-effect claims with primary hierarchy.', design: 'Verification depth before publish.', ladder: 'Raise detail with sources intact.', analyst: 'SME multi-select for domain packs.', model: 'Optional schematic only.', export: 'Layer-0; clear −1 first.', sources: 'Agency + Congress + GAO/CRS.' }}, "
            f"tabLabels: {{ 'research-hub': 'Claims', atlas: 'Desk map', 'sme-lenses': 'SME', analyst: 'Commands', 'export-kit': 'Export' }}, "
            f"nextStep: 'Open Claims, attach agency primary, run Evidence Gate + sector SME.' }},"
        )
    src_lines.append("}")
    src_lines.append("")
    st_lines.append("}")
    st_lines.append("")
    (ROOT / "src/data/useCases/congressSourcesExpansion14.ts").write_text("\n".join(src_lines), encoding="utf-8")
    (ROOT / "src/data/useCases/congressStoriesExpansion14.ts").write_text("\n".join(st_lines), encoding="utf-8")
    print("OK lenses", len(gov_lenses), "+", len(tech_lenses), "rules", len(rules), "desks", len(DESKS))


if __name__ == "__main__":
    main()
