/**
 * Free-tier jurisdiction / density enrich (Census + reverse geocode + OpenFEMA).
 * Does not touch USASpending modules.
 */

import type { AuditTarget, EvidenceItem, SourceRef } from '../../types/audit'
import { reverseGeocodeCensus, censusMarkdown, type CensusGeoResult } from './censusGeo'
import { searchLocation } from '../locationService'
import { openFemaMarkdown, searchOpenFemaContext, type OpenFemaSearchResult } from './openFema'
import { reverseGeocodeNominatim } from '../locationService'

export interface JurisdictionEnrichResult {
  audit: AuditTarget
  logLine: string
  jurisdictionMarkdown: string
  census?: CensusGeoResult
  fema?: OpenFemaSearchResult
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

/**
 * Resolve lat/lng for audit if missing, then Census reverse + OpenFEMA state context.
 */
export async function enrichAuditWithJurisdiction(audit: AuditTarget): Promise<JurisdictionEnrichResult> {
  let lat = audit.spatial.lat
  let lng = audit.spatial.lng
  let label = audit.spatial.locationDescription
  const logs: string[] = []
  let md = ''

  // Forward geocode if we only have text
  if ((lat == null || lng == null) && (label || audit.query)) {
    try {
      const hits = await searchLocation(label || audit.query)
      if (hits[0]) {
        lat = hits[0].lat
        lng = hits[0].lng
        label = hits[0].label
        logs.push(`Nominatim/local geocode · ${hits[0].label}`)
      }
    } catch {
      logs.push('Geocode forward failed')
    }
  }

  let census: CensusGeoResult | undefined
  if (lat != null && lng != null) {
    // Nominatim reverse for human label (best-effort)
    try {
      const rev = await reverseGeocodeNominatim(lat, lng)
      if (rev?.label) {
        label = rev.label
        logs.push(`Nominatim reverse · ${rev.label.slice(0, 60)}`)
      }
    } catch {
      /* optional */
    }

    census = await reverseGeocodeCensus(lat, lng)
    md += censusMarkdown(census) + '\n'
    if (census.ok) {
      logs.push(
        `Census OK · ${census.stateCode || '?'} · ${census.county || 'county?'} · ${census.city || 'place?'}`,
      )
    } else {
      logs.push(`Census FAIL · ${census.error || 'error'}`)
    }
  } else {
    md += '## Census jurisdiction\n\n_No coordinates available — provide location or run geocode._\n\n'
    logs.push('Census SKIP · no coordinates')
  }

  const stateCode =
    census?.stateCode ||
    audit.spatial.savedLocations?.find((l) => l.stateCode)?.stateCode ||
    audit.privacy?.matchedStates?.[0]?.stateCode

  const fema = await searchOpenFemaContext(audit.query, { stateCode, limit: 6 })
  md += openFemaMarkdown(fema) + '\n'
  if (fema.ok) logs.push(`OpenFEMA OK · rows=${fema.hits.length}`)
  else logs.push(`OpenFEMA FAIL · ${fema.error || 'error'}`)

  const now = new Date().toISOString()
  const sources: SourceRef[] = []
  const evidence: EvidenceItem[] = []

  if (census?.ok) {
    const sid = `census-${now.slice(0, 19)}`
    sources.push({
      id: sid,
      title: 'U.S. Census Geocoder — jurisdiction attach',
      citation: `${census.matchedAddress || `${lat},${lng}`} · ${census.county || ''} · ${census.stateCode || ''}`,
      url: 'https://geocoding.geo.census.gov/geocoder/',
      retrievedAt: census.retrievedAt,
      publicRecord: true,
    })
    evidence.push({
      id: uid('ev'),
      title: 'Jurisdiction from Census geographies',
      summary: `State ${census.stateCode || '?'} · County ${census.county || 'n/a'} · Place ${census.city || 'n/a'}. Public geocoder Evidence for location attach only.`,
      class: 'Evidence',
      confidence: 'high',
      sourceIds: [sid],
      tags: ['jurisdiction', 'census', 'live'],
      createdAt: now,
    })
  }

  if (fema.ok && fema.hits.length) {
    const sid = `openfema-${now.slice(0, 19)}`
    sources.push({
      id: sid,
      title: 'OpenFEMA DisasterDeclarationsSummaries',
      citation: `state=${stateCode || 'n/a'} · n=${fema.hits.length}`,
      url: 'https://www.fema.gov/about/openfema/api',
      retrievedAt: fema.retrievedAt,
      publicRecord: true,
    })
    evidence.push({
      id: uid('ev'),
      title: 'OpenFEMA declaration context',
      summary: `Fetched ${fema.hits.length} public FEMA declaration row(s) for context. Funding linkage remains Inference until USASpending award IDs attach.`,
      class: 'Inference',
      confidence: 'low',
      sourceIds: [sid],
      tags: ['fema', 'openfema', 'live', 'context'],
      createdAt: now,
    })
  }

  const jurisdictionHints = [
    ...(audit.spatial.jurisdictionHints || []),
    ...(census?.ok
      ? [
          `Census: ${census.stateCode || '?'} / ${census.county || 'county n/a'} / ${census.city || 'place n/a'}`,
        ]
      : []),
  ]

  const next: AuditTarget = {
    ...audit,
    updatedAt: now,
    spatial: {
      ...audit.spatial,
      lat: lat ?? audit.spatial.lat,
      lng: lng ?? audit.spatial.lng,
      locationDescription: label || audit.spatial.locationDescription,
      jurisdictionHints,
      confidence:
        census?.ok || (lat != null && lng != null) ? 'high' : audit.spatial.confidence,
      sources: [
        ...audit.spatial.sources,
        ...(census?.ok ? ['census-geocoder'] : []),
      ],
    },
    sources: [
      ...audit.sources.filter((s) => !sources.some((n) => n.id === s.id)),
      ...sources,
    ],
    evidenceItems: [...audit.evidenceItems, ...evidence],
    fileTags: Array.from(
      new Set([
        ...audit.fileTags,
        ...(census?.ok ? ['census-live'] : []),
        ...(fema.ok ? ['openfema-live'] : []),
      ]),
    ),
    structuredBriefMarkdown: `${audit.structuredBriefMarkdown}\n\n${md}`,
  }

  return {
    audit: next,
    logLine: logs.join(' · '),
    jurisdictionMarkdown: md,
    census,
    fema,
  }
}
