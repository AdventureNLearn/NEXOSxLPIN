/**
 * Use-case profiles + pane layout contracts.
 * Profiles are data — never real-world brands or places.
 */

import type { EvidenceScore, MaterialClass, ModuleId } from './core'

export type PaneId = ModuleId

export interface PaneWeight {
  pane: PaneId
  /** 1–5; drives flex grow / slot size */
  weight: number
  /** minimum px hint */
  minPx?: number
  /** if true, never auto-evicted from layout */
  pinned?: boolean
}

export type LayoutPresetId =
  | 'research-first'
  | 'spatial-primary'
  | 'design-primary'
  | 'triage-compact'
  | 'export-review'


export interface ReportClaim {
  id: string
  statement: string
  score: EvidenceScore
  material: MaterialClass
  confidence: 'high' | 'medium' | 'low' | 'unknown'
  notes: string
  tags: string[]
}

export interface UseCaseReport {
  /** ISO date the briefing was assembled */
  asOf: string
  /** Why this is hot on X / public feeds */
  trendSignal: string
  headline: string
  executiveSummary: string
  /** Scored ledger for Research Hub injection */
  claims: ReportClaim[]
  timeline: Array<{ when: string; what: string }>
  openQuestions: string[]
  verificationPlaybook: string[]
  sourcesToSeek: string[]
  noiseRisks: string[]
  geographicNotes?: string
  /** Short markdown body for Export / WD */
  fullBriefMarkdown: string
}

export interface UseCaseProfile {
  id: string
  label: string
  tagline: string
  /** citizen-journalism | infrastructure | regulatory | network | technical | civic | general | trending */
  family: string
  description: string
  /** short workflow steps shown in UI */
  workflow: string[]
  layoutPreset: LayoutPresetId
  primaryPanes: PaneId[]
  secondaryPanes: PaneId[]
  /** subset tiled on activate (≤5) */
  defaultOpen: PaneId[]
  paneWeights: PaneWeight[]
  /** optional pack id to load */
  dataPackId?: string
  sampleClaimHints?: string[]
  /** modules collapsed into "More" until needed */
  onDemand: PaneId[]
  /** Full citizen-journalist briefing when present */
  report?: UseCaseReport
  /** Rank among current trend desk (1–10) */
  trendRank?: number
  /** Primary map pin for this investigation (WGS84) */
  mapPin?: InvestigationMapPin
}

/** World map pin for an investigation desk */
export interface InvestigationMapPin {
  useCaseId: string
  label: string
  shortLabel: string
  lat: number
  lng: number
  kind: string
  /** headline score for pin color when active */
  score?: EvidenceScore
  cityHint?: string
}

/**
 * Active source the operator can open in one click.
 * Prefer stable official / wire / tool URLs over ephemeral social posts.
 */
export type ActiveSourceKind =
  | 'official'
  | 'wire'
  | 'local'
  | 'tool'
  | 'map'
  | 'data'
  | 'archive'
  | 'secondary'

export interface ActiveSource {
  id: string
  title: string
  /** One-line why this source matters for the desk */
  why: string
  url: string
  kind: ActiveSourceKind
  /** Optional publisher / agency label */
  publisher?: string
  /** If true, treat as public-record / primary-adjacent */
  publicRecord?: boolean
  /** Tags for filter chips */
  tags?: string[]
}

/** How the main stage arranges open panes */
export type WorkspaceViewMode = 'tiles' | 'tabs' | 'immersive'

export interface WorkspaceState {
  openPanes: PaneId[]
  focusedPane: PaneId | null
  maximizedPane: PaneId | null
  /**
   * Snapshot of open panes before solo/maximize so Restore can rebuild the multi-tile layout
   * without dumping every module into tabs.
   */
  restoreOpenPanes?: PaneId[] | null
  layoutLocked: boolean
  /** primary column fraction 0.25–0.7 when multi-column */
  primaryFraction: number
  /** secondary stack top fraction when stacked */
  secondaryFraction: number
  singleModuleMode: boolean
  /** first-run empty state dismissed */
  useCasePicked: boolean
  /** tiles = split grid · tabs = full-height tab stage · immersive = HUD/Jarvis shell */
  viewMode: WorkspaceViewMode
}

/** All product modules can be open; tabs scale better than old 5-pane cap */
export const MAX_OPEN_PANES = 10

export const ALL_MODULE_PANES: PaneId[] = [
  'information',
  'atlas',
  'design-lab',
  'research-hub',
  'analyst',
  'sme-lenses',
  'audit-ladder',
  'procedural-forge',
  'massing-viewer',
  'export-kit',
]

export const DEFAULT_WORKSPACE: WorkspaceState = {
  openPanes: ['atlas', 'research-hub', 'export-kit', 'analyst', 'design-lab'],
  focusedPane: 'atlas',
  maximizedPane: null,
  restoreOpenPanes: null,
  layoutLocked: false,
  primaryFraction: 0.48,
  secondaryFraction: 0.55,
  singleModuleMode: false,
  useCasePicked: false,
  /** Immersive is the only workspace mode (1.6.2+). */
  viewMode: 'immersive',
}
