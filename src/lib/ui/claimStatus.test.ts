import { describe, expect, it } from 'vitest'
import {
  highestStakesStatus,
  pinColorForScore,
  pinColorForStatus,
  resolveStatusVisual,
  scoreLabel,
  visualFromEvidence,
  visualFromStoryClaim,
} from './claimStatus'

describe('claim status visual system (P0)', () => {
  it('maps tri-state scores to Spec pin colors', () => {
    expect(pinColorForScore(1)).toBe('#22c55e')
    expect(pinColorForScore(0)).toBe('#f59e0b')
    expect(pinColorForScore(-1)).toBe('#f43f5e')
    expect(pinColorForStatus({ kind: 'plausible' })).toBe('#a78bfa')
  })

  it('labels scores without inventing a fourth score', () => {
    expect(scoreLabel({ kind: 'scored', score: 1 })).toBe('+1')
    expect(scoreLabel({ kind: 'scored', score: 0 })).toBe('0')
    expect(scoreLabel({ kind: 'scored', score: -1 })).toBe('−1')
    expect(scoreLabel({ kind: 'plausible' })).toBe('plausible')
  })

  it('picks highest-stakes status for map pins (−1 > 0 > +1)', () => {
    expect(highestStakesStatus([1, 0, -1])).toEqual({ kind: 'scored', score: -1 })
    expect(highestStakesStatus([1, 0])).toEqual({ kind: 'scored', score: 0 })
    expect(highestStakesStatus([1])).toEqual({ kind: 'scored', score: 1 })
    expect(highestStakesStatus([])).toEqual({ kind: 'scored', score: 0 })
  })

  it('marks honesty-rule plausible from tags / assumption hold', () => {
    const a = visualFromEvidence({
      score: 0,
      material: 'assumption',
      tags: [],
      sourceRefs: [],
    })
    expect(a.status).toEqual({ kind: 'plausible' })

    const b = visualFromStoryClaim({
      score: 0,
      tags: ['plausible-unverified'],
    })
    expect(b).toEqual({ kind: 'plausible' })
    expect(resolveStatusVisual(b).key).toBe('plausible')
  })

  it('flags +1 without source as missing primary (not plausible)', () => {
    const v = visualFromEvidence({ score: 1, sourceRefs: [], tags: [] })
    expect(v.status).toEqual({ kind: 'scored', score: 1 })
    expect(v.hasBoundPrimarySource).toBe(false)
  })
})
