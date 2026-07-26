import { Shield, ShieldAlert, ShieldCheck, FileText, LayoutGrid } from 'lucide-react'
import { usePlatformStore } from '../../store/platformStore'
import { unresolvedNegatives } from '../../core/evidence'
import { getUseCase } from '../../data/useCases/catalog'
import { getSimulation } from '../../data/useCases/simulations'
import { Btn } from '../ui/primitives'
import { DISCLAIMER_STATUS_BAR, MATURITY_BADGE, PRODUCT_VERSION } from '../../lib/product/maturity'

export function StatusBar() {
  const layer0 = usePlatformStore((s) => s.layer0)
  const ack = usePlatformStore((s) => s.layer0AckToken)
  const acknowledgeLayer0 = usePlatformStore((s) => s.acknowledgeLayer0)
  const sessionMode = usePlatformStore((s) => s.sessionMode)
  const workingDocument = usePlatformStore((s) => s.workingDocument)
  const statusMessage = usePlatformStore((s) => s.statusMessage)
  const evidence = usePlatformStore((s) => s.evidence)
  const dataPack = usePlatformStore((s) => s.dataPack)
  const activeModule = usePlatformStore((s) => s.activeModule)
  const activeUseCaseId = usePlatformStore((s) => s.activeUseCaseId)
  const openPanes = usePlatformStore((s) => s.workspace.openPanes)
  const uiMode = usePlatformStore((s) => s.uiMode)
  const smeSel = usePlatformStore((s) => s.selectedSmeLensIds.length)

  const neg = unresolvedNegatives(evidence).length
  const layerOk = !layer0.active || layer0.blockedActions.length === 0
  const profile = getUseCase(activeUseCaseId)
  const sim = getSimulation(activeUseCaseId)
  const plus = evidence.filter((e) => e.score === 1).length
  const zero = evidence.filter((e) => e.score === 0).length

  return (
    <footer className="shrink-0 flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-1.5 border-t border-slate-800/90 bg-[#060a12] text-[10px] text-slate-400">
      <div className="flex items-center gap-1.5 min-w-0">
        {neg > 0 ? (
          <ShieldAlert size={12} className="text-rose-400 shrink-0" />
        ) : layerOk ? (
          <ShieldCheck size={12} className="text-emerald-400 shrink-0" />
        ) : (
          <Shield size={12} className="text-amber-400 shrink-0" />
        )}
        <span className="font-semibold text-slate-300">Layer-0</span>
        <span className="truncate max-w-[200px] xl:max-w-md" title={layer0.reason}>
          {layer0.active ? layer0.reason : 'Idle'}
          {ack ? ' · ACK armed' : ''}
          {neg > 0 ? ` · ${neg} × −1 open` : ''}
        </span>
        <Btn
          variant="ghost"
          className="!py-0.5 !px-1.5 !text-[10px]"
          title="Acknowledge Layer-0 for next high-stakes action"
          onClick={() =>
            acknowledgeLayer0('Operator acknowledged integrity pre-filter for high-stakes action')
          }
        >
          ACK
        </Btn>
      </div>

      <span className="text-slate-700">|</span>

      <div className="flex items-center gap-1.5 min-w-0">
        <FileText size={12} className="text-slate-500 shrink-0" />
        <span className="text-slate-300">WD</span>
        <span className="truncate">{workingDocument.entries.length} entries</span>
      </div>

      <span className="text-slate-700">|</span>

      <div className="flex items-center gap-1.5 min-w-0">
        <LayoutGrid size={12} className="text-slate-500 shrink-0" />
        <span className="text-slate-300">Use case</span>
        <span className="truncate text-cyan-400/90" title={profile.id}>
          {profile.label}
        </span>
        {sim && (
          <span className="text-slate-500 hidden md:inline truncate max-w-[10rem]" title={sim.mapPin.cityHint}>
            · 📍 {sim.mapPin.shortLabel}
          </span>
        )}
        <span className="text-slate-600 hidden sm:inline">· {openPanes.length} panes</span>
        <span className="text-slate-600 hidden lg:inline">· UI {uiMode}</span>
        {smeSel > 0 && (
          <span className="text-cyan-600/90 hidden md:inline">· SME sel {smeSel}</span>
        )}
      </div>

      <span className="text-slate-700">|</span>

      <div className="flex items-center gap-1.5 font-mono text-slate-500 hidden sm:flex" title="Evidence tri-state">
        <span className="text-emerald-500/90">+{plus}</span>
        <span className="text-amber-500/90">0={zero}</span>
        <span className="text-rose-500/90">−{neg}</span>
      </div>

      <span className="text-slate-700 hidden sm:inline">|</span>

      <div className="flex items-center gap-1.5">
        <span className="text-slate-300">Mode</span>
        <span className="font-mono uppercase tracking-wide text-cyan-400/90">{sessionMode}</span>
      </div>

      <span className="text-slate-700">|</span>

      <div className="flex items-center gap-1.5 min-w-0">
        <span className="text-slate-500">Pack</span>
        <span className="truncate text-slate-300">{dataPack.meta.name}</span>
      </div>

      <div className="flex-1 min-w-[8rem] text-right truncate text-slate-500" title={statusMessage}>
        <span className="text-amber-700/90 font-semibold">{MATURITY_BADGE}</span>
        <span className="text-slate-600"> · v{PRODUCT_VERSION} · </span>
        <span className="text-slate-600 hidden lg:inline">{DISCLAIMER_STATUS_BAR} · </span>
        <span className="text-slate-600">{activeModule}</span>
        {' · '}
        {statusMessage}
      </div>
    </footer>
  )
}
