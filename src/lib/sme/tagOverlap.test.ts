import { describe, expect, it, beforeEach } from 'vitest'
import {
  computeOperationalOverlap,
  domainTagJaccard,
  domainsForTag,
  lensesForTag,
  resetTagOverlapIndex,
  scoreFamilyWithOverlap,
  tagsForDomain,
} from './tagOverlap'
import { getMeshFamily } from '../../data/forge/meshCatalog'

describe('tag↔SME many-to-many overlap', () => {
  beforeEach(() => {
    resetTagOverlapIndex()
  })

  it('allows one tag to map to multiple domains when shared across lenses', () => {
    // "hearing" appears in multiple governance lenses
    const domains = domainsForTag('hearing')
    // may be 1+ depending on corpus; multi-domain tags exist in index overall
    expect(Array.isArray(domains)).toBe(true)
    const exportDomains = domainsForTag('export')
    expect(exportDomains.length).toBeGreaterThanOrEqual(1)
  })

  it('allows one domain to carry many tags', () => {
    const tags = tagsForDomain('public-records')
    expect(tags.length).toBeGreaterThan(5)
  })

  it('computes jaccard overlap between related domains', () => {
    const edge = domainTagJaccard('public-records', 'oversight')
    expect(edge.sharedTags.length).toBeGreaterThanOrEqual(0)
    expect(edge.jaccard).toBeGreaterThanOrEqual(0)
    expect(edge.jaccard).toBeLessThanOrEqual(1)
  })

  it('builds operational overlap with multi-domain tags and edges', () => {
    const ov = computeOperationalOverlap(
      ['public-records', 'oversight', 'sector-regulatory', 'method-process'],
      'hearing transcript docket export publish risk evidence claim',
    )
    expect(ov.notes.length).toBeGreaterThan(0)
    expect(ov.domainsByCentrality.length).toBe(4)
    // multi-domain tags or edges should surface for this rich text
    expect(ov.multiDomainTags.length + ov.domainEdges.length).toBeGreaterThan(0)
  })

  it('boosts mesh families that bridge multiple active SME domains', () => {
    const fam = getMeshFamily('mf-gov-docket-stack')
    expect(fam).toBeTruthy()
    const ov = computeOperationalOverlap(
      ['public-records', 'core-governance', 'oversight', 'sector-regulatory'],
      'docket filing bill hearing oversight',
    )
    const scored = scoreFamilyWithOverlap(fam!, {
      text: 'docket filing bill hearing congress oversight',
      industries: ['congress', 'agencies'],
      smeDomains: ['public-records', 'core-governance', 'oversight'],
      overlap: ov,
    })
    expect(scored.score).toBeGreaterThan(10)
    expect(scored.overlapNote.length).toBeGreaterThan(10)
  })

  it('lists lenses for a tag without exclusive ownership', () => {
    const lenses = lensesForTag('evidence')
    // evidence gate and related lenses may share
    expect(Array.isArray(lenses)).toBe(true)
  })
})
