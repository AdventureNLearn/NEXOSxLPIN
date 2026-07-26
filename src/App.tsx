import { useCallback, useEffect, useState } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { StatusBar } from './components/layout/StatusBar'
import { CommandPalette } from './components/layout/CommandPalette'
import { Workspace } from './components/layout/Workspace'
import { UseCaseSwitcher } from './components/layout/UseCaseSwitcher'
import { ReportPanel } from './components/layout/ReportPanel'
import { MusicDock } from './components/layout/MusicDock'
import { StoryStrip } from './components/layout/StoryStrip'
import { usePlatformStore } from './store/platformStore'
import { getUseCase, trendingDesks } from './data/useCases/catalog'
import { storyTabLabel } from './data/useCases/stories'
import { MODULE_META } from './types/core'
import { Btn } from './components/ui/primitives'
import {
  DENSITY_CLASS,
  loadDensity,
  saveDensity,
  type UiDensity,
} from './lib/ui/density'
import {
  PRODUCT_NAME,
  PRODUCT_VERSION,
  MATURITY_BADGE,
  MATURITY_ONE_LINER,
  DISCLAIMER_TRAINING,
  TAGLINE,
} from './lib/product/maturity'

export default function App() {
  const activeModule = usePlatformStore((s) => s.activeModule)
  const activeUseCaseId = usePlatformStore((s) => s.activeUseCaseId)
  const workspace = usePlatformStore((s) => s.workspace)
  const uiMode = usePlatformStore((s) => s.uiMode)
  const setUiMode = usePlatformStore((s) => s.setUiMode)
  const setModule = usePlatformStore((s) => s.setModule)
  const setUseCase = usePlatformStore((s) => s.setUseCase)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [density, setDensity] = useState<UiDensity>(() => loadDensity())
  const closePalette = useCallback(() => setPaletteOpen(false), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    saveDensity(density)
  }, [density])

  const meta = MODULE_META[activeModule]
  const profile = getUseCase(activeUseCaseId)
  const storyName = storyTabLabel(activeUseCaseId, activeModule, meta.label)
  const showPick = !workspace.useCasePicked
  const immersive = workspace.viewMode === 'immersive' && uiMode !== 'mobile'
  const mobile = uiMode === 'mobile'
  const trends = trendingDesks()

  return (
    <div
      className={`h-screen w-screen overflow-hidden flex bg-[#05070f] text-slate-200 nexos-shell ${DENSITY_CLASS[density]} ${
        mobile ? 'ui-mobile' : 'ui-web'
      }`}
    >
      {!showPick && !immersive && !mobile && <Sidebar />}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <header className="nexos-app-header shrink-0 flex flex-wrap items-center justify-between gap-1.5 px-2 border-b border-slate-800/90 bg-[#070b14]">
          <div className="min-w-0 flex-1 flex items-center gap-2">
            <img
              src="/brand-mark.svg"
              alt="NEXOSxLPIN"
              width={mobile ? 32 : 28}
              height={mobile ? 32 : 28}
              className="shrink-0 rounded-md border border-cyan-900/40"
            />
            <div className="min-w-0">
              <div className="text-[13px] font-semibold text-slate-100 tracking-tight flex flex-wrap items-center gap-1.5">
                <span>{PRODUCT_NAME}</span>
                <span
                  className="rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider border border-amber-700/70 bg-amber-950/50 text-amber-200/95"
                  title={MATURITY_ONE_LINER}
                >
                  {MATURITY_BADGE}
                </span>
                <span className="text-[10px] font-normal text-cyan-600/90">
                  v{PRODUCT_VERSION}
                  {showPick
                    ? ' · Start here'
                    : profile.trendRank != null
                      ? ` · Story #${profile.trendRank}`
                      : ' · Truth desk'}
                </span>
                {!showPick && (
                  <span className="text-[10px] font-normal text-slate-600">· {storyName}</span>
                )}
              </div>
              <div className="text-[10px] text-slate-500 truncate hidden sm:block">
                {showPick
                  ? TAGLINE
                  : 'Experimental desk · Map · Claims · Share when clean · your judgment'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {!showPick && (
              <>
                <div
                  className="flex rounded border border-slate-700 overflow-hidden"
                  role="group"
                  aria-label="UI mode Web or Mobile"
                >
                  {(['web', 'mobile'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setUiMode(m)}
                      aria-pressed={uiMode === m}
                      className={`px-2 py-1 text-[10px] min-h-[32px] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 ${
                        uiMode === m
                          ? 'bg-cyan-950/70 text-cyan-100'
                          : 'bg-slate-900 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {m === 'web' ? 'Web' : 'Mobile'}
                    </button>
                  ))}
                </div>
                <div className="hidden md:flex rounded border border-slate-700 overflow-hidden" title="UI density">
                  {(['dense', 'compact', 'comfortable'] as UiDensity[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDensity(d)}
                      className={`px-1.5 py-0.5 text-[9px] capitalize min-h-[32px] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 ${
                        density === d
                          ? 'bg-cyan-950/70 text-cyan-100'
                          : 'bg-slate-900 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {d === 'dense' ? 'Dense' : d === 'compact' ? 'Compact' : 'Roomy'}
                    </button>
                  ))}
                </div>
                <UseCaseSwitcher />
                {!mobile && <MusicDock />}
                <button
                  type="button"
                  onClick={() => setPaletteOpen(true)}
                  className="shrink-0 rounded-md border border-slate-700 bg-slate-900/80 px-2 py-1 min-h-[32px] text-[10px] text-slate-400 hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
                >
                  Jump <kbd className="ml-0.5 font-mono text-slate-600">⌘K</kbd>
                </button>
              </>
            )}
            {showPick && (
              <button
                type="button"
                onClick={() => setUseCase('trend-01-berlin-csd')}
                className="rounded-md border border-cyan-700 bg-cyan-950/60 px-3 py-1.5 text-[11px] text-cyan-100 hover:bg-cyan-900/50"
              >
                Quick start — open story #1
              </button>
            )}
          </div>
        </header>

        {showPick ? (
          <main className="flex-1 min-h-0 overflow-auto">
            <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
              <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-500/90">
                Your tools. Your judgment. More human agency.
              </p>
              <h1 className="mt-2 text-[22px] sm:text-[26px] font-semibold text-slate-50 leading-snug">
                Figure out what is true — before the story runs away with itself.
              </h1>
              <p className="mt-3 text-[14px] text-slate-400 leading-relaxed">
                Pick <strong className="text-slate-200">one story</strong>. Then mark each claim{' '}
                <strong className="text-emerald-400">Supported</strong>,{' '}
                <strong className="text-amber-400">Not proven yet</strong>, or{' '}
                <strong className="text-rose-400">Disputed</strong>. Map the place. Sketch only if it
                helps. Share a pack only when the shaky lines are cleaned up.
              </p>
              <ol className="mt-4 flex flex-wrap gap-2 text-[12px] text-slate-400">
                {[
                  '1 · Pick a story',
                  '2 · Score claims',
                  '3 · See the map',
                  '4 · Optional sketch',
                  '5 · Share if clean',
                ].map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-slate-800 bg-slate-950/70 px-2.5 py-1"
                  >
                    {t}
                  </li>
                ))}
              </ol>

              <div className="mt-8 rounded-xl border border-slate-700 bg-slate-950/90 p-4 shadow-2xl">
                <h2 className="text-sm font-semibold text-slate-100">Choose a story</h2>
                <p className="mt-1 text-[12px] text-slate-500">
                  Start with a trending desk — or open a calm empty desk to explore the tools.
                </p>
                <ol className="mt-3 space-y-1.5 max-h-[min(52vh,420px)] overflow-auto pr-1">
                  {trends.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => setUseCase(p.id)}
                        className="w-full text-left rounded-md border border-slate-800 px-3 py-2.5 hover:border-cyan-800 hover:bg-cyan-950/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
                      >
                        <div className="text-[13px] text-slate-100 font-medium">{p.label}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                          {p.tagline}
                        </div>
                      </button>
                    </li>
                  ))}
                </ol>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Btn variant="primary" onClick={() => setUseCase('trend-01-berlin-csd')}>
                    Open story #1
                  </Btn>
                  <Btn onClick={() => setUseCase('gen-explore')}>Empty desk (explore tools)</Btn>
                </div>
                <p className="mt-3 text-[10px] text-slate-600 leading-relaxed">
                  <span className="text-amber-600/90 font-semibold">EXPERIMENTAL.</span>{' '}
                  {DISCLAIMER_TRAINING} Maps and 3D are illustrative only. UI will change.
                </p>
              </div>
            </div>
          </main>
        ) : (
          <>
            {!immersive && !mobile && <StoryStrip />}
            {!immersive && !mobile && density !== 'dense' && <ReportPanel />}
            <main className="nexos-main-pad flex-1 min-h-0 overflow-hidden relative">
              <div className="h-full min-h-0">
                <Workspace />
              </div>
            </main>
            {!immersive && !mobile && <StatusBar />}
            {mobile && (
              <nav
                className="ui-mobile-nav shrink-0 border-t border-slate-800 bg-[#070b14] px-1 py-1 flex gap-0.5 overflow-x-auto"
                aria-label="Primary modules"
              >
                {(
                  [
                    'information',
                    'atlas',
                    'research-hub',
                    'sme-lenses',
                    'massing-viewer',
                    'export-kit',
                  ] as const
                ).map((id) => {
                  const on = activeModule === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setModule(id)}
                      aria-current={on ? 'page' : undefined}
                      className={`shrink-0 min-h-[44px] min-w-[64px] px-2 rounded-md text-[10px] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 ${
                        on
                          ? 'bg-cyan-950/70 text-cyan-100 border border-cyan-800/50'
                          : 'text-slate-400 border border-transparent'
                      }`}
                    >
                      {MODULE_META[id].short}
                    </button>
                  )
                })}
              </nav>
            )}
          </>
        )}
      </div>
      <CommandPalette open={paletteOpen} onClose={closePalette} />
    </div>
  )
}
