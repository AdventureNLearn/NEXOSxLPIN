import { describe, expect, it } from 'vitest'
import { buildTerrainMesh, inferTerrainProfile } from './terrainFromMap'

describe('terrainFromMap', () => {
  it('maps arctic high latitude', () => {
    const p = inferTerrainProfile({ lat: 78.2, lng: 15.6, title: 'Arctic dual-use' })
    expect(p.biome).toBe('arctic')
    expect(p.hasSnow).toBe(true)
  })

  it('maps maritime Red Sea language', () => {
    const p = inferTerrainProfile({
      lat: 15.0,
      lng: 42.0,
      title: 'Red Sea corridor',
      tags: ['maritime', 'ais'],
    })
    expect(p.biome).toBe('maritime')
    expect(p.hasWater).toBe(true)
  })

  it('maps wildfire burn language', () => {
    const p = inferTerrainProfile({
      lat: 44.8,
      lng: -0.6,
      lede: 'Wildfire hectares and firebreak lines',
    })
    expect(p.biome).toBe('wildfire')
    expect(p.hasFireScar).toBe(true)
  })

  it('builds deterministic mesh for same incident', () => {
    const a = buildTerrainMesh({ lat: 52.51, lng: 13.35, deskId: 'trend-01', title: 'Berlin park' })
    const b = buildTerrainMesh({ lat: 52.51, lng: 13.35, deskId: 'trend-01', title: 'Berlin park' })
    expect(a.parts.length).toBe(b.parts.length)
    expect(a.parts[0]?.position).toEqual(b.parts[0]?.position)
    expect(a.parts.some((p) => p.id.startsWith('terrain-'))).toBe(true)
    expect(a.profile.label.length).toBeGreaterThan(3)
  })

  it('park path desks get vegetation and path', () => {
    const t = buildTerrainMesh({
      lat: 52.5145,
      lng: 13.3501,
      deskId: 'trend-01-berlin-csd',
      title: 'Berlin Pride park path',
      tags: ['csd', 'park'],
    })
    expect(t.profile.biome).toBe('park')
    expect(t.parts.some((p) => p.id === 'terrain-path' || p.id.startsWith('terrain-veg'))).toBe(
      true,
    )
  })
})
