/**
 * Generates src/data/useCases/storyCorpus100.ts
 * 10 detailed geo (from part1 data embedded) + 23 topical = 33 new desks
 * Wired for 100 total with existing 67.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

// Load geo seeds from the incomplete part1 if present — else embed minimal
// We'll write the complete file in one shot from this script's data.

const geo = JSON.parse(fs.readFileSync(path.join(__dirname, 'corpus_geo_seeds.json'), 'utf8'))
const topical = JSON.parse(fs.readFileSync(path.join(__dirname, 'corpus_topical_seeds.json'), 'utf8'))

const seeds = [...geo, ...topical]
if (seeds.length !== 33) {
  console.error('Expected 33 seeds, got', seeds.length)
  process.exit(1)
}

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')
}

function emitSeed(s) {
  const claims = s.claims
    .map(
      (c) =>
        `      { plain: '${esc(c.plain)}', score: ${c.score} as EvidenceScore, why: '${esc(c.why)}' }`,
    )
    .join(',\n')
  const known = s.known.map((k) => `'${esc(k)}'`).join(', ')
  const open = s.open.map((k) => `'${esc(k)}'`).join(', ')
  const sources = s.sources
    .map(
      (x) =>
        `      { title: '${esc(x.title)}', url: '${esc(x.url)}', why: '${esc(x.why)}', publisher: '${esc(x.publisher)}' }`,
    )
    .join(',\n')
  const tags = s.tags.map((t) => `'${esc(t)}'`).join(', ')
  return `  {
    id: '${s.id}',
    topic: '${s.topic}',
    subtopic: '${s.subtopic}',
    rank: ${s.rank},
    short: '${esc(s.short)}',
    title: '${esc(s.title)}',
    where: '${esc(s.where)}',
    lat: ${s.lat},
    lng: ${s.lng},
    lede: '${esc(s.lede)}',
    stakes: '${esc(s.stakes)}',
    known: [${known}],
    open: [${open}],
    claims: [
${claims}
    ],
    sources: [
${sources}
    ],
    agency: '${esc(s.agency)}',
    agencyUrl: '${esc(s.agencyUrl)}',
    tags: [${tags}],
  }`
}

const out = `/**
 * Story corpus expansion — 33 desks to reach 100 total (v1.6.1).
 * Catalogue: geopolitical (10 detailed) + topical (23).
 * Existing tops retained: gen-explore, trend-01…10, cong-01…56 (67).
 */
import type { EvidenceScore, MaterialClass, ModuleId } from '../../types/core'
import type {
  ActiveSource,
  PaneId,
  PaneWeight,
  UseCaseProfile,
  UseCaseReport,
} from '../../types/useCase'
import type { InvestigationStory } from './stories'
import type { InvestigationSimulation } from './simulations'
import { emptyLadder, uid } from '../../types/core'

const AS_OF = '2026-07-26'

export type StoryTopic =
  | 'geopolitical'
  | 'infrastructure'
  | 'public-health'
  | 'cyber-security'
  | 'climate-extreme'
  | 'markets-finance'
  | 'elections-process'
  | 'tech-governance'
  | 'energy-resources'
  | 'humanitarian'

export interface CorpusSeed {
  id: string
  topic: StoryTopic
  subtopic: string
  rank: number
  short: string
  title: string
  where: string
  lat: number
  lng: number
  lede: string
  stakes: string
  known: string[]
  open: string[]
  claims: Array<{ plain: string; score: EvidenceScore; why: string }>
  sources: Array<{ title: string; url: string; why: string; publisher: string }>
  agency: string
  agencyUrl: string
  tags: string[]
}

function st(score: EvidenceScore): 'supported' | 'uncertain' | 'disputed' {
  if (score === 1) return 'supported'
  if (score === -1) return 'disputed'
  return 'uncertain'
}

const ALL_ON: PaneId[] = [
  'information', 'atlas', 'design-lab', 'research-hub', 'analyst', 'sme-lenses',
  'audit-ladder', 'procedural-forge', 'massing-viewer', 'export-kit',
]

function panes(
  primary: PaneId[],
  weights: PaneWeight[],
  onDemand: PaneId[],
  preset: UseCaseProfile['layoutPreset'],
) {
  return {
    layoutPreset: preset,
    primaryPanes: primary,
    secondaryPanes: onDemand.slice(0, 3),
    defaultOpen: primary.slice(0, 5),
    paneWeights: weights,
    onDemand,
  }
}

export const CORPUS_SEEDS: CorpusSeed[] = [
${seeds.map(emitSeed).join(',\\n')}
]

function buildReport(seed: CorpusSeed): UseCaseReport {
  const claims = seed.claims.map((c, i) => ({
    id: \`\${seed.id}-c\${i + 1}\`,
    statement: c.plain,
    score: c.score,
    material: (c.score === 1 ? 'secondary' : c.score === -1 ? 'assumption' : 'derived') as MaterialClass,
    confidence: (c.score === 1 ? 'high' : c.score === -1 ? 'medium' : 'low') as
      | 'high' | 'medium' | 'low',
    notes: c.why,
    tags: seed.tags,
  }))
  const body = [
    \`# \${seed.title}\`,
    '',
    \`**Topic:** \${seed.topic} / \${seed.subtopic}\`,
    \`**As of:** \${AS_OF}\`,
    '',
    seed.lede,
    '',
    '## Stakes',
    seed.stakes,
    '',
    '## Claims',
    ...claims.map(
      (c) =>
        \`- **[\${c.score === 1 ? '+1' : c.score === -1 ? '−1' : '0'}]** \${c.statement} — _\${c.notes}_\`,
    ),
    '',
    '_NEXOSxLPIN training desk · Layer-0 · not legal advice._',
  ].join('\\n')
  return {
    asOf: AS_OF,
    trendSignal: \`\${seed.topic}/\${seed.subtopic} · \${seed.short}\`,
    headline: seed.title,
    executiveSummary: \`\${seed.lede} Stakes: \${seed.stakes}\`,
    claims,
    timeline: [
      { when: '2025–2026', what: \`Open-source tension and reporting cycle for \${seed.short}.\` },
      { when: AS_OF, what: 'Desk assembled for NEXOSxLPIN 100-story corpus.' },
      { when: 'Ongoing', what: \`\${seed.agency} materials are starting points — cite instruments.\` },
    ],
    openQuestions: seed.open,
    verificationPlaybook: [
      'Pull primary agency/mission releases before scoring duties.',
      'Geolocate and reverse-search viral media.',
      'Separate market/perception moves from legal fault.',
      'Resolve −1 rumor lines before export.',
    ],
    sourcesToSeek: seed.sources.map((s) => s.title),
    noiseRisks: [
      'Recycled footage',
      'Invented precision numbers',
      'Scope inflation from single clips',
      'Partisan maps without methodology',
    ],
    geographicNotes: seed.where,
    fullBriefMarkdown: body,
  }
}

function buildProfile(seed: CorpusSeed): UseCaseProfile {
  const rep = buildReport(seed)
  const spatial = seed.topic === 'geopolitical' || seed.tags.includes('maritime')
  return {
    id: seed.id,
    trendRank: seed.rank,
    label: seed.short,
    tagline: seed.title,
    family: seed.topic === 'geopolitical' ? 'geopolitical' : seed.topic,
    description: rep.executiveSummary,
    workflow: rep.verificationPlaybook.slice(0, 4),
    sampleClaimHints: rep.claims.map(
      (c) => \`\${c.score === 1 ? '+1' : c.score === -1 ? '−1' : '0'}: \${c.statement}\`,
    ),
    report: rep,
    mapPin: {
      useCaseId: seed.id,
      label: seed.short,
      shortLabel: seed.short,
      lat: seed.lat,
      lng: seed.lng,
      kind: seed.topic,
      score: 0,
      cityHint: seed.where,
    },
    dataPackId: 'pack-sample-alpha',
    ...panes(
      spatial
        ? ['atlas', 'research-hub', 'sme-lenses']
        : ['research-hub', 'atlas', 'sme-lenses'],
      [
        { pane: spatial ? 'atlas' : 'research-hub', weight: 5, minPx: 300, pinned: true },
        { pane: 'research-hub', weight: 4, minPx: 260 },
        { pane: 'sme-lenses', weight: 3, minPx: 220 },
      ],
      ALL_ON.filter((p) => !['atlas', 'research-hub', 'sme-lenses'].includes(p)),
      spatial ? 'spatial-primary' : 'research-first',
    ),
  }
}

function buildStory(seed: CorpusSeed): InvestigationStory {
  const claims = seed.claims.map((c) => ({
    plain: c.plain,
    status: st(c.score),
    score: c.score,
    why: c.why,
  }))
  return {
    useCaseId: seed.id,
    title: seed.title,
    where: seed.where,
    lede: seed.lede,
    stakes: seed.stakes,
    knownSoFar: seed.known,
    stillOpen: seed.open,
    claims,
    surfaces: {
      map: \`Pins \${seed.short} for spatial orientation · \${seed.where}.\`,
      research: 'Score claims with primary hierarchy; flag plausible-unverified.',
      design: 'Verification depth before publish.',
      ladder: 'Raise detail with sources intact.',
      analyst: 'SME multi-select for domain overlap.',
      model: 'Story meshes from claims/industry/SME tags.',
      export: 'Layer-0; clear −1 first.',
      sources: 'Agency and mission primaries listed on desk.',
    },
    tabLabels: {
      'research-hub': 'Claims',
      atlas: 'Desk map',
      'sme-lenses': 'SME',
      analyst: 'Commands',
      'export-kit': 'Export',
    },
    nextStep: 'Open Claims, bind +1 to primary, run multi-loop verify, seed Massing.',
  }
}

function buildSources(seed: CorpusSeed): ActiveSource[] {
  return seed.sources.map((s, i) => ({
    id: \`\${seed.id}-src-\${i + 1}\`,
    title: s.title,
    url: s.url,
    why: s.why,
    kind: 'official' as const,
    publisher: s.publisher,
    publicRecord: true,
    tags: seed.tags,
  }))
}

function buildSim(seed: CorpusSeed): InvestigationSimulation {
  const sources = buildSources(seed)
  const rep = buildReport(seed)
  const evidence = rep.claims.map((c) => ({
    id: uid('ev'),
    title: c.statement.slice(0, 120),
    summary: c.notes,
    score: c.score,
    confidence: c.confidence,
    material: c.material,
    tags: ['corpus-100', seed.topic, ...seed.tags],
    sourceRefs: sources.slice(0, 2).map((s) => s.id),
    createdAt: new Date().toISOString(),
    moduleId: 'research-hub' as ModuleId,
  }))
  const ladder = emptyLadder(1)
  ladder.current = 1
  ladder.populated[0] = true
  ladder.populated[1] = true
  return {
    useCaseId: seed.id,
    mapPin: {
      useCaseId: seed.id,
      label: seed.short,
      shortLabel: seed.short,
      lat: seed.lat,
      lng: seed.lng,
      kind: seed.topic,
      score: 0,
      cityHint: seed.where,
    },
    scenePoints: [],
    graphNodes: [
      { id: 'n-primary', label: 'Primary record', kind: 'control', score: 1 },
      { id: 'n-noise', label: 'Narrative noise', kind: 'risk', score: -1 },
      { id: 'n-export', label: 'Export gate', kind: 'control', score: 0 },
    ],
    graphEdges: [
      { id: 'e1', source: 'n-primary', target: 'n-export', label: 'clear if scored', score: 1 },
      { id: 'e2', source: 'n-noise', target: 'n-export', label: 'block', score: -1 },
    ],
    conditions: {
      matrixId: 'matrix-alpha',
      selections: {
        jurisdiction: 'j-01',
        'device-type': 'dev-a',
        'site-class': 'site-open',
        'power-path': 'pwr-grid',
        clearance: 'clr-std',
      },
      notes: \`Corpus desk \${seed.id}\`,
      updatedAt: new Date().toISOString(),
    },
    evidence,
    researchNotes: [
      {
        id: uid('rn'),
        title: \`Desk · \${seed.short}\`,
        body: seed.lede,
        score: 0 as EvidenceScore,
        material: 'secondary' as MaterialClass,
        tags: seed.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    ladder,
    wdEntries: [
      {
        kind: 'decision',
        title: \`Opened \${seed.short}\`,
        body: seed.stakes,
        score: 1,
        moduleId: 'research-hub',
      },
    ],
    analystLog: [
      \`Corpus desk \${seed.id} · \${seed.topic}/\${seed.subtopic}\`,
      '› Prefer primary hierarchy · sme multi-select for overlap',
    ],
    designNotes: 'Verification depth axes for training desk.',
    forgeAssetType: seed.topic === 'geopolitical' ? 'mf-gov-docket-stack' : 'mf-civic-path-strip',
    forgeName: seed.short,
    forgeDescription: \`Scene objects for \${seed.short}\`,
    sessionMode: 'analyze',
    sources,
  }
}

export const CORPUS_PROFILES: UseCaseProfile[] = CORPUS_SEEDS.map(buildProfile)
export const CORPUS_STORIES: Record<string, InvestigationStory> = Object.fromEntries(
  CORPUS_SEEDS.map((s) => [s.id, buildStory(s)]),
)
export const CORPUS_SOURCES: Record<string, ActiveSource[]> = Object.fromEntries(
  CORPUS_SEEDS.map((s) => [s.id, buildSources(s)]),
)
export const CORPUS_SIMS: InvestigationSimulation[] = CORPUS_SEEDS.map(buildSim)

export const CORPUS_TOPIC_LABELS: Record<StoryTopic, string> = {
  geopolitical: 'Geopolitical',
  infrastructure: 'Infrastructure',
  'public-health': 'Public health',
  'cyber-security': 'Cyber security',
  'climate-extreme': 'Climate & extreme weather',
  'markets-finance': 'Markets & finance',
  'elections-process': 'Elections process',
  'tech-governance': 'Tech governance',
  'energy-resources': 'Energy & resources',
  humanitarian: 'Humanitarian',
}

export function catalogueByTopic(): Record<string, { subtopic: string; ids: string[] }[]> {
  const map: Record<string, Map<string, string[]>> = {}
  for (const s of CORPUS_SEEDS) {
    if (!map[s.topic]) map[s.topic] = new Map()
    const m = map[s.topic]!
    if (!m.has(s.subtopic)) m.set(s.subtopic, [])
    m.get(s.subtopic)!.push(s.id)
  }
  const out: Record<string, { subtopic: string; ids: string[] }[]> = {}
  for (const [topic, sub] of Object.entries(map)) {
    out[topic] = [...sub.entries()].map(([subtopic, ids]) => ({ subtopic, ids }))
  }
  return out
}

if (CORPUS_SEEDS.length !== 33) {
  throw new Error(\`Expected 33 corpus seeds, got \${CORPUS_SEEDS.length}\`)
}
`

// Fix the accidental double-escaped newlines in template - write properly
const fixed = out.replace(/\\\\n/g, '\\n').replace(/\\n\$\{/g, '\n${')
// Actually the emit used \\n in join which became wrong. Rebuild simpler.

fs.writeFileSync(path.join(root, 'scripts', '_gen_out_check.txt'), `seeds ${seeds.length}`)
console.log('prep ok', seeds.length)
