/**
 * SME analysis engine — acts as each lens's professional research advisor.
 * Deterministic, offline, evidence-first. Produces actionable briefings.
 */

import type { EvidenceItem, EvidenceScore, MaterialClass } from '../../types/core'
import type {
  SmeActionItem,
  SmeBriefing,
  SmeClaimRead,
  SmeLens,
  SmeUrgency,
} from '../../types/sme'
import { getSmeLens, SME_LENSES } from '../../data/sme/lenses'
import { uid } from '../../types/core'
import {
  applyLensRule,
  assertAllLensesHaveRules,
  type RuleCtx,
  type RuleResult,
} from './rules'

export { assertAllLensesHaveRules }

export interface AnalyzeContext {
  useCaseId: string
  useCaseLabel: string
  evidence: EvidenceItem[]
  researchNoteTitles?: string[]
  sourceTitles?: string[]
  openQuestions?: string[]
  conditionsSummary?: string
  ladderLevel?: number
  layer0Active?: boolean
  unresolvedNegatives?: number
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s+-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2)
}

function relevanceScore(lens: SmeLens, title: string, summary: string, tags: string[]): number {
  const hay = `${title} ${summary} ${tags.join(' ')}`.toLowerCase()
  let hits = 0
  for (const tag of lens.focusTags) {
    if (hay.includes(tag.toLowerCase())) hits += 1
  }
  // domain soft boosts
  const tokens = new Set(tokenize(hay))
  for (const tag of lens.focusTags) {
    for (const part of tag.split(/\s+/)) {
      if (part.length > 3 && tokens.has(part.toLowerCase())) hits += 0.35
    }
  }
  const base = Math.min(100, Math.round((hits / Math.max(2, lens.focusTags.length * 0.35)) * 100))
  // always some relevance so SME can still adjudicate
  return Math.max(18, base)
}

function baseRuleResult(original: EvidenceScore): RuleResult {
  return {
    score: original,
    confidence: original === 1 ? 72 : original === -1 ? 70 : 48,
    gaps: [],
  }
}

/** Global high-stakes guards applied before per-lens specialized rules. */
function applyHighStakesGuards(ctx: RuleCtx, base: RuleResult): RuleResult {
  let r = { ...base, gaps: [...base.gaps] }
  if (ctx.lens.highStakes && ctx.material === 'assumption' && ctx.original === 1) {
    r.score = 0
    r.confidence = 40
    r.gaps.push('Assumption labeled as supported — demoted to 0 under high-stakes lens')
  }
  if (ctx.lens.highStakes && ctx.material === 'derived' && ctx.original === 1 && ctx.relevance < 40) {
    r.score = 0
    r.confidence = 45
    r.gaps.push('Derived support is low-relevance to this lens — hold as 0')
  }
  return r
}

function smeRescore(
  lens: SmeLens,
  original: EvidenceScore,
  relevance: number,
  material: MaterialClass,
  title: string,
  summary: string,
  tags: string[],
): { score: EvidenceScore; confidence: number; finding: string; action: string; gaps: string[] } {
  const ctx: RuleCtx = { lens, original, relevance, material, title, summary, tags }
  let result = applyHighStakesGuards(ctx, baseRuleResult(original))
  result = applyLensRule(ctx, result)

  // Preserve tri-state
  const score: EvidenceScore =
    result.score === 1 || result.score === -1 || result.score === 0 ? result.score : 0

  if (score !== 1) {
    result.gaps.push(...lens.questionBank.slice(0, score === -1 ? 2 : 1))
  }
  if (relevance < 35) {
    result.gaps.push('Low topical relevance — verify this claim belongs on this SME desk')
  }

  let confidence = Math.min(95, Math.max(25, result.confidence + Math.round((relevance - 50) / 5)))

  const label = score === 1 ? '+1 supported' : score === -1 ? '−1 disqualified' : '0 contested'
  const finding = buildFinding(lens, label, original, relevance, material, result.findingNote)
  const action = buildAction(lens, score, relevance, result.actionOverride)

  // de-dupe gaps
  const seen = new Set<string>()
  const gaps = result.gaps.filter((g) => {
    if (seen.has(g)) return false
    seen.add(g)
    return true
  })

  return { score, confidence, finding, action, gaps }
}

function buildFinding(
  lens: SmeLens,
  label: string,
  original: EvidenceScore,
  relevance: number,
  material: MaterialClass,
  findingNote?: string,
): string {
  const rel =
    relevance >= 70 ? 'core to this desk' : relevance >= 40 ? 'adjacent to this desk' : 'peripheral'
  const mat =
    material === 'primary'
      ? 'primary material'
      : material === 'assumption'
        ? 'assumption-class'
        : material === 'secondary'
          ? 'secondary material'
          : 'derived material'
  const orig = original === 1 ? '+1' : original === -1 ? '−1' : '0'
  const note = findingNote ? ` ${findingNote}` : ''
  return (
    `${lens.persona.title}: disposition ${label} (${mat}, ${rel}). ` +
    `Incoming ledger was ${orig}. ${lens.persona.voice.split(';')[0]}.${note} ` +
    `Principle: ${lens.persona.principles[0]}`
  )
}

function buildAction(
  lens: SmeLens,
  score: EvidenceScore,
  relevance: number,
  actionOverride?: string,
): string {
  if (actionOverride) return actionOverride
  if (score === -1) {
    return `HOLD publish on this claim. Run: ${lens.questionBank[0] ?? 'Seek primary falsifier/confirmer'}. Escalate if still −1 after primary pull.`
  }
  if (score === 0) {
    return `Seek ${lens.preferredSources[0] ?? 'primary record'} before promoting. Next: ${lens.questionBank[0] ?? 'Corroborate'}.`
  }
  if (relevance >= 60) {
    return `Lock as +1 under ${lens.short} with source cite. Optional deepen: ${lens.questionBank[1] ?? lens.questionBank[0]}.`
  }
  return `Keep +1 but note peripheral to ${lens.short}. Prefer focusing effort on higher-relevance claims.`
}

function overallPosture(reads: SmeClaimRead[]): EvidenceScore {
  if (reads.some((r) => r.smeScore === -1 && r.relevance >= 40)) return -1
  if (reads.filter((r) => r.smeScore === 1).length >= reads.filter((r) => r.smeScore !== 1).length) {
    return reads.length ? 1 : 0
  }
  return 0
}

function urgencyFor(
  lens: SmeLens,
  posture: EvidenceScore,
  ctx: AnalyzeContext,
  highRelNeg: number,
): SmeUrgency {
  if (highRelNeg > 0 || (lens.highStakes && posture === -1)) return 'critical'
  if (ctx.layer0Active || (ctx.unresolvedNegatives ?? 0) > 0 || lens.highStakes) return 'elevated'
  if (posture === 0) return 'elevated'
  return 'routine'
}

function buildActions(
  lens: SmeLens,
  reads: SmeClaimRead[],
  ctx: AnalyzeContext,
  urgency: SmeUrgency,
): SmeActionItem[] {
  const actions: SmeActionItem[] = []
  const neg = reads.filter((r) => r.smeScore === -1).sort((a, b) => b.relevance - a.relevance)
  const zero = reads.filter((r) => r.smeScore === 0).sort((a, b) => b.relevance - a.relevance)

  if (neg[0]) {
    actions.push({
      id: uid('act'),
      priority: 1,
      title: `Clear −1: ${neg[0].claimTitle.slice(0, 72)}`,
      detail: neg[0].action,
      ownerHint: lens.persona.title,
      urgency: 'critical',
    })
  }
  if (zero[0]) {
    actions.push({
      id: uid('act'),
      priority: neg[0] ? 2 : 1,
      title: `Corroborate 0: ${zero[0].claimTitle.slice(0, 72)}`,
      detail: zero[0].action,
      ownerHint: 'Research desk',
      urgency: urgency === 'critical' ? 'elevated' : urgency,
    })
  }
  actions.push({
    id: uid('act'),
    priority: (actions.length + 1) as 1 | 2 | 3,
    title: `Pull preferred source: ${lens.preferredSources[0]}`,
    detail: `Under ${lens.name}, prioritize ${lens.preferredSources.join(' · ')}.`,
    ownerHint: 'Sources panel',
    urgency: lens.highStakes ? 'elevated' : 'routine',
  })
  if (lens.publishGates[0]) {
    actions.push({
      id: uid('act'),
      priority: 3,
      title: 'Check publish gate',
      detail: lens.publishGates[0],
      ownerHint: 'Export Clearance',
      urgency: lens.highStakes ? 'elevated' : 'routine',
    })
  }
  if (ctx.layer0Active || lens.highStakes) {
    actions.push({
      id: uid('act'),
      priority: 2,
      title: 'Confirm Layer-0 posture',
      detail: ctx.layer0Active
        ? 'Layer-0 is active — arm ACK only after −1 review.'
        : 'High-stakes lens: treat export as Layer-0 gated.',
      ownerHint: 'Analyst / Layer-0',
      urgency: 'elevated',
    })
  }
  // de-dupe by title, cap 6
  const seen = new Set<string>()
  return actions
    .filter((a) => {
      if (seen.has(a.title)) return false
      seen.add(a.title)
      return true
    })
    .slice(0, 6)
}

function markdownBrief(
  lens: SmeLens,
  ctx: AnalyzeContext,
  headline: string,
  summary: string,
  reads: SmeClaimRead[],
  actions: SmeActionItem[],
  posture: EvidenceScore,
): string {
  const ps = posture === 1 ? '+1' : posture === -1 ? '−1' : '0'
  const lines = [
    `# SME Brief · ${lens.name}`,
    ``,
    `**Story:** ${ctx.useCaseLabel} (\`${ctx.useCaseId}\`)`,
    `**Posture:** ${ps} · **Lens:** ${lens.short} · **Domain:** ${lens.domain}`,
    ``,
    `## Headline`,
    headline,
    ``,
    `## Executive summary`,
    summary,
    ``,
    `## Claim dispositions`,
    ...reads.map(
      (r) =>
        `- **${r.smeScore === 1 ? '+1' : r.smeScore === -1 ? '−1' : '0'}** ${r.claimTitle} _(rel ${r.relevance}%)_ — ${r.finding}`,
    ),
    ``,
    `## Actions`,
    ...actions.map((a) => `${a.priority}. **${a.title}** — ${a.detail} _(owner: ${a.ownerHint})_`),
    ``,
    `## Publish gates`,
    ...lens.publishGates.map((g) => `- ${g}`),
    ``,
    `## Principles`,
    ...lens.persona.principles.map((p) => `- ${p}`),
    ``,
    `_Generated by NEXOSxLPIN SME engine · not legal advice · training/analysis aid_`,
  ]
  return lines.join('\n')
}

/**
 * Run a single SME lens against the current investigation context.
 */
export function analyzeWithLens(lensId: string, ctx: AnalyzeContext): SmeBriefing {
  const lens = getSmeLens(lensId)
  const items = ctx.evidence.length
    ? ctx.evidence
    : [
        {
          id: 'ev-empty',
          title: 'No claims loaded',
          summary: 'Load an investigation to populate the evidence ledger.',
          score: 0 as EvidenceScore,
          confidence: 'unknown' as const,
          material: 'assumption' as MaterialClass,
          tags: [],
          sourceRefs: [],
          createdAt: new Date().toISOString(),
        },
      ]

  const claimReads: SmeClaimRead[] = items.map((ev) => {
    const relevance = relevanceScore(lens, ev.title, ev.summary, ev.tags ?? [])
    const { score, confidence, finding, action, gaps } = smeRescore(
      lens,
      ev.score,
      relevance,
      ev.material,
      ev.title,
      ev.summary,
      ev.tags ?? [],
    )
    return {
      claimId: ev.id,
      claimTitle: ev.title,
      claimSummary: ev.summary,
      originalScore: ev.score,
      smeScore: score,
      material: ev.material,
      relevance,
      confidence,
      finding,
      action,
      gaps,
    }
  })

  // Sort: high relevance first, then worse scores
  claimReads.sort((a, b) => {
    if (b.relevance !== a.relevance) return b.relevance - a.relevance
    return a.smeScore - b.smeScore
  })

  const posture = overallPosture(claimReads)
  const highRelNeg = claimReads.filter((r) => r.smeScore === -1 && r.relevance >= 40).length
  const urgency = urgencyFor(lens, posture, ctx, highRelNeg)
  const actions = buildActions(lens, claimReads, ctx, urgency)

  const supported = claimReads.filter((r) => r.smeScore === 1).length
  const contested = claimReads.filter((r) => r.smeScore === 0).length
  const disqualified = claimReads.filter((r) => r.smeScore === -1).length
  const highRelevance = claimReads.filter((r) => r.relevance >= 55).length

  const postureWord =
    posture === 1 ? 'cleared for careful advance' : posture === -1 ? 'blocked on material −1' : 'held — contested stack'
  const headline = `${lens.short}: ${supported}+ / ${contested}0 / ${disqualified}− · ${postureWord}`
  const executiveSummary = [
    `As ${lens.persona.title} (${lens.persona.credential}), I reviewed ${claimReads.length} ledger items on “${ctx.useCaseLabel}”.`,
    lens.tagline + '.',
    highRelNeg
      ? `${highRelNeg} high-relevance claim(s) are −1 under this lens — do not publish those as fact.`
      : disqualified
        ? `${disqualified} claim(s) scored −1; check relevance before global hold.`
        : contested
          ? `${contested} claim(s) remain 0 — corroborate before promotion.`
          : 'Stack is largely +1 under this lens; still cite primary sources.',
    ctx.conditionsSummary ? `Design conditions in play: ${ctx.conditionsSummary}.` : '',
    ctx.unresolvedNegatives
      ? `Session has ${ctx.unresolvedNegatives} unresolved −1 item(s) on the global ledger.`
      : '',
    `Top action: ${actions[0]?.title ?? 'Re-run after loading claims'}.`,
  ]
    .filter(Boolean)
    .join(' ')

  const openQuestions = [
    ...lens.questionBank,
    ...(ctx.openQuestions ?? []).slice(0, 3),
    ...claimReads
      .filter((r) => r.smeScore !== 1)
      .slice(0, 2)
      .flatMap((r) => r.gaps.slice(0, 1)),
  ].slice(0, 8)

  const sourcesToSeek = [
    ...lens.preferredSources,
    ...(ctx.sourceTitles ?? []).slice(0, 3),
  ]

  const generatedAt = new Date().toISOString()
  const workingDocMarkdown = markdownBrief(
    lens,
    ctx,
    headline,
    executiveSummary,
    claimReads,
    actions,
    posture,
  )

  return {
    id: uid('sme-brief'),
    lensId: lens.id,
    lensName: lens.name,
    useCaseId: ctx.useCaseId,
    generatedAt,
    posture,
    urgency,
    executiveSummary,
    headline,
    claimReads,
    actions,
    openQuestions,
    sourcesToSeek,
    publishGates: [...lens.publishGates],
    workingDocMarkdown,
    stats: {
      claims: claimReads.length,
      supported,
      contested,
      disqualified,
      highRelevance,
    },
    moduleId: 'sme-lenses',
  }
}

/** Recommend top lenses for a story by aggregate tag relevance */
export function recommendLenses(
  evidence: EvidenceItem[],
  limit = 5,
): Array<{ lensId: string; score: number }> {
  const blob = evidence.map((e) => `${e.title} ${e.summary} ${(e.tags ?? []).join(' ')}`).join(' ')
  const ranked = SME_LENSES.map((lens) => ({
    lensId: lens.id,
    score: relevanceScore(lens, blob, '', []),
  })).sort((a, b) => b.score - a.score)
  return ranked.slice(0, limit)
}
