/**
 * Map USASpending rows → EvidenceItem / SourceRef / findings (evidence-gated).
 */

import type {
  ClaimConfidence,
  ComplianceFinding,
  EvidenceClass,
  EvidenceItem,
  GatedClaim,
  SourceRef,
} from '../../types/audit'
import { formatAwardAmount, awardsMarkdownSection } from './usaspending'
import type { AwardHit, PublicQueryMeta, UsaSpendingSearchResult } from './types'

function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function classifyAwardHit(h: AwardHit): {
  class: EvidenceClass
  confidence: ClaimConfidence
  reason: string
} {
  if (h.alprSignal === 'strong' && h.awardId) {
    return {
      class: 'Evidence',
      confidence: 'high',
      reason: 'Award id + strong ALPR/plate language in public description',
    }
  }
  if (h.alprSignal === 'weak') {
    return {
      class: 'Inference',
      confidence: 'medium',
      reason: 'Camera/surveillance language without explicit ALPR — FOIA SOW to confirm',
    }
  }
  return {
    class: 'Inference',
    confidence: 'low',
    reason: 'Keyword/recipient match only — not treated as hard ALPR purchase proof',
  }
}

export interface BridgeResult {
  sources: SourceRef[]
  evidence: EvidenceItem[]
  claims: GatedClaim[]
  findings: ComplianceFinding[]
  missingField?: { field: string; whyItMatters: string; suggestedRecord: string }
  logLine: string
}

export function liveFundingMarkdown(result: UsaSpendingSearchResult): string {
  return awardsMarkdownSection(result)
}

export function bridgeUsaSpendingResult(result: UsaSpendingSearchResult): BridgeResult {
  const meta = result.meta
  const now = meta.retrievedAt

  if (result.status === 'skipped') {
    return {
      sources: [],
      evidence: [],
      claims: [],
      findings: [],
      logLine: `USASpending SKIP · ${result.errorMessage || 'no recipient'}`,
    }
  }

  if (result.status === 'failed') {
    const src: SourceRef = {
      id: `usaspending-fail-${now.slice(0, 19)}`,
      title: 'USASpending.gov query failure',
      citation: result.errorMessage || 'unknown error',
      url: 'https://api.usaspending.gov/',
      retrievedAt: now,
      publicRecord: true,
    }
    return {
      sources: [src],
      evidence: [
        {
          id: uid('ev'),
          title: 'USASpending live query unavailable',
          summary: `Could not complete live award search (${result.errorMessage || 'error'}). Static catalog remains. Do not invent amounts.`,
          class: 'Assumption',
          confidence: 'low',
          sourceIds: [src.id],
          tags: ['funding', 'usaspending', 'live-fail'],
          createdAt: now,
        },
      ],
      claims: [],
      findings: [],
      missingField: {
        field: 'USASpending live query',
        whyItMatters: 'Without live award rows, federal funding column stays checklist-only',
        suggestedRecord: `Retry USASpending / FOIA grant ledger. Error: ${result.errorMessage || 'unknown'}. Recipient: ${meta.recipientName}`,
      },
      logLine: `USASpending FAIL · ${result.errorMessage || 'error'} · recipient="${meta.recipientName}"`,
    }
  }

  if (result.status === 'zero' || !result.hits.length) {
    const src: SourceRef = {
      id: `usaspending-zero-${now.slice(0, 19)}`,
      title: 'USASpending.gov award search (zero hits)',
      citation: `Recipient "${meta.recipientName}"; keywords [${meta.keywords.slice(0, 6).join(', ')}]; years=${meta.years}`,
      url: 'https://www.usaspending.gov/',
      retrievedAt: now,
      publicRecord: true,
    }
    const claim: GatedClaim = {
      id: uid('claim'),
      statement: `USASpending live search found no federal awards matching recipient "${meta.recipientName}" and ALPR/roadside keywords in the last ${meta.years} years.`,
      class: 'Evidence',
      confidence: 'high',
      sources: [src.id],
    }
    return {
      sources: [src],
      evidence: [
        {
          id: uid('ev'),
          title: 'USASpending search completed — zero awards',
          summary: `Live query for "${meta.recipientName}" returned no award rows. Documented zero-hit (Evidence).`,
          class: 'Evidence',
          confidence: 'high',
          sourceIds: [src.id],
          tags: ['funding', 'usaspending', 'zero-hit', 'live'],
          createdAt: now,
        },
      ],
      claims: [claim],
      findings: [
        {
          id: uid('find'),
          framework: 'FUNDING_SEPARATION',
          controlOrSection: 'USASpending live — zero hit',
          title: 'No federal award rows on live keyword/recipient search',
          status: 'partial',
          publicProtectionFocus: true,
          claim,
          remediationHint:
            'FOIA local LE purchase orders and pass-through grants not keyword-indexed; keep dual-column matrix.',
        },
      ],
      logLine: `USASpending ZERO · recipient="${meta.recipientName}" · Evidence (searched, none found)`,
    }
  }

  return awardHitsToEvidence(result.hits, meta)
}

export function awardHitsToEvidence(hits: AwardHit[], meta: PublicQueryMeta): BridgeResult {
  const now = meta.retrievedAt
  const sources: SourceRef[] = []
  const evidence: EvidenceItem[] = []
  const claims: GatedClaim[] = []

  const batchSrc: SourceRef = {
    id: `usaspending-batch-${now.slice(0, 19)}`,
    title: 'USASpending.gov live award search',
    citation: `Recipient "${meta.recipientName}"; n=${hits.length}; keywords [${meta.keywords.slice(0, 6).join(', ')}]`,
    url: 'https://api.usaspending.gov/',
    retrievedAt: now,
    publicRecord: true,
  }
  sources.push(batchSrc)

  for (const h of hits.slice(0, 15)) {
    const cls = classifyAwardHit(h)
    const srcId = `award-${(h.generatedInternalId || h.awardId || uid('a')).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 48)}`
    sources.push({
      id: srcId,
      title: `Award ${h.awardId} — ${h.recipient}`,
      citation: `${h.agency || 'Federal agency'}; ${formatAwardAmount(h.amount)}; ${(h.description || '').slice(0, 160)}`,
      url: h.url,
      retrievedAt: h.retrievedAt,
      publicRecord: true,
    })
    evidence.push({
      id: uid('ev'),
      title: `Federal award ${h.awardId || '(id n/a)'}`,
      summary: `${h.recipient} · ${formatAwardAmount(h.amount)} · ${h.agency || 'agency n/a'} · ${cls.reason}. ${(h.description || '').slice(0, 180)}`,
      class: cls.class,
      confidence: cls.confidence,
      sourceIds: [srcId, batchSrc.id],
      tags: ['funding', 'usaspending', 'live', h.alprSignal, h.awardGroup],
      createdAt: h.retrievedAt,
    })
    claims.push({
      id: uid('claim'),
      statement: `USASpending lists award ${h.awardId} to ${h.recipient} for ${formatAwardAmount(h.amount)} (${h.awardGroup}). Class=${cls.class} (${cls.reason}).`,
      class: cls.class,
      confidence: cls.confidence,
      sources: [srcId],
      notes: h.alprSignal !== 'strong' ? 'Confirm SOW via FOIA before hard ALPR purchase claim.' : undefined,
    })
  }

  const strong = hits.filter((h) => h.alprSignal === 'strong').length
  const findings: ComplianceFinding[] = [
    {
      id: uid('find'),
      framework: 'FUNDING_SEPARATION',
      controlOrSection: 'USASpending live awards',
      title:
        strong > 0
          ? `Live federal awards with ALPR/plate signal (n=${strong}/${hits.length})`
          : `Live federal awards require SOW confirmation (n=${hits.length})`,
      status: strong > 0 ? 'partial' : 'unknown',
      publicProtectionFocus: true,
      claim: claims[0],
      remediationHint:
        'Place each award ID on the federal column of the dual-column matrix; FOIA SOW for weak-signal rows.',
    },
  ]

  return {
    sources,
    evidence,
    claims,
    findings,
    logLine: `USASpending OK · recipient="${meta.recipientName}" · hits=${hits.length} · strongALPR=${strong}`,
  }
}
