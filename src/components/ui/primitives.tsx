import type { ReactNode } from 'react'
import type { EvidenceScore } from '../../types/core'
import { ScoreBadgeFromScore } from './ClaimStatus'

/** Tri-state badge — delegates to P0 Claim Status Visual System. */
export function EvidenceBadge({
  score,
  size = 'sm',
}: {
  score: EvidenceScore
  size?: 'sm' | 'md'
}) {
  return <ScoreBadgeFromScore score={score} size={size} />
}

export function Panel({
  title,
  actions,
  children,
  className = '',
}: {
  title?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section
      className={`flex flex-col min-h-0 rounded-lg border border-slate-800/90 bg-slate-950/70 ${className}`}
    >
      {(title || actions) && (
        <header className="flex items-center justify-between gap-2 px-3 py-2 border-b border-slate-800/80">
          {title ? (
            <h2 className="text-xs font-semibold tracking-wide text-slate-200 uppercase">{title}</h2>
          ) : (
            <span />
          )}
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>
      )}
      <div className="flex-1 min-h-0 p-3 overflow-auto">{children}</div>
    </section>
  )
}

export function Btn({
  children,
  onClick,
  variant = 'default',
  disabled,
  type = 'button',
  className = '',
  title,
}: {
  children: ReactNode
  onClick?: () => void
  variant?: 'default' | 'primary' | 'danger' | 'ghost'
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
  title?: string
}) {
  const base =
    'inline-flex items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/70 disabled:opacity-40 disabled:pointer-events-none'
  const variants: Record<string, string> = {
    default: 'bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700',
    primary: 'bg-cyan-700/90 text-cyan-50 border border-cyan-600 hover:bg-cyan-600',
    danger: 'bg-rose-950 text-rose-100 border border-rose-800 hover:bg-rose-900',
    ghost: 'bg-transparent text-slate-300 border border-transparent hover:bg-slate-800/80',
  }
  return (
    <button
      type={type}
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}

export function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-slate-400">
      <span className="font-medium text-slate-300">{label}</span>
      {children}
    </label>
  )
}
