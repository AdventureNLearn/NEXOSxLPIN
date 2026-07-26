import { describe, expect, it } from 'vitest'
import { computeTrueMapFilters, terrainKnobsFromMapFilters, BASEMAPS } from './mapFilters'

describe('true map filters', () => {
  it('classifies Red Sea as marginal sea + ocean basemap', () => {
    const f = computeTrueMapFilters(20.0, 38.5)
    expect(f.landWater).toBe('marginal_sea')
    expect(f.regionId).toBe('red-sea')
    expect(f.recommendedBasemap).toBe('ocean')
    expect(f.tags.some((t) => t.includes('water') || t.includes('maritime'))).toBe(true)
  })

  it('classifies South China Sea basin', () => {
    const f = computeTrueMapFilters(10.72, 115.82)
    expect(f.regionId).toBe('scs')
    expect(f.landWater).toBe('marginal_sea')
  })

  it('classifies Berlin as temperate inland', () => {
    const f = computeTrueMapFilters(52.5145, 13.3501)
    expect(f.climate).toBe('temperate')
    expect(f.landWater === 'inland' || f.regionId === 'central-europe').toBe(true)
  })

  it('classifies arctic high latitude as polar', () => {
    const f = computeTrueMapFilters(78.2, 15.6)
    expect(f.climate).toBe('polar')
    expect(f.landWater === 'open_ocean' || f.tags.includes('polar') || f.tags.includes('ice')).toBe(
      true,
    )
  })

  it('classifies Sahel arid belt', () => {
    const f = computeTrueMapFilters(14.5, 0.0)
    expect(f.regionId).toBe('sahel')
    expect(f.climate).toBe('arid')
    const knobs = terrainKnobsFromMapFilters(f)
    expect(knobs.preferDesert).toBe(true)
  })

  it('exposes real basemap tile URLs', () => {
    expect(BASEMAPS.satellite.url).toMatch(/arcgisonline|tile/i)
    expect(BASEMAPS.terrain.url).toMatch(/opentopomap/)
    expect(BASEMAPS.ocean.url).toMatch(/Ocean/)
  })
})
