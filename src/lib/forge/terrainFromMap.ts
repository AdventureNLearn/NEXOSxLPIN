/**
 * Terrain from true map filters (lat/lng basins + climate) + incident overlays.
 * Geometry is NOT forensic or measured — training stage only.
 */

import type { MeshPartSpec } from '../../types/core'
import {
  computeTrueMapFilters,
  terrainKnobsFromMapFilters,
  type TrueMapFilters,
} from '../map/mapFilters'

export type TerrainBiome =
  | 'urban'
  | 'park'
  | 'coastal'
  | 'maritime'
  | 'desert'
  | 'arctic'
  | 'mountain'
  | 'savanna'
  | 'floodplain'
  | 'wildfire'
  | 'industrial'
  | 'island'

export interface TerrainContext {
  lat: number
  lng: number
  /** map pin / sim kind */
  kind?: string
  cityHint?: string
  deskId?: string
  title?: string
  tags?: string[]
  lede?: string
}

export interface TerrainProfile {
  biome: TerrainBiome
  /** Display label for UI */
  label: string
  /** Sky / canvas background hex */
  sky: string
  ground: string
  accent: string
  hasWater: boolean
  hasVegetation: boolean
  hasUrban: boolean
  hasSnow: boolean
  hasFireScar: boolean
  /** Relative relief 0–1 for hill amplitude */
  relief: number
  notes: string[]
  /** True geographic filters used for this stage */
  mapFilters?: TrueMapFilters
}

export interface TerrainMeshBundle {
  profile: TerrainProfile
  parts: MeshPartSpec[]
  /** Extra camera lift for mountainous scenes */
  cameraLift: number
  mapFilters: TrueMapFilters
}

function hashSeed(lat: number, lng: number, deskId = ''): number {
  const s = `${lat.toFixed(3)}|${lng.toFixed(3)}|${deskId}`
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function rnd(seed: number, i: number): number {
  const x = Math.sin(seed * 0.001 + i * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function blob(ctx: TerrainContext): string {
  return [
    ctx.deskId,
    ctx.kind,
    ctx.cityHint,
    ctx.title,
    ctx.lede,
    ...(ctx.tags ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

/**
 * Infer biome: true map filters (lat/lng basins) first, then incident overlays.
 */
export function inferTerrainProfile(ctx: TerrainContext): TerrainProfile {
  const text = blob(ctx)
  const { lat, lng } = ctx
  const incidentTags = [
    ...(ctx.tags ?? []),
    ctx.kind ?? '',
    ctx.deskId ?? '',
  ].filter(Boolean)
  const mapFilters = computeTrueMapFilters(lat, lng, incidentTags)
  const knobs = terrainKnobsFromMapFilters(mapFilters)
  const notes: string[] = [
    ...mapFilters.notes,
    `True filters: ${mapFilters.summary}`,
  ]

  // —— Incident overlays (refine geography; do not invent fake coords) ——
  if (/fire|wildfire|burn|smoke|hectare|firebreak/.test(text) || mapFilters.tags.includes('wildfire-prone') && /fire|burn/.test(text)) {
    notes.push('Incident overlay: wildfire / burn scar on geographic base.')
    return {
      biome: 'wildfire',
      label: `${mapFilters.regionLabel ?? 'Cell'} · wildfire overlay`,
      sky: '#1a0f0a',
      ground: '#292524',
      accent: '#b45309',
      hasWater: knobs.preferWater && mapFilters.landWater === 'great_lake',
      hasVegetation: true,
      hasUrban: mapFilters.landWater === 'inland',
      hasSnow: false,
      hasFireScar: true,
      relief: Math.max(0.2, knobs.relief * 0.7),
      notes,
      mapFilters,
    }
  }
  if (/flood|levee|river|gauge|inundat/.test(text)) {
    notes.push('Incident overlay: floodplain on geographic base.')
    return {
      biome: 'floodplain',
      label: `${mapFilters.regionLabel ?? 'Cell'} · flood overlay`,
      sky: '#0b1220',
      ground: '#365314',
      accent: '#1d4ed8',
      hasWater: true,
      hasVegetation: true,
      hasUrban: true,
      hasSnow: false,
      hasFireScar: false,
      relief: 0.08,
      notes,
      mapFilters,
    }
  }
  if (/park|pride|csd|parade|tiergarten|crowd|sidewalk|path/.test(text)) {
    notes.push('Incident overlay: civic park path on temperate base.')
    return {
      biome: 'park',
      label: `${mapFilters.regionLabel ?? mapFilters.climate} · civic path`,
      sky: '#0a121c',
      ground: '#14532d',
      accent: '#334155',
      hasWater: false,
      hasVegetation: true,
      hasUrban: true,
      hasSnow: knobs.preferSnow,
      hasFireScar: false,
      relief: 0.06,
      notes,
      mapFilters,
    }
  }
  if (/mine|mineral|coltan|industrial|grid|rail|foundry/.test(text) || mapFilters.tags.includes('minerals') || mapFilters.tags.includes('industrial')) {
    notes.push('Incident/geo: industrial / extractive hardscape.')
    return {
      biome: 'industrial',
      label: `${mapFilters.regionLabel ?? 'Cell'} · industrial`,
      sky: '#0c0f14',
      ground: '#27272a',
      accent: '#71717a',
      hasWater: knobs.preferWater,
      hasVegetation: false,
      hasUrban: true,
      hasSnow: knobs.preferSnow,
      hasFireScar: false,
      relief: 0.1,
      notes,
      mapFilters,
    }
  }

  // —— Pure geography from true map filters ——
  if (knobs.preferSnow || mapFilters.climate === 'polar') {
    notes.push('Geo filter: polar / subpolar → arctic shelf stage.')
    return {
      biome: 'arctic',
      label: mapFilters.regionLabel ?? 'Polar shelf',
      sky: knobs.sky,
      ground: knobs.ground,
      accent: '#94a3b8',
      hasWater: knobs.preferWater,
      hasVegetation: false,
      hasUrban: false,
      hasSnow: true,
      hasFireScar: false,
      relief: knobs.relief,
      notes,
      mapFilters,
    }
  }
  if (knobs.preferMaritime || mapFilters.landWater === 'open_ocean' || mapFilters.landWater === 'marginal_sea') {
    notes.push('Geo filter: open water / marginal sea → maritime stage.')
    return {
      biome: 'maritime',
      label: mapFilters.regionLabel ?? 'Maritime basin',
      sky: knobs.sky,
      ground: knobs.ground,
      accent: '#0e7490',
      hasWater: true,
      hasVegetation: mapFilters.landWater === 'coastal' || mapFilters.climate === 'tropical',
      hasUrban: mapFilters.tags.includes('shipping') || mapFilters.tags.includes('chokepoint'),
      hasSnow: false,
      hasFireScar: false,
      relief: knobs.relief,
      notes,
      mapFilters,
    }
  }
  if (mapFilters.landWater === 'island' || mapFilters.landWater === 'coastal') {
    notes.push('Geo filter: coastal / island littoral.')
    return {
      biome: mapFilters.climate === 'tropical' ? 'island' : 'coastal',
      label: mapFilters.regionLabel ?? (mapFilters.landWater === 'island' ? 'Island littoral' : 'Coastal edge'),
      sky: knobs.sky,
      ground: mapFilters.climate === 'tropical' ? '#854d0e' : '#44403c',
      accent: '#0369a1',
      hasWater: true,
      hasVegetation: true,
      hasUrban: true,
      hasSnow: false,
      hasFireScar: false,
      relief: knobs.relief,
      notes,
      mapFilters,
    }
  }
  if (mapFilters.landWater === 'great_lake') {
    notes.push('Geo filter: great lake freshwater basin.')
    return {
      biome: 'floodplain',
      label: mapFilters.regionLabel ?? 'Great lake basin',
      sky: knobs.sky,
      ground: knobs.ground,
      accent: '#1d4ed8',
      hasWater: true,
      hasVegetation: true,
      hasUrban: true,
      hasSnow: knobs.preferSnow,
      hasFireScar: false,
      relief: 0.1,
      notes,
      mapFilters,
    }
  }
  if (knobs.preferDesert) {
    notes.push('Geo filter: arid climate / desert-sahel belt.')
    return {
      biome: 'desert',
      label: mapFilters.regionLabel ?? 'Arid plain',
      sky: knobs.sky,
      ground: knobs.ground,
      accent: '#ca8a04',
      hasWater: false,
      hasVegetation: true,
      hasUrban: false,
      hasSnow: false,
      hasFireScar: false,
      relief: knobs.relief,
      notes,
      mapFilters,
    }
  }
  if (knobs.preferMountain) {
    notes.push('Geo filter: upland / highland relief.')
    return {
      biome: 'mountain',
      label: mapFilters.regionLabel ?? 'Highland terrain',
      sky: knobs.sky,
      ground: knobs.ground,
      accent: '#64748b',
      hasWater: knobs.preferWater,
      hasVegetation: true,
      hasUrban: true,
      hasSnow: mapFilters.climate === 'subpolar' || mapFilters.elevation === 'alpine',
      hasFireScar: false,
      relief: knobs.relief,
      notes,
      mapFilters,
    }
  }
  if (mapFilters.climate === 'tropical' || mapFilters.climate === 'subtropical') {
    notes.push('Geo filter: tropical / subtropical plain.')
    return {
      biome: 'savanna',
      label: mapFilters.regionLabel ?? 'Tropical / savanna plain',
      sky: '#12100c',
      ground: '#3f6212',
      accent: '#65a30d',
      hasWater: false,
      hasVegetation: true,
      hasUrban: true,
      hasSnow: false,
      hasFireScar: false,
      relief: 0.12,
      notes,
      mapFilters,
    }
  }

  notes.push('Geo filter: temperate urban fabric default.')
  return {
    biome: 'urban',
    label: mapFilters.regionLabel ?? 'Temperate urban fabric',
    sky: knobs.sky,
    ground: knobs.ground,
    accent: '#64748b',
    hasWater: false,
    hasVegetation: true,
    hasUrban: true,
    hasSnow: false,
    hasFireScar: false,
    relief: knobs.relief,
    notes,
    mapFilters,
  }
}

function part(
  id: string,
  name: string,
  primitive: MeshPartSpec['primitive'],
  size: [number, number, number],
  position: [number, number, number],
  color: string,
  rotation: [number, number, number] = [0, 0, 0],
): MeshPartSpec {
  return { id, name, primitive, size, position, rotation, color }
}

/**
 * Build a multi-layer terrain stage sized to the scene.
 * Deterministic from lat/lng/deskId so the same incident always looks the same.
 */
export function buildTerrainMesh(ctx: TerrainContext, stageSize = 28): TerrainMeshBundle {
  const profile = inferTerrainProfile(ctx)
  const mapFilters =
    profile.mapFilters ?? computeTrueMapFilters(ctx.lat, ctx.lng, ctx.tags ?? [])
  const seed = hashSeed(ctx.lat, ctx.lng, ctx.deskId)
  const half = stageSize / 2
  const parts: MeshPartSpec[] = []

  // Base plate
  parts.push(
    part(
      'terrain-base',
      'Terrain base',
      'plane',
      [stageSize * 1.15, 1, stageSize * 1.15],
      [0, 0, 0],
      profile.ground,
      [-Math.PI / 2, 0, 0],
    ),
  )

  // Heightfield tiles (illustrative relief)
  const grid = 7
  const cell = stageSize / grid
  let ti = 0
  for (let ix = 0; ix < grid; ix++) {
    for (let iz = 0; iz < grid; iz++) {
      const u = (ix + 0.5) / grid
      const v = (iz + 0.5) / grid
      // Keep center flatter for path / objects
      const dist = Math.hypot(u - 0.5, v - 0.5)
      const edge = Math.max(0, dist - 0.18)
      const h =
        profile.relief *
        (0.15 + rnd(seed, ti) * 0.85) *
        edge *
        stageSize *
        0.12
      if (h < 0.08) {
        ti++
        continue
      }
      const x = -half + (ix + 0.5) * cell
      const z = -half + (iz + 0.5) * cell
      // Skip water side for maritime (positive Z reserved)
      if (profile.hasWater && z > half * 0.15 && profile.biome !== 'floodplain') {
        ti++
        continue
      }
      parts.push(
        part(
          `terrain-hill-${ti}`,
          'Relief block',
          'box',
          [cell * 0.92, h, cell * 0.92],
          [x, h / 2, z],
          profile.hasSnow
            ? '#e2e8f0'
            : profile.hasFireScar
              ? ix % 2 === 0
                ? '#1c1917'
                : '#292524'
              : profile.biome === 'desert'
                ? '#a16207'
                : profile.ground,
        ),
      )
      ti++
    }
  }

  // Water body
  if (profile.hasWater) {
    const waterZ =
      profile.biome === 'floodplain' ? half * 0.05 : half * 0.42
    const waterH = profile.biome === 'floodplain' ? 0.04 : 0.06
    const waterColor =
      profile.biome === 'arctic'
        ? '#7dd3fc'
        : profile.biome === 'floodplain'
          ? '#1e3a8a'
          : '#0c4a6e'
    parts.push(
      part(
        'terrain-water',
        'Water body',
        'box',
        [
          stageSize * (profile.biome === 'floodplain' ? 0.95 : 0.9),
          waterH,
          stageSize * (profile.biome === 'floodplain' ? 0.55 : 0.42),
        ],
        [0, waterH / 2 - 0.01, waterZ],
        waterColor,
      ),
    )
    // Shore lip
    parts.push(
      part(
        'terrain-shore',
        'Shore',
        'box',
        [stageSize * 0.9, 0.08, 0.6],
        [0, 0.04, waterZ - stageSize * 0.18],
        profile.biome === 'desert' || profile.biome === 'island' ? '#d6d3d1' : '#57534e',
      ),
    )
  }

  // Vegetation clusters
  if (profile.hasVegetation) {
    const n = profile.biome === 'park' ? 14 : profile.biome === 'wildfire' ? 8 : 10
    for (let i = 0; i < n; i++) {
      const x = (rnd(seed, 100 + i) - 0.5) * stageSize * 0.75
      const z = (rnd(seed, 200 + i) - 0.5) * stageSize * 0.55
      if (profile.hasWater && z > half * 0.2) continue
      const burned = profile.hasFireScar && rnd(seed, 300 + i) > 0.45
      const h = 0.4 + rnd(seed, 400 + i) * (burned ? 0.5 : 1.4)
      const r = 0.12 + rnd(seed, 500 + i) * 0.18
      parts.push(
        part(
          `terrain-veg-${i}`,
          burned ? 'Burned stem' : 'Vegetation',
          'cylinder',
          [r, h, r],
          [x, h / 2, z],
          burned ? '#44403c' : profile.biome === 'desert' ? '#4d7c0f' : '#166534',
        ),
      )
      if (!burned && profile.biome !== 'desert') {
        parts.push(
          part(
            `terrain-canopy-${i}`,
            'Canopy',
            'sphere',
            [r * 2.2, r * 2.2, r * 2.2],
            [x, h + r * 0.8, z],
            profile.biome === 'savanna' ? '#65a30d' : '#15803d',
          ),
        )
      }
    }
  }

  // Urban blocks (background massing, illustrative)
  if (profile.hasUrban) {
    const blocks = profile.biome === 'industrial' ? 6 : 5
    for (let i = 0; i < blocks; i++) {
      const x = -half * 0.75 + i * (stageSize / (blocks + 1))
      const z = -half * 0.72
      const h = 1.2 + rnd(seed, 600 + i) * (profile.biome === 'industrial' ? 2.2 : 3.5)
      const w = 1.1 + rnd(seed, 700 + i) * 1.4
      parts.push(
        part(
          `terrain-urban-${i}`,
          'Urban mass',
          'box',
          [w, h, w * 0.85],
          [x, h / 2, z],
          profile.biome === 'industrial' ? '#3f3f46' : '#1e293b',
        ),
      )
    }
    // Road strip
    parts.push(
      part(
        'terrain-road',
        'Access road',
        'box',
        [stageSize * 0.7, 0.03, 1.1],
        [0, 0.02, -half * 0.45],
        '#0f172a',
      ),
    )
  }

  // Path spine tint on ground (civic / park)
  if (profile.biome === 'park' || profile.biome === 'urban') {
    parts.push(
      part(
        'terrain-path',
        'Path corridor',
        'box',
        [stageSize * 0.55, 0.04, 1.6],
        [1.5, 0.02, 0],
        '#475569',
      ),
    )
  }

  // Firebreak scar
  if (profile.hasFireScar) {
    parts.push(
      part(
        'terrain-firebreak',
        'Firebreak',
        'box',
        [stageSize * 0.65, 0.05, 2.2],
        [0, 0.03, 0],
        '#1c1917',
      ),
    )
  }

  // Snow dust patches
  if (profile.hasSnow) {
    for (let i = 0; i < 6; i++) {
      parts.push(
        part(
          `terrain-snow-${i}`,
          'Snow patch',
          'box',
          [2 + rnd(seed, 800 + i) * 3, 0.05, 2 + rnd(seed, 900 + i) * 2],
          [
            (rnd(seed, 810 + i) - 0.5) * stageSize * 0.6,
            0.03,
            (rnd(seed, 910 + i) - 0.5) * stageSize * 0.5,
          ],
          '#f1f5f9',
        ),
      )
    }
  }

  // Desert dunes
  if (profile.biome === 'desert') {
    for (let i = 0; i < 5; i++) {
      const x = (rnd(seed, 1000 + i) - 0.5) * stageSize * 0.7
      const z = (rnd(seed, 1100 + i) - 0.5) * stageSize * 0.5
      const h = 0.4 + rnd(seed, 1200 + i) * 0.9
      parts.push(
        part(
          `terrain-dune-${i}`,
          'Dune',
          'box',
          [3 + rnd(seed, 1300 + i) * 2, h, 1.2],
          [x, h / 2, z],
          '#ca8a04',
        ),
      )
    }
  }

  return {
    profile: { ...profile, mapFilters },
    parts,
    cameraLift: profile.relief > 0.4 ? 2.5 : profile.hasWater ? 1.2 : 0.5,
    mapFilters,
  }
}

/** Convenience: terrain from simulation map pin + story fields. */
export function terrainFromIncident(input: {
  lat: number
  lng: number
  kind?: string
  cityHint?: string
  deskId?: string
  title?: string
  tags?: string[]
  lede?: string
  stageSize?: number
}): TerrainMeshBundle {
  return buildTerrainMesh(
    {
      lat: input.lat,
      lng: input.lng,
      kind: input.kind,
      cityHint: input.cityHint,
      deskId: input.deskId,
      title: input.title,
      tags: input.tags,
      lede: input.lede,
    },
    input.stageSize ?? 28,
  )
}
