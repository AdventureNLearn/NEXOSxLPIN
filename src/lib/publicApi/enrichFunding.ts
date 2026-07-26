/**
 * Attach USASpending live results to an AuditTarget (Funding pillar).
 * Static FEDERAL_GRANT_PROGRAMS checklist always remains; live data is additive.
 */

import type { AuditTarget, MissingDataItem } from '../../types/audit'
import { bridgeUsaSpendingResult, classifyAwardHit, liveFundingMarkdown } from './evidenceBridge'
import { deriveRecipientName, searchAwardsForAgency } from './usaspending'
import type { UsaSpendingSearchResult } from './types'
import { DEFAULT_USASPENDING_KEYWORDS } from './types'

function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export interface EnrichFundingResult {
  audit: AuditTarget
  usaResult: UsaSpendingSearchResult | null
  logLine: string
  fundingMarkdownSection: string
}

export async function enrichAuditWithUsaSpending(
  audit: AuditTarget,
  opts?: { keywords?: string[]; years?: number; limit?: number; timeoutMs?: number },
): Promise<EnrichFundingResult> {
  const recipientName = deriveRecipientName({
    query: audit.query,
    locationDescription: audit.spatial.locationDescription,
    jurisdictionHints: audit.spatial.jurisdictionHints,
  })

  if (!recipientName) {
    const skipped: UsaSpendingSearchResult = {
      status: 'skipped',
      hits: [],
      meta: {
        recipientName: '',
        keywords: [...DEFAULT_USASPENDING_KEYWORDS],
        years: opts?.years ?? 6,
        limit: opts?.limit ?? 15,
        retrievedAt: new Date().toISOString(),
        endpoint: '/api/usaspending/api/v2/search/spending_by_award/',
      },
      errorMessage: 'No jurisdiction/agency/recipient string derived from query or location',
    }
    return {
      audit,
      usaResult: skipped,
      logLine: 'USASpending SKIP · no recipient derived from query/location',
      fundingMarkdownSection: liveFundingMarkdown(skipped),
    }
  }

  const usaResult = await searchAwardsForAgency({
    recipientName,
    keywords: opts?.keywords,
    years: opts?.years ?? 6,
    limit: opts?.limit ?? 15,
    timeoutMs: opts?.timeoutMs ?? 15000,
  })

  const bridged = bridgeUsaSpendingResult(usaResult)
  const now = new Date().toISOString()

  const liveUsaSpending = {
    status: usaResult.status,
    recipientName: usaResult.meta.recipientName || recipientName,
    recipientHint: usaResult.meta.recipientName || recipientName,
    keywords: usaResult.meta.keywords,
    retrievedAt: usaResult.meta.retrievedAt,
    queriedAt: usaResult.meta.retrievedAt,
    endpoint: usaResult.meta.endpoint,
    hitCount: usaResult.hits.length,
    errorMessage: usaResult.errorMessage,
    error: usaResult.errorMessage,
    hits: usaResult.hits.map((h) => {
      const cls = classifyAwardHit(h)
      return {
        awardId: h.awardId,
        recipient: h.recipient,
        amount: h.amount,
        amountKnown: h.amount != null,
        description: h.description,
        agency: h.agency,
        awardingAgency: h.awardingAgency || h.agency,
        cfda: h.cfda,
        url: h.url,
        class: cls.class,
        confidence: cls.confidence,
        alprSignal: h.alprSignal,
        awardGroup: h.awardGroup,
      }
    }),
    awards: usaResult.hits.map((h) => ({
      awardId: h.awardId,
      recipient: h.recipient,
      amount: h.amount,
      description: h.description.slice(0, 400),
      awardingAgency: h.awardingAgency || h.agency,
      url: h.url,
      alprSignal: h.alprSignal,
      awardGroup: h.awardGroup,
    })),
    markdown: liveFundingMarkdown(usaResult),
  }

  const federalExtra =
    usaResult.status === 'ok'
      ? usaResult.hits.map((h) => {
          const cls = classifyAwardHit(h)
          return {
            id: uid('fed-live'),
            sourceClass: 'federal_grant',
            label: `USASpending ${h.awardId} — ${h.recipient}`,
            amountKnown: h.amount != null,
            amountNote:
              h.amount != null
                ? `Published obligation ${h.amount} (USASpending)`
                : 'Amount not published on USASpending row — do not invent',
            evidenceStatus: 'partial',
            claimClass: cls.class,
            confidence: cls.confidence,
            notes: [
              h.description?.slice(0, 200) || 'No description in API row',
              h.agency ? `Agency: ${h.agency}` : null,
              cls.reason,
            ]
              .filter(Boolean)
              .join(' · '),
            federalProgramId: undefined as string | undefined,
          }
        })
      : []

  const missingData: MissingDataItem[] = [...audit.missingData]
  if (bridged.missingField) {
    missingData.push({
      id: uid('miss-usa'),
      field: bridged.missingField.field,
      whyItMatters: bridged.missingField.whyItMatters,
      suggestedRecord: bridged.missingField.suggestedRecord,
      blocksLevel: 2,
    })
  }

  const privacy = audit.privacy
    ? {
        ...audit.privacy,
        funding: audit.privacy.funding
          ? {
              ...audit.privacy.funding,
              federalGrantDollars: [...federalExtra, ...audit.privacy.funding.federalGrantDollars],
              discourseNotes: [bridged.logLine, ...audit.privacy.funding.discourseNotes],
              liveUsaSpending,
            }
          : {
              separationRule:
                'MANDATORY SEPARATION: local LE own-source vs federal grant dollars (live USASpending attached when available).',
              localLeBudget: [],
              federalGrantDollars: federalExtra,
              otherOrMixed: [],
              launderingRisks: [],
              requiredPublicDisclosures: [],
              allFundableFederalPrograms: [],
              discourseNotes: [bridged.logLine],
              liveUsaSpending,
            },
      }
    : audit.privacy

  const next: AuditTarget = {
    ...audit,
    updatedAt: now,
    privacy,
    sources: [
      ...audit.sources.filter((s) => !bridged.sources.some((b) => b.id === s.id)),
      ...bridged.sources,
    ],
    evidenceItems: [...audit.evidenceItems, ...bridged.evidence],
    findings: [...audit.findings, ...bridged.findings],
    claims: [...audit.claims, ...bridged.claims],
    missingData,
    fileTags: Array.from(new Set([...audit.fileTags, 'usaspending-live', `usa-${usaResult.status}`])),
    structuredBriefMarkdown: `${audit.structuredBriefMarkdown}\n\n${liveFundingMarkdown(usaResult)}`,
  }

  return {
    audit: next,
    usaResult,
    logLine: bridged.logLine,
    fundingMarkdownSection: liveFundingMarkdown(usaResult),
  }
}
