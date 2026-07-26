import { useEffect, useMemo, useState } from 'react'
import { usePlatformStore } from '../../store/platformStore'
import { Panel, Btn, Field, EvidenceBadge } from '../ui/primitives'
import { inputClass } from '../ui/formClasses'
import { triggerCodeDownload } from '../../lib/export/exportKit'
import { MassingCanvas } from './MassingCanvas'
import { resolveStory } from '../../data/useCases/stories'
import {
  getDynamicStoryModels,
  meshAccentColor,
  reasonSceneObjects,
  verifiabilityLabel,
  type EvidentiaryObject,
} from '../../lib/forge/objectReasoning'
import { MESH_FAMILY_COUNT } from '../../data/forge/meshCatalog'

export function ProceduralForgeModule({ embedded }: { embedded?: boolean } = {}) {
  const assets = usePlatformStore((s) => s.assets)
  const activeId = usePlatformStore((s) => s.activeAssetId)
  const compareMode = usePlatformStore((s) => s.compareMode)
  const conditions = usePlatformStore((s) => s.conditions)
  const activeUseCaseId = usePlatformStore((s) => s.activeUseCaseId)
  const evidence = usePlatformStore((s) => s.evidence)
  const generateProceduralAsset = usePlatformStore((s) => s.generateProceduralAsset)
  const optimizeActiveAsset = usePlatformStore((s) => s.optimizeActiveAsset)
  const setAssetDeploy = usePlatformStore((s) => s.setAssetDeploy)
  const setActiveAsset = usePlatformStore((s) => s.setActiveAsset)
  const setCompareMode = usePlatformStore((s) => s.setCompareMode)
  const rewriteActiveAsset = usePlatformStore((s) => s.rewriteActiveAsset)
  const requestAction = usePlatformStore((s) => s.requestAction)
  const acknowledgeLayer0 = usePlatformStore((s) => s.acknowledgeLayer0)
  const setModule = usePlatformStore((s) => s.setModule)
  const seedEvidentiaryModels = usePlatformStore((s) => s.seedEvidentiaryModels)

  const story = resolveStory(activeUseCaseId)

  const report = useMemo(
    () =>
      reasonSceneObjects({
        deskId: activeUseCaseId,
        claims: story?.claims,
        evidence,
      }),
    [activeUseCaseId, story?.claims, evidence],
  )

  const modelPack = useMemo(
    () => getDynamicStoryModels(activeUseCaseId, story?.claims, evidence),
    [activeUseCaseId, story?.claims, evidence],
  )

  const active = assets.find((a) => a.id === activeId) ?? null
  const [selectedId, setSelectedId] = useState(report.selectedIds[0] ?? report.objects[0]?.id ?? '')
  const selectedObj: EvidentiaryObject | undefined =
    report.objects.find((o) => o.id === selectedId) ?? report.objects[0]

  const [name, setName] = useState(selectedObj?.name ?? 'Story object')
  const [description, setDescription] = useState(selectedObj?.description ?? '')
  const [rewrite, setRewrite] = useState('')

  useEffect(() => {
    const first = report.objects[0]
    if (!first) return
    setSelectedId(first.id)
    setName(first.name)
    setDescription(first.description)
  }, [activeUseCaseId, report.objects])

  const applyObject = (obj: EvidentiaryObject) => {
    setSelectedId(obj.id)
    setName(obj.name)
    setDescription(
      [
        obj.description,
        `Verifiability: ${verifiabilityLabel(obj.verifiability)}`,
        obj.relatedClaimHint ? `Claim: ${obj.relatedClaimHint}` : '',
        `Flags: ${obj.flags.join(', ')}`,
      ]
        .filter(Boolean)
        .join('\n'),
    )
  }

  const buildSelected = () => {
    if (!selectedObj) {
      generateProceduralAsset({
        name,
        assetType: 'mf-civic-path-strip',
        description,
      })
      return
    }
    generateProceduralAsset({
      name,
      assetType: selectedObj.assetType,
      description,
      score: selectedObj.score,
      verifiability: selectedObj.verifiability,
      reasoning: selectedObj.reasoning,
      flags: selectedObj.flags,
      relatedClaimHint: selectedObj.relatedClaimHint,
      sourceIds: selectedObj.sourceIds,
      importance: selectedObj.importance,
      accentColor: meshAccentColor(selectedObj.verifiability),
    })
  }

  const condSummary = useMemo(() => {
    if (!conditions) return 'No story rules applied'
    return Object.entries(conditions.selections)
      .map(([k, v]) => `${k}=${v}`)
      .join(', ')
  }, [conditions])

  const flagTone = (v: EvidentiaryObject['verifiability']) => {
    if (v === 'verified_supported') return 'border-emerald-800/60 text-emerald-300'
    if (v === 'disputed_unverifiable' || v === 'method_gate') return 'border-rose-800/60 text-rose-300'
    if (v === 'narrative_only') return 'border-violet-800/50 text-violet-300'
    return 'border-amber-800/50 text-amber-300'
  }

  return (
    <div
      className={`h-full min-h-0 gap-1.5 ${
        embedded ? 'flex flex-col' : 'grid grid-cols-1 xl:grid-cols-5 gap-2'
      }`}
    >
      <Panel
        title={modelPack.headline}
        className={embedded ? 'shrink-0 max-h-[55%]' : 'xl:col-span-2'}
      >
        <div className="space-y-2">
          <p className="text-[11px] text-slate-400 leading-snug">{modelPack.intro}</p>
          <div className="text-[10px] font-mono text-cyan-600/90">{report.summary}</div>
          <div className="text-[9px] text-slate-500 space-y-0.5">
            <div>
              Mesh catalog: <span className="text-slate-300">{MESH_FAMILY_COUNT}</span> families ·
              tags↔SMEs are many-to-many (operational overlap)
            </div>
            {report.overlapNotes?.slice(0, 2).map((n) => (
              <div key={n} className="text-[9px] text-cyan-800/80 leading-snug">
                {n}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1">
            <Btn
              variant="primary"
              className="!text-[10px] !py-0.5"
              onClick={() => seedEvidentiaryModels()}
              title="Build critical objects from claims/evidence into the scene"
            >
              Seed critical models
            </Btn>
            <Btn className="!text-[10px] !py-0.5" onClick={() => setModule('massing-viewer')}>
              Open Massing
            </Btn>
            <Btn className="!text-[10px] !py-0.5" onClick={() => setModule('research-hub')}>
              Claims
            </Btn>
          </div>

          <div>
            <div className="text-[9px] uppercase tracking-wide text-slate-500 mb-1">
              Evidentiary objects (ranked)
            </div>
            <div className="flex flex-col gap-1 max-h-[min(240px,36vh)] overflow-auto">
              {report.objects.map((obj) => (
                <button
                  key={obj.id}
                  type="button"
                  onClick={() => applyObject(obj)}
                  className={`text-left rounded border px-2 py-1.5 text-[11px] transition ${
                    selectedId === obj.id
                      ? 'border-cyan-700 bg-cyan-950/40 text-cyan-50'
                      : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-1.5">
                    <EvidenceBadge score={obj.score} />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-slate-100 flex flex-wrap items-center gap-1">
                        {obj.name}
                        <span className="text-[9px] text-slate-600 uppercase">{obj.importance}</span>
                        {obj.curated && (
                          <span className="text-[8px] text-cyan-700 uppercase">curated</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 leading-snug">{obj.role}</div>
                      <div
                        className={`mt-0.5 inline-block rounded border px-1 text-[9px] ${flagTone(obj.verifiability)}`}
                      >
                        {verifiabilityLabel(obj.verifiability)}
                      </div>
                      {obj.relatedClaimHint && (
                        <div className="text-[9px] text-slate-600 mt-0.5 line-clamp-2">
                          ← {obj.relatedClaimHint}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
              {!report.objects.length && (
                <p className="text-[10px] text-slate-600">
                  No objects extracted — open a desk with claims, or Seed after loading evidence.
                </p>
              )}
            </div>
          </div>

          {selectedObj && (
            <div className="rounded border border-slate-800 bg-black/30 p-2 space-y-1">
              <div className="text-[9px] uppercase text-slate-500">Reasoning</div>
              <ul className="text-[10px] text-slate-400 space-y-0.5">
                {selectedObj.reasoning.map((r) => (
                  <li key={r} className="leading-snug">
                    · {r}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-1 pt-1">
                {selectedObj.flags.map((f) => (
                  <span
                    key={f}
                    className="text-[8px] uppercase tracking-wide rounded border border-slate-700 px-1 text-slate-500"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Field label="Name">
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Description + flags">
            <textarea
              className={`${inputClass} min-h-[64px]`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
          <p className="text-[9px] text-slate-600">
            Story rules: <span className="text-slate-500">{condSummary}</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            <Btn variant="primary" onClick={buildSelected}>
              Build into scene
            </Btn>
            <Btn disabled={!active} onClick={() => optimizeActiveAsset()}>
              Refine
            </Btn>
            <Btn disabled={!active} onClick={() => setModule('massing-viewer')}>
              3D view
            </Btn>
          </div>

          {active && (
            <>
              <Field label={`Deploy (${Math.round(active.animation.deployProgress * 100)}%)`}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  aria-label="Deploy"
                  value={Math.round(active.animation.deployProgress * 100)}
                  onChange={(e) => setAssetDeploy(Number(e.target.value) / 100)}
                  className="w-full"
                />
              </Field>
              <Field label="Rewrite intent">
                <textarea
                  className={`${inputClass} min-h-[48px]`}
                  value={rewrite}
                  onChange={(e) => setRewrite(e.target.value)}
                  placeholder="New role for this object…"
                />
              </Field>
              <div className="flex flex-wrap gap-1.5">
                <Btn
                  disabled={!rewrite.trim()}
                  onClick={() => {
                    rewriteActiveAsset(rewrite.trim())
                    setRewrite('')
                  }}
                >
                  Rewrite
                </Btn>
                <Btn
                  variant={compareMode ? 'primary' : 'default'}
                  disabled={!active.beforeParts?.length}
                  onClick={() => setCompareMode(!compareMode)}
                >
                  Before/After
                </Btn>
                <Btn variant="ghost" onClick={() => acknowledgeLayer0('Model export ACK')}>
                  ACK
                </Btn>
                <Btn
                  onClick={() => {
                    const g = requestAction('export.unity')
                    if (g.allowed && active) {
                      triggerCodeDownload(
                        `${active.name.replace(/\s+/g, '_')}_v${active.version}.cs`,
                        active.unityCSharp,
                      )
                    }
                  }}
                >
                  Unity
                </Btn>
                <Btn
                  onClick={() => {
                    const g = requestAction('export.three')
                    if (g.allowed && active) {
                      triggerCodeDownload(
                        `${active.name.replace(/\s+/g, '_')}_v${active.version}.tsx`,
                        active.threeTsx,
                      )
                    }
                  }}
                >
                  Three
                </Btn>
              </div>
            </>
          )}

          <div>
            <h3 className="text-[9px] font-semibold text-slate-500 uppercase mb-1">Built objects</h3>
            <ul className="space-y-0.5 max-h-28 overflow-auto">
              {assets.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => setActiveAsset(a.id)}
                    className={`w-full text-left rounded px-1.5 py-1 text-[11px] border ${
                      a.id === activeId
                        ? 'border-cyan-700 bg-cyan-950/40 text-cyan-50'
                        : 'border-transparent hover:bg-slate-900 text-slate-400'
                    }`}
                  >
                    <EvidenceBadge score={a.score} /> {a.name}{' '}
                    <span className="text-slate-600">v{a.version}</span>
                    {a.verifiability && (
                      <span className="block text-[9px] text-amber-600/90 truncate">
                        {verifiabilityLabel(a.verifiability)}
                      </span>
                    )}
                  </button>
                </li>
              ))}
              {!assets.length && (
                <li className="text-[10px] text-slate-600">
                  Select an evidentiary object and Build, or Seed critical models.
                </li>
              )}
            </ul>
          </div>
        </div>
      </Panel>

      <Panel
        title={active ? `${active.name} · v${active.version}` : 'Scene preview'}
        className={embedded ? 'flex-1 min-h-0' : 'xl:col-span-3'}
      >
        {!active ? (
          <div className="h-[min(240px,40vh)] flex flex-col items-center justify-center gap-2 text-[11px] text-slate-600 border border-slate-800 rounded-md bg-black/40 px-4 text-center">
            <p>Pick a ranked object from claims/evidence, then Build into scene.</p>
            <p className="text-amber-600/80 text-[10px]">
              Amber = plausible unverified · Rose = disputed · Green = supported
            </p>
          </div>
        ) : compareMode && active.beforeParts?.length ? (
          <div className="grid grid-cols-2 gap-1 h-[min(280px,45vh)]">
            <div className="min-h-0 flex flex-col">
              <div className="text-[9px] text-slate-500 mb-0.5">Before</div>
              <MassingCanvas parts={active.beforeParts} className="flex-1" />
            </div>
            <div className="min-h-0 flex flex-col">
              <div className="text-[9px] text-slate-500 mb-0.5">After</div>
              <MassingCanvas parts={active.parts} className="flex-1" />
            </div>
          </div>
        ) : (
          <MassingCanvas parts={active.parts} className="h-[min(280px,45vh)]" />
        )}
        {active && (
          <div className="mt-1.5 text-[10px] text-slate-500 space-y-1">
            <p className="text-slate-300">{active.description}</p>
            {active.verifiability && (
              <p className="text-amber-400/90">
                {verifiabilityLabel(active.verifiability)}
                {active.flags?.length ? ` · ${active.flags.slice(0, 4).join(', ')}` : ''}
              </p>
            )}
            {active.reasoning?.slice(0, 3).map((r) => (
              <p key={r} className="text-slate-600 leading-snug">
                · {r}
              </p>
            ))}
            <p className="text-amber-500/80">
              Story sketch only — not a certified survey or forensic reconstruction.
            </p>
          </div>
        )}
      </Panel>
    </div>
  )
}

export default ProceduralForgeModule
