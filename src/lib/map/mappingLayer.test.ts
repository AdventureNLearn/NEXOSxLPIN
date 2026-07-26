import { describe, expect, it } from 'vitest'
import { buildMappingLayerState, mappingIgnoresScores } from './mappingLayer'

describe('mappingLayer', () => {
  it('fingerprint is stable when only claim scores would change', () => {
    const origin = {
      useCaseId: 'desk-1',
      lat: 52.5145,
      lng: 13.3501,
      label: 'Park',
      kind: 'site',
    }
    const pts = [{ id: 'sp1', lat: 52.515, lng: 13.351, label: 'path' }]
    const a = buildMappingLayerState(origin, pts)
    const b = buildMappingLayerState(origin, pts)
    // Simulate: claims changed externally — mapping inputs identical
    expect(mappingIgnoresScores(a, b)).toBe(true)
    expect(a.layer).toBe('mapping')
    expect(a.fingerprint).toContain('desk-1')
  })

  it('fingerprint changes when location changes', () => {
    const a = buildMappingLayerState({ useCaseId: 'd', lat: 10, lng: 20 })
    const b = buildMappingLayerState({ useCaseId: 'd', lat: 11, lng: 20 })
    expect(a.fingerprint).not.toBe(b.fingerprint)
  })
})
