import { useCallback, useEffect, useState } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { StatusBar } from './components/layout/StatusBar'
import { CommandPalette } from './components/layout/CommandPalette'
import { Workspace } from './components/layout/Workspace'
import { UseCaseSwitcher } from './components/layout/UseCaseSwitcher'
import { ReportPanel } from './components/layout/ReportPanel'
import { MusicDock } from './components/layout/MusicDock'
import { StoryStrip } from './components/layout/StoryStrip'
import { WelcomeBanner } from './components/layout/WelcomeBanner'
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

const PRODUCT = 'NEXOSxLPIN'

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

  return (
    <div
      className={`h-screen w-screen overflow-hidden flex bg-[#05070f] text-slate-200 nexos-shell ${DENSITY_CLASS[density]} ${
        mobile ? 'ui-mobile' : 'ui-web'
      }`}
    >
      {!immersive && !mobile && <Sidebar />}
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
              <div className="text-[13px] font-semibold text-slate-100 tracking-tight">
                {PRODUCT}
                <span className="ml-2 text-[10px] font-normal text-cyan-600/90">
                  {profile.trendRank != null ? `Story #${profile.trendRank}` : 'v2 · Truth desk'}
                </span>
                <span className="ml-2 text-[10px] font-normal text-slate-600">
                  · {storyName}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 truncate hidden sm:block">
                {workspace.useCasePicked
                  ? 'Map · Claims · Experts · Rules · Share when clean'
                  : 'Pick a story · mark what is true · grow your agency'}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
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
            <div className="flex rounded border border-slate-700 overflow-hidden" title="UI density">
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
          </div>
        </header>

        <WelcomeBanner />
        {!immersive && !mobile && <StoryStrip />}
        {!immersive && !mobile && density !== 'dense' && <ReportPanel />}

        <main className="nexos-main-pad flex-1 min-h-0 overflow-hidden relative">
          {showPick && (
            <div className="absolute inset-2 z-20 flex items-start justify-center pt-6 pointer-events-none">
              <div className="pointer-events-auto w-full max-w-xl rounded-xl border border-slate-700 bg-slate-950/95 p-4 shadow-2xl max-h-[80vh] overflow-auto">
                <h2 className="text-sm font-semibold text-slate-100">
                  Choose a story to investigate
                </h2>
                <p className="mt-1 text-[11px] text-slate-500">
                  Each story loads a map, plain-language claims, and rules for how careful you must
                  be before publishing. Grey pins on the map are other stories — click to switch.
                </p>
                <ol className="mt-3 space-y-1.5">
                  {trendingDesks().map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => setUseCase(p.id)}
                        className="w-full text-left rounded-md border border-slate-800 px-2.5 py-2 hover:border-cyan-800 hover:bg-cyan-950/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
                      >
                        <div className="text-[12px] text-slate-100 font-medium">{p.label}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-2">{p.tagline}</div>
                      </button>
                    </li>
                  ))}
                </ol>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Btn variant="primary" onClick={() => setUseCase('trend-01-berlin-csd')}>
                    Open #1 Berlin CSD
                  </Btn>
                  <Btn onClick={() => setUseCase('gen-explore')}>General explore</Btn>
                </div>
              </div>
            </div>
          )}
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
                'atlas',
                'research-hub',
                'sme-lenses',
                'analyst',
                'export-kit',
                'information',
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
      </div>
      <CommandPalette open={paletteOpen} onClose={closePalette} />
    </div>
  )
}
