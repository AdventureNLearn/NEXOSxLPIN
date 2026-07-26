/**
 * OpenFEMA — free public API, no key.
 * https://www.fema.gov/about/openfema/api
 * Keyword scan for public-safety / camera / ALPR adjacent grant narratives.
 */

import { rateLimit } from './rateLimit'

export interface OpenFemaHit {
  id: string
  title: string
  summary: string
  dataset: string
  url?: string
  retrievedAt: string
}

export interface OpenFemaSearchResult {
  ok: boolean
  hits: OpenFemaHit[]
  retrievedAt: string
  error?: string
  query: string
}

function femaBase(): string {
  if (typeof window !== 'undefined') return '/api/openfema'
  return 'https://www.fema.gov'
}

/**
 * Lightweight OpenFEMA DisasterDeclarationsSummaries filter as connectivity probe +
 * optional keyword filter on declaration title (not a full grant SOW source).
 * Prefer USASpending for dollar awards; this adds FEMA program context only.
 */
export async function searchOpenFemaContext(
  query: string,
  opts?: { stateCode?: string; limit?: number; signal?: AbortSignal },
): Promise<OpenFemaSearchResult> {
  const retrievedAt = new Date().toISOString()
  const limit = Math.min(opts?.limit ?? 8, 25)
  const q = query.trim()
  try {
    await rateLimit('openfema', 400)
    // Public dataset: DisasterDeclarationsSummaries — free, no key
    const params = new URLSearchParams({
      $top: String(limit),
      $orderby: 'declarationDate desc',
      $format: 'json',
    })
    if (opts?.stateCode) {
      params.set('$filter', `state eq '${opts.stateCode.toUpperCase()}'`)
    }
    const url = `${femaBase()}/api/open/v2/DisasterDeclarationsSummaries?${params.toString()}`
    const res = await fetch(url, {
      signal: opts?.signal,
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) {
      return { ok: false, hits: [], retrievedAt, error: `HTTP ${res.status}`, query: q }
    }
    const json = (await res.json()) as {
      DisasterDeclarationsSummaries?: Array<Record<string, unknown>>
    }
    const rows = json.DisasterDeclarationsSummaries || []
    const keywords = /camera|surveillance|alpr|public safety|homeland|security|fusion/i
    const mapped: OpenFemaHit[] = rows.map((r, i) => {
      const title = String(r.declarationTitle || r.disasterNumber || `FEMA row ${i}`)
      const summary = [
        r.state ? `State ${r.state}` : null,
        r.declarationType ? `Type ${r.declarationType}` : null,
        r.incidentType ? `Incident ${r.incidentType}` : null,
        r.declarationDate ? `Date ${r.declarationDate}` : null,
      ]
        .filter(Boolean)
        .join(' · ')
      return {
        id: String(r.disasterNumber ?? r.id ?? i),
        title,
        summary,
        dataset: 'DisasterDeclarationsSummaries',
        url: 'https://www.fema.gov/about/openfema/data-sets/disaster-declarations-summaries-v2',
        retrievedAt,
      }
    })
    // Prefer keyword-relevant titles; else return recent state declarations as context
    const scored = mapped.filter((h) => keywords.test(h.title + h.summary))
    const hits = (scored.length ? scored : mapped).slice(0, limit)
    return { ok: true, hits, retrievedAt, query: q }
  } catch (e) {
    return {
      ok: false,
      hits: [],
      retrievedAt,
      error: e instanceof Error ? e.message : String(e),
      query: q,
    }
  }
}

export function openFemaMarkdown(r: OpenFemaSearchResult): string {
  if (!r.ok) {
    return `## OpenFEMA context\n\n**Status:** failed — ${r.error || 'unknown'}\n\n_FEMA grant dollar evidence still comes from USASpending / FOIA, not this feed alone._\n`
  }
  if (!r.hits.length) {
    return `## OpenFEMA context\n\n**Status:** Evidence — query ok, no rows returned for filter.\n`
  }
  const lines = r.hits
    .map((h, i) => `${i + 1}. **${h.title}** — ${h.summary}`)
    .join('\n')
  return `## OpenFEMA context (live)

Public disaster/declaration feed for jurisdiction situational context. **Not** a substitute for HSGP/UASI award SOWs.

${lines}

_Queried: ${r.retrievedAt}. Class: Inference for funding linkage unless paired with USASpending award IDs._
`
}
