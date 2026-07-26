import { describe, expect, it } from 'vitest'
import { planStoryScene, estimateRadius, cameraForBounds } from './spatialSceneLayout'
import { buildFamilyParts } from './meshRecipeEngine'

describe('spatial story layout', () => {
  it('places path, vehicle, and crowd in relational slots not a single row', () => {
    const path = buildFamilyParts('mf-civic-path-strip', null)
    const veh = buildFamilyParts('mf-transport-vehicle-sedan', null)
    const crowd = buildFamilyParts('mf-civic-crowd-plaza', null)
    const bldg = buildFamilyParts('mf-health-hospital-wing', null)
    const docket = buildFamilyParts('mf-gov-docket-stack', null)

    const plan = planStoryScene([
      { id: 'a', familyId: 'mf-civic-path-strip', parts: path },
      { id: 'b', familyId: 'mf-transport-vehicle-sedan', parts: veh },
      { id: 'c', familyId: 'mf-civic-crowd-plaza', parts: crowd },
      { id: 'd', familyId: 'mf-health-hospital-wing', parts: bldg },
      { id: 'e', familyId: 'mf-gov-docket-stack', parts: docket },
    ])

    expect(plan.placements.length).toBe(5)
    const slots = Object.fromEntries(plan.placements.map((p) => [p.id, p.slot]))
    expect(slots.a).toBe('axis')
    expect(slots.b).toBe('on_axis')
    expect(slots.c).toBe('flank_near')
    expect(slots.d).toBe('anchor')
    expect(slots.e).toBe('process')

    // Vehicle should sit near path origin, not far to the side only
    const vehP = plan.placements.find((p) => p.id === 'b')!
    const pathP = plan.placements.find((p) => p.id === 'a')!
    expect(Math.abs(vehP.origin[2] - pathP.origin[2])).toBeLessThan(2.5)

    // Building further in −Z than path
    const bldgP = plan.placements.find((p) => p.id === 'd')!
    expect(bldgP.origin[2]).toBeLessThan(pathP.origin[2] - 2)

    // Process zone further +X
    const docP = plan.placements.find((p) => p.id === 'e')!
    expect(docP.origin[0]).toBeGreaterThan(pathP.origin[0] + 3)

    expect(plan.parts.length).toBeGreaterThan(10)
    expect(plan.notes.length).toBeGreaterThan(0)
    expect(plan.relations.length).toBeGreaterThan(0)

    const cam = cameraForBounds(plan.bounds)
    expect(cam.position[1]).toBeGreaterThan(2)
  })

  it('estimates finite radius from parts', () => {
    const parts = buildFamilyParts('mf-transport-vehicle-truck', null)
    const r = estimateRadius(parts)
    expect(r).toBeGreaterThan(0.5)
    expect(r).toBeLessThan(8)
  })
})
