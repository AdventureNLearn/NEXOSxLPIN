import { describe, expect, it } from 'vitest'
import { primaryCoachStep, COHERENCE_SPINE } from './analysisCoach'
import type { EvidenceItem } from '../../types/core'

const base = {
  useCasePicked: true,
  deskLabel: 'Test desk',
  evidence: [] as EvidenceItem[],
  sourceCount: 0,
  hasMapPin: true,
  assetCount: 0,
  activeModule: 'atlas' as const,
  layer0Blocked: false,
}

function ev(score: 1 | 0 | -1, id: string): EvidenceItem {
  return {
    id,
    title: id,
    summary: '',
    score,
    confidence: 'medium',
    material: 'secondary',
    tags: [],
    sourceRefs: score === 1 ? ['s1'] : [],
    createdAt: new Date().toISOString(),
  }
}

describe('analysisCoach', () => {
  it('orients when no story picked', () => {
    const s = primaryCoachStep({ ...base, useCasePicked: false })
    expect(s.phase).toBe('orient')
    expect(s.go).toBe('information')
  })

  it('asks to score when board empty', () => {
    const s = primaryCoachStep(base)
    expect(s.phase).toBe('score')
    expect(s.go).toBe('research-hub')
  })

  it('prioritizes open −1 before share', () => {
    const s = primaryCoachStep({
      ...base,
      evidence: [ev(1, 'a'), ev(-1, 'b')],
      sourceCount: 2,
    })
    expect(s.phase).toBe('challenge')
    expect(s.go).toBe('research-hub')
  })

  it('suggests place when claims exist but not on map module', () => {
    const s = primaryCoachStep({
      ...base,
      evidence: [ev(1, 'a'), ev(0, 'b')],
      sourceCount: 1,
      activeModule: 'research-hub',
    })
    expect(s.phase).toBe('place')
    expect(s.go).toBe('atlas')
  })

  it('coherence spine covers all modules once', () => {
    const ids = COHERENCE_SPINE.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toContain('export-kit')
  })
})
