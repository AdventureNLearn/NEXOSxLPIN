import { useMemo } from 'react'
import { usePlatformStore } from '../../store/platformStore'
import { Panel, Btn, Field } from '../ui/primitives'
import { inputClass, selectClass } from '../ui/formClasses'
import { getDesignStory } from '../../data/useCases/designMatrices'
import { getUseCase } from '../../data/useCases/catalog'

export function DesignLabModule({ embedded }: { embedded?: boolean } = {}) {
  const pack = usePlatformStore((s) => s.dataPack)
  const conditions = usePlatformStore((s) => s.conditions)
  const activeUseCaseId = usePlatformStore((s) => s.activeUseCaseId)
  const setConditionSelection = usePlatformStore((s) => s.setConditionSelection)
  const setConditionNotes = usePlatformStore((s) => s.setConditionNotes)
  const applyConditions = usePlatformStore((s) => s.applyConditions)
  const setModule = usePlatformStore((s) => s.setModule)

  const profile = getUseCase(activeUseCaseId)
  const story = getDesignStory(activeUseCaseId)

  const matrix =
    pack.conditionMatrices.find((m) => m.id === conditions?.matrixId) ??
    pack.conditionMatrices[0]

  const snapshotLines = useMemo(() => {
    if (!matrix || !conditions) return []
    return matrix.axes.map((axis) => {
      const opt = axis.options.find((o) => o.id === conditions.selections[axis.id])
      return { label: axis.label, value: opt?.label ?? '—', desc: opt?.description }
    })
  }, [matrix, conditions])

  if (!matrix || !conditions) {
    return (
      <Panel title="Design Lab">
        <p className="text-sm text-slate-500">
          No condition matrix for this investigation. Open a trend desk to load jurisdictional
          intelligence.
        </p>
      </Panel>
    )
  }

  const isCjMatrix = matrix.id.startsWith('matrix-cj-')

  return (
    <div
      className={`h-full min-h-0 gap-2 ${
        embedded ? 'flex flex-col' : 'grid grid-cols-1 lg:grid-cols-3 gap-3'
      }`}
    >
      <Panel
        title={matrix.name}
        className={embedded ? 'flex-1 min-h-0' : 'lg:col-span-2'}
      >
        <div className="mb-2 flex flex-wrap items-center gap-2 text-[10px]">
          <span className="rounded border border-cyan-800/50 bg-cyan-950/30 px-1.5 py-0.5 text-cyan-300/90 uppercase tracking-wide">
            {isCjMatrix ? 'Citizen journalism · jurisdictional' : 'Generic pack matrix'}
          </span>
          <span className="text-slate-500 truncate">{profile.label}</span>
        </div>

        {!embedded && (
          <p className="text-xs text-slate-400 mb-3 leading-relaxed">
            {matrix.description}
          </p>
        )}

        {story && !embedded && (
          <div className="mb-3 rounded-md border border-slate-800 bg-slate-950/50 p-2.5 text-[11px] text-slate-400 leading-relaxed">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
              Intelligence brief
            </div>
            {story.intelligenceBrief}
          </div>
        )}

        <div className={`grid grid-cols-1 ${embedded ? 'gap-2' : 'sm:grid-cols-2 gap-3'}`}>
          {matrix.axes.map((axis) => (
            <Field key={axis.id} label={axis.label}>
              <select
                className={selectClass}
                value={conditions.selections[axis.id] ?? ''}
                onChange={(e) => setConditionSelection(axis.id, e.target.value)}
              >
                {axis.options.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-600">
                {axis.options.find((o) => o.id === conditions.selections[axis.id])?.description}
              </span>
            </Field>
          ))}
        </div>

        {!embedded && (
          <div className="mt-4">
            <Field label="Operator notes (jurisdictional / story)">
              <textarea
                className={`${inputClass} min-h-[72px]`}
                value={conditions.notes}
                onChange={(e) => setConditionNotes(e.target.value)}
                placeholder="Forum choice, FOIA path, harm constraints, export language…"
              />
            </Field>
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          <Btn variant="primary" onClick={() => applyConditions()}>
            Apply to investigation
          </Btn>
          {!embedded && (
            <>
              <Btn
                onClick={() => {
                  applyConditions()
                  setModule('research-hub')
                }}
              >
                Apply & Research
              </Btn>
              <Btn
                variant="ghost"
                onClick={() => {
                  applyConditions()
                  setModule('export-kit')
                }}
              >
                Apply & Export posture
              </Btn>
            </>
          )}
        </div>
      </Panel>

      <div className={`flex flex-col gap-2 min-h-0 ${embedded ? 'shrink-0' : ''}`}>
        <Panel title="Active snapshot" className="flex-1 min-h-0">
          <dl className="space-y-2 text-xs">
            {snapshotLines.map((row) => (
              <div
                key={row.label}
                className="flex justify-between gap-2 border-b border-slate-800/80 pb-1"
              >
                <dt className="text-slate-500">{row.label}</dt>
                <dd className="text-slate-200 text-right">{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-[11px] text-slate-500">
            {isCjMatrix
              ? 'These axes frame legal forum, claim class, access, platform risk, verification depth, and harm — not roads or device siting. Apply logs to the working document and steers export language.'
              : 'Applied snapshots inject into Procedural Forge when geometry desks are active.'}
          </p>
        </Panel>

        {story && !embedded && (
          <Panel title="Apply effects">
            <ul className="list-disc pl-4 text-[11px] text-slate-400 space-y-1">
              {story.applyEffects.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </Panel>
        )}
      </div>
    </div>
  )
}

export default DesignLabModule
