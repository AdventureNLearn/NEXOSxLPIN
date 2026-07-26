/**
 * Mapping Layer — pure location foundation.
 * MUST NOT import claim ledgers or potentials for mutation.
 * Claim score changes must not alter the fingerprint.
 */

export interface MappingOrigin {
  useCaseId: string
  lat: number
  lng: number
  label?: string
  shortLabel?: string
  cityHint?: string
  kind?: string
}

export interface MappingScenePoint {
  id: string
  lat: number
  lng: number
  label?: string
}

export interface MappingLayerState {
  layer: 'mapping'
  origin: MappingOrigin
  scenePoints: MappingScenePoint[]
  /** Stable hash input for tests — location only */
  fingerprint: string
}

/** Build mapping state from geospatial inputs only. */
export function buildMappingLayerState(
  origin: MappingOrigin,
  scenePoints: MappingScenePoint[] = [],
): MappingLayerState {
  const pts = scenePoints
    .map((p) => `${p.id}:${p.lat.toFixed(5)},${p.lng.toFixed(5)}`)
    .sort()
    .join('|')
  const fingerprint = [
    origin.useCaseId,
    origin.lat.toFixed(5),
    origin.lng.toFixed(5),
    origin.kind ?? 'site',
    pts,
  ].join('::')
  return {
    layer: 'mapping',
    origin: { ...origin },
    scenePoints: scenePoints.map((p) => ({ ...p })),
    fingerprint,
  }
}

/**
 * Guard: mapping fingerprint must ignore claim scores.
 * Used by unit tests when evidence flips.
 */
export function mappingIgnoresScores(
  a: MappingLayerState,
  b: MappingLayerState,
): boolean {
  return a.fingerprint === b.fingerprint
}
