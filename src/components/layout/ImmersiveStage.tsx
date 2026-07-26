/**
 * Immersive / “Jarvis-style” HUD stage — cinematic center stage + glass side rails.
 * First cut of a future AOS Nexus Immersive product line.
 */

import { usePlatformStore } from '../../store/platformStore'
import { getUseCase } from '../../data/useCases/catalog'
import { getSimulation } from '../../data/useCases/simulations'
import { MODULE_META, type ModuleId } from '../../types/core'
import { ModuleHost } from './ModuleHost'
import { ActiveSourcesList } from './ActiveSourcesPanel'
import { EvidenceBadge } from '../ui/primitives'
import { unresolvedNegatives } from '../../core/evidence'

export function ImmersiveStage({ activePane }: { activePane: ModuleId }) {
  const activeUseCaseId = usePlatformStore((s) => s.activeUseCaseId)
  const evidence = usePlatformStore((s) => s.evidence)
  const activeSources = usePlatformStore((s) => s.activeSources)
  const statusMessage = usePlatformStore((s) => s.statusMessage)
  const ack = usePlatformStore((s) => s.layer0AckToken)
  const setModule = usePlatformStore((s) => s.setModule)

  const profile = getUseCase(activeUseCaseId)
  const sim = getSimulation(activeUseCaseId)
  const neg = unresolvedNegatives(evidence)
  // Prefer Massing / Atlas as comprehensive center stages.
  // Export kit is not staged in Immersive Massing flow — SME + Research hold links.
  const center: ModuleId =
    activePane === 'information' || activePane === 'export-kit'
      ? 'massing-viewer'
      : activePane

  // Side rails: Research + SME (never Export on Massing stage)
  const leftRail: ModuleId = 'research-hub'
  const rightRail: ModuleId =
    center === 'sme-lenses' || center === 'massing-viewer' ? 'sme-lenses' : 'sme-lenses'

  return (
    <div className="relative h-full min-h-0 overflow-hidden bg-[#02040a]">
      {/* Ambient grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(34,211,238,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.12) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,47,73,0.35)_0%,transparent_65%)]" />

      {/* Top HUD — compact for laptop stage max */}
      <div
        className="absolute top-0 inset-x-0 z-20 flex items-center justify-between gap-2 px-2 border-b border-cyan-900/40 bg-slate-950/75 backdrop-blur-md"
        style={{ height: 'var(--nexos-immersive-top, 1.85rem)' }}
      >
        <div className="min-w-0 flex items-baseline gap-2">
          <span className="text-[9px] uppercase tracking-[0.16em] text-cyan-500/90 shrink-0">
            NEXOSxLPIN · Immersive
          </span>
          <span className="text-[12px] font-semibold text-cyan-50 truncate">
            {profile.label}
            {sim ? (
              <span className="ml-1.5 text-[10px] font-normal text-slate-500">
                {sim.mapPin.cityHint}
              </span>
            ) : null}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[9px] text-slate-400 shrink-0">
          <span className={ack ? 'text-emerald-400' : 'text-amber-400'}>
            {ack ? 'ACK' : 'Gate'}
          </span>
          <span className="inline-flex items-center gap-0.5">
            <EvidenceBadge score={-1} /> {neg.length}
          </span>
          <span className="rounded border border-cyan-900/50 px-1.5 py-0.5 text-cyan-600/90">
            Sole mode
          </span>
        </div>
      </div>

      {/* Main 3-column HUD — maximized stage */}
      <div
        className="absolute inset-x-0 grid grid-cols-12 gap-1 p-1 min-h-0"
        style={{
          top: 'var(--nexos-immersive-top, 1.85rem)',
          bottom: 'var(--nexos-immersive-bot, 1.5rem)',
        }}
      >
        <aside className="col-span-3 min-h-0 flex flex-col rounded-lg border border-cyan-900/40 bg-slate-950/55 backdrop-blur-md overflow-hidden">
          <header className="shrink-0 px-2 py-0.5 border-b border-cyan-900/30 text-[9px] uppercase tracking-wider text-cyan-500/90">
            {MODULE_META[leftRail].short}
          </header>
          <div className="flex-1 min-h-0 p-0.5 overflow-hidden">
            <ModuleHost id={leftRail} embedded />
          </div>
        </aside>

        <section className="col-span-6 min-h-0 flex flex-col rounded-lg border border-cyan-700/40 bg-black/50 backdrop-blur-sm overflow-hidden">
          <header className="shrink-0 flex items-center justify-between px-2 py-0.5 border-b border-cyan-800/40">
            <span className="text-[9px] uppercase tracking-[0.14em] text-cyan-400">
              Stage · {MODULE_META[center].short}
            </span>
            <div className="flex gap-0.5 flex-wrap justify-end">
              {(
                [
                  'massing-viewer',
                  'atlas',
                  'research-hub',
                  'sme-lenses',
                  'design-lab',
                  'procedural-forge',
                  'analyst',
                  // export-kit intentionally omitted — links live on Massing hover + SME
                ] as ModuleId[]
              ).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setModule(id)}
                  className={`rounded px-1 py-0.5 text-[8px] border ${
                    center === id
                      ? 'border-cyan-500 text-cyan-100 bg-cyan-950/50'
                      : 'border-slate-700 text-slate-500 hover:text-slate-200'
                  }`}
                >
                  {MODULE_META[id].short}
                </button>
              ))}
            </div>
          </header>
          <div className="flex-1 min-h-0 p-0.5">
            <ModuleHost id={center} embedded={false} />
          </div>
        </section>

        <aside className="col-span-3 min-h-0 flex flex-col gap-1">
          <div className="flex-[1.2] min-h-0 flex flex-col rounded-lg border border-cyan-900/40 bg-slate-950/55 backdrop-blur-md overflow-hidden">
            <header className="shrink-0 px-2 py-0.5 border-b border-cyan-900/30 text-[9px] uppercase tracking-wider text-cyan-500/90">
              {MODULE_META[rightRail].short}
            </header>
            <div className="flex-1 min-h-0 p-0.5 overflow-hidden">
              <ModuleHost id={rightRail} embedded compact />
            </div>
          </div>
          <div className="flex-1 min-h-0 rounded-lg border border-cyan-900/40 bg-slate-950/55 backdrop-blur-md overflow-auto p-1">
            <ActiveSourcesList
              sources={activeSources.slice(0, 6)}
              compact
              title="Source links (also on Massing hover)"
            />
          </div>
        </aside>
      </div>

      <div
        className="absolute bottom-0 inset-x-0 z-20 flex items-center justify-between gap-2 px-2 border-t border-cyan-900/40 bg-slate-950/80 backdrop-blur-md text-[9px] text-slate-400"
        style={{ height: 'var(--nexos-immersive-bot, 1.5rem)' }}
      >
        <span className="truncate text-cyan-100/80">{statusMessage}</span>
        <span className="shrink-0 text-slate-600">
          Massing hover = identity · notes · SME links · no export on stage
        </span>
      </div>
    </div>
  )
}
