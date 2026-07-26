/**
 * Deflock / OSM ALPR camera types for Nexus GIS integration.
 * Source: OpenStreetMap tags (man_made=surveillance, surveillance:type=ALPR)
 * Map project: maps.deflock.org / deflock.me / deflock.org
 */

import type { ClaimConfidence, DeviceClass } from './audit'

export interface DeflockBBox {
  south: number
  west: number
  north: number
  east: number
  label: string
}

/** Raw camera from Overpass / Deflock OSM layer */
export interface DeflockCamera {
  id: string
  osmType: 'node' | 'way' | 'relation'
  osmId: number
  lat: number
  lng: number
  manufacturer?: string
  operator?: string
  surveillanceType?: string
  cameraDirection?: string
  cameraMount?: string
  name?: string
  tags: Record<string, string>
  /** Nexus enrichment (not from OSM) */
  nexus?: DeflockNexusEnrichment
}

export interface DeflockNexusEnrichment {
  deviceClass: DeviceClass
  brandMatch?: string
  brandProfileId?: string
  ndaa889Covered: boolean
  commercialModel?: string
  cloudBackendTypical: boolean
  multiAgencySharingTypical: boolean
  stateCode?: string
  statePosture?: string
  suggestedDrawingId?: string
  fundingHints: string[]
  privacyFlags: string[]
  confidence: ClaimConfidence
  discourseNote: string
}

export interface DeflockLoadResult {
  cameras: DeflockCamera[]
  source: 'overpass' | 'sample' | 'cache'
  bbox: DeflockBBox
  fetchedAt: string
  queryNote: string
  attribution: string
  error?: string
}

export const DEFLOCK_ATTRIBUTION =
  'ALPR locations from OpenStreetMap contributors via Deflock tagging (man_made=surveillance + surveillance:type=ALPR). Map project: maps.deflock.org / deflock.me. © OpenStreetMap contributors (ODbL).'

export const ATLANTA_DEFLOCK_BBOX: DeflockBBox = {
  south: 33.55,
  west: -84.65,
  north: 33.95,
  east: -84.15,
  label: 'Atlanta metro (Deflock / OSM ALPR)',
}
