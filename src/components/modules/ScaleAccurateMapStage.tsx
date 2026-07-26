/**
 * Public-map stage: real WGS84 locations, meter footprints, zoom-gated selection.
 * Auto-scale (flyTo) when a feature becomes selected.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Circle,
  CircleMarker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import type { ScaleAccurateFeature } from '../../lib/map/scaleAccurateFeatures'
import {
  SCALE_CLASSES,
  autoZoomForScale,
  isScaleSelectable,
  isScaleVisible,
  zoomForFootprint,
  type ScaleClass,
} from '../../lib/map/geoScale'
import {
  ALL_BASEMAP_IDS,
  BASEMAPS,
  type BasemapId,
} from '../../lib/map/mapFilters'
import { pinColorForScore } from '../../lib/ui/claimStatus'
import { openSafeExternal } from '../../lib/security/urlSafety'
import type { EvidenceScore } from '../../types/core'

function ZoomWatcher({ onZoom }: { onZoom: (z: number) => void }) {
  const map = useMap()
  useMapEvents({
    zoomend: () => onZoom(map.getZoom()),
    moveend: () => onZoom(map.getZoom()),
  })
  useEffect(() => {
    onZoom(map.getZoom())
  }, [map, onZoom])
  return null
}

function FlyToFeature({
  feature,
  token,
}: {
  feature: ScaleAccurateFeature | null
  token: number
}) {
  const map = useMap()
  useEffect(() => {
    if (!feature || token <= 0) return
    // Intelligent frame: class auto-zoom, footprint target, hard cap 17 (no dirt thrash)
    const z = Math.min(
      17,
      Math.max(
        2,
        autoZoomForScale(feature.scale),
        zoomForFootprint(feature.footprintM, feature.lat, 72),
      ),
    )
    map.flyTo([feature.lat, feature.lng], z, { duration: 0.55 })
  }, [feature, token, map])
  return null
}

function FitOrigin({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap()
  const done = useRef(false)
  useEffect(() => {
    if (done.current) return
    done.current = true
    map.setMinZoom(2)
    map.setView([lat, lng], Math.max(2, Math.min(17, zoom)), { animate: false })
  }, [map, lat, lng, zoom])
  return null
}

export function ScaleAccurateMapStage({
  features,
  originLat,
  originLng,
  selectedId,
  onSelect,
  onBlockedSelect,
  basemapId,
  onBasemapChange,
  className = '',
}: {
  features: ScaleAccurateFeature[]
  originLat: number
  originLng: number
  selectedId: string | null
  onSelect: (f: ScaleAccurateFeature) => void
  /** Called when user clicks a feature that is not scale-selectable yet */
  onBlockedSelect?: (f: ScaleAccurateFeature, needZoom: number) => void
  basemapId: BasemapId
  onBasemapChange: (id: BasemapId) => void
  className?: string
}) {
  const [zoom, setZoom] = useState(13)
  const [flyToken, setFlyToken] = useState(0)
  const selected = features.find((f) => f.id === selectedId) ?? null
  const basemap = BASEMAPS[basemapId]

  const counts = useMemo(() => {
    const visible = features.filter((f) => isScaleVisible(f.scale, zoom))
    const selectable = visible.filter((f) =>
      isScaleSelectable(f.scale, zoom, f.lat, f.footprintM),
    )
    return { visible: visible.length, selectable: selectable.length, total: features.length }
  }, [features, zoom])

  const trySelect = (f: ScaleAccurateFeature) => {
    if (!isScaleSelectable(f.scale, zoom, f.lat, f.footprintM)) {
      const need = SCALE_CLASSES[f.scale].minSelectZoom
      onBlockedSelect?.(f, need)
      // Auto-scale toward feature so user can select after fly
      setFlyToken((t) => t + 1)
      onSelect(f) // still set selection; fly engages
      return
    }
    onSelect(f)
    setFlyToken((t) => t + 1)
  }

  return (
    <div className={`flex flex-col min-h-0 h-full ${className}`}>
      <div className="shrink-0 flex flex-wrap items-center gap-1 px-1.5 py-1 border-b border-slate-800 bg-slate-950/90">
        <span className="text-[9px] uppercase tracking-wide text-slate-500 mr-1">Public basemap</span>
        {ALL_BASEMAP_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => onBasemapChange(id)}
            className={`rounded px-1.5 py-0.5 text-[9px] border ${
              basemapId === id
                ? 'border-cyan-500 bg-cyan-950/50 text-cyan-100'
                : 'border-slate-700 text-slate-500 hover:text-slate-200'
            }`}
          >
            {BASEMAPS[id].label}
          </button>
        ))}
        <span className="text-[9px] text-slate-500 ml-auto font-mono">
          Zoom {zoom.toFixed(0)} · {counts.selectable} ready to inspect · {counts.total} on map
        </span>
      </div>
      <div className="shrink-0 flex flex-wrap gap-1 px-1.5 py-1 border-b border-slate-800/80 bg-black/40 text-[9px] text-slate-500">
        {(Object.keys(SCALE_CLASSES) as ScaleClass[]).map((sc) => {
          const s = SCALE_CLASSES[sc]
          const ok = zoom >= s.minSelectZoom
          return (
            <span
              key={sc}
              className={`rounded-full px-1.5 py-0.5 border ${
                ok
                  ? 'border-emerald-800/50 text-emerald-400/90'
                  : 'border-slate-800 text-slate-600'
              }`}
              title={`${s.label}: clickable from zoom ${s.minSelectZoom}+ (eases in if smaller)`}
            >
              {s.label}
            </span>
          )
        })}
        <span className="text-slate-600">· Circles = ground meters · click frames intelligently</span>
      </div>
      <div className="relative flex-1 min-h-0">
        <MapContainer
          center={[originLat, originLng]}
          zoom={13}
          minZoom={2}
          maxZoom={18}
          className="h-full w-full absolute inset-0"
          style={{ height: '100%', width: '100%', background: '#0a0f18' }}
          scrollWheelZoom
          maxBounds={[
            [-85, -180],
            [85, 180],
          ]}
          maxBoundsViscosity={1}
        >
          <TileLayer
            key={basemap.id}
            url={basemap.url}
            attribution={basemap.attribution}
            maxZoom={basemap.maxZoom}
            minZoom={2}
          />
          <FitOrigin lat={originLat} lng={originLng} zoom={13} />
          <ZoomWatcher onZoom={setZoom} />
          <FlyToFeature feature={selected} token={flyToken} />

          {features.map((f) => {
            if (!isScaleVisible(f.scale, zoom)) return null
            const selectable = isScaleSelectable(f.scale, zoom, f.lat, f.footprintM)
            const color = pinColorForScore((f.score ?? 0) as EvidenceScore)
            const active = f.id === selectedId
            const r = Math.max(1.5, f.footprintM / 2)

            return (
              <Circle
                key={f.id}
                center={[f.lat, f.lng]}
                radius={r}
                pathOptions={{
                  color: active ? '#22d3ee' : color,
                  fillColor: color,
                  fillOpacity: selectable ? 0.35 : 0.12,
                  weight: active ? 3 : selectable ? 2 : 1,
                  opacity: selectable ? 0.95 : 0.4,
                  dashArray: selectable ? undefined : '4 4',
                }}
                eventHandlers={{
                  click: () => trySelect(f),
                }}
              >
                <Popup>
                  <div className="text-xs min-w-[200px] max-w-[280px]">
                    <div className="font-semibold text-slate-900">{f.label}</div>
                    <div className="text-slate-600 mt-0.5">
                      {f.scale} · ⌀ {f.footprintM} m · {f.kind}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {f.lat.toFixed(5)}°, {f.lng.toFixed(5)}°
                    </div>
                    {!selectable && (
                      <div className="mt-1 text-amber-700 text-[11px]">
                        Zoom ≥ {SCALE_CLASSES[f.scale].minSelectZoom} to select at this scale
                        (auto-scale will engage).
                      </div>
                    )}
                    <ul className="mt-1 space-y-0.5 text-[11px] text-slate-700">
                      {f.notes.slice(0, 4).map((n) => (
                        <li key={n}>· {n}</li>
                      ))}
                    </ul>
                    <div className="mt-1.5 flex flex-col gap-0.5">
                      {f.mapLinks.map((l) => (
                        <button
                          key={l.url}
                          type="button"
                          className="text-left text-[11px] text-sky-700 underline"
                          onClick={() => openSafeExternal(l.url)}
                        >
                          {l.label}
                        </button>
                      ))}
                    </div>
                    {selectable && (
                      <button
                        type="button"
                        className="mt-2 w-full rounded bg-slate-800 text-slate-100 px-2 py-1 text-[11px]"
                        onClick={() => trySelect(f)}
                      >
                        Select · auto-scale
                      </button>
                    )}
                  </div>
                </Popup>
              </Circle>
            )
          })}

          {/* Origin crosshair — always on */}
          <CircleMarker
            center={[originLat, originLng]}
            radius={5}
            pathOptions={{ color: '#22d3ee', fillColor: '#22d3ee', fillOpacity: 0.9, weight: 2 }}
          />
        </MapContainer>
      </div>
    </div>
  )
}

export default ScaleAccurateMapStage
