/**
 * US Census Geocoder — free, no API key.
 * https://geocoding.geo.census.gov/geocoder/
 */

import { rateLimit } from './rateLimit'

export interface CensusGeoResult {
  ok: boolean
  matchedAddress?: string
  lat?: number
  lng?: number
  stateCode?: string
  stateName?: string
  county?: string
  city?: string
  tract?: string
  geoid?: string
  retrievedAt: string
  endpoint: string
  error?: string
  raw?: unknown
}

function censusBase(): string {
  if (typeof window !== 'undefined') return '/api/census'
  return 'https://geocoding.geo.census.gov'
}

/** Reverse: coordinates → jurisdictions (states, counties, places) */
export async function reverseGeocodeCensus(
  lat: number,
  lng: number,
  signal?: AbortSignal,
): Promise<CensusGeoResult> {
  const retrievedAt = new Date().toISOString()
  const endpoint = `${censusBase()}/geocoder/geographies/coordinates`
  try {
    await rateLimit('census', 300)
    const qs = new URLSearchParams({
      x: String(lng),
      y: String(lat),
      benchmark: 'Public_AR_Current',
      vintage: 'Current_Current',
      format: 'json',
    })
    const url = `${endpoint}?${qs.toString()}`
    const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
    if (!res.ok) {
      return { ok: false, retrievedAt, endpoint, error: `HTTP ${res.status}` }
    }
    const json = (await res.json()) as {
      result?: {
        geographies?: Record<string, Array<Record<string, string>>>
      }
    }
    const geos = json?.result?.geographies || {}
    const states = geos['States'] || geos['states'] || []
    const counties = geos['Counties'] || geos['counties'] || []
    const places = geos['Incorporated Places'] || geos['Census Designated Places'] || []
    const tracts = geos['Census Tracts'] || []

    const st = states[0]
    const co = counties[0]
    const pl = places[0]
    const tr = tracts[0]

    const stateCode = st?.STUSAB || st?.STATE || undefined
    const stateName = st?.NAME || st?.BASENAME
    const county = co?.NAME || co?.BASENAME
    const city = pl?.NAME || pl?.BASENAME
    const tract = tr?.NAME || tr?.BASENAME
    const geoid = tr?.GEOID || co?.GEOID || st?.GEOID

    return {
      ok: true,
      lat,
      lng,
      matchedAddress: [city, county, stateCode].filter(Boolean).join(', '),
      stateCode: stateCode?.length === 2 ? stateCode : undefined,
      stateName,
      county,
      city,
      tract,
      geoid,
      retrievedAt,
      endpoint,
      raw: { state: st, county: co, place: pl, tract: tr },
    }
  } catch (e) {
    return {
      ok: false,
      lat,
      lng,
      retrievedAt,
      endpoint,
      error: e instanceof Error ? e.message : String(e),
    }
  }
}

/** Forward: one-line address → coordinates + geographies */
export async function geocodeAddressCensus(
  address: string,
  signal?: AbortSignal,
): Promise<CensusGeoResult> {
  const retrievedAt = new Date().toISOString()
  const endpoint = `${censusBase()}/geocoder/geographies/onelineaddress`
  const q = address.trim()
  if (!q) return { ok: false, retrievedAt, endpoint, error: 'empty address' }
  try {
    await rateLimit('census', 300)
    const qs = new URLSearchParams({
      address: q,
      benchmark: 'Public_AR_Current',
      vintage: 'Current_Current',
      format: 'json',
    })
    const url = `${endpoint}?${qs.toString()}`
    const res = await fetch(url, { signal, headers: { Accept: 'application/json' } })
    if (!res.ok) return { ok: false, retrievedAt, endpoint, error: `HTTP ${res.status}` }
    const json = (await res.json()) as {
      result?: {
        addressMatches?: Array<{
          matchedAddress?: string
          coordinates?: { x: number; y: number }
          geographies?: Record<string, Array<Record<string, string>>>
        }>
      }
    }
    const match = json?.result?.addressMatches?.[0]
    if (!match) {
      return { ok: false, retrievedAt, endpoint, error: 'no address match' }
    }
    const lng = match.coordinates?.x
    const lat = match.coordinates?.y
    const geos = match.geographies || {}
    const st = (geos['States'] || [])[0]
    const co = (geos['Counties'] || [])[0]
    const pl = (geos['Incorporated Places'] || geos['Census Designated Places'] || [])[0]
    return {
      ok: true,
      matchedAddress: match.matchedAddress,
      lat,
      lng,
      stateCode: st?.STUSAB,
      stateName: st?.NAME,
      county: co?.NAME,
      city: pl?.NAME,
      retrievedAt,
      endpoint,
    }
  } catch (e) {
    return {
      ok: false,
      retrievedAt,
      endpoint,
      error: e instanceof Error ? e.message : String(e),
    }
  }
}

export function censusMarkdown(c: CensusGeoResult): string {
  if (!c.ok) {
    return `## Census jurisdiction\n\n**Status:** failed — ${c.error || 'unknown'}\n`
  }
  return `## Census jurisdiction (live)

- **Matched:** ${c.matchedAddress || 'coordinates'}
- **State:** ${c.stateName || 'n/a'} (${c.stateCode || '?'})
- **County:** ${c.county || 'n/a'}
- **Place:** ${c.city || 'n/a'}
- **Tract:** ${c.tract || 'n/a'}
- **GEOID:** ${c.geoid || 'n/a'}
- **Queried:** ${c.retrievedAt}
- **Endpoint:** \`${c.endpoint}\`

_Source: U.S. Census Bureau Geocoder (public, no key). Evidence for jurisdiction attach only — not device ownership._
`
}
