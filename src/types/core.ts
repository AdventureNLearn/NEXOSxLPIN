/**
 * Nexus core contracts — domain-agnostic.
 * No location, political, or religious identifiers.
 */

/** Tri-state evidence language (mandatory). */
export type EvidenceScore = 1 | 0 | -1

export type EvidenceLabel = '+1' | '0' | '-1'

export type ClaimConfidence = 'high' | 'medium' | 'low' | 'unknown'

/** Primary material = direct record; secondary = derived/contextual. */
export type MaterialClass = 'primary' | 'secondary' | 'derived' | 'assumption'

export type DetailLevel = 0 | 1 | 2 | 3 | 4

export type SessionMode = 'explore' | 'analyze' | 'generate' | 'export' | 'review'

export type ModuleId =
  | 'information'
  | 'atlas'
  | 'design-lab'
  | 'research-hub'
  | 'analyst'
  | 'sme-lenses'
  | 'audit-ladder'
  | 'procedural-forge'
  | 'massing-viewer'
  | 'export-kit'

export interface Layer0State {
  active: boolean
  reason: string
  lastCheckedAt: string | null
  blockedActions: string[]
}

export interface EvidenceItem {
  id: string
  title: string
  summary: string
  score: EvidenceScore
  confidence: ClaimConfidence
  material: MaterialClass
  tags: string[]
  sourceRefs: string[]
  createdAt: string
  moduleId?: ModuleId
}

export interface SourceRef {
  id: string
  title: string
  citation: string
  url?: string
  retrievedAt?: string
  publicRecord: boolean
}

export interface WorkingDocEntry {
  id: string
  at: string
  kind:
    | 'decision'
    | 'generation'
    | 'export'
    | 'layer0'
    | 'evidence'
    | 'condition'
    | 'note'
    | 'rewrite'
  title: string
  body: string
  score?: EvidenceScore
  moduleId?: ModuleId
  meta?: Record<string, string | number | boolean | null>
}

export interface WorkingDocument {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  entries: WorkingDocEntry[]
}

export interface ConditionOption {
  id: string
  label: string
  description?: string
}

export interface ConditionAxis {
  id: string
  label: string
  options: ConditionOption[]
}

export interface ConditionMatrix {
  id: string
  name: string
  description: string
  axes: ConditionAxis[]
}

export interface ActiveConditions {
  matrixId: string
  selections: Record<string, string>
  notes: string
  updatedAt: string
}

export interface GraphNode {
  id: string
  label: string
  kind: string
  x?: number
  y?: number
  score?: EvidenceScore
  meta?: Record<string, string>
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  label?: string
  score?: EvidenceScore
}

export interface SpatialPoint {
  id: string
  label: string
  lat: number
  lng: number
  kind: string
  score?: EvidenceScore
  tags?: string[]
}

export interface ResearchNote {
  id: string
  title: string
  body: string
  score: EvidenceScore
  material: MaterialClass
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface AuditLadderState {
  current: DetailLevel
  unlocked: DetailLevel
  populated: Record<DetailLevel, boolean>
  scores: Record<DetailLevel, EvidenceScore | null>
  notes: Record<DetailLevel, string>
}

export interface MeshPartSpec {
  id: string
  name: string
  primitive: 'box' | 'cylinder' | 'sphere' | 'plane' | 'group'
  /** meters */
  size: [number, number, number]
  position: [number, number, number]
  rotation: [number, number, number]
  color: string
  hinge?: {
    axis: 'x' | 'y' | 'z'
    minDeg: number
    maxDeg: number
    restDeg: number
  }
  children?: MeshPartSpec[]
}

export interface ProceduralAsset {
  id: string
  name: string
  assetType: string
  description: string
  version: number
  createdAt: string
  updatedAt: string
  conditionsSnapshot: ActiveConditions | null
  parts: MeshPartSpec[]
  animation: {
    deployProgress: number
    drivers: Array<{ partId: string; param: string; from: number; to: number }>
  }
  beforeParts?: MeshPartSpec[]
  optimizeNotes: string[]
  unityCSharp: string
  threeTsx: string
  score: EvidenceScore
  /** Evidentiary modeling metadata (1.6+) */
  verifiability?:
    | 'verified_supported'
    | 'plausible_unverified'
    | 'disputed_unverifiable'
    | 'narrative_only'
    | 'method_gate'
  reasoning?: string[]
  flags?: string[]
  relatedClaimHint?: string
  sourceIds?: string[]
  importance?: 'critical' | 'supporting' | 'background'
}

export interface DataPackMeta {
  id: string
  name: string
  version: string
  description: string
  domainHint: string
}

export interface DataPack {
  meta: DataPackMeta
  conditionMatrices: ConditionMatrix[]
  spatialPoints: SpatialPoint[]
  graphNodes: GraphNode[]
  graphEdges: GraphEdge[]
  assetTypes: Array<{ id: string; label: string; description: string }>
  sampleEvidence: EvidenceItem[]
  sampleSources: SourceRef[]
}

export const DETAIL_LADDER_LABELS: Record<DetailLevel, string> = {
  0: 'L0 Identity',
  1: 'L1 Structure',
  2: 'L2 Systems',
  3: 'L3 Components',
  4: 'L4 Package',
}

export const MODULE_META: Record<
  ModuleId,
  { label: string; short: string; description: string }
> = {
  information: {
    label: 'Story & guide',
    short: 'Story',
    description: 'Read the story in plain language and learn how the desk works',
  },
  atlas: {
    label: 'Map',
    short: 'Map',
    description: 'See where the story sits and flip map layers on or off',
  },
  'design-lab': {
    label: 'Rules',
    short: 'Rules',
    description: 'Set the conditions that must be true before you trust a setup',
  },
  'research-hub': {
    label: 'Claims',
    short: 'Claims',
    description: 'Break the story into claims and mark Supported, Not proven, or Disputed',
  },
  analyst: {
    label: 'Commands',
    short: 'Cmd',
    description: 'Power-user commands; optional — most people never need this',
  },
  'sme-lenses': {
    label: 'Expert check',
    short: 'Experts',
    description: 'Borrow specialist checklists (training only — not legal advice)',
  },
  'audit-ladder': {
    label: 'How deep?',
    short: 'Depth',
    description: 'Climb only as deep as your evidence supports',
  },
  'procedural-forge': {
    label: 'Build sketch',
    short: 'Sketch',
    description: 'Turn scored claims into simple stand-in shapes',
  },
  'massing-viewer': {
    label: '3D view',
    short: '3D',
    description: 'Look at sketch models on a real map — illustrative only, never forensic',
  },
  'export-kit': {
    label: 'Share pack',
    short: 'Share',
    description: 'Download a pack only when you choose — blocked while Disputed lines remain',
  },
}

export const MODEL_DISCLAIMER =
  'Illustrative sketch only — not a certified survey, forensic reconstruction, or proof of fact.'

export function scoreToLabel(score: EvidenceScore): EvidenceLabel {
  if (score === 1) return '+1'
  if (score === -1) return '-1'
  return '0'
}

export function labelToScore(label: string): EvidenceScore {
  if (label === '+1' || label === '1') return 1
  if (label === '-1') return -1
  return 0
}

export function emptyLadder(current: DetailLevel = 0): AuditLadderState {
  return {
    current,
    unlocked: current,
    populated: { 0: false, 1: false, 2: false, 3: false, 4: false },
    scores: { 0: null, 1: null, 2: null, 3: null, 4: null },
    notes: { 0: '', 1: '', 2: '', 3: '', 4: '' },
  }
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}
