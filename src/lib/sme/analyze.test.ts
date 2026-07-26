import { describe, expect, it } from 'vitest'
import type { EvidenceItem } from '../../types/core'
import {
  analyzeWithLens,
  assertAllLensesHaveRules,
  recommendLenses,
} from './analyze'
import { LENS_RULES } from './rules'
import { SME_LENSES, TECHNICAL_SME_LENSES, GOVERNANCE_SME_LENSES } from '../../data/sme/lenses'
import { TECHNICAL_SME_LENSES as TECH_FROM_FILE } from '../../data/sme/technicalLenses'

// re-export path check — GOVERNANCE from lenses, TECH from file
void TECH_FROM_FILE

function ev(partial: Partial<EvidenceItem> & Pick<EvidenceItem, 'id' | 'title' | 'score' | 'material'>): EvidenceItem {
  return {
    summary: partial.summary ?? '',
    confidence: partial.confidence ?? 'medium',
    tags: partial.tags ?? [],
    sourceRefs: partial.sourceRefs ?? [],
    createdAt: partial.createdAt ?? '2026-01-01T00:00:00.000Z',
    ...partial,
  }
}

const fixtureLedger: EvidenceItem[] = [
  ev({
    id: 'e1',
    title: 'Primary permit filing confirms approval',
    summary: 'Official permit pathway approval on record',
    score: 1,
    material: 'primary',
    tags: ['permit', 'approval', 'record'],
  }),
  ev({
    id: 'e2',
    title: 'Assumption of wrongdoing without filing',
    summary: 'Operator assumes misconduct based on rumor',
    score: 1,
    material: 'assumption',
    tags: ['assumption', 'allegation'],
  }),
  ev({
    id: 'e3',
    title: 'Viral social rumor about agency',
    summary: 'TikTok viral rumor with no official confirmation',
    score: 1,
    material: 'secondary',
    tags: ['social', 'rumor', 'viral'],
  }),
  ev({
    id: 'e4',
    title: 'FOIA production incomplete',
    summary: 'Agency withheld pages under exemption claims',
    score: 0,
    material: 'secondary',
    tags: ['foia', 'exemption', 'production'],
  }),
  ev({
    id: 'e5',
    title: 'Export package still contains disqualifying claim',
    summary: 'High-stakes publish risk with unresolved disqualifier on export path',
    score: -1,
    material: 'primary',
    tags: ['export', 'publish', 'harm', 'evidence'],
  }),
  ev({
    id: 'e6',
    title: 'Derived note on budget spend',
    summary: 'Secondary analysis of fiscal expenditure trail',
    score: 1,
    material: 'derived',
    tags: ['budget', 'spend'],
  }),
]

/** WP4: numeric without regime on weak material should demote under thermofluids */
const thermoFixture: EvidenceItem[] = [
  ev({
    id: 't1',
    title: 'Flow is 50 m/s so cooling is always safe',
    summary: 'Claim cites a speed number with no Reynolds or Mach anchors',
    score: 1,
    material: 'assumption',
    tags: ['heat', 'fluid', 'flow'],
  }),
]

const baseCtx = {
  useCaseId: 'test-story',
  useCaseLabel: 'Test investigation',
  evidence: fixtureLedger,
}

describe('assertAllLensesHaveRules', () => {
  it('returns empty array when all 252 lenses are registered', () => {
    expect(assertAllLensesHaveRules()).toEqual([])
    expect(Object.keys(LENS_RULES).length).toBe(SME_LENSES.length)
    expect(SME_LENSES.length).toBe(252)
    expect(GOVERNANCE_SME_LENSES.length).toBe(113)
    expect(TECHNICAL_SME_LENSES.length).toBe(139)
  })
})

describe('analyzeWithLens · specialized rules', () => {
  it('evidence-gate demotes assumption +1', () => {
    const brief = analyzeWithLens('sme-evidence-gate', baseCtx)
    const read = brief.claimReads.find((r) => r.claimId === 'e2')
    expect(read).toBeDefined()
    expect(read!.originalScore).toBe(1)
    expect(read!.smeScore).toBe(0)
    expect(read!.gaps.some((g) => /assumption|primary|evidence gate/i.test(g))).toBe(true)
  })

  it('source-hierarchy demotes social/rumor +1 to 0', () => {
    const brief = analyzeWithLens('sme-source-hierarchy', baseCtx)
    const read = brief.claimReads.find((r) => r.claimId === 'e3')
    expect(read).toBeDefined()
    expect(read!.originalScore).toBe(1)
    expect(read!.smeScore).toBe(0)
    expect(read!.gaps.some((g) => /source hierarchy|social|rumor/i.test(g))).toBe(true)
  })

  it('export-clearance on high-rel −1 yields critical urgency and posture −1', () => {
    const brief = analyzeWithLens('sme-export-clearance', {
      ...baseCtx,
      evidence: [
        ev({
          id: 'neg-export',
          title: 'Unresolved −1 blocks export clearance package',
          summary: 'Export publish harm risk with disqualifying evidence on the claim',
          score: -1,
          material: 'primary',
          tags: ['export', 'publish', 'clearance', 'evidence'],
        }),
      ],
    })
    expect(brief.posture).toBe(-1)
    expect(brief.urgency).toBe('critical')
    const read = brief.claimReads[0]
    expect(read.smeScore).toBe(-1)
    expect(read.confidence).toBeGreaterThanOrEqual(80)
    expect(read.gaps.some((g) => /export clearance|hold/i.test(g))).toBe(true)
  })

  it('overallPosture is −1 when high-relevance −1 present', () => {
    const brief = analyzeWithLens('sme-evidence-gate', {
      ...baseCtx,
      evidence: [
        ev({
          id: 'hi-neg',
          title: 'Material evidence disqualifier on core claim',
          summary: 'Proof claim score fact corroboration fails hard',
          score: -1,
          material: 'primary',
          tags: ['evidence', 'claim', 'proof', 'fact'],
        }),
        ev({
          id: 'ok',
          title: 'Side note',
          summary: 'Peripheral',
          score: 1,
          material: 'primary',
          tags: [],
        }),
      ],
    })
    expect(brief.claimReads.some((r) => r.smeScore === -1 && r.relevance >= 40)).toBe(true)
    expect(brief.posture).toBe(-1)
  })
})

describe('technical lens demotions', () => {
  it('machine-design demotes absolute safety claim without method', () => {
    const brief = analyzeWithLens('sme-mech-machine-design', {
      useCaseId: 'tech-test',
      useCaseLabel: 'Tech fixture',
      evidence: [
        ev({
          id: 't1',
          title: 'Shaft assembly never fails and is guaranteed safe',
          summary: 'Impossible perpetual zero risk claim with no measurement method or safety factor',
          score: 1,
          material: 'assumption',
          tags: ['shaft', 'stress', 'impossible', 'never fails'],
        }),
      ],
    })
    const read = brief.claimReads[0]
    expect(read.originalScore).toBe(1)
    expect(read.smeScore).toBe(0)
    expect(read.gaps.some((g) => /machine design|impossibility|failure mode|safety|method/i.test(g))).toBe(true)
  })

  it('stat-mech demotes rhetoric-only +1 without model assumptions', () => {
    const brief = analyzeWithLens('sme-phys-stat-mech', {
      useCaseId: 'phys-test',
      useCaseLabel: 'Physics fixture',
      evidence: [
        ev({
          id: 't2',
          title: 'Viral motive narrative about entropy always decreasing',
          summary: 'Obviously everyone knows entropy rhetoric with motive and rumor framing',
          score: 1,
          material: 'secondary',
          tags: ['entropy', 'viral', 'motive', 'narrative', 'rumor'],
        }),
      ],
    })
    const read = brief.claimReads[0]
    expect(read.smeScore).toBe(0)
    expect(read.gaps.some((g) => /stat mech|rhetoric|model|impossibility|method/i.test(g))).toBe(true)
  })

  it('structural boosts confidence when primary + measurement tags', () => {
    const brief = analyzeWithLens('sme-civil-structural', {
      useCaseId: 'struct-test',
      useCaseLabel: 'Struct fixture',
      evidence: [
        ev({
          id: 't3',
          title: 'Load path capacity confirmed by structural analysis measurement',
          summary: 'Primary calc package with method measurement and safety factor per code',
          score: 1,
          material: 'primary',
          tags: ['structural', 'load path', 'capacity', 'measurement', 'method', 'safety factor', 'code'],
        }),
      ],
    })
    const read = brief.claimReads[0]
    expect(read.smeScore).toBe(1)
    expect(read.confidence).toBeGreaterThanOrEqual(70)
  })

  it('thermofluids demotes numeric +1 without dimensionless regime on weak material', () => {
    const brief = analyzeWithLens('sme-mech-thermofluids', {
      useCaseId: 'thermo-test',
      useCaseLabel: 'Thermo fixture',
      evidence: thermoFixture,
    })
    const read = brief.claimReads[0]
    expect(read.originalScore).toBe(1)
    expect(read.smeScore).toBe(0)
    expect(
      read.gaps.some((g) => /thermofluids|dimensionless|regime|reynolds|method/i.test(g)),
    ).toBe(true)
  })
})

describe('recommendLenses', () => {
  it('returns at most limit results sorted by score desc', () => {
    const rec = recommendLenses(fixtureLedger, 5)
    expect(rec.length).toBeLessThanOrEqual(5)
    expect(rec.length).toBeGreaterThan(0)
    for (let i = 1; i < rec.length; i++) {
      expect(rec[i - 1].score).toBeGreaterThanOrEqual(rec[i].score)
    }
  })
})

describe('lens rule diversity', () => {
  it('diverse lenses including technical produce different findings or gap signatures', () => {
    const claim: EvidenceItem = ev({
      id: 'same',
      title: 'Viral rumor alleges permit fraud and export risk with impossible perpetual shaft',
      summary: 'Social rumor about permit pathway and publish harm without primary record or measurement method',
      score: 1,
      material: 'assumption',
      tags: ['rumor', 'social', 'permit', 'export', 'viral', 'shaft', 'impossible'],
    })
    const lensIds = [
      'sme-evidence-gate',
      'sme-source-hierarchy',
      'sme-export-clearance',
      'sme-permit-pathway',
      'sme-narrative-integrity',
      'sme-mech-machine-design',
    ]
    const signatures = lensIds.map((id) => {
      const brief = analyzeWithLens(id, {
        useCaseId: 'div',
        useCaseLabel: 'Diversity check',
        evidence: [claim],
      })
      const r = brief.claimReads[0]
      return `${r.finding}||${r.gaps.join('|')}`
    })
    const unique = new Set(signatures)
    expect(unique.size).toBe(lensIds.length)
    expect(lensIds.some((id) => id.startsWith('sme-mech-'))).toBe(true)
  })
})
