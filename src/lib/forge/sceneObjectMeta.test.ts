import { describe, expect, it } from 'vitest'
import { buildSceneObjectMeta } from './sceneObjectMeta'
import type { ProceduralAsset } from '../../types/core'

function stubAsset(partial: Partial<ProceduralAsset> = {}): ProceduralAsset {
  return {
    id: 'asset-1',
    name: 'Path vehicle',
    assetType: 'mf-transport-vehicle-sedan',
    description: 'Illustrative vehicle on path',
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    conditionsSnapshot: null,
    parts: [],
    animation: { deployProgress: 0, drivers: [] },
    optimizeNotes: [],
    unityCSharp: '',
    threeTsx: '',
    score: 1,
    verifiability: 'verified_supported',
    reasoning: ['Primary reporting places a vehicle on the path.'],
    flags: ['PRIMARY_LINKED'],
    relatedClaimHint: 'Vehicle entered the path',
    sourceIds: ['src-a'],
    importance: 'critical',
    ...partial,
  }
}

describe('sceneObjectMeta', () => {
  it('builds what/notes/SME topics for hover', () => {
    const meta = buildSceneObjectMeta({
      asset: stubAsset(),
      slot: 'on_axis',
      activeSources: [
        {
          id: 'src-a',
          title: 'Police bulletin',
          url: 'https://example.com/police',
          kind: 'official',
          why: 'Primary',
          publisher: 'Police',
        },
      ],
    })
    expect(meta.name).toMatch(/vehicle|Path/i)
    expect(meta.notes.length).toBeGreaterThan(0)
    expect(meta.links.some((l) => l.kind === 'source' && l.url)).toBe(true)
    expect(meta.slot).toBe('on_axis')
  })

  it('attaches SME topic links without export', () => {
    const meta = buildSceneObjectMeta({ asset: stubAsset() })
    expect(meta.links.some((l) => l.kind === 'sme' || l.kind === 'preferred')).toBe(true)
    expect(meta.links.every((l) => l.kind !== ('export' as string))).toBe(true)
  })
})
