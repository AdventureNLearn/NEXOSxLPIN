/**
 * Shared public-API types — Phase A USASpending.
 */

import type { ClaimConfidence, EvidenceClass } from '../../types/audit'

export const DEFAULT_USASPENDING_KEYWORDS = [
  'ALPR',
  'license plate',
  'license plate reader',
  'automated license plate',
  'ANPR',
  'surveillance camera',
  'public safety camera',
  'Flock',
  'Rekor',
  'Motorola',
  'ITS camera',
  'traffic camera',
  'roadside camera',
] as const

export interface PublicQueryMeta {
  recipientName: string
  recipientHint?: string
  keywords: string[]
  years: number
  limit: number
  retrievedAt: string
  endpoint: string
  awardGroups?: Array<'grants' | 'contracts'>
}

export interface AwardHit {
  awardId: string
  generatedInternalId?: string
  recipient: string
  amount: number | null
  description: string
  startDate?: string | null
  endDate?: string | null
  agency?: string
  awardingAgency?: string
  awardingSubAgency?: string
  cfda?: string
  url?: string
  awardGroup: 'grants' | 'contracts'
  retrievedAt: string
  alprSignal: 'strong' | 'weak' | 'none'
}

export type UsaSearchStatus = 'ok' | 'zero' | 'failed' | 'skipped'

export interface UsaSpendingSearchResult {
  status: UsaSearchStatus
  ok?: boolean
  hits: AwardHit[]
  meta: PublicQueryMeta
  errorMessage?: string
  error?: string
  httpStatus?: number
}

export type { EvidenceClass, ClaimConfidence }
