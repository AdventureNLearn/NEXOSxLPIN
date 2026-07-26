import { usePlatformStore } from '../../store/platformStore'

/**
 * First-run / plain-language banner — human agency first, zero jargon wall.
 */
export function WelcomeBanner({ onDismiss }: { onDismiss?: () => void }) {
  const setModule = usePlatformStore((s) => s.setModule)
  const useCasePicked = usePlatformStore((s) => s.workspace.useCasePicked)

  if (useCasePicked) return null

  return (
    <div className="shrink-0 border-b border-cyan-900/40 bg-gradient-to-r from-cyan-950/40 via-[#070b14] to-emerald-950/20 px-3 py-2.5">
      <div className="flex flex-wrap items-start justify-between gap-3 max-w-5xl">
        <div className="min-w-0 space-y-1.5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-500/90">
            Your tools. Your judgment. More human agency.
          </p>
          <h1 className="text-[15px] sm:text-[16px] font-semibold text-slate-50 leading-snug">
            Figure out what is true — before the story runs away with itself.
          </h1>
          <p className="text-[12px] text-slate-400 leading-relaxed max-w-2xl">
            Pick a topic family, open a story, mark each claim as{' '}
            <strong className="text-emerald-400">Supported</strong>,{' '}
            <strong className="text-amber-400">Not proven yet</strong>, or{' '}
            <strong className="text-rose-400">Disputed</strong>. Map the place. Sketch only when it
            helps. Share a pack only when the shaky lines are cleaned up. This is how narratives get
            checked — and how solid claims get projected with receipts.
          </p>
          <ol className="flex flex-wrap gap-2 pt-1 text-[11px]">
            {[
              { n: '1', t: 'Pick a story', m: 'information' as const },
              { n: '2', t: 'Score claims', m: 'research-hub' as const },
              { n: '3', t: 'See the map', m: 'atlas' as const },
              { n: '4', t: 'Optional sketch', m: 'massing-viewer' as const },
              { n: '5', t: 'Share only if clean', m: 'export-kit' as const },
            ].map((s) => (
              <li key={s.n}>
                <button
                  type="button"
                  onClick={() => setModule(s.m)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-950/70 px-2.5 py-1 text-slate-300 hover:border-cyan-700 hover:text-cyan-100"
                >
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-950 text-[10px] text-cyan-300">
                    {s.n}
                  </span>
                  {s.t}
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className="shrink-0 flex flex-col gap-1.5 items-end">
          <button
            type="button"
            onClick={() => setModule('information')}
            className="rounded-md border border-cyan-800/60 bg-cyan-950/50 px-3 py-1.5 text-[11px] text-cyan-100 hover:bg-cyan-900/40"
          >
            Plain-language guide
          </button>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="text-[10px] text-slate-600 hover:text-slate-400"
            >
              Hide tip
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default WelcomeBanner
