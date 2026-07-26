/**
 * Massing — Mapping Layer (public place) + Rendering Layer (claim potentials).
 * 3D remains illustrative only — not forensic.
 */

import { useEffect, useMemo, useState } from 'react'
import { usePlatformStore } from '../../store/platformStore'
import { Panel, Btn, EvidenceBadge } from '../ui/primitives'
import { MassingCanvas } from './MassingCanvas'
import { ScaleAccurateMapStage } from './ScaleAccurateMapStage'
import { MODEL_DISCLAIMER } from '../../types/core'
import { resolveStory } from '../../data/useCases/stories'
import { getSimulation } from '../../data/useCases/simulations'
import { reasonSceneObjects, reasonScenePotentials } from '../../lib/forge/objectReasoning'
import {
  isGhostPotential,
  potentialStatusLabel,
  type LayerVisibilityMode,
  type PotentialObject,
} from '../../lib/forge/potentials'
import { buildMappingLayerState } from '../../lib/map/mappingLayer'
import { buildScaleAccurateFeatures } from '../../lib/map/scaleAccurateFeatures'
import { autoScalePlain, type ScaleClass, footprintMetersForLayout } from '../../lib/map/geoScale'
import type { BasemapId } from '../../lib/map/mapFilters'
import { openSafeExternal } from '../../lib/security/urlSafety'
import { getMeshFamily, resolveMeshFamilyId } from '../../data/forge/meshCatalog'

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
  const seedEvidentiaryModels = usePlatformStore((s) => s.seedEvidentiaryModels)
  const activeUseCaseId = usePlatformStore((s) => s.activeUseCaseId)
  const evidence = usePlatformStore((s) => s.evidence)
  const activeSources = usePlatformStore((s) => s.activeSources)
  const pack = usePlatformStore((s) => s.dataPack)

  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null)
  const [basemapId, setBasemapId] = useState<BasemapId>('satellite')
  const [status, setStatus] = useState<string | null>(null)
  const [showDetail3d, setShowDetail3d] = useState(true)
  const [layerMode, setLayerMode] = useState<LayerVisibilityMode>('both')
  const [soloPotentialId, setSoloPotentialId] = useState<string | null>(null)
  const [resolvedIds, setResolvedIds] = useState<string[]>([])

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

  const potentials = useMemo(
    () =>
      reasonScenePotentials({
        deskId: activeUseCaseId,
        claims: story?.claims,
        evidence,
        resolvedIds,
      }),
    [activeUseCaseId, story?.claims, evidence, resolvedIds],
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
    return fromSim.length ? fromSim : fromPack
  }, [sim, pack])

  /** Mapping Layer state — location only; stable if claims flip. */
  const mappingState = useMemo(
    () =>
      buildMappingLayerState(
        {
          useCaseId: origin.useCaseId,
          lat: origin.lat,
          lng: origin.lng,
          label: origin.label,
          shortLabel: origin.shortLabel,
          cityHint: origin.cityHint,
          kind: origin.kind,
        },
        scenePoints.map((p) => ({
          id: p.id,
          lat: p.lat,
          lng: p.lng,
          label: p.label,
        })),
      ),
    [origin, scenePoints],
  )

  const features = useMemo(() => {
    if (layerMode === 'mapping') {
      // Origin + scene points only — no claim-driven assets
      return buildScaleAccurateFeatures({
        origin,
        scenePoints,
        assets: [],
        evidentiary: [],
        activeSources: [],
      })
    }
    const evObjs =
      layerMode === 'rendering' || layerMode === 'both' ? report.objects : []
    return buildScaleAccurateFeatures({
      origin,
      scenePoints: layerMode === 'rendering' ? [] : scenePoints,
      assets: layerMode === 'mapping' ? [] : assets,
      evidentiary: evObjs,
      activeSources,
    })
  }, [layerMode, origin, scenePoints, assets, report.objects, activeSources])

  useEffect(() => {
    setBasemapId('satellite')
    setSelectedFeatureId(`pin:${origin.useCaseId}`)
    setStatus(null)
    setSoloPotentialId(null)
  }, [activeUseCaseId, origin.useCaseId])

  const selectedFeature = features.find((f) => f.id === selectedFeatureId) ?? null
  const selectedAsset =
    selectedFeature?.assetId != null
      ? assets.find((a) => a.id === selectedFeature.assetId)
      : assets.find((a) => a.id === activeId) ?? null

  const soloPotential: PotentialObject | null =
    potentials.find((p) => p.id === soloPotentialId) ??
    potentials.find((p) => p.assetType === selectedAsset?.assetType) ??
    null

  const detailParts = useMemo(() => {
    if (!selectedAsset || !showDetail3d || layerMode === 'mapping') return []
    const fam = getMeshFamily(resolveMeshFamilyId(selectedAsset.assetType))
    const fp =
      selectedFeature?.footprintM ?? footprintMetersForLayout(fam?.layout ?? 'module')
    return scalePartsToMeters(selectedAsset.parts, fp)
  }, [selectedAsset, selectedFeature, showDetail3d, layerMode])

  const detailGhost = soloPotential ? isGhostPotential(soloPotential.status) : false

  const detailCam = useMemo(() => {
    const r = (selectedFeature?.footprintM ?? 10) * 0.9
    return {
      position: [r * 1.4, r * 0.9, r * 1.5] as [number, number, number],
      target: [0, r * 0.15, 0] as [number, number, number],
    }
  }, [selectedFeature])

  const markResolved = (id: string) => {
    setResolvedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  return (
    <div className={`h-full flex flex-col min-h-0 ${embedded ? 'gap-1' : 'gap-2'}`}>
      <Panel
        title="Massing · map foundation + claim potentials"
        className="flex-1 min-h-0"
        actions={
          <div className="flex gap-1 flex-wrap">
            <Btn
              variant="ghost"
              className="!text-[10px]"
              onClick={() => {
                const n = seedEvidentiaryModels()
                setStatus(
                  n > 0
                    ? `Seeded ${n} per-item models. Click a circle to identify + frame at the right scale.`
                    : 'No potentials to seed — score claims first or open a story with place.',
                )
              }}
              title="Dan pipeline: each Potential as coarse item → optimize → assemble"
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
          </div>
        }
      >
        <div className="flex flex-col h-full min-h-0 gap-1.5">
          <div className="shrink-0 text-[10px] text-slate-400 leading-snug space-y-0.5">
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[9px] uppercase tracking-wide text-slate-600 mr-1">Layers</span>
              {(
                [
                  ['both', 'Both'],
                  ['mapping', 'Mapping'],
                  ['rendering', 'Rendering'],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setLayerMode(id)}
                  className={`rounded px-1.5 py-0.5 text-[9px] border ${
                    layerMode === id
                      ? 'border-cyan-500 bg-cyan-950/40 text-cyan-100'
                      : 'border-slate-800 text-slate-500 hover:text-slate-300'
                  }`}
                  title={
                    id === 'mapping'
                      ? 'Location foundation only — ignores claim scores'
                      : id === 'rendering'
                        ? 'Claim potentials only'
                        : 'Mapping + Rendering'
                  }
                >
                  {label}
                </button>
              ))}
              <span className="text-[9px] text-slate-600 ml-1 font-mono">
                map·{mappingState.fingerprint.slice(0, 18)}…
              </span>
            </div>
            <div>
              <span className="text-cyan-400 font-mono">
                {origin.lat.toFixed(5)}°, {origin.lng.toFixed(5)}°
              </span>
              <span className="text-slate-600"> · </span>
              {origin.cityHint ?? story?.where ?? 'desk origin'} · {features.length} geo features ·{' '}
              {potentials.length} potentials
            </div>
            <div className="text-[9px] text-amber-200/80 border border-amber-900/40 rounded px-1.5 py-0.5 bg-amber-950/20">
              {MODEL_DISCLAIMER} Mapping = place; Rendering = open potentials until refined.
            </div>
            {status && (
              <div className="text-[10px] text-amber-400/90 border border-amber-900/40 rounded px-1.5 py-0.5">
                {status}
              </div>
            )}
          </div>

          <div
            className={`flex-1 min-h-0 grid gap-1.5 ${
              showDetail3d && selectedAsset && layerMode !== 'mapping'
                ? embedded
                  ? 'grid-rows-[1fr_120px]'
                  : 'grid-rows-[1fr_160px]'
                : 'grid-rows-1'
            }`}
          >
            {(layerMode === 'mapping' || layerMode === 'both') && (
              <ScaleAccurateMapStage
                key={`${activeUseCaseId}-${layerMode}`}
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
                  const match = potentials.find(
                    (p) =>
                      p.assetType === f.kind ||
                      p.name === f.label ||
                      f.label.toLowerCase().includes(p.name.toLowerCase().slice(0, 12)),
                  )
                  if (match) setSoloPotentialId(match.id)
                  setStatus(
                    `${autoScalePlain(f.scale as ScaleClass, f.label)} · identified as ${f.scale}${
                      match ? ` · potential “${match.name}” (${match.status})` : ''
                    }`,
                  )
                }}
                onBlockedSelect={(f, needZoom) => {
                  setSelectedFeatureId(f.id)
                  setStatus(
                    `Framing “${f.label}” — needs ~zoom ${needZoom}+ for pick precision. Auto-scale engaged.`,
                  )
                }}
              />
            )}

            {layerMode === 'rendering' && (
              <div className="min-h-[200px] rounded border border-slate-800 bg-slate-950/40 p-2 overflow-auto">
                <p className="text-[10px] text-slate-500 mb-1">
                  Rendering layer only — claim potentials (ghost = open).
                </p>
                <ul className="space-y-1">
                  {potentials.map((p) => (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => setSoloPotentialId(p.id)}
                        className={`w-full text-left rounded border px-2 py-1 text-[10px] ${
                          soloPotentialId === p.id
                            ? 'border-cyan-600 bg-cyan-950/30'
                            : 'border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <span className="text-slate-200">{p.name}</span>
                        <span className="text-slate-500"> · {potentialStatusLabel(p.status)}</span>
                        {isGhostPotential(p.status) && (
                          <span className="text-slate-600"> · ghost</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {showDetail3d && selectedAsset && detailParts.length > 0 && layerMode !== 'mapping' && (
              <div className="min-h-0 flex flex-col rounded border border-slate-800 overflow-hidden">
                <div className="shrink-0 px-2 py-0.5 text-[9px] text-slate-500 border-b border-slate-800 bg-slate-950/80 flex justify-between">
                  <span>
                    3D detail · 1 unit = 1 m · {selectedAsset.name}
                    {soloPotential ? ` · ${potentialStatusLabel(soloPotential.status)}` : ''}
                    {detailGhost ? ' · ghost' : ''}
                  </span>
                  <span className="text-slate-600">illustrative only</span>
                </div>
                <MassingCanvas
                  parts={detailParts}
                  objects={[
                    {
                      id: selectedAsset.id,
                      parts: detailParts,
                      meta: {
                        objectId: selectedAsset.id,
                        name: selectedAsset.name,
                        what: selectedAsset.assetType,
                        score: (soloPotential?.score ?? 0) as 1 | 0 | -1,
                        notes: soloPotential?.reasoningBullets ?? [MODEL_DISCLAIMER],
                        flags: soloPotential?.flags ?? [],
                        smeDomains: [],
                        smeTopics: [],
                        links: [],
                        industries: [],
                        familyId: selectedAsset.assetType,
                        familyName: selectedAsset.name,
                        ghost: detailGhost,
                        potentialStatus: soloPotential?.status,
                        layer: 'rendering',
                      },
                    },
                  ]}
                  className="flex-1 min-h-0 border-0 rounded-none"
                  cameraPosition={detailCam.position}
                  cameraTarget={detailCam.target}
                  sky="#070b14"
                  showGrid
                />
              </div>
            )}
          </div>

          {(layerMode === 'rendering' || layerMode === 'both') && (
            <div className="shrink-0 max-h-[32%] overflow-y-auto rounded border border-slate-800 bg-slate-950/60 p-2 space-y-1.5">
              <div className="text-[9px] uppercase tracking-wide text-cyan-600/90">
                Solo · Potentials (Rendering)
              </div>
              <p className="text-[9px] text-slate-600">
                Speculative stays labeled until resolved. Seed runs Dan per-item optimize.
              </p>
              <ul className="space-y-1">
                {potentials.slice(0, 12).map((p) => (
                  <li
                    key={p.id}
                    className={`rounded border px-2 py-1 ${
                      soloPotentialId === p.id ? 'border-cyan-700 bg-cyan-950/20' : 'border-slate-800'
                    }`}
                  >
                    <button
                      type="button"
                      className="w-full text-left"
                      onClick={() => setSoloPotentialId(p.id)}
                    >
                      <div className="flex items-center gap-1.5">
                        <EvidenceBadge score={p.score} />
                        <span className="text-[11px] text-slate-100 font-medium truncate">{p.name}</span>
                        <span className="text-[9px] text-slate-500 ml-auto shrink-0">
                          {potentialStatusLabel(p.status)}
                        </span>
                      </div>
                      <div className="text-[9px] text-slate-500 mt-0.5">
                        {p.spatialRole} · {p.importanceBand}
                        {isGhostPotential(p.status) ? ' · ghost material' : ''}
                      </div>
                    </button>
                    {soloPotentialId === p.id && (
                      <div className="mt-1 space-y-0.5">
                        {p.reasoningBullets.slice(0, 5).map((b) => (
                          <p key={b} className="text-[9px] text-slate-400 border-l border-slate-700 pl-1.5">
                            {b}
                          </p>
                        ))}
                        {p.status !== 'resolved' && (
                          <Btn
                            variant="ghost"
                            className="!text-[9px] mt-1"
                            onClick={() => markResolved(p.id)}
                          >
                            Mark resolved (operator)
                          </Btn>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedFeature && layerMode !== 'rendering' && (
            <div className="shrink-0 max-h-[22%] overflow-y-auto rounded border border-slate-800 bg-slate-950/50 p-2 space-y-1">
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
              </div>
            </div>
          )}

          {!assets.length && layerMode !== 'mapping' && (
            <div className="shrink-0 text-center text-[10px] text-slate-500 py-1">
              Seed models to place meter-scale claim objects on the map foundation.
              <Btn
                variant="primary"
                className="!text-[10px] ml-2"
                onClick={() => seedEvidentiaryModels()}
              >
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
