import { describe, expect, it } from 'vitest'
import {
  INVESTIGATION_LAYERS,
  defaultLayerVisibility,
  explainLayersForHumans,
  groundingPlain,
  HIERARCHY_LABELS,
} from './investigationLayers'

describe('investigationLayers', () => {
  it('has five plain-language layers outer→inner', () => {
    expect(INVESTIGATION_LAYERS).toHaveLength(5)
    expect(INVESTIGATION_LAYERS[0].id).toBe('place')
    expect(INVESTIGATION_LAYERS.map((l) => l.ring)).toEqual([0, 1, 2, 3, 4])
  })

  it('default visibility turns core layers on', () => {
    const v = defaultLayerVisibility()
    expect(v.place).toBe(true)
    expect(v.claims).toBe(true)
    expect(v.models).toBe(true)
  })

  it('explains layers without developer jargon wall', () => {
    const s = explainLayersForHumans()
    expect(s.toLowerCase()).toContain('map')
    expect(s.toLowerCase()).toContain('claim')
    expect(s).not.toMatch(/WGS84|ENU|ISA-95/)
  })

  it('grounding triad covers perception → record → score', () => {
    expect(groundingPlain('perception')).toMatch(/claim/i)
    expect(groundingPlain('record')).toMatch(/document|map|instrument/i)
    expect(groundingPlain('score')).toMatch(/\+1|Supported/)
  })

  it('hierarchy bands stay plain', () => {
    expect(HIERARCHY_LABELS.site.label).toBe('This place')
    expect(HIERARCHY_LABELS.object.plain.toLowerCase()).toContain('sketch')
  })
})
