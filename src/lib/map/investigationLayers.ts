/**
 * Investigation spatial layers — inspired by portable public patterns:
 * - Multi-layer toggle + opacity (layered atlas style)
 * - Hierarchy: World → Site → Scenes → Models (site-map / enterprise levels)
 * - Node/edge clarity for claim networks (mesh viz posture)
 * - Grounding before confidence (anti-hallucination triad)
 *
 * All layers are ILLUSTRATIVE training aids for civic verification — not survey-grade GIS.
 * No private PII. High-level until a desk/story focus is chosen.
 */

export type InvestigationLayerId =
  | 'place'
  | 'claims'
  | 'sources'
  | 'models'
  | 'hierarchy'

export interface InvestigationLayer {
  id: InvestigationLayerId
  /** Plain-language name (non-developer) */
  label: string
  /** One sentence for everyday operators */
  plain: string
  /** What truth-seeking job this layer does */
  job: string
  color: string
  defaultOn: boolean
  /** Ring / depth 0 = outer context … higher = tighter focus */
  ring: number
}

/** Fixed stack — order is outer → inner (read top to bottom like a story). */
export const INVESTIGATION_LAYERS: InvestigationLayer[] = [
  {
    id: 'place',
    label: 'Where',
    plain: 'The map of the place this story is about.',
    job: 'Orient without inventing coordinates for private homes.',
    color: '#38bdf8',
    defaultOn: true,
    ring: 0,
  },
  {
    id: 'hierarchy',
    label: 'Levels',
    plain: 'Big picture → this site → scenes inside the story.',
    job: 'Keep scale honest: world, site, and local markers stay separate.',
    color: '#94a3b8',
    defaultOn: true,
    ring: 1,
  },
  {
    id: 'claims',
    label: 'Claims',
    plain: 'What people are saying — marked Supported, Not proven, or Disputed.',
    job: 'Score language before it becomes “fact” on a map.',
    color: '#34d399',
    defaultOn: true,
    ring: 2,
  },
  {
    id: 'sources',
    label: 'Sources',
    plain: 'Records and links that back a claim — or the empty hole where proof is missing.',
    job: 'No source, no verified +1. Primary over posts.',
    color: '#fbbf24',
    defaultOn: true,
    ring: 3,
  },
  {
    id: 'models',
    label: 'Sketch models',
    plain: 'Simple 3D stand-ins from scored claims — never a crime-scene rebuild.',
    job: 'Help you see space and risk without laundering uncertainty.',
    color: '#a78bfa',
    defaultOn: true,
    ring: 4,
  },
]

export type LayerVisibility = Record<InvestigationLayerId, boolean>

export function defaultLayerVisibility(): LayerVisibility {
  return INVESTIGATION_LAYERS.reduce((acc, L) => {
    acc[L.id] = L.defaultOn
    return acc
  }, {} as LayerVisibility)
}

/** Hierarchy bands (site-map style) — plain labels only. */
export type HierarchyLevel = 'world' | 'site' | 'scene' | 'object'

export const HIERARCHY_LABELS: Record<HierarchyLevel, { label: string; plain: string }> = {
  world: { label: 'World', plain: 'Other open stories on the planet map' },
  site: { label: 'This place', plain: 'The main pin for the story you picked' },
  scene: { label: 'Scenes', plain: 'Paths, venues, or areas inside the story' },
  object: { label: 'Sketch objects', plain: 'Simple sketch stand-ins tied to scored claims' },
}

/**
 * Grounding triad (anti-hallucination posture):
 * Perception (what was said) → Record (what can be cited) → Score (operator judgment).
 * Models must not skip the middle step.
 */
export type GroundingLeg = 'perception' | 'record' | 'score'

export function groundingPlain(leg: GroundingLeg): string {
  switch (leg) {
    case 'perception':
      return 'What is being claimed (words, clips, rumors).'
    case 'record':
      return 'What document, map, or instrument can be pointed at.'
    case 'score':
      return 'Your call: Supported (+1), Not proven (0), or Disputed (−1).'
  }
}

export function explainLayersForHumans(): string {
  return (
    'Think of the map like stacked transparent sheets. ' +
    'Where is the place. Claims are what people say. Sources are the proof. ' +
    'Sketch models are optional drawings from those scores — not court exhibits. ' +
    'Turn sheets on or off until the story is readable.'
  )
}
