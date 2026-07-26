/**
 * True map filters from geographic coordinates.
 * Offline-safe: deterministic rules from lat/lng + known basins/coasts.
 * Used by Atlas basemap layers and Massing terrain.
 * Illustrative training aids — not survey-grade.
 */

export type ClimateBand =
  | 'polar'
  | 'subpolar'
  | 'temperate'
  | 'subtropical'
  | 'tropical'
  | 'arid'

export type LandWaterClass =
  | 'open_ocean'
  | 'marginal_sea'
  | 'great_lake'
  | 'coastal'
  | 'island'
  | 'inland'

export type ElevationBand = 'abyssal' | 'lowland' | 'upland' | 'highland' | 'alpine'

export type BasemapId =
  | 'dark'
  | 'light'
  | 'streets'
  | 'satellite'
  | 'terrain'
  | 'ocean'

export interface BasemapDef {
  id: BasemapId
  label: string
  url: string
  attribution: string
  maxZoom: number
  /** When true, labels/roads are weak — good for terrain read */
  imagery: boolean
}

/** Real public tile endpoints (no API key). */
export const BASEMAPS: Record<BasemapId, BasemapDef> = {
  dark: {
    id: 'dark',
    label: 'Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19,
    imagery: false,
  },
  light: {
    id: 'light',
    label: 'Light',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    maxZoom: 19,
    imagery: false,
  },
  streets: {
    id: 'streets',
    label: 'Streets',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap',
    maxZoom: 19,
    imagery: false,
  },
  satellite: {
    id: 'satellite',
    label: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    maxZoom: 18,
    imagery: true,
  },
  terrain: {
    id: 'terrain',
    label: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap, SRTM | OpenTopoMap',
    maxZoom: 17,
    imagery: false,
  },
  ocean: {
    id: 'ocean',
    label: 'Ocean',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    maxZoom: 16,
    imagery: true,
  },
}

/** Named water / land basins with true geographic bounds (approx). */
const REGIONS: Array<{
  id: string
  label: string
  class: LandWaterClass
  latMin: number
  latMax: number
  lngMin: number
  lngMax: number
  elevation?: ElevationBand
  filters: string[]
}> = [
  // Oceans / seas
  { id: 'arctic-ocean', label: 'Arctic Ocean', class: 'open_ocean', latMin: 70, latMax: 90, lngMin: -180, lngMax: 180, elevation: 'abyssal', filters: ['water', 'ice', 'polar'] },
  { id: 'scs', label: 'South China Sea', class: 'marginal_sea', latMin: 0, latMax: 23, lngMin: 105, lngMax: 121, elevation: 'abyssal', filters: ['water', 'maritime', 'shipping'] },
  { id: 'taiwan-strait', label: 'Taiwan Strait', class: 'marginal_sea', latMin: 22, latMax: 26.5, lngMin: 117.5, lngMax: 122, elevation: 'abyssal', filters: ['water', 'strait', 'maritime'] },
  { id: 'red-sea', label: 'Red Sea', class: 'marginal_sea', latMin: 12, latMax: 30, lngMin: 32, lngMax: 44, elevation: 'abyssal', filters: ['water', 'maritime', 'shipping'] },
  { id: 'persian-gulf', label: 'Persian Gulf / Hormuz', class: 'marginal_sea', latMin: 23.5, latMax: 30.5, lngMin: 47, lngMax: 57.5, elevation: 'abyssal', filters: ['water', 'maritime', 'chokepoint'] },
  { id: 'caribbean', label: 'Caribbean Sea', class: 'marginal_sea', latMin: 10, latMax: 23, lngMin: -88, lngMax: -60, elevation: 'abyssal', filters: ['water', 'tropical', 'maritime'] },
  { id: 'mediterranean', label: 'Mediterranean', class: 'marginal_sea', latMin: 30, latMax: 46, lngMin: -6, lngMax: 36.5, elevation: 'abyssal', filters: ['water', 'maritime'] },
  { id: 'black-sea', label: 'Black Sea', class: 'marginal_sea', latMin: 40.5, latMax: 47.5, lngMin: 27, lngMax: 42, elevation: 'abyssal', filters: ['water'] },
  { id: 'baltic', label: 'Baltic Sea', class: 'marginal_sea', latMin: 53.5, latMax: 66, lngMin: 10, lngMax: 30, elevation: 'abyssal', filters: ['water', 'temperate'] },
  { id: 'north-sea', label: 'North Sea', class: 'marginal_sea', latMin: 51, latMax: 62, lngMin: -4, lngMax: 9, elevation: 'abyssal', filters: ['water'] },
  { id: 'barents', label: 'Barents Sea', class: 'open_ocean', latMin: 68, latMax: 80, lngMin: 15, lngMax: 60, elevation: 'abyssal', filters: ['water', 'arctic', 'ice'] },
  { id: 'yellow-sea', label: 'Yellow / East China Sea', class: 'marginal_sea', latMin: 24, latMax: 41, lngMin: 117, lngMax: 130, elevation: 'abyssal', filters: ['water', 'maritime'] },
  { id: 'gulf-mexico', label: 'Gulf of Mexico', class: 'marginal_sea', latMin: 18, latMax: 31, lngMin: -98, lngMax: -80, elevation: 'abyssal', filters: ['water'] },
  { id: 'arabian-sea', label: 'Arabian Sea', class: 'open_ocean', latMin: 5, latMax: 25, lngMin: 50, lngMax: 75, elevation: 'abyssal', filters: ['water'] },
  { id: 'bay-bengal', label: 'Bay of Bengal', class: 'open_ocean', latMin: 5, latMax: 22, lngMin: 80, lngMax: 95, elevation: 'abyssal', filters: ['water'] },
  // Great Lakes
  { id: 'great-lakes', label: 'North American Great Lakes', class: 'great_lake', latMin: 41, latMax: 49.5, lngMin: -93, lngMax: -75, elevation: 'lowland', filters: ['water', 'freshwater', 'industrial'] },
  // African Great Lakes band (minerals corridor context)
  { id: 'african-great-lakes', label: 'African Great Lakes belt', class: 'great_lake', latMin: -12, latMax: 2, lngMin: 28, lngMax: 36, elevation: 'upland', filters: ['water', 'minerals', 'highland'] },
  // Land regions
  { id: 'sahel', label: 'Sahel belt', class: 'inland', latMin: 10, latMax: 18, lngMin: -17, lngMax: 40, elevation: 'lowland', filters: ['arid', 'savanna'] },
  { id: 'sahara', label: 'Sahara', class: 'inland', latMin: 18, latMax: 32, lngMin: -17, lngMax: 35, elevation: 'lowland', filters: ['arid', 'desert'] },
  { id: 'caucasus', label: 'Caucasus highlands', class: 'inland', latMin: 38.5, latMax: 44, lngMin: 40, lngMax: 50, elevation: 'highland', filters: ['mountain', 'corridor'] },
  { id: 'balkans', label: 'Western Balkans', class: 'inland', latMin: 39, latMax: 46.5, lngMin: 13, lngMax: 23, elevation: 'upland', filters: ['mountain', 'temperate'] },
  { id: 'korean-pen', label: 'Korean peninsula seas', class: 'coastal', latMin: 33, latMax: 43, lngMin: 124, lngMax: 132, elevation: 'upland', filters: ['coastal', 'northeast-asia'] },
  { id: 'iberia', label: 'Iberian peninsula', class: 'inland', latMin: 36, latMax: 44, lngMin: -10, lngMax: 4, elevation: 'upland', filters: ['temperate', 'wildfire-prone'] },
  { id: 'central-europe', label: 'Central Europe plain', class: 'inland', latMin: 47, latMax: 55, lngMin: 5, lngMax: 25, elevation: 'lowland', filters: ['temperate', 'urban'] },
  { id: 'alaska-arctic', label: 'Alaska / Bering', class: 'coastal', latMin: 55, latMax: 72, lngMin: -170, lngMax: -140, elevation: 'upland', filters: ['arctic', 'coastal'] },
  { id: 'andaman', label: 'Andaman Sea', class: 'marginal_sea', latMin: 5, latMax: 16, lngMin: 92, lngMax: 100, elevation: 'abyssal', filters: ['water'] },
]

export interface MapFilterChip {
  id: string
  label: string
  kind: 'geo' | 'climate' | 'water' | 'elevation' | 'basemap' | 'incident'
  active: boolean
}

export interface TrueMapFilters {
  lat: number
  lng: number
  climate: ClimateBand
  landWater: LandWaterClass
  elevation: ElevationBand
  regionId: string | null
  regionLabel: string | null
  /** Distance-to-coast proxy 0 = ocean/coast, 1 = deep inland (heuristic) */
  inlandness: number
  /** True filter tags derived from geography */
  tags: string[]
  /** Recommended basemap for this location */
  recommendedBasemap: BasemapId
  /** Chips for UI */
  chips: MapFilterChip[]
  /** Human summary */
  summary: string
  notes: string[]
}

function climateFromLat(lat: number): ClimateBand {
  const a = Math.abs(lat)
  if (a >= 66.5) return 'polar'
  if (a >= 55) return 'subpolar'
  if (a >= 35) return 'temperate'
  if (a >= 23.5) return 'subtropical'
  // Arid belts roughly 15–30 often — refined by region
  if (a >= 15 && a <= 32) return 'arid'
  return 'tropical'
}

function findRegion(lat: number, lng: number) {
  // Prefer smallest matching region (strait over ocean)
  const hits = REGIONS.filter(
    (r) => lat >= r.latMin && lat <= r.latMax && lng >= r.lngMin && lng <= r.lngMax,
  )
  if (!hits.length) return null
  hits.sort(
    (a, b) =>
      (a.latMax - a.latMin) * (a.lngMax - a.lngMin) -
      (b.latMax - b.latMin) * (b.lngMax - b.lngMin),
  )
  return hits[0]!
}

/** Rough inlandness: 0 on water regions, higher inland. */
function inlandnessScore(lat: number, lng: number, lw: LandWaterClass): number {
  if (lw === 'open_ocean' || lw === 'marginal_sea' || lw === 'great_lake') return 0
  if (lw === 'coastal' || lw === 'island') return 0.15
  // Distance from nearest ocean-ish region center
  let best = 1
  for (const r of REGIONS) {
    if (r.class !== 'open_ocean' && r.class !== 'marginal_sea') continue
    const clat = (r.latMin + r.latMax) / 2
    const clng = (r.lngMin + r.lngMax) / 2
    const d = Math.hypot(lat - clat, lng - clng) / 90
    best = Math.min(best, d)
  }
  return Math.min(1, Math.max(0.25, best))
}

function elevationFromGeo(
  lat: number,
  lng: number,
  region: (typeof REGIONS)[0] | null,
  lw: LandWaterClass,
): ElevationBand {
  if (region?.elevation) return region.elevation
  if (lw === 'open_ocean' || lw === 'marginal_sea') return 'abyssal'
  if (lw === 'great_lake') return 'lowland'
  // Simple orography cues
  if (lat > 35 && lat < 50 && lng > 5 && lng < 20) return 'upland' // Alps approach
  if (lat > 25 && lat < 40 && lng > 70 && lng < 100) return 'highland' // Himalaya band
  if (Math.abs(lat) > 60) return 'upland'
  return 'lowland'
}

function recommendBasemap(lw: LandWaterClass, climate: ClimateBand, elev: ElevationBand): BasemapId {
  if (lw === 'open_ocean' || lw === 'marginal_sea') return 'ocean'
  if (lw === 'great_lake') return 'terrain'
  if (elev === 'highland' || elev === 'alpine' || elev === 'upland') return 'terrain'
  if (climate === 'polar' || climate === 'subpolar') return 'terrain'
  if (lw === 'coastal' || lw === 'island') return 'satellite'
  return 'dark'
}

/**
 * Compute true map filters for a coordinate (and optional incident tags).
 */
export function computeTrueMapFilters(
  lat: number,
  lng: number,
  incidentTags: string[] = [],
): TrueMapFilters {
  const notes: string[] = [
    `Geographic filters from ${lat.toFixed(4)}°, ${lng.toFixed(4)}° (offline basin rules).`,
  ]
  const region = findRegion(lat, lng)
  let landWater: LandWaterClass = 'inland'
  let climate = climateFromLat(lat)

  if (region) {
    landWater = region.class
    notes.push(`Matched basin/region: ${region.label}.`)
  } else {
    // Coast heuristic: near major seas without exact hit
    const nearSea = REGIONS.some((r) => {
      if (r.class !== 'marginal_sea' && r.class !== 'open_ocean') return false
      const pad = 2.5
      return (
        lat >= r.latMin - pad &&
        lat <= r.latMax + pad &&
        lng >= r.lngMin - pad &&
        lng <= r.lngMax + pad
      )
    })
    if (nearSea) {
      landWater = 'coastal'
      notes.push('Near known sea basin → coastal class.')
    } else {
      notes.push('No named basin — inland default from lat/lng climate band.')
    }
  }

  // Arid override in Sahara/Sahel
  if (region?.id === 'sahara' || region?.id === 'sahel') climate = 'arid'
  if (Math.abs(lat) < 23.5 && landWater === 'inland' && !region) climate = 'tropical'

  const elevation = elevationFromGeo(lat, lng, region, landWater)
  const inlandness = inlandnessScore(lat, lng, landWater)
  const recommendedBasemap = recommendBasemap(landWater, climate, elevation)

  const tags = new Set<string>([
    `climate:${climate}`,
    `landwater:${landWater}`,
    `elev:${elevation}`,
    ...(region?.filters ?? []),
  ])
  if (inlandness < 0.2) tags.add('littoral')
  if (inlandness > 0.7) tags.add('continental')
  for (const t of incidentTags) {
    if (t) tags.add(t.toLowerCase().slice(0, 48))
  }

  const chips: MapFilterChip[] = [
    {
      id: 'climate',
      label: climate,
      kind: 'climate',
      active: true,
    },
    {
      id: 'landwater',
      label: landWater.replace(/_/g, ' '),
      kind: 'water',
      active: true,
    },
    {
      id: 'elevation',
      label: elevation,
      kind: 'elevation',
      active: true,
    },
    {
      id: 'basemap',
      label: `basemap:${recommendedBasemap}`,
      kind: 'basemap',
      active: true,
    },
  ]
  if (region) {
    chips.unshift({
      id: `region:${region.id}`,
      label: region.label,
      kind: 'geo',
      active: true,
    })
  }
  for (const f of region?.filters ?? []) {
    chips.push({ id: `f:${f}`, label: f, kind: 'geo', active: true })
  }

  const summary = [
    region?.label ?? 'Unnamed cell',
    climate,
    landWater.replace(/_/g, ' '),
    elevation,
  ].join(' · ')

  return {
    lat,
    lng,
    climate,
    landWater,
    elevation,
    regionId: region?.id ?? null,
    regionLabel: region?.label ?? null,
    inlandness,
    tags: [...tags],
    recommendedBasemap,
    chips,
    summary,
    notes,
  }
}

/** Map true geo filters → terrain profile knobs (for Massing). */
export function terrainKnobsFromMapFilters(f: TrueMapFilters): {
  preferWater: boolean
  preferSnow: boolean
  preferDesert: boolean
  preferMountain: boolean
  preferMaritime: boolean
  preferParkUrban: boolean
  relief: number
  sky: string
  ground: string
} {
  const preferWater =
    f.landWater === 'open_ocean' ||
    f.landWater === 'marginal_sea' ||
    f.landWater === 'great_lake' ||
    f.landWater === 'coastal' ||
    f.landWater === 'island'
  const preferSnow = f.climate === 'polar' || f.climate === 'subpolar'
  const preferDesert = f.climate === 'arid' || f.tags.includes('desert') || f.tags.includes('arid')
  const preferMountain =
    f.elevation === 'highland' || f.elevation === 'alpine' || f.elevation === 'upland'
  const preferMaritime =
    f.landWater === 'open_ocean' || f.landWater === 'marginal_sea' || f.tags.includes('maritime')
  const preferParkUrban =
    f.landWater === 'inland' && f.climate === 'temperate' && f.elevation === 'lowland'

  let relief = 0.1
  if (preferMountain) relief = 0.55
  else if (preferDesert) relief = 0.22
  else if (preferSnow) relief = 0.35
  else if (preferWater) relief = 0.12

  let sky = '#070b14'
  let ground = '#334155'
  if (preferSnow) {
    sky = '#0a1628'
    ground = '#c8d6e5'
  } else if (preferMaritime) {
    sky = '#071018'
    ground = '#1c1917'
  } else if (preferDesert) {
    sky = '#1c1410'
    ground = '#a16207'
  } else if (preferMountain) {
    sky = '#0a1018'
    ground = '#3f3f46'
  } else if (f.landWater === 'great_lake') {
    sky = '#0b1220'
    ground = '#365314'
  }

  return {
    preferWater,
    preferSnow,
    preferDesert,
    preferMountain,
    preferMaritime,
    preferParkUrban,
    relief,
    sky,
    ground,
  }
}

export const ALL_BASEMAP_IDS = Object.keys(BASEMAPS) as BasemapId[]
