import { useMemo, useState } from 'react'
import { Compass, ChevronRight, X } from 'lucide-react'
import { usePlatformStore } from '../../store/platformStore'
import { getUseCase } from '../../data/useCases/catalog'
import { getSimulation } from '../../data/useCases/simulations'
import { primaryCoachStep, COHERENCE_SPINE } from '../../lib/assist/analysisCoach'
import { MODULE_META } from '../../types/core'
import { DISCLAIMER_ASSISTANT, MATURITY_BADGE } from '../../lib/product/maturity'

/**
 * Visual Assistant — one coherent “how this maps” strip for high-agency operators.
 * Collapses by default detail; always shows one next step.
 */
export function VisualAssistant({ compact }: { compact?: boolean } = {}) {
  const useCasePicked = usePlatformStore((s) => s.workspace.useCasePicked)
  const activeUseCaseId = usePlatformStore((s) => s.activeUseCaseId)
  const evidence = usePlatformStore((s) => s.evidence)
  const activeSources = usePlatformStore((s) => s.activeSources)
  const assets = usePlatformStore((s) => s.assets)
  const activeModule = usePlatformStore((s) => s.activeModule)
  const layer0 = usePlatformStore((s) => s.layer0)
  const setModule = usePlatformStore((s) => s.setModule)
  const [showMap, setShowMap] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const profile = getUseCase(activeUseCaseId)
  const sim = getSimulation(activeUseCaseId)

  const step = useMemo(
    () =>
      primaryCoachStep({
        useCasePicked,
        deskLabel: profile.label,
        evidence,
        sourceCount: activeSources.length,
        hasMapPin: Boolean(sim?.mapPin),
        assetCount: assets.length,
        activeModule,
        layer0Blocked: layer0.active && layer0.blockedActions.length > 0,
      }),
    [
      useCasePicked,
      profile.label,
      evidence,
      activeSources.length,
      sim?.mapPin,
      assets.length,
      activeModule,
      layer0.active,
      layer0.blockedActions.length,
    ],
  )

  if (!useCasePicked || dismissed) return null

  return (
    <div
      className={`shrink-0 border-b border-cyan-900/35 bg-gradient-to-r from-slate-950 via-[#071018] to-slate-950 ${
        compact ? 'px-2 py-1' : 'px-3 py-1.5'
      }`}
      role="region"
      aria-label="Visual assistant"
    >
      <div className="flex flex-wrap items-start gap-2 justify-between">
        <div className="min-w-0 flex-1 flex items-start gap-2">
          <Compass size={14} className="text-cyan-500 shrink-0 mt-0.5" />
          <div className="min-w-0 space-y-0.5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="text-[9px] uppercase tracking-[0.14em] text-cyan-600/90">
                Assistant
              </span>
              <span className="text-[8px] font-bold tracking-wider text-amber-600/90">
                {MATURITY_BADGE}
              </span>
              <span className="text-[11px] text-slate-200 font-medium truncate">{step.here}</span>
            </div>
            {!compact && (
              <p className="text-[10px] text-slate-500 leading-snug max-w-3xl">
                {step.why}{' '}
                <span className="text-slate-600">({DISCLAIMER_ASSISTANT})</span>
              </p>
            )}
            <p className="text-[11px] text-cyan-100/90 leading-snug">
              <span className="text-slate-500">Next:</span> {step.next}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setModule(step.go)}
            className="inline-flex items-center gap-1 rounded-md border border-cyan-700/60 bg-cyan-950/50 px-2 py-1 text-[10px] text-cyan-100 hover:bg-cyan-900/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
          >
            Go {MODULE_META[step.go].short}
            <ChevronRight size={12} />
          </button>
          {step.also && (
            <button
              type="button"
              onClick={() => setModule(step.also!)}
              className="rounded-md border border-slate-700 px-2 py-1 text-[10px] text-slate-400 hover:text-slate-200"
            >
              {MODULE_META[step.also].short}
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowMap((v) => !v)}
            className="rounded-md border border-slate-800 px-2 py-1 text-[10px] text-slate-500 hover:text-slate-300"
            aria-expanded={showMap}
          >
            {showMap ? 'Hide map' : 'How it maps'}
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-600 hover:text-slate-400"
            title="Hide assistant this session"
            aria-label="Hide assistant"
          >
            <X size={12} />
          </button>
        </div>
      </div>
      {showMap && (
        <ol className="mt-2 flex flex-wrap gap-1 pb-0.5">
          {COHERENCE_SPINE.map((c, i) => {
            const on = c.id === activeModule
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => setModule(c.id)}
                  title={c.feeds}
                  className={`rounded-full border px-2 py-0.5 text-[9px] ${
                    on
                      ? 'border-cyan-500 bg-cyan-950/50 text-cyan-100'
                      : 'border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {i + 1}. {c.role}
                  <span className="hidden lg:inline text-slate-600"> — {c.feeds}</span>
                </button>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}

export default VisualAssistant
