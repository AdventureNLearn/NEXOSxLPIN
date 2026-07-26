/**
 * Build scale-accurate map features from public desk locations only.
 * No decorative packing — every feature needs WGS84 + real footprint meters.
 */

import type { EvidenceScore } from '../../types/core'
import type { SpatialPoint } from '../../types/core'
import type { InvestigationMapPin } from '../../types/useCase'
import type { ProceduralAsset } from '../../types/core'
import { getMeshFamily, resolveMeshFamilyId } from '../../data/forge/meshCatalog'
import {
  type ScaleClass,
  SCALE_CLASSES,
  enuToWgs84,
  footprintMetersForLayout,
  scaleClassFromKind,
  wgs84ToEnu,
  type EnuOrigin,
} from './geoScale'
import type { SceneObjectMeta } from '../forge/sceneObjectMeta'
import { buildSceneObjectMeta } from '../forge/sceneObjectMeta'
import type { EvidentiaryObject } from '../forge/objectReasoning'
import type { ActiveSource } from '../../types/useCase'

export interface ScaleAccurateFeature {
  id: string
  /** WGS84 */
  lat: number
  lng: number
  /** Ground footprint diameter (meters) — Circle radius = half */
  footprintM: number
  scale: ScaleClass
  label: string
  kind: string
  score?: EvidenceScore
  /** Public-record / map source notes */
  notes: string[]
  /** Linked asset id if any */
  assetId?: string
  /** ENU meters from origin */
  eastM: number
  northM: number
  /** Hover / identity meta when asset-backed */
  meta?: SceneObjectMeta
  /** Public map URLs for this location */
  mapLinks: Array<{ label: string; url: string }>
}

function publicMapLinks(lat: number, lng: number, label: string): Array<{ label: string; url: string }> {
  const q = encodeURIComponent(`${lat},${lng}`)
  const name = encodeURIComponent(label)
  return [
    {
      label: 'OpenStreetMap',
      url: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=17/${lat}/${lng}`,
    },
    {
      label: 'Google Maps (public)',
      url: `https://www.google.com/maps?q=${q}(${name})`,
    },
    {
      label: 'GeoHack',
      url: `https://geohack.toolforge.org/geohack.php?params=${lat};${lng}`,
    },
  ]
}

function kindToScale(kind: string, layout?: string): ScaleClass {
  return scaleClassFromKind(kind, layout)
}

/**
 * Place assets on real coordinates:
 * 1) Match scenePoints by order / kind
 * 2) Else offset in meters from origin on a ring (true meters, not decorative packing)
 */
export function buildScaleAccurateFeatures(input: {
  origin: InvestigationMapPin
  scenePoints?: SpatialPoint[]
  assets?: ProceduralAsset[]
  evidentiary?: EvidentiaryObject[]
  activeSources?: ActiveSource[]
}): ScaleAccurateFeature[] {
  const origin: EnuOrigin = { lat: input.origin.lat, lng: input.origin.lng }
  const features: ScaleAccurateFeature[] = []
  const used = new Set<string>()

  // 1) Desk origin — always public pin
  features.push({
    id: `pin:${input.origin.useCaseId}`,
    lat: input.origin.lat,
    lng: input.origin.lng,
    footprintM: SCALE_CLASSES.site.defaultFootprintM,
    scale: 'site',
    label: input.origin.label || input.origin.shortLabel || 'Desk origin',
    kind: input.origin.kind || 'site',
    score: input.origin.score,
    notes: [
      `Public WGS84 ${input.origin.lat.toFixed(5)}°, ${input.origin.lng.toFixed(5)}°`,
      input.origin.cityHint ? `Locality: ${input.origin.cityHint}` : 'Desk map pin (simulation / primary geocode).',
      'Illustrative models only appear when zoom scale matches feature class.',
    ],
    eastM: 0,
    northM: 0,
    mapLinks: publicMapLinks(input.origin.lat, input.origin.lng, input.origin.label),
  })
  used.add(`pin:${input.origin.useCaseId}`)

  // 2) Scene points from simulation (authoritative public-ish coords)
  for (const sp of input.scenePoints ?? []) {
    const enu = wgs84ToEnu(origin, sp.lat, sp.lng)
    const scale = kindToScale(sp.kind)
    const fp = SCALE_CLASSES[scale].defaultFootprintM
    features.push({
      id: `sp:${sp.id}`,
      lat: sp.lat,
      lng: sp.lng,
      footprintM: fp,
      scale,
      label: sp.label,
      kind: sp.kind,
      score: sp.score,
      notes: [
        `Scene point · ${sp.kind}`,
        `WGS84 ${sp.lat.toFixed(5)}°, ${sp.lng.toFixed(5)}°`,
        `Footprint ~${fp} m · scale class ${scale}`,
        ...(sp.tags ?? []).map((t) => `tag:${t}`),
      ],
      eastM: enu.eastM,
      northM: enu.northM,
      mapLinks: publicMapLinks(sp.lat, sp.lng, sp.label),
    })
  }

  // 3) Assets → bind to scene points or meter ring from origin
  const assets = input.assets ?? []
  const evidentiaryByType = new Map((input.evidentiary ?? []).map((o) => [o.assetType, o]))
  const freeScene = [...(input.scenePoints ?? [])]

  assets.forEach((asset, i) => {
    const fam = getMeshFamily(resolveMeshFamilyId(asset.assetType))
    const layout = fam?.layout ?? 'module'
    const scale = scaleClassFromKind(asset.assetType, layout)
    const footprintM = footprintMetersForLayout(layout)

    let lat = origin.lat
    let lng = origin.lng
    let notePlace = 'Co-located at desk origin (no separate geocode).'

    // Prefer unused scene point
    const sp = freeScene.shift()
    if (sp) {
      lat = sp.lat
      lng = sp.lng
      notePlace = `Bound to scene point “${sp.label}” (${sp.kind}).`
    } else {
      // True-meter ring: 25 m steps, not decorative stage packing
      const angle = (i * 2.2) % (Math.PI * 2)
      const radiusM = 18 + (i % 5) * 12
      const eastM = Math.cos(angle) * radiusM
      const northM = Math.sin(angle) * radiusM
      const wgs = enuToWgs84(origin, eastM, northM)
      lat = wgs.lat
      lng = wgs.lng
      notePlace = `Meter offset from origin: ${radiusM.toFixed(0)} m ENU (not surveyed).`
    }

    const enu = wgs84ToEnu(origin, lat, lng)
    const meta = buildSceneObjectMeta({
      asset,
      evidentiary: evidentiaryByType.get(asset.assetType),
      slot: scale,
      activeSources: input.activeSources,
    })
    meta.links = [
      ...publicMapLinks(lat, lng, asset.name).map((l) => ({
        id: `map-${l.label}`,
        label: l.label,
        url: l.url,
        kind: 'source' as const,
      })),
      ...meta.links,
    ]

    features.push({
      id: `asset:${asset.id}`,
      lat,
      lng,
      footprintM,
      scale,
      label: asset.name,
      kind: layout,
      score: asset.score,
      notes: [
        notePlace,
        `Real-scale footprint ~${footprintM} m (${layout})`,
        `Selectable at zoom ≥ ${SCALE_CLASSES[scale].minSelectZoom}`,
        ...(asset.reasoning ?? []).slice(0, 3),
        asset.relatedClaimHint ? `Claim: ${asset.relatedClaimHint}` : '',
      ].filter(Boolean),
      assetId: asset.id,
      eastM: enu.eastM,
      northM: enu.northM,
      meta,
      mapLinks: publicMapLinks(lat, lng, asset.name),
    })
  })

  return features
}
