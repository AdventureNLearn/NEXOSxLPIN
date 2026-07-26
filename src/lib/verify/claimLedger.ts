/**
 * Per-story claim ledger — objective, sourced, cited, deduped.
 * Tools / primary records over narrative. No twin boilerplate.
 */

import type { EvidenceScore, MaterialClass } from '../../types/core'
import type { ActiveSource } from '../../types/useCase'
import type { ClaimStatus, StoryClaimCard } from '../../data/useCases/stories'
import { getUseCase } from '../../data/useCases/catalog'
import { getActiveSourcesForDesk } from '../../data/useCases/activeSources'
import { CONGRESS_SOURCES_BY_DESK } from '../../data/useCases/congressSources'
import { getCongressDeskSeedMeta } from '../../data/useCases/congressDesks'
import { dedupeByText, looksLikeBoilerplate, claimPackIsBoilerplate } from './dedupe'

export interface LedgedClaim extends StoryClaimCard {
  sourceIds: string[]
  citations: string[]
  material: MaterialClass
  claimKey: string
}

function statusFromScore(score: EvidenceScore): ClaimStatus {
  if (score === 1) return 'supported'
  if (score === -1) return 'disputed'
  return 'uncertain'
}

function cite(src: ActiveSource | undefined): string {
  if (!src) return 'unlinked'
  const pub = src.publisher || src.title
  return src.publicRecord ? `${pub} (public record)` : pub
}

function pickSources(sources: ActiveSource[], n = 3): ActiveSource[] {
  const primary = sources.filter((s) => s.publicRecord || s.kind === 'official' || s.kind === 'data')
  const pool = primary.length ? primary : sources
  return pool.slice(0, n)
}

/** Tag → granular, non-narrative verification claims (objective tools) */
const TAG_CLAIMS: Record<
  string,
  Array<{
    plain: (ctx: ClaimCtx) => string
    score: EvidenceScore
    why: string
    material: MaterialClass
  }>
> = {
  semiconductor: [
    {
      plain: (c) =>
        `BIS export-control public pages are a primary-record entry point for operators assessing ${c.topic} duties — not a substitute for the specific EAR instrument cited.`,
      score: 1,
      why: 'Agency primary hierarchy; instrument still required for +1 duty claims.',
      material: 'secondary',
    },
    {
      plain: (c) =>
        `Foundry / advanced-node capacity claims for ${c.industry} require facility-class or shipment data, not influencer tallies.`,
      score: 0,
      why: 'Magnitude unproven without primary capacity or trade data.',
      material: 'assumption',
    },
  ],
  export: [
    {
      plain: (c) =>
        `Export-control classification for items tied to ${c.topic} is instrument-specific; a viral summary cannot establish license requirements.`,
      score: -1,
      why: 'Disqualify social-only duty claims.',
      material: 'assumption',
    },
  ],
  biometric: [
    {
      plain: (c) =>
        `Procurement ethics for biometric systems serving ${c.industry} should be scored from solicitation / award records and GAO-style reviews, not vendor marketing decks alone.`,
      score: 1,
      why: 'Prefer procurement primary over marketing.',
      material: 'derived',
    },
  ],
  coop: [
    {
      plain: (c) =>
        `COOP / continuity contractor readiness claims need plan references or exercise AARs; a single social clip does not prove ${c.industry} readiness.`,
      score: -1,
      why: 'Continuity claims require plan/exercise artifacts.',
      material: 'assumption',
    },
  ],
  oss: [
    {
      plain: (c) =>
        `Federal OSS supply-chain risk claims should cite SBOM / CISA guidance or agency policy pages before asserting mandate status for ${c.industry}.`,
      score: 1,
      why: 'CISA / policy hierarchy over blog summaries.',
      material: 'secondary',
    },
  ],
  sbom: [
    {
      plain: () =>
        `Presence of an SBOM artifact is evidence of process maturity, not proof that all transitive vulnerabilities are remediated.`,
      score: 0,
      why: 'SBOM ≠ cleared risk.',
      material: 'derived',
    },
  ],
  drone: [
    {
      plain: (ctx) =>
        `BVLOS commercial corridor claims require FAA UAS rule / waiver language; operator marketing cannot establish legal corridor status for ${ctx.industry}.`,
      score: -1,
      why: 'FAA primary only for corridor legality.',
      material: 'assumption',
    },
  ],
  nuclear: [
    {
      plain: (ctx) =>
        `SMR licensing timeline claims that affect ${ctx.industry} capital must cite NRC docket or order text; press “fast-track” language is not a schedule.`,
      score: 0,
      why: 'Schedule = docket, not headline.',
      material: 'assumption',
    },
  ],
  tribal: [
    {
      plain: () =>
        `Cross-jurisdiction ROW / tribal energy routing claims require identifying which sovereign / agency instrument governs each segment — single-map overlays are insufficient.`,
      score: 1,
      why: 'Jurisdiction segmentation is the unit of analysis.',
      material: 'derived',
    },
  ],
  disaster: [
    {
      plain: () =>
        `Debris / recovery contractor oversight claims should start from FEMA / locality contract vehicles and payment records, not viral damage tours.`,
      score: 1,
      why: 'Contract primary over media.',
      material: 'secondary',
    },
  ],
  freightdata: [
    {
      plain: (ctx) =>
        `Freight data-sharing transparency claims for ${ctx.industry} need the governing FMCSA / statute citation before asserting a disclosure duty.`,
      score: 0,
      why: 'Duty requires instrument.',
      material: 'assumption',
    },
  ],
  pharmacy: [
    {
      plain: () =>
        `340B / pharmacy-desert industry-effect claims require HRSA program materials plus locality pharmacy access data — not a single hospital press release.`,
      score: 0,
      why: 'Program + locality data required.',
      material: 'assumption',
    },
  ],
  carbon: [
    {
      plain: (ctx) =>
        `Carbon offset integrity claims affecting ${ctx.industry} should cite protocol / registry methodology pages, not broker marketing alone.`,
      score: 1,
      why: 'Methodology primary.',
      material: 'secondary',
    },
  ],
  digital: [
    {
      plain: (ctx) =>
        `Digital identity / IdP effect claims need Login.gov or agency IdP policy pages before asserting private-sector duty for ${ctx.industry}.`,
      score: 1,
      why: 'IdP policy hierarchy.',
      material: 'secondary',
    },
  ],
  mining: [
    {
      plain: () =>
        `Hardrock / mining-claim cost claims require BLM or statute language plus site-class assumptions — viral claim-stake maps are not cost models.`,
      score: 0,
      why: 'Cost = instrument + site assumptions.',
      material: 'assumption',
    },
  ],
  broadcast: [
    {
      plain: (ctx) =>
        `Broadcast ownership-cap claims must cite FCC rule text / NPRM before asserting a change in market structure for ${ctx.industry}.`,
      score: 1,
      why: 'FCC primary.',
      material: 'secondary',
    },
  ],
  aws: [
    {
      plain: (ctx) =>
        `Autonomous weapons dual-use export claims for ${ctx.industry} require State DDTC / ITAR-adjacent public materials — not conference talk slides.`,
      score: -1,
      why: 'Export duty = control list / license path.',
      material: 'assumption',
    },
  ],
  meddevice: [
    {
      plain: () =>
        `Medical device cybersecurity premarket burden claims should cite FDA guidance pages; LinkedIn threat posts are not premarket criteria.`,
      score: 1,
      why: 'FDA guidance hierarchy.',
      material: 'secondary',
    },
  ],
  ai: [
    {
      plain: (ctx) =>
        `Frontier AI industry-effect claims for ${ctx.industry} should separate measurement (NIST-class) from statutory duty (bill / agency instrument).`,
      score: 1,
      why: 'Split measurement vs duty.',
      material: 'derived',
    },
  ],
}

interface ClaimCtx {
  topic: string
  industry: string
  agency: string
  billHint: string
  deskId: string
  title: string
}

function baseClaims(ctx: ClaimCtx, sources: ActiveSource[]): LedgedClaim[] {
  const [a, b, c] = pickSources(sources, 3)
  const agencySrc = sources.find((s) =>
    s.title.toLowerCase().includes(ctx.agency.toLowerCase().slice(0, 4)),
  ) || a
  const congressSrc =
    sources.find((s) => /congress/i.test(s.title) || /congress\.gov/i.test(s.url)) || b || a
  const gaoSrc = sources.find((s) => /gao|crs/i.test(s.title)) || c || b || a

  const rows: Array<Omit<LedgedClaim, 'claimKey' | 'status'>> = [
    {
      plain: `${ctx.agency} public materials are a valid primary-record starting point for ${ctx.title}, but duty claims still need the specific instrument (rule, order, statute section) cited.`,
      score: 1,
      why: `Agency entry (${ctx.agency}) ≠ enrolled obligation.`,
      material: 'secondary',
      sourceIds: agencySrc ? [agencySrc.id] : [],
      citations: [cite(agencySrc)],
    },
    {
      plain: `A social post or secondary commentary alone does not establish enforceable legal duties for ${ctx.industry} under ${ctx.title}.`,
      score: -1,
      why: 'Social-only duty claims are disqualifying without primary text.',
      material: 'assumption',
      sourceIds: [],
      citations: ['method gate · no primary'],
    },
    {
      plain: `Congress.gov / legislative search navigation for “${ctx.billHint || ctx.topic}” is a discovery aid — search result pages are not enrolled bill text.`,
      score: 1,
      why: 'Search ≠ statute; open specific measures for operative language.',
      material: 'secondary',
      sourceIds: congressSrc ? [congressSrc.id] : [],
      citations: [cite(congressSrc)],
    },
    {
      plain: `Private compliance cost and market-access effects on ${ctx.industry} can move when oversight instruments change — direction is plausible; magnitude is unproven without firm-level or sector studies.`,
      score: 0,
      why: 'Direction ≠ quantified impact.',
      material: 'derived',
      sourceIds: gaoSrc ? [gaoSrc.id] : [],
      citations: [cite(gaoSrc)],
    },
    {
      plain: `Impact of any rule change on ${ctx.industry} is heterogeneous by firm size, product line, and jurisdiction — identical-cost claims across all firms remain unproven.`,
      score: 0,
      why: 'Heterogeneous impact — hold at 0 until analysis.',
      material: 'assumption',
      sourceIds: gaoSrc ? [gaoSrc.id] : [],
      citations: [cite(gaoSrc)],
    },
  ]

  return rows.map((r, i) => ({
    ...r,
    status: statusFromScore(r.score),
    claimKey: `${ctx.deskId}::base::${i}`,
  }))
}

function tagClaims(ctx: ClaimCtx, sources: ActiveSource[], tags: string[]): LedgedClaim[] {
  const out: LedgedClaim[] = []
  const pool = pickSources(sources, 4)
  let i = 0
  for (const tag of tags) {
    const bank = TAG_CLAIMS[tag.toLowerCase()]
    if (!bank) continue
    for (const row of bank) {
      const src = pool[i % Math.max(pool.length, 1)]
      i++
      out.push({
        plain: row.plain(ctx),
        score: row.score,
        status: statusFromScore(row.score),
        why: row.why,
        material: row.material,
        sourceIds: src ? [src.id] : [],
        citations: [cite(src)],
        claimKey: `${ctx.deskId}::tag::${tag}::${i}`,
      })
    }
  }
  return out
}

function sourcesForDesk(deskId: string): ActiveSource[] {
  const cong = CONGRESS_SOURCES_BY_DESK[deskId]
  if (cong?.length) return cong
  return getActiveSourcesForDesk(deskId) ?? []
}

/** Extract agency / industry hints from seed meta or profile */
function contextFromProfile(deskId: string): ClaimCtx {
  const seed = getCongressDeskSeedMeta(deskId)
  if (seed) {
    return {
      deskId,
      title: seed.title,
      topic: seed.short,
      industry: seed.industry,
      agency: seed.agency,
      billHint: seed.billHint.replace(/^Congress\.gov search:\s*/i, '').slice(0, 80),
    }
  }
  const p = getUseCase(deskId)
  const report = p.report
  const lede = report?.executiveSummary || p.description || ''
  const agencyMatch = lede.match(/Prefer ([A-Za-z0-9 /.]+) and Congress/i)
  const agency =
    agencyMatch?.[1]?.trim() ||
    (p.sampleClaimHints?.[0] ?? 'Agency').split(' ')[0] ||
    'Agency'
  const title = p.label.replace(/^[①-⑩0-9.\s#]+/, '').trim()
  const industry =
    p.tagline.split(/for |on /i).pop()?.slice(0, 80) || 'affected operators'
  const billHint =
    report?.sourcesToSeek?.find((s) => /congress/i.test(s))?.replace(/^.*search:\s*/i, '') ||
    title
  return {
    deskId,
    title,
    topic: title,
    industry: industry.slice(0, 100),
    agency,
    billHint: billHint.slice(0, 80),
  }
}

/**
 * Build a full, sourced claim ledger for a desk.
 * Replaces boilerplate packs; preserves unique curated claims when already good.
 */
export function buildClaimLedger(
  deskId: string,
  existing?: Array<{ plain: string; score: EvidenceScore; why: string; sourceIds?: string[] }>,
): LedgedClaim[] {
  const sources = sourcesForDesk(deskId)
  const ctx = contextFromProfile(deskId)
  const seed = getCongressDeskSeedMeta(deskId)
  const profile = getUseCase(deskId)
  const tagBits = [
    ...(seed?.tags ?? []),
    ...(profile.sampleClaimHints ?? []),
    ...deskId.replace(/^cong-\d+-/, '').split('-'),
  ]
    .join(' ')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2)
  const allTags = Array.from(new Set(tagBits)).slice(0, 12)

  const existingTexts = (existing ?? []).map((e) => e.plain)
  const useExisting =
    existing &&
    existing.length > 0 &&
    !claimPackIsBoilerplate(existingTexts) &&
    !existingTexts.every(looksLikeBoilerplate)

  let built: LedgedClaim[] = []

  if (useExisting && existing) {
    built = existing.map((e, i) => {
      const linked = (e.sourceIds?.length ? e.sourceIds : pickSources(sources, 1).map((s) => s.id)).filter(
        Boolean,
      )
      const cites = linked.map((id) => cite(sources.find((s) => s.id === id)))
      return {
        plain: e.plain,
        score: e.score,
        status: statusFromScore(e.score),
        why: e.why,
        material: (e.score === 1 ? 'secondary' : e.score === -1 ? 'assumption' : 'derived') as MaterialClass,
        sourceIds: linked,
        citations: cites.length ? cites : ['attach primary'],
        claimKey: `${deskId}::curated::${i}`,
      }
    })
  } else {
    built = [...baseClaims(ctx, sources), ...tagClaims(ctx, sources, allTags)]
  }

  // Always ensure at least one primary-linked claim when sources exist
  if (sources.length && !built.some((c) => c.sourceIds.length)) {
    const s0 = sources[0]!
    built.unshift({
      plain: `${s0.publisher || s0.title} is linked as a desk source for ${ctx.title}: ${s0.why}`,
      score: 1,
      status: 'supported',
      why: 'Desk source binding.',
      material: 'secondary',
      sourceIds: [s0.id],
      citations: [cite(s0)],
      claimKey: `${deskId}::bind::0`,
    })
  }

  return dedupeByText(built, (c) => c.plain, 0.82).slice(0, 14)
}

/** Map ledger → evidence board items with real sourceRefs */
export function ledgerToEvidence(
  deskId: string,
  ledger: LedgedClaim[],
): Array<{
  title: string
  summary: string
  score: EvidenceScore
  material: MaterialClass
  tags: string[]
  sourceRefs: string[]
}> {
  return ledger.map((c) => ({
    title: c.plain.slice(0, 140),
    summary: `${c.why}${c.citations.length ? ` · Cite: ${c.citations.join('; ')}` : ''}`,
    score: c.score,
    material: c.material,
    tags: ['ledger', deskId, c.material],
    sourceRefs: c.sourceIds.length ? c.sourceIds : [],
  }))
}
