/**
 * Dan-style per-item procedural optimization for the Rendering Layer.
 * Never build a monolithic claim scene — coarse item → optimize item → assemble.
 * Illustrative only — MODEL_DISCLAIMER on every asset.
 */

import type { ActiveConditions, EvidenceScore, ProceduralAsset } from '../../types/core'
import { MODEL_DISCLAIMER } from '../../types/core'
import { generateAsset, optimizeAsset } from './generators'
import { meshAccentColor } from './objectReasoning'
import type { PotentialObject } from './potentials'
import { isGhostPotential } from './potentials'

export type ItemOptimizeStage = 'coarse' | 'optimized' | 'assembled' | 'skipped-open'

export interface ItemOptimizeResult {
  potentialId: string
  name: string
  stage: ItemOptimizeStage
  asset: ProceduralAsset
  notes: string[]
}

export interface AssembleReport {
  items: ItemOptimizeResult[]
  assets: ProceduralAsset[]
  methodNote: string
  orderedIds: string[]
}

/** Sort potentials for assembly: critical refined first, then score strength, then importance. */
export function sortPotentialsForAssembly(pots: PotentialObject[]): PotentialObject[] {
  const statusRank = (s: PotentialObject['status']) => {
    if (s === 'refined-supported') return 0
    if (s === 'refined-disputed') return 1
    if (s === 'resolved') return 2
    if (s === 'potential') return 3
    return 4 // speculative
  }
  return [...pots].sort((a, b) => {
    const sr = statusRank(a.status) - statusRank(b.status)
    if (sr !== 0) return sr
    const sc = (b.score === 1 ? 2 : b.score === -1 ? 1 : 0) - (a.score === 1 ? 2 : a.score === -1 ? 1 : 0)
    if (sc !== 0) return sc
    return b.importanceScore - a.importanceScore
  })
}

/** Stage A — low-poly / coarse single item (never a full multi-object scene). */
export function generateCoarseItem(
  pot: PotentialObject,
  conditions: ActiveConditions | null,
): ProceduralAsset {
  const accent =
    pot.accent ??
    (isGhostPotential(pot.status) ? '#94a3b8' : meshAccentColor(pot.verifiability))
  const asset = generateAsset({
    name: pot.name,
    assetType: pot.meshFamily || pot.assetType,
    description: [
      pot.description,
      `Potential status: ${pot.status}`,
      `Spatial role: ${pot.spatialRole}`,
      pot.relatedClaimHint ? `Claim: ${pot.relatedClaimHint}` : '',
      'Stage: coarse (per-item Dan pipeline)',
      MODEL_DISCLAIMER,
    ]
      .filter(Boolean)
      .join('\n'),
    conditions,
    score: pot.score as EvidenceScore,
    verifiability: pot.verifiability,
    reasoning: pot.reasoningBullets ?? pot.reasoning,
    flags: [...(pot.flags ?? []), 'ITEM_STAGE:coarse', 'PIPELINE:dan-per-item'],
    relatedClaimHint: pot.relatedClaimHint,
    sourceIds: pot.sourceIds,
    importance: pot.importance,
    accentColor: accent,
  })
  return {
    ...asset,
    optimizeNotes: [
      'Dan pipeline stage: coarse — single item low-poly family mesh',
      ...asset.optimizeNotes,
    ],
  }
}

/**
 * Stage B — optimize that single item only.
 * Open potentials stay coarse (ghost) unless forceOptimize.
 */
export function optimizeSingleItem(
  coarse: ProceduralAsset,
  pot: PotentialObject,
  opts?: { forceOptimize?: boolean },
): { asset: ProceduralAsset; stage: ItemOptimizeStage; notes: string[] } {
  const open = isGhostPotential(pot.status) && !opts?.forceOptimize
  if (open) {
    return {
      asset: {
        ...coarse,
        flags: [...(coarse.flags ?? []), 'ITEM_STAGE:coarse-open'],
        optimizeNotes: [
          ...coarse.optimizeNotes,
          'Open potential/speculative — left coarse until ledger refine or operator resolve',
        ],
      },
      stage: 'skipped-open',
      notes: ['Left coarse (open potential)'],
    }
  }
  const optimized = optimizeAsset(coarse)
  const notes = [
    'Dan pipeline stage: optimize — single item only (no monolithic scene pass)',
    'Normalized hinges / footprint micro-clean; preserved mesh family',
    MODEL_DISCLAIMER,
  ]
  return {
    asset: {
      ...optimized,
      flags: [...(optimized.flags ?? []), 'ITEM_STAGE:optimized', 'PIPELINE:dan-per-item'],
      optimizeNotes: [...optimized.optimizeNotes, ...notes],
    },
    stage: 'optimized',
    notes,
  }
}

/**
 * Full assemble: sort → per-item coarse → per-item optimize → list of assets.
 * Cap keeps Massing legible.
 */
export function assembleSceneFromPotentials(
  pots: PotentialObject[],
  conditions: ActiveConditions | null,
  opts?: { maxItems?: number; forceOptimizeOpen?: boolean },
): AssembleReport {
  const maxItems = opts?.maxItems ?? 12
  const ordered = sortPotentialsForAssembly(pots).slice(0, maxItems)
  const items: ItemOptimizeResult[] = []

  for (const pot of ordered) {
    const coarse = generateCoarseItem(pot, conditions)
    const { asset, stage, notes } = optimizeSingleItem(coarse, pot, {
      forceOptimize: opts?.forceOptimizeOpen,
    })
    items.push({
      potentialId: pot.id,
      name: pot.name,
      stage: stage === 'optimized' ? 'assembled' : stage,
      asset: {
        ...asset,
        // Keep stable-ish id keyed to potential for re-seed diffs
        name: pot.name,
        flags: [...(asset.flags ?? []), 'ITEM_STAGE:assembled'],
        optimizeNotes: [
          ...asset.optimizeNotes,
          'Dan pipeline stage: assembled into Rendering Layer scene list',
        ],
      },
      notes,
    })
  }

  return {
    items,
    assets: items.map((i) => i.asset),
    orderedIds: items.map((i) => i.potentialId),
    methodNote:
      'Per-item procedural optimization (Dan-style): coarse → optimize each Potential independently → assemble. Not a monolithic scene. Illustrative only.',
  }
}
