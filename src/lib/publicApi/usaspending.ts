/**
 * USASpending.gov award search — Funding pillar live spine.
 * Dev browser: /api/usaspending → vite proxy → api.usaspending.gov
 */

import { rateLimit } from './rateLimit'
import {
  DEFAULT_USASPENDING_KEYWORDS,
  type AwardHit,
  type PublicQueryMeta,
  type UsaSpendingSearchResult,
} from './types'

const GRANT_TYPES = ['02', '03', '04', '05'] as const
const CONTRACT_TYPES = ['A', 'B', 'C', 'D'] as const

const AWARD_FIELDS = [
  'Award ID',
  'Recipient Name',
  'Award Amount',
  'Description',
  'Start Date',
  'End Date',
  'Awarding Agency',
  'Awarding Sub Agency',
  'generated_internal_id',
] as const

export { DEFAULT_USASPENDING_KEYWORDS }

function apiBase(): string {
  if (typeof window !== 'undefined') return '/api/usaspending'
  return 'https://api.usaspending.gov'
}

function awardUrl(generatedInternalId?: string, awardId?: string): string | undefined {
  if (generatedInternalId) {
    return `https://www.usaspending.gov/award/${encodeURIComponent(generatedInternalId)}`
  }
  if (awardId) {
    return `https://www.usaspending.gov/search/?hash=false&query=${encodeURIComponent(awardId)}`
  }
  return undefined
}

const STRONG_RE =
  /\b(alpr|anpr|license\s*plate|lpr|plate\s*reader|automated\s+license|flock\s*safety|rekor|number\s*plate)\b/i
const WEAK_RE =
  /\b(surveillance|camera|cctv|video\s+analytic|public\s+safety\s+tech|its\b|roadside)\b/i

export function classifyAlprSignal(text: string): AwardHit['alprSignal'] {
  if (STRONG_RE.test(text)) return 'strong'
  if (WEAK_RE.test(text)) return 'weak'
  return 'none'
}

export function deriveRecipientHint(query: string, locationDescription?: string): string {
  return (
    deriveRecipientName({
      query,
      locationDescription,
    }) || 'United States'
  )
}

export function deriveRecipientName(ctx: {
  query: string
  locationDescription?: string
  jurisdictionHints?: string[]
}): string {
  const blob = [ctx.query, ctx.locationDescription, ...(ctx.jurisdictionHints || [])]
    .filter(Boolean)
    .join(' ')
    .trim()
  if (!blob) return ''

  const agency =
    blob.match(
      /\b([A-Z][A-Za-z .'-]{2,40}\s+(?:Police(?:\s+Department)?|Sheriff(?:'s)?(?:\s+Office)?|Department of Transportation|State Police|Highway Patrol|Public Safety))\b/,
    )?.[1] ||
    blob.match(/\b(City of [A-Z][A-Za-z .'-]+)\b/)?.[1]

  if (agency) return agency.trim()
  if (/atlanta/i.test(blob)) return 'Atlanta'
  if (/fulton/i.test(blob)) return 'Fulton'
  if (/georgia|\bGA\b/i.test(blob)) return 'Georgia'
  if (/illinois|\bIL\b|chicago/i.test(blob)) return 'Illinois'
  if (/virginia|\bVA\b/i.test(blob)) return 'Virginia'
  if (/california|\bCA\b/i.test(blob)) return 'California'

  // Location description alone
  if (ctx.locationDescription?.trim()) return ctx.locationDescription.trim().slice(0, 64)

  const cleaned = blob.replace(/[—–|,]/g, ' ').replace(/\s+/g, ' ').trim()
  // Avoid feeding the entire long audit query as recipient
  if (cleaned.length > 80) {
    const city = cleaned.match(
      /\b(Atlanta|Chicago|Dallas|Houston|Phoenix|Miami|Boston|Seattle|Denver|Detroit)\b/i,
    )
    if (city) return city[1]
  }
  return cleaned.slice(0, 48)
}

function timePeriod(years: number): { start_date: string; end_date: string }[] {
  const end = new Date()
  const start = new Date()
  start.setFullYear(end.getFullYear() - years)
  const fmt = (d: Date) => d.toISOString().slice(0, 10)
  return [{ start_date: fmt(start), end_date: fmt(end) }]
}

type RawRow = Record<string, unknown>

function mapRow(row: RawRow, group: 'grants' | 'contracts', retrievedAt: string): AwardHit {
  const awardId = String(row['Award ID'] ?? '')
  const recipient = String(row['Recipient Name'] ?? '')
  const amountRaw = row['Award Amount']
  const amount = typeof amountRaw === 'number' ? amountRaw : amountRaw != null ? Number(amountRaw) : null
  const description = String(row.Description ?? '')
  const generatedInternalId =
    typeof row.generated_internal_id === 'string' ? row.generated_internal_id : undefined
  const agency = row['Awarding Agency'] != null ? String(row['Awarding Agency']) : undefined
  const text = `${awardId} ${recipient} ${description}`
  return {
    awardId,
    generatedInternalId,
    recipient,
    amount: Number.isFinite(amount as number) ? (amount as number) : null,
    description,
    startDate: (row['Start Date'] as string | null) ?? null,
    endDate: (row['End Date'] as string | null) ?? null,
    agency,
    awardingAgency: agency,
    awardingSubAgency:
      row['Awarding Sub Agency'] != null ? String(row['Awarding Sub Agency']) : undefined,
    url: awardUrl(generatedInternalId, awardId),
    awardGroup: group,
    retrievedAt,
    alprSignal: classifyAlprSignal(text),
  }
}

async function postSpendingByAward(
  body: unknown,
  timeoutMs: number,
  signal?: AbortSignal,
): Promise<{ status: number; json: unknown }> {
  await rateLimit('usaspending', 450)
  const url = `${apiBase()}/api/v2/search/spending_by_award/`
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeoutMs)
  const onAbort = () => ctrl.abort()
  signal?.addEventListener('abort', onAbort)
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    })
    let json: unknown = null
    try {
      json = await res.json()
    } catch {
      json = null
    }
    return { status: res.status, json }
  } finally {
    clearTimeout(t)
    signal?.removeEventListener('abort', onAbort)
  }
}

export interface SearchAwardsOptions {
  recipientName: string
  keywords?: string[]
  years?: number
  limit?: number
  includeContracts?: boolean
  timeoutMs?: number
  signal?: AbortSignal
}

export async function searchAwardsForAgency(opts: SearchAwardsOptions): Promise<UsaSpendingSearchResult> {
  const recipientName = opts.recipientName.trim()
  const keywords = (
    opts.keywords?.length ? opts.keywords : [...DEFAULT_USASPENDING_KEYWORDS]
  ).slice(0, 12)
  const years = opts.years ?? 6
  const limit = Math.min(Math.max(opts.limit ?? 15, 1), 50)
  const timeoutMs = opts.timeoutMs ?? 15000
  const retrievedAt = new Date().toISOString()
  const groups: Array<'grants' | 'contracts'> =
    opts.includeContracts === false ? ['grants'] : ['grants', 'contracts']

  const meta: PublicQueryMeta = {
    recipientName,
    recipientHint: recipientName,
    keywords,
    years,
    limit,
    retrievedAt,
    endpoint: `${apiBase()}/api/v2/search/spending_by_award/`,
    awardGroups: groups,
  }

  if (!recipientName) {
    return {
      status: 'skipped',
      hits: [],
      meta,
      errorMessage: 'recipientName required',
    }
  }

  const hits: AwardHit[] = []
  let lastStatus = 0

  try {
    for (const group of groups) {
      const award_type_codes = group === 'grants' ? [...GRANT_TYPES] : [...CONTRACT_TYPES]
      const keywordBlob = [...keywords, recipientName].join(' ')
      const body = {
        filters: {
          keywords: [keywordBlob],
          time_period: timePeriod(years),
          award_type_codes,
        },
        fields: [...AWARD_FIELDS],
        page: 1,
        limit,
        sort: 'Award Amount',
        order: 'desc',
      }

      const { status, json } = await postSpendingByAward(body, timeoutMs, opts.signal)
      lastStatus = status

      if (status >= 500 || status === 0) {
        const msg =
          json && typeof json === 'object' && json !== null && 'message' in json
            ? String((json as { message: unknown }).message)
            : `HTTP ${status}`
        return {
          status: 'failed',
          hits: [],
          meta,
          errorMessage: msg,
          httpStatus: status,
        }
      }
      if (status >= 400) continue

      const results = (json as { results?: RawRow[] })?.results ?? []
      for (const row of results) {
        const hit = mapRow(row, group, retrievedAt)
        if (!hit.awardId && !hit.recipient) continue
        const recipOk =
          hit.recipient.toLowerCase().includes(recipientName.toLowerCase().slice(0, 12)) ||
          recipientName.toLowerCase().includes(hit.recipient.toLowerCase().slice(0, 12))
        if (recipOk || hit.alprSignal !== 'none') hits.push(hit)
      }
    }

    const seen = new Set<string>()
    const deduped = hits.filter((h) => {
      const k = h.generatedInternalId || h.awardId
      if (!k || seen.has(k)) return false
      seen.add(k)
      return true
    })

    deduped.sort((a, b) => {
      const rank = (s: AwardHit['alprSignal']) => (s === 'strong' ? 0 : s === 'weak' ? 1 : 2)
      const d = rank(a.alprSignal) - rank(b.alprSignal)
      if (d !== 0) return d
      return (b.amount ?? 0) - (a.amount ?? 0)
    })

    const finalHits = deduped.slice(0, limit)
    return {
      status: finalHits.length ? 'ok' : 'zero',
      ok: true,
      hits: finalHits,
      meta,
      httpStatus: lastStatus || 200,
    }
  } catch (e) {
    const err = e instanceof Error ? e.message : String(e)
    return {
      status: 'failed',
      hits: [],
      meta,
      errorMessage: err,
      httpStatus: lastStatus || undefined,
    }
  }
}

export function formatAwardAmount(n: number | null | undefined): string {
  if (n == null || !Number.isFinite(n)) return 'amount n/a'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

export function awardsMarkdownSection(result: UsaSpendingSearchResult): string {
  const { meta, hits, status, errorMessage } = result
  const header = `## USASpending.gov live search (Phase A)

- **Recipient:** ${meta.recipientName || '(none)'}
- **Keywords:** ${meta.keywords.slice(0, 8).join(', ')}
- **Window:** last ${meta.years} years
- **Queried:** ${meta.retrievedAt}
- **Endpoint:** \`${meta.endpoint}\`
`
  if (status === 'skipped') {
    return `${header}\n**Status:** skipped — ${errorMessage || 'no recipient'}\n\n_Static FEDERAL_GRANT_PROGRAMS checklist still applies._\n`
  }
  if (status === 'failed') {
    return `${header}\n**Status:** failed — ${errorMessage || 'unknown'}\n\n_No award amounts invented. FOIA agency ledgers recommended._\n`
  }
  if (status === 'zero' || !hits.length) {
    return `${header}\n**Status:** Evidence — successful search returned **zero** awards.\n\n_Zero-hit is documented Evidence (searched, none found)._\n`
  }
  const lines = hits.slice(0, 20).map((h, i) => {
    const sig =
      h.alprSignal === 'strong' ? 'Evidence' : 'Inference'
    return `${i + 1}. **${h.awardId || 'award'}** — ${h.recipient} — ${formatAwardAmount(h.amount)} [${sig}/${h.alprSignal}]
   - ${h.agency || h.awardingAgency || 'agency n/a'}${h.awardingSubAgency ? ` / ${h.awardingSubAgency}` : ''}
   - ${(h.description || '').slice(0, 220)}${(h.description || '').length > 220 ? '…' : ''}
   - ${h.url || 'no public award URL'}`
  })
  return `${header}\n**Status:** ${hits.length} award row(s)\n\n${lines.join('\n\n')}\n`
}
