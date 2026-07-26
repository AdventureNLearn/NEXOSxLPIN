/**
 * Full mock sessions per investigation — populates every module for usability review.
 * Map pins use real approximate WGS84 coordinates for the scene/desk.
 */

import type {
  ActiveConditions,
  AuditLadderState,
  DetailLevel,
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
import { generateAsset } from '../../lib/forge/generators'
import type { ProceduralAsset } from '../../types/core'
import { getActiveSourcesForDesk } from './activeSources'
import { buildCongressSimulations } from './congressSimulations'
import { CORPUS_SIMS } from './storyCorpus100'

export interface InvestigationSimulation {
  useCaseId: string
  mapPin: InvestigationMapPin
  /** Extra local scene pins (shown when this investigation is active) */
  scenePoints: SpatialPoint[]
  graphNodes: GraphNode[]
  graphEdges: GraphEdge[]
  conditions: ActiveConditions
  evidence: EvidenceItem[]
  researchNotes: ResearchNote[]
  ladder: AuditLadderState
  /** Seed working-document entries (after session open) */
  wdEntries: Array<Omit<WorkingDocEntry, 'id' | 'at'> & { at?: string }>
  analystLog: string[]
  designNotes: string
  /** Asset type id for forge seed */
  forgeAssetType: string
  forgeName: string
  forgeDescription: string
  sessionMode: 'explore' | 'analyze' | 'generate' | 'export' | 'review'
  /** One-click sources for this desk (plus shared verify tools) */
  sources: ActiveSource[]
}

const NOW = () => new Date().toISOString()

function ev(
  title: string,
  summary: string,
  score: EvidenceScore,
  tags: string[],
  material: MaterialClass = score === 1 ? 'primary' : score === -1 ? 'assumption' : 'secondary',
  sourceRefs: string[] = [],
): EvidenceItem {
  return {
    id: uid('ev'),
    title,
    summary,
    score,
    confidence: score === 1 ? 'high' : score === -1 ? 'medium' : 'low',
    material,
    tags: ['trend-desk', 'simulation', ...tags],
    sourceRefs: sourceRefs.length ? sourceRefs : ['sim-desk'],
    createdAt: NOW(),
    moduleId: 'research-hub',
  }
}

function note(title: string, body: string, score: EvidenceScore, tags: string[] = []): ResearchNote {
  const t = NOW()
  return {
    id: uid('rn'),
    title,
    body,
    score,
    material: score === 1 ? 'primary' : score === -1 ? 'assumption' : 'derived',
    tags: ['investigation', 'simulation', ...tags],
    createdAt: t,
    updatedAt: t,
  }
}

function ladder(
  current: DetailLevel,
  populated: Partial<Record<DetailLevel, { score: EvidenceScore; note: string }>>,
): AuditLadderState {
  const base = emptyLadder(current)
  let unlocked = current
  for (const [k, v] of Object.entries(populated)) {
    const lvl = Number(k) as DetailLevel
    base.populated[lvl] = true
    base.scores[lvl] = v!.score
    base.notes[lvl] = v!.note
    unlocked = Math.max(unlocked, lvl) as DetailLevel
  }
  base.unlocked = unlocked
  base.current = current
  return base
}

function cond(selections: Record<string, string>, notes: string): ActiveConditions {
  return {
    matrixId: 'matrix-alpha',
    selections: {
      jurisdiction: 'j-01',
      'device-type': 'dev-a',
      'site-class': 'site-open',
      'power-path': 'pwr-grid',
      clearance: 'clr-std',
      ...selections,
    },
    notes,
    updatedAt: NOW(),
  }
}

function pin(
  useCaseId: string,
  label: string,
  shortLabel: string,
  lat: number,
  lng: number,
  kind: string,
  score: EvidenceScore,
  cityHint: string,
): InvestigationMapPin {
  return { useCaseId, label, shortLabel, lat, lng, kind, score, cityHint }
}

/** —— 10 full simulations (sources attached after draft) —— */

type SimDraft = Omit<InvestigationSimulation, 'sources'>

const DRAFTS: SimDraft[] = [
  {
    useCaseId: 'trend-01-berlin-csd',
    mapPin: pin(
      'trend-01-berlin-csd',
      '① Berlin CSD · Tiergarten',
      'Berlin',
      52.5145,
      13.3501,
      'incident-scene',
      1,
      'Berlin, DE',
    ),
    scenePoints: [
      {
        id: 'b-scene',
        label: 'Strike path (Ahornsteig area)',
        lat: 52.5145,
        lng: 13.3501,
        kind: 'scene',
        score: 1,
        tags: ['primary-scene'],
      },
      {
        id: 'b-exit',
        label: 'Attendee egress · Hauptbahnhof',
        lat: 52.525,
        lng: 13.369,
        kind: 'egress',
        score: 0,
        tags: ['crowd'],
      },
      {
        id: 'b-police',
        label: 'Police cordon node',
        lat: 52.516,
        lng: 13.355,
        kind: 'control',
        score: 1,
        tags: ['response'],
      },
    ],
    graphNodes: [
      { id: 'n-capture', label: 'Phone capture', kind: 'stage', score: 1 },
      { id: 'n-geo', label: 'Geolocate', kind: 'stage', score: 1 },
      { id: 'n-police', label: 'Police primary', kind: 'control', score: 1 },
      { id: 'n-viral', label: 'Viral inflate', kind: 'risk', score: -1 },
      { id: 'n-export', label: 'Export gate', kind: 'control', score: 0 },
    ],
    graphEdges: [
      { id: 'e1', source: 'n-capture', target: 'n-geo', label: 'verify' },
      { id: 'e2', source: 'n-geo', target: 'n-police', label: 'corroborate' },
      { id: 'e3', source: 'n-viral', target: 'n-export', label: 'block', score: -1 },
      { id: 'e4', source: 'n-police', target: 'n-export', label: 'clear', score: 1 },
    ],
    conditions: cond(
      { jurisdiction: 'j-02', 'site-class': 'site-cluster', clearance: 'clr-ext' },
      'Crowd density high; path not vehicle-rated. Document egress constraints for scene model.',
    ),
    evidence: [
      ev('Vehicle struck pedestrians in Tiergarten during CSD evening', 'Multi-outlet + police major-incident posture.', 1, ['berlin', 'scene']),
      ev('Casualty band ~1 dead / 14–15 injured (provisional)', 'Converging early reports; final counts may revise.', 1, ['casualties']),
      ev('Driver fled on foot; manhunt; no public description yet', 'Police tactical withhold.', 1, ['police']),
      ev('Motive established as ideological attack', 'Not in early official statements — hold.', 0, ['motive']),
      ev('Viral “dozens dead / second attack site”', 'Conflicts with multi-outlet band and single-scene posture.', -1, ['viral']),
      ev('Witness audio timestamp consistent with ~22:00 local', 'Cross-check with livestream ends.', 0, ['timeline']),
    ],
    researchNotes: [
      note(
        'Scene package — Tiergarten path',
        'Freeze first 10 viral videos. Map claims to park paths only. Separate mayor speech from police facts.\n\nOpen: CCTV chain, vehicle type primary, hospital final tally.',
        1,
        ['scene'],
      ),
      note(
        'Noise ledger',
        'Rejected: repurposed parade clips from prior years; casualty inflation threads; deepfake audio of officials.',
        -1,
        ['noise'],
      ),
      note(
        'Export readiness',
        'One open −1 (viral inflation) blocks kit until rescored or removed. ACK required.',
        0,
        ['export'],
      ),
    ],
    ladder: ladder(2, {
      0: { score: 1, note: 'Incident identity: vehicle-into-crowd near CSD route, 25 Jul 2026 evening.' },
      1: { score: 1, note: 'Spatial envelope: Tiergarten path + egress corridors.' },
      2: { score: 0, note: 'Systems: police response + organizer cancel — motive path incomplete.' },
    }),
    wdEntries: [
      {
        kind: 'decision',
        title: 'Desk opened · Berlin CSD',
        body: 'Spatial-primary layout. Map pins world + scene. −1 viral inflation armed.',
        score: 1,
        moduleId: 'atlas',
      },
      {
        kind: 'condition',
        title: 'Conditions applied · crowd path',
        body: 'Jurisdiction 02 · Cluster node · Extended clearance',
        score: 1,
        moduleId: 'design-lab',
      },
      {
        kind: 'evidence',
        title: 'Filed −1 viral inflation',
        body: 'Blocks export until resolved.',
        score: -1,
        moduleId: 'research-hub',
      },
      {
        kind: 'generation',
        title: 'Scene massing draft',
        body: 'Mast Enclosure A used as stand-in corridor marker for egress model (not a survey).',
        score: 0,
        moduleId: 'procedural-forge',
      },
    ],
    analystLog: [
      'Analyst online · Investigation #1 Berlin CSD loaded.',
      'status → research-hub · open −1=1 · pack=sim-berlin',
      '› score -1 Viral second site :: Conflicts with single-scene police posture',
      'Evidence filed at −1',
      '› ladder 2',
      'Ladder set request → L2',
      'Type help · map pin click switches investigation.',
    ],
    designNotes: 'Model path width vs vehicle envelope. Extended clearance = standoff for media positions.',
    forgeAssetType: 'mast-enclosure-a',
    forgeName: 'Egress Marker Alpha',
    forgeDescription: 'Temporary corridor marker for crowd egress analysis — generic massing only.',
    sessionMode: 'analyze',
  },

  {
    useCaseId: 'trend-02-iberian-fires',
    mapPin: pin(
      'trend-02-iberian-fires',
      '② Iberian wildfires · Gironde',
      'Gironde',
      44.65,
      -1.15,
      'disaster',
      1,
      'SW France / Spain',
    ),
    scenePoints: [
      { id: 'f-cap', label: 'Cap Ferret evacuation zone', lat: 44.64, lng: -1.25, kind: 'evac', score: 1, tags: ['france'] },
      { id: 'f-bx', label: 'Bordeaux suburb watch', lat: 44.84, lng: -0.58, kind: 'watch', score: 0, tags: ['suburb'] },
      { id: 'f-mad', label: 'Madrid-region fire complex', lat: 40.4, lng: -4.0, kind: 'fire', score: 1, tags: ['spain'] },
    ],
    graphNodes: [
      { id: 'n-sat', label: 'Satellite/thermal', kind: 'stage', score: 1 },
      { id: 'n-pref', label: 'Prefecture orders', kind: 'control', score: 1 },
      { id: 'n-clip', label: 'Citizen clip', kind: 'stage', score: 0 },
      { id: 'n-exag', label: 'City destroyed claim', kind: 'risk', score: -1 },
    ],
    graphEdges: [
      { id: 'e1', source: 'n-clip', target: 'n-sat', label: 'geolocate' },
      { id: 'e2', source: 'n-pref', target: 'n-sat', label: 'orders' },
      { id: 'e3', source: 'n-exag', target: 'n-clip', label: 'reject', score: -1 },
    ],
    conditions: cond(
      { jurisdiction: 'j-03', 'site-class': 'site-open', clearance: 'clr-ext', 'power-path': 'pwr-solar' },
      'Restricted deployment class for temporary sensors near fire perimeter. Wind corridor open.',
    ),
    evidence: [
      ev('Mass multi-jurisdiction wildfire emergency Spain + SW France', 'AP/BBC/DW multi-source scale agreement.', 1, ['wildfire']),
      ev('France: 100k+ evacuated Gironde/Landes incl. Cap Ferret', 'Use range language; prefecture primary pending exact integer.', 1, ['france']),
      ev('Spain: Madrid-region/Guadalajara fires + ≥1 civilian death reported', 'Multi-sourced evacuations; death near Valencia area in coverage.', 1, ['spain']),
      ev('“Bordeaux city center fully destroyed”', 'Conflicts with mainstream — suburbs threatened, not center destroyed.', -1, ['exaggeration']),
      ev('Europe-wide hectares burned this week is a single settled number', 'EU aggregates lag — hold 0.', 0, ['stats']),
      ev('Boat evacuations from Cap Ferret documented in citizen video', 'Geolocate coastline shape before amplify.', 0, ['evac']),
    ],
    researchNotes: [
      note('Fire desk map plan', 'Pins: Cap Ferret, Bordeaux watch, Madrid complex. Prefer prefecture posts over influencer tallies.', 1, ['map']),
      note('Recycled 2022 footage check', 'Queue reverse-search on top 5 viral stills.', 0, ['verify']),
      note('Blocked claim', 'City-destroyed narrative scored −1 — export gated.', -1, ['export']),
    ],
    ladder: ladder(1, {
      0: { score: 1, note: 'Event class: extreme wildfire + mass evacuation Iberian theater.' },
      1: { score: 1, note: 'Spatial: dual-country complexes, not one burn scar.' },
    }),
    wdEntries: [
      { kind: 'decision', title: 'Desk · Iberian fires', body: 'Spatial primary. Three theater pins loaded.', score: 1, moduleId: 'atlas' },
      { kind: 'condition', title: 'Perimeter sensor conditions', body: 'J-03 restricted · open corridor · extended clearance', score: 1, moduleId: 'design-lab' },
      { kind: 'evidence', title: '−1 Bordeaux destroyed', body: 'Hard block until removed/rescored.', score: -1, moduleId: 'research-hub' },
    ],
    analystLog: [
      'Investigation #2 Iberian wildfires loaded.',
      '› status',
      'module=atlas · open −1=1 · scene pins=3',
      '› score 0 Cap Ferret boat clips :: Geolocate before +1',
      'Evidence filed at 0',
    ],
    designNotes: 'Sensor mast setbacks under extended clearance near firebreak roads.',
    forgeAssetType: 'mast-enclosure-a',
    forgeName: 'Perimeter Observe Mast',
    forgeDescription: 'Generic observation mast for firebreak corridor — not certified.',
    sessionMode: 'analyze',
  },

  {
    useCaseId: 'trend-03-hormuz-conflict',
    mapPin: pin(
      'trend-03-hormuz-conflict',
      '③ Hormuz corridor',
      'Hormuz',
      26.5667,
      56.25,
      'maritime',
      0,
      'Strait of Hormuz',
    ),
    scenePoints: [
      { id: 'h-strait', label: 'Strait chokepoint', lat: 26.57, lng: 56.25, kind: 'chokepoint', score: 1, tags: ['maritime'] },
      { id: 'h-gulf', label: 'Gulf shipping lane sample', lat: 26.2, lng: 55.3, kind: 'lane', score: 0, tags: ['shipping'] },
    ],
    graphNodes: [
      { id: 'n-clip', label: 'Viral strike clip', kind: 'stage', score: 0 },
      { id: 'n-rev', label: 'Reverse search', kind: 'control', score: 1 },
      { id: 'n-old', label: 'Recycled archive', kind: 'risk', score: -1 },
      { id: 'n-wire', label: 'Wire primary', kind: 'stage', score: 1 },
    ],
    graphEdges: [
      { id: 'e1', source: 'n-clip', target: 'n-rev', label: 'check' },
      { id: 'e2', source: 'n-rev', target: 'n-old', label: 'match-old', score: -1 },
      { id: 'e3', source: 'n-wire', target: 'n-rev', label: 'corroborate', score: 1 },
    ],
    conditions: cond(
      { jurisdiction: 'j-03', 'device-type': 'dev-c', clearance: 'clr-ext' },
      'Elevated review · extended arm form for maritime observation mock only.',
    ),
    evidence: [
      ev('US–Iran linked conflict actions covered into Jul 2026', 'Sustained multi-outlet reporting; ops fluid.', 1, ['conflict']),
      ev('Elevated shipping risk narratives Hormuz/Red Sea', 'Verify each incident separately.', 1, ['shipping']),
      ev('Single viral “city destroyed tonight” clip verified live', 'Default 0 until geolocation complete.', 0, ['viral']),
      ev('Recycled prior-conflict footage as live July 2026', 'Classic failure mode when landmarks mismatch.', -1, ['recycled']),
      ev('Insurance NOTAM text captured for corridor advisory', 'Primary text pending paste into sources.', 0, ['notam']),
    ],
    researchNotes: [
      note('Warfog SOP', 'Never amplify unlocated explosion audio. Pair every strike claim with two independents or official+local.', 1, ['sop']),
      note('Clip reject log', 'Item −1: recycled footage labeled live — blocks export.', -1, ['reject']),
    ],
    ladder: ladder(1, {
      0: { score: 1, note: 'Desk identity: maritime/conflict verification, not single battle.' },
      1: { score: 0, note: 'Spatial: multi-theater — do not collapse to one pin.' },
    }),
    wdEntries: [
      { kind: 'decision', title: 'Desk · Hormuz fog', body: 'Research-first + atlas. Recycled clip −1 active.', score: 1, moduleId: 'research-hub' },
      { kind: 'layer0', title: 'Export would hold', body: 'Unresolved −1 recycled footage.', score: -1, moduleId: 'export-kit' },
    ],
    analystLog: [
      'Investigation #3 Hormuz loaded.',
      '› score -1 Recycled strike clip :: Prior conflict landmarks',
      'Evidence filed at −1',
      '› layer0 export.kit',
      'Export blocked: unresolved −1',
    ],
    designNotes: 'Extended arm mock for coastal observation geometry only.',
    forgeAssetType: 'cabinet-node-b',
    forgeName: 'Shore Node Mock',
    forgeDescription: 'Generic cabinet node for coastal staging — not a real installation.',
    sessionMode: 'review',
  },

  {
    useCaseId: 'trend-04-india-education',
    mapPin: pin(
      'trend-04-india-education',
      '④ India education protests',
      'Delhi',
      28.6139,
      77.209,
      'protest',
      1,
      'New Delhi area',
    ),
    scenePoints: [
      { id: 'i-campus', label: 'Campus assembly sample', lat: 28.545, lng: 77.192, kind: 'assembly', score: 1, tags: ['campus'] },
      { id: 'i-ministry', label: 'Ministry / policy node', lat: 28.61, lng: 77.2, kind: 'institution', score: 0, tags: ['policy'] },
    ],
    graphNodes: [
      { id: 'n-phone', label: 'Phones-in-hand', kind: 'stage', score: 1 },
      { id: 'n-org', label: 'Organize', kind: 'stage', score: 1 },
      { id: 'n-resign', label: 'Political cost', kind: 'stage', score: 1 },
      { id: 'n-smear', label: 'Foreign-op smear', kind: 'risk', score: -1 },
    ],
    graphEdges: [
      { id: 'e1', source: 'n-phone', target: 'n-org', label: 'mobilize' },
      { id: 'e2', source: 'n-org', target: 'n-resign', label: 'pressure' },
      { id: 'e3', source: 'n-smear', target: 'n-org', label: 'attack', score: -1 },
    ],
    conditions: cond(
      { jurisdiction: 'j-02', 'site-class': 'site-cluster', 'device-type': 'dev-b' },
      'Elevated review · compact form · cluster node (campus density).',
    ),
    evidence: [
      ev('Youth education protests generated national political consequences', 'Multi-outlet resignation coverage — confirm gazette.', 1, ['india']),
      ev('Social media/phone video central to documentation', 'Consistent digital-native coverage theme.', 1, ['cj']),
      ev('Every viral “massacre” clip from wave verified', 'Batch-scoring forbidden — per-incident 0 until primary.', 0, ['force']),
      ev('Protest is only foreign-funded with no domestic grievance', 'Blanket smear without documentary trail.', -1, ['disinfo']),
      ev('Policy concession list vs symbolic resignation', 'Need gazette text for +1 on policy change.', 0, ['policy']),
    ],
    researchNotes: [
      note('Accountability thread', 'Archive livestreams with city tags. Score policy only against primary text.', 1, ['method']),
      note('Smear reject', 'Foreign-op claim −1 until documents.', -1, ['reject']),
    ],
    ladder: ladder(2, {
      0: { score: 1, note: 'Movement identity: education accountability / Gen Z digital organize.' },
      1: { score: 1, note: 'Structure: campus + capital nodes.' },
      2: { score: 0, note: 'Systems: ministry response path incomplete without gazette.' },
    }),
    wdEntries: [
      { kind: 'decision', title: 'Desk · India education', body: 'Triage layout. Smear −1 blocks export.', score: 1, moduleId: 'research-hub' },
      { kind: 'evidence', title: 'Primary seek: resignation communique', body: 'URL/gazette not yet attached.', score: 0, moduleId: 'research-hub' },
    ],
    analystLog: [
      'Investigation #4 India education loaded.',
      '› score -1 Foreign-op only claim :: No documentary trail',
      'Evidence filed at −1',
      '› conditions apply',
      'Conditions applied.',
    ],
    designNotes: 'Compact device mock for dense campus corridor study.',
    forgeAssetType: 'cabinet-node-b',
    forgeName: 'Campus Node Compact',
    forgeDescription: 'Generic compact cabinet for density study — not real campus hardware.',
    sessionMode: 'analyze',
  },

  {
    useCaseId: 'trend-05-la-velada',
    mapPin: pin(
      'trend-05-la-velada',
      '⑤ La Velada del Año VI',
      'Seville',
      37.3891,
      -5.9845,
      'event',
      1,
      'Seville area',
    ),
    scenePoints: [
      { id: 'v-venue', label: 'Venue / card locus', lat: 37.39, lng: -5.99, kind: 'venue', score: 1, tags: ['event'] },
      { id: 'v-crowd', label: 'Crowd cam cluster', lat: 37.392, lng: -5.98, kind: 'crowd', score: 0, tags: ['fan'] },
    ],
    graphNodes: [
      { id: 'n-off', label: 'Official result', kind: 'control', score: 1 },
      { id: 'n-fan', label: 'Fan claim', kind: 'stage', score: 0 },
      { id: 'n-inj', label: 'Injury rumor', kind: 'risk', score: 0 },
      { id: 'n-stamp', label: 'Stampede claim', kind: 'risk', score: -1 },
    ],
    graphEdges: [
      { id: 'e1', source: 'n-fan', target: 'n-off', label: 'match?' },
      { id: 'e2', source: 'n-stamp', target: 'n-fan', label: 'reject', score: -1 },
    ],
    conditions: cond(
      { jurisdiction: 'j-01', 'site-class': 'site-cluster', clearance: 'clr-min' },
      'Mass event · cluster · minimum clearance — safety desk mock.',
    ),
    evidence: [
      ev('La Velada VI is major 2026 livestream combat/entertainment event', 'Global trend dominance.', 1, ['event']),
      ev('Fight outcomes per official show channels', '+1 only with official card posts.', 1, ['results']),
      ev('Unverified fighter critically injured backstage', 'Hold 0 until medical/team primary.', 0, ['rumor']),
      ev('Crowd stampede with mass casualties (single anon video)', 'Absent multi-source — −1 vs event coverage.', -1, ['safety']),
      ev('Attendance vs capacity dispute', 'Need official figure.', 0, ['stats']),
    ],
    researchNotes: [
      note('Results hygiene', 'Whitelist official show + commission for results. Geolocate incident clips to venue.', 1, ['sop']),
      note('Safety rumor', 'Stampede claim −1 until multi-source.', -1, ['safety']),
    ],
    ladder: ladder(1, {
      0: { score: 1, note: 'Event identity: mass livestream card.' },
      1: { score: 0, note: 'Safety envelope claims incomplete.' },
    }),
    wdEntries: [
      { kind: 'decision', title: 'Desk · La Velada', body: 'Triage. Stampede −1 active.', score: 1, moduleId: 'research-hub' },
      { kind: 'generation', title: 'Venue massing sketch', body: 'Generic mast for crowd corridor mock.', score: 0, moduleId: 'procedural-forge' },
    ],
    analystLog: [
      'Investigation #5 La Velada loaded.',
      '› forge generate mast-enclosure-a',
      'Generated Egress/venue marker',
      '› score -1 Stampede mass casualty :: Single anon video only',
    ],
    designNotes: 'Minimum clearance for dense venue approaches.',
    forgeAssetType: 'mast-enclosure-a',
    forgeName: 'Venue Corridor Marker',
    forgeDescription: 'Generic marker for venue approach geometry.',
    sessionMode: 'generate',
  },

  {
    useCaseId: 'trend-06-ufc-abu-dhabi',
    mapPin: pin(
      'trend-06-ufc-abu-dhabi',
      '⑥ UFC Abu Dhabi',
      'Abu Dhabi',
      24.4539,
      54.3773,
      'sports',
      1,
      'Abu Dhabi',
    ),
    scenePoints: [
      { id: 'u-arena', label: 'Card / arena locus', lat: 24.45, lng: 54.39, kind: 'venue', score: 1, tags: ['ufc'] },
    ],
    graphNodes: [
      { id: 'n-ufc', label: 'UFC official', kind: 'control', score: 1 },
      { id: 'n-bet', label: 'Betting bot', kind: 'risk', score: -1 },
      { id: 'n-judge', label: 'Judging dispute', kind: 'stage', score: 0 },
    ],
    graphEdges: [
      { id: 'e1', source: 'n-bet', target: 'n-ufc', label: 'spoof', score: -1 },
      { id: 'e2', source: 'n-judge', target: 'n-ufc', label: 'scorecard', score: 0 },
    ],
    conditions: cond({ jurisdiction: 'j-01', 'device-type': 'dev-b' }, 'Sports desk — compact form mock.'),
    evidence: [
      ev('UFC Abu Dhabi active fight-night trend cluster', 'Present on trend boards.', 1, ['ufc']),
      ev('Official fight results as published by UFC', '+1 with official graphic only.', 1, ['results']),
      ev('Judging “robbery” narratives', 'Subjective — separate from conspiracy.', 0, ['judging']),
      ev('Fighter death rumor without hospital/promotion confirm', 'Recurring hoax pattern.', -1, ['hoax']),
      ev('Medical suspension list primary', 'Seek commission page.', 0, ['medical']),
    ],
    researchNotes: [
      note('Sports misinfo SOP', 'Pin UFC.com results. Cross-check injuries with beat reporters.', 1, ['sop']),
      note('Hoax reject', 'Death rumor −1.', -1, ['hoax']),
    ],
    ladder: ladder(0, {
      0: { score: 1, note: 'Card identity locked to official promotion.' },
    }),
    wdEntries: [
      { kind: 'decision', title: 'Desk · UFC Abu Dhabi', body: 'Triage. Death-hoax −1.', score: 1, moduleId: 'research-hub' },
    ],
    analystLog: [
      'Investigation #6 UFC Abu Dhabi loaded.',
      '› score -1 Fighter death rumor :: No promotion/hospital primary',
      'Evidence filed at −1',
    ],
    designNotes: 'Compact form for arena media riser mock.',
    forgeAssetType: 'cabinet-node-b',
    forgeName: 'Media Riser Node',
    forgeDescription: 'Generic cabinet for broadcast riser mock.',
    sessionMode: 'analyze',
  },

  {
    useCaseId: 'trend-07-world-cup',
    mapPin: pin(
      'trend-07-world-cup',
      '⑦ World Cup 2026 aftermath',
      'NYC',
      40.7128,
      -74.006,
      'sport-civic',
      1,
      'Host-city sample (celebration claims)',
    ),
    scenePoints: [
      { id: 'w-celeb', label: 'Celebration corridor sample', lat: 40.758, lng: -73.985, kind: 'crowd', score: 1, tags: ['fans'] },
      { id: 'w-order', label: 'Public-order claim locus', lat: 40.73, lng: -73.99, kind: 'order', score: 0, tags: ['police'] },
    ],
    graphNodes: [
      { id: 'n-fifa', label: 'FIFA result', kind: 'control', score: 1 },
      { id: 'n-city', label: 'City claim', kind: 'stage', score: 0 },
      { id: 'n-war', label: 'Civil-war frame', kind: 'risk', score: -1 },
    ],
    graphEdges: [
      { id: 'e1', source: 'n-city', target: 'n-fifa', label: 'separate-ledgers' },
      { id: 'e2', source: 'n-war', target: 'n-city', label: 'reject', score: -1 },
    ],
    conditions: cond(
      { jurisdiction: 'j-02', 'site-class': 'site-cluster', clearance: 'clr-std' },
      'Host-city crowd corridors — elevated review.',
    ),
    evidence: [
      ev('Spain 1–0 Argentina ET in 2026 final (19 Jul) per major summaries', 'Confirm FIFA primary for publication.', 1, ['result']),
      ev('Celebration gatherings multi-city with large citizen video', 'Geolocate each “riot” claim.', 1, ['fans']),
      ev('Nationwide civil-war / mass fatality riots as one event', 'Catastrophic framing without body counts.', -1, ['exaggeration']),
      ev('Referee corruption with document proof', 'Hold 0 until docs/investigation primary.', 0, ['ref']),
      ev('City arrest stats primary table', 'Seek host-city blotter.', 0, ['stats']),
    ],
    researchNotes: [
      note('Two ledgers', 'Match facts vs per-city street claims. Reject cross-country footage mismatches.', 1, ['method']),
      note('Catastrophic frame', 'Civil-war claim −1.', -1, ['noise']),
    ],
    ladder: ladder(1, {
      0: { score: 1, note: 'Final result identity (pending FIFA primary attach).' },
      1: { score: 0, note: 'City-level order structure incomplete.' },
    }),
    wdEntries: [
      { kind: 'decision', title: 'Desk · World Cup aftermath', body: 'Research + atlas. Exaggeration −1.', score: 1, moduleId: 'research-hub' },
    ],
    analystLog: [
      'Investigation #7 World Cup aftermath loaded.',
      '› score -1 Civil war riots nationwide :: No multi-city primary body counts',
    ],
    designNotes: 'Cluster site class for celebration corridor density.',
    forgeAssetType: 'mast-enclosure-a',
    forgeName: 'Corridor Observe',
    forgeDescription: 'Generic observe mast for civic corridor mock.',
    sessionMode: 'analyze',
  },

  {
    useCaseId: 'trend-08-venezuela-quake',
    mapPin: pin(
      'trend-08-venezuela-quake',
      '⑧ Venezuela quake aftermath',
      'Caracas',
      10.4806,
      -66.9036,
      'disaster',
      1,
      'Venezuela',
    ),
    scenePoints: [
      { id: 'q-dmg', label: 'Damage tour sample', lat: 10.49, lng: -66.88, kind: 'damage', score: 0, tags: ['building'] },
      { id: 'q-rescue', label: 'Rescue clip locus', lat: 10.47, lng: -66.91, kind: 'rescue', score: 1, tags: ['sar'] },
    ],
    graphNodes: [
      { id: 'n-usgs', label: 'Seismic primary', kind: 'control', score: 1 },
      { id: 'n-clip', label: 'Citizen damage', kind: 'stage', score: 0 },
      { id: 'n-mis', label: 'Mislocated rubble', kind: 'risk', score: -1 },
    ],
    graphEdges: [
      { id: 'e1', source: 'n-clip', target: 'n-usgs', label: 'context' },
      { id: 'e2', source: 'n-mis', target: 'n-clip', label: 'reject', score: -1 },
    ],
    conditions: cond(
      { jurisdiction: 'j-03', 'site-class': 'site-edge', clearance: 'clr-ext', 'power-path': 'pwr-solar' },
      'Restricted · edge mount · extended clearance · off-grid mock for field kits.',
    ),
    evidence: [
      ev('Significant Venezuela quake impacts with citizen rescue/damage media', 'Pin USGS/national numbers for magnitude.', 1, ['quake']),
      ev('Exact death toll settled and static', 'Tolls revise — keep 0.', 0, ['casualties']),
      ev('Clip from different country labeled Venezuela 2026', 'Classic misinfo when geolocation fails.', -1, ['mislocated']),
      ev('Aid access inequality narratives', 'Track carefully with primary manifests.', 0, ['aid']),
      ev('Building-style geolocation pass on top damage tour', 'Pending second angle.', 0, ['geo']),
    ],
    researchNotes: [
      note('Ground-truth SOP', 'USGS/EMSC first. Building style before amplify damage tours.', 1, ['sop']),
      note('Mislocated reject', 'Foreign rubble −1.', -1, ['reject']),
    ],
    ladder: ladder(2, {
      0: { score: 1, note: 'Event: quake aftermath desk.' },
      1: { score: 1, note: 'Spatial pins: rescue + damage samples.' },
      2: { score: 0, note: 'Aid systems incomplete without manifests.' },
    }),
    wdEntries: [
      { kind: 'decision', title: 'Desk · Venezuela quake', body: 'Spatial primary. Mislocated −1.', score: 1, moduleId: 'atlas' },
      { kind: 'condition', title: 'Field kit conditions', body: 'J-03 · edge · solar · extended clearance', score: 1, moduleId: 'design-lab' },
    ],
    analystLog: [
      'Investigation #8 Venezuela quake loaded.',
      '› score -1 Mislocated rubble clip :: Landmarks not Venezuela',
    ],
    designNotes: 'Edge mount + solar for field observation mock.',
    forgeAssetType: 'mast-enclosure-a',
    forgeName: 'Field Observe Mast',
    forgeDescription: 'Generic field mast — not a certified install.',
    sessionMode: 'analyze',
  },

  {
    useCaseId: 'trend-09-political-claims',
    mapPin: pin(
      'trend-09-political-claims',
      '⑨ Political viral claims desk',
      'DC',
      38.9072,
      -77.0369,
      'politics',
      0,
      'Washington DC (process desk)',
    ),
    scenePoints: [
      { id: 'p-fec', label: 'Filing / records locus (symbolic)', lat: 38.9, lng: -77.04, kind: 'records', score: 0, tags: ['fec'] },
    ],
    graphNodes: [
      { id: 'n-trend', label: 'X trend', kind: 'stage', score: 1 },
      { id: 'n-fec', label: 'FEC/court primary', kind: 'control', score: 1 },
      { id: 'n-poll', label: 'Fake poll graphic', kind: 'risk', score: -1 },
      { id: 'n-quote', label: 'Partial quote', kind: 'stage', score: 0 },
    ],
    graphEdges: [
      { id: 'e1', source: 'n-trend', target: 'n-fec', label: 'document?' },
      { id: 'e2', source: 'n-poll', target: 'n-trend', label: 'reject', score: -1 },
      { id: 'e3', source: 'n-quote', target: 'n-fec', label: 'full-context', score: 0 },
    ],
    conditions: cond({ jurisdiction: 'j-02', 'device-type': 'dev-a' }, 'Process desk — elevated review on claims.'),
    evidence: [
      ev('“2028” multi-day political conversation cluster on X (late Jul 2026)', 'Conversation ≠ candidacy paperwork.', 1, ['trends']),
      ev('Specific “filed today” without FEC/primary document', 'Require document link.', 0, ['filing']),
      ev('Screenshot internal poll with no field house/dates/sample', 'Unsourced graphics are disqualifying noise.', -1, ['polling']),
      ev('Quotes scored only against full video/transcript', 'Partial clips default 0.', 0, ['quotes']),
      ev('Exploratory committee existence', 'Seek primary filing.', 0, ['committee']),
    ],
    researchNotes: [
      note('Process hygiene', 'FEC/court first. Full speech before quote cards. Label speculation in WD.', 1, ['sop']),
      note('Fake poll', '−1 blocks export.', -1, ['reject']),
    ],
    ladder: ladder(1, {
      0: { score: 1, note: 'Desk: viral political claim triage (process only).' },
      1: { score: 0, note: 'Document structure incomplete without filings.' },
    }),
    wdEntries: [
      { kind: 'decision', title: 'Desk · political viral claims', body: 'Export-review layout. Fake poll −1.', score: 1, moduleId: 'export-kit' },
      { kind: 'layer0', title: 'Would hold on export.kit', body: 'Unresolved −1 fake poll.', score: -1, moduleId: 'export-kit' },
    ],
    analystLog: [
      'Investigation #9 political claims loaded.',
      '› score -1 Internal poll screenshot :: No field house or sample',
      '› status',
      'export would hold · open −1=1',
    ],
    designNotes: 'Baseline matrix — process desk not siting-focused.',
    forgeAssetType: 'cabinet-node-b',
    forgeName: 'Records Node',
    forgeDescription: 'Generic node for records-desk mock.',
    sessionMode: 'export',
  },

  {
    useCaseId: 'trend-10-clip-authenticity',
    mapPin: pin(
      'trend-10-clip-authenticity',
      '⑩ X clip authenticity desk',
      'Global',
      20.0,
      0.0,
      'meta',
      0,
      'Network / meta desk',
    ),
    scenePoints: [
      { id: 'a-hub', label: 'Verification hub (symbolic)', lat: 20, lng: 0, kind: 'hub', score: 1, tags: ['meta'] },
      { id: 'a-reject', label: 'Reject cluster (symbolic)', lat: 15, lng: 10, kind: 'reject', score: -1, tags: ['disinfo'] },
    ],
    graphNodes: [
      { id: 'n-viral', label: 'Viral post', kind: 'stage', score: 0 },
      { id: 'n-rev', label: 'Reverse search', kind: 'control', score: 1 },
      { id: 'n-syn', label: 'Synthetic media', kind: 'risk', score: -1 },
      { id: 'n-ok', label: 'Two-angle confirm', kind: 'control', score: 1 },
    ],
    graphEdges: [
      { id: 'e1', source: 'n-viral', target: 'n-rev', label: 'check' },
      { id: 'e2', source: 'n-syn', target: 'n-viral', label: 'inject', score: -1 },
      { id: 'e3', source: 'n-rev', target: 'n-ok', label: 'pass', score: 1 },
    ],
    conditions: cond(
      { jurisdiction: 'j-02', 'device-type': 'dev-c', clearance: 'clr-ext' },
      'Meta desk — extended review on every media object.',
    ),
    evidence: [
      ev('Platform speed routinely outpaces institutional verification', 'Structural observation.', 1, ['platform']),
      ev('Given viral clip is authentic original of claimed event', 'Default 0 until reverse+geo+lineage.', 0, ['auth']),
      ev('Clip proven different date/location than caption', 'When mismatch proven — −1 and block packages relying on it.', -1, ['recycled']),
      ev('AI eyewitness accepted because it “looks real”', 'Lookism is not a method.', -1, ['synthetic']),
      ev('Uploader age/bot indicators logged', 'Pending tool notes.', 0, ['uploader']),
    ],
    researchNotes: [
      note('Authenticity playbook', 'Reverse search first. Shadows, weather, signage. Prefer two devices. Log every reject as −1.', 1, ['sop']),
      note('Synthetic reject', 'AI eyewitness −1.', -1, ['synthetic']),
      note('Recycled reject', 'Date/location mismatch −1.', -1, ['recycled']),
    ],
    ladder: ladder(3, {
      0: { score: 1, note: 'Meta desk identity: provenance.' },
      1: { score: 1, note: 'Method structure: reverse → geo → lineage.' },
      2: { score: 1, note: 'Control systems: two-angle rule.' },
      3: { score: 0, note: 'Components: tool chain notes incomplete.' },
    }),
    wdEntries: [
      { kind: 'decision', title: 'Desk · clip authenticity', body: 'Two −1 items (synthetic + recycled). Export hard-blocked.', score: 1, moduleId: 'research-hub' },
      { kind: 'layer0', title: 'Layer-0 hold simulation', body: 'export.kit blocked by open −1 count=2', score: -1, moduleId: 'export-kit' },
      { kind: 'rewrite', title: 'Playbook rewrite', body: 'Added uploader-history step to verification list.', score: 1, moduleId: 'research-hub' },
    ],
    analystLog: [
      'Investigation #10 clip authenticity loaded.',
      '› score -1 Synthetic eyewitness :: No provenance',
      '› score -1 Recycled clip wrong date :: Reverse search match 2024',
      '› layer0 export.kit',
      'Export blocked: 2 unresolved −1',
      'Open −1 items must clear before any kit download.',
    ],
    designNotes: 'Extended clearance metaphor for media standoff / review distance.',
    forgeAssetType: 'cabinet-node-b',
    forgeName: 'Verify Bench Node',
    forgeDescription: 'Generic bench node for media review station mock.',
    sessionMode: 'review',
  },
]

const TREND_SIMS: InvestigationSimulation[] = DRAFTS.map((d) => {
  const sources = getActiveSourcesForDesk(d.useCaseId)
  const primaryIds = sources.filter((s) => s.kind === 'official' || s.publicRecord).map((s) => s.id)
  const wireIds = sources.filter((s) => s.kind === 'wire' || s.kind === 'local').map((s) => s.id)
  const toolIds = sources.filter((s) => s.kind === 'tool' || s.kind === 'map').map((s) => s.id)
  // Attach concrete source ids onto evidence rows for click-through in Research Hub
  const evidence = d.evidence.map((e) => {
    const refs =
      e.score === 1
        ? primaryIds.slice(0, 2).concat(wireIds.slice(0, 1))
        : e.score === -1
          ? toolIds.slice(0, 2)
          : wireIds.slice(0, 1).concat(toolIds.slice(0, 1))
    return {
      ...e,
      sourceRefs: refs.length ? refs : e.sourceRefs,
    }
  })
  return { ...d, sources, evidence }
})

const SIMS: InvestigationSimulation[] = [
  ...TREND_SIMS,
  ...(buildCongressSimulations() as InvestigationSimulation[]),
  ...CORPUS_SIMS,
]

const BY_ID = new Map(SIMS.map((s) => [s.useCaseId, s]))

export function getSimulation(useCaseId: string): InvestigationSimulation | undefined {
  return BY_ID.get(useCaseId)
}

export function allInvestigationPins(): InvestigationMapPin[] {
  return SIMS.map((s) => s.mapPin)
}

export function listSimulations(): InvestigationSimulation[] {
  return SIMS
}

export function getSourcesForActiveDesk(useCaseId: string): ActiveSource[] {
  return getSimulation(useCaseId)?.sources ?? getActiveSourcesForDesk(useCaseId)
}

/** Build forge assets for a simulation (pure). */
export function buildSimulationAssets(sim: InvestigationSimulation): ProceduralAsset[] {
  const asset = generateAsset({
    name: sim.forgeName,
    assetType: sim.forgeAssetType,
    description: sim.forgeDescription,
    conditions: sim.conditions,
  })
  return [asset]
}
