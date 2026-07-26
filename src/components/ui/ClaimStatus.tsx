/**
 * NEXOSxLPIN — Claim Status Visual System (P0)
 * Spec: docs/NEXOSxLPIN_UI_Supercharge_Spec_v1.0.md
 * Concrete reference: docs/NEXOSxLPIN_UI_ClaimStatus_Components.tsx.ref
 */

import { motion } from 'framer-motion'
import type { EvidenceScore } from '../../types/core'
import { cn } from '../../lib/ui/cn'
import {
  type ClaimVisualStatus,
  resolveStatusVisual,
  scoreLabel,
  scoredStatus,
} from '../../lib/ui/claimStatus'

export interface ClaimRowData {
  id: string
  text: string
  status: ClaimVisualStatus
  hasBoundPrimarySource?: boolean
  sourceLabel?: string
  meta?: string
}

/** Compact score badge — Spec §4.1 channel 2 */
export function ScoreBadge({
  status,
  className,
  size = 'sm',
}: {
  status: ClaimVisualStatus
  className?: string
  size?: 'sm' | 'md'
}) {
  const visual = resolveStatusVisual(status)
  const pad = size === 'md' ? 'min-w-[2.5rem] h-6 px-2 text-xs' : 'min-w-[2.25rem] h-5 px-1.5 text-[11px]'
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded border font-mono font-semibold tracking-tight tabular-nums shrink-0',
        pad,
        visual.badge,
        className,
      )}
      title={
        status.kind === 'plausible'
          ? 'Plausible / unverified (honesty rule — not a fourth score)'
          : status.score === 1
            ? 'Supported (+1)'
            : status.score === -1
              ? 'Disputed (−1)'
              : 'Not proven (0)'
      }
    >
      {scoreLabel(status)}
    </span>
  )
}

/** Score-only badge for call sites that still pass EvidenceScore */
export function ScoreBadgeFromScore({
  score,
  className,
  size = 'sm',
}: {
  score: EvidenceScore
  className?: string
  size?: 'sm' | 'md'
}) {
  return <ScoreBadge status={scoredStatus(score)} className={className} size={size} />
}

/** Left status rail — Spec §4.1 channel 1 */
export function StatusRail({
  status,
  className,
}: {
  status: ClaimVisualStatus
  className?: string
}) {
  const visual = resolveStatusVisual(status)
  return (
    <div
      className={cn('w-[4px] self-stretch rounded-full shrink-0 min-h-[1.25rem]', visual.rail, className)}
      aria-hidden
    />
  )
}

/** Compact row: rail + badge + text + source friction / plausible label */
export function ClaimStatusRow({
  claim,
  selected,
  onSelect,
  onScoreChange,
  className,
  dense,
}: {
  claim: ClaimRowData
  selected?: boolean
  onSelect?: (id: string) => void
  onScoreChange?: (id: string, next: ClaimVisualStatus) => void
  className?: string
  dense?: boolean
}) {
  const visual = resolveStatusVisual(claim.status)
  const isPlusOneMissingSource =
    claim.status.kind === 'scored' &&
    claim.status.score === 1 &&
    !claim.hasBoundPrimarySource

  return (
    <motion.div
      layout
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.12 }}
      className={cn(
        'group flex items-stretch gap-2.5 rounded-lg border transition-colors duration-[var(--duration-fast,120ms)]',
        dense ? 'px-2 py-1.5' : 'px-3 py-2.5',
        'bg-slate-900/40 border-slate-800/80 hover:border-slate-700/80',
        selected && 'border-[color-mix(in_srgb,var(--accent)_45%,transparent)] bg-slate-900/70',
        isPlusOneMissingSource && 'border-amber-800/50',
        className,
      )}
      onClick={() => onSelect?.(claim.id)}
      role={onSelect ? 'button' : undefined}
    >
      <StatusRail status={claim.status} />

      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <div className="flex items-start gap-2">
          <ScoreBadge status={claim.status} />
          <p className={cn(dense ? 'text-[11px]' : 'text-[13px]', 'leading-snug flex-1', visual.text)}>
            {claim.text}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          {claim.meta ? <span>{claim.meta}</span> : null}

          {claim.status.kind === 'scored' && claim.status.score === 1 && (
            <span
              className={cn(
                'inline-flex items-center gap-1',
                claim.hasBoundPrimarySource ? 'text-emerald-500/80' : 'text-amber-400/90',
              )}
            >
              <span
                className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  claim.hasBoundPrimarySource ? 'bg-emerald-500' : 'bg-amber-400',
                )}
              />
              {claim.hasBoundPrimarySource
                ? (claim.sourceLabel ?? 'source bound')
                : 'primary source required'}
            </span>
          )}

          {claim.status.kind === 'plausible' && (
            <span className="text-violet-300/90 font-medium">plausible / unverified</span>
          )}
        </div>
      </div>

      {onScoreChange ? (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-fast,120ms)]">
          {([1, 0, -1] as EvidenceScore[]).map((s) => (
            <ScoreButton
              key={s}
              label={s === 1 ? '+1' : s === -1 ? '−1' : '0'}
              active={claim.status.kind === 'scored' && claim.status.score === s}
              onClick={() => onScoreChange(claim.id, { kind: 'scored', score: s })}
            />
          ))}
        </div>
      ) : null}
    </motion.div>
  )
}

function ScoreButton({
  label,
  active,
  onClick,
}: {
  label: string
  active?: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.92 }}
      transition={{ duration: 0.12 }}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      className={cn(
        'h-6 min-w-[1.75rem] px-1.5 rounded text-[11px] font-medium border transition-colors duration-[var(--duration-fast,120ms)]',
        active
          ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
          : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-600',
      )}
    >
      {label}
    </motion.button>
  )
}
