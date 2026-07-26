import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { usePlatformStore } from '../../store/platformStore'
import { getUseCase } from '../../data/useCases/catalog'
import { formatLayout } from '../../layout/formatLayout'
import { measureViewport } from '../../layout/measure'
import { unresolvedNegatives } from '../../core/evidence'
import type { DepthSignals } from '../../layout/types'
import type { ModuleId } from '../../types/core'
import { MODULE_META } from '../../types/core'
import { storyTabLabel } from '../../data/useCases/stories'
import { PaneFrame } from './PaneFrame'
import { ModuleHost } from './ModuleHost'
import { ImmersiveStage } from './ImmersiveStage'

/** Wide, reliable splitter — fixed drag bug (tiny 4px hit target + parent width). */
function Splitter({
  orientation,
  locked,
  onDrag,
  onReset,
}: {
  orientation: 'vertical' | 'horizontal'
  locked: boolean
  onDrag: (deltaPx: number, containerSize: number) => void
  onReset: () => void
}) {
  const dragging = useRef(false)
  const last = useRef(0)
  const containerSize = useRef(1)

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (locked) return
    e.preventDefault()
    e.stopPropagation()
    dragging.current = true
    last.current = orientation === 'vertical' ? e.clientX : e.clientY
    const grid = e.currentTarget.parentElement
    containerSize.current =
      orientation === 'vertical'
        ? grid?.clientWidth || window.innerWidth
        : grid?.clientHeight || window.innerHeight
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current || locked) return
    const cur = orientation === 'vertical' ? e.clientX : e.clientY
    const delta = cur - last.current
    last.current = cur
    if (delta !== 0) onDrag(delta, containerSize.current)
  }

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    dragging.current = false
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }

  const vertical = orientation === 'vertical'
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      aria-disabled={locked}
      title={
        locked
          ? 'Unlock layout (header) to resize'
          : 'Drag to resize · double-click to reset'
      }
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={(e) => {
        e.preventDefault()
        if (!locked) onReset()
      }}
      className={
        vertical
          ? `relative z-10 w-2 shrink-0 touch-none select-none ${
              locked
                ? 'cursor-not-allowed bg-slate-900'
                : 'cursor-col-resize bg-slate-800 hover:bg-cyan-600/70 active:bg-cyan-500/80'
            }`
          : `relative z-10 h-2 shrink-0 touch-none select-none ${
              locked
                ? 'cursor-not-allowed bg-slate-900'
                : 'cursor-row-resize bg-slate-800 hover:bg-cyan-600/70 active:bg-cyan-500/80'
            }`
      }
    >
      {/* Center grip line */}
      <div
        className={
          vertical
            ? 'absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-slate-600/80'
            : 'absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-600/80'
        }
      />
    </div>
  )
}

function TabBar() {
  const openPanes = usePlatformStore((s) => s.workspace.openPanes)
  const focused = usePlatformStore((s) => s.workspace.focusedPane)
  const activeModule = usePlatformStore((s) => s.activeModule)
  const activeUseCaseId = usePlatformStore((s) => s.activeUseCaseId)
  const setModule = usePlatformStore((s) => s.setModule)
  const closePane = usePlatformStore((s) => s.closePane)
  const reorderPanes = usePlatformStore((s) => s.reorderPanes)
  const expandAllPanes = usePlatformStore((s) => s.expandAllPanes)
  const [dragFrom, setDragFrom] = useState<number | null>(null)

  const active =
    (focused && openPanes.includes(focused) ? focused : null) ??
    (openPanes.includes(activeModule) ? activeModule : openPanes[0])

  return (
    <div className="shrink-0 flex items-center gap-1 border-b border-slate-800/90 bg-[#060a12] px-1.5 py-1 overflow-x-auto">
      <div className="flex items-center gap-1 min-w-0 flex-1">
        {openPanes.map((p, index) => {
          const on = p === active
          const label = storyTabLabel(activeUseCaseId, p, MODULE_META[p].short)
          return (
            <div
              key={p}
              draggable
              onDragStart={() => setDragFrom(index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragFrom != null) reorderPanes(dragFrom, index)
                setDragFrom(null)
              }}
              onDragEnd={() => setDragFrom(null)}
              className={`group flex items-center gap-0.5 rounded-md border text-[11px] transition ${
                on
                  ? 'border-cyan-700 bg-cyan-950/50 text-cyan-50'
                  : 'border-slate-800 bg-slate-950/80 text-slate-400 hover:text-slate-200 hover:border-slate-600'
              }`}
            >
              <button
                type="button"
                onClick={() => setModule(p)}
                className="nexos-tab-btn focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 rounded-l-md"
                title={`${label} — ${MODULE_META[p].description} · drag to reorder`}
              >
                {label}
              </button>
              {openPanes.length > 1 && (
                <button
                  type="button"
                  className="pr-1.5 pl-0.5 text-slate-600 hover:text-rose-300 opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Close tab"
                  onClick={(e) => {
                    e.stopPropagation()
                    closePane(p)
                  }}
                >
                  ×
                </button>
              )}
            </div>
          )
        })}
      </div>
      <button
        type="button"
        onClick={() => expandAllPanes()}
        className="shrink-0 rounded border border-slate-700 px-2 py-1 text-[10px] text-slate-400 hover:text-slate-100 hover:border-slate-500"
        title="Open all 9 modules as tabs"
      >
        Expand all
      </button>
    </div>
  )
}

export function Workspace() {
  const workspace = usePlatformStore((s) => s.workspace)
  const activeUseCaseId = usePlatformStore((s) => s.activeUseCaseId)
  const activeModule = usePlatformStore((s) => s.activeModule)
  const evidence = usePlatformStore((s) => s.evidence)
  const researchNotes = usePlatformStore((s) => s.researchNotes)
  const ladder = usePlatformStore((s) => s.ladder)
  const dataPack = usePlatformStore((s) => s.dataPack)
  const conditions = usePlatformStore((s) => s.conditions)
  const setModule = usePlatformStore((s) => s.setModule)
  const maximizePane = usePlatformStore((s) => s.maximizePane)
  const restoreLayout = usePlatformStore((s) => s.restoreLayout)
  const closePane = usePlatformStore((s) => s.closePane)
  const reorderPanes = usePlatformStore((s) => s.reorderPanes)
  const setPrimaryFraction = usePlatformStore((s) => s.setPrimaryFraction)
  const setSecondaryFraction = usePlatformStore((s) => s.setSecondaryFraction)

  const [vp, setVp] = useState(measureViewport)
  const gridRef = useRef<HTMLDivElement>(null)
  const tileDragFrom = useRef<number | null>(null)

  useEffect(() => {
    const onResize = () => setVp(measureViewport())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const profile = getUseCase(activeUseCaseId)
  const openNeg = unresolvedNegatives(evidence).length
  const ladderCurrent = ladder.current

  const signals: DepthSignals = useMemo(
    () => ({
      evidenceCount: evidence.length,
      unscoredCount: 0,
      openNegatives: openNeg,
      researchChars: researchNotes.reduce((n, r) => n + r.body.length + r.title.length, 0),
      ladderCurrent,
      spatialPointCount: dataPack.spatialPoints.length,
      conditionAxisCount: conditions
        ? Object.keys(conditions.selections).length
        : dataPack.conditionMatrices[0]?.axes.length ?? 0,
      graphEdgeCount: dataPack.graphEdges.length,
    }),
    [evidence.length, openNeg, researchNotes, ladderCurrent, dataPack, conditions],
  )

  const layout = useMemo(
    () =>
      formatLayout({
        openPanes: workspace.openPanes,
        preset: profile.layoutPreset,
        paneWeights: profile.paneWeights,
        signals,
        viewport: vp,
        primaryFraction: workspace.primaryFraction,
        secondaryFraction: workspace.secondaryFraction,
        maximizedPane: workspace.maximizedPane,
        singleModuleMode: workspace.singleModuleMode,
        focusedPane: workspace.focusedPane,
      }),
    [workspace, profile, signals, vp],
  )

  const neg = openNeg
  // Sole mode: always Immersive (tabs/tiles retired)
  const viewMode = 'immersive' as const

  const activeTab =
    (workspace.focusedPane && workspace.openPanes.includes(workspace.focusedPane)
      ? workspace.focusedPane
      : null) ??
    (workspace.openPanes.includes(activeModule) ? activeModule : workspace.openPanes[0]) ??
    activeModule

  const isMaximized = Boolean(workspace.maximizedPane)
  const soloOpen = workspace.openPanes.length === 1
  /** Full-stage: maximize, solo open pane, or layout engine single/max mode */
  const fullStage =
    isMaximized ||
    soloOpen ||
    layout.mode === 'maximized' ||
    layout.mode === 'single'

  const tilesInteractive =
    viewMode === 'tiles' && !fullStage && !workspace.layoutLocked

  const renderPane = useCallback(
    (pane: ModuleId, opts?: { dense?: boolean; compact?: boolean; full?: boolean }) => {
      const slot = layout.slots.find((s) => s.pane === pane)
      const focused = workspace.focusedPane === pane || activeModule === pane
      const maxed = workspace.maximizedPane === pane || (soloOpen && workspace.openPanes[0] === pane)
      const full = Boolean(opts?.full || maxed || fullStage)
      const fromIdx = workspace.openPanes.indexOf(pane)
      return (
        <PaneFrame
          key={pane}
          pane={pane}
          focused={focused}
          maximized={maxed}
          locked={workspace.layoutLocked}
          pinned={slot?.pinned}
          openNegatives={neg}
          dense={opts?.dense && !full}
          draggableTile={tilesInteractive && fromIdx >= 0}
          onTileDragStart={() => {
            tileDragFrom.current = fromIdx
          }}
          onTileDragOver={(e) => {
            e.preventDefault()
          }}
          onTileDrop={() => {
            const from = tileDragFrom.current
            const to = workspace.openPanes.indexOf(pane)
            if (from != null && to >= 0 && from !== to) {
              reorderPanes(from, to)
            }
            tileDragFrom.current = null
          }}
          onFocus={() => setModule(pane)}
          onMaximize={() => {
            if (workspace.maximizedPane === pane || soloOpen) {
              restoreLayout()
            } else {
              maximizePane(pane)
            }
          }}
          onClose={
            workspace.openPanes.length <= 1 || slot?.pinned
              ? undefined
              : () => closePane(pane)
          }
        >
          <ModuleHost
            id={pane}
            embedded={!full}
            compact={!full && (opts?.compact ?? pane === 'export-kit')}
          />
        </PaneFrame>
      )
    },
    [
      layout.slots,
      workspace.focusedPane,
      workspace.layoutLocked,
      workspace.maximizedPane,
      workspace.openPanes,
      soloOpen,
      fullStage,
      tilesInteractive,
      activeModule,
      neg,
      setModule,
      maximizePane,
      restoreLayout,
      closePane,
      reorderPanes,
    ],
  )

  // —— Immersive / Jarvis HUD ——
  if (viewMode === 'immersive') {
    return (
      <div className="h-full min-h-0 flex flex-col">
        <TabBar />
        <div className="flex-1 min-h-0">
          <ImmersiveStage activePane={activeTab} />
        </div>
      </div>
    )
  }

  // —— Maximized / solo single tile (full stage) — before tabs so ⛶ works in every mode ——
  if (fullStage && viewMode !== 'tabs' && !workspace.singleModuleMode) {
    const pane =
      workspace.maximizedPane && workspace.openPanes.includes(workspace.maximizedPane)
        ? workspace.maximizedPane
        : layout.slots[0]?.pane ?? workspace.openPanes[0] ?? activeModule
    return (
      <div className="h-full min-h-0 flex flex-col">
        <TabBar />
        <div className="flex-1 min-h-0 p-0.5 flex flex-col">
          {renderPane(pane, { full: true, compact: false })}
        </div>
      </div>
    )
  }

  // —— Tabs: full-height single stage (every module available) ——
  if (viewMode === 'tabs' || workspace.singleModuleMode) {
    const pane =
      (workspace.maximizedPane && workspace.openPanes.includes(workspace.maximizedPane)
        ? workspace.maximizedPane
        : null) ?? activeTab
    return (
      <div className="h-full min-h-0 flex flex-col">
        <TabBar />
        <div className="flex-1 min-h-0 p-0.5 flex flex-col">
          {renderPane(pane, { full: true, compact: false })}
        </div>
      </div>
    )
  }

  // —— Narrow viewport: force tabs ——
  if (layout.mode === 'stacked-tabs') {
    return (
      <div className="h-full min-h-0 flex flex-col">
        <TabBar />
        <div className="flex-1 min-h-0">{renderPane(activeTab, { full: true })}</div>
      </div>
    )
  }

  // —— Tiles with working splitters ——
  const primary =
    layout.slots.find((s) => s.region === 'primary')?.pane ?? layout.slots[0]?.pane
  const rest = layout.slots.filter((s) => s.pane !== primary).map((s) => s.pane)
  const pf = workspace.primaryFraction
  const sf = workspace.secondaryFraction
  const isSpatial = profile.layoutPreset === 'spatial-primary' || primary === 'atlas'
  const atlasMin = isSpatial ? 480 : 320
  const locked = workspace.layoutLocked
  // Give map more room when it is the primary / focused tile
  const atlasFocused =
    primary === 'atlas' ||
    workspace.focusedPane === 'atlas' ||
    activeModule === 'atlas'
  const pfEff = atlasFocused ? Math.max(pf, isSpatial ? 0.68 : 0.6) : pf

  const onPrimaryDrag = (deltaPx: number, containerW: number) => {
    if (locked || containerW <= 0) return
    setPrimaryFraction(workspace.primaryFraction + deltaPx / containerW)
  }
  const onSecondaryDrag = (deltaPx: number, containerH: number) => {
    if (locked || containerH <= 0) return
    setSecondaryFraction(workspace.secondaryFraction + deltaPx / containerH)
  }

  if (layout.mode === 'two-col' || rest.length === 1) {
    const secondary = rest[0]
    return (
      <div className="h-full min-h-0 flex flex-col">
        <TabBar />
        {!locked && (
          <div className="shrink-0 px-2 py-0.5 text-[10px] text-cyan-600/90 bg-cyan-950/20 border-b border-cyan-900/30">
            Unlocked — drag tiles to reorder · drag cyan splitters to resize · double-click
            splitter to reset
          </div>
        )}
        <div
          ref={gridRef}
          className="flex-1 min-h-0 grid gap-0"
          style={{
            gridTemplateColumns: secondary
              ? `minmax(${atlasMin}px, ${pfEff}fr) 8px minmax(200px, ${1 - pfEff}fr)`
              : '1fr',
          }}
        >
          {primary && <div className="min-h-0 min-w-0 h-full">{renderPane(primary)}</div>}
          {secondary && (
            <>
              <Splitter
                orientation="vertical"
                locked={locked}
                onDrag={onPrimaryDrag}
                onReset={() => setPrimaryFraction(isSpatial ? 0.62 : 0.55)}
              />
              <div className="min-h-0 min-w-0 h-full">{renderPane(secondary)}</div>
            </>
          )}
        </div>
      </div>
    )
  }

  const secondary = rest[0]
  const tertiary = rest.slice(1)

  return (
    <div className="h-full min-h-0 flex flex-col">
      <TabBar />
      {!locked && (
        <div className="shrink-0 px-2 py-0.5 text-[10px] text-cyan-600/90 bg-cyan-950/20 border-b border-cyan-900/30">
          Unlocked — drag tiles to reorder · drag splitters to resize · ⛶ maximize · Desk map:
          Solo map = large map + brief
        </div>
      )}
      <div
        ref={gridRef}
        className="flex-1 min-h-0 grid gap-0"
        style={{
          gridTemplateColumns: tertiary.length
            ? `minmax(${atlasMin}px, ${pfEff}fr) 8px minmax(200px, ${(1 - pfEff) * 0.58}fr) 8px minmax(160px, ${(1 - pfEff) * 0.42}fr)`
            : `minmax(${atlasMin}px, ${pfEff}fr) 8px minmax(200px, ${1 - pfEff}fr)`,
        }}
      >
        {primary && <div className="min-h-0 min-w-0 h-full">{renderPane(primary)}</div>}
        <Splitter
          orientation="vertical"
          locked={locked}
          onDrag={onPrimaryDrag}
          onReset={() => setPrimaryFraction(isSpatial ? 0.62 : 0.55)}
        />
        {secondary && (
          <div
            className="min-h-0 min-w-0 h-full grid gap-0"
            style={
              rest.length > 1
                ? {
                    gridTemplateRows: `minmax(120px, ${sf}fr) 8px minmax(120px, ${1 - sf}fr)`,
                  }
                : { gridTemplateRows: '1fr' }
            }
          >
            {rest.length === 1 ? (
              renderPane(secondary)
            ) : (
              <>
                {renderPane(secondary, { dense: true })}
                <Splitter
                  orientation="horizontal"
                  locked={locked}
                  onDrag={onSecondaryDrag}
                  onReset={() => setSecondaryFraction(0.55)}
                />
                {rest[1] &&
                  renderPane(rest[1]!, {
                    dense: true,
                    compact: rest[1] === 'export-kit',
                  })}
              </>
            )}
          </div>
        )}
        {tertiary.length > 0 && (
          <>
            <Splitter
              orientation="vertical"
              locked={locked}
              onDrag={onPrimaryDrag}
              onReset={() => setPrimaryFraction(isSpatial ? 0.55 : 0.48)}
            />
            <div className="min-h-0 min-w-0 h-full flex flex-col gap-1.5">
              {tertiary.map((p) => (
                <div key={p} className="flex-1 min-h-0">
                  {renderPane(p, { dense: true, compact: p === 'export-kit' })}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
