import { useState } from 'react'
import { FileText, ChevronDown, ChevronUp } from 'lucide-react'
import { usePlatformStore } from '../../store/platformStore'
import { getUseCase } from '../../data/useCases/catalog'
import { EvidenceBadge, Btn } from '../ui/primitives'
import { downloadText } from '../../core/workingDocument'
import { ActiveSourcesList } from './ActiveSourcesPanel'

/** Expandable full report for the active trend desk. */
export function ReportPanel() {
  const activeUseCaseId = usePlatformStore((s) => s.activeUseCaseId)
  const activeSources = usePlatformStore((s) => s.activeSources)
  const profile = getUseCase(activeUseCaseId)
  const report = profile.report
  const [open, setOpen] = useState(true)

  if (!report && !activeSources.length) return null
  if (!report) return null

  return (
    <div className="shrink-0 border-b border-slate-800/90 bg-[#080c16]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 px-3 py-1.5 text-left hover:bg-slate-900/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
      >
        <div className="flex items-center gap-2 min-w-0">
          <FileText size={13} className="text-cyan-500 shrink-0" />
          <span className="text-[10px] uppercase tracking-wide text-slate-500 shrink-0">
            Story brief
            {profile.trendRank != null ? ` · #${profile.trendRank}` : ''}
          </span>
          <span className="text-[11px] text-slate-200 truncate font-medium">{report.headline}</span>
          <span className="text-[10px] text-slate-600 shrink-0 hidden md:inline">
            as of {report.asOf}
          </span>
        </div>
        {open ? (
          <ChevronUp size={14} className="text-slate-500 shrink-0" />
        ) : (
          <ChevronDown size={14} className="text-slate-500 shrink-0" />
        )}
      </button>

      {open && (
        <div className="px-3 pb-3 max-h-[min(42vh,360px)] overflow-auto">
          <p className="text-[11px] text-cyan-600/90 mb-1">{report.trendSignal}</p>
          <p className="text-[12px] text-slate-300 leading-relaxed mb-3">{report.executiveSummary}</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div>
              <h3 className="text-[10px] font-semibold uppercase text-slate-500 mb-1.5">
                Scored claims
              </h3>
              <ul className="space-y-1.5">
                {report.claims.map((c) => (
                  <li
                    key={c.id}
                    className="rounded border border-slate-800/80 bg-slate-950/50 px-2 py-1.5 text-[11px]"
                  >
                    <div className="flex items-start gap-1.5">
                      <EvidenceBadge score={c.score} />
                      <span className="text-slate-200 leading-snug">{c.statement}</span>
                    </div>
                    <p className="mt-1 text-[10px] text-slate-500 pl-8">{c.notes}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <div>
                <h3 className="text-[10px] font-semibold uppercase text-slate-500 mb-1">
                  Timeline
                </h3>
                <ul className="space-y-1 text-[11px] text-slate-400">
                  {report.timeline.map((t) => (
                    <li key={t.when + t.what}>
                      <span className="text-slate-500 font-mono text-[10px]">{t.when}</span>
                      {' — '}
                      {t.what}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-[10px] font-semibold uppercase text-slate-500 mb-1">
                  Open questions
                </h3>
                <ul className="list-disc pl-4 text-[11px] text-slate-400 space-y-0.5">
                  {report.openQuestions.map((q) => (
                    <li key={q}>{q}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-[10px] font-semibold uppercase text-slate-500 mb-1">
                  Verification playbook
                </h3>
                <ol className="list-decimal pl-4 text-[11px] text-slate-400 space-y-0.5">
                  {report.verificationPlaybook.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </div>
              {activeSources.length > 0 && (
                <div className="pt-1 border-t border-slate-800/80">
                  <ActiveSourcesList sources={activeSources} compact title="Active sources (click to open)" />
                </div>
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                <Btn
                  variant="ghost"
                  className="!text-[10px]"
                  onClick={() =>
                    downloadText(
                      `nexus-report-${profile.id}-${report.asOf}.md`,
                      [
                        report.fullBriefMarkdown,
                        '',
                        '## Active sources',
                        '',
                        ...activeSources.map(
                          (src) => `- [${src.kind}] ${src.title} — ${src.url}\n  ${src.why}`,
                        ),
                      ].join('\n'),
                    )
                  }
                >
                  Download report .md
                </Btn>
                <span className="text-[10px] text-slate-600 self-center">
                  Explicit only · not Layer-0 gated (local notes). Package export still gated.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
