/**
 * Relational spatial layout for multi-object story scenes.
 * Places mesh families so they read as one coherent stage
 * (path axis, on-path actors, crowd flanks, far anchors, process zone, water).
 */

import type { MeshPartSpec } from '../../types/core'
import type { MeshFamily, MeshLayoutKind, DepthLayer } from '../../data/forge/meshCatalog'
import { getMeshFamily, resolveMeshFamilyId } from '../../data/forge/meshCatalog'

export type SpatialSlot =
  | 'axis' // path / corridor / firebreak — scene spine
  | 'on_axis' // vehicle, locus on the path
  | 'flank_near' // crowd beside spine
  | 'flank_far' // barrier / standoff
  | 'anchor' // building / tower / hangar (background mass)
  | 'water' // vessel
  | 'process' // docket, console, cabinet (operator zone)
  | 'aerial' // drone slightly elevated staging
  | 'support' // racks, modules, general

export interface SceneLayoutItem {
  id: string
  familyId: string
  parts: MeshPartSpec[]
  depth?: DepthLayer | string
  /** Optional claim importance for ordering */
  importance?: string
  score?: number
}

export interface PlacedItem {
  id: string
  familyId: string
  slot: SpatialSlot
  /** World translation applied to family local parts */
  origin: [number, number, number]
  /** Yaw radians around Y */
  yaw: number
  /** Approximate footprint radius for packing */
  radius: number
  label: string
}

export interface SpatialScenePlan {
  placements: PlacedItem[]
  /** Combined mesh parts (no per-family grounds) */
  parts: MeshPartSpec[]
  /** Scene bounds for camera framing */
  bounds: { minX: number; maxX: number; minZ: number; maxZ: number; center: [number, number, number] }
  /** Human-readable layout notes */
  notes: string[]
  relations: Array<{ from: string; to: string; kind: string }>
  /** Optional terrain sky for MassingCanvas */
  sky?: string
  cameraLift?: number
  terrainLabel?: string
}

export interface PlanStorySceneOptions {
  /** Replace flat ground with map-conditioned terrain parts */
  terrainParts?: MeshPartSpec[]
  sky?: string
  cameraLift?: number
  terrainLabel?: string
  terrainNotes?: string[]
}

function layoutToSlot(layout: MeshLayoutKind): SpatialSlot {
  switch (layout) {
    case 'path':
    case 'row':
      return 'axis'
    case 'vehicle':
    case 'locus':
      return 'on_axis'
    case 'cluster':
      return 'flank_near'
    case 'barrier':
      return 'flank_far'
    case 'building':
    case 'tower':
    case 'lattice':
    case 'silo':
    case 'crane':
    case 'array':
    case 'arch':
      return 'anchor'
    case 'vessel':
    case 'tank':
      return 'water'
    case 'stack':
    case 'console':
    case 'cabinet':
    case 'rack':
      return 'process'
    case 'drone':
    case 'pad':
    case 'platform':
    case 'canopy':
      return 'aerial'
    case 'pipe':
    case 'frame':
    case 'gantry':
    case 'module':
    case 'hull_armor':
    case 'debris':
    case 'radial':
    default:
      return 'support'
  }
}

/** Rough footprint from local parts (ignore ground planes) */
export function estimateRadius(parts: MeshPartSpec[]): number {
  let max = 1.2
  for (const p of parts) {
    if (p.primitive === 'plane' || p.id === 'ground' || p.id.endsWith(':ground')) continue
    const hx = Math.abs(p.position[0]) + Math.max(p.size[0], p.size[2]) * 0.55
    const hz = Math.abs(p.position[2]) + Math.max(p.size[0], p.size[2]) * 0.55
    max = Math.max(max, hx, hz, Math.hypot(p.position[0], p.position[2]) + 0.8)
  }
  return Math.min(max, 6)
}

function familyOf(item: SceneLayoutItem): MeshFamily | undefined {
  return getMeshFamily(resolveMeshFamilyId(item.familyId))
}

/**
 * Assign slot + origin for each item so the scene reads as one stage.
 *
 * Coordinate system (story stage):
 *   +X  → along the path / operational axis
 *   −Z  → “far” anchors (buildings, towers)
 *   +Z  → water / open side
 *   near origin → incident / on-path actors
 *   +X far      → process / records zone
 */
export function planStoryScene(
  items: SceneLayoutItem[],
  opts?: PlanStorySceneOptions,
): SpatialScenePlan {
  if (!items.length) {
    const emptyParts =
      opts?.terrainParts && opts.terrainParts.length > 0
        ? opts.terrainParts
        : [groundPlane(20)]
    return {
      placements: [],
      parts: emptyParts,
      bounds: { minX: -10, maxX: 10, minZ: -10, maxZ: 10, center: [0, 0, 0] },
      notes: [
        'Empty scene',
        ...(opts?.terrainLabel ? [`Terrain: ${opts.terrainLabel}`] : []),
        ...(opts?.terrainNotes ?? []).slice(0, 2),
      ],
      relations: [],
      sky: opts?.sky,
      cameraLift: opts?.cameraLift,
      terrainLabel: opts?.terrainLabel,
    }
  }

  // Classify
  type Work = SceneLayoutItem & { slot: SpatialSlot; radius: number; fam?: MeshFamily }
  const work: Work[] = items.map((it) => {
    const fam = familyOf(it)
    const slot = fam ? layoutToSlot(fam.layout) : 'support'
    return { ...it, slot, radius: estimateRadius(it.parts), fam }
  })

  // Prefer a single axis item; extras become support
  const axes = work.filter((w) => w.slot === 'axis')
  if (axes.length > 1) {
    axes.slice(1).forEach((w) => {
      w.slot = 'support'
    })
  }

  const bySlot = (s: SpatialSlot) => work.filter((w) => w.slot === s)

  const placements: PlacedItem[] = []
  const notes: string[] = []
  const relations: SpatialScenePlan['relations'] = []

  // 1) Axis (path) at origin, aligned +X
  const axisList = bySlot('axis')
  if (axisList[0]) {
    const a = axisList[0]
    placements.push({
      id: a.id,
      familyId: a.familyId,
      slot: 'axis',
      origin: [0, 0, 0],
      yaw: 0,
      radius: a.radius,
      label: a.fam?.name ?? a.familyId,
    })
    notes.push(`Spine: ${a.fam?.name ?? 'axis'} along +X (story corridor / path).`)
  } else {
    notes.push('No path spine — using free stage grid with relational zones.')
  }

  // 2) On-axis actors (vehicle, locus) slightly along path, staggered
  bySlot('on_axis').forEach((w, i) => {
    const x = 0.8 + i * (w.radius * 1.6 + 0.6)
    const z = (i % 2 === 0 ? 1 : -1) * 0.35
    placements.push({
      id: w.id,
      familyId: w.familyId,
      slot: 'on_axis',
      origin: [x, 0, z],
      yaw: i % 2 === 0 ? 0 : Math.PI,
      radius: w.radius,
      label: w.fam?.name ?? w.familyId,
    })
    if (axisList[0]) {
      relations.push({ from: axisList[0].id, to: w.id, kind: 'on_path' })
    }
  })
  if (bySlot('on_axis').length) {
    notes.push('On-path actors sit on the corridor with light stagger for readability.')
  }

  // 3) Near flank (crowd) south of path
  bySlot('flank_near').forEach((w, i) => {
    const x = -0.5 + i * (w.radius * 1.4 + 0.5)
    const z = 2.2 + w.radius * 0.3
    placements.push({
      id: w.id,
      familyId: w.familyId,
      slot: 'flank_near',
      origin: [x, 0, z],
      yaw: -0.15,
      radius: w.radius,
      label: w.fam?.name ?? w.familyId,
    })
    if (axisList[0]) relations.push({ from: axisList[0].id, to: w.id, kind: 'adjacent' })
  })

  // 4) Far flank (barrier) north of path
  bySlot('flank_far').forEach((w, i) => {
    const x = 1.0 + i * (w.radius * 1.5)
    const z = -(2.4 + w.radius * 0.25)
    placements.push({
      id: w.id,
      familyId: w.familyId,
      slot: 'flank_far',
      origin: [x, 0, z],
      yaw: Math.PI / 2,
      radius: w.radius,
      label: w.fam?.name ?? w.familyId,
    })
    if (bySlot('on_axis')[0]) {
      relations.push({ from: bySlot('on_axis')[0]!.id, to: w.id, kind: 'standoff' })
    }
  })

  // 5) Anchors (buildings) deep −Z, spread in X
  bySlot('anchor').forEach((w, i) => {
    const n = bySlot('anchor').length
    const x = (i - (n - 1) / 2) * (w.radius * 2.2 + 1.2)
    const z = -(5.5 + w.radius * 0.4)
    placements.push({
      id: w.id,
      familyId: w.familyId,
      slot: 'anchor',
      origin: [x, 0, z],
      yaw: 0.05 * (i - (n - 1) / 2),
      radius: w.radius,
      label: w.fam?.name ?? w.familyId,
    })
  })
  if (bySlot('anchor').length) notes.push('Facility / mass anchors sit on the far side (−Z) for depth.')

  // 6) Water zone +Z far
  bySlot('water').forEach((w, i) => {
    const x = -2 + i * (w.radius * 2.5 + 1)
    const z = 5.5 + w.radius * 0.3
    placements.push({
      id: w.id,
      familyId: w.familyId,
      slot: 'water',
      origin: [x, 0, z],
      yaw: -Math.PI / 2,
      radius: w.radius,
      label: w.fam?.name ?? w.familyId,
    })
  })
  if (bySlot('water').length) notes.push('Maritime objects occupy the open (+Z) water side.')

  // 7) Process / records zone +X far (desk of the story)
  bySlot('process').forEach((w, i) => {
    const x = 6.5 + i * (w.radius * 1.8 + 0.8)
    const z = -1.2 + (i % 2) * 1.4
    placements.push({
      id: w.id,
      familyId: w.familyId,
      slot: 'process',
      origin: [x, 0, z],
      yaw: -Math.PI / 2,
      radius: w.radius,
      label: w.fam?.name ?? w.familyId,
    })
    if (axisList[0]) relations.push({ from: axisList[0].id, to: w.id, kind: 'verify_chain' })
  })
  if (bySlot('process').length) {
    notes.push('Process / docket objects sit in the +X verification zone (records side of the stage).')
  }

  // 8) Aerial pads slightly elevated staging near path end
  bySlot('aerial').forEach((w, i) => {
    const x = 3.5 + i * (w.radius * 1.6)
    const z = 3.0 + (i % 2) * 0.8
    placements.push({
      id: w.id,
      familyId: w.familyId,
      slot: 'aerial',
      origin: [x, 0, z],
      yaw: 0.3,
      radius: w.radius,
      label: w.fam?.name ?? w.familyId,
    })
  })

  // 9) Support — pack remaining without overlap along a secondary arc
  bySlot('support').forEach((w, i) => {
    const angle = -0.6 + i * 0.55
    const r = 4.2 + w.radius
    placements.push({
      id: w.id,
      familyId: w.familyId,
      slot: 'support',
      origin: [Math.cos(angle) * r + 1.5, 0, Math.sin(angle) * r - 0.5],
      yaw: angle + Math.PI / 2,
      radius: w.radius,
      label: w.fam?.name ?? w.familyId,
    })
  })

  // Resolve mild XY collisions (push apart)
  resolveCollisions(placements)

  // Build parts (map terrain replaces flat ground when provided)
  const parts = materializePlacements(work, placements, opts?.terrainParts)
  const bounds = computeBounds(placements)
  notes.push(
    `Stage bounds X[${bounds.minX.toFixed(1)}…${bounds.maxX.toFixed(1)}] Z[${bounds.minZ.toFixed(1)}…${bounds.maxZ.toFixed(1)}] · ${placements.length} objects related in space.`,
  )
  if (opts?.terrainLabel) notes.unshift(`Terrain: ${opts.terrainLabel}`)
  if (opts?.terrainNotes?.length) notes.push(...opts.terrainNotes.slice(0, 2))

  return {
    placements,
    parts,
    bounds,
    notes,
    relations,
    sky: opts?.sky,
    cameraLift: opts?.cameraLift,
    terrainLabel: opts?.terrainLabel,
  }
}

function resolveCollisions(placements: PlacedItem[], iterations = 8): void {
  for (let iter = 0; iter < iterations; iter++) {
    for (let i = 0; i < placements.length; i++) {
      for (let j = i + 1; j < placements.length; j++) {
        const a = placements[i]!
        const b = placements[j]!
        // Axis can overlap on_axis intentionally — only soft push
        const minDist =
          a.slot === 'axis' || b.slot === 'axis'
            ? (a.radius + b.radius) * 0.55
            : (a.radius + b.radius) * 0.95
        const dx = b.origin[0] - a.origin[0]
        const dz = b.origin[2] - a.origin[2]
        const d = Math.hypot(dx, dz) || 0.001
        if (d < minDist) {
          const push = ((minDist - d) / 2) * 0.85
          const ux = dx / d
          const uz = dz / d
          if (a.slot !== 'axis') {
            a.origin = [a.origin[0] - ux * push, a.origin[1], a.origin[2] - uz * push]
          }
          if (b.slot !== 'axis') {
            b.origin = [b.origin[0] + ux * push, b.origin[1], b.origin[2] + uz * push]
          }
        }
      }
    }
  }
}

function groundPlane(size: number): MeshPartSpec {
  return {
    id: 'scene-ground',
    name: 'Stage ground',
    primitive: 'plane',
    size: [size, 1, size],
    position: [0, 0, 0],
    rotation: [-Math.PI / 2, 0, 0],
    color: '#1e293b',
  }
}

function rotateY(
  x: number,
  z: number,
  yaw: number,
): [number, number] {
  const c = Math.cos(yaw)
  const s = Math.sin(yaw)
  return [x * c - z * s, x * s + z * c]
}

function materializePlacements(
  work: Array<SceneLayoutItem & { slot: SpatialSlot }>,
  placements: PlacedItem[],
  terrainParts?: MeshPartSpec[],
): MeshPartSpec[] {
  const byId = new Map(work.map((w) => [w.id, w]))
  let maxR = 12
  for (const p of placements) {
    maxR = Math.max(maxR, Math.hypot(p.origin[0], p.origin[2]) + p.radius + 3)
  }
  const useTerrain = terrainParts && terrainParts.length > 0
  const out: MeshPartSpec[] = useTerrain
    ? [...terrainParts]
    : [groundPlane(maxR * 2.2)]

  // Soft zone marks (help depth perception) — skip when terrain already has path/water
  if (!useTerrain) {
    out.push({
      id: 'zone-path',
      name: 'Path zone',
      primitive: 'box',
      size: [Math.max(8, maxR * 0.9), 0.02, 1.8],
      position: [2, 0.01, 0],
      rotation: [0, 0, 0],
      color: '#334155',
    })
    out.push({
      id: 'zone-process',
      name: 'Process zone',
      primitive: 'box',
      size: [2.2, 0.02, 3.5],
      position: [7.2, 0.012, 0],
      rotation: [0, 0, 0],
      color: '#1e3a5f',
    })
  }

  for (const pl of placements) {
    const src = byId.get(pl.id)
    if (!src) continue
    for (const p of src.parts) {
      if (p.primitive === 'plane' || p.id === 'ground' || p.id.endsWith(':ground') || p.id.includes('water')) {
        // Keep family water planes only for water-slot items, shifted
        if (p.id.includes('water') && pl.slot === 'water') {
          const [rx, rz] = rotateY(p.position[0], p.position[2], pl.yaw)
          out.push({
            ...p,
            id: `${pl.id}:${p.id}`,
            position: [rx + pl.origin[0], p.position[1], rz + pl.origin[2]],
            rotation: [p.rotation[0], p.rotation[1] + pl.yaw, p.rotation[2]],
          })
        }
        continue
      }
      const [rx, rz] = rotateY(p.position[0], p.position[2], pl.yaw)
      out.push({
        ...p,
        id: `${pl.id}:${p.id}`,
        position: [rx + pl.origin[0], p.position[1] + pl.origin[1], rz + pl.origin[2]],
        rotation: [p.rotation[0], p.rotation[1] + pl.yaw, p.rotation[2]],
      })
    }
  }

  // Relation ribbons on ground between related pairs
  for (const rel of planRelationsFromPlacements(placements)) {
    const a = placements.find((p) => p.id === rel.from)
    const b = placements.find((p) => p.id === rel.to)
    if (!a || !b) continue
    const mx = (a.origin[0] + b.origin[0]) / 2
    const mz = (a.origin[2] + b.origin[2]) / 2
    const dx = b.origin[0] - a.origin[0]
    const dz = b.origin[2] - a.origin[2]
    const len = Math.hypot(dx, dz)
    if (len < 0.4) continue
    const yaw = Math.atan2(dx, dz)
    out.push({
      id: `rel:${rel.from}:${rel.to}`,
      name: rel.kind,
      primitive: 'box',
      size: [0.08, 0.015, len],
      position: [mx, 0.02, mz],
      rotation: [0, yaw, 0],
      color: rel.kind === 'standoff' ? '#fb7185' : rel.kind === 'verify_chain' ? '#22d3ee' : '#475569',
    })
  }

  return out
}

function planRelationsFromPlacements(
  placements: PlacedItem[],
): Array<{ from: string; to: string; kind: string }> {
  // Relations are added during planStoryScene; this helper is for ribbons only if we store them
  // We recompute light links from slots for ribbons
  const rel: Array<{ from: string; to: string; kind: string }> = []
  const axis = placements.find((p) => p.slot === 'axis')
  for (const p of placements) {
    if (!axis || p.id === axis.id) continue
    if (p.slot === 'on_axis') rel.push({ from: axis.id, to: p.id, kind: 'on_path' })
    if (p.slot === 'flank_near') rel.push({ from: axis.id, to: p.id, kind: 'adjacent' })
    if (p.slot === 'process') rel.push({ from: axis.id, to: p.id, kind: 'verify_chain' })
  }
  const on = placements.find((p) => p.slot === 'on_axis')
  for (const p of placements) {
    if (on && p.slot === 'flank_far') rel.push({ from: on.id, to: p.id, kind: 'standoff' })
  }
  return rel
}

function computeBounds(placements: PlacedItem[]) {
  let minX = 0,
    maxX = 0,
    minZ = 0,
    maxZ = 0
  if (!placements.length) {
    return { minX: -8, maxX: 8, minZ: -8, maxZ: 8, center: [0, 1, 0] as [number, number, number] }
  }
  minX = Infinity
  maxX = -Infinity
  minZ = Infinity
  maxZ = -Infinity
  for (const p of placements) {
    minX = Math.min(minX, p.origin[0] - p.radius)
    maxX = Math.max(maxX, p.origin[0] + p.radius)
    minZ = Math.min(minZ, p.origin[2] - p.radius)
    maxZ = Math.max(maxZ, p.origin[2] + p.radius)
  }
  return {
    minX,
    maxX,
    minZ,
    maxZ,
    center: [(minX + maxX) / 2, 1.2, (minZ + maxZ) / 2] as [number, number, number],
  }
}

/** Camera position that frames the planned stage */
export function cameraForBounds(
  bounds: SpatialScenePlan['bounds'],
  lift = 0,
): {
  position: [number, number, number]
  target: [number, number, number]
} {
  const spanX = Math.max(8, bounds.maxX - bounds.minX)
  const spanZ = Math.max(8, bounds.maxZ - bounds.minZ)
  const span = Math.max(spanX, spanZ)
  const dist = span * 0.95 + 6
  const [cx, , cz] = bounds.center
  return {
    position: [cx + dist * 0.65, dist * 0.55 + lift, cz + dist * 0.75],
    target: [cx, 0.6 + lift * 0.15, cz],
  }
}
