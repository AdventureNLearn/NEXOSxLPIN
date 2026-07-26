/**
 * Smoke: 180 lenses, rules registry, gov+tech analyze, 40 cong desks.
 */
import { describe, expect, it } from 'vitest'
import { SME_LENSES, GOVERNANCE_SME_LENSES, TECHNICAL_SME_LENSES } from '../../data/sme/lenses'
import { assertAllLensesHaveRules } from './rules'
import { analyzeWithLens } from './analyze'
import { CONGRESS_DESK_IDS } from '../../data/useCases/congressDesks'
import { USE_CASE_CATALOG, congressionalDesks } from '../../data/useCases/catalog'
import { getSimulation } from '../../data/useCases/simulations'
import { getStory } from '../../data/useCases/stories'
import { getActiveSourcesForDesk } from '../../data/useCases/activeSources'
import type { EvidenceItem } from '../../types/core'

const fixture: EvidenceItem[] = [
  {
    id: 'sm1',
    title: 'Primary permit filing confirms approval with measurement method',
    summary: 'Official permit pathway and measurement method on record',
    score: 1,
    confidence: 'high',
    material: 'primary',
    tags: ['permit', 'measurement', 'method', 'record'],
    sourceRefs: ['smoke'],
    createdAt: '2026-07-25T00:00:00.000Z',
  },
  {
    id: 'sm2',
    title: 'Viral motive rumor about impossible perpetual shaft safety',
    summary: 'Social rumor claiming never fails guaranteed safe without method',
    score: 1,
    confidence: 'low',
    material: 'assumption',
    tags: ['viral', 'rumor', 'motive', 'impossible', 'shaft', 'social'],
    sourceRefs: [],
    createdAt: '2026-07-25T00:00:00.000Z',
  },
]

/** Exact +40% domain targets for 1.4.0 */
const DOMAIN_TARGETS: Record<string, number> = {
  'core-governance': 20,
  'public-records': 20,
  jurisdiction: 20,
  oversight: 20,
  'sector-regulatory': 22,
  'method-process': 11,
  'mechanical-engineering': 17,
  'civil-structural': 11,
  'electrical-electronics': 14,
  'chemical-process': 8,
  'aerospace-defense-tech': 8,
  'materials-manufacturing': 11,
  'energy-nuclear': 8,
  'biomedical-systems': 8,
  'computing-cyberphysical': 14,
  'mathematics-statistics': 20,
  'theoretical-physics': 14,
  'applied-physical-sciences': 6,
}

describe('smoke · SME 252 + congress 56', () => {
  it('loads exactly 252 lenses (113 + 139)', () => {
    expect(GOVERNANCE_SME_LENSES.length).toBe(113)
    expect(TECHNICAL_SME_LENSES.length).toBe(139)
    expect(SME_LENSES.length).toBe(252)
  })

  it('matches exact per-domain double targets and unique ids/shorts', () => {
    const byDomain: Record<string, number> = {}
    const ids = new Set<string>()
    const shortKeys = new Set<string>()
    for (const l of SME_LENSES) {
      byDomain[l.domain] = (byDomain[l.domain] ?? 0) + 1
      expect(ids.has(l.id)).toBe(false)
      ids.add(l.id)
      const sk = `${l.domain}::${l.short.toLowerCase()}`
      expect(shortKeys.has(sk)).toBe(false)
      shortKeys.add(sk)
    }
    for (const [d, n] of Object.entries(DOMAIN_TARGETS)) {
      expect(byDomain[d], d).toBe(n)
    }
  })

  it('assertAllLensesHaveRules is empty', () => {
    expect(assertAllLensesHaveRules()).toEqual([])
  })

  it('analyzes core + expansion lenses on fixture', () => {
    const gov = analyzeWithLens('sme-evidence-gate', {
      useCaseId: 'smoke',
      useCaseLabel: 'Smoke',
      evidence: fixture,
    })
    expect(gov.lensId).toBe('sme-evidence-gate')
    expect(gov.claimReads.length).toBe(2)

    const tech = analyzeWithLens('sme-mech-machine-design', {
      useCaseId: 'smoke',
      useCaseLabel: 'Smoke',
      evidence: fixture,
    })
    expect(tech.lensId).toBe('sme-mech-machine-design')
    const bad = tech.claimReads.find((r) => r.claimId === 'sm2')
    expect(bad?.smeScore).toBe(0)

    const exp = analyzeWithLens('sme-claim-chain-of-custody', {
      useCaseId: 'smoke',
      useCaseLabel: 'Smoke',
      evidence: fixture,
    })
    expect(exp.lensId).toBe('sme-claim-chain-of-custody')
    expect(exp.claimReads.length).toBe(2)
  })

  it('loads all 56 congressional desk ids from catalog', () => {
    expect(CONGRESS_DESK_IDS.length).toBe(56)
    expect(congressionalDesks().length).toBe(56)
    for (const id of CONGRESS_DESK_IDS) {
      const p = USE_CASE_CATALOG.find((x) => x.id === id)
      expect(p, id).toBeDefined()
      expect(p!.family).toBe('congressional')
      expect(p!.report).toBeDefined()
      expect(p!.report!.claims.length).toBeGreaterThanOrEqual(5)
      expect(p!.report!.timeline.length).toBeGreaterThanOrEqual(4)
      expect(p!.report!.openQuestions.length).toBeGreaterThanOrEqual(4)
      expect(p!.report!.verificationPlaybook.length).toBeGreaterThanOrEqual(4)
      expect(p!.report!.sourcesToSeek.length).toBeGreaterThanOrEqual(4)
      expect(p!.report!.noiseRisks.length).toBeGreaterThanOrEqual(3)
      expect(p!.defaultOpen).toContain('sme-lenses')
      expect(getSimulation(id), `sim ${id}`).toBeDefined()
      expect(getStory(id), `story ${id}`).toBeDefined()
      expect(getActiveSourcesForDesk(id).length).toBeGreaterThanOrEqual(4)
    }
  })
})
