/**
 * Location search helpers for optional publicApi enrichment.
 * Agnostic — no hard-coded place identity in default known list.
 */

import type { SavedAuditLocation } from '../types/audit'
import { rateLimit } from './publicApi/rateLimit'

export interface GeocodeResult {
  label: string
  lat: number
  lng: number
  stateCode?: string
  city?: string
}

/** Empty by default — domain packs may inject known points at runtime. */
const KNOWN: GeocodeResult[] = []

export async function searchLocation(query: string): Promise<GeocodeResult[]> {
  const q = query.trim()
  if (!q) return []

  const local = KNOWN.filter((k) => k.label.toLowerCase().includes(q.toLowerCase()))
  if (local.length) return local

  await rateLimit('nominatim', 1100)
  try {
    const url = `/api/nominatim/search?format=json&limit=5&q=${encodeURIComponent(q)}`
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) return []
    const data = (await res.json()) as Array<{
      display_name: string
      lat: string
      lon: string
    }>
    return data.map((d) => ({
      label: d.display_name,
      lat: Number(d.lat),
      lng: Number(d.lon),
    }))
  } catch {
    return []
  }
}

export async function reverseGeocodeNominatim(
  lat: number,
  lng: number,
): Promise<GeocodeResult | null> {
  await rateLimit('nominatim', 1100)
  try {
    const url = `/api/nominatim/reverse?format=json&lat=${lat}&lon=${lng}`
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) return null
    const data = (await res.json()) as {
      display_name?: string
      address?: { state?: string; city?: string; town?: string }
    }
    if (!data.display_name) return null
    return {
      label: data.display_name,
      lat,
      lng,
      city: data.address?.city || data.address?.town,
      stateCode: data.address?.state,
    }
  } catch {
    return null
  }
}

export function toSavedLocation(
  g: GeocodeResult,
  source: SavedAuditLocation['source'] = 'search',
  confirmed = false,
): SavedAuditLocation {
  return {
    id: `loc-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    label: g.label,
    lat: g.lat,
    lng: g.lng,
    stateCode: g.stateCode,
    city: g.city,
    confirmed,
    savedAt: new Date().toISOString(),
    source,
  }
}
