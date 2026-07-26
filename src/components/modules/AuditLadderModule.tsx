import { useState } from 'react'
import { usePlatformStore } from '../../store/platformStore'
import type { DetailLevel, EvidenceScore } from '../../types/core'
import { DETAIL_LADDER_LABELS } from '../../types/core'
import { Panel, Btn, Field, EvidenceBadge } from '../ui/primitives'
import { inputClass } from '../ui/formClasses'
import { describeScore } from '../../core/evidence'

const LEVELS: DetailLevel[] = [0, 1, 2, 3, 4]

export function AuditLadderModule({ embedded }: { embedded?: boolean } = {}) {
  const ladder = usePlatformStore((s) => s.ladder)
  const setLadderLevel = usePlatformStore((s) => s.setLadderLevel)
  const markLadderPopulated = usePlatformStore((s) => s.markLadderPopulated)
  const acknowledgeLayer0 = usePlatformStore((s) => s.acknowledgeLayer0)

  const [note, setNote] = useState('')
  const [score, setScore] = useState<EvidenceScore>(0)

  return (
    <div className={`h-full flex flex-col min-h-0 ${embedded ? 'gap-1.5' : 'gap-3'}`}>
      <Panel title="Evidence progression L0 → L4">
        <div className={`flex flex-wrap gap-1.5 ${embedded ? 'mb-2' : 'mb-4'}`}>
          {LEVELS.map((lvl) => {
            const active = ladder.current === lvl
            const unlocked = ladder.unlocked >= lvl
            const pop = ladder.populated[lvl]
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => setLadderLevel(lvl)}
                aria-current={active ? 'step' : undefined}
                aria-label={`Audit level L${lvl} ${DETAIL_LADDER_LABELS[lvl]}`}
                className={`rounded-lg border text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 ${
                  embedded ? 'min-w-[4.5rem] px-2 py-1' : 'min-w-[7.5rem] px-3 py-2'
                } ${
                  active
                    ? 'border-cyan-600 bg-cyan-950/50'
                    : unlocked
                      ? 'border-slate-700 bg-slate-900/60 hover:border-slate-500'
                      : 'border-slate-800 bg-slate-950/40 opacity-60'
                }`}
              >
                <div className="text-[10px] text-slate-500">L{lvl}</div>
                <div className={`font-medium text-slate-100 ${embedded ? 'text-[10px]' : 'text-xs'}`}>
                  {embedded ? `L${lvl}` : DETAIL_LADDER_LABELS[lvl]}
                </div>
                {!embedded && (
                  <div className="mt-1 flex items-center gap-1.5">
                    {ladder.scores[lvl] !== null && ladder.scores[lvl] !== undefined ? (
                      <EvidenceBadge score={ladder.scores[lvl] as EvidenceScore} />
                    ) : (
                      <span className="text-[10px] text-slate-600">unscored</span>
                    )}
                    <span className="text-[10px] text-slate-600">{pop ? 'populated' : 'empty'}</span>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {!embedded && (
          <p className="text-[11px] text-slate-500 mb-3">
            L3 and L4 require Layer-0 acknowledgment. Use ACK on the status bar or below before
            promoting.
          </p>
        )}
        <Btn variant="ghost" onClick={() => acknowledgeLayer0('Ladder promotion ACK')}>
          ACK Layer-0 for promotion
        </Btn>
      </Panel>

      <div
        className={`min-h-0 flex-1 ${
          embedded ? 'flex flex-col' : 'grid grid-cols-1 lg:grid-cols-2 gap-3'
        }`}
      >
        <Panel title={`Populate L${ladder.current} — ${DETAIL_LADDER_LABELS[ladder.current]}`}>
          <Field label="Population note">
            <textarea
              className={`${inputClass} ${embedded ? 'min-h-[48px]' : 'min-h-[100px]'}`}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What material supports this level?"
            />
          </Field>
          <div className="mt-2 flex gap-2 items-center">
            <span className="text-xs text-slate-500">Score</span>
            {([1, 0, -1] as EvidenceScore[]).map((s) => (
              <Btn key={s} variant={score === s ? 'primary' : 'default'} onClick={() => setScore(s)}>
                <EvidenceBadge score={s} />
              </Btn>
            ))}
          </div>
          <p className="text-[10px] text-slate-600 mt-1">{describeScore(score)}</p>
          <Btn
            className="mt-3"
            variant="primary"
            disabled={!note.trim()}
            onClick={() => {
              markLadderPopulated(ladder.current, score, note.trim())
              setNote('')
            }}
          >
            Mark L{ladder.current} populated
          </Btn>
        </Panel>

        <Panel title="Level notes">
          <ul className="space-y-2 text-xs">
            {LEVELS.map((lvl) => (
              <li key={lvl} className="border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2 text-slate-200">
                  <span className="font-mono text-slate-500">L{lvl}</span>
                  {ladder.scores[lvl] !== null && ladder.scores[lvl] !== undefined && (
                    <EvidenceBadge score={ladder.scores[lvl] as EvidenceScore} />
                  )}
                  <span>{DETAIL_LADDER_LABELS[lvl]}</span>
                </div>
                <p className="mt-1 text-slate-500">
                  {ladder.notes[lvl] || (ladder.populated[lvl] ? 'Populated (no note text).' : 'Not yet populated.')}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  )
}

export default AuditLadderModule
