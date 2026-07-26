import { describe, expect, it } from 'vitest'
import {
  MESH_FAMILIES,
  MESH_FAMILY_COUNT,
  getMeshFamily,
  selectMeshFamiliesForContext,
} from './meshCatalog'
import { buildFamilyParts } from '../../lib/forge/meshRecipeEngine'

describe('mesh catalog', () => {
  it('has at least 100 unique families with unique ids and names', () => {
    expect(MESH_FAMILY_COUNT).toBeGreaterThanOrEqual(100)
    expect(MESH_FAMILIES.length).toBe(MESH_FAMILY_COUNT)
    const ids = MESH_FAMILIES.map((m) => m.id)
    const names = MESH_FAMILIES.map((m) => m.name.toLowerCase())
    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(names).size).toBe(names.length)
  })

  it('every family builds non-empty geometry', () => {
    for (const f of MESH_FAMILIES) {
      const parts = buildFamilyParts(f, null)
      expect(parts.length).toBeGreaterThan(1)
      // not a single pole: at least 2 non-ground parts OR a non-tower layout
      const solid = parts.filter((p) => p.id !== 'ground' && !p.id.endsWith(':ground'))
      expect(solid.length).toBeGreaterThanOrEqual(2)
    }
  })

  it('selects industry/SME relevant families for semiconductor desk context', () => {
    const picks = selectMeshFamiliesForContext(
      {
        text: 'export control semiconductor foundry wafer capacity',
        industries: ['Semiconductors', 'foundries', 'EDA'],
        smeDomains: ['materials-manufacturing', 'sector-regulatory', 'electrical-electronics'],
      },
      8,
    )
    expect(picks.length).toBeGreaterThan(0)
    expect(
      picks.some(
        (p) =>
          p.id.includes('foundry') ||
          p.id.includes('wafer') ||
          p.id.includes('chip') ||
          p.industries.some((i) => /semi|foundry/i.test(i)),
      ),
    ).toBe(true)
  })

  it('resolves known family by id', () => {
    expect(getMeshFamily('mf-transport-vehicle-sedan')?.layout).toBe('vehicle')
    expect(getMeshFamily('mf-gov-docket-stack')?.layout).toBe('stack')
  })
})
