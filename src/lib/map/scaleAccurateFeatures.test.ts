import { describe, expect, it } from 'vitest'
import { buildScaleAccurateFeatures } from './scaleAccurateFeatures'

describe('scaleAccurateFeatures', () => {
  it('places origin and scene points on real WGS84', () => {
    const feats = buildScaleAccurateFeatures({
      origin: {
        useCaseId: 'trend-01',
        label: 'Berlin CSD',
        shortLabel: 'Berlin',
        lat: 52.5145,
        lng: 13.3501,
        kind: 'scene',
        cityHint: 'Tiergarten',
      },
      scenePoints: [
        {
          id: 'p1',
          label: 'Path',
          lat: 52.5145,
          lng: 13.3501,
          kind: 'scene',
          score: 1,
        },
        {
          id: 'p2',
          label: 'Egress',
          lat: 52.525,
          lng: 13.369,
          kind: 'egress',
          score: 1,
        },
      ],
    })
    expect(feats.some((f) => f.id.startsWith('pin:'))).toBe(true)
    expect(feats.filter((f) => f.id.startsWith('sp:')).length).toBe(2)
    const path = feats.find((f) => f.id === 'sp:p1')
    expect(path?.lat).toBeCloseTo(52.5145, 4)
    expect(path?.mapLinks.some((l) => l.url.includes('openstreetmap'))).toBe(true)
    // No decorative zero-footprint junk
    expect(feats.every((f) => f.footprintM > 0)).toBe(true)
  })
})
