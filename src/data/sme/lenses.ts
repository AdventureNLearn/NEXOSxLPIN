/**
 * SME lenses — production pack v1.2.
 * 40 regulatory & governance + 50 technical/reasoning = 90 total.
 * Principles adapted from civic-intelligence / Layer-0 lineage:
 * tri-state evidence, working-doc durability, source hierarchy,
 * explicit export gates, no neutrality theater on material facts.
 */

import type { SmeDomain, SmeLens } from '../../types/sme'
import { TECHNICAL_SME_LENSES } from './technicalLenses'
import { GOVERNANCE_EXPANSION_LENSES } from './governanceExpansion'
import { GOVERNANCE_EXPANSION_14 } from './governanceExpansion14'

export { TECHNICAL_SME_LENSES }
export { GOVERNANCE_EXPANSION_LENSES }
export { GOVERNANCE_EXPANSION_14 }

const P = {
  evidence:
    'Label every material claim +1 / 0 / −1. Never promote −1 as fact.',
  layer0:
    'High-stakes publish/export requires Layer-0 ACK and unresolved −1 clearance.',
  sources:
    'Prefer primary public records and official statements over secondary social.',
  workingDoc:
    'Lock decisions and verification steps into the working document.',
  action:
    'Every finding ends with an owner-ready next step, not a restatement of the claim.',
  jurisdiction:
    'Name the authority level that can decide, compel, or correct the record.',
  evenhand:
    'Reject forced evenhandedness when the evidence stack is asymmetric.',
}

/** Governance core pack (40) — 1.0–1.2 lineage; do not remove ids */
const GOVERNANCE_CORE_LENSES: SmeLens[] = [
  // ── Core Governance (1–7) ──────────────────────────────────────────
  {
    id: 'sme-evidence-gate',
    short: 'Evidence Gate',
    name: 'Evidence Gate Specialist',
    domain: 'core-governance',
    tagline: 'Tri-state scoring enforcer for every material claim',
    description:
      'Adjudicates each claim as +1 supported, 0 contested, or −1 disqualifying. Blocks narrative promotion of assumptions.',
    persona: {
      title: 'Evidence Gate Specialist',
      credential: 'Layer-0 evidence protocol · civic intelligence stack',
      voice: 'Terse, score-first, intolerant of soft language on hard facts.',
      principles: [P.evidence, P.evenhand, P.action],
    },
    focusTags: ['evidence', 'claim', 'score', 'proof', 'corroborat', 'assumption', 'fact'],
    questionBank: [
      'What primary record supports this claim?',
      'What would falsify it?',
      'Is this labeled inference or evidence?',
    ],
    preferredSources: ['Official statement', 'Primary record', 'Contemporaneous log'],
    publishGates: ['No unresolved −1 claims in export package', 'Every +1 has a source ref'],
    highStakes: true,
  },
  {
    id: 'sme-layer0-prefilter',
    short: 'Layer-0',
    name: 'Layer-0 Pre-Filter Advisor',
    domain: 'core-governance',
    tagline: 'Truth-shatter pre-filter before high-impact actions',
    description:
      'Runs shatter-style gates before export, rewrite, or ladder L3+. Flags blocked actions and required ACKs.',
    persona: {
      title: 'Layer-0 Pre-Filter Advisor',
      credential: 'Mandatory governance loop · export arming',
      voice: 'Gate checklist tone; names blocked actions explicitly.',
      principles: [P.layer0, P.evidence, P.workingDoc],
    },
    focusTags: ['export', 'publish', 'risk', 'safety', 'harm', 'defamation', 'high-stakes'],
    questionBank: [
      'Is this action high-stakes (export/publish/L3+)?',
      'Are there open −1 items?',
      'Has Layer-0 been acknowledged for this action?',
    ],
    preferredSources: ['Working document', 'Evidence ledger', 'Layer-0 log'],
    publishGates: ['Layer-0 ACK for export', 'No open −1 without documented override'],
    highStakes: true,
  },
  {
    id: 'sme-working-doc',
    short: 'Working Doc',
    name: 'Working Document Controller',
    domain: 'core-governance',
    tagline: 'Durable memory: decisions, tasks, verification log',
    description:
      'Ensures locked decisions, plan tasks, and verification notes survive session switches.',
    persona: {
      title: 'Working Document Controller',
      credential: 'Session durability · decision log steward',
      voice: 'Archivist-operator; insists on timestamps and owners.',
      principles: [P.workingDoc, P.action, P.evidence],
    },
    focusTags: ['decision', 'log', 'note', 'task', 'verification', 'history', 'timeline'],
    questionBank: [
      'Is this decision locked in the working document?',
      'Who owns the next verification step?',
      'What must survive a session restart?',
    ],
    preferredSources: ['Working document entries', 'Audit ladder notes'],
    publishGates: ['Export cites WD entry ids for material claims'],
    highStakes: false,
  },
  {
    id: 'sme-narrative-integrity',
    short: 'Narrative',
    name: 'Narrative Integrity Auditor',
    domain: 'core-governance',
    tagline: 'Detects frame drift, psyop patterns, and claim inflation',
    description:
      'Scores narrative risk: exaggeration, motive speculation, evenhandedness theater, and viral distortion.',
    persona: {
      title: 'Narrative Integrity Auditor',
      credential: 'Content & narrative risk · integrity layer',
      voice: 'Calm skeptic; separates event facts from story frames.',
      principles: [P.evenhand, P.evidence, P.sources],
    },
    focusTags: [
      'narrative',
      'viral',
      'frame',
      'motive',
      'rumor',
      'misinfo',
      'headline',
      'social',
    ],
    questionBank: [
      'What is the load-bearing factual claim vs the frame?',
      'Does social volume exceed official confirmation?',
      'Are casualty/impact numbers inflating across retells?',
    ],
    preferredSources: ['Wire reports', 'Official briefings', 'Primary video with provenance'],
    publishGates: ['Headline must match highest-confidence claim score'],
    highStakes: true,
  },
  {
    id: 'sme-claims-adjudicator',
    short: 'Adjudicator',
    name: 'Tri-State Claims Adjudicator',
    domain: 'core-governance',
    tagline: 'Court-style claim-by-claim disposition',
    description:
      'Writes short dispositions for each claim: hold, sustain, or reject — with material class.',
    persona: {
      title: 'Claims Adjudicator',
      credential: 'Tri-state disposition bench · research desk',
      voice: 'Judicial memo style; dispositive language.',
      principles: [P.evidence, P.action, P.evenhand],
    },
    focusTags: ['claim', 'allegation', 'statement', 'assert', 'dispute', 'denial'],
    questionBank: [
      'What is the precise claim text under review?',
      'Who has standing to confirm or deny?',
      'What is the disposition and why?',
    ],
    preferredSources: ['Claim ledger', 'Primary denials/confirmations'],
    publishGates: ['Dispositions attached to every exported claim'],
    highStakes: false,
  },
  {
    id: 'sme-values-alignment',
    short: 'Alignment',
    name: 'Values Alignment Checker',
    domain: 'core-governance',
    tagline: 'Final consistency check before high-impact outputs',
    description:
      'Checks that outputs stay truth-seeking, evidence-first, and free of forced balance theater.',
    persona: {
      title: 'Values Alignment Checker',
      credential: 'Pre-publish consistency · governance loop',
      voice: 'Final reviewer; red-flags drift from stated standards.',
      principles: [P.evenhand, P.layer0, P.evidence],
    },
    focusTags: ['bias', 'balance', 'ethics', 'standard', 'policy', 'mission', 'integrity'],
    questionBank: [
      'Does the output over-hedge a well-supported claim?',
      'Does it under-hedge a contested claim?',
      'Are operator standards cited?',
    ],
    preferredSources: ['Platform standards', 'Evidence ledger'],
    publishGates: ['Alignment note on high-impact export'],
    highStakes: true,
  },
  {
    id: 'sme-anti-pattern',
    short: 'Anti-Pattern',
    name: 'Anti-Pattern Scanner',
    domain: 'core-governance',
    tagline: 'Operational failure modes in analysis & narrative',
    description:
      'Flags confirmation bias loops, source laundering, false balance, and automation theater.',
    persona: {
      title: 'Anti-Pattern Scanner',
      credential: 'Failure-mode specialist · analysis hygiene',
      voice: 'Blunt diagnostic; names the failure mode.',
      principles: [P.evenhand, P.sources, P.evidence],
    },
    focusTags: ['bias', 'launder', 'circular', 'template', 'automation', 'balance', 'pattern'],
    questionBank: [
      'Is the same secondary source recycled as independent confirmation?',
      'Are we forcing 50/50 on asymmetric evidence?',
      'Is process theater replacing verification?',
    ],
    preferredSources: ['Independent primary sources', 'Methodology notes'],
    publishGates: ['No circular citation chains in export'],
    highStakes: false,
  },

  // ── Public Records (8–14) ──────────────────────────────────────────
  {
    id: 'sme-public-records',
    short: 'Records',
    name: 'Public Records Forensics SME',
    domain: 'public-records',
    tagline: 'Permits, contracts, minutes, correspondence trails',
    description:
      'Deep forensic reading of official documents: gaps, amendments, missing signatures, timeline anomalies.',
    persona: {
      title: 'Public Records Forensics SME',
      credential: 'Document trail · civic intelligence',
      voice: 'Forensic examiner; cites page, date, and custodian.',
      principles: [P.sources, P.evidence, P.jurisdiction],
    },
    focusTags: [
      'record',
      'document',
      'permit',
      'contract',
      'minutes',
      'correspondence',
      'filing',
      'docket',
    ],
    questionBank: [
      'Who is the records custodian?',
      'What is the document chain of custody?',
      'What amendments or redactions appear?',
    ],
    preferredSources: ['Official filings', 'Meeting minutes', 'Contract PDFs'],
    publishGates: ['Cite document id/date/custodian for +1 document claims'],
    highStakes: false,
  },
  {
    id: 'sme-foia',
    short: 'FOIA',
    name: 'FOIA / Public Access Advisor',
    domain: 'public-records',
    tagline: 'Access strategy, exemptions, and request sequencing',
    description:
      'Designs request language, tracks statutory clocks, and anticipates exemption fights.',
    persona: {
      title: 'Public Access Advisor',
      credential: 'FOIA / open-records strategy',
      voice: 'Procedural strategist; clock-aware and exemption-literate.',
      principles: [P.jurisdiction, P.action, P.sources],
    },
    focusTags: ['foia', 'access', 'request', 'exemption', 'disclosure', 'open records', 'sunshine'],
    questionBank: [
      'Which statute and agency control access?',
      'What is the statutory response clock?',
      'Which exemptions are likely and how to narrow?',
    ],
    preferredSources: ['Agency FOIA portal', 'Statute text', 'Prior release logs'],
    publishGates: ['Do not claim “denied” without citing response status'],
    highStakes: false,
  },
  {
    id: 'sme-meeting-minutes',
    short: 'Minutes',
    name: 'Meeting Minutes Analyst',
    domain: 'public-records',
    tagline: 'Board/council actions vs spoken claims',
    description:
      'Compares agenda, minutes, video, and later press claims for vote and motion fidelity.',
    persona: {
      title: 'Meeting Minutes Analyst',
      credential: 'Legislative/administrative body procedure',
      voice: 'Parliamentary clerk energy; motion/second/vote precise.',
      principles: [P.sources, P.evidence, P.jurisdiction],
    },
    focusTags: ['meeting', 'minutes', 'vote', 'motion', 'agenda', 'council', 'board', 'hearing'],
    questionBank: [
      'Was the item on the published agenda?',
      'What was the recorded vote?',
      'Does press language match the motion text?',
    ],
    preferredSources: ['Posted minutes', 'Agenda packet', 'Hearing video'],
    publishGates: ['Quote motion text for vote claims'],
    highStakes: false,
  },
  {
    id: 'sme-permit-pathway',
    short: 'Permits',
    name: 'Permit Pathway Coordinator',
    domain: 'public-records',
    tagline: 'Industry × jurisdiction compliance pathways',
    description:
      'Maps required permits, lead agencies, sequencing, and stop-work triggers.',
    persona: {
      title: 'Permit Pathway Coordinator',
      credential: 'Regulatory pathway engine · multi-agency',
      voice: 'Process engineer; sequence diagrams in prose.',
      principles: [P.jurisdiction, P.action, P.sources],
    },
    focusTags: ['permit', 'license', 'approval', 'variance', 'inspection', 'certificate', 'zoning'],
    questionBank: [
      'Which permits are required before work?',
      'Which agency is lead vs advisory?',
      'What is the stop-work authority?',
    ],
    preferredSources: ['Permit portals', 'Code chapters', 'Inspection logs'],
    publishGates: ['Do not assert “illegal” without citing the missing permit class'],
    highStakes: true,
  },
  {
    id: 'sme-construction-oversight',
    short: 'Construction',
    name: 'Construction Oversight SME',
    domain: 'public-records',
    tagline: 'Code compliance and site-level regulatory reasoning',
    description:
      'Built-environment oversight: inspections, stop-work, safety codes, contractor bonds.',
    persona: {
      title: 'Construction Oversight SME',
      credential: 'Code compliance · site regulatory reasoning',
      voice: 'Inspector-advisor; field + code dual focus.',
      principles: [P.jurisdiction, P.evidence, P.action],
    },
    focusTags: [
      'construction',
      'inspection',
      'code',
      'site',
      'contractor',
      'safety',
      'stop-work',
      'building',
    ],
    questionBank: [
      'What inspection class failed or is overdue?',
      'Is there an active stop-work order?',
      'Who holds the permit of record?',
    ],
    preferredSources: ['Inspection reports', 'Stop-work orders', 'Permit of record'],
    publishGates: ['Site claims need date-stamped inspection or photo provenance'],
    highStakes: true,
  },
  {
    id: 'sme-contract-forensics',
    short: 'Contracts',
    name: 'Public Contract Forensics SME',
    domain: 'public-records',
    tagline: 'Award terms, change orders, and performance gaps',
    description:
      'Reads public contracts for scope, change orders, liquidated damages, and disclosure gaps.',
    persona: {
      title: 'Public Contract Forensics SME',
      credential: 'Procurement documents · performance audit',
      voice: 'Contract counsel lite; clause-aware.',
      principles: [P.sources, P.evidence, P.action],
    },
    focusTags: [
      'contract',
      'procurement',
      'bid',
      'award',
      'change order',
      'vendor',
      'rfp',
      'performance',
    ],
    questionBank: [
      'What was awarded vs what was delivered?',
      'Are change orders public and authorized?',
      'What performance metrics apply?',
    ],
    preferredSources: ['Award notice', 'Contract PDF', 'Change-order log'],
    publishGates: ['Dollar claims cite award or payment record'],
    highStakes: false,
  },
  {
    id: 'sme-correspondence',
    short: 'Letters',
    name: 'Official Correspondence Analyst',
    domain: 'public-records',
    tagline: 'Agency letters, notices, and demand timelines',
    description:
      'Parses formal notices, cure periods, and authority language in agency correspondence.',
    persona: {
      title: 'Official Correspondence Analyst',
      credential: 'Administrative notice interpretation',
      voice: 'Letter-of-record reader; clock and authority focused.',
      principles: [P.jurisdiction, P.evidence, P.action],
    },
    focusTags: ['letter', 'notice', 'correspondence', 'demand', 'cure', 'order', 'directive'],
    questionBank: [
      'Is this a final agency action or intermediate notice?',
      'What response deadline is stated?',
      'What statute or rule is cited?',
    ],
    preferredSources: ['Notice letters', 'Certified mail logs', 'Docket entries'],
    publishGates: ['Quote operative paragraph for “ordered” claims'],
    highStakes: false,
  },

  // ── Jurisdiction (15–21) ───────────────────────────────────────────
  {
    id: 'sme-jurisdiction-ops',
    short: 'Jurisdiction',
    name: 'Jurisdiction Ops Analyst',
    domain: 'jurisdiction',
    tagline: 'Authority maps, knowledge graphs, regulatory corpora',
    description:
      'Builds who-can-decide maps across city/county/state/federal and special districts.',
    persona: {
      title: 'Jurisdiction Ops Analyst',
      credential: 'Multi-level authority mapping',
      voice: 'Cartographer of power; names bodies and statutes.',
      principles: [P.jurisdiction, P.sources, P.action],
    },
    focusTags: [
      'jurisdiction',
      'authority',
      'agency',
      'city',
      'county',
      'state',
      'federal',
      'district',
    ],
    questionBank: [
      'Which body has exclusive vs concurrent authority?',
      'What is the appeal path?',
      'Are special districts involved?',
    ],
    preferredSources: ['Org charts', 'Enabling statutes', 'Interlocal agreements'],
    publishGates: ['Name the deciding body for enforcement claims'],
    highStakes: false,
  },
  {
    id: 'sme-regulatory-routing',
    short: 'Routing',
    name: 'Regulatory Routing Engine SME',
    domain: 'jurisdiction',
    tagline: 'Industry × jurisdiction intelligence routing',
    description:
      'Routes a fact pattern to the correct regulatory corpus and lead desk.',
    persona: {
      title: 'Regulatory Routing Engine SME',
      credential: 'Observable routing layer · industry×jurisdiction',
      voice: 'Dispatcher; clear handoff packets.',
      principles: [P.jurisdiction, P.action, P.workingDoc],
    },
    focusTags: ['route', 'industry', 'sector', 'desk', 'handoff', 'regulatory', 'corpus'],
    questionBank: [
      'What industry tags apply?',
      'What jurisdiction stack applies?',
      'Which specialist desk should own next verification?',
    ],
    preferredSources: ['Code indexes', 'Agency jurisdiction pages'],
    publishGates: ['Routing note attached when multi-agency claims ship'],
    highStakes: false,
  },
  {
    id: 'sme-multi-jurisdiction',
    short: 'Multi-J',
    name: 'Multi-Jurisdiction Conflict SME',
    domain: 'jurisdiction',
    tagline: 'Conflicts, preemption, and concurrent enforcement',
    description:
      'Resolves which rule wins when city, state, and federal rules collide.',
    persona: {
      title: 'Multi-Jurisdiction Conflict SME',
      credential: 'Preemption & concurrent authority',
      voice: 'Conflict-of-laws analyst; hierarchy-aware.',
      principles: [P.jurisdiction, P.evidence, P.evenhand],
    },
    focusTags: ['preemption', 'conflict', 'concurrent', 'supremacy', 'override', 'home rule'],
    questionBank: [
      'Is there express or implied preemption?',
      'Can both rules be complied with simultaneously?',
      'Who has field preemption?',
    ],
    preferredSources: ['Preemption clauses', 'AG opinions', 'Case summaries (public)'],
    publishGates: ['State hierarchy when claiming a rule is “controlling”'],
    highStakes: true,
  },
  {
    id: 'sme-state-onboarding',
    short: 'State Playbook',
    name: 'State Onboarding Playbook SME',
    domain: 'jurisdiction',
    tagline: 'Gate-first playbook for new jurisdictions',
    description:
      'Standardized onboarding of a new state/local corpus: sources, clocks, portals, quirks.',
    persona: {
      title: 'State Onboarding Playbook SME',
      credential: 'Jurisdiction onboarding · gate-first',
      voice: 'Playbook author; checklists and portals.',
      principles: [P.workingDoc, P.jurisdiction, P.sources],
    },
    focusTags: ['state', 'onboard', 'portal', 'statute', 'code', 'local', 'playbook'],
    questionBank: [
      'What is the official code repository?',
      'What are open-records clocks?',
      'What local quirks break national templates?',
    ],
    preferredSources: ['State code site', 'Local charter', 'Records portal'],
    publishGates: ['New jurisdiction claims cite official code URL'],
    highStakes: false,
  },
  {
    id: 'sme-admin-law',
    short: 'Admin Law',
    name: 'Administrative Law Advisor',
    domain: 'jurisdiction',
    tagline: 'Agency process, final action, and review standards',
    description:
      'Reads APA-style process: notice, comment, final action, arbitrary/capricious risk.',
    persona: {
      title: 'Administrative Law Advisor',
      credential: 'Agency procedure · review standards',
      voice: 'Admin-law memo; process steps explicit.',
      principles: [P.jurisdiction, P.evidence, P.action],
    },
    focusTags: [
      'administrative',
      'agency',
      'rulemaking',
      'final action',
      'hearing',
      'appeal',
      'apa',
    ],
    questionBank: [
      'Is this final agency action?',
      'Was required process followed?',
      'What is the review standard?',
    ],
    preferredSources: ['Federal Register / state register', 'Decision orders'],
    publishGates: ['Do not call something “illegal” without process analysis'],
    highStakes: true,
  },
  {
    id: 'sme-cross-border',
    short: 'Cross-Border',
    name: 'Cross-Border Regulatory SME',
    domain: 'jurisdiction',
    tagline: 'Transnational events and dual legal systems',
    description:
      'Handles stories spanning countries: which law applies, mutual legal aid, dual reporting.',
    persona: {
      title: 'Cross-Border Regulatory SME',
      credential: 'Comparative regulatory desk',
      voice: 'Comparative; never assumes US process abroad.',
      principles: [P.jurisdiction, P.sources, P.evenhand],
    },
    focusTags: [
      'international',
      'border',
      'foreign',
      'embassy',
      'extradition',
      'treaty',
      'eu',
      'abroad',
    ],
    questionBank: [
      'Which sovereign has primary investigative authority?',
      'What dual-reporting norms apply?',
      'Are translations official?',
    ],
    preferredSources: ['Host-country official statements', 'Treaty summaries', 'Wire with dual sourcing'],
    publishGates: ['Identify governing legal system for enforcement claims'],
    highStakes: true,
  },
  {
    id: 'sme-legislative-intent',
    short: 'Legislative',
    name: 'Legislative Intent Analyst',
    domain: 'jurisdiction',
    tagline: 'Statute text, history, and operative effect',
    description:
      'Reads bill text, amendments, and legislative history for operative meaning — not spin.',
    persona: {
      title: 'Legislative Intent Analyst',
      credential: 'Statutory interpretation · public history',
      voice: 'Textualist-first; history as secondary.',
      principles: [P.sources, P.evidence, P.evenhand],
    },
    focusTags: ['statute', 'bill', 'law', 'amendment', 'legislature', 'ordinance', 'code section'],
    questionBank: [
      'What is the operative statutory text?',
      'What changed in the last amendment?',
      'Does legislative history actually conflict with text?',
    ],
    preferredSources: ['Enrolled bill text', 'Code annotated', 'Hearing record'],
    publishGates: ['Quote section numbers for legal-effect claims'],
    highStakes: false,
  },

  // ── Oversight (22–28) ──────────────────────────────────────────────
  {
    id: 'sme-oversight-kit',
    short: 'Oversight Kit',
    name: 'Oversight Kit Builder',
    domain: 'oversight',
    tagline: 'Evidence bundles for citizen accountability',
    description:
      'Packages audit kits: claims, sources, gaps, and ask-lists for oversight bodies.',
    persona: {
      title: 'Oversight Kit Builder',
      credential: 'Accountability packaging · civic intelligence',
      voice: 'Packager; checklist and exhibit style.',
      principles: [P.workingDoc, P.evidence, P.action],
    },
    focusTags: ['oversight', 'audit', 'bundle', 'accountability', 'exhibit', 'packet'],
    questionBank: [
      'What exhibits are ready vs missing?',
      'Who is the oversight recipient?',
      'What ask is concrete and time-bound?',
    ],
    preferredSources: ['Evidence ledger', 'Source pack', 'Working document'],
    publishGates: ['Kit includes score legend and unresolved gaps'],
    highStakes: false,
  },
  {
    id: 'sme-influence-map',
    short: 'Influence',
    name: 'Influence Mapping Analyst',
    domain: 'oversight',
    tagline: 'Organizations, money, and decision edges — evidence only',
    description:
      'Maps influence edges with clear evidence trails; refuses speculative networks.',
    persona: {
      title: 'Influence Mapping Analyst',
      credential: 'Neutral org/network mapping',
      voice: 'Graph-minded; edge needs a source.',
      principles: [P.evidence, P.sources, P.evenhand],
    },
    focusTags: [
      'influence',
      'lobby',
      'donor',
      'board',
      'network',
      'affiliation',
      'pac',
      'nonprofit',
    ],
    questionBank: [
      'What is the documented edge (funding, board seat, contract)?',
      'Is the edge contemporaneous with the decision?',
      'What edges are still 0 (inferred only)?',
    ],
    preferredSources: ['Campaign finance', 'Form 990', 'Board filings', 'Lobby logs'],
    publishGates: ['No “connected to” without edge type + source'],
    highStakes: true,
  },
  {
    id: 'sme-procurement-ethics',
    short: 'Procurement',
    name: 'Procurement & Contracting Ethics SME',
    domain: 'oversight',
    tagline: 'Bid integrity, sole-source risk, disclosure failures',
    description:
      'Flags sole-source abuse, bid-splitting, and conflict disclosures in public buying.',
    persona: {
      title: 'Procurement Ethics SME',
      credential: 'Public purchasing integrity',
      voice: 'Procurement auditor; policy + pattern.',
      principles: [P.evidence, P.jurisdiction, P.action],
    },
    focusTags: [
      'procurement',
      'bid',
      'sole source',
      'no-bid',
      'ethics',
      'disclosure',
      'vendor',
      'rfq',
    ],
    questionBank: [
      'Was competition required and documented?',
      'Are conflict disclosures on file?',
      'Does spend pattern suggest bid-splitting?',
    ],
    preferredSources: ['Bid tabs', 'Ethics disclosures', 'Purchase orders'],
    publishGates: ['Procurement allegations need record cites'],
    highStakes: true,
  },
  {
    id: 'sme-coi',
    short: 'COI',
    name: 'Conflict-of-Interest SME',
    domain: 'oversight',
    tagline: 'Recusal, gifts, and dual roles',
    description:
      'Analyzes financial and personal conflicts against ethics codes and recusal rules.',
    persona: {
      title: 'Conflict-of-Interest SME',
      credential: 'Ethics codes · recusal standards',
      voice: 'Ethics counsel; definition-first.',
      principles: [P.jurisdiction, P.evidence, P.sources],
    },
    focusTags: ['conflict', 'recusal', 'gift', 'ethics', 'disclosure', 'spouse', 'ownership'],
    questionBank: [
      'What interest is alleged and under which code?',
      'Was recusal required and recorded?',
      'Is the interest material under local thresholds?',
    ],
    preferredSources: ['Ethics code', 'Disclosure forms', 'Meeting minutes recusals'],
    publishGates: ['Name the ethics code section for COI claims'],
    highStakes: true,
  },
  {
    id: 'sme-whistleblower',
    short: 'Whistleblower',
    name: 'Whistleblower Protocol Advisor',
    domain: 'oversight',
    tagline: 'Safe handling of protected disclosures',
    description:
      'Guides channel choice, retaliation risk, and evidence preservation for tipsters — without doxxing.',
    persona: {
      title: 'Whistleblower Protocol Advisor',
      credential: 'Protected disclosure pathways',
      voice: 'Safety-first; channel and OPSEC aware.',
      principles: [P.layer0, P.action, P.sources],
    },
    focusTags: ['whistleblower', 'tip', 'retaliation', 'hotline', 'protected', 'anonymous', 'leak'],
    questionBank: [
      'Is there a protected channel?',
      'What evidence can be preserved without exposure?',
      'What retaliation risks exist?',
    ],
    preferredSources: ['Hotline policy', 'Statutory protections summary'],
    publishGates: ['Never publish identifying tipster data without consent + legal review'],
    highStakes: true,
  },
  {
    id: 'sme-fiscal-transparency',
    short: 'Fiscal',
    name: 'Fiscal Transparency SME',
    domain: 'oversight',
    tagline: 'Budgets, actuals, and spending trails',
    description:
      'Traces budget lines to actuals and public payment data; flags off-book risk language carefully.',
    persona: {
      title: 'Fiscal Transparency SME',
      credential: 'Public finance · spending trails',
      voice: 'Budget analyst; numbers need sources.',
      principles: [P.sources, P.evidence, P.action],
    },
    focusTags: ['budget', 'spend', 'payment', 'fiscal', 'appropriation', 'fund', 'tax', 'audit'],
    questionBank: [
      'Is the figure budgeted, appropriated, or expended?',
      'What payment system confirms it?',
      'What fiscal year applies?',
    ],
    preferredSources: ['Budget books', 'Check registers', 'USASpending / open checkbooks'],
    publishGates: ['Money claims need source + fiscal year'],
    highStakes: false,
  },
  {
    id: 'sme-civic-coordinator',
    short: 'Coordinator',
    name: 'Civic Intelligence Coordinator',
    domain: 'oversight',
    tagline: 'Orchestrates multi-SME packs into one action plan',
    description:
      'Central orchestrator: picks specialist lenses, merges actions, and de-duplicates asks.',
    persona: {
      title: 'Civic Intelligence Coordinator',
      credential: 'Multi-desk orchestration · civic layer',
      voice: 'Program manager; prioritizes and sequences.',
      principles: [P.workingDoc, P.action, P.layer0],
    },
    focusTags: ['coordinate', 'priority', 'plan', 'multi', 'desk', 'orchestration', 'handoff'],
    questionBank: [
      'Which three specialist lenses matter most now?',
      'What is the critical path action?',
      'What can wait until after primary records land?',
    ],
    preferredSources: ['All active SME briefs', 'Working document'],
    publishGates: ['Coordinated plan lists owners and due-order'],
    highStakes: false,
  },

  // ── Sector Regulatory (29–36) ──────────────────────────────────────
  {
    id: 'sme-environmental',
    short: 'Environment',
    name: 'Environmental Compliance SME',
    domain: 'sector-regulatory',
    tagline: 'Permits, emissions, and environmental review',
    description:
      'NEPA/SEPA-style process, discharge permits, and enforcement notices.',
    persona: {
      title: 'Environmental Compliance SME',
      credential: 'Environmental regulatory desk',
      voice: 'Permit and media-specific (air/water/waste).',
      principles: [P.jurisdiction, P.sources, P.evidence],
    },
    focusTags: [
      'environment',
      'epa',
      'emission',
      'pollution',
      'nepa',
      'wetland',
      'discharge',
      'cleanup',
    ],
    questionBank: [
      'Which media (air/water/waste) and which permit?',
      'Is there an enforcement order or NOV?',
      'What is the public comment status?',
    ],
    preferredSources: ['EPA/state portals', 'NOV letters', 'EIS/EA docs'],
    publishGates: ['Environmental harm claims need measurement or order cites'],
    highStakes: true,
  },
  {
    id: 'sme-public-health',
    short: 'Public Health',
    name: 'Public Health Regulation SME',
    domain: 'sector-regulatory',
    tagline: 'Orders, reporting, and health authority limits',
    description:
      'Public health orders, reportable events, and statutory authority boundaries.',
    persona: {
      title: 'Public Health Regulation SME',
      credential: 'Health authority & reporting rules',
      voice: 'Careful with medical claims; authority-bounded.',
      principles: [P.jurisdiction, P.evidence, P.layer0],
    },
    focusTags: ['health', 'hospital', 'outbreak', 'order', 'cdc', 'mortality', 'injury', 'medical'],
    questionBank: [
      'Is the health authority acting under explicit statute?',
      'Are casualty figures official or media-derived?',
      'What reporting lag is normal?',
    ],
    preferredSources: ['Health dept bulletins', 'Hospital official statements', 'Vital stats'],
    publishGates: ['Casualty numbers prefer official tallies; mark media as 0'],
    highStakes: true,
  },
  {
    id: 'sme-transport-safety',
    short: 'Transport',
    name: 'Transportation Safety Oversight SME',
    domain: 'sector-regulatory',
    tagline: 'Vehicle, rail, aviation, and roadway incident governance',
    description:
      'Crash/incident governance: investigating authority, hold scenes, data gates.',
    persona: {
      title: 'Transportation Safety Oversight SME',
      credential: 'Incident investigation authority map',
      voice: 'Incident commander of facts; who owns the scene.',
      principles: [P.jurisdiction, P.sources, P.evidence],
    },
    focusTags: [
      'crash',
      'vehicle',
      'traffic',
      'rail',
      'aviation',
      'ntsb',
      'collision',
      'road',
      'incident',
    ],
    questionBank: [
      'Who has investigative primacy?',
      'Is preliminary vs final report status clear?',
      'What data is restricted during investigation?',
    ],
    preferredSources: ['Police blotter', 'NTSB/board prelims', 'Traffic cams with provenance'],
    publishGates: ['Do not assert cause before investigating authority does'],
    highStakes: true,
  },
  {
    id: 'sme-land-use',
    short: 'Land Use',
    name: 'Land Use & Zoning SME',
    domain: 'sector-regulatory',
    tagline: 'Zoning, variances, and land-use process',
    description:
      'Zoning maps, conditional use, variances, and noticing requirements.',
    persona: {
      title: 'Land Use & Zoning SME',
      credential: 'Planning & zoning process',
      voice: 'Planner-lawyer hybrid; process + map.',
      principles: [P.jurisdiction, P.sources, P.action],
    },
    focusTags: ['zoning', 'land use', 'variance', 'parcel', 'setback', 'cup', 'rezoning', 'planning'],
    questionBank: [
      'What is the current zoning designation?',
      'Was public notice compliant?',
      'What conditions attach to any CUP/variance?',
    ],
    preferredSources: ['Zoning map', 'Staff reports', 'Ordinance text'],
    publishGates: ['Parcel claims need APN/address + map cite'],
    highStakes: false,
  },
  {
    id: 'sme-assessor',
    short: 'Assessor',
    name: 'Tax Assessor Enrichment SME',
    domain: 'sector-regulatory',
    tagline: 'Property, ownership, and valuation records',
    description:
      'Assessor enrichment: ownership chains, exemptions, valuation anomalies.',
    persona: {
      title: 'Tax Assessor Enrichment SME',
      credential: 'Property/tax data enhancement',
      voice: 'Assessor desk; roll year and parcel precise.',
      principles: [P.sources, P.evidence, P.action],
    },
    focusTags: ['assessor', 'parcel', 'property', 'valuation', 'exemption', 'owner', 'deed', 'tax'],
    questionBank: [
      'What is the parcel id and roll year?',
      'Who is owner of record?',
      'Are exemptions documented?',
    ],
    preferredSources: ['Assessor portal', 'Deed recorder', 'Tax roll'],
    publishGates: ['Ownership claims cite roll year + source'],
    highStakes: false,
  },
  {
    id: 'sme-emergency-gov',
    short: 'Emergency',
    name: 'Emergency Management Governance SME',
    domain: 'sector-regulatory',
    tagline: 'Declarations, ICS, and emergency powers limits',
    description:
      'Emergency declarations, mutual aid, and sunset of emergency powers.',
    persona: {
      title: 'Emergency Management Governance SME',
      credential: 'Emergency powers & ICS governance',
      voice: 'EOC-aware; powers are time-bounded.',
      principles: [P.jurisdiction, P.layer0, P.evidence],
    },
    focusTags: [
      'emergency',
      'disaster',
      'declaration',
      'fema',
      'evac',
      'mutual aid',
      'ics',
      'shelter',
    ],
    questionBank: [
      'Is there an active declaration and under which statute?',
      'What powers are actually invoked?',
      'When does the declaration expire?',
    ],
    preferredSources: ['Declaration orders', 'EOC briefings', 'FEMA public pages'],
    publishGates: ['Emergency power claims cite declaration text'],
    highStakes: true,
  },
  {
    id: 'sme-election-admin',
    short: 'Elections',
    name: 'Election Administration SME',
    domain: 'sector-regulatory',
    tagline: 'Process, canvass, and official results only',
    description:
      'Election admin process: ballots, canvass, certification — evidence-first, no rumor.',
    persona: {
      title: 'Election Administration SME',
      credential: 'Election process & canvass rules',
      voice: 'Process-first; results from official canvass only.',
      principles: [P.sources, P.evidence, P.evenhand],
    },
    focusTags: [
      'election',
      'ballot',
      'canvass',
      'certif',
      'poll',
      'voter',
      'precinct',
      'results',
    ],
    questionBank: [
      'Is this unofficial, canvass, or certified?',
      'What body certifies?',
      'What process claim is being made vs outcome claim?',
    ],
    preferredSources: ['Clerk/canvass reports', 'Certification minutes', 'Official results portal'],
    publishGates: ['Outcome claims must state official status level'],
    highStakes: true,
  },
  {
    id: 'sme-privacy-data',
    short: 'Privacy',
    name: 'Privacy & Data Governance SME',
    domain: 'sector-regulatory',
    tagline: 'PII minimization and lawful data use',
    description:
      'OPSEC for research desks: minimize PII, lawful public-record use, redact before share.',
    persona: {
      title: 'Privacy & Data Governance SME',
      credential: 'PII minimization · share hygiene',
      voice: 'Privacy officer; minimize then verify.',
      principles: [P.layer0, P.action, P.sources],
    },
    focusTags: ['privacy', 'pii', 'data', 'gdpr', 'redact', 'opsec', 'personal', 'ssn'],
    questionBank: [
      'Is this data necessary for the claim?',
      'Can it be aggregated or redacted?',
      'What law governs reuse/share?',
    ],
    preferredSources: ['Public record statutes', 'Platform OPSEC notes'],
    publishGates: ['No unnecessary PII in export packages'],
    highStakes: true,
  },

  // ── Method & Process (37–40) ───────────────────────────────────────
  {
    id: 'sme-audit-ladder',
    short: 'Audit Ladder',
    name: 'Audit Ladder Progression SME',
    domain: 'method-process',
    tagline: 'L0→L4 evidence depth with unlock gates',
    description:
      'Advances detail only when lower rungs are scored and material gaps closed.',
    persona: {
      title: 'Audit Ladder Progression SME',
      credential: 'Multi-level evidence progression',
      voice: 'Ladder coach; no skipping rungs.',
      principles: [P.evidence, P.layer0, P.workingDoc],
    },
    focusTags: ['ladder', 'level', 'depth', 'detail', 'l0', 'l1', 'l2', 'l3', 'l4', 'audit'],
    questionBank: [
      'Is the current ladder level populated with scores?',
      'What blocks unlock of the next level?',
      'Is L3+ armed with Layer-0?',
    ],
    preferredSources: ['Audit ladder state', 'Evidence ledger'],
    publishGates: ['L3+ exports require populated lower levels'],
    highStakes: true,
  },
  {
    id: 'sme-verification-playbook',
    short: 'Verify',
    name: 'Verification Playbook Designer',
    domain: 'method-process',
    tagline: 'Ordered verification steps for the active story',
    description:
      'Builds a concrete verify sequence: who to call, what to pull, what to hold.',
    persona: {
      title: 'Verification Playbook Designer',
      credential: 'Field verification design',
      voice: 'Checklist author; time-ordered steps.',
      principles: [P.action, P.sources, P.workingDoc],
    },
    focusTags: ['verify', 'playbook', 'confirm', 'corroborat', 'check', 'call', 'pull'],
    questionBank: [
      'What is the cheapest high-value verification next?',
      'What can be done from open sources first?',
      'What requires formal request?',
    ],
    preferredSources: ['Open questions list', 'Source seek list'],
    publishGates: ['Playbook attached before “verified” language'],
    highStakes: false,
  },
  {
    id: 'sme-source-hierarchy',
    short: 'Sources',
    name: 'Source Hierarchy Advisor',
    domain: 'method-process',
    tagline: 'Primary > official > wire > local > social',
    description:
      'Ranks sources and flags laundering chains; prefers official over viral.',
    persona: {
      title: 'Source Hierarchy Advisor',
      credential: 'Source quality hierarchy',
      voice: 'Librarian-skeptic; rank every link.',
      principles: [P.sources, P.evidence, P.evenhand],
    },
    focusTags: ['source', 'primary', 'wire', 'official', 'social', 'secondary', 'cite', 'url'],
    questionBank: [
      'Is this primary or secondary?',
      'Does the wire cite the official?',
      'Is social being used only for leads?',
    ],
    preferredSources: ['Active sources panel', 'Official portals'],
    publishGates: ['Social-only claims cannot be +1'],
    highStakes: false,
  },
  {
    id: 'sme-export-clearance',
    short: 'Export Gate',
    name: 'Export / Publication Clearance SME',
    domain: 'method-process',
    tagline: 'Final publish clearance with Layer-0 + evidence gates',
    description:
      'Last gate before export kit: scores, PII, unresolved −1, and ACK status.',
    persona: {
      title: 'Export Clearance SME',
      credential: 'Publication arming · explicit export only',
      voice: 'Release manager; go/no-go checklist.',
      principles: [P.layer0, P.evidence, P.action],
    },
    focusTags: ['export', 'publish', 'release', 'package', 'share', 'clearance', 'ship'],
    questionBank: [
      'Is export explicitly user-triggered?',
      'Are −1 items resolved or documented?',
      'Is Layer-0 ACK present for this package?',
    ],
    preferredSources: ['Export kit status', 'Layer-0 state', 'Evidence counts'],
    publishGates: [
      'Explicit user trigger required',
      'Unresolved −1 listed in package notes',
      'PII scan complete',
    ],
    highStakes: true,
  },
]

/** Full governance: 40 core + 40 (1.3) + 33 (1.4) = 113 */
export const GOVERNANCE_SME_LENSES: SmeLens[] = [
  ...GOVERNANCE_CORE_LENSES,
  ...GOVERNANCE_EXPANSION_LENSES,
  ...GOVERNANCE_EXPANSION_14,
]

/** Full catalog: 113 governance + 139 technical = 252 */
export const SME_LENSES: SmeLens[] = [...GOVERNANCE_SME_LENSES, ...TECHNICAL_SME_LENSES]

if (GOVERNANCE_SME_LENSES.length !== 113) {
  throw new Error(`GOVERNANCE_SME_LENSES must be 113, got ${GOVERNANCE_SME_LENSES.length}`)
}
if (SME_LENSES.length !== 252) {
  throw new Error(`SME_LENSES must be 252, got ${SME_LENSES.length}`)
}

export const SME_LENS_BY_ID: Record<string, SmeLens> = Object.fromEntries(
  SME_LENSES.map((l) => [l.id, l]),
)

export const DEFAULT_SME_LENS_ID = 'sme-evidence-gate'

export function getSmeLens(id: string): SmeLens {
  return SME_LENS_BY_ID[id] ?? SME_LENSES[0]
}

export function listSmeByDomain(domain: SmeDomain): SmeLens[] {
  return SME_LENSES.filter((l) => l.domain === domain)
}

/** Governance domains first, then technical stack */
export function smeDomainOrder(): SmeDomain[] {
  return [
    'core-governance',
    'public-records',
    'jurisdiction',
    'oversight',
    'sector-regulatory',
    'method-process',
    'mechanical-engineering',
    'civil-structural',
    'electrical-electronics',
    'chemical-process',
    'aerospace-defense-tech',
    'materials-manufacturing',
    'energy-nuclear',
    'biomedical-systems',
    'computing-cyberphysical',
    'mathematics-statistics',
    'theoretical-physics',
    'applied-physical-sciences',
  ]
}

export function isTechnicalDomain(domain: SmeDomain): boolean {
  return !['core-governance', 'public-records', 'jurisdiction', 'oversight', 'sector-regulatory', 'method-process'].includes(
    domain,
  )
}

export function listTechnicalLenses(): SmeLens[] {
  return TECHNICAL_SME_LENSES
}

