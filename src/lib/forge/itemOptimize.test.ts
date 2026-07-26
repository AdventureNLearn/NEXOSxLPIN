import { describe, expect, it } from 'vitest'
import {
  assembleSceneFromPotentials,
  generateCoarseItem,
  optimizeSingleItem,
  sortPotentialsForAssembly,
} from './itemOptimize'
import { reasonScenePotentials } from './objectReasoning'
import type { PotentialObject } from './potentials'
import { evidentiaryToPotential } from './potentials'
import type { EvidentiaryObject } from './objectReasoning'
import { MODEL_DISCLAIMER } from '../../types/core'

function pot(over: Partial<PotentialObject> & { id: string; name: string }): PotentialObject {
  const base: EvidentiaryObject = {
    id: over.id,
    name: over.name,
    role: 'locus',
    description: MODEL_DISCLAIMER,
    assetType: over.assetType ?? 'mf-civic-vehicle-sedan',
    relatedClaimHint: 'x',
    sourceText: 'x',
    score: over.score ?? 0,
    verifiability: over.verifiability ?? 'plausible_unverified',
    importance: over.importance ?? 'supporting',
    importanceScore: over.importanceScore ?? 12,
    reasoning: ['t'],
    flags: [],
    sourceIds: over.sourceIds ?? [],
    curated: false,
  }
  return {
    ...evidentiaryToPotential(base),
    ...over,
    meshFamily: over.meshFamily ?? base.assetType,
    layer: 'rendering',
  }
}

describe('itemOptimize (Dan per-item pipeline)', () => {
  it('sorts refined-supported before open potentials', () => {
    const list = sortPotentialsForAssembly([
      pot({ id: 'a', name: 'open', status: 'potential', score: 0, importanceScore: 20 }),
      pot({
        id: 'b',
        name: 'sup',
        status: 'refined-supported',
        score: 1,
        sourceIds: ['s'],
        verifiability: 'verified_supported',
        importanceScore: 10,
      }),
    ])
    expect(list[0]?.id).toBe('b')
  })

  it('coarse item is single-asset and carries disclaimer', () => {
    const p = pot({ id: 'c1', name: 'Vehicle', status: 'potential' })
    const coarse = generateCoarseItem(p, null)
    expect(coarse.parts.length).toBeGreaterThan(0)
    expect(coarse.optimizeNotes.some((n) => /coarse|Dan/i.test(n))).toBe(true)
    expect(
      coarse.optimizeNotes.some((n) => n.includes('Illustrative') || n.includes(MODEL_DISCLAIMER.slice(0, 20))),
    ).toBe(true)
  })

  it('open potentials skip heavy optimize; refined get optimized stage', () => {
    const open = pot({ id: 'o', name: 'Open', status: 'speculative', score: 0 })
    const refined = pot({
      id: 'r',
      name: 'Ref',
      status: 'refined-supported',
      score: 1,
      sourceIds: ['s'],
      verifiability: 'verified_supported',
    })
    const o1 = optimizeSingleItem(generateCoarseItem(open, null), open)
    const o2 = optimizeSingleItem(generateCoarseItem(refined, null), refined)
    expect(o1.stage).toBe('skipped-open')
    expect(o2.stage).toBe('optimized')
  })

  it('assemble yields one asset per potential (bounded), not a monolith flag', () => {
    const pots = reasonScenePotentials({
      deskId: 'test-dan-assemble',
      claims: [
        {
          plain: 'A person was eating and reading in the plaza near a parked vehicle.',
          status: 'uncertain',
          score: 0,
          why: 'open',
        },
        {
          plain: 'The vehicle curb position is supported by a public photo.',
          status: 'supported',
          score: 1,
          why: 'primary',
          sourceIds: ['photo-1'],
        },
      ],
    })
    const report = assembleSceneFromPotentials(pots, null, { maxItems: 8 })
    expect(report.assets.length).toBe(report.items.length)
    expect(report.assets.length).toBeGreaterThan(0)
    expect(report.assets.length).toBeLessThanOrEqual(8)
    expect(report.methodNote).toMatch(/Per-item|Dan/i)
    expect(report.items.every((i) => i.asset.parts.length > 0)).toBe(true)
    // each asset is independently generated (own id)
    const ids = new Set(report.assets.map((a) => a.id))
    expect(ids.size).toBe(report.assets.length)
  })
})
