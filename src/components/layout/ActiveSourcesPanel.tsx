import { ExternalLink, Link2 } from 'lucide-react'
import { usePlatformStore } from '../../store/platformStore'
import type { ActiveSource, ActiveSourceKind } from '../../types/useCase'
import { openSafeExternal, safeExternalUrl } from '../../lib/security/urlSafety'

const KIND_LABEL: Record<ActiveSourceKind, string> = {
  official: 'Official',
  wire: 'Wire',
  local: 'Local',
  tool: 'Tool',
  map: 'Map',
  data: 'Data',
  archive: 'Archive',
  secondary: 'Secondary',
}

const KIND_TONE: Record<ActiveSourceKind, string> = {
  official: 'border-emerald-800/60 text-emerald-300/90 bg-emerald-950/30',
  wire: 'border-sky-800/60 text-sky-300/90 bg-sky-950/30',
  local: 'border-violet-800/60 text-violet-300/90 bg-violet-950/30',
  tool: 'border-amber-800/60 text-amber-300/90 bg-amber-950/30',
  map: 'border-cyan-800/60 text-cyan-300/90 bg-cyan-950/30',
  data: 'border-teal-800/60 text-teal-300/90 bg-teal-950/30',
  archive: 'border-slate-600 text-slate-300 bg-slate-900/50',
  secondary: 'border-slate-700 text-slate-400 bg-slate-950/40',
}

export function ActiveSourcesList({
  sources,
  compact,
  title = 'Active sources',
}: {
  sources: ActiveSource[]
  compact?: boolean
  title?: string
}) {
  if (!sources.length) {
    return (
      <p className="text-[11px] text-slate-600">
        No sources loaded. Open an investigation to attach desk links.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {!compact && (
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 flex items-center gap-1.5">
            <Link2 size={12} className="text-cyan-500" />
            {title}
            <span className="text-slate-600 font-normal normal-case">({sources.length})</span>
          </h3>
          <span className="text-[9px] text-slate-600">Opens in new tab</span>
        </div>
      )}
      <ul className={`space-y-1.5 ${compact ? 'max-h-40 overflow-auto' : 'max-h-64 overflow-auto'}`}>
        {sources.map((src) => (
          <li key={src.id}>
            <a
              href={safeExternalUrl(src.url) ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault()
                openSafeExternal(src.url)
              }}
              className="group flex gap-2 rounded-md border border-slate-800/90 bg-slate-950/60 px-2 py-1.5 hover:border-cyan-800/50 hover:bg-cyan-950/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
              title={src.url}
            >
              <span
                className={`shrink-0 self-start mt-0.5 rounded border px-1 py-0 text-[9px] font-semibold uppercase tracking-wide ${KIND_TONE[src.kind]}`}
              >
                {KIND_LABEL[src.kind]}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-start gap-1">
                  <span className="text-[11px] font-medium text-slate-100 leading-snug group-hover:text-cyan-100">
                    {src.title}
                  </span>
                  <ExternalLink
                    size={11}
                    className="shrink-0 mt-0.5 text-slate-600 group-hover:text-cyan-500"
                  />
                </span>
                <span className="block text-[10px] text-slate-500 leading-snug mt-0.5">{src.why}</span>
                {src.publisher && (
                  <span className="block text-[9px] text-slate-600 mt-0.5">{src.publisher}</span>
                )}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Store-bound sources for the active investigation */
export function ActiveSourcesPanel({ compact }: { compact?: boolean } = {}) {
  const sources = usePlatformStore((s) => s.activeSources)
  const label = usePlatformStore((s) => s.dataPack.meta.name)
  return <ActiveSourcesList sources={sources} compact={compact} title={`Active sources · ${label}`} />
}
