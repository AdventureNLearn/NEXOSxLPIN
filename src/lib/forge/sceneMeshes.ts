/**
 * Scene mesh facade — catalog-driven families (100+) via recipe engine.
 * Legacy short-type ids still resolve through LEGACY_MESH_MAP.
 */

import type { ActiveConditions, MeshPartSpec } from '../../types/core'
import {
  getMeshFamily,
  listMeshFamilies,
  resolveMeshFamilyId,
  type MeshFamily,
} from '../../data/forge/meshCatalog'
import { buildFamilyParts, composeInteractiveScene } from './meshRecipeEngine'

export type SceneAssetType = string

export function buildSceneParts(
  assetType: string,
  conditions: ActiveConditions | null,
): MeshPartSpec[] {
  const id = resolveMeshFamilyId(assetType)
  return buildFamilyParts(id, conditions)
}

/** Relational multi-object stage (path spine + zones) */
export function composeMassingScene(
  assets: Array<{ id: string; parts: MeshPartSpec[]; familyId?: string }>,
  _spacing = 5.5,
): MeshPartSpec[] {
  return composeInteractiveScene(
    assets.map((a) => ({
      id: a.id,
      familyId: a.familyId ?? a.id,
      parts: a.parts,
      depth: 'midground',
    })),
  )
}

export function offsetParts(
  parts: MeshPartSpec[],
  dx: number,
  dz = 0,
): MeshPartSpec[] {
  return parts.map((p) => ({
    ...p,
    id: `${p.id}@${dx}`,
    position: [p.position[0] + dx, p.position[1], p.position[2] + dz] as [number, number, number],
  }))
}

export { buildFamilyParts, composeInteractiveScene, getMeshFamily, listMeshFamilies }
export type { MeshFamily }
