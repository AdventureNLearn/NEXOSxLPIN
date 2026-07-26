import { describe, expect, it } from 'vitest'
import { reasonSceneObjects, verifiabilityLabel } from './objectReasoning'

describe('objectReasoning', () => {
  it('extracts vehicle/path objects from claim language with flags', () => {
    const report = reasonSceneObjects({
      deskId: 'test-desk',
      claims: [
        {
          plain: 'A vehicle struck pedestrians on a park path near the parade.',
          status: 'supported',
          score: 1,
          why: 'Primary reporting agrees on single scene.',
          sourceIds: ['src-1'],
        },
        {
          plain: 'Viral social posts claim a second attack site downtown.',
          status: 'disputed',
          score: -1,
          why: 'Conflicts with main reporting.',
        },
      ],
      evidence: [],
    })
    expect(report.objects.length).toBeGreaterThan(0)
    expect(
      report.objects.some(
        (o) =>
          o.assetType.includes('vehicle') ||
          o.name.toLowerCase().includes('vehicle') ||
          o.name.toLowerCase().includes('sedan'),
      ),
    ).toBe(true)
    expect(
      report.objects.some(
        (o) =>
          o.assetType.includes('path') ||
          o.assetType.includes('crowd') ||
          /path|crowd/i.test(o.name),
      ),
    ).toBe(true)
    // Must not default everything to a lone mast
    const nonMast = report.objects.filter((o) => !o.assetType.includes('mast'))
    expect(nonMast.length).toBeGreaterThan(0)
    const disputed = report.objects.filter(
      (o) => o.verifiability === 'disputed_unverifiable' || o.score === -1,
    )
    expect(disputed.length).toBeGreaterThan(0)
  })

  it('marks +1 without sources as plausible_unverified', () => {
    const report = reasonSceneObjects({
      deskId: 'test-unsourced',
      claims: [
        {
          plain: 'Sensor mast observes the perimeter near the facility gate.',
          status: 'supported',
          score: 1,
          why: 'Asserted without source bind.',
          sourceIds: [],
        },
      ],
    })
    const hit = report.objects.find((o) => o.score === 1)
    expect(hit).toBeTruthy()
    if (hit && !hit.sourceIds.length) {
      expect(
        hit.verifiability === 'plausible_unverified' || hit.flags.includes('PLAUSIBLE_UNVERIFIED'),
      ).toBe(true)
    }
  })

  it('builds congress fallback objects', () => {
    const report = reasonSceneObjects({ deskId: 'cong-41-ai-chip-export', claims: [], evidence: [] })
    expect(report.objects.length).toBeGreaterThanOrEqual(2)
    expect(report.summary.length).toBeGreaterThan(10)
    expect(verifiabilityLabel('plausible_unverified')).toMatch(/Plausible/i)
  })
})
