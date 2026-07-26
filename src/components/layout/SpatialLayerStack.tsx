import { useState } from 'react'
import { Layers, Eye, EyeOff } from 'lucide-react'
import {
  INVESTIGATION_LAYERS,
  HIERARCHY_LABELS,
  explainLayersForHumans,
  groundingPlain,
  defaultLayerVisibility,
  type LayerVisibility,
  type InvestigationLayerId,
  type HierarchyLevel,
} from '../../lib/map/investigationLayers'

/**
 * Plain-language spatial layer stack for Atlas / Massing chrome.
 * Inspired by multi-layer atlases + hierarchical site maps — civic-safe rewrite.
 */
export function SpatialLayerStack({
  compact,
  onChange,
}: {
  compact?: boolean
  onChange?: (v: LayerVisibility) => void
} = {}) {
  const [vis, setVis] = useState<LayerVisibility>(() => defaultLayerVisibility())
  const [open, setOpen] = useState(!compact)

  const toggle = (id: InvestigationLayerId) => {
    setVis((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      onChange?.(next)
      return next
    })
  }

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950/80 text-[11px] text-slate-300">
      <button
        type="button"
        className="w-full flex items-center gap-2 px-2.5 py-2 text-left hover:bg-slate-900/80 focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-600/50"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <Layers size={14} className="text-cyan-500 shrink-0" />
        <span className="font-medium text-slate-100">Map layers</span>
        <span className="text-[10px] text-slate-500 ml-auto">{open ? 'Hide' : 'Show'}</span>
      </button>
      {open && (
        <div className="px-2.5 pb-2.5 space-y-2 border-t border-slate-800/80 pt-2">
          <p className="text-[10px] text-slate-500 leading-snug">{explainLayersForHumans()}</p>
          <ul className="space-y-1.5">
            {INVESTIGATION_LAYERS.map((L) => {
              const on = vis[L.id]
              return (
                <li key={L.id}>
                  <button
                    type="button"
                    onClick={() => toggle(L.id)}
                    className={`w-full flex items-start gap-2 rounded-md px-2 py-1.5 text-left border ${
                      on
                        ? 'border-slate-700 bg-slate-900/60'
                        : 'border-transparent opacity-60 hover:opacity-90'
                    }`}
                  >
                    <span
                      className="mt-0.5 h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ background: L.color }}
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5 text-slate-100">
                        {L.label}
                        {on ? (
                          <Eye size={11} className="text-slate-500" />
                        ) : (
                          <EyeOff size={11} className="text-slate-600" />
                        )}
                      </span>
                      <span className="block text-[10px] text-slate-500 leading-snug">{L.plain}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
          <div className="rounded-md border border-slate-800 bg-slate-950/50 px-2 py-1.5">
            <div className="text-[9px] uppercase tracking-wide text-slate-500 mb-1">
              Scale ladder
            </div>
            <div className="flex flex-wrap gap-1">
              {(Object.keys(HIERARCHY_LABELS) as HierarchyLevel[]).map((k) => (
                <span
                  key={k}
                  className="rounded bg-slate-900 border border-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400"
                  title={HIERARCHY_LABELS[k].plain}
                >
                  {HIERARCHY_LABELS[k].label}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-md border border-cyan-900/40 bg-cyan-950/20 px-2 py-1.5 text-[10px] text-cyan-100/90 space-y-0.5">
            <div className="text-[9px] uppercase tracking-wide text-cyan-600">Before you trust a pin</div>
            <div>1. {groundingPlain('perception')}</div>
            <div>2. {groundingPlain('record')}</div>
            <div>3. {groundingPlain('score')}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SpatialLayerStack
