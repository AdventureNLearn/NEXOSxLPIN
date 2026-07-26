import { describe, expect, it } from 'vitest'
import { USE_CASE_CATALOG, groupUseCasesByFamily, FAMILY_LABELS } from './catalog'
import {
  CORPUS_SEEDS,
  CORPUS_PROFILES,
  CORPUS_SIMS,
  CORPUS_STORIES,
  catalogueByTopic,
} from './storyCorpus100'
import { listSimulations, allInvestigationPins } from './simulations'

describe('100-story corpus', () => {
  it('has exactly 100 use-case profiles', () => {
    expect(USE_CASE_CATALOG.length).toBe(100)
  })

  it('adds 33 corpus desks including 10 geopolitical', () => {
    expect(CORPUS_SEEDS.length).toBe(33)
    expect(CORPUS_PROFILES.length).toBe(33)
    expect(CORPUS_SIMS.length).toBe(33)
    expect(Object.keys(CORPUS_STORIES).length).toBe(33)
    const geo = CORPUS_SEEDS.filter((s) => s.topic === 'geopolitical')
    expect(geo.length).toBe(10)
    expect(geo.every((s) => s.lede.length > 120)).toBe(true)
    expect(geo.every((s) => s.claims.length >= 3)).toBe(true)
  })

  it('keeps category tops (gen + 10 trends + congress)', () => {
    const ids = new Set(USE_CASE_CATALOG.map((p) => p.id))
    expect(ids.has('gen-explore')).toBe(true)
    expect(ids.has('trend-01-berlin-csd')).toBe(true)
    expect(ids.has('trend-10-clip-authenticity')).toBe(true)
    expect(ids.has('cong-01-ai-frontier')).toBe(true)
    expect(ids.has('geo-01-scs-collision')).toBe(true)
    expect(ids.has('top-23-open-weights-export')).toBe(true)
  })

  it('catalogues corpus by topic/subtopic', () => {
    const cat = catalogueByTopic()
    expect(Object.keys(cat).length).toBeGreaterThanOrEqual(5)
    expect(cat.geopolitical?.length).toBeGreaterThan(0)
    const allIds = Object.values(cat).flatMap((subs) => subs.flatMap((s) => s.ids))
    expect(allIds.length).toBe(33)
  })

  it('has simulations and map pins for corpus desks', () => {
    const sims = listSimulations()
    expect(sims.length).toBeGreaterThanOrEqual(100 - 1) // gen-explore may lack sim
    const pins = allInvestigationPins()
    expect(pins.some((p) => p.useCaseId === 'geo-03-red-sea-shipping')).toBe(true)
    expect(pins.some((p) => p.useCaseId === 'top-11-heat-dome')).toBe(true)
  })

  it('exposes family labels for new topics', () => {
    const groups = groupUseCasesByFamily()
    expect(groups.geopolitical?.length).toBe(10)
    expect(FAMILY_LABELS.geopolitical).toMatch(/Geopolitical/i)
  })
})
