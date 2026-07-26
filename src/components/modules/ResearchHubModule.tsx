import { useMemo, useState } from 'react'
import { ExternalLink, ShieldCheck, Sparkles } from 'lucide-react'
import { usePlatformStore } from '../../store/platformStore'
import type { EvidenceScore } from '../../types/core'
import { Panel, Btn, Field, EvidenceBadge } from '../ui/primitives'
import { ClaimStatusRow } from '../ui/ClaimStatus'
import { visualFromEvidence, visualFromStoryClaim } from '../../lib/ui/claimStatus'
import { inputClass } from '../ui/formClasses'
import { describeScore, unresolvedNegatives } from '../../core/evidence'
import { ActiveSourcesPanel } from '../layout/ActiveSourcesPanel'
import { resolveStory, claimStatusLabel } from '../../data/useCases/stories'
import { getCongressDeskSeedMeta } from '../../data/useCases/congressDesks'
import { buildClaimLedger } from '../../lib/verify/claimLedger'
import { runVerificationPipeline, type VerifyReport } from '../../lib/verify/pipeline'
import {
  RESEARCH_TEMPLATES,
  runGrokResearchAgent,
  type ResearchTemplateId,
} from '../../lib/grok/researchAgent'
import { openSafeExternal } from '../../lib/security/urlSafety'

export function ResearchHubModule({ embedded }: { embedded?: boolean } = {}) {
  const evidence = usePlatformStore((s) => s.evidence)
  const notes = usePlatformStore((s) => s.researchNotes)
  const activeSources = usePlatformStore((s) => s.activeSources)
  const activeUseCaseId = usePlatformStore((s) => s.activeUseCaseId)
  const addResearchNote = usePlatformStore((s) => s.addResearchNote)
  const setEvidenceScore = usePlatformStore((s) => s.setEvidenceScore)
  const removeEvidence = usePlatformStore((s) => s.removeEvidence)
  const rebuildClaimBoard = usePlatformStore((s) => s.rebuildClaimBoard)
  const statusMessage = usePlatformStore((s) => s.statusMessage)

  const story = resolveStory(activeUseCaseId)
  const seed = getCongressDeskSeedMeta(activeUseCaseId)
  const sourceById = useMemo(() => {
    const m = new Map(activeSources.map((s) => [s.id, s]))
    return m
  }, [activeSources])

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [score, setScore] = useState<EvidenceScore>(0)
  const [filter, setFilter] = useState<'all' | EvidenceScore>('all')
  const [verifyReport, setVerifyReport] = useState<VerifyReport | null>(null)
  const [templateId, setTemplateId] = useState<ResearchTemplateId>('primary-records')
  const [operatorQ, setOperatorQ] = useState('')
  const [grokMsg, setGrokMsg] = useState<string | null>(null)
  const [grokBusy, setGrokBusy] = useState(false)

  const filteredEvidence = useMemo(() => {
    if (filter === 'all') return evidence
    return evidence.filter((e) => e.score === filter)
  }, [evidence, filter])

  const bulkSet = (s: EvidenceScore) => {
    for (const e of filteredEvidence) {
      if (e.score !== s) setEvidenceScore(e.id, s)
    }
  }

  const runVerify = () => {
    const ledger = buildClaimLedger(
      activeUseCaseId,
      (story?.claims ?? []).map((c) => ({
        plain: c.plain,
        score: c.score,
        why: c.why,
        sourceIds: c.sourceIds,
      })),
    )
    const report = runVerificationPipeline({
      deskId: activeUseCaseId,
      claims: ledger,
      sources: activeSources,
      evidence,
      openNegatives: unresolvedNegatives(evidence).length,
    })
    setVerifyReport(report)
  }

  const askGrok = async () => {
    setGrokBusy(true)
    setGrokMsg(null)
    try {
      const result = await runGrokResearchAgent(templateId, {
        deskTitle: story?.title ?? activeUseCaseId,
        deskId: activeUseCaseId,
        where: story?.where,
        lede: story?.lede,
        stakes: story?.stakes,
        claims: story?.claims.map((c) => c.plain).slice(0, 8),
        sources: activeSources.slice(0, 8).map((s) => ({
          title: s.title,
          url: s.url,
          why: s.why,
        })),
        operatorQuestion: operatorQ.trim() || undefined,
        agencyHint: seed?.agency,
        industryHint: seed?.industry,
      })
      setGrokMsg(result.message)
      if (result.prompt) {
        addResearchNote(
          `Grok template · ${templateId}`,
          result.prompt.slice(0, 4000),
          0,
        )
      }
    } finally {
      setGrokBusy(false)
    }
  }

  return (
    <div
      className={`h-full min-h-0 gap-2 ${
        embedded ? 'flex flex-col' : 'grid grid-cols-1 xl:grid-cols-2 gap-3'
      }`}
    >
      <div className={`flex flex-col gap-2 min-h-0 ${embedded ? 'min-h-0 flex-1' : ''}`}>
        {story && (
          <Panel
            title="Claims ledger — sourced & cited"
            className={embedded ? 'shrink-0 max-h-[48%]' : ''}
          >
            <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
              {story.surfaces.research} · Objective scoring (+1 / 0 / −1) · tools not media.
            </p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              <Btn
                variant="primary"
                className="!text-[10px] !py-0.5"
                onClick={() => rebuildClaimBoard()}
                title="Rebuild evidence board from desk-specific sourced claims"
              >
                Rebuild sourced claims
              </Btn>
              <Btn className="!text-[10px] !py-0.5" onClick={runVerify}>
                <ShieldCheck size={11} className="inline mr-0.5" />
                Multi-loop verify
              </Btn>
            </div>
            <ul className="space-y-2 overflow-y-auto max-h-[min(52vh,480px)]">
              {story.claims.map((c) => {
                const vs = visualFromStoryClaim({ score: c.score, status: c.status })
                const hasSrc = Boolean(c.sourceIds?.length || c.citations?.length)
                return (
                  <li key={c.plain} className="space-y-1">
                    <ClaimStatusRow
                      claim={{
                        id: c.plain,
                        text: c.plain,
                        status: vs,
                        hasBoundPrimarySource: c.score !== 1 || hasSrc,
                        meta: `${claimStatusLabel(c.status)} — ${c.why}`,
                      }}
                    />
                    {(c.citations?.length || c.sourceIds?.length) ? (
                      <div className="ml-4 flex flex-wrap gap-1">
                        {(c.sourceIds ?? []).map((id) => {
                          const src = sourceById.get(id)
                          if (!src) {
                            return (
                              <span
                                key={id}
                                className="text-[9px] text-slate-600 border border-slate-800 rounded px-1"
                              >
                                {id}
                              </span>
                            )
                          }
                          return (
                            <button
                              key={id}
                              type="button"
                              className="inline-flex items-center gap-0.5 text-[9px] text-cyan-500/90 border border-cyan-900/40 rounded px-1 py-0.5 hover:bg-cyan-950/40"
                              title={src.why}
                              onClick={() => openSafeExternal(src.url)}
                            >
                              <ExternalLink size={9} />
                              {src.publisher || src.title.slice(0, 28)}
                            </button>
                          )
                        })}
                        {(c.citations ?? [])
                          .filter(() => !c.sourceIds?.length)
                          .map((lab) => (
                            <span
                              key={lab}
                              className="text-[9px] text-slate-500 border border-slate-800 rounded px-1"
                            >
                              {lab}
                            </span>
                          ))}
                      </div>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </Panel>
        )}

        {!embedded && (
          <Panel title="Grok research agent">
            <p className="text-[10px] text-slate-500 mb-2 leading-relaxed">
              Build a verification template and open public Grok (or copy the prompt). No API key
              in the browser — OPSEC by design.
            </p>
            <div className="flex flex-wrap gap-1 mb-2">
              {RESEARCH_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  title={t.description}
                  onClick={() => setTemplateId(t.id)}
                  className={`rounded border px-1.5 py-0.5 text-[10px] ${
                    templateId === t.id
                      ? 'border-cyan-700 bg-cyan-950/50 text-cyan-100'
                      : 'border-slate-700 text-slate-500 hover:text-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <Field label="Your question (optional)">
              <input
                className={inputClass}
                value={operatorQ}
                onChange={(e) => setOperatorQ(e.target.value)}
                placeholder="e.g. What primary instrument sets export license thresholds?"
              />
            </Field>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Btn variant="primary" disabled={grokBusy} onClick={() => void askGrok()}>
                <Sparkles size={12} className="inline mr-0.5" />
                {grokBusy ? 'Preparing…' : 'Ask public Grok'}
              </Btn>
            </div>
            {grokMsg && <p className="mt-1.5 text-[10px] text-cyan-600/90">{grokMsg}</p>}
          </Panel>
        )}

        <Panel title="Sources — primary pulls" className={embedded ? 'flex-1 min-h-0' : ''}>
          <ActiveSourcesPanel compact={embedded} />
        </Panel>

        {verifyReport && !embedded && (
          <Panel title={`Verify · ${verifyReport.pass ? 'PASS' : 'HOLD'}`}>
            <div className="text-[10px] font-mono text-slate-400 mb-1">
              +{verifyReport.stats.plus} · 0={verifyReport.stats.zero} · −{verifyReport.stats.neg} ·
              sourced {verifyReport.stats.withSources}/{verifyReport.stats.claims}
              {verifyReport.stats.boilerplate
                ? ` · boilerplate ${verifyReport.stats.boilerplate}`
                : ''}
            </div>
            <ul className="space-y-1 max-h-40 overflow-y-auto">
              {verifyReport.findings.map((f, i) => (
                <li
                  key={`${f.code}-${i}`}
                  className={`text-[10px] rounded border px-1.5 py-1 ${
                    f.severity === 'block'
                      ? 'border-rose-900/50 text-rose-300'
                      : f.severity === 'warn'
                        ? 'border-amber-900/40 text-amber-200/90'
                        : 'border-slate-800 text-slate-500'
                  }`}
                >
                  <span className="uppercase text-[9px] opacity-70">{f.loop}</span> · {f.message}
                </li>
              ))}
              {!verifyReport.findings.length && (
                <li className="text-[10px] text-emerald-400/90">No findings — board is clean.</li>
              )}
            </ul>
          </Panel>
        )}

        {!embedded && (
          <Panel title="Add your own note">
            <div className="space-y-2">
              <Field label="What did you learn?">
                <input
                  className={inputClass}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Short finding — objective language"
                />
              </Field>
              <Field label="Details + citation">
                <textarea
                  className={`${inputClass} min-h-[72px]`}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Separate observation from inference. Link a primary source."
                />
              </Field>
              <Field label="How solid is it?">
                <div className="flex gap-2 flex-wrap">
                  {([1, 0, -1] as EvidenceScore[]).map((s) => (
                    <Btn
                      key={s}
                      variant={score === s ? 'primary' : 'default'}
                      onClick={() => setScore(s)}
                    >
                      <EvidenceBadge score={s} />{' '}
                      {s === 1 ? 'Supported' : s === -1 ? 'Disputed' : 'Not proven'}
                    </Btn>
                  ))}
                </div>
                <p className="text-[10px] text-slate-600 mt-1">{describeScore(score)}</p>
              </Field>
              <Btn
                variant="primary"
                disabled={!title.trim() || !body.trim()}
                onClick={() => {
                  addResearchNote(title.trim(), body.trim(), score)
                  setTitle('')
                  setBody('')
                  setScore(0)
                }}
              >
                Save to this story
              </Btn>
            </div>
          </Panel>
        )}
      </div>

      <Panel title="Evidence board" className="flex-1 min-h-0">
        <p className="text-[10px] text-slate-500 mb-2">
          Technical ledger — each line should cite a desk source. Rescore or remove disputed lines
          so Publish pack can open. {statusMessage ? `· ${statusMessage}` : ''}
        </p>
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          <span className="text-[10px] text-slate-500">Filter:</span>
          {(
            [
              ['all', 'All'],
              [1, '+1'],
              [0, '0'],
              [-1, '−1'],
            ] as const
          ).map(([k, lab]) => (
            <button
              key={String(k)}
              type="button"
              onClick={() => setFilter(k === 'all' ? 'all' : (k as EvidenceScore))}
              className={`rounded border px-1.5 py-0.5 text-[10px] min-h-[28px] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 ${
                filter === k
                  ? 'border-cyan-700 bg-cyan-950/50 text-cyan-100'
                  : 'border-slate-700 text-slate-500'
              }`}
            >
              {lab}
            </button>
          ))}
          {!embedded && (
            <>
              <span className="text-slate-700 mx-1">|</span>
              <span className="text-[10px] text-slate-500">Bulk on filter:</span>
              {([1, 0, -1] as EvidenceScore[]).map((s) => (
                <Btn
                  key={s}
                  variant="ghost"
                  className="!text-[10px] !py-0.5"
                  title={`Set all filtered claims to ${s === 1 ? '+1' : s === -1 ? '−1' : '0'}`}
                  onClick={() => bulkSet(s)}
                >
                  → <EvidenceBadge score={s} />
                </Btn>
              ))}
            </>
          )}
          <span className="text-[10px] text-slate-600 ml-auto font-mono">
            {filteredEvidence.length}/{evidence.length}
          </span>
        </div>
        <ul className="space-y-1.5 overflow-y-auto">
          {filteredEvidence.map((e) => {
            const { status, hasBoundPrimarySource } = visualFromEvidence(e)
            const firstSrc = e.sourceRefs?.[0]
              ? sourceById.get(e.sourceRefs[0])
              : undefined
            return (
              <li key={e.id} className="space-y-1">
                <ClaimStatusRow
                  dense={embedded}
                  claim={{
                    id: e.id,
                    text: e.title,
                    status,
                    hasBoundPrimarySource,
                    sourceLabel: firstSrc
                      ? firstSrc.publisher || firstSrc.title.slice(0, 28)
                      : undefined,
                    meta: e.summary ? e.summary.slice(0, 120) : undefined,
                  }}
                  onScoreChange={(id, next) => {
                    if (next.kind === 'scored') setEvidenceScore(id, next.score)
                  }}
                />
                <div className="flex flex-wrap items-center gap-1.5 pl-1">
                  <Btn
                    variant="ghost"
                    className="!text-[10px] !py-0.5"
                    onClick={() => removeEvidence(e.id)}
                  >
                    Remove
                  </Btn>
                  {e.sourceRefs?.length > 0 &&
                    e.sourceRefs.map((refId) => {
                      const src = sourceById.get(refId)
                      if (!src) {
                        return (
                          <span
                            key={refId}
                            className="text-[9px] text-slate-600 border border-slate-800 rounded px-1"
                          >
                            {refId}
                          </span>
                        )
                      }
                      return (
                        <button
                          key={refId}
                          type="button"
                          onClick={() => openSafeExternal(src.url)}
                          className="inline-flex items-center gap-0.5 text-[9px] text-cyan-500/90 border border-cyan-900/40 rounded px-1 py-0.5 hover:bg-cyan-950/40"
                          title={src.why}
                        >
                          <ExternalLink size={9} />
                          {src.publisher || src.title.slice(0, 24)}
                        </button>
                      )
                    })}
                </div>
              </li>
            )
          })}
        </ul>
        {filteredEvidence.length === 0 && (
          <p className="text-[11px] text-slate-500 py-4 text-center">
            No claims match this filter. Rebuild sourced claims or load a story.
          </p>
        )}
        {!embedded && notes.filter((n) => !n.tags.includes('sources')).length > 0 && (
          <div className="mt-4 border-t border-slate-800 pt-3">
            <h3 className="text-[10px] uppercase tracking-wide text-slate-500 mb-2">
              Notes filed on this story
            </h3>
            {notes
              .filter((n) => !n.tags.includes('sources') && !n.tags.includes('full-report'))
              .slice(0, 6)
              .map((n) => (
                <div key={n.id} className="mb-2 rounded border border-slate-800/80 p-2">
                  <div className="flex items-center gap-2">
                    <EvidenceBadge score={n.score} />
                    <span className="text-xs text-slate-200">{n.title}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 line-clamp-3 whitespace-pre-wrap">
                    {n.body}
                  </p>
                </div>
              ))}
          </div>
        )}
      </Panel>
    </div>
  )
}

export default ResearchHubModule
