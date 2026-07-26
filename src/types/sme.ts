/**
 * SME Lens contracts — regulatory, governance, and technical analyst personas.
 * Each lens is a professional research advisor that scores claims
 * with tri-state evidence and produces actionable next steps.
 */

import type { EvidenceScore, MaterialClass, ModuleId } from './core'

/** High-level stack: governance pack + technical reasoning bank */
export type SmeDomain =
  | 'core-governance'
  | 'public-records'
  | 'jurisdiction'
  | 'oversight'
  | 'sector-regulatory'
  | 'method-process'
  | 'mechanical-engineering'
  | 'civil-structural'
  | 'electrical-electronics'
  | 'chemical-process'
  | 'aerospace-defense-tech'
  | 'materials-manufacturing'
  | 'energy-nuclear'
  | 'biomedical-systems'
  | 'computing-cyberphysical'
  | 'mathematics-statistics'
  | 'theoretical-physics'
  | 'applied-physical-sciences'

export type SmeUrgency = 'routine' | 'elevated' | 'critical'

export interface SmePersona {
  /** Display name of the advisor role */
  title: string
  /** Short credential line (no real persons) */
  credential: string
  /** How this SME writes / adjudicates */
  voice: string
  /** Standing principles (civic-intelligence lineage) */
  principles: string[]
}

export interface SmeLens {
  id: string
  /** Short slug label for chips */
  short: string
  name: string
  domain: SmeDomain
  /** One-line value prop */
  tagline: string
  description: string
  persona: SmePersona
  /** Keywords used to rank claim relevance */
  focusTags: string[]
  /** Standard questions this SME always asks */
  questionBank: string[]
  /** Default sources this SME wants on the desk */
  preferredSources: string[]
  /** Publication / export gates this SME enforces */
  publishGates: string[]
  /** Layer-0 style: if true, lens flags high-stakes export */
  highStakes: boolean
}

export interface SmeClaimRead {
  claimId: string
  claimTitle: string
  claimSummary: string
  originalScore: EvidenceScore
  /** SME's independent score through this lens */
  smeScore: EvidenceScore
  material: MaterialClass
  relevance: number
  /** 0–100 confidence in the SME read */
  confidence: number
  finding: string
  action: string
  gaps: string[]
}

export interface SmeActionItem {
  id: string
  priority: 1 | 2 | 3
  title: string
  detail: string
  ownerHint: string
  urgency: SmeUrgency
}

export interface SmeBriefing {
  id: string
  lensId: string
  lensName: string
  useCaseId: string
  generatedAt: string
  /** Overall posture from this SME */
  posture: EvidenceScore
  urgency: SmeUrgency
  executiveSummary: string
  /** Headline assessment one-liner */
  headline: string
  claimReads: SmeClaimRead[]
  actions: SmeActionItem[]
  openQuestions: string[]
  sourcesToSeek: string[]
  publishGates: string[]
  /** Working-document ready markdown */
  workingDocMarkdown: string
  /** Counts for UI badges */
  stats: {
    claims: number
    supported: number
    contested: number
    disqualified: number
    highRelevance: number
  }
  moduleId: ModuleId
}

export const SME_DOMAIN_META: Record<
  SmeDomain,
  { label: string; color: string; description: string }
> = {
  'core-governance': {
    label: 'Core Governance',
    color: 'cyan',
    description: 'Layer-0, evidence gates, narrative integrity, working document',
  },
  'public-records': {
    label: 'Public Records',
    color: 'emerald',
    description: 'FOIA, minutes, permits, forensic document trails',
  },
  jurisdiction: {
    label: 'Jurisdiction',
    color: 'violet',
    description: 'Multi-level regulatory routing and authority maps',
  },
  oversight: {
    label: 'Oversight',
    color: 'amber',
    description: 'Accountability, influence, ethics, procurement',
  },
  'sector-regulatory': {
    label: 'Sector Regulatory',
    color: 'sky',
    description: 'Domain rules: environment, health, land use, funding',
  },
  'method-process': {
    label: 'Method & Process',
    color: 'slate',
    description: 'Verification playbooks, chain of custody, publish clearance',
  },
  'mechanical-engineering': {
    label: 'Mechanical Engineering',
    color: 'orange',
    description: 'Statics, dynamics, thermofluids, machines, vibration, mechatronics',
  },
  'civil-structural': {
    label: 'Civil / Structural',
    color: 'stone',
    description: 'Structures, geotech, transport infrastructure, water resources',
  },
  'electrical-electronics': {
    label: 'Electrical / Electronics',
    color: 'yellow',
    description: 'Power systems, embedded, RF, controls, semiconductors',
  },
  'chemical-process': {
    label: 'Chemical / Process',
    color: 'lime',
    description: 'Process design, reaction engineering, process safety / LOPA',
  },
  'aerospace-defense-tech': {
    label: 'Aerospace / Defense Tech',
    color: 'indigo',
    description: 'Flight mechanics, propulsion, avionics & certification tech',
  },
  'materials-manufacturing': {
    label: 'Materials / Manufacturing',
    color: 'rose',
    description: 'Metallurgy, composites, process, quality & reliability',
  },
  'energy-nuclear': {
    label: 'Energy / Nuclear',
    color: 'red',
    description: 'Grid systems, petroleum subsurface tech, nuclear systems',
  },
  'biomedical-systems': {
    label: 'Biomedical Systems',
    color: 'pink',
    description: 'Devices, biomechanics, physiological systems modeling',
  },
  'computing-cyberphysical': {
    label: 'Computing / Cyber-Physical',
    color: 'blue',
    description: 'Architecture, software rigor, CPS, signals, optics',
  },
  'mathematics-statistics': {
    label: 'Mathematics / Statistics',
    color: 'fuchsia',
    description: 'Applied/pure math, probability, inference, OR, info theory',
  },
  'theoretical-physics': {
    label: 'Theoretical Physics',
    color: 'purple',
    description: 'Classical, EM, quantum, stat mech, relativity',
  },
  'applied-physical-sciences': {
    label: 'Applied Physical Sciences',
    color: 'teal',
    description: 'Condensed matter, fluid dynamics / plasma',
  },
}
