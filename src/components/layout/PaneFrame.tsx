import type { ReactNode, DragEvent } from 'react'
import { Focus, Maximize2, Minimize2, X, Lock, GripVertical } from 'lucide-react'
import type { ModuleId } from '../../types/core'
import { MODULE_META } from '../../types/core'
import { Btn, EvidenceBadge } from '../ui/primitives'
import { usePlatformStore } from '../../store/platformStore'
import { storyTabLabel, resolveStory } from '../../data/useCases/stories'

export function PaneFrame({
  pane,
  children,
  focused,
  maximized,
  locked,
  pinned,
  openNegatives,
  onFocus,
  onMaximize,
  onClose,
  dense,
  draggableTile,
  onTileDragStart,
  onTileDragOver,
  onTileDrop,
}: {
  pane: ModuleId
  children: ReactNode
  focused?: boolean
  maximized?: boolean
  locked?: boolean
  pinned?: boolean
  openNegatives?: number
  onFocus: () => void
  onMaximize: () => void
  onClose?: () => void
  dense?: boolean
  /** Tile mode: drag entire pane to reorder layout */
  draggableTile?: boolean
  onTileDragStart?: () => void
  onTileDragOver?: (e: React.DragEvent) => void
  onTileDrop?: () => void
}) {
  const activeUseCaseId = usePlatformStore((s) => s.activeUseCaseId)
  const meta = MODULE_META[pane]
  const title = storyTabLabel(activeUseCaseId, pane, meta.label)
  const story = resolveStory(activeUseCaseId)
  const surfaceHint =
    story?.surfaces[
      pane === 'atlas'
        ? 'map'
        : pane === 'research-hub'
          ? 'research'
          : pane === 'design-lab'
            ? 'design'
            : pane === 'audit-ladder'
              ? 'ladder'
              : pane === 'analyst'
                ? 'analyst'
                : pane === 'procedural-forge' || pane === 'massing-viewer'
                  ? 'model'
                  : pane === 'export-kit'
                    ? 'export'
                    : pane === 'information'
                      ? 'research'
                      : 'research'
    ]
  const isAtlas = pane === 'atlas'

  return (
    <section
      className={`flex flex-col min-h-0 min-w-0 rounded-lg border bg-slate-950/80 overflow-hidden ${
        focused
          ? 'border-cyan-700/70 ring-1 ring-cyan-800/40'
          : 'border-slate-800/90'
      }`}
      data-pane={pane}
      onMouseDown={onFocus}
      onDragOver={(e: DragEvent) => {
        if (!draggableTile) return
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        onTileDragOver?.(e)
      }}
      onDrop={(e: DragEvent) => {
        if (!draggableTile) return
        e.preventDefault()
        onTileDrop?.()
      }}
    >
      <header
        className={`shrink-0 flex items-center justify-between gap-1 px-2 py-1 border-b border-slate-800/80 bg-[#070b14] ${
          draggableTile ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
        }`}
        draggable={Boolean(draggableTile)}
        onDragStart={(e: DragEvent) => {
          if (!draggableTile) return
          e.dataTransfer.setData('text/pane-id', pane)
          e.dataTransfer.effectAllowed = 'move'
          onTileDragStart?.()
        }}
        onDoubleClick={(e) => {
          e.preventDefault()
          onMaximize()
        }}
        title={
          draggableTile
            ? 'Drag header to move tile · double-click to maximize'
            : 'Double-click header to maximize / restore'
        }
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {draggableTile && (
            <span
              className="text-slate-600 shrink-0 cursor-grab active:cursor-grabbing"
              title="Drag to move this tile"
              aria-hidden
            >
              <GripVertical size={12} />
            </span>
          )}
          <div className="min-w-0">
            <h2 className="nexos-pane-title font-semibold tracking-wide text-slate-200 truncate">
              {title}
            </h2>
            {surfaceHint && (
              <p className="text-[9px] text-slate-500 truncate max-w-[min(420px,50vw)]" title={surfaceHint}>
                {surfaceHint}
              </p>
            )}
          </div>
          {locked && (
            <Lock size={10} className="text-slate-600 shrink-0" aria-label="Layout locked" />
          )}
          {pinned && (
            <span className="text-[9px] text-cyan-700/90 uppercase tracking-wide">pinned</span>
          )}
          {openNegatives != null && openNegatives > 0 && pane === 'research-hub' && (
            <span className="inline-flex items-center gap-0.5">
              <EvidenceBadge score={-1} />
              <span className="text-[9px] text-rose-300/90">{openNegatives} disputed</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-0.5 shrink-0" onMouseDown={(e) => e.stopPropagation()}>
          <Btn variant="ghost" className="!p-1 !text-[10px]" title="Focus pane" onClick={onFocus}>
            <Focus size={12} />
          </Btn>
          <Btn
            variant="ghost"
            className="!p-1 !text-[10px]"
            title={
              maximized
                ? 'Restore multi-pane layout'
                : isAtlas
                  ? 'Fullscreen desk map + high-level brief'
                  : 'Fullscreen this tile with full details'
            }
            onClick={onMaximize}
          >
            {maximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </Btn>
          {onClose && !pinned && (
            <Btn variant="ghost" className="!p-1 !text-[10px]" title="Close pane" onClick={onClose}>
              <X size={12} />
            </Btn>
          )}
        </div>
      </header>
      <div
        className={`flex-1 min-h-0 flex flex-col ${
          isAtlas ? 'overflow-hidden p-1' : `overflow-auto ${dense ? 'p-1.5' : 'p-2'}`
        }`}
      >
        {/* Atlas must stretch to full pane height so the map is not a tiny box */}
        <div className={isAtlas ? 'flex-1 min-h-0 h-full w-full' : 'contents'}>{children}</div>
      </div>
    </section>
  )
}
