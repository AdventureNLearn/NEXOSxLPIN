import { useMemo, useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Maximize2, Minimize2 } from 'lucide-react'
import { usePlatformStore } from '../../store/platformStore'
import { Btn, EvidenceBadge, Panel } from '../ui/primitives'
import { ClaimStatusRow, ScoreBadge } from '../ui/ClaimStatus'
import {
  highestStakesStatus,
  pinColorForScore,
  pinColorForStatus,
  visualFromStoryClaim,
} from '../../lib/ui/claimStatus'
import type { EvidenceScore } from '../../types/core'
import { allInvestigationPins, getSimulation } from '../../data/useCases/simulations'
import { getUseCase } from '../../data/useCases/catalog'
import { resolveStory, claimStatusLabel } from '../../data/useCases/stories'
import type { InvestigationMapPin } from '../../types/useCase'
import { ActiveSourcesList } from '../layout/ActiveSourcesPanel'
import { SpatialLayerStack } from '../layout/SpatialLayerStack'
import {
  ALL_BASEMAP_IDS,
  BASEMAPS,
  computeTrueMapFilters,
  type BasemapId,
} from '../../lib/map/mapFilters'

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
})

/** Spec §4.2 pin color from claim status */
function scoreColor(score?: EvidenceScore): string {
  return pinColorForScore(score)
}

const GREY = '#64748b'
const GREY_FILL = '#334155'

function FitPoints({
  pts,
  activeId,
  focusMode,
}: {
  pts: { lat: number; lng: number; id?: string }[]
  activeId?: string
  focusMode?: boolean
}) {
  const map = useMap()
  useEffect(() => {
    if (!pts.length) return
    const b = L.latLngBounds(pts.map((p) => [p.lat, p.lng] as [number, number]))
    map.fitBounds(b.pad(focusMode ? 0.18 : 0.35), {
      animate: false,
      maxZoom: focusMode ? 5 : 4,
    })
    const active = pts.find((p) => p.id === activeId)
    if (active && focusMode) {
      window.setTimeout(() => {
        map.flyTo([active.lat, active.lng], Math.max(map.getZoom(), 4), { duration: 0.4 })
      }, 100)
    } else if (active) {
      map.panTo([active.lat, active.lng], { animate: true })
    }
  }, [map, pts, activeId, focusMode])
  return null
}

function MapResizeGuard({ focusMode }: { focusMode?: boolean }) {
  const map = useMap()
  useEffect(() => {
    const el = map.getContainer()
    const invalidate = () => map.invalidateSize({ animate: false })
    invalidate()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => invalidate()) : null
    ro?.observe(el)
    window.addEventListener('resize', invalidate)
    const t = window.setTimeout(invalidate, 60)
    const t2 = window.setTimeout(invalidate, 280)
    const t3 = window.setTimeout(invalidate, 600)
    return () => {
      ro?.disconnect()
      window.removeEventListener('resize', invalidate)
      window.clearTimeout(t)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
    }
  }, [map, focusMode])
  return null
}

export function AtlasModule({ embedded }: { embedded?: boolean } = {}) {
  const pack = usePlatformStore((s) => s.dataPack)
  const activeUseCaseId = usePlatformStore((s) => s.activeUseCaseId)
  const workspace = usePlatformStore((s) => s.workspace)
  const activeModule = usePlatformStore((s) => s.activeModule)
  const evidence = usePlatformStore((s) => s.evidence)
  const activeSources = usePlatformStore((s) => s.activeSources)
  const setUseCase = usePlatformStore((s) => s.setUseCase)
  const setModule = usePlatformStore((s) => s.setModule)
  const maximizePane = usePlatformStore((s) => s.maximizePane)
  const soloPane = usePlatformStore((s) => s.soloPane)
  const restoreLayout = usePlatformStore((s) => s.restoreLayout)
  const [graphOpen, setGraphOpen] = useState(false)
  const [showScene, setShowScene] = useState(true)
  const [briefOpen, setBriefOpen] = useState(true)
  const [basemapId, setBasemapId] = useState<BasemapId>('dark')
  const [basemapLocked, setBasemapLocked] = useState(false)

  const invPins = useMemo(() => allInvestigationPins(), [])
  const activeProfile = getUseCase(activeUseCaseId)
  const activeSim = getSimulation(activeUseCaseId)
  const story = resolveStory(activeUseCaseId)
  const report = activeProfile.report

  /** True map filters from active desk coordinates */
  const mapFilters = useMemo(() => {
    const pin = activeSim?.mapPin
    const lat = pin?.lat ?? 20
    const lng = pin?.lng ?? 0
    return computeTrueMapFilters(lat, lng, [
      pin?.kind ?? '',
      pin?.cityHint ?? '',
      story?.where ?? '',
      activeUseCaseId,
    ])
  }, [activeSim, story, activeUseCaseId])

  // Auto basemap from true geo filters unless operator locks a layer
  useEffect(() => {
    if (!basemapLocked) setBasemapId(mapFilters.recommendedBasemap)
  }, [mapFilters.recommendedBasemap, basemapLocked, activeUseCaseId])

  const basemap = BASEMAPS[basemapId]

  const isSolo =
    workspace.openPanes.length === 1 && workspace.openPanes[0] === 'atlas'
  const isMaxed = workspace.maximizedPane === 'atlas'

  /**
   * Full-stage map: not a crushed tile.
   * true when parent passes full height (embedded=false), solo, maximized, or tabs on atlas.
   */
  const focusMode =
    !embedded ||
    isMaxed ||
    isSolo ||
    ((workspace.viewMode === 'tabs' || workspace.singleModuleMode) &&
      (activeModule === 'atlas' || workspace.focusedPane === 'atlas'))

  const scenePts = pack.spatialPoints

  const fitTargets = useMemo(() => {
    return invPins.map((p) => ({
      lat: p.lat,
      lng: p.lng,
      id: p.useCaseId,
    }))
  }, [invPins])

  const nodes = pack.graphNodes
  const edges = pack.graphEdges
  const layout = useMemo(() => {
    const w = 360
    const h = focusMode ? 200 : 160
    const cx = w / 2
    const cy = h / 2
    const r = focusMode ? 72 : 58
    return nodes.map((n, i) => {
      const a = (i / Math.max(nodes.length, 1)) * Math.PI * 2 - Math.PI / 2
      return { ...n, x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r }
    })
  }, [nodes, focusMode])
  const pos = new Map(layout.map((n) => [n.id, n]))

  /** Active desk: pin from highest-stakes claim on the board (Spec §4.2). */
  const activePinStatus = useMemo(() => {
    const board = evidence.map((e) => e.score)
    if (board.length) return highestStakesStatus(board)
    const storyScores = story?.claims?.map((c) => c.score) ?? []
    if (storyScores.length) return highestStakesStatus(storyScores)
    return highestStakesStatus([])
  }, [evidence, story])

  const pinStyle = (p: InvestigationMapPin, active: boolean) => {
    if (!active) {
      return {
        color: GREY,
        fillColor: GREY_FILL,
        fillOpacity: 0.55,
        weight: 1.5,
        radius: focusMode ? 12 : 8,
        disputed: false,
      }
    }
    const pin = pinColorForStatus(activePinStatus)
    const disputed = activePinStatus.kind === 'scored' && activePinStatus.score === -1
    return {
      color: pin,
      fillColor: pin,
      fillOpacity: 0.92,
      weight: disputed ? 3.5 : 3,
      radius: focusMode ? 18 : 12,
      disputed,
    }
  }

  const plus = evidence.filter((e) => e.score === 1).length
  const zero = evidence.filter((e) => e.score === 0).length
  const neg = evidence.filter((e) => e.score === -1).length

  const known = story?.knownSoFar?.length
    ? story.knownSoFar
    : report?.timeline?.slice(0, 5).map((t) => `${t.when}: ${t.what}`) ?? []
  const openQs = story?.stillOpen?.length
    ? story.stillOpen
    : report?.openQuestions?.slice(0, 5) ?? []
  const claimCards = story?.claims?.length
    ? story.claims
    : evidence.slice(0, 10).map((e) => ({
        plain: e.title,
        status: (e.score === 1
          ? 'supported'
          : e.score === -1
            ? 'disputed'
            : 'uncertain') as 'supported' | 'uncertain' | 'disputed',
        score: e.score,
        why: e.summary || '',
      }))

  const otherDesks = invPins
    .filter((p) => p.useCaseId !== activeUseCaseId)
    .slice(0, focusMode ? 12 : 4)

  return (
    <div
      className={`h-full min-h-0 w-full flex overflow-hidden ${
        focusMode ? 'flex-col xl:flex-row gap-1.5' : 'flex-col gap-1'
      }`}
    >
      {/* —— Map stage (fills available height — no tiny globe) —— */}
      <div
        className={`min-h-0 min-w-0 flex flex-col rounded-md border border-slate-800 bg-black/40 overflow-hidden ${
          focusMode
            ? briefOpen
              ? 'flex-1 xl:flex-[2] xl:min-w-0'
              : 'flex-1'
            : 'flex-1'
        }`}
      >
        <div className="shrink-0 flex flex-wrap items-center justify-between gap-2 px-2 py-1.5 border-b border-slate-800/80 bg-slate-950/90">
          <div className="min-w-0">
            <span className="text-[12px] font-semibold tracking-wide text-slate-100">
              {story ? `Desk map · ${story.title}` : 'Desk map'}
            </span>
            <p className="text-[10px] text-slate-500 truncate max-w-[min(720px,75vw)]">
              {mapFilters.summary}
              {showScene && scenePts.length > 0 ? ` · ${scenePts.length} scene pins` : ''}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0 flex-wrap">
            {!isSolo && !isMaxed && (
              <Btn
                variant="primary"
                className="!py-0.5 !px-2 !text-[10px]"
                title="Solo desk map — full stage with high-level brief"
                onClick={() => soloPane('atlas')}
              >
                <Maximize2 size={11} className="inline mr-0.5" />
                Solo map
              </Btn>
            )}
            {isSolo || isMaxed ? (
              <Btn
                variant="ghost"
                className="!py-0.5 !px-1.5 !text-[10px]"
                title="Restore multi-pane workspace"
                onClick={() => restoreLayout()}
              >
                <Minimize2 size={11} className="inline mr-0.5" />
                Restore tiles
              </Btn>
            ) : (
              <Btn
                variant="ghost"
                className="!py-0.5 !px-1.5 !text-[10px]"
                title="Maximize map in current layout"
                onClick={() => maximizePane('atlas')}
              >
                Fullscreen
              </Btn>
            )}
            {focusMode && (
              <Btn
                variant="ghost"
                className="!py-0.5 !px-1.5 !text-[10px]"
                onClick={() => setBriefOpen((v) => !v)}
              >
                {briefOpen ? 'Hide brief' : 'Show brief'}
              </Btn>
            )}
            <Btn
              variant="ghost"
              className="!py-0.5 !px-1.5 !text-[10px]"
              onClick={() => setShowScene((v) => !v)}
            >
              {showScene ? 'Hide scene' : 'Show scene'}
            </Btn>
            <Btn
              variant="ghost"
              className="!py-0.5 !px-1.5 !text-[10px]"
              onClick={() => setGraphOpen((v) => !v)}
            >
              {graphOpen ? 'Hide graph' : 'Show graph'}
            </Btn>
            <Btn
              variant="ghost"
              className="!py-0.5 !px-1.5 !text-[10px]"
              onClick={() => setModule('research-hub')}
            >
              Claims
            </Btn>
          </div>
        </div>

        {/* True map filters: basemap layers + geo chips */}
        <div className="shrink-0 flex flex-col gap-1 px-2 py-1.5 border-b border-slate-800/70 bg-slate-950/80">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[9px] uppercase tracking-wide text-slate-500 mr-1">Map style</span>
            {ALL_BASEMAP_IDS.map((id) => (
              <button
                key={id}
                type="button"
                title={BASEMAPS[id].label}
                onClick={() => {
                  setBasemapId(id)
                  setBasemapLocked(true)
                }}
                className={`rounded px-1.5 py-0.5 text-[9px] border ${
                  basemapId === id
                    ? 'border-cyan-500 bg-cyan-950/50 text-cyan-100'
                    : 'border-slate-700 text-slate-500 hover:text-slate-200'
                }`}
              >
                {BASEMAPS[id].label}
              </button>
            ))}
            <button
              type="button"
              title="Reset map style to the one that fits this place"
              onClick={() => {
                setBasemapLocked(false)
                setBasemapId(mapFilters.recommendedBasemap)
              }}
              className={`rounded px-1.5 py-0.5 text-[9px] border ${
                !basemapLocked
                  ? 'border-emerald-700/60 text-emerald-400/90'
                  : 'border-slate-700 text-slate-500 hover:text-slate-200'
              }`}
            >
              Auto place
            </button>
          </div>
          {focusMode && (
            <div className="pt-1">
              <SpatialLayerStack compact />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[9px] uppercase tracking-wide text-slate-500 mr-1">Place tags</span>
            {mapFilters.chips.slice(0, 10).map((c) => (
              <span
                key={c.id}
                className={`rounded-full px-1.5 py-0.5 text-[9px] border ${
                  c.kind === 'water'
                    ? 'border-sky-800/60 text-sky-300/90 bg-sky-950/30'
                    : c.kind === 'climate'
                      ? 'border-amber-800/50 text-amber-300/90 bg-amber-950/20'
                      : c.kind === 'elevation'
                        ? 'border-stone-600 text-stone-300 bg-stone-900/40'
                        : c.kind === 'basemap'
                          ? 'border-cyan-900/50 text-cyan-400/80'
                          : 'border-slate-700 text-slate-400'
                }`}
              >
                {c.label}
              </span>
            ))}
            <span className="text-[9px] text-slate-600 font-mono ml-1">
              {mapFilters.lat.toFixed(2)}°, {mapFilters.lng.toFixed(2)}°
            </span>
          </div>
        </div>

        {/* Absolute fill — map always uses full pane, never a 280px postage stamp */}
        <div className="relative flex-1 min-h-0 w-full">
          <div className="absolute inset-0">
            <MapContainer
              center={[20, 0]}
              zoom={focusMode ? 3 : 2}
              className="h-full w-full"
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom
              worldCopyJump={false}
              maxBounds={[
                [-85, -180],
                [85, 180],
              ]}
              maxBoundsViscosity={0.85}
            >
              <TileLayer
                key={basemap.id}
                attribution={basemap.attribution}
                url={basemap.url}
                maxZoom={basemap.maxZoom}
                noWrap
              />
              <MapResizeGuard focusMode={focusMode} />
              <FitPoints pts={fitTargets} activeId={activeUseCaseId} focusMode={focusMode} />

              {invPins.map((p) => {
                const active = p.useCaseId === activeUseCaseId
                const style = pinStyle(p, active)
                return (
                  <CircleMarker
                    key={p.useCaseId}
                    center={[p.lat, p.lng]}
                    radius={style.radius}
                    pathOptions={{
                      color: style.color,
                      fillColor: style.fillColor,
                      fillOpacity: style.fillOpacity,
                      weight: style.weight,
                      opacity: active ? 1 : 0.75,
                    }}
                    eventHandlers={{
                      click: () => {
                        if (p.useCaseId !== activeUseCaseId) {
                          setUseCase(p.useCaseId)
                        }
                      },
                    }}
                  >
                    <Popup>
                      <div className="text-xs min-w-[200px]">
                        <div className="font-semibold text-slate-900">
                          {resolveStory(p.useCaseId)?.title ?? p.label}
                        </div>
                        <div className="text-slate-600">{p.cityHint}</div>
                        {active && (
                          <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                            <span className="text-slate-600">Desk status:</span>
                            <ScoreBadge status={activePinStatus} />
                            {activePinStatus.kind === 'scored' &&
                              activePinStatus.score === -1 && (
                                <span className="text-rose-600 text-[10px] font-medium">
                                  open −1
                                </span>
                              )}
                          </div>
                        )}
                        {!active && (
                          <div className="mt-1 text-slate-500">Other desk — click to open</div>
                        )}
                        {active && (
                          <div className="mt-1 text-emerald-700">You are in this desk</div>
                        )}
                        <button
                          type="button"
                          className="mt-2 w-full rounded bg-slate-800 text-slate-100 px-2 py-1 text-[11px]"
                          onClick={() => setUseCase(p.useCaseId)}
                        >
                          {active ? 'Reload this desk' : 'Open this desk'}
                        </button>
                      </div>
                    </Popup>
                  </CircleMarker>
                )
              })}

              {showScene &&
                scenePts.map((p) => (
                  <CircleMarker
                    key={`scene-${p.id}`}
                    center={[p.lat, p.lng]}
                    radius={focusMode ? 9 : 6}
                    pathOptions={{
                      color: scoreColor(p.score),
                      fillColor: scoreColor(p.score),
                      fillOpacity: 0.85,
                      weight: 2,
                    }}
                  >
                    <Popup>
                      <div className="text-xs">
                        <div className="font-semibold">{p.label}</div>
                        <div>Scene · {p.kind}</div>
                        {p.score !== undefined && (
                          <div className="mt-1">
                            <EvidenceBadge score={p.score} />
                          </div>
                        )}
                      </div>
                    </Popup>
                  </CircleMarker>
                ))}
            </MapContainer>
          </div>

          {/* Floating score chip on map */}
          {focusMode && (
            <div className="pointer-events-none absolute bottom-2 left-2 z-[500] rounded-md border border-slate-700/80 bg-slate-950/85 px-2 py-1 text-[10px] text-slate-300 backdrop-blur-sm">
              <span className="text-emerald-400">+{plus}</span>
              <span className="text-slate-600"> · </span>
              <span className="text-amber-300">0={zero}</span>
              <span className="text-slate-600"> · </span>
              <span className="text-rose-300">−{neg}</span>
              <span className="text-slate-600 ml-2">
                {activeSim
                  ? `${activeSim.evidence.length} claims · ${activeSources.length} sources`
                  : `${invPins.length} desks`}
              </span>
            </div>
          )}
        </div>

        {!focusMode && (
          <div className="shrink-0 px-2 py-1 border-t border-slate-800/80 text-[10px] text-slate-500 flex flex-wrap gap-x-3 gap-y-0.5">
            <span>
              <span className="inline-block w-2 h-2 rounded-full bg-slate-500 mr-1" />
              Grey = other desks
            </span>
            <span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1" />
              Active
            </span>
            <span className="text-slate-400 font-mono">
              +{plus} · 0={zero} · −{neg}
            </span>
            <span className="text-cyan-600/90">Solo map → large map + brief</span>
          </div>
        )}
      </div>

      {/* —— High-level brief dock (only when map owns the stage) —— */}
      {focusMode && briefOpen && (
        <div className="min-h-0 min-w-0 flex flex-col gap-1.5 overflow-hidden xl:w-[min(400px,34%)] xl:max-w-md shrink-0 max-h-[42%] xl:max-h-none">
          <Panel
            title="High-level brief"
            className="shrink-0 max-h-[38%] xl:max-h-[42%] overflow-hidden flex flex-col"
          >
            <div className="overflow-y-auto space-y-2 pr-0.5">
              <div className="text-[11px] text-cyan-600/90 uppercase tracking-wide">
                {story?.where ?? activeProfile.mapPin?.cityHint ?? 'Desk'}
              </div>
              {report?.headline && (
                <div className="text-[12px] font-semibold text-slate-100 leading-snug">
                  {report.headline}
                </div>
              )}
              <p className="text-[12px] text-slate-200 leading-relaxed">
                {story?.lede ?? activeProfile.tagline}
              </p>
              {(story?.stakes || activeProfile.description) && (
                <div className="rounded border border-slate-800 bg-slate-950/50 p-2">
                  <div className="text-[9px] uppercase text-slate-500 mb-0.5">Why it matters</div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {story?.stakes ?? activeProfile.description}
                  </p>
                </div>
              )}
              {(report?.executiveSummary || report?.trendSignal) && (
                <div>
                  <div className="text-[9px] uppercase text-slate-500 mb-0.5">
                    {report.executiveSummary ? 'Executive summary' : 'Trend signal'}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {report.executiveSummary ?? report.trendSignal}
                  </p>
                </div>
              )}
              {report?.geographicNotes && (
                <div className="text-[10px] text-slate-500 leading-snug">
                  <span className="text-slate-600 uppercase text-[9px]">Geo · </span>
                  {report.geographicNotes}
                </div>
              )}
              <div className="flex flex-wrap gap-1.5">
                <Btn className="!text-[10px]" onClick={() => setModule('research-hub')}>
                  Open claims
                </Btn>
                <Btn className="!text-[10px]" onClick={() => setModule('sme-lenses')}>
                  SME lenses
                </Btn>
                <Btn className="!text-[10px]" onClick={() => setModule('export-kit')}>
                  Export
                </Btn>
                {story?.nextStep && (
                  <span className="text-[10px] text-cyan-700/90 self-center px-1">
                    Next: {story.nextStep}
                  </span>
                )}
              </div>
            </div>
          </Panel>

          {known.length > 0 && (
            <Panel title="Known so far" className="shrink-0 max-h-[22%] overflow-hidden flex flex-col">
              <ul className="overflow-y-auto space-y-1 flex-1 pr-0.5 text-[11px] text-slate-300">
                {known.map((k) => (
                  <li key={k} className="flex gap-1.5 leading-snug">
                    <span className="text-emerald-500/90 shrink-0">●</span>
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          {openQs.length > 0 && (
            <Panel title="Still open" className="shrink-0 max-h-[18%] overflow-hidden flex flex-col">
              <ul className="overflow-y-auto space-y-1 flex-1 pr-0.5 text-[11px] text-slate-400">
                {openQs.map((q) => (
                  <li key={q} className="flex gap-1.5 leading-snug">
                    <span className="text-amber-500/90 shrink-0">?</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          )}

          <Panel title="Claims at a glance" className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <ul className="overflow-y-auto space-y-1.5 flex-1 pr-0.5">
              {claimCards.slice(0, 12).map((c) => {
                const vs = visualFromStoryClaim({
                  score: c.score,
                  status: c.status,
                })
                const hasSrc = Boolean(
                  ('sourceIds' in c && c.sourceIds?.length) ||
                    ('citations' in c && c.citations?.length),
                )
                return (
                  <li key={c.plain}>
                    <ClaimStatusRow
                      dense
                      claim={{
                        id: c.plain,
                        text: c.plain,
                        status: vs,
                        hasBoundPrimarySource: hasSrc || c.score !== 1,
                        meta: `${claimStatusLabel(c.status)}${c.why ? ` — ${c.why}` : ''}`,
                      }}
                    />
                  </li>
                )
              })}
              {!claimCards.length && (
                <li className="text-[11px] text-slate-500 px-1">
                  No claims loaded — pick a desk pin or open Research Hub.
                </li>
              )}
            </ul>
          </Panel>

          {activeSources.length > 0 && (
            <Panel title="Sources" className="shrink-0 max-h-[20%] overflow-hidden flex flex-col">
              <div className="overflow-y-auto flex-1">
                <ActiveSourcesList
                  sources={activeSources.slice(0, 10)}
                  compact
                  title="Desk sources"
                />
              </div>
            </Panel>
          )}

          {otherDesks.length > 0 && (
            <Panel title="Other desks on map" className="shrink-0 max-h-[16%] overflow-hidden flex flex-col">
              <ul className="overflow-y-auto flex-1 divide-y divide-slate-800/80">
                {otherDesks.map((p) => (
                  <li key={p.useCaseId}>
                    <button
                      type="button"
                      className="w-full text-left px-1.5 py-1 hover:bg-slate-900/80 text-[10px]"
                      onClick={() => setUseCase(p.useCaseId)}
                    >
                      <span className="text-slate-200">{p.shortLabel || p.label}</span>
                      {p.cityHint && (
                        <span className="text-slate-600 ml-1">· {p.cityHint}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>
      )}

      {graphOpen && !focusMode && (
        <div
          className={`shrink-0 flex flex-col rounded-md border border-slate-800 bg-slate-950/70 overflow-hidden ${
            embedded ? 'h-[120px]' : 'h-[160px]'
          }`}
        >
          <div className="shrink-0 flex items-center justify-between px-2 py-0.5 border-b border-slate-800/80">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Network graph · {activeProfile.label}
            </span>
            <span className="text-[9px] text-slate-600">
              {nodes.length} nodes · {edges.length} edges
            </span>
          </div>
          <svg
            viewBox="0 0 360 160"
            className="flex-1 min-h-0 w-full bg-slate-950/50"
            preserveAspectRatio="xMidYMid meet"
          >
            {edges.map((e) => {
              const a = pos.get(e.source)
              const b = pos.get(e.target)
              if (!a || !b) return null
              return (
                <line
                  key={e.id}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={scoreColor(e.score ?? 0)}
                  strokeWidth={1.5}
                  strokeOpacity={0.7}
                />
              )
            })}
            {layout.map((n) => (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={14}
                  fill="#0f172a"
                  stroke={scoreColor(n.score)}
                  strokeWidth={2}
                />
                <text x={n.x} y={n.y + 3} textAnchor="middle" fill="#e2e8f0" fontSize="8">
                  {n.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}

      {graphOpen && focusMode && (
        <div className="w-full basis-full shrink-0 h-[140px] flex flex-col rounded-md border border-slate-800 bg-slate-950/70 overflow-hidden order-last">
          <div className="shrink-0 flex items-center justify-between px-2 py-0.5 border-b border-slate-800/80">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Network graph · {activeProfile.label}
            </span>
            <span className="text-[9px] text-slate-600">
              {nodes.length} nodes · {edges.length} edges
            </span>
          </div>
          <svg
            viewBox="0 0 360 200"
            className="flex-1 min-h-0 w-full bg-slate-950/50"
            preserveAspectRatio="xMidYMid meet"
          >
            {edges.map((e) => {
              const a = pos.get(e.source)
              const b = pos.get(e.target)
              if (!a || !b) return null
              return (
                <line
                  key={e.id}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke={scoreColor(e.score ?? 0)}
                  strokeWidth={1.5}
                  strokeOpacity={0.7}
                />
              )
            })}
            {layout.map((n) => (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={14}
                  fill="#0f172a"
                  stroke={scoreColor(n.score)}
                  strokeWidth={2}
                />
                <text x={n.x} y={n.y + 3} textAnchor="middle" fill="#e2e8f0" fontSize="8">
                  {n.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}
    </div>
  )
}

export default AtlasModule
