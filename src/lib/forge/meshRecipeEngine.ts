/**
 * Parametric mesh recipe engine — unique geometry per family seed.
 * No twin meshes: seed drives proportions, counts, and accent placement.
 */

import type { ActiveConditions, MeshPartSpec } from '../../types/core'
import type { MeshFamily, MeshLayoutKind } from '../../data/forge/meshCatalog'
import { getMeshFamily, resolveMeshFamilyId } from '../../data/forge/meshCatalog'
import {
  planStoryScene,
  cameraForBounds,
  type SceneLayoutItem,
  type SpatialScenePlan,
  type PlacedItem,
} from './spatialSceneLayout'

export { planStoryScene, cameraForBounds }
export type { SpatialScenePlan, SceneLayoutItem, PlacedItem }

function ground(size = 14, color = '#1e293b'): MeshPartSpec {
  return {
    id: 'ground',
    name: 'Ground',
    primitive: 'plane',
    size: [size, 1, size],
    position: [0, 0, 0],
    rotation: [-Math.PI / 2, 0, 0],
    color,
  }
}

/** Deterministic pseudo-random 0..1 from seed + salt */
function rnd(seed: number, salt: number): number {
  const x = Math.sin(seed * 12.9898 + salt * 78.233) * 43758.5453
  return x - Math.floor(x)
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function part(
  id: string,
  name: string,
  primitive: MeshPartSpec['primitive'],
  size: [number, number, number],
  position: [number, number, number],
  color: string,
  rotation: [number, number, number] = [0, 0, 0],
  hinge?: MeshPartSpec['hinge'],
): MeshPartSpec {
  return { id, name, primitive, size, position, rotation, color, hinge }
}

type Builder = (f: MeshFamily, c: ActiveConditions | null) => MeshPartSpec[]

const BUILDERS: Record<MeshLayoutKind, Builder> = {
  vehicle: (f) => {
    const s = f.seed
    const L = lerp(1.8, 3.4, rnd(s, 1))
    const W = lerp(0.9, 1.35, rnd(s, 2))
    const H = lerp(0.45, 0.85, rnd(s, 3))
    const cabL = L * lerp(0.35, 0.5, rnd(s, 4))
    return [
      ground(16),
      part('body', 'Body', 'box', [L, H, W], [0, H / 2 + 0.22, 0], '#475569'),
      part('cabin', 'Cabin', 'box', [cabL, H * 0.85, W * 0.9], [-L * 0.12, H + 0.35, 0], '#334155'),
      part('accent', 'Accent', 'box', [L * 0.2, 0.1, W * 0.85], [L * 0.28, H * 0.7, 0], f.accent),
      ...([-1, 1] as const).flatMap((z, i) =>
        ([-1, 1] as const).map((x, j) =>
          part(
            `w${i}${j}`,
            'Wheel',
            'cylinder',
            [0.2 + rnd(s, 5) * 0.08, 0.14, 0.2],
            [x * L * 0.32, 0.22, z * W * 0.48],
            '#0f172a',
            [Math.PI / 2, 0, 0],
          ),
        ),
      ),
    ]
  },

  vessel: (f) => {
    const s = f.seed
    const L = lerp(3.5, 5.5, rnd(s, 1))
    const W = lerp(1.0, 1.6, rnd(s, 2))
    return [
      part('water', 'Water', 'plane', [18, 1, 12], [0, 0.02, 0], '#0c4a6e', [-Math.PI / 2, 0, 0]),
      part('hull', 'Hull', 'box', [L, 0.65, W], [0, 0.42, 0], '#475569'),
      part('bow', 'Bow', 'box', [0.8, 0.5, W * 0.7], [L * 0.42, 0.48, 0], '#64748b', [0, Math.PI / 5, 0]),
      part('super', 'Superstructure', 'box', [L * 0.28, 0.8, W * 0.75], [-L * 0.15, 1.05, 0], '#334155'),
      part('stack', 'Stack', 'cylinder', [0.15, 0.65, 0.15], [-L * 0.1, 1.7, 0], f.accent),
    ]
  },

  building: (f) => {
    const s = f.seed
    const W = lerp(2.4, 4.2, rnd(s, 1))
    const D = lerp(1.6, 2.8, rnd(s, 2))
    const H = lerp(1.6, 3.2, rnd(s, 3))
    return [
      ground(18),
      part('main', 'Main mass', 'box', [W, H, D], [0, H / 2, 0], '#334155'),
      part('wing', 'Wing', 'box', [W * 0.4, H * 0.6, D * 0.8], [W * 0.55, H * 0.3, 0.1], '#475569'),
      part('roof', 'Roof', 'box', [W * 1.02, 0.12, D * 1.02], [0, H + 0.06, 0], '#0f172a'),
      part('entry', 'Entry', 'box', [0.6, H * 0.45, 0.12], [0, H * 0.22, D / 2 + 0.05], f.accent),
    ]
  },

  tower: (f) => {
    const s = f.seed
    const H = lerp(2.5, 5.5, rnd(s, 1))
    const R = lerp(0.08, 0.22, rnd(s, 2))
    return [
      ground(12),
      part('base', 'Base', 'cylinder', [R * 2.2, 0.12, R * 2.2], [0, 0.06, 0], '#334155'),
      part('shaft', 'Shaft', 'cylinder', [R, H, R], [0, H / 2, 0], '#94a3b8'),
      part('head', 'Head', 'box', [R * 4, R * 2.5, R * 3], [R * 1.5, H - 0.15, 0], '#0f172a'),
      part('tip', 'Tip', 'sphere', [R * 1.2, R * 1.2, R * 1.2], [0, H + 0.15, 0], f.accent),
    ]
  },

  cabinet: (f) => {
    const s = f.seed
    const H = lerp(1.0, 1.6, rnd(s, 1))
    const W = lerp(0.7, 1.2, rnd(s, 2))
    return [
      ground(8),
      part('body', 'Body', 'box', [W, H, 0.5], [0, H / 2, 0], '#334155'),
      part('door', 'Door', 'box', [W * 0.92, H * 0.88, 0.05], [0, H / 2, 0.28], '#475569', [0, 0, 0], {
        axis: 'y',
        minDeg: 0,
        maxDeg: 100,
        restDeg: 0,
      }),
      part('label', 'Label', 'box', [W * 0.45, 0.1, 0.02], [0, H * 0.75, 0.32], f.accent),
    ]
  },

  stack: (f) => {
    const s = f.seed
    const n = 4 + Math.floor(rnd(s, 1) * 4)
    const sheets: MeshPartSpec[] = [ground(10)]
    sheets.push(part('desk', 'Bench', 'box', [2.0, 0.1, 1.0], [0, 0.82, 0], '#44403c'))
    for (let i = 0; i < n; i++) {
      sheets.push(
        part(
          `sheet-${i}`,
          `Sheet ${i + 1}`,
          'box',
          [0.5 + rnd(s, i + 2) * 0.15, 0.05, 0.38],
          [-0.3 + i * 0.07, 0.9 + i * 0.06, 0.05],
          i % 2 === 0 ? '#f8fafc' : f.accent,
          [0, i * 0.06, 0],
        ),
      )
    }
    return sheets
  },

  cluster: (f) => {
    const s = f.seed
    const n = 6 + Math.floor(rnd(s, 1) * 6)
    const people: MeshPartSpec[] = [ground(12)]
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rnd(s, i) * 0.4
      const r = 0.6 + rnd(s, i + 10) * 1.4
      const x = Math.cos(a) * r
      const z = Math.sin(a) * r
      const h = 0.95 + rnd(s, i + 20) * 0.25
      people.push(part(`p${i}`, `Person ${i}`, 'cylinder', [0.12, h, 0.12], [x, h / 2, z], i % 2 ? '#64748b' : '#94a3b8'))
      people.push(part(`h${i}`, 'Head', 'sphere', [0.11, 0.11, 0.11], [x, h + 0.1, z], '#cbd5e1'))
    }
    return people
  },

  path: (f) => {
    const s = f.seed
    const L = lerp(6, 10, rnd(s, 1))
    const W = lerp(1.2, 2.0, rnd(s, 2))
    return [
      ground(16),
      part('slab', 'Path', 'box', [L, 0.08, W], [0, 0.04, 0], '#475569'),
      part('e1', 'Edge', 'box', [L, 0.1, 0.1], [0, 0.08, W / 2], '#94a3b8'),
      part('e2', 'Edge', 'box', [L, 0.1, 0.1], [0, 0.08, -W / 2], '#94a3b8'),
      part('pin', 'Pin', 'sphere', [0.2, 0.2, 0.2], [L * 0.1, 0.3, 0], f.accent),
      part('ring', 'Ring', 'cylinder', [0.55, 0.04, 0.55], [L * 0.1, 0.1, 0], '#fb7185'),
    ]
  },

  barrier: (f) => {
    const s = f.seed
    const n = 4 + Math.floor(rnd(s, 1) * 3)
    const parts: MeshPartSpec[] = [ground(14)]
    for (let i = 0; i < n; i++) {
      const x = (i - (n - 1) / 2) * 1.05
      parts.push(part(`post-${i}`, 'Post', 'cylinder', [0.07, 1.1, 0.07], [x, 0.55, 0], '#64748b'))
    }
    parts.push(part('rail', 'Rail', 'box', [n * 1.05, 0.08, 0.08], [0, 0.95, 0], f.accent))
    return parts
  },

  debris: (f) => {
    const s = f.seed
    const n = 5 + Math.floor(rnd(s, 1) * 4)
    const parts: MeshPartSpec[] = [ground(12, '#292524')]
    for (let i = 0; i < n; i++) {
      const sx = 0.35 + rnd(s, i) * 0.9
      const sy = 0.2 + rnd(s, i + 3) * 0.45
      const sz = 0.3 + rnd(s, i + 5) * 0.7
      parts.push(
        part(
          `d${i}`,
          'Debris',
          'box',
          [sx, sy, sz],
          [(rnd(s, i + 7) - 0.5) * 1.6, sy / 2, (rnd(s, i + 9) - 0.5) * 1.2],
          i % 2 ? '#64748b' : '#78716c',
          [0.1, rnd(s, i) * 0.8, 0.05],
        ),
      )
    }
    parts.push(part('dust', 'Dust', 'cylinder', [1.6, 0.04, 1.6], [0, 0.02, 0], '#a8a29e'))
    return parts
  },

  pad: (f) => {
    const s = f.seed
    const R = lerp(1.0, 2.2, rnd(s, 1))
    return [
      ground(12),
      part('pad', 'Pad', 'cylinder', [R, 0.08, R], [0, 0.04, 0], '#334155'),
      part('mark', 'Mark', 'box', [R * 0.3, 0.04, R * 1.4], [0, 0.1, 0], f.accent),
    ]
  },

  drone: (f) => {
    const s = f.seed
    const arm = lerp(0.4, 0.65, rnd(s, 1))
    const parts: MeshPartSpec[] = [
      ground(10),
      part('pad', 'Pad', 'cylinder', [1.1, 0.06, 1.1], [0, 0.03, 0], '#334155'),
      part('body', 'Body', 'box', [0.5, 0.12, 0.32], [0, 1.35, 0], '#64748b'),
    ]
    const corners: [number, number][] = [
      [1, 1],
      [1, -1],
      [-1, 1],
      [-1, -1],
    ]
    corners.forEach(([x, z], i) => {
      parts.push(part(`arm${i}`, 'Arm', 'box', [arm, 0.04, 0.05], [x * arm * 0.45, 1.35, z * arm * 0.45], '#94a3b8', [0, Math.atan2(z, x), 0]))
      parts.push(
        part(`rotor${i}`, 'Rotor', 'cylinder', [0.18, 0.03, 0.18], [x * arm * 0.7, 1.42, z * arm * 0.7], f.accent, [0, 0, 0], {
          axis: 'y',
          minDeg: 0,
          maxDeg: 360,
          restDeg: 0,
        }),
      )
    })
    return parts
  },

  radial: (f) => {
    const s = f.seed
    const n = 6 + Math.floor(rnd(s, 1) * 4)
    const parts: MeshPartSpec[] = [ground(12), part('hub', 'Hub', 'cylinder', [0.25, 0.3, 0.25], [0, 0.6, 0], '#334155')]
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2
      parts.push(
        part(
          `spoke${i}`,
          'Spoke',
          'box',
          [1.4, 0.06, 0.08],
          [Math.cos(a) * 0.7, 0.9, Math.sin(a) * 0.7],
          i % 2 ? f.accent : '#94a3b8',
          [0, a, 0],
        ),
      )
    }
    parts.push(part('dish', 'Dish', 'cylinder', [1.1, 0.08, 1.1], [0, 1.15, 0], '#64748b'))
    return parts
  },

  arch: (f) => {
    const s = f.seed
    const H = lerp(1.8, 2.8, rnd(s, 1))
    const W = lerp(2.0, 3.2, rnd(s, 2))
    return [
      ground(12),
      part('l', 'Leg L', 'box', [0.25, H, 0.25], [-W / 2, H / 2, 0], '#64748b'),
      part('r', 'Leg R', 'box', [0.25, H, 0.25], [W / 2, H / 2, 0], '#64748b'),
      part('top', 'Span', 'box', [W + 0.25, 0.2, 0.3], [0, H, 0], f.accent),
    ]
  },

  pipe: (f) => {
    const s = f.seed
    const n = 3 + Math.floor(rnd(s, 1) * 3)
    const parts: MeshPartSpec[] = [ground(14)]
    for (let i = 0; i < n; i++) {
      parts.push(
        part(
          `pipe${i}`,
          'Segment',
          'cylinder',
          [0.12 + rnd(s, i) * 0.08, 2.2, 0.12],
          [(i - (n - 1) / 2) * 0.35, 0.45, 0],
          i === 0 ? f.accent : '#78716c',
          [0, 0, Math.PI / 2],
        ),
      )
    }
    return parts
  },

  tank: (f) => {
    const s = f.seed
    const R = lerp(0.7, 1.4, rnd(s, 1))
    const H = lerp(1.0, 2.2, rnd(s, 2))
    const sphere = rnd(s, 3) > 0.45
    return [
      ground(12),
      sphere
        ? part('tank', 'Tank', 'sphere', [R, R, R], [0, R, 0], '#64748b')
        : part('tank', 'Tank', 'cylinder', [R, H, R], [0, H / 2, 0], '#64748b'),
      part('cap', 'Cap', 'cylinder', [R * 0.35, 0.15, R * 0.35], [0, sphere ? R * 1.7 : H + 0.1, 0], f.accent),
    ]
  },

  lattice: (f) => {
    const s = f.seed
    const H = lerp(3, 5, rnd(s, 1))
    const parts: MeshPartSpec[] = [ground(12)]
    const feet: [number, number][] = [
      [-0.6, -0.6],
      [0.6, -0.6],
      [-0.6, 0.6],
      [0.6, 0.6],
    ]
    feet.forEach(([x, z], i) => {
      parts.push(part(`leg${i}`, 'Leg', 'cylinder', [0.06, H, 0.06], [x, H / 2, z], '#94a3b8'))
    })
    parts.push(part('cross', 'Cross', 'box', [1.3, 0.06, 0.06], [0, H * 0.6, 0], f.accent))
    parts.push(part('cross2', 'Cross', 'box', [0.06, 0.06, 1.3], [0, H * 0.4, 0], f.accent))
    parts.push(part('top', 'Top', 'box', [0.8, 0.2, 0.8], [0, H, 0], '#334155'))
    return parts
  },

  canopy: (f) => {
    const s = f.seed
    const W = lerp(2.0, 3.0, rnd(s, 1))
    return [
      ground(12),
      part('floor', 'Floor', 'box', [W, 0.06, W * 0.85], [0, 0.03, 0], '#57534e'),
      part('p1', 'Pole', 'cylinder', [0.06, 1.45, 0.06], [-W * 0.4, 0.72, W * 0.3], '#94a3b8'),
      part('p2', 'Pole', 'cylinder', [0.06, 1.45, 0.06], [W * 0.4, 0.72, -W * 0.3], '#94a3b8'),
      part('roof', 'Canopy', 'box', [W * 1.05, 0.08, W * 0.9], [0, 1.48, 0], f.accent),
      part('crate', 'Crate', 'box', [0.45, 0.35, 0.45], [0.4, 0.22, 0.2], '#a16207'),
    ]
  },

  platform: (f) => {
    const s = f.seed
    const H = lerp(0.9, 1.4, rnd(s, 1))
    return [
      ground(10),
      part('deck', 'Deck', 'box', [2.0, 0.14, 1.4], [0, H, 0], '#334155'),
      ...([-1, 1] as const).flatMap((x, i) =>
        ([-1, 1] as const).map((z, j) =>
          part(`leg${i}${j}`, 'Leg', 'cylinder', [0.07, H, 0.07], [x * 0.8, H / 2, z * 0.5], '#64748b'),
        ),
      ),
      part('gear', 'Gear', 'box', [0.35, 0.22, 0.28], [0.25, H + 0.25, 0], '#0f172a'),
      part('lens', 'Lens', 'cylinder', [0.08, 0.16, 0.08], [0.5, H + 0.25, 0], f.accent, [0, 0, Math.PI / 2]),
    ]
  },

  row: (f) => {
    const s = f.seed
    const n = 5 + Math.floor(rnd(s, 1) * 4)
    const parts: MeshPartSpec[] = [ground(16)]
    for (let i = 0; i < n; i++) {
      const x = (i - (n - 1) / 2) * 0.9
      const h = 0.3 + rnd(s, i) * 0.5
      parts.push(part(`seg${i}`, 'Segment', 'box', [0.7, h, 0.35], [x, h / 2, 0], i % 2 ? f.accent : '#78716c'))
    }
    return parts
  },

  crane: (f) => {
    const s = f.seed
    const H = lerp(3, 5, rnd(s, 1))
    const arm = lerp(2.5, 4, rnd(s, 2))
    return [
      ground(16),
      part('base', 'Base', 'box', [1.2, 0.3, 1.2], [0, 0.15, 0], '#334155'),
      part('mast', 'Mast', 'box', [0.25, H, 0.25], [0, H / 2, 0], '#64748b'),
      part('arm', 'Arm', 'box', [arm, 0.18, 0.18], [arm / 2 - 0.2, H - 0.2, 0], f.accent, [0, 0, 0], {
        axis: 'z',
        minDeg: 0,
        maxDeg: 35,
        restDeg: 0,
      }),
      part('hook', 'Hook', 'cylinder', [0.08, 0.5, 0.08], [arm - 0.5, H - 0.7, 0], '#94a3b8'),
    ]
  },

  array: (f) => {
    const s = f.seed
    const cols = 3 + Math.floor(rnd(s, 1) * 2)
    const rows = 2 + Math.floor(rnd(s, 2) * 2)
    const parts: MeshPartSpec[] = [ground(16)]
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        parts.push(
          part(
            `p${r}${c}`,
            'Panel',
            'box',
            [1.1, 0.06, 0.7],
            [(c - (cols - 1) / 2) * 1.25, 0.55 + r * 0.15, (r - (rows - 1) / 2) * 1.0],
            r === 0 && c === 0 ? f.accent : '#1e3a5f',
            [0.4, 0, 0],
          ),
        )
      }
    }
    return parts
  },

  rack: (f) => {
    const s = f.seed
    const units = 3 + Math.floor(rnd(s, 1) * 3)
    const parts: MeshPartSpec[] = [ground(10)]
    parts.push(part('frame', 'Frame', 'box', [0.7, 2.0, 1.0], [0, 1.0, 0], '#334155'))
    for (let i = 0; i < units; i++) {
      parts.push(
        part(
          `u${i}`,
          'Unit',
          'box',
          [0.62, 0.22, 0.9],
          [0, 0.35 + i * 0.35, 0.05],
          i % 2 ? f.accent : '#22d3ee',
        ),
      )
    }
    return parts
  },

  frame: (f) => {
    const s = f.seed
    const W = lerp(1.4, 2.4, rnd(s, 1))
    const H = lerp(1.2, 2.0, rnd(s, 2))
    return [
      ground(10),
      part('base', 'Base', 'box', [W, 0.15, W * 0.7], [0, 0.08, 0], '#334155'),
      part('colL', 'Column', 'box', [0.12, H, 0.12], [-W * 0.4, H / 2, 0], '#64748b'),
      part('colR', 'Column', 'box', [0.12, H, 0.12], [W * 0.4, H / 2, 0], '#64748b'),
      part('beam', 'Beam', 'box', [W * 0.85, 0.1, 0.1], [0, H, 0], f.accent),
      part('tool', 'Tool', 'box', [W * 0.35, H * 0.4, W * 0.35], [0, H * 0.35, 0], '#475569'),
    ]
  },

  locus: (f) => {
    const s = f.seed
    const R = lerp(0.4, 0.7, rnd(s, 1))
    return [
      ground(10),
      part('ring', 'Ring', 'cylinder', [R * 2.2, 0.05, R * 2.2], [0, 0.03, 0], '#64748b'),
      part('core', 'Core', 'sphere', [R, R, R], [0, R + 0.1, 0], f.accent),
      part('pin', 'Pin', 'cylinder', [0.05, R * 1.6, 0.05], [0, R * 2, 0], '#22d3ee'),
    ]
  },

  silo: (f) => {
    const s = f.seed
    const H = lerp(2.2, 3.5, rnd(s, 1))
    const R = lerp(0.55, 0.95, rnd(s, 2))
    return [
      ground(12),
      part('body', 'Silo', 'cylinder', [R, H, R], [0, H / 2, 0], '#78716c'),
      part('cap', 'Cap', 'cylinder', [R * 1.05, 0.15, R * 1.05], [0, H + 0.05, 0], f.accent),
      part('leg', 'Leg', 'box', [0.15, 0.5, 0.15], [R * 0.6, 0.25, R * 0.6], '#475569'),
    ]
  },

  console: (f) => {
    const s = f.seed
    const W = lerp(1.4, 2.2, rnd(s, 1))
    return [
      ground(10),
      part('desk', 'Desk', 'box', [W, 0.12, 0.8], [0, 0.9, 0], '#44403c'),
      part('legL', 'Leg', 'box', [0.1, 0.9, 0.1], [-W * 0.4, 0.45, 0.25], '#57534e'),
      part('legR', 'Leg', 'box', [0.1, 0.9, 0.1], [W * 0.4, 0.45, -0.25], '#57534e'),
      part('screen', 'Screen', 'box', [W * 0.55, 0.45, 0.06], [0, 1.25, -0.25], f.accent),
      part('panel', 'Panel', 'box', [W * 0.35, 0.08, 0.35], [0.35, 0.98, 0.1], '#64748b'),
    ]
  },

  gantry: (f) => {
    const s = f.seed
    const W = lerp(2.0, 3.0, rnd(s, 1))
    const H = lerp(1.6, 2.4, rnd(s, 2))
    return [
      ground(12),
      part('railL', 'Rail', 'box', [0.12, H, 0.12], [-W / 2, H / 2, 0], '#64748b'),
      part('railR', 'Rail', 'box', [0.12, H, 0.12], [W / 2, H / 2, 0], '#64748b'),
      part('bridge', 'Bridge', 'box', [W, 0.15, 0.2], [0, H, 0], f.accent),
      part('head', 'Head', 'box', [0.35, 0.35, 0.35], [0, H - 0.35, 0], '#334155'),
    ]
  },

  module: (f) => {
    const s = f.seed
    const W = lerp(0.8, 1.6, rnd(s, 1))
    const H = lerp(0.6, 1.4, rnd(s, 2))
    const D = lerp(0.5, 1.1, rnd(s, 3))
    return [
      ground(10),
      part('mod', 'Module', 'box', [W, H, D], [0, H / 2, 0], '#475569'),
      part('stripe', 'Stripe', 'box', [W * 0.9, 0.08, 0.04], [0, H * 0.7, D / 2 + 0.02], f.accent),
      part('port', 'Port', 'cylinder', [0.08, 0.1, 0.08], [W * 0.3, H * 0.4, D / 2], '#22d3ee', [Math.PI / 2, 0, 0]),
    ]
  },

  hull_armor: (f) => {
    const s = f.seed
    const L = lerp(2.5, 3.8, rnd(s, 1))
    return [
      ground(14),
      part('hull', 'Hull', 'box', [L, 0.9, 1.5], [0, 0.55, 0], '#57534e'),
      part('turret', 'Turret', 'cylinder', [0.45, 0.4, 0.45], [0, 1.2, 0], '#44403c'),
      part('barrel', 'Barrel', 'cylinder', [0.08, 1.2, 0.08], [0.7, 1.25, 0], f.accent, [0, 0, Math.PI / 2]),
      part('trackL', 'Track', 'box', [L * 0.9, 0.25, 0.25], [0, 0.2, 0.75], '#292524'),
      part('trackR', 'Track', 'box', [L * 0.9, 0.25, 0.25], [0, 0.2, -0.75], '#292524'),
    ]
  },
}

export function buildFamilyParts(
  familyOrId: MeshFamily | string,
  conditions: ActiveConditions | null = null,
): MeshPartSpec[] {
  const family =
    typeof familyOrId === 'string'
      ? getMeshFamily(resolveMeshFamilyId(familyOrId))
      : familyOrId
  if (!family) {
    // fallback unique locus
    return BUILDERS.locus(
      {
        id: 'fallback',
        name: 'Fallback locus',
        role: 'Unknown',
        industries: [],
        smeDomains: [],
        keywords: [],
        layout: 'locus',
        seed: 1,
        depth: 'midground',
        accent: '#fbbf24',
      },
      conditions,
    )
  }
  const builder = BUILDERS[family.layout] ?? BUILDERS.module
  const parts = builder(family, conditions)
  // Tag parts with family id for multi-select composition
  return parts.map((p) => ({
    ...p,
    id: p.id === 'ground' ? p.id : `${family.id}:${p.id}`,
    name: p.id === 'ground' ? p.name : `${family.name} · ${p.name}`,
  }))
}

/**
 * Compose selected families into one relational story stage
 * (path spine, on-path actors, flanks, far anchors, water, process zone).
 */
export function composeInteractiveScene(
  items: SceneLayoutItem[],
  _opts?: { spacingX?: number; depthGap?: number },
): MeshPartSpec[] {
  return planStoryScene(items).parts
}
