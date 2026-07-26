/**
 * Massing — scale-accurate public map stage (not a decorative 3D diorama).
 *
 * - Features only from desk WGS84 + scene points + meter ENU offsets
 * - Circle radii in true meters
 * - Selectable only when zoom scale matches feature class (or auto-scale engages)
 * - Optional 3D detail: selected object only, 1 unit = 1 meter, no fake terrain
 */

import { useEffect, useMemo, useState } from 'react'
import { usePlatformStore } from '../../store/platformStore'
import { Panel, Btn, EvidenceBadge } from '../ui/primitives'
import { MassingCanvas } from './MassingCanvas'
import { ScaleAccurateMapStage } from './ScaleAccurateMapStage'
import { MODEL_DISCLAIMER } from '../../types/core'
import { resolveStory } from '../../data/useCases/stories'
import { getSimulation } from '../../data/useCases/simulations'
import { reasonSceneObjects } from '../../lib/forge/objectReasoning'
import { buildScaleAccurateFeatures } from '../../lib/map/scaleAccurateFeatures'
import { autoScalePlain, type ScaleClass, footprintMetersForLayout } from '../../lib/map/geoScale'
import type { BasemapId } from '../../lib/map/mapFilters'
import { openSafeExternal } from '../../lib/security/urlSafety'
import type { SceneHoverLink } from '../../lib/forge/sceneObjectMeta'
import { getMeshFamily, resolveMeshFamilyId } from '../../data/forge/meshCatalog'

/** Normalize mesh parts so bounding footprint ≈ real meters (1 unit = 1 m). */
function scalePartsToMeters(
  parts: import('../../types/core').MeshPartSpec[],
  targetFootprintM: number,
): import('../../types/core').MeshPartSpec[] {
  let maxR = 0.5
  for (const p of parts) {
    if (p.primitive === 'plane' || p.id.includes('ground') || p.id.startsWith('terrain-')) continue
    const r =
      Math.hypot(p.position[0], p.position[2]) + Math.max(p.size[0], p.size[2]) * 0.5
    maxR = Math.max(maxR, r)
  }
  const s = targetFootprintM / (2 * maxR)
  return parts
    .filter((p) => !p.id.startsWith('terrain-') && p.id !== 'scene-ground' && !p.id.startsWith('zone-'))
    .map((p) => ({
      ...p,
      size: [p.size[0] * s, p.size[1] * s, p.size[2] * s] as [number, number, number],
      position: [p.position[0] * s, p.position[1] * s, p.position[2] * s] as [
        number,
        number,
        number,
      ],
    }))
}

export function MassingViewerModule({ embedded }: { embedded?: boolean } = {}) {
  const assets = usePlatformStore((s) => s.assets)
  const activeId = usePlatformStore((s) => s.activeAssetId)
  const setActiveAsset = usePlatformStore((s) => s.setActiveAsset)
  const setModule = usePlatformStore((s) => s.setModule)
  const setActiveSmeLens = usePlatformStore((s) => s.setActiveSmeLens)
  const seedEvidentiaryModels = usePlatformStore((s) => s.seedEvidentiaryModels)
  const activeUseCaseId = usePlatformStore((s) => s.activeUseCaseId)
  const evidence = usePlatformStore((s) => s.evidence)
  const activeSources = usePlatformStore((s) => s.activeSources)
  const pack = usePlatformStore((s) => s.dataPack)

  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null)
  const [basemapId, setBasemapId] = useState<BasemapId>('satellite')
  const [status, setStatus] = useState<string | null>(null)
  const [showDetail3d, setShowDetail3d] = useState(true)

  const story = resolveStory(activeUseCaseId)
  const sim = getSimulation(activeUseCaseId)

  const report = useMemo(
    () =>
      reasonSceneObjects({
        deskId: activeUseCaseId,
        claims: story?.claims,
        evidence,
      }),
    [activeUseCaseId, story?.claims, evidence],
  )

  const origin = useMemo(
    () =>
      sim?.mapPin ?? {
        useCaseId: activeUseCaseId,
        label: story?.title ?? 'Desk',
        shortLabel: 'Desk',
        lat: 20,
        lng: 0,
        kind: 'site' as const,
        cityHint: story?.where,
      },
    [sim?.mapPin, activeUseCaseId, story?.title, story?.where],
  )

  const scenePoints = useMemo(() => {
    const fromSim = sim?.scenePoints ?? []
    const fromPack = pack?.spatialPoints ?? []
    // Prefer sim; fall back to pack points for this desk
    return fromSim.length ? fromSim : fromPack
  }, [sim, pack])

  const features = useMemo(
    () =>
      buildScaleAccurateFeatures({
        origin,
        scenePoints,
        assets,
        evidentiary: report.objects,
        activeSources,
      }),
    [origin, scenePoints, assets, report.objects, activeSources],
  )

  // Default basemap from geography when desk changes
  useEffect(() => {
    // Satellite for site work; ocean handled by user if maritime
    setBasemapId('satellite')
    setSelectedFeatureId(`pin:${origin.useCaseId}`)
    setStatus(null)
  }, [activeUseCaseId, origin.useCaseId])

  const selectedFeature = features.find((f) => f.id === selectedFeatureId) ?? null
  const selectedAsset =
    selectedFeature?.assetId != null
      ? assets.find((a) => a.id === selectedFeature.assetId)
      : assets.find((a) => a.id === activeId) ?? null

  const detailParts = useMemo(() => {
    if (!selectedAsset || !showDetail3d) return []
    const fam = getMeshFamily(resolveMeshFamilyId(selectedAsset.assetType))
    const fp =
      selectedFeature?.footprintM ??
      footprintMetersForLayout(fam?.layout ?? 'module')
    return scalePartsToMeters(selectedAsset.parts, fp)
  }, [selectedAsset, selectedFeature, showDetail3d])

  const detailCam = useMemo(() => {
    const r = (selectedFeature?.footprintM ?? 10) * 0.9
    return {
      position: [r * 1.4, r * 0.9, r * 1.5] as [number, number, number],
      target: [0, r * 0.15, 0] as [number, number, number],
    }
  }, [selectedFeature])

  const openSme = (smeId: string) => {
    setActiveSmeLens(smeId)
    setModule('sme-lenses')
  }

  const handleLink = (link: SceneHoverLink) => {
    if (link.url) openSafeExternal(link.url)
    else if (link.smeId) openSme(link.smeId)
  }

  return (
    <div className={`h-full flex flex-col min-h-0 ${embedded ? 'gap-1' : 'gap-2'}`}>
      <Panel
        title="Massing · scale-accurate public map"
        actions={
          <div className="flex gap-1 flex-wrap">
            <Btn
              variant="ghost"
              className="!text-[10px]"
              onClick={() => seedEvidentiaryModels()}
              title="Seed claim objects as meter-scale features at scene points"
            >
              Seed models
            </Btn>
            <Btn
              variant={showDetail3d ? 'primary' : 'ghost'}
              className="!text-[10px]"
              onClick={() => setShowDetail3d((v) => !v)}
              title="3D detail only for selected feature (1 unit = 1 m)"
            >
              3D detail
            </Btn>
            <Btn variant="ghost" className="!text-[10px]" onClick={() => setModule('atlas')}>
              Atlas
            </Btn>
            <Btn variant="ghost" className="!text-[10px]" onClick={() => setModule('sme-lenses')}>
              SME
            </Btn>
          </div>
        }
        className="flex-1 min-h-0"
      >
        <div className="flex flex-col h-full min-h-0 gap-1.5">
          <div className="shrink-0 text-[10px] text-slate-400 leading-snug space-y-0.5">
            <div>
              <span className="text-cyan-400 font-mono">
                {origin.lat.toFixed(5)}°, {origin.lng.toFixed(5)}°
              </span>
              <span className="text-slate-600"> · </span>
              {origin.cityHint ?? story?.where ?? 'desk origin'} · {features.length} geo features
              · no decorative stage
            </div>
            <div className="text-[9px] text-slate-500">
              Click a feature to inspect it. If it is too small on screen, the map gently zooms in
              so you can work — not a random jump. Circles use true meters on public basemaps.{' '}
              {MODEL_DISCLAIMER}
            </div>
            {status && (
              <div className="text-[10px] text-amber-400/90 border border-amber-900/40 rounded px-1.5 py-0.5">
                {status}
              </div>
            )}
          </div>

          <div
            className={`flex-1 min-h-0 grid gap-1.5 ${
              showDetail3d && selectedAsset
                ? embedded
                  ? 'grid-rows-[1fr_120px]'
                  : 'grid-rows-[1fr_160px]'
                : 'grid-rows-1'
            }`}
          >
            <ScaleAccurateMapStage
              key={activeUseCaseId}
              className="min-h-[200px]"
              features={features}
              originLat={origin.lat}
              originLng={origin.lng}
              selectedId={selectedFeatureId}
              basemapId={basemapId}
              onBasemapChange={setBasemapId}
              onSelect={(f) => {
                setSelectedFeatureId(f.id)
                if (f.assetId) setActiveAsset(f.assetId)
                setStatus(autoScalePlain(f.scale as ScaleClass, f.label))
              }}
              onBlockedSelect={(f, needZoom) => {
                setStatus(
                  `${autoScalePlain(f.scale as ScaleClass, f.label)} (needs about zoom ${needZoom}+).`,
                )
              }}
            />

            {showDetail3d && selectedAsset && detailParts.length > 0 && (
              <div className="min-h-0 flex flex-col rounded border border-slate-800 overflow-hidden">
                <div className="shrink-0 px-2 py-0.5 text-[9px] text-slate-500 border-b border-slate-800 bg-slate-950/80 flex justify-between">
                  <span>
                    3D detail · 1 unit = 1 m · {selectedAsset.name}
                    {selectedFeature
                      ? ` · ⌀${selectedFeature.footprintM}m`
                      : ''}
                  </span>
                  <span className="text-slate-600">no terrain diorama</span>
                </div>
                <MassingCanvas
                  parts={detailParts}
                  objects={[]}
                  className="flex-1 min-h-0 border-0 rounded-none"
                  cameraPosition={detailCam.position}
                  cameraTarget={detailCam.target}
                  sky="#070b14"
                  showGrid
                />
              </div>
            )}
          </div>

          {/* Selected identity — notes + public map links + SME (no export) */}
          {selectedFeature && (
            <div className="shrink-0 max-h-[28%] overflow-y-auto rounded border border-slate-800 bg-slate-950/50 p-2 space-y-1">
              <div className="flex items-start gap-2">
                {selectedFeature.score !== undefined && (
                  <EvidenceBadge score={selectedFeature.score} />
                )}
                <div className="min-w-0">
                  <div className="text-[12px] font-medium text-slate-100">{selectedFeature.label}</div>
                  <div className="text-[10px] text-cyan-500/90 font-mono">
                    {selectedFeature.lat.toFixed(5)}°, {selectedFeature.lng.toFixed(5)}° ·{' '}
                    {selectedFeature.scale} · ⌀{selectedFeature.footprintM} m
                  </div>
                </div>
              </div>
              <ul className="text-[10px] text-slate-400 space-y-0.5">
                {selectedFeature.notes.map((n) => (
                  <li key={n} className="border-l border-slate-700 pl-2">
                    {n}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-1">
                {selectedFeature.mapLinks.map((l) => (
                  <button
                    key={l.url}
                    type="button"
                    className="rounded border border-sky-900/50 px-1.5 py-0.5 text-[9px] text-sky-300 hover:border-sky-500"
                    onClick={() => openSafeExternal(l.url)}
                  >
                    {l.label}
                  </button>
                ))}
                {selectedFeature.meta?.smeTopics.slice(0, 4).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className="rounded border border-cyan-900/50 px-1.5 py-0.5 text-[9px] text-cyan-200 hover:border-cyan-500"
                    onClick={() => openSme(t.id)}
                  >
                    SME · {t.short}
                  </button>
                ))}
                {selectedFeature.meta?.links
                  .filter((l) => l.url)
                  .slice(0, 4)
                  .map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      className="rounded border border-slate-700 px-1.5 py-0.5 text-[9px] text-slate-300 hover:border-slate-500"
                      onClick={() => handleLink(l)}
                    >
                      {l.label}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {!assets.length && (
            <div className="shrink-0 text-center text-[10px] text-slate-500 py-1">
              Map shows public desk + scene coordinates. Seed models to add meter-scale claim
              objects at those locations.
              <Btn variant="primary" className="!text-[10px] ml-2" onClick={() => seedEvidentiaryModels()}>
                Seed models
              </Btn>
            </div>
          )}
        </div>
      </Panel>
    </div>
  )
}

export default MassingViewerModule
