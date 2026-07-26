/**
 * Immersive research HUD — simplified for high-agency analysis.
 * One center stage · optional rails · assistant context · no duplicate chrome.
 */

import { useState } from 'react'
import { usePlatformStore } from '../../store/platformStore'
import { getUseCase } from '../../data/useCases/catalog'
import { getSimulation } from '../../data/useCases/simulations'
import { MODULE_META, type ModuleId } from '../../types/core'
import { ModuleHost } from './ModuleHost'
import { ActiveSourcesList } from './ActiveSourcesPanel'
import { EvidenceBadge } from '../ui/primitives'
import { unresolvedNegatives } from '../../core/evidence'
import { VisualAssistant } from './VisualAssistant'
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react'

/** Primary spine only — eliminates tiny 8-button stage strip duplicating the app header. */
const STAGE_SPINE: ModuleId[] = [
  'atlas',
  'research-hub',
  'massing-viewer',
  'sme-lenses',
  'export-kit',
]

export function ImmersiveStage({ activePane }: { activePane: ModuleId }) {
  const activeUseCaseId = usePlatformStore((s) => s.activeUseCaseId)
  const evidence = usePlatformStore((s) => s.evidence)
  const activeSources = usePlatformStore((s) => s.activeSources)
  const statusMessage = usePlatformStore((s) => s.statusMessage)
  const ack = usePlatformStore((s) => s.layer0AckToken)
  const setModule = usePlatformStore((s) => s.setModule)

  const [leftOpen, setLeftOpen] = useState(true)
  const [rightOpen, setRightOpen] = useState(false) // Experts closed by default — reduce noise

  const profile = getUseCase(activeUseCaseId)
  const sim = getSimulation(activeUseCaseId)
  const neg = unresolvedNegatives(evidence)
  const plus = evidence.filter((e) => e.score === 1).length
  const zero = evidence.filter((e) => e.score === 0).length

  // Center: keep request unless it is a rail-only module
  const center: ModuleId =
    activePane === 'information'
      ? 'atlas'
      : activePane === 'export-kit'
        ? 'export-kit'
        : STAGE_SPINE.includes(activePane)
          ? activePane
          : activePane === 'procedural-forge'
            ? 'massing-viewer'
            : activePane === 'design-lab' || activePane === 'audit-ladder' || activePane === 'analyst'
              ? activePane
              : 'atlas'

  const leftRail: ModuleId = 'research-hub'
  const rightRail: ModuleId = 'sme-lenses'

  const colClass = leftOpen && rightOpen
    ? 'grid-cols-12'
    : leftOpen || rightOpen
      ? 'grid-cols-12'
      : 'grid-cols-1'

  return (
    <div className="relative h-full min-h-0 overflow-hidden bg-[#02040a] flex flex-col">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(34,211,238,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.1) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      {/* Top context — desk identity + board pulse (not a second nav) */}
      <div className="relative z-20 shrink-0 flex items-center justify-between gap-2 px-2 py-1 border-b border-cyan-900/40 bg-slate-950/80 backdrop-blur-md">
        <div className="min-w-0 flex items-baseline gap-2">
          <span className="text-[9px] uppercase tracking-[0.14em] text-cyan-600/90 shrink-0">
            Analysis stage
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
        <div className="flex items-center gap-2 text-[10px] text-slate-400 shrink-0">
          <span className="tabular-nums text-emerald-400/90">+{plus}</span>
          <span className="tabular-nums text-amber-400/90">0×{zero}</span>
          <span className="inline-flex items-center gap-0.5">
            <EvidenceBadge score={-1} /> {neg.length}
          </span>
          <span className={ack ? 'text-emerald-400' : 'text-slate-500'}>
            {ack ? 'ACK' : 'Gate'}
          </span>
        </div>
      </div>

      <VisualAssistant compact />

      {/* Single spine — how tools map (primary nav inside stage) */}
      <div className="relative z-20 shrink-0 flex flex-wrap items-center gap-1 px-2 py-1 border-b border-slate-800/80 bg-black/40">
        <span className="text-[9px] uppercase tracking-wide text-slate-600 mr-1">Focus</span>
        {STAGE_SPINE.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setModule(id)}
            className={`rounded-md px-2 py-1 text-[10px] border ${
              center === id || activePane === id
                ? 'border-cyan-500 text-cyan-100 bg-cyan-950/50'
                : 'border-slate-800 text-slate-500 hover:text-slate-200'
            }`}
          >
            {MODULE_META[id].short}
          </button>
        ))}
        <span className="text-slate-700 mx-1">|</span>
        {(
          [
            ['design-lab', 'Rules'],
            ['audit-ladder', 'Depth'],
            ['procedural-forge', 'Sketch'],
            ['information', 'Guide'],
            ['analyst', 'Cmd'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setModule(id)}
            className={`rounded px-1.5 py-0.5 text-[9px] border ${
              activePane === id
                ? 'border-slate-500 text-slate-200'
                : 'border-transparent text-slate-600 hover:text-slate-400'
            }`}
          >
            {label}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setLeftOpen((v) => !v)}
            className="inline-flex items-center gap-1 rounded border border-slate-800 px-1.5 py-0.5 text-[9px] text-slate-500 hover:text-slate-300"
            title={leftOpen ? 'Hide claims rail' : 'Show claims rail'}
          >
            {leftOpen ? <PanelLeftClose size={12} /> : <PanelLeftOpen size={12} />}
            Claims
          </button>
          <button
            type="button"
            onClick={() => setRightOpen((v) => !v)}
            className="inline-flex items-center gap-1 rounded border border-slate-800 px-1.5 py-0.5 text-[9px] text-slate-500 hover:text-slate-300"
            title={rightOpen ? 'Hide experts rail' : 'Show experts rail'}
          >
            Experts
            {rightOpen ? <PanelRightClose size={12} /> : <PanelRightOpen size={12} />}
          </button>
        </div>
      </div>

      {/* Stage grid */}
      <div className={`relative z-10 flex-1 min-h-0 grid ${colClass} gap-1 p-1`}>
        {leftOpen && (
          <aside
            className={`${rightOpen ? 'col-span-3' : 'col-span-4'} min-h-0 flex flex-col rounded-lg border border-cyan-900/35 bg-slate-950/60 backdrop-blur-md overflow-hidden`}
          >
            <header className="shrink-0 px-2 py-1 border-b border-cyan-900/30 text-[9px] uppercase tracking-wider text-cyan-600/90">
              {MODULE_META[leftRail].label}
              <span className="ml-1.5 normal-case tracking-normal text-slate-600">
                scores feed the map
              </span>
            </header>
            <div className="flex-1 min-h-0 p-0.5 overflow-hidden">
              <ModuleHost id={leftRail} embedded />
            </div>
          </aside>
        )}

        <section
          className={`${
            leftOpen && rightOpen ? 'col-span-6' : leftOpen || rightOpen ? 'col-span-8' : 'col-span-1'
          } min-h-0 flex flex-col rounded-lg border border-cyan-700/35 bg-black/55 backdrop-blur-sm overflow-hidden`}
        >
          <header className="shrink-0 flex items-center justify-between px-2 py-1 border-b border-cyan-800/35">
            <span className="text-[9px] uppercase tracking-[0.12em] text-cyan-400">
              Stage · {MODULE_META[center].label}
            </span>
            <span className="text-[9px] text-slate-600 truncate max-w-[50%]">
              {MODULE_META[center].description}
            </span>
          </header>
          <div className="flex-1 min-h-0 p-0.5">
            <ModuleHost id={center} embedded={false} />
          </div>
        </section>

        {rightOpen && (
          <aside className="col-span-3 min-h-0 flex flex-col gap-1">
            <div className="flex-[1.35] min-h-0 flex flex-col rounded-lg border border-cyan-900/35 bg-slate-950/60 backdrop-blur-md overflow-hidden">
              <header className="shrink-0 px-2 py-1 border-b border-cyan-900/30 text-[9px] uppercase tracking-wider text-cyan-600/90">
                {MODULE_META[rightRail].label}
                <span className="ml-1.5 normal-case tracking-normal text-slate-600">
                  confirm before apply
                </span>
              </header>
              <div className="flex-1 min-h-0 p-0.5 overflow-hidden">
                <ModuleHost id={rightRail} embedded compact />
              </div>
            </div>
            <div className="flex-1 min-h-0 rounded-lg border border-cyan-900/35 bg-slate-950/60 backdrop-blur-md overflow-auto p-1">
              <ActiveSourcesList
                sources={activeSources.slice(0, 8)}
                compact
                title="Sources (same list as Claims)"
              />
            </div>
          </aside>
        )}
      </div>

      <div className="relative z-20 shrink-0 flex items-center justify-between gap-2 px-2 py-1 border-t border-cyan-900/40 bg-slate-950/85 backdrop-blur-md text-[9px] text-slate-500">
        <span className="truncate text-cyan-100/80">{statusMessage}</span>
        <span className="shrink-0 hidden sm:inline">
          Experimental · Story → Claims → Map → (Experts) → Share · sketches never replace scores
        </span>
      </div>
    </div>
  )
}
