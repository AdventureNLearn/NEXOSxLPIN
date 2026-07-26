/**
 * Map-first immersive workspace.
 * Location map = independent base layer.
 * Overlays = free-floating, draggable, resizable windows over the map (high z-index).
 */

import { useCallback, useEffect, useRef, useState, type PointerEvent as RE } from 'react'
import {
  BookOpen,
  Boxes,
  ChevronDown,
  ChevronUp,
  FileOutput,
  GripHorizontal,
  Layers,
  ListChecks,
  Lock,
  Map as MapIcon,
  PanelLeftClose,
  PanelLeftOpen,
  Scale,
  Sparkles,
  Unlock,
  Users,
  X,
} from 'lucide-react'
import { usePlatformStore } from '../../store/platformStore'
import { getUseCase } from '../../data/useCases/catalog'
import { getSimulation } from '../../data/useCases/simulations'
import type { ModuleId } from '../../types/core'
import { ModuleHost } from './ModuleHost'
import { EvidenceBadge } from '../ui/primitives'
import { unresolvedNegatives } from '../../core/evidence'
import { VisualAssistant } from './VisualAssistant'
import { DISCLAIMER_STATUS_BAR, MATURITY_BADGE } from '../../lib/product/maturity'

type OverlayId =
  | 'claims'
  | 'model'
  | 'experts'
  | 'guide'
  | 'share'
  | 'rules'
  | 'depth'
  | 'sketch'
  | 'cmd'

type Rect = { x: number; y: number; w: number; h: number }

const OVERLAY_META: Record<
  OverlayId,
  { module: ModuleId; label: string; icon: typeof MapIcon; defaultW: number; defaultH: number }
> = {
  claims: { module: 'research-hub', label: 'Claims', icon: ListChecks, defaultW: 380, defaultH: 520 },
  model: { module: 'massing-viewer', label: 'Model', icon: Boxes, defaultW: 440, defaultH: 520 },
  experts: { module: 'sme-lenses', label: 'Experts', icon: Users, defaultW: 360, defaultH: 480 },
  guide: { module: 'information', label: 'Guide', icon: BookOpen, defaultW: 400, defaultH: 480 },
  share: { module: 'export-kit', label: 'Share', icon: FileOutput, defaultW: 400, defaultH: 460 },
  rules: { module: 'design-lab', label: 'Rules', icon: Scale, defaultW: 380, defaultH: 460 },
  depth: { module: 'audit-ladder', label: 'Depth', icon: Layers, defaultW: 380, defaultH: 460 },
  sketch: { module: 'procedural-forge', label: 'Sketch', icon: Sparkles, defaultW: 400, defaultH: 480 },
  cmd: { module: 'analyst', label: 'Cmd', icon: ListChecks, defaultW: 360, defaultH: 420 },
}

const PRIMARY_OVERLAYS: OverlayId[] = ['claims', 'model', 'experts', 'share']
const SECONDARY_OVERLAYS: OverlayId[] = ['guide', 'rules', 'depth', 'sketch', 'cmd']

/** Leaflet map panes sit at 400–1000 inside their root; our stage layers must clear chrome + map. */
const Z_MAP = 1
const Z_CHROME = 20
const Z_DOCK_BASE = 100
const Z_FOOTER = 30

function moduleToOverlay(id: ModuleId): OverlayId | 'map' {
  if (id === 'atlas') return 'map'
  if (id === 'research-hub') return 'claims'
  if (id === 'massing-viewer') return 'model'
  if (id === 'procedural-forge') return 'sketch'
  if (id === 'sme-lenses') return 'experts'
  if (id === 'information') return 'guide'
  if (id === 'export-kit') return 'share'
  if (id === 'design-lab') return 'rules'
  if (id === 'audit-ladder') return 'depth'
  if (id === 'analyst') return 'cmd'
  return 'map'
}

function defaultRect(id: OverlayId, index: number): Rect {
  const m = OVERLAY_META[id]
  const stagger = index * 28
  // Start below chrome (~96px) so title bars are not covered
  return {
    x: 12 + (index % 3) * 40 + (id === 'model' || id === 'sketch' ? 420 : 0),
    y: 100 + stagger,
    w: m.defaultW,
    h: m.defaultH,
  }
}

function clampRect(r: Rect, vw: number, vh: number): Rect {
  const minW = 280
  const minH = 160
  const w = Math.min(Math.max(r.w, minW), Math.max(minW, vw - 16))
  const h = Math.min(Math.max(r.h, minH), Math.max(minH, vh - 48))
  const x = Math.min(Math.max(8, r.x), Math.max(8, vw - 80))
  const y = Math.min(Math.max(72, r.y), Math.max(72, vh - 48))
  return { x, y, w, h }
}

/** Free-floating window: drag title bar to move (unless locked), SE corner to resize, click to raise. */
function FloatingDock({
  id,
  rect,
  z,
  locked,
  onLockedChange,
  onClose,
  onFocus,
  onRect,
}: {
  id: OverlayId
  rect: Rect
  z: number
  locked: boolean
  onLockedChange: (locked: boolean) => void
  onClose: () => void
  onFocus: () => void
  onRect: (r: Rect) => void
}) {
  const meta = OVERLAY_META[id]
  const Icon = meta.icon
  const [collapsed, setCollapsed] = useState(false)
  const mode = useRef<'move' | 'resize' | null>(null)
  const start = useRef({ px: 0, py: 0, rx: 0, ry: 0, rw: 0, rh: 0 })

  const begin = (kind: 'move' | 'resize', e: RE<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
    onFocus()
    if (kind === 'move' && locked) return
    if (kind === 'resize' && locked) return
    mode.current = kind
    start.current = {
      px: e.clientX,
      py: e.clientY,
      rx: rect.x,
      ry: rect.y,
      rw: rect.w,
      rh: rect.h,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onMove = (e: RE<HTMLElement>) => {
    if (!mode.current || locked) return
    const dx = e.clientX - start.current.px
    const dy = e.clientY - start.current.py
    const vw = window.innerWidth
    const vh = window.innerHeight
    if (mode.current === 'move') {
      onRect(
        clampRect(
          {
            x: start.current.rx + dx,
            y: start.current.ry + dy,
            w: start.current.rw,
            h: start.current.rh,
          },
          vw,
          vh,
        ),
      )
    } else {
      onRect(
        clampRect(
          {
            x: start.current.rx,
            y: start.current.ry,
            w: start.current.rw + dx,
            h: start.current.rh + dy,
          },
          vw,
          vh,
        ),
      )
    }
  }

  const onUp = (e: RE<HTMLElement>) => {
    mode.current = null
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }

  const h = collapsed ? 36 : rect.h

  return (
    <div
      className={`absolute flex flex-col rounded-lg border bg-slate-950/95 shadow-2xl shadow-black/60 backdrop-blur-md overflow-hidden pointer-events-auto ${
        locked ? 'border-amber-600/70' : 'border-cyan-700/60'
      }`}
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: h,
        zIndex: z,
      }}
      onMouseDown={onFocus}
      role="dialog"
      aria-label={meta.label}
      aria-roledescription={locked ? 'Locked overlay' : 'Draggable overlay'}
    >
      <header
        className={`shrink-0 flex items-center gap-1 px-1.5 py-1 border-b border-slate-800/90 bg-[#070b14] select-none touch-none ${
          locked ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'
        }`}
        title={locked ? 'Locked in place — click unlock to move' : 'Drag to move over map'}
        onPointerDown={(e) => begin('move', e)}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-cyan-800/50 bg-cyan-950/40 text-cyan-300 pointer-events-none">
          <Icon size={14} />
        </span>
        <span className="text-[11px] font-semibold text-slate-200 truncate flex-1 pointer-events-none">
          {meta.label}
        </span>
        {locked && (
          <span className="text-[8px] uppercase tracking-wider text-amber-500/90 pointer-events-none">
            locked
          </span>
        )}
        <button
          type="button"
          className={`p-1 rounded cursor-pointer ${
            locked ? 'text-amber-400 hover:text-amber-200' : 'text-slate-500 hover:text-cyan-200'
          }`}
          title={locked ? 'Unlock — allow move/resize' : 'Lock in place over workspace'}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            onLockedChange(!locked)
          }}
        >
          {locked ? <Lock size={14} /> : <Unlock size={14} />}
        </button>
        <button
          type="button"
          className="p-1 rounded text-slate-500 hover:text-slate-200 cursor-pointer"
          title={collapsed ? 'Expand' : 'Collapse'}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            setCollapsed((v) => !v)
          }}
        >
          {collapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <button
          type="button"
          className="p-1 rounded text-slate-500 hover:text-rose-300 cursor-pointer"
          title="Close"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation()
            onClose()
          }}
        >
          <X size={14} />
        </button>
      </header>

      {!collapsed && (
        <div className="flex-1 min-h-0 overflow-auto overscroll-contain p-1 bg-slate-950/90">
          <div className="h-full min-h-[160px]">
            <ModuleHost id={meta.module} embedded compact={id === 'experts' || id === 'share'} />
          </div>
        </div>
      )}

      {!collapsed && !locked && (
        <div
          role="separator"
          aria-label="Resize"
          title="Drag to resize"
          onPointerDown={(e) => begin('resize', e)}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className="absolute right-0 bottom-0 w-4 h-4 cursor-se-resize touch-none"
        >
          <GripHorizontal
            size={12}
            className="absolute right-0.5 bottom-0.5 text-cyan-600/80 rotate-[-45deg]"
          />
        </div>
      )}
    </div>
  )
}

export function ImmersiveStage({ activePane }: { activePane: ModuleId }) {
  const activeUseCaseId = usePlatformStore((s) => s.activeUseCaseId)
  const evidence = usePlatformStore((s) => s.evidence)
  const statusMessage = usePlatformStore((s) => s.statusMessage)
  const ack = usePlatformStore((s) => s.layer0AckToken)
  const setModule = usePlatformStore((s) => s.setModule)

  const profile = getUseCase(activeUseCaseId)
  const sim = getSimulation(activeUseCaseId)
  const neg = unresolvedNegatives(evidence)
  const plus = evidence.filter((e) => e.score === 1).length
  const zero = evidence.filter((e) => e.score === 0).length

  const [open, setOpen] = useState<Record<OverlayId, boolean>>({
    claims: true,
    model: false,
    experts: false,
    guide: false,
    share: false,
    rules: false,
    depth: false,
    sketch: false,
    cmd: false,
  })
  const [rects, setRects] = useState<Partial<Record<OverlayId, Rect>>>({})
  const [locked, setLocked] = useState<Partial<Record<OverlayId, boolean>>>({})
  const [focusStack, setFocusStack] = useState<OverlayId[]>(['claims'])
  const [chromeCollapsed, setChromeCollapsed] = useState(false)
  const openCount = useRef(0)

  const ensureRect = useCallback((id: OverlayId) => {
    setRects((prev) => {
      if (prev[id]) return prev
      const r = defaultRect(id, openCount.current++)
      return { ...prev, [id]: clampRect(r, window.innerWidth, window.innerHeight) }
    })
  }, [])

  const desired = moduleToOverlay(activePane)
  useEffect(() => {
    if (desired === 'map') return
    setOpen((prev) => {
      if (prev[desired]) return prev
      return { ...prev, [desired]: true }
    })
    ensureRect(desired)
    setFocusStack((s) => (s[0] === desired ? s : [desired, ...s.filter((x) => x !== desired)]))
  }, [desired, ensureRect])

  // Seed default claims rect
  useEffect(() => {
    ensureRect('claims')
  }, [ensureRect])

  const toggle = useCallback(
    (id: OverlayId) => {
      setOpen((prev) => {
        const next = !prev[id]
        if (next) {
          ensureRect(id)
          setModule(OVERLAY_META[id].module)
          setFocusStack((s) => [id, ...s.filter((x) => x !== id)])
        } else if (activePane === OVERLAY_META[id].module) {
          setModule('atlas')
        }
        return { ...prev, [id]: next }
      })
    },
    [activePane, setModule, ensureRect],
  )

  const close = useCallback(
    (id: OverlayId) => {
      setOpen((prev) => ({ ...prev, [id]: false }))
      if (activePane === OVERLAY_META[id].module) setModule('atlas')
    },
    [activePane, setModule],
  )

  const raise = useCallback((id: OverlayId) => {
    setFocusStack((s) => [id, ...s.filter((x) => x !== id)])
    setModule(OVERLAY_META[id].module)
  }, [setModule])

  const zFor = (id: OverlayId) => {
    const idx = focusStack.indexOf(id)
    return Z_DOCK_BASE + (idx === -1 ? 0 : focusStack.length - idx) * 2
  }

  const openIds = (Object.keys(open) as OverlayId[]).filter((id) => open[id])

  return (
    <div className="relative h-full min-h-0 overflow-hidden bg-[#02040a] flex flex-col">
      {/* BASE: map — lowest layer; Leaflet z-index stays inside this root */}
      <div className="absolute inset-0" style={{ zIndex: Z_MAP }}>
        <ModuleHost id="atlas" mapSurface />
      </div>

      {/* Chrome — below floating docks so panels can cover it when dragged up */}
      <div className="relative shrink-0" style={{ zIndex: Z_CHROME }}>
        <div className="border-b border-cyan-900/40 bg-slate-950/90 backdrop-blur-md">
          <div className="flex items-center justify-between gap-2 px-2 py-1">
            <div className="min-w-0 flex items-center gap-2">
              <span
                className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-cyan-800/40 bg-cyan-950/30 text-cyan-400"
                title="Location map (always on)"
              >
                <MapIcon size={14} />
              </span>
              <div className="min-w-0">
                <div className="text-[12px] font-semibold text-cyan-50 truncate">
                  {profile.label}
                  {sim ? (
                    <span className="ml-1.5 text-[10px] font-normal text-slate-500">
                      {sim.mapPin.cityHint}
                    </span>
                  ) : null}
                </div>
                {!chromeCollapsed && (
                  <div className="text-[9px] text-slate-500 truncate">
                    Drag title bars · lock pin · corner resize · click to raise
                  </div>
                )}
              </div>
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
              <button
                type="button"
                className="p-1 rounded border border-slate-800 text-slate-500 hover:text-slate-200"
                title={chromeCollapsed ? 'Expand chrome' : 'Compact chrome'}
                onClick={() => setChromeCollapsed((v) => !v)}
              >
                {chromeCollapsed ? <PanelLeftOpen size={12} /> : <PanelLeftClose size={12} />}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1 px-2 pb-1.5">
            <span className="text-[9px] uppercase tracking-wide text-slate-600 mr-1">Overlays</span>
            {PRIMARY_OVERLAYS.map((id) => {
              const m = OVERLAY_META[id]
              const Icon = m.icon
              const on = open[id]
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggle(id)}
                  title={`${m.label} — drag title bar over map`}
                  className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] ${
                    on
                      ? 'border-cyan-500/70 bg-cyan-950/50 text-cyan-100'
                      : 'border-slate-800 bg-slate-950/60 text-slate-500 hover:text-slate-200'
                  }`}
                >
                  <Icon size={13} />
                  <span className="hidden sm:inline">{m.label}</span>
                </button>
              )
            })}
            <span className="text-slate-700 mx-0.5">|</span>
            {SECONDARY_OVERLAYS.map((id) => {
              const m = OVERLAY_META[id]
              const Icon = m.icon
              const on = open[id]
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => toggle(id)}
                  title={m.label}
                  className={`inline-flex items-center justify-center rounded border p-1.5 ${
                    on
                      ? 'border-slate-500 bg-slate-900 text-slate-100'
                      : 'border-transparent text-slate-600 hover:text-slate-300 hover:border-slate-800'
                  }`}
                >
                  <Icon size={13} />
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => {
                setOpen({
                  claims: false,
                  model: false,
                  experts: false,
                  guide: false,
                  share: false,
                  rules: false,
                  depth: false,
                  sketch: false,
                  cmd: false,
                })
                setModule('atlas')
              }}
              className="ml-auto rounded border border-slate-800 px-2 py-1 text-[9px] text-slate-500 hover:text-cyan-200"
              title="Hide all overlays — map only"
            >
              Map only
            </button>
          </div>
        </div>
        <VisualAssistant compact />
      </div>

      {/* Floating docks — ABOVE chrome and map (z >= 100) */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: Z_DOCK_BASE }}>
        {openIds.map((id) => {
          const rect = rects[id]
          if (!rect) return null
          return (
            <FloatingDock
              key={id}
              id={id}
              rect={rect}
              z={zFor(id)}
              locked={Boolean(locked[id])}
              onLockedChange={(v) => setLocked((prev) => ({ ...prev, [id]: v }))}
              onClose={() => close(id)}
              onFocus={() => raise(id)}
              onRect={(r) => setRects((prev) => ({ ...prev, [id]: r }))}
            />
          )
        })}
      </div>

      <div
        className="relative mt-auto shrink-0 flex items-center justify-between gap-2 px-2 py-1 border-t border-cyan-900/40 bg-slate-950/90 backdrop-blur-md text-[9px] text-slate-500"
        style={{ zIndex: Z_FOOTER }}
      >
        <span className="truncate text-cyan-100/80">{statusMessage}</span>
        <span className="shrink-0 hidden md:inline max-w-[55%] truncate" title={DISCLAIMER_STATUS_BAR}>
          {MATURITY_BADGE} · Drag overlays · {DISCLAIMER_STATUS_BAR}
        </span>
      </div>
    </div>
  )
}
