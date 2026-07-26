/**
 * SME Lenses — 90 regulatory + technical analyst personas.
 * Accordion domains, checkbox multi-select, confirm-on-apply scores.
 */

import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { usePlatformStore } from '../../store/platformStore'
import {
  DEFAULT_SME_LENS_ID,
  SME_LENSES,
  getSmeLens,
  smeDomainOrder,
} from '../../data/sme/lenses'
import { analyzeWithLens, recommendLenses } from '../../lib/sme/analyze'
import { SME_DOMAIN_META, type SmeDomain } from '../../types/sme'
import { Panel, Btn, EvidenceBadge } from '../ui/primitives'
import { getUseCase } from '../../data/useCases/catalog'
import { unresolvedNegatives } from '../../core/evidence'
import type { EvidenceScore } from '../../types/core'

const DOMAIN_CHIP: Record<SmeDomain, string> = {
  'core-governance': 'border-cyan-800/60 bg-cyan-950/40 text-cyan-200',
  'public-records': 'border-emerald-800/60 bg-emerald-950/40 text-emerald-200',
  jurisdiction: 'border-violet-800/60 bg-violet-950/40 text-violet-200',
  oversight: 'border-amber-800/60 bg-amber-950/40 text-amber-200',
  'sector-regulatory': 'border-sky-800/60 bg-sky-950/40 text-sky-200',
  'method-process': 'border-slate-700 bg-slate-900 text-slate-300',
  'mechanical-engineering': 'border-orange-800/60 bg-orange-950/40 text-orange-200',
  'civil-structural': 'border-stone-600 bg-stone-900/80 text-stone-200',
  'electrical-electronics': 'border-yellow-800/60 bg-yellow-950/40 text-yellow-100',
  'chemical-process': 'border-lime-800/60 bg-lime-950/40 text-lime-200',
  'aerospace-defense-tech': 'border-indigo-800/60 bg-indigo-950/40 text-indigo-200',
  'materials-manufacturing': 'border-rose-800/60 bg-rose-950/40 text-rose-200',
  'energy-nuclear': 'border-red-800/60 bg-red-950/40 text-red-200',
  'biomedical-systems': 'border-pink-800/60 bg-pink-950/40 text-pink-200',
  'computing-cyberphysical': 'border-blue-800/60 bg-blue-950/40 text-blue-200',
  'mathematics-statistics': 'border-fuchsia-800/60 bg-fuchsia-950/40 text-fuchsia-200',
  'theoretical-physics': 'border-purple-800/60 bg-purple-950/40 text-purple-200',
  'applied-physical-sciences': 'border-teal-800/60 bg-teal-950/40 text-teal-200',
}

const DOMAIN_DOT: Record<SmeDomain, string> = {
  'core-governance': 'bg-cyan-400',
  'public-records': 'bg-emerald-400',
  jurisdiction: 'bg-violet-400',
  oversight: 'bg-amber-400',
  'sector-regulatory': 'bg-sky-400',
  'method-process': 'bg-slate-400',
  'mechanical-engineering': 'bg-orange-400',
  'civil-structural': 'bg-stone-400',
  'electrical-electronics': 'bg-yellow-400',
  'chemical-process': 'bg-lime-400',
  'aerospace-defense-tech': 'bg-indigo-400',
  'materials-manufacturing': 'bg-rose-400',
  'energy-nuclear': 'bg-red-400',
  'biomedical-systems': 'bg-pink-400',
  'computing-cyberphysical': 'bg-blue-400',
  'mathematics-statistics': 'bg-fuchsia-400',
  'theoretical-physics': 'bg-purple-400',
  'applied-physical-sciences': 'bg-teal-400',
}

function urgencyClass(u: string): string {
  if (u === 'critical') return 'text-rose-300 bg-rose-950/50 border-rose-800/60'
  if (u === 'elevated') return 'text-amber-200 bg-amber-950/40 border-amber-800/50'
  return 'text-slate-300 bg-slate-900 border-slate-700'
}

function emptyOpenState(): Record<SmeDomain, boolean> {
  const o = {} as Record<SmeDomain, boolean>
  for (const d of smeDomainOrder()) o[d] = false
  return o
}

export function SmeLensesModule({ embedded }: { embedded?: boolean }) {
  const evidence = usePlatformStore((s) => s.evidence)
  const researchNotes = usePlatformStore((s) => s.researchNotes)
  const activeSources = usePlatformStore((s) => s.activeSources)
  const activeUseCaseId = usePlatformStore((s) => s.activeUseCaseId)
  const conditions = usePlatformStore((s) => s.conditions)
  const dataPack = usePlatformStore((s) => s.dataPack)
  const ladder = usePlatformStore((s) => s.ladder)
  const layer0 = usePlatformStore((s) => s.layer0)
  const activeSmeLensId = usePlatformStore((s) => s.activeSmeLensId)
  const setActiveSmeLens = usePlatformStore((s) => s.setActiveSmeLens)
  const selectedSmeLensIds = usePlatformStore((s) => s.selectedSmeLensIds)
  const toggleSmeLensSelection = usePlatformStore((s) => s.toggleSmeLensSelection)
  const setSelectedSmeLenses = usePlatformStore((s) => s.setSelectedSmeLenses)
  const clearSmeSelection = usePlatformStore((s) => s.clearSmeSelection)
  const lastSmeBriefing = usePlatformStore((s) => s.lastSmeBriefing)
  const lastSmeBriefingSet = usePlatformStore((s) => s.lastSmeBriefingSet)
  const runSmeLens = usePlatformStore((s) => s.runSmeLens)
  const runSelectedSmeLenses = usePlatformStore((s) => s.runSelectedSmeLenses)
  const commitSmeBriefToWorkingDoc = usePlatformStore((s) => s.commitSmeBriefToWorkingDoc)
  const applySmeScoresToEvidence = usePlatformStore((s) => s.applySmeScoresToEvidence)

  const [domainFilter, setDomainFilter] = useState<SmeDomain | 'all'>('all')
  const [q, setQ] = useState('')
  const [applyArmed, setApplyArmed] = useState(false)
  const [openDomains, setOpenDomains] = useState<Record<SmeDomain, boolean>>(emptyOpenState)
  const [accordionBooted, setAccordionBooted] = useState(false)

  const lensId = activeSmeLensId || DEFAULT_SME_LENS_ID
  const lens = getSmeLens(lensId)
  const profile = getUseCase(activeUseCaseId)
  const selectedCount = selectedSmeLensIds.length

  const recommended = useMemo(() => recommendLenses(evidence, 5), [evidence])
  const recommendedIds = useMemo(() => new Set(recommended.map((r) => r.lensId)), [recommended])

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase()
    return SME_LENSES.filter((l) => {
      if (domainFilter !== 'all' && l.domain !== domainFilter) return false
      if (!qq) return true
      return (
        l.name.toLowerCase().includes(qq) ||
        l.short.toLowerCase().includes(qq) ||
        l.tagline.toLowerCase().includes(qq) ||
        l.id.toLowerCase().includes(qq) ||
        l.focusTags.some((t) => t.includes(qq))
      )
    })
  }, [domainFilter, q])

  const byDomain = useMemo(() => {
    const order = smeDomainOrder()
    return order
      .map((d) => ({
        domain: d,
        lenses: filtered.filter((l) => l.domain === d),
      }))
      .filter((g) => g.lenses.length > 0)
  }, [filtered])

  // Default expand domains with recommended lenses or active/selected
  useEffect(() => {
    if (accordionBooted) return
    const next = emptyOpenState()
    const force = new Set<SmeDomain>()
    for (const id of recommendedIds) force.add(getSmeLens(id).domain)
    force.add(getSmeLens(lensId).domain)
    for (const id of selectedSmeLensIds) force.add(getSmeLens(id).domain)
    for (const d of force) next[d] = true
    // If nothing, open first governance domain present
    if (![...force].length && byDomain[0]) next[byDomain[0].domain] = true
    setOpenDomains(next)
    setAccordionBooted(true)
  }, [accordionBooted, recommendedIds, lensId, selectedSmeLensIds, byDomain])

  const liveBrief = useMemo(() => {
    if (
      lastSmeBriefing &&
      lastSmeBriefing.lensId === lensId &&
      lastSmeBriefing.useCaseId === activeUseCaseId
    ) {
      return lastSmeBriefing
    }
    const matrix = dataPack.conditionMatrices.find((m) => m.id === conditions?.matrixId)
    const condSummary = conditions
      ? Object.entries(conditions.selections)
          .map(([axisId, optId]) => {
            const axis = matrix?.axes.find((a) => a.id === axisId)
            const opt = axis?.options.find((o) => o.id === optId)
            return `${axis?.label ?? axisId}: ${opt?.label ?? optId}`
          })
          .join(' · ')
      : undefined
    return analyzeWithLens(lensId, {
      useCaseId: activeUseCaseId,
      useCaseLabel: profile.label,
      evidence,
      researchNoteTitles: researchNotes.map((n) => n.title),
      sourceTitles: activeSources.map((s) => s.title),
      openQuestions: profile.report?.openQuestions,
      conditionsSummary: condSummary,
      ladderLevel: ladder.current,
      layer0Active: layer0.active,
      unresolvedNegatives: unresolvedNegatives(evidence).length,
    })
  }, [
    lastSmeBriefing,
    lensId,
    activeUseCaseId,
    evidence,
    researchNotes,
    activeSources,
    profile,
    conditions,
    dataPack,
    ladder,
    layer0,
  ])

  const pad = embedded ? 'p-2' : 'p-3'

  const pendingScoreChanges = useMemo(() => {
    if (!lastSmeBriefing) return 0
    return lastSmeBriefing.claimReads.filter((r) => {
      const ev = evidence.find((e) => e.id === r.claimId)
      return ev != null && ev.score !== r.smeScore
    }).length
  }, [lastSmeBriefing, evidence])

  const selectedLenses = useMemo(
    () => selectedSmeLensIds.map((id) => getSmeLens(id)),
    [selectedSmeLensIds],
  )

  const toggleDomain = (d: SmeDomain) =>
    setOpenDomains((prev) => ({ ...prev, [d]: !prev[d] }))

  const expandAll = () => {
    const next = emptyOpenState()
    for (const g of byDomain) next[g.domain] = true
    setOpenDomains(next)
  }

  const collapseAll = () => setOpenDomains(emptyOpenState())

  const selectAllInDomain = (d: SmeDomain) => {
    const ids = SME_LENSES.filter((l) => l.domain === d).map((l) => l.id)
    setSelectedSmeLenses(Array.from(new Set([...selectedSmeLensIds, ...ids])))
  }

  const clearDomainSelection = (d: SmeDomain) => {
    setSelectedSmeLenses(selectedSmeLensIds.filter((id) => getSmeLens(id).domain !== d))
  }

  return (
    <div className={`h-full min-h-0 flex flex-col gap-2 ${pad} overflow-hidden`}>
      <Panel
        title={`SME Lenses · Expert catalog · ${SME_LENSES.length}${selectedCount ? ` · ${selectedCount} selected` : ''}`}
        className="shrink-0"
        actions={
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-slate-500" title="High-stakes lenses flag export risk">
              HS = high-stakes
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              113 civic · 139 technical
            </span>
          </div>
        }
      >
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Professional research advisors. Checkbox multi-select for batch runs; click a label for
          the detail pane. Tri-state (+1 / 0 / −1) dispositions with Layer-0 aware publish gates.
          Training desks only — not legal advice.
        </p>

        {/* Sticky filter bar */}
        <div className="mt-2 sticky top-0 z-10 -mx-0.5 px-0.5 py-1.5 bg-slate-950/95 border-b border-slate-800/80 space-y-1.5">
          <div className="flex flex-wrap gap-1.5 items-center">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filter SMEs…"
              className="rounded border border-slate-700 bg-slate-950 px-2 py-1 text-[11px] text-slate-200 w-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50"
            />
            <button
              type="button"
              onClick={() => setDomainFilter('all')}
              className={`rounded border px-1.5 py-0.5 text-[10px] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 ${
                domainFilter === 'all'
                  ? 'border-cyan-700 bg-cyan-950/50 text-cyan-100'
                  : 'border-slate-700 text-slate-400'
              }`}
            >
              All
            </button>
            {smeDomainOrder().map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDomainFilter(d)}
                className={`rounded border px-1.5 py-0.5 text-[10px] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 ${
                  domainFilter === d ? DOMAIN_CHIP[d] : 'border-slate-700 text-slate-500'
                }`}
                title={SME_DOMAIN_META[d].description}
              >
                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${DOMAIN_DOT[d]}`} />
                {SME_DOMAIN_META[d].label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 items-center">
            <Btn onClick={expandAll}>Expand all</Btn>
            <Btn onClick={collapseAll}>Collapse all</Btn>
            <Btn
              variant="primary"
              onClick={() => {
                setApplyArmed(false)
                runSelectedSmeLenses()
              }}
              title="Run analysis for each selected lens"
            >
              Run selected ({selectedCount || 1})
            </Btn>
            <Btn onClick={clearSmeSelection} title="Clear multi-select">
              Clear selection
            </Btn>
          </div>
          {selectedLenses.length > 0 ? (
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[10px] text-slate-500 shrink-0">Selected:</span>
              <div
                className="flex-1 min-w-0 overflow-x-auto flex flex-nowrap gap-1 py-0.5"
                role="list"
                aria-label="Selected SME lenses"
              >
                {selectedLenses.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    role="listitem"
                    onClick={() => toggleSmeLensSelection(l.id)}
                    className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] ${DOMAIN_CHIP[l.domain]} focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60`}
                    title={`Deselect ${l.short}`}
                    aria-label={`Deselect ${l.short}`}
                  >
                    {l.short} ×
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={clearSmeSelection}
                className="shrink-0 text-[10px] text-slate-400 hover:text-cyan-300 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 rounded px-1"
              >
                Clear all
              </button>
            </div>
          ) : (
            <p className="text-[10px] text-slate-600">
              No multi-select yet — check lenses below, or use Run selected with the active lens.
            </p>
          )}
        </div>

        {recommended.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1 items-center">
            <span className="text-[10px] text-slate-500">Recommended for this story:</span>
            {recommended.map((r) => {
              const L = getSmeLens(r.lensId)
              return (
                <button
                  key={r.lensId}
                  type="button"
                  onClick={() => setActiveSmeLens(r.lensId)}
                  className={`rounded-full border px-2 py-0.5 text-[10px] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 ${
                    lensId === r.lensId
                      ? 'border-cyan-600 bg-cyan-950/60 text-cyan-100'
                      : 'border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                  title={L.tagline}
                >
                  {L.short} · {r.score}%
                </button>
              )
            })}
          </div>
        )}
      </Panel>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[minmax(240px,300px)_1fr] gap-2 overflow-hidden">
        {/* Catalog accordion */}
        <Panel
          title={`Expert catalog · ${SME_LENSES.length}${selectedCount ? ` · ${selectedCount} selected` : ''}`}
          className="min-h-0 overflow-hidden flex flex-col"
        >
          {/* Sticky catalog toolbar */}
          <div className="shrink-0 sticky top-0 z-10 -mx-1 px-1 pb-1.5 mb-1 border-b border-slate-800/80 bg-slate-950/95 flex flex-wrap gap-1 items-center">
            <Btn onClick={expandAll}>Expand</Btn>
            <Btn onClick={collapseAll}>Collapse</Btn>
            <span className="text-[9px] text-slate-600 font-mono ml-auto">
              {filtered.length}/{SME_LENSES.length}
            </span>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto space-y-1 pr-1" role="region" aria-label="SME domain accordion">
            {byDomain.map((g) => {
              const open = openDomains[g.domain]
              const panelId = `sme-domain-panel-${g.domain}`
              const headerId = `sme-domain-header-${g.domain}`
              const hsCount = g.lenses.filter((l) => l.highStakes).length
              const selInDomain = g.lenses.filter((l) => selectedSmeLensIds.includes(l.id)).length
              return (
                <div key={g.domain} className="rounded-md border border-slate-800/80 overflow-hidden">
                  <div className="flex items-stretch">
                    <button
                      type="button"
                      id={headerId}
                      onClick={() => toggleDomain(g.domain)}
                      className="flex-1 flex items-center gap-1.5 px-2 py-1.5 text-left hover:bg-slate-900/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-500/60"
                      aria-expanded={open}
                      aria-controls={panelId}
                    >
                      {open ? (
                        <ChevronDown size={12} className="text-slate-500 shrink-0" aria-hidden />
                      ) : (
                        <ChevronRight size={12} className="text-slate-500 shrink-0" aria-hidden />
                      )}
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${DOMAIN_DOT[g.domain]}`} aria-hidden />
                      <span className={`text-[10px] font-semibold uppercase tracking-wide ${DOMAIN_CHIP[g.domain].split(' ').slice(-1)[0]}`}>
                        {SME_DOMAIN_META[g.domain].label}
                      </span>
                      <span className="text-[10px] text-slate-600 font-mono">({g.lenses.length})</span>
                      {hsCount > 0 && (
                        <span className="text-[9px] text-rose-400/90 ml-auto shrink-0">{hsCount} HS</span>
                      )}
                      {selInDomain > 0 && (
                        <span className="text-[9px] text-cyan-400/90 shrink-0 ml-1">{selInDomain} sel</span>
                      )}
                    </button>
                  </div>
                  {open && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={headerId}
                      className="border-t border-slate-800/60 px-1.5 pb-1.5 pt-1"
                    >
                      <div className="flex gap-1 mb-1 px-0.5">
                        <button
                          type="button"
                          onClick={() => selectAllInDomain(g.domain)}
                          className="text-[9px] text-cyan-500/90 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 rounded"
                        >
                          Select all
                        </button>
                        <span className="text-slate-700" aria-hidden>
                          ·
                        </span>
                        <button
                          type="button"
                          onClick={() => clearDomainSelection(g.domain)}
                          className="text-[9px] text-slate-500 hover:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 rounded"
                        >
                          Clear domain
                        </button>
                      </div>
                      <ul className="space-y-0.5">
                        {g.lenses.map((l) => {
                          const on = l.id === lensId
                          const checked = selectedSmeLensIds.includes(l.id)
                          const rec = recommendedIds.has(l.id)
                          const cbId = `sme-cb-${l.id}`
                          return (
                            <li key={l.id}>
                              <div
                                className={`flex items-start gap-1.5 rounded-md border px-1.5 py-1 transition ${
                                  on
                                    ? 'border-cyan-700/70 bg-cyan-950/40'
                                    : 'border-transparent hover:border-slate-700 hover:bg-slate-900/80'
                                }`}
                              >
                                <input
                                  id={cbId}
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleSmeLensSelection(l.id)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="mt-0.5 rounded border-slate-600 bg-slate-950 text-cyan-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 focus:ring-offset-0 shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                  <label
                                    htmlFor={cbId}
                                    className="flex items-center justify-between gap-1 cursor-pointer"
                                  >
                                    <span className="text-[11px] font-medium text-slate-100 truncate">
                                      {l.short}
                                      {rec && (
                                        <span className="ml-1 text-[9px] text-cyan-500/80 font-normal">
                                          rec
                                        </span>
                                      )}
                                    </span>
                                    {l.highStakes && (
                                      <span className="text-[9px] text-rose-400/90 shrink-0">HS</span>
                                    )}
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => setActiveSmeLens(l.id)}
                                    className="w-full text-left text-[10px] text-slate-500 line-clamp-2 leading-snug mt-0.5 hover:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 rounded"
                                    title={`Open detail: ${l.name}`}
                                  >
                                    {l.tagline}
                                  </button>
                                </div>
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })}
            {filtered.length === 0 && (
              <div
                className="rounded-md border border-dashed border-slate-800 px-3 py-6 text-center"
                role="status"
              >
                <p className="text-[11px] text-slate-400">No lenses match this filter.</p>
                <button
                  type="button"
                  onClick={() => {
                    setQ('')
                    setDomainFilter('all')
                  }}
                  className="mt-2 text-[10px] text-cyan-500 hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 rounded px-1"
                >
                  Clear search & show all domains
                </button>
              </div>
            )}
          </div>
        </Panel>

        {/* Briefing */}
        <div className="min-h-0 flex flex-col gap-2 overflow-hidden">
          <Panel
            title={lens.name}
            className="shrink-0"
            actions={
              <div className="flex flex-wrap gap-1">
                <span
                  className={`rounded border px-1.5 py-0.5 text-[9px] uppercase ${urgencyClass(liveBrief.urgency)}`}
                >
                  {liveBrief.urgency}
                </span>
                <EvidenceBadge score={liveBrief.posture as EvidenceScore} />
              </div>
            }
          >
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className={`rounded border px-1.5 py-0.5 text-[10px] ${DOMAIN_CHIP[lens.domain]}`}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${DOMAIN_DOT[lens.domain]}`} />
                {SME_DOMAIN_META[lens.domain].label}
              </span>
              <span className="text-[10px] text-slate-500">{lens.persona.credential}</span>
              {lens.highStakes && (
                <span className="text-[9px] uppercase tracking-wide text-rose-400 border border-rose-900/50 rounded px-1">
                  High stakes
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">{lens.description}</p>
            <div className="mt-2 grid sm:grid-cols-2 gap-2 text-[10px] text-slate-400">
              <div>
                <div className="text-slate-500 uppercase tracking-wide mb-0.5 text-[9px]">Voice</div>
                {lens.persona.voice}
              </div>
              <div>
                <div className="text-slate-500 uppercase tracking-wide mb-0.5 text-[9px]">Principles</div>
                <ul className="list-disc pl-3 space-y-0.5">
                  {lens.persona.principles.slice(0, 3).map((p) => (
                    <li key={p.slice(0, 24)}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5 items-center">
              <Btn
                variant="primary"
                onClick={() => {
                  setApplyArmed(false)
                  runSmeLens(lens.id)
                }}
              >
                Run SME analysis
              </Btn>
              <Btn
                onClick={() => {
                  setApplyArmed(false)
                  runSelectedSmeLenses()
                }}
              >
                Run selected ({selectedCount || 1})
              </Btn>
              <Btn
                onClick={() => {
                  setApplyArmed(false)
                  commitSmeBriefToWorkingDoc()
                }}
              >
                Commit to working doc
              </Btn>
              {!applyArmed ? (
                <Btn
                  onClick={() => setApplyArmed(true)}
                  title="Write SME dispositions back onto matching evidence scores (requires confirm)"
                >
                  Apply scores to ledger
                </Btn>
              ) : (
                <>
                  <Btn
                    variant="primary"
                    onClick={() => {
                      applySmeScoresToEvidence()
                      setApplyArmed(false)
                    }}
                    title="Confirm: mutate evidence ledger scores from last SME briefing"
                  >
                    {pendingScoreChanges > 0
                      ? `Confirm apply ${pendingScoreChanges} score change${pendingScoreChanges === 1 ? '' : 's'}?`
                      : 'Confirm apply scores?'}
                  </Btn>
                  <Btn onClick={() => setApplyArmed(false)} title="Cancel apply">
                    Cancel
                  </Btn>
                </>
              )}
            </div>
            {applyArmed && (
              <p className="mt-1.5 text-[10px] text-amber-400/90">
                This mutates the evidence ledger. Second click confirms; Cancel aborts.
                {!lastSmeBriefing && ' Run SME analysis first if no briefing is stored.'}
              </p>
            )}
          </Panel>

          <div className="flex-1 min-h-0 overflow-y-auto space-y-2 pr-0.5">
            {lastSmeBriefingSet.length > 0 && (
              <Panel title={`Batch briefings · ${lastSmeBriefingSet.length}`}>
                <ul className="space-y-1" aria-label="SME batch run results">
                  {lastSmeBriefingSet.map((b) => {
                    const short = getSmeLens(b.lensId).short
                    return (
                      <li key={b.id}>
                        <button
                          type="button"
                          onClick={() => setActiveSmeLens(b.lensId)}
                          className={`w-full text-left rounded border px-2 py-1.5 text-[11px] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 ${
                            b.lensId === lensId
                              ? 'border-cyan-700/70 bg-cyan-950/40'
                              : 'border-slate-800 hover:border-slate-600'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium text-slate-100 truncate">
                              <span className="text-cyan-500/90 mr-1 font-mono text-[10px]">
                                {short}
                              </span>
                              {b.lensName}
                            </span>
                            <span className="flex items-center gap-1 shrink-0">
                              <span
                                className={`rounded border px-1 py-0.5 text-[9px] uppercase ${urgencyClass(b.urgency)}`}
                              >
                                {b.urgency}
                              </span>
                              <EvidenceBadge score={b.posture as EvidenceScore} />
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 line-clamp-2 mt-0.5">
                            {b.headline}
                          </div>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </Panel>
            )}

            <Panel title="Advisor briefing">
              <div className="text-[12px] font-medium text-slate-100 leading-snug">{liveBrief.headline}</div>
              <p className="mt-1.5 text-[11px] text-slate-400 leading-relaxed">
                {liveBrief.executiveSummary}
              </p>
              <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-mono text-slate-500">
                <span>+1 {liveBrief.stats.supported}</span>
                <span>0 {liveBrief.stats.contested}</span>
                <span>−1 {liveBrief.stats.disqualified}</span>
                <span>hi-rel {liveBrief.stats.highRelevance}</span>
                <span>{liveBrief.stats.claims} claims</span>
              </div>
            </Panel>

            <Panel title="Actions (owner-ready)">
              <ol className="space-y-2">
                {liveBrief.actions.map((a) => (
                  <li
                    key={a.id}
                    className="rounded-md border border-slate-800 bg-slate-950/60 px-2.5 py-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-[11px] font-medium text-slate-100">
                        <span className="text-cyan-500/90 mr-1">P{a.priority}</span>
                        {a.title}
                      </div>
                      <span
                        className={`shrink-0 rounded border px-1 py-0.5 text-[9px] uppercase ${urgencyClass(a.urgency)}`}
                      >
                        {a.urgency}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-slate-400">{a.detail}</p>
                    <div className="mt-0.5 text-[9px] text-slate-600">Owner: {a.ownerHint}</div>
                  </li>
                ))}
              </ol>
            </Panel>

            <Panel title="Claim dispositions">
              <ul className="space-y-2">
                {liveBrief.claimReads.map((r) => (
                  <li
                    key={r.claimId}
                    className="rounded-md border border-slate-800/90 px-2.5 py-2 bg-slate-950/40"
                  >
                    <div className="flex items-start gap-2">
                      <EvidenceBadge score={r.smeScore} />
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] font-medium text-slate-100">{r.claimTitle}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                          {r.claimSummary || '—'}
                        </div>
                        <p className="mt-1 text-[10px] text-slate-400 leading-relaxed">{r.finding}</p>
                        <p className="mt-0.5 text-[10px] text-cyan-600/90">→ {r.action}</p>
                        <div className="mt-1 flex flex-wrap gap-2 text-[9px] font-mono text-slate-600">
                          <span>rel {r.relevance}%</span>
                          <span>conf {r.confidence}</span>
                          <span>
                            was{' '}
                            {r.originalScore === 1 ? '+1' : r.originalScore === -1 ? '−1' : '0'}
                          </span>
                        </div>
                        {r.gaps.length > 0 && (
                          <ul className="mt-1 list-disc pl-3 text-[10px] text-amber-500/80">
                            {r.gaps.slice(0, 3).map((g) => (
                              <li key={g.slice(0, 40)}>{g}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Panel>

            <div className="grid sm:grid-cols-2 gap-2">
              <Panel title="Open questions">
                <ul className="list-disc pl-3 space-y-1 text-[10px] text-slate-400">
                  {liveBrief.openQuestions.map((qq) => (
                    <li key={qq.slice(0, 48)}>{qq}</li>
                  ))}
                </ul>
              </Panel>
              <Panel title="Sources to seek">
                <ul className="list-disc pl-3 space-y-1 text-[10px] text-slate-400">
                  {liveBrief.sourcesToSeek.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <div className="mt-2 text-[10px] text-slate-500 uppercase tracking-wide">
                  Publish gates
                </div>
                <ul className="mt-0.5 list-disc pl-3 space-y-1 text-[10px] text-rose-300/80">
                  {liveBrief.publishGates.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              </Panel>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
