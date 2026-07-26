import { describe, expect, it } from 'vitest'
import {
  autoZoomForScale,
  enuToWgs84,
  footprintScreenPx,
  isScaleSelectable,
  metersPerDegreeLng,
  wgs84ToEnu,
  zoomForFootprint,
} from './geoScale'

describe('geoScale (meter ENU + zoom gates)', () => {
  it('ENU round-trips near origin', () => {
    const o = { lat: 52.5145, lng: 13.3501 }
    const { eastM, northM } = wgs84ToEnu(o, 52.5155, 13.352)
    const back = enuToWgs84(o, eastM, northM)
    expect(Math.abs(back.lat - 52.5155)).toBeLessThan(1e-6)
    expect(Math.abs(back.lng - 13.352)).toBeLessThan(1e-6)
    // ~111 m per 0.001 deg lat
    expect(northM).toBeGreaterThan(100)
    expect(northM).toBeLessThan(120)
  })

  it('longitude meters shrink toward poles', () => {
    expect(metersPerDegreeLng(0)).toBeGreaterThan(metersPerDegreeLng(60))
  })

  it('vehicle not selectable at city zoom', () => {
    expect(isScaleSelectable('vehicle', 12, 52.5, 6)).toBe(false)
    expect(isScaleSelectable('vehicle', 18, 52.5, 6)).toBe(true)
  })

  it('site selectable at neighborhood zoom', () => {
    expect(isScaleSelectable('site', 14, 52.5, 180)).toBe(true)
  })

  it('auto-zoom increases for smaller classes', () => {
    expect(autoZoomForScale('vehicle')).toBeGreaterThan(autoZoomForScale('site'))
    expect(autoZoomForScale('site')).toBeGreaterThan(autoZoomForScale('region'))
  })

  it('footprint screen px grows with zoom', () => {
    const lo = footprintScreenPx(50, 40, 10)
    const hi = footprintScreenPx(50, 40, 16)
    expect(hi).toBeGreaterThan(lo)
  })

  it('zoomForFootprint targets readable size', () => {
    const z = zoomForFootprint(6, 52.5, 80)
    expect(z).toBeGreaterThanOrEqual(16)
  })
})
