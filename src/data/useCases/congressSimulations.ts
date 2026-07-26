/**
 * Minimal investigation simulations for congressional desks.
 */

import type {
  ActiveConditions,
  EvidenceItem,
  EvidenceScore,
  GraphEdge,
  GraphNode,
  MaterialClass,
  ResearchNote,
  SpatialPoint,
  WorkingDocEntry,
} from '../../types/core'
import { emptyLadder, uid } from '../../types/core'
import type { ActiveSource, InvestigationMapPin } from '../../types/useCase'
import { CONGRESS_DESK_PROFILES } from './congressDesks'
import { CONGRESS_SOURCES_BY_DESK } from './congressSources'
import { SHARED_VERIFY_TOOLS } from './activeSources'

/** Local shape matching InvestigationSimulation — avoids circular import with simulations.ts */
export type CongressSimDraft = {
  useCaseId: string
  mapPin: InvestigationMapPin
  scenePoints: SpatialPoint[]
  graphNodes: GraphNode[]
  graphEdges: GraphEdge[]
  conditions: ActiveConditions
  evidence: EvidenceItem[]
  researchNotes: ResearchNote[]
  ladder: ReturnType<typeof emptyLadder>
  wdEntries: Array<Omit<WorkingDocEntry, 'id' | 'at'> & { at?: string }>
  analystLog: string[]
  designNotes: string
  forgeAssetType: string
  forgeName: string
  forgeDescription: string
  sessionMode: 'explore' | 'analyze' | 'generate' | 'export' | 'review'
  sources: ActiveSource[]
}

const NOW = () => new Date().toISOString()

function ev(
  title: string,
  summary: string,
  score: EvidenceScore,
  tags: string[],
  material: MaterialClass = score === 1 ? 'primary' : score === -1 ? 'assumption' : 'secondary',
): EvidenceItem {
  return {
    id: uid('ev'),
    title,
    summary,
    score,
    confidence: score === 1 ? 'high' : score === -1 ? 'medium' : 'low',
    material,
    tags: ['congressional', 'simulation', ...tags],
    sourceRefs: ['sim-cong'],
    createdAt: NOW(),
    moduleId: 'research-hub',
  }
}

function cond(notes: string): ActiveConditions {
  return {
    matrixId: 'matrix-alpha',
    selections: {
      jurisdiction: 'j-01',
      'device-type': 'dev-a',
      'site-class': 'site-open',
      'power-path': 'pwr-grid',
      clearance: 'clr-std',
    },
    notes,
    updatedAt: NOW(),
  }
}

export function buildCongressSimulations(): CongressSimDraft[] {
  return CONGRESS_DESK_PROFILES.map((p) => {
    const pin = p.mapPin!
    const report = p.report!
    const deskSources = CONGRESS_SOURCES_BY_DESK[p.id] ?? []
    const sources: ActiveSource[] = []
    const seen = new Set<string>()
    for (const src of [...deskSources, ...SHARED_VERIFY_TOOLS]) {
      if (seen.has(src.id)) continue
      seen.add(src.id)
      sources.push(src)
    }
    const evidence = report.claims.map((c) =>
      ev(c.statement.slice(0, 120), c.notes, c.score, c.tags, c.material),
    )
    const scenePoints: SpatialPoint[] = [
      {
        id: `${p.id}-capitol`,
        label: pin.label,
        lat: pin.lat,
        lng: pin.lng,
        kind: 'oversight',
        score: 0,
        tags: ['congressional'],
      },
    ]
    const graphNodes: GraphNode[] = [
      { id: 'n-congress', label: 'Congress / bill text', kind: 'control', score: 1 },
      { id: 'n-agency', label: 'Agency docket', kind: 'control', score: 1 },
      { id: 'n-industry', label: 'Industry effect', kind: 'stage', score: 0 },
      { id: 'n-noise', label: 'Narrative noise', kind: 'risk', score: -1 },
      { id: 'n-export', label: 'Export gate', kind: 'control', score: 0 },
    ]
    const graphEdges: GraphEdge[] = [
      { id: 'e1', source: 'n-congress', target: 'n-industry', label: 'compliance cost' },
      { id: 'e2', source: 'n-agency', target: 'n-industry', label: 'rule effect' },
      { id: 'e3', source: 'n-noise', target: 'n-export', label: 'block', score: -1 },
      { id: 'e4', source: 'n-industry', target: 'n-export', label: 'clear if scored', score: 1 },
    ]
    const researchNotes: ResearchNote[] = [
      {
        id: uid('rn'),
        title: `Desk brief · ${p.label}`,
        body: report.executiveSummary,
        score: 0,
        material: 'secondary',
        tags: ['congressional', p.id],
        createdAt: NOW(),
        updatedAt: NOW(),
      },
    ]
    const wdEntries: Array<Omit<WorkingDocEntry, 'id' | 'at'> & { at?: string }> = [
      {
        kind: 'decision',
        title: 'Congressional training desk loaded',
        body: `${p.id} · industry-effect focus · not legal advice`,
        score: 1,
        moduleId: 'research-hub',
      },
    ]
    const baseLadder = emptyLadder(1)
    baseLadder.current = 1
    baseLadder.populated[0] = true
    baseLadder.populated[1] = true
    return {
      useCaseId: p.id,
      mapPin: pin,
      scenePoints,
      graphNodes,
      graphEdges,
      conditions: cond(`Congressional desk ${p.id}: score industry effects with official sources.`),
      evidence,
      researchNotes,
      ladder: baseLadder,
      wdEntries,
      analystLog: [
        `Congressional desk ${pin.shortLabel} loaded.`,
        '› Prefer congress.gov / agency / GAO primary',
        '› sme list · sme tech · sme select <id> · sme run',
        'Training desk — not legal advice; no PII.',
      ],
      designNotes: 'Compliance burden / liability / market access axes for industry-effect modeling.',
      forgeAssetType: 'cabinet-node-b',
      forgeName: 'Oversight Filing Node',
      forgeDescription: 'Lightweight cabinet stand-in for docket / filing metaphor.',
      sessionMode: 'analyze' as const,
      sources,
    }
  })
}
