/**
 * Scale-accurate geographic placement (deck.gl / GIS discipline).
 *
 * Principles (Web Mercator local ENU approximation):
 * - Ground units are **meters** on a local east-north plane at an origin (lng, lat).
 * - Features carry a real-world footprint; they are only **selectable** when map
 *   zoom makes that footprint meaningful on screen.
 * - Selection **auto-scales** (flyTo + target zoom) so the feature fills the frame.
 * - No decorative geometry: if it has no public lat/lng + scale class, it is not drawn.
 *
 * Refs: deck.gl COORDINATE_SYSTEM.METER_OFFSETS + meters units;
 *       Leaflet Circle radius in meters; Web Mercator meters/degree ≈ 111320·cos(φ).
 */

export type ScaleClass =
  | 'region' // city / basin
  | 'corridor' // km-scale route
  | 'site' // block / park
  | 'structure' // building / vessel
  | 'vehicle' // car / truck / small craft
  | 'detail' // human-scale equipment

export interface ScaleClassSpec {
  id: ScaleClass
  /** Minimum Leaflet zoom where feature may be selected */
  minSelectZoom: number
  /** Zoom engaged on select (auto-scale) */
  autoZoom: number
  /** Typical ground footprint diameter (meters) for default markers */
  defaultFootprintM: number
  /** Hide completely below this zoom (still may show as site pin parent) */
  minVisibleZoom: number
  label: string
}

/** Zoom / footprint policy — analyst-friendly (less clunky than ultra-strict CAD zooms). */
export const SCALE_CLASSES: Record<ScaleClass, ScaleClassSpec> = {
  region: {
    id: 'region',
    minSelectZoom: 3,
    autoZoom: 6,
    defaultFootprintM: 40_000,
    minVisibleZoom: 2,
    label: 'Region',
  },
  corridor: {
    id: 'corridor',
    minSelectZoom: 7,
    autoZoom: 11,
    defaultFootprintM: 2_500,
    minVisibleZoom: 5,
    label: 'Corridor',
  },
  site: {
    id: 'site',
    minSelectZoom: 10,
    autoZoom: 14,
    defaultFootprintM: 180,
    minVisibleZoom: 8,
    label: 'Site',
  },
  structure: {
    id: 'structure',
    minSelectZoom: 12,
    autoZoom: 16,
    defaultFootprintM: 45,
    minVisibleZoom: 10,
    label: 'Structure',
  },
  vehicle: {
    id: 'vehicle',
    minSelectZoom: 14,
    autoZoom: 17,
    defaultFootprintM: 6,
    minVisibleZoom: 12,
    label: 'Vehicle',
  },
  detail: {
    id: 'detail',
    minSelectZoom: 15,
    autoZoom: 18,
    defaultFootprintM: 1.5,
    minVisibleZoom: 13,
    label: 'Detail',
  },
}

/** Mean Earth radius (m) — WGS84 approximate for local ENU. */
export const EARTH_R_M = 6_378_137

export function degToRad(d: number): number {
  return (d * Math.PI) / 180
}

/** Meters per degree of latitude (constant ≈). */
export function metersPerDegreeLat(): number {
  return (Math.PI / 180) * EARTH_R_M
}

/** Meters per degree of longitude at latitude φ. */
export function metersPerDegreeLng(latDeg: number): number {
  return metersPerDegreeLat() * Math.cos(degToRad(latDeg))
}

export interface EnuOrigin {
  lat: number
  lng: number
}

/** Local east (x) / north (z) meters from WGS84 origin — deck.gl meter-offsets style. */
export function wgs84ToEnu(
  origin: EnuOrigin,
  lat: number,
  lng: number,
): { eastM: number; northM: number } {
  const dLat = lat - origin.lat
  const dLng = lng - origin.lng
  return {
    eastM: dLng * metersPerDegreeLng(origin.lat),
    northM: dLat * metersPerDegreeLat(),
  }
}

/** Inverse: ENU meters → WGS84. */
export function enuToWgs84(
  origin: EnuOrigin,
  eastM: number,
  northM: number,
): { lat: number; lng: number } {
  return {
    lat: origin.lat + northM / metersPerDegreeLat(),
    lng: origin.lng + eastM / metersPerDegreeLng(origin.lat),
  }
}

/**
 * Approximate ground meters per pixel at zoom z, latitude φ (Web Mercator).
 * Used to decide if a footprint is selectable (covers enough pixels).
 */
export function metersPerPixel(latDeg: number, zoom: number): number {
  const latRad = degToRad(latDeg)
  return (Math.cos(latRad) * 2 * Math.PI * EARTH_R_M) / (256 * Math.pow(2, zoom))
}

/** Screen diameter in px for a footprint at current zoom. */
export function footprintScreenPx(
  footprintM: number,
  latDeg: number,
  zoom: number,
): number {
  const mpp = metersPerPixel(latDeg, zoom)
  if (mpp <= 0) return 0
  return footprintM / mpp
}

/**
 * Selectable only when:
 * 1) zoom ≥ class.minSelectZoom, AND
 * 2) footprint spans ≥ minPx on screen (default 14px) so picking is intentional.
 */
export function isScaleSelectable(
  scale: ScaleClass,
  zoom: number,
  latDeg: number,
  footprintM?: number,
  /** Softer default so site pins stay clickable without frantic zoom thrash */
  minPx = 8,
): boolean {
  const spec = SCALE_CLASSES[scale]
  if (zoom < spec.minSelectZoom) return false
  const fp = footprintM ?? spec.defaultFootprintM
  return footprintScreenPx(fp, latDeg, zoom) >= minPx
}

/** Plain-language coach line when auto-scale engages */
export function autoScalePlain(scale: ScaleClass, featureLabel: string): string {
  const s = SCALE_CLASSES[scale]
  return `Zooming to “${featureLabel}” (${s.label}) so it is large enough to inspect — not a decorative jump.`
}

export function isScaleVisible(scale: ScaleClass, zoom: number): boolean {
  return zoom >= SCALE_CLASSES[scale].minVisibleZoom
}

export function autoZoomForScale(scale: ScaleClass): number {
  return SCALE_CLASSES[scale].autoZoom
}

/** Map mesh layout / kind strings → scale class (real-world only). */
export function scaleClassFromKind(kind: string, familyLayout?: string): ScaleClass {
  const k = `${kind} ${familyLayout ?? ''}`.toLowerCase()
  if (/region|basin|country|theater|province/.test(k)) return 'region'
  if (/corridor|route|shipping|strait|sea lane|ais|firebreak|path.?km/.test(k)) return 'corridor'
  if (/site|park|plaza|campus|yard|port|harbor|harbour|scene|incident/.test(k)) return 'site'
  if (/building|structure|tower|vessel|ship|hangar|bridge|levee|silo|crane/.test(k)) {
    return 'structure'
  }
  if (/vehicle|car|truck|bus|van|ambulance|drone|aircraft|sedan|rail.?car/.test(k)) {
    return 'vehicle'
  }
  if (/gauge|sensor|detail|equipment|console|cabinet|rack|module/.test(k)) return 'detail'
  if (/path|sidewalk|crowd|barrier|cordon|egress/.test(k)) return 'site'
  if (/water|maritime|ocean/.test(k)) return 'corridor'
  return 'site'
}

/** Real footprint meters by mesh layout kind (catalog-aligned). */
export function footprintMetersForLayout(layout: string): number {
  switch (layout) {
    case 'vehicle':
      return 5.2
    case 'path':
    case 'row':
      return 80
    case 'cluster':
      return 25
    case 'barrier':
      return 40
    case 'building':
      return 35
    case 'tower':
      return 12
    case 'vessel':
      return 120
    case 'pad':
    case 'platform':
      return 20
    case 'drone':
      return 3
    case 'locus':
      return 8
    case 'stack':
    case 'console':
    case 'cabinet':
    case 'rack':
      return 2
    case 'canopy':
      return 15
    default:
      return 12
  }
}

/**
 * Target zoom so footprint ≈ targetPx on screen (clamped).
 */
export function zoomForFootprint(
  footprintM: number,
  latDeg: number,
  targetPx = 80,
  minZ = 3,
  maxZ = 20,
): number {
  // footprintPx = footprintM / mpp(z) ; mpp(z) = C / 2^z
  // 2^z = C * targetPx / footprintM
  const C = (Math.cos(degToRad(latDeg)) * 2 * Math.PI * EARTH_R_M) / 256
  if (footprintM <= 0) return minZ
  const z = Math.log2((C * targetPx) / footprintM)
  return Math.min(maxZ, Math.max(minZ, Math.round(z)))
}
