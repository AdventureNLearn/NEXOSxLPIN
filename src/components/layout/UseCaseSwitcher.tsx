import { useMemo, useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronRight, LayoutGrid } from 'lucide-react'
import { usePlatformStore } from '../../store/platformStore'
import {
  FAMILY_LABELS,
  USE_CASE_CATALOG,
  getUseCase,
  groupUseCasesByFamily,
} from '../../data/useCases/catalog'

/**
 * Progressive desk switcher: families first (high-level), expand to desks
 * only when the operator opens a family — PII/agnostic selector posture.
 */
export function UseCaseSwitcher() {
  const activeUseCaseId = usePlatformStore((s) => s.activeUseCaseId)
  const setUseCase = usePlatformStore((s) => s.setUseCase)
  const setModule = usePlatformStore((s) => s.setModule)

  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const profile = getUseCase(activeUseCaseId)
  const byFamily = useMemo(() => groupUseCasesByFamily(), [])
  const familyKeys = useMemo(() => Object.keys(byFamily), [byFamily])

  // Expand only the active family by default (high-level first)
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => ({
    [profile.family]: true,
  }))

  useEffect(() => {
    setExpanded((prev) => ({ ...prev, [profile.family]: true }))
  }, [profile.family])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const toggleFamily = (family: string) => {
    setExpanded((prev) => ({ ...prev, [family]: !prev[family] }))
  }

  return (
    <div className="flex items-center gap-2 min-w-0" ref={rootRef}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-left hover:border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 max-w-[min(320px,40vw)]"
          aria-haspopup="listbox"
          aria-expanded={open}
          title="Switch investigation — families first, then desks"
        >
          <LayoutGrid size={12} className="text-cyan-500 shrink-0" />
          <span className="min-w-0">
            <span className="block text-[10px] uppercase tracking-wide text-slate-500">
              Focus
            </span>
            <span className="block text-[11px] font-medium text-slate-100 truncate">
              {profile.label}
            </span>
          </span>
          <span className="shrink-0 rounded bg-slate-800 px-1.5 py-0.5 text-[9px] text-cyan-400/90 uppercase tracking-wide">
            {FAMILY_LABELS[profile.family] ?? profile.family}
          </span>
          <ChevronDown size={12} className="text-slate-500 shrink-0" />
        </button>

        {open && (
          <div
            role="listbox"
            className="absolute right-0 z-40 mt-1 w-[min(380px,92vw)] max-h-[min(440px,70vh)] overflow-auto rounded-lg border border-slate-700 bg-slate-950 shadow-2xl"
          >
            <div className="px-3 py-2 border-b border-slate-800 text-[10px] text-slate-500 leading-snug">
              High-level families first. Expand a family to pick a desk. Sample packs stay free of
              private PII — see docs/PII_AND_AGNOSTIC_POLICY.md
            </div>
            {familyKeys.map((family) => {
              const list = byFamily[family] ?? []
              const isOpen = Boolean(expanded[family])
              const famLabel = FAMILY_LABELS[family] ?? family
              return (
                <div key={family} className="border-b border-slate-800/80 last:border-0">
                  <button
                    type="button"
                    className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-900/80 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-600/50"
                    onClick={() => toggleFamily(family)}
                    aria-expanded={isOpen}
                  >
                    {isOpen ? (
                      <ChevronDown size={12} className="text-slate-500 shrink-0" />
                    ) : (
                      <ChevronRight size={12} className="text-slate-500 shrink-0" />
                    )}
                    <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-300">
                      {famLabel}
                    </span>
                    <span className="ml-auto text-[10px] text-slate-600 tabular-nums">
                      {list.length}
                    </span>
                  </button>
                  {isOpen && (
                    <ul>
                      {list.map((p) => (
                        <li key={p.id}>
                          <button
                            type="button"
                            role="option"
                            aria-selected={p.id === activeUseCaseId}
                            className={`w-full text-left pl-8 pr-3 py-2 hover:bg-slate-900 focus:bg-slate-900 focus:outline-none ${
                              p.id === activeUseCaseId ? 'bg-cyan-950/40' : ''
                            }`}
                            onClick={() => {
                              setUseCase(p.id)
                              setOpen(false)
                            }}
                          >
                            <div className="text-xs text-slate-100 flex items-center gap-2">
                              <span>{p.label}</span>
                              {p.report && (
                                <span className="text-[9px] text-cyan-600 uppercase">
                                  full report
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500 line-clamp-2">
                              {p.tagline}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
            <div className="px-3 py-2 text-[10px] text-slate-600">
              {familyKeys.length} families ·{' '}
              {USE_CASE_CATALOG.filter((p) => p.trendRank != null && p.trendRank <= 10).length}{' '}
              trend tops ·{' '}
              {USE_CASE_CATALOG.filter((p) => p.family === 'congressional').length} congressional
              training · map pins also switch desks
            </div>
          </div>
        )}
      </div>

      <span
        className="shrink-0 rounded-md border border-slate-800 bg-slate-950/80 px-2 py-1 text-[10px] text-slate-500"
        title="Immersive analysis stage is the default workspace"
      >
        Stage
      </span>

      <button
        type="button"
        onClick={() => setModule('massing-viewer')}
        className="shrink-0 rounded-md border border-slate-700 bg-slate-900/80 px-2 py-1 text-[10px] text-slate-300 hover:text-slate-100 hover:border-cyan-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
        title="3D sketch on the map"
      >
        3D
      </button>

      <button
        type="button"
        onClick={() => setModule('atlas')}
        className="shrink-0 rounded-md border border-slate-700 bg-slate-900/80 px-2 py-1 text-[10px] text-slate-300 hover:text-slate-100 hover:border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
        title="Story map"
      >
        Map
      </button>

      <button
        type="button"
        onClick={() => setModule('export-kit')}
        className="shrink-0 rounded-md border border-slate-700 bg-slate-900/80 px-2 py-1 text-[10px] text-slate-300 hover:text-slate-100 hover:border-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
        title="Share pack when clean"
      >
        Share
      </button>
    </div>
  )
}
