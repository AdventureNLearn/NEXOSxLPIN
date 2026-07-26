/**
 * Potentials system — Rendering Layer claim-driven candidates.
 * Mapping Layer (location) never imports this module for mutation.
 *
 * Illustrative only — not forensic / not digital twin.
 */

import type { EvidenceScore } from '../../types/core'
import type {
  EvidentiaryObject,
  ObjectImportance,
  VerifiabilityFlag,
} from './objectReasoning'
import { meshAccentColor, verifiabilityLabel } from './objectReasoning'
import { getMeshFamily, resolveMeshFamilyId } from '../../data/forge/meshCatalog'

export type PotentialStatus =
  | 'potential'
  | 'refined-supported'
  | 'refined-disputed'
  | 'speculative'
  | 'resolved'

export type SpatialRole = 'surface' | 'activity-locus' | 'actor' | 'prop' | 'other'

/** Claim/context overlay only — never mapping foundation. */
export type RenderingLayerTag = 'rendering'

export interface PotentialObject extends EvidentiaryObject {
  /** Mesh family id (alias of assetType for clarity) */
  meshFamily: string
  /** Claim / evidence ids that support this candidate */
  linkedClaims: string[]
  status: PotentialStatus
  importanceBand: ObjectImportance
  spatialRole: SpatialRole
  reasoningBullets: string[]
  layer: RenderingLayerTag
  /** Operator closed the open loop without forcing truth */
  operatorResolved?: boolean
}

export type LayerVisibilityMode = 'mapping' | 'rendering' | 'both'

export function isGhostPotential(status: PotentialStatus): boolean {
  return status === 'potential' || status === 'speculative'
}

export function potentialStatusLabel(s: PotentialStatus): string {
  switch (s) {
    case 'potential':
      return 'Potential (open)'
    case 'refined-supported':
      return 'Refined · supported sketch'
    case 'refined-disputed':
      return 'Refined · disputed locus'
    case 'speculative':
      return 'Speculative (open)'
    case 'resolved':
      return 'Resolved by operator'
  }
}

/** Derive potential status from ledger signals — does not invent +1. */
export function derivePotentialStatus(
  o: Pick<EvidentiaryObject, 'score' | 'verifiability' | 'sourceIds' | 'flags' | 'curated'>,
  operatorResolved?: boolean,
): PotentialStatus {
  if (operatorResolved) return 'resolved'
  if (o.score === -1 || o.verifiability === 'disputed_unverifiable') return 'refined-disputed'
  if (o.score === 1 && (o.sourceIds?.length ?? 0) > 0 && o.verifiability === 'verified_supported') {
    return 'refined-supported'
  }
  if (o.verifiability === 'narrative_only' || o.flags.includes('NARRATIVE_CAPTURE_RISK')) {
    return 'speculative'
  }
  if (o.score === 1 && !(o.sourceIds?.length)) return 'speculative'
  if (o.curated && o.score === 1) return 'refined-supported'
  return 'potential'
}

export function inferSpatialRole(
  familyId: string,
  name: string,
  role: string,
): SpatialRole {
  const t = `${familyId} ${name} ${role}`.toLowerCase()
  if (/table|counter|tray|desk|surface|ground|path|plaza|platform/.test(t)) return 'surface'
  if (/person|crowd|actor|pedestrian|worker|operator/.test(t)) return 'actor'
  if (/vehicle|sedan|truck|bus|locus|scene|incident|site/.test(t)) return 'activity-locus'
  if (/book|phone|tablet|paper|sensor|mast|camera|gauge|prop/.test(t)) return 'prop'
  return 'other'
}

/**
 * Multi-mode activity → parallel mesh family candidates.
 * Surfaces and alternate instruments stay open as potentials.
 */
export const ACTIVITY_PARALLEL_POTENTIALS: Array<{
  trigger: RegExp
  label: string
  /** mesh family ids preferred when present in catalog */
  familyIds: string[]
  spatialRole: SpatialRole
}> = [
  {
    trigger: /\b(eat|eating|ate|meal|dining|lunch|dinner|food)\b/i,
    label: 'eating-surface',
    familyIds: [
      'mf-civic-path-strip',
      'mf-civic-crowd-plaza',
      'mf-mfg-foundry-bay',
    ],
    spatialRole: 'surface',
  },
  {
    trigger: /\b(read|reading|book|phone|tablet|paper|document)\b/i,
    label: 'reading-prop',
    familyIds: [
      'mf-gov-docket-stack',
      'mf-civic-path-strip',
    ],
    spatialRole: 'prop',
  },
  {
    trigger: /\b(drive|driving|vehicle|car|truck|bus|struck)\b/i,
    label: 'vehicle-activity',
    familyIds: ['mf-civic-vehicle-sedan', 'mf-civic-path-strip'],
    spatialRole: 'activity-locus',
  },
]

export function evidentiaryToPotential(
  o: EvidentiaryObject,
  opts?: { operatorResolved?: boolean; spatialRole?: SpatialRole },
): PotentialObject {
  const meshFamily = resolveMeshFamilyId(o.assetType)
  const status = derivePotentialStatus(o, opts?.operatorResolved)
  const spatialRole =
    opts?.spatialRole ?? inferSpatialRole(meshFamily, o.name, o.role)
  const bullets = [
    ...o.reasoning,
    `Layer: rendering (claim/context overlay — not the basemap foundation).`,
    `Status: ${potentialStatusLabel(status)}.`,
    `Verifiability: ${verifiabilityLabel(o.verifiability)}.`,
    'Illustrative geometry only — not a certified survey or forensic reconstruction.',
  ]
  return {
    ...o,
    meshFamily,
    linkedClaims: o.sourceIds?.length ? o.sourceIds : o.id ? [o.relatedClaimHint || o.id] : [],
    status,
    importanceBand: o.importance,
    spatialRole,
    reasoningBullets: bullets,
    layer: 'rendering',
    operatorResolved: opts?.operatorResolved,
    flags: [
      ...o.flags,
      `POTENTIAL:${status}`,
      `LAYER:rendering`,
      `ROLE:${spatialRole}`,
      ...(isGhostPotential(status) ? ['GHOST_MATERIAL'] : []),
    ],
    accent: isGhostPotential(status)
      ? '#94a3b8'
      : o.accent ?? meshAccentColor(o.verifiability),
  }
}

/** Expand activity phrases into parallel potential candidates (open loop). */
export function expandActivityPotentials(
  base: PotentialObject[],
  storyText: string,
  deskId: string,
): PotentialObject[] {
  const out = [...base]
  const seen = new Set(out.map((o) => o.meshFamily))
  let n = 0
  for (const act of ACTIVITY_PARALLEL_POTENTIALS) {
    if (!act.trigger.test(storyText)) continue
    for (const fid of act.familyIds) {
      const fam = getMeshFamily(resolveMeshFamilyId(fid))
      if (!fam || seen.has(fam.id)) continue
      seen.add(fam.id)
      n++
      const id = `pot-act-${deskId}-${act.label}-${fam.id}`
      out.push({
        id,
        name: `${fam.name} (${act.label})`,
        role: `${fam.role} · activity potential`,
        description: `Parallel potential from activity “${act.label}”. Illustrative only — open until refined by scores or operator resolve.`,
        assetType: fam.id,
        meshFamily: fam.id,
        relatedClaimHint: act.label,
        sourceText: storyText.slice(0, 160),
        score: 0 as EvidenceScore,
        verifiability: 'plausible_unverified' as VerifiabilityFlag,
        importance: 'supporting',
        importanceBand: 'supporting',
        importanceScore: 11,
        reasoning: [
          `Activity pattern matched: ${act.label}.`,
          'Emitted as open potential — multi-mode action; not forced closed.',
          'Illustrative geometry only — not forensic.',
        ],
        reasoningBullets: [
          `Activity pattern matched: ${act.label}.`,
          'Open potential (multi-mode) — operator or ledger must refine.',
          'Layer: rendering.',
        ],
        flags: ['POTENTIAL:potential', 'LAYER:rendering', 'ACTIVITY_PARALLEL', 'GHOST_MATERIAL'],
        sourceIds: [],
        linkedClaims: [],
        curated: false,
        status: 'potential',
        spatialRole: act.spatialRole,
        layer: 'rendering',
        industries: fam.industries,
        smeDomains: fam.smeDomains,
        depth: fam.depth,
        accent: '#94a3b8',
      })
    }
  }
  if (n > 0) {
    // keep list bounded
    return out.slice(0, 22)
  }
  return out
}

export function buildPotentialSet(
  objects: EvidentiaryObject[],
  storyText: string,
  deskId: string,
  resolvedIds?: Set<string>,
): PotentialObject[] {
  const base = objects.map((o) =>
    evidentiaryToPotential(o, { operatorResolved: resolvedIds?.has(o.id) }),
  )
  // Curated already in objects — expand activities for fluid scenarios
  return expandActivityPotentials(base, storyText, deskId)
}

export function ghostMaterialOpacity(status: PotentialStatus): number {
  if (status === 'speculative') return 0.32
  if (status === 'potential') return 0.42
  if (status === 'resolved') return 0.7
  return 1
}
