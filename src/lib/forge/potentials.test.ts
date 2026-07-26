import { describe, expect, it } from 'vitest'
import {
  buildPotentialSet,
  derivePotentialStatus,
  expandActivityPotentials,
  isGhostPotential,
  evidentiaryToPotential,
} from './potentials'
import { reasonSceneObjects, reasonScenePotentials } from './objectReasoning'
import type { EvidentiaryObject } from './objectReasoning'

const baseObj = (over: Partial<EvidentiaryObject> = {}): EvidentiaryObject => ({
  id: 'obj-1',
  name: 'Test vehicle',
  role: 'locus',
  description: 'Illustrative geometry only — not a certified survey.',
  assetType: 'mf-civic-vehicle-sedan',
  relatedClaimHint: 'vehicle',
  sourceText: 'A vehicle on the path',
  score: 0,
  verifiability: 'plausible_unverified',
  importance: 'supporting',
  importanceScore: 12,
  reasoning: ['test'],
  flags: [],
  sourceIds: [],
  curated: false,
  ...over,
})

describe('potentials system', () => {
  it('starts ledger objects as potential/speculative until refined', () => {
    expect(derivePotentialStatus(baseObj({ score: 0 }))).toBe('potential')
    expect(
      derivePotentialStatus(
        baseObj({ score: 1, sourceIds: ['s1'], verifiability: 'verified_supported' }),
      ),
    ).toBe('refined-supported')
    expect(derivePotentialStatus(baseObj({ score: -1, verifiability: 'disputed_unverifiable' }))).toBe(
      'refined-disputed',
    )
    expect(derivePotentialStatus(baseObj({ score: 1, sourceIds: [] }))).toBe('speculative')
  })

  it('ghost materials only for open potentials', () => {
    expect(isGhostPotential('potential')).toBe(true)
    expect(isGhostPotential('speculative')).toBe(true)
    expect(isGhostPotential('refined-supported')).toBe(false)
    expect(isGhostPotential('refined-disputed')).toBe(false)
  })

  it('expands eating+reading into parallel open potentials', () => {
    const text =
      'A person in the plaza was eating lunch and reading a book on their phone near the path.'
    const base = [evidentiaryToPotential(baseObj())]
    const expanded = expandActivityPotentials(base, text, 'desk-eat-read')
    expect(expanded.length).toBeGreaterThan(base.length)
    expect(expanded.some((p) => /eating|reading|activity/i.test(p.name + p.flags.join()))).toBe(
      true,
    )
    expect(expanded.every((p) => p.layer === 'rendering')).toBe(true)
    expect(expanded.some((p) => p.status === 'potential' || p.status === 'speculative')).toBe(true)
  })

  it('buildPotentialSet keeps curated/refined and disclaimer language', () => {
    const set = buildPotentialSet(
      [
        baseObj({
          score: 1,
          sourceIds: ['a'],
          verifiability: 'verified_supported',
          curated: true,
          description: 'Illustrative geometry only — not a certified survey.',
        }),
      ],
      'someone was reading',
      'desk-x',
    )
    expect(set[0]?.status).toBe('refined-supported')
    expect(set.some((p) => p.reasoningBullets.some((b) => /illustrative|not.*forensic/i.test(b)))).toBe(
      true,
    )
  })

  it('reasonScenePotentials end-to-end eating+reading scenario', () => {
    const pots = reasonScenePotentials({
      deskId: 'test-eat-read',
      claims: [
        {
          plain: 'A person was sitting in the public plaza eating and reading near the path.',
          status: 'uncertain',
          score: 0,
          why: 'Open story detail',
        },
        {
          plain: 'A vehicle was parked along the curb.',
          status: 'supported',
          score: 1,
          why: 'Primary photo',
          sourceIds: ['src-photo'],
        },
      ],
      evidence: [],
    })
    expect(pots.length).toBeGreaterThan(0)
    expect(pots.every((p) => p.layer === 'rendering')).toBe(true)
    const open = pots.filter((p) => p.status === 'potential' || p.status === 'speculative')
    expect(open.length).toBeGreaterThan(0)
  })

  it('existing objectReasoning still produces score-driven objects', () => {
    const report = reasonSceneObjects({
      deskId: 'test-desk',
      claims: [
        {
          plain: 'A vehicle struck pedestrians on a park path.',
          status: 'supported',
          score: 1,
          why: 'Primary',
          sourceIds: ['s1'],
        },
      ],
    })
    expect(report.objects.length).toBeGreaterThan(0)
  })
})
