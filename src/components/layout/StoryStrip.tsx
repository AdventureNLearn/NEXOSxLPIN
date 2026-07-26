import { usePlatformStore } from '../../store/platformStore'
import { resolveStory, claimStatusLabel } from '../../data/useCases/stories'
import { ClaimStatusRow } from '../ui/ClaimStatus'
import { visualFromStoryClaim } from '../../lib/ui/claimStatus'
import { MapPin } from 'lucide-react'

/** Always-visible human story chrome for the active investigation */
export function StoryStrip() {
  const activeUseCaseId = usePlatformStore((s) => s.activeUseCaseId)
  const useCasePicked = usePlatformStore((s) => s.workspace.useCasePicked)
  const setModule = usePlatformStore((s) => s.setModule)
  const story = resolveStory(activeUseCaseId)

  if (!useCasePicked || !story) return null

  const topClaims = story.claims.slice(0, 3)

  return (
    <div className="nexos-story-strip shrink-0 border-b border-slate-800/90 bg-gradient-to-r from-[#0a101c] via-[#070b14] to-[#0a101c] px-2 py-1.5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 text-[9px] text-slate-500 mb-0.5">
            <span className="uppercase tracking-[0.14em] text-cyan-600/90">Story</span>
            <span className="inline-flex items-center gap-1 text-slate-400">
              <MapPin size={10} />
              {story.where}
            </span>
          </div>
          <h2 className="text-[13px] font-semibold text-slate-50 tracking-tight leading-snug">
            {story.title}
          </h2>
          <p className="mt-0.5 text-[11px] text-slate-400 leading-snug line-clamp-2">
            {story.lede}
          </p>
          <p className="mt-1 text-[10px] text-cyan-500/80">
            Next: {story.nextStep}{' '}
            <button type="button" className="underline hover:text-cyan-300 ml-1" onClick={() => setModule('information')}>
              Story
            </button>
            <span className="text-slate-600 mx-1">·</span>
            <button type="button" className="underline hover:text-cyan-300" onClick={() => setModule('atlas')}>
              Map
            </button>
            <span className="text-slate-600 mx-1">·</span>
            <button type="button" className="underline hover:text-cyan-300" onClick={() => setModule('research-hub')}>
              Claims
            </button>
            <span className="text-slate-600 mx-1">·</span>
            <button type="button" className="underline hover:text-cyan-300" onClick={() => setModule('procedural-forge')}>
              Model
            </button>
          </p>
        </div>

        <div className="nexos-story-claims w-full sm:w-[min(280px,100%)] shrink-0 space-y-1">
          <div className="text-[9px] uppercase tracking-wide text-slate-500">Claims</div>
          {topClaims.map((c) => {
            const vs = visualFromStoryClaim({ score: c.score, status: c.status })
            const hasSrc = Boolean(c.sourceIds?.length || c.citations?.length)
            return (
              <ClaimStatusRow
                key={c.plain}
                dense
                claim={{
                  id: c.plain,
                  text: c.plain,
                  status: vs,
                  hasBoundPrimarySource: c.score !== 1 || hasSrc,
                  meta: claimStatusLabel(c.status),
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
