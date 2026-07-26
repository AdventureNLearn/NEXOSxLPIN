/**
 * Claim Status Visual System (P0) — pure mapping + tokens.
 * Spec: docs/NEXOSxLPIN_UI_Supercharge_Spec_v1.0.md
 * Reference: docs/NEXOSxLPIN_UI_ClaimStatus_Components.tsx.ref
 *
 * Reusable by ledger rows, map pins, and later Massing materials.
 * Does not change scoring semantics — presentation only.
 */

import type { EvidenceScore } from '../../types/core'

/** Visual status: tri-state scores OR honesty-rule plausible flag (not a fourth score). */
export type ClaimVisualStatus =
  | { kind: 'scored'; score: EvidenceScore }
  | { kind: 'plausible' }

export type StatusVisualKey = 'supported' | 'hold' | 'disputed' | 'plausible'

export interface StatusVisual {
  key: StatusVisualKey
  /** Left rail Tailwind bg class */
  rail: string
  /** Badge Tailwind classes */
  badge: string
  /** Primary claim text Tailwind class */
  text: string
  /** Hex for map pins / 3D emissive later */
  pin: string
  /** CSS variable name */
  cssVar: string
}

/** Spec §3.2 — never use for pure decoration. */
export const STATUS_VISUAL: Record<StatusVisualKey, StatusVisual> = {
  supported: {
    key: 'supported',
    rail: 'bg-[var(--status-supported)]',
    badge:
      'bg-[color-mix(in_srgb,var(--status-supported)_15%,transparent)] text-emerald-400 border-[color-mix(in_srgb,var(--status-supported)_35%,transparent)]',
    text: 'text-slate-100 font-medium',
    pin: '#22c55e',
    cssVar: '--status-supported',
  },
  hold: {
    key: 'hold',
    rail: 'bg-[var(--status-hold)]',
    badge:
      'bg-[color-mix(in_srgb,var(--status-hold)_15%,transparent)] text-amber-400 border-[color-mix(in_srgb,var(--status-hold)_35%,transparent)]',
    text: 'text-slate-300',
    pin: '#f59e0b',
    cssVar: '--status-hold',
  },
  disputed: {
    key: 'disputed',
    rail: 'bg-[var(--status-disputed)]',
    badge:
      'bg-[color-mix(in_srgb,var(--status-disputed)_15%,transparent)] text-rose-400 border-[color-mix(in_srgb,var(--status-disputed)_35%,transparent)]',
    text: 'text-slate-400',
    pin: '#f43f5e',
    cssVar: '--status-disputed',
  },
  plausible: {
    key: 'plausible',
    rail: 'bg-[var(--status-plausible)]',
    badge:
      'bg-[color-mix(in_srgb,var(--status-plausible)_15%,transparent)] text-violet-300 border-[color-mix(in_srgb,var(--status-plausible)_35%,transparent)]',
    text: 'text-slate-300',
    pin: '#a78bfa',
    cssVar: '--status-plausible',
  },
}

export function scoredStatus(score: EvidenceScore): ClaimVisualStatus {
  return { kind: 'scored', score }
}

export function resolveStatusVisual(status: ClaimVisualStatus): StatusVisual {
  if (status.kind === 'plausible') return STATUS_VISUAL.plausible
  if (status.score === 1) return STATUS_VISUAL.supported
  if (status.score === 0) return STATUS_VISUAL.hold
  return STATUS_VISUAL.disputed
}

export function scoreLabel(status: ClaimVisualStatus): string {
  if (status.kind === 'plausible') return 'plausible'
  if (status.score === 1) return '+1'
  if (status.score === 0) return '0'
  return '−1'
}

/** Map pin / 3D accent hex from visual status. */
export function pinColorForStatus(status: ClaimVisualStatus): string {
  return resolveStatusVisual(status).pin
}

export function pinColorForScore(score?: EvidenceScore): string {
  if (score === undefined) return STATUS_VISUAL.hold.pin
  return pinColorForStatus(scoredStatus(score))
}

/**
 * Highest-stakes status for a desk: open −1 first, then hold (0), then +1.
 * Aligns map pin with Spec §4.2 “primary / highest-stakes claim”.
 */
export function highestStakesStatus(scores: EvidenceScore[]): ClaimVisualStatus {
  if (scores.some((s) => s === -1)) return { kind: 'scored', score: -1 }
  if (scores.some((s) => s === 0)) return { kind: 'scored', score: 0 }
  if (scores.some((s) => s === 1)) return { kind: 'scored', score: 1 }
  return { kind: 'scored', score: 0 }
}

/** Story claim card → visual status (tri-state only unless explicitly plausible). */
export function visualFromStoryClaim(input: {
  score: EvidenceScore
  status?: string
  tags?: string[]
}): ClaimVisualStatus {
  const tags = (input.tags ?? []).map((t) => t.toLowerCase())
  if (
    tags.includes('plausible') ||
    tags.includes('plausible-unverified') ||
    tags.includes('plausible_unverified') ||
    input.status === 'plausible'
  ) {
    return { kind: 'plausible' }
  }
  return { kind: 'scored', score: input.score }
}

/** Evidence ledger item → visual status + source friction inputs. */
export function visualFromEvidence(item: {
  score: EvidenceScore
  material?: string
  tags?: string[]
  sourceRefs?: string[]
}): {
  status: ClaimVisualStatus
  hasBoundPrimarySource: boolean
} {
  const tags = (item.tags ?? []).map((t) => t.toLowerCase())
  const hasBoundPrimarySource = (item.sourceRefs?.length ?? 0) > 0
  if (
    tags.includes('plausible') ||
    tags.includes('plausible-unverified') ||
    tags.includes('plausible_unverified') ||
    (item.material === 'assumption' && item.score === 0 && !hasBoundPrimarySource)
  ) {
    return { status: { kind: 'plausible' }, hasBoundPrimarySource }
  }
  return { status: { kind: 'scored', score: item.score }, hasBoundPrimarySource }
}
