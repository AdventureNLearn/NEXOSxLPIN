/**
 * Per-lens adjudicator rules for the SME engine.
 * Deterministic, offline, pure — every SME_LENSES id has a specialized path.
 */

import type { EvidenceScore, MaterialClass } from '../../types/core'
import type { SmeLens } from '../../types/sme'
import { SME_LENSES } from '../../data/sme/lenses'

export type RuleCtx = {
  lens: SmeLens
  original: EvidenceScore
  relevance: number
  material: MaterialClass
  title: string
  summary: string
  tags: string[]
}

export type RuleResult = {
  score: EvidenceScore
  confidence: number
  gaps: string[]
  findingNote?: string
  actionOverride?: string
}

function hay(ctx: RuleCtx): string {
  return `${ctx.title} ${ctx.summary} ${ctx.tags.join(' ')}`.toLowerCase()
}

function hasAny(text: string, needles: string[]): boolean {
  return needles.some((n) => text.includes(n.toLowerCase()))
}

function isWeakMaterial(m: MaterialClass): boolean {
  return m === 'assumption' || m === 'derived'
}

function isSocialOnly(text: string, material: MaterialClass): boolean {
  if (material === 'primary') return false
  return hasAny(text, ['social', 'twitter', 'tiktok', 'viral', 'rumor', 'hearsay', 'anonymous post'])
}

function demoteToZero(
  base: RuleResult,
  gap: string,
  conf = 42,
  note?: string,
  action?: string,
): RuleResult {
  return {
    ...base,
    score: 0,
    confidence: Math.min(base.confidence, conf),
    gaps: [...base.gaps, gap],
    findingNote: note ?? base.findingNote,
    actionOverride: action ?? base.actionOverride,
  }
}

function requirePrimaryForPlusOne(
  ctx: RuleCtx,
  base: RuleResult,
  label: string,
  tagsBoost: string[],
): RuleResult {
  let r = { ...base, gaps: [...base.gaps] }
  const text = hay(ctx)
  if (ctx.original === 1 && ctx.material !== 'primary' && ctx.material !== 'secondary') {
    r = demoteToZero(
      r,
      `${label}: +1 without primary/secondary material — held at 0`,
      40,
      `${label} requires record-class support for +1.`,
      `Pull ${ctx.lens.preferredSources[0] ?? 'primary record'} before promoting.`,
    )
  } else if (ctx.original === 1 && isSocialOnly(text, ctx.material)) {
    r = demoteToZero(
      r,
      `${label}: social/rumor pathway cannot carry +1`,
      38,
      `${label} demoted social-only support.`,
    )
  } else if (ctx.original === 1 && ctx.material === 'primary') {
    r.confidence = Math.min(95, r.confidence + 8)
    r.findingNote = `${label}: primary material sustains +1.`
  }
  if (hasAny(text, tagsBoost) && r.score !== -1) {
    r.confidence = Math.min(95, r.confidence + 6)
    r.findingNote = (r.findingNote ? r.findingNote + ' ' : '') + `Tag boost: ${tagsBoost.find((t) => text.includes(t)) ?? tagsBoost[0]}.`
  }
  if (ctx.original === -1) {
    r.confidence = Math.max(r.confidence, 80)
    r.gaps.push(`${label}: −1 retained — resolve with primary falsifier/confirmer`)
  }
  return r
}

function sectorTagMatch(
  ctx: RuleCtx,
  base: RuleResult,
  sectorTags: string[],
  sectorName: string,
): RuleResult {
  let r = { ...base, gaps: [...base.gaps] }
  const text = hay(ctx)
  const matched = hasAny(text, sectorTags) || ctx.relevance >= 50
  if (!matched && ctx.original === 1) {
    r.confidence = Math.max(28, r.confidence - 18)
    r.gaps.push(`${sectorName}: domain tag mismatch — lower confidence until sector signals present`)
    r.findingNote = `${sectorName} desk: claim is peripheral to sector keywords.`
  } else if (matched && ctx.original === 1 && ctx.material === 'primary') {
    r.confidence = Math.min(95, r.confidence + 10)
    r.findingNote = `${sectorName}: in-domain primary support.`
  }
  if (ctx.lens.highStakes && ctx.original === 1 && isWeakMaterial(ctx.material)) {
    r = demoteToZero(r, `${sectorName}: high-stakes sector rejects weak material for +1`, 36)
  }
  return r
}

function jurisdictionAuthority(ctx: RuleCtx, base: RuleResult, label: string): RuleResult {
  let r = { ...base, gaps: [...base.gaps] }
  const text = hay(ctx)
  const namesAuthority = hasAny(text, [
    'federal',
    'state',
    'county',
    'municipal',
    'city',
    'agency',
    'commission',
    'board',
    'court',
    'ordinance',
    'statute',
    'regulation',
    'jurisdiction',
    'authority',
  ])
  if (ctx.original === 1 && !namesAuthority && ctx.relevance >= 35) {
    r = demoteToZero(
      r,
      `${label}: claim does not name deciding authority level`,
      40,
      `${label}: promote only after authority is named.`,
      `Name the authority that can decide/compel; then re-score.`,
    )
  } else if (namesAuthority && ctx.original === 1) {
    r.confidence = Math.min(95, r.confidence + 7)
    r.findingNote = `${label}: authority level signals present.`
  }
  if (hasAny(text, ['conflict', 'multi-j', 'overlap', 'concurrent', 'preempt']) && ctx.original === 1) {
    r = demoteToZero(
      r,
      `${label}: multi-jurisdiction conflict tags — hold at 0 until routing clear`,
      42,
      `${label}: concurrent authority conflict unresolved.`,
    )
  }
  return r
}

// ── Core governance ──────────────────────────────────────────────────

const evidenceGate = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = { ...base, gaps: [...base.gaps] }
  if (ctx.original === -1) {
    r.score = -1
    r.confidence = Math.max(r.confidence, 88)
    r.findingNote = 'Evidence gate: −1 stays −1 with high confidence until primary overturn.'
    r.actionOverride = 'HOLD as −1. Pull primary falsifier/confirmer before any promotion.'
    r.gaps.push('Evidence gate: −1 cannot be soft-promoted')
  }
  if (ctx.original === 1 && ctx.material !== 'primary') {
    r = demoteToZero(
      r,
      'Evidence gate: +1 without primary material → 0',
      38,
      'Evidence gate blocks non-primary +1.',
      'Attach primary source ref or reclassify as 0/assumption.',
    )
  }
  if (ctx.original === 1 && (ctx.tags.length === 0 || isWeakMaterial(ctx.material))) {
    if (r.score === 1) {
      r = demoteToZero(r, 'Evidence gate: empty source-refs vibe / weak material for +1', 36)
    } else {
      r.gaps.push('Evidence gate: sparse tags/source trail on promoted claim')
    }
  }
  if (ctx.original === 0) {
    r.gaps.push('Evidence gate: contested claim needs falsifier and confirmer listed')
    r.findingNote = 'Evidence gate holds 0 until disposition evidence lands.'
  }
  return r
}

const layer0Prefilter = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = { ...base, gaps: [...base.gaps] }
  const text = hay(ctx)
  if (hasAny(text, ['export', 'publish', 'harm', 'defamation', 'safety', 'high-stakes'])) {
    r.confidence = Math.min(95, r.confidence + 10)
    r.findingNote = 'Layer-0: export/publish/harm signals elevate pre-filter scrutiny.'
    r.gaps.push('Layer-0: confirm ACK before export/publish action')
  }
  if (ctx.original === -1 && ctx.lens.highStakes) {
    r.confidence = Math.max(r.confidence, 90)
    r.gaps.push('Layer-0: −1 under high stakes requires ACK documentation before any advance')
    r.actionOverride = 'Block high-stakes action until −1 cleared or Layer-0 ACK logged.'
    r.findingNote = 'Layer-0: material −1 arms the pre-filter.'
  }
  if (ctx.original === 1 && isWeakMaterial(ctx.material)) {
    r = demoteToZero(r, 'Layer-0: weak material cannot clear pre-filter as +1', 40)
  }
  return r
}

const workingDoc = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = { ...base, gaps: [...base.gaps] }
  const text = hay(ctx)
  const decisionish = hasAny(text, ['decision', 'task', 'approve', 'lock', 'commit', 'assign', 'owner'])
  const hasLockLang = hasAny(text, ['locked', 'wd cite', 'working doc', 'entry id', 'timestamp', 'logged'])
  if (decisionish && !hasLockLang && ctx.original === 1) {
    r = demoteToZero(
      r,
      'Working doc: decision/task claim lacks lock language — prefer 0 until WD cite',
      40,
      'Working Doc Controller: unlock-risk on decision claims without WD cite.',
      'Lock decision/task into working document with owner + timestamp.',
    )
  } else if (decisionish && hasLockLang) {
    r.confidence = Math.min(95, r.confidence + 8)
    r.findingNote = 'Working doc: lock language present — durable trail.'
  } else if (decisionish) {
    r.gaps.push('Working doc: confirm decision is logged with owner')
    r.findingNote = 'Working doc desk flags durability risk.'
  }
  return r
}

const narrativeIntegrity = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = { ...base, gaps: [...base.gaps] }
  const text = hay(ctx)
  if (ctx.original === 1 && hasAny(text, ['motive', 'viral', 'rumor', 'smear', 'frame', 'misinfo', 'narrative'])) {
    r = demoteToZero(
      r,
      'Narrative: motive/viral/rumor/smear tags demote +1 → 0',
      35,
      'Narrative Integrity: frame risk exceeds confirmed fact load.',
      'Separate load-bearing fact from frame; re-score only the fact claim.',
    )
  }
  if (hasAny(text, ['both sides', 'evenhand', 'balanced take']) && ctx.original !== 0) {
    r.gaps.push('Narrative: check for evenhandedness theater on asymmetric stack')
    r.findingNote = (r.findingNote ? r.findingNote + ' ' : '') + 'Evenhand language flagged.'
  }
  if (ctx.original === -1) {
    r.confidence = Math.max(r.confidence, 82)
    r.gaps.push('Narrative: −1 claim must not headline as established fact')
  }
  return r
}

const claimsAdjudicator = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = { ...base, gaps: [...base.gaps] }
  if (ctx.original === 0 && ctx.relevance >= 50) {
    r.score = 0
    r.confidence = Math.min(70, Math.max(r.confidence, 55))
    r.gaps.push('Adjudicator: contested high-relevance claim forces falsifier gap')
    r.findingNote = 'Claims Adjudicator: hold disposition at 0; list falsifier.'
    r.actionOverride = 'Write dispositive memo: hold at 0 until falsifier or confirmer primary lands.'
  }
  if (ctx.original === 1 && ctx.material === 'assumption') {
    r = demoteToZero(r, 'Adjudicator: assumption cannot sustain +1 disposition', 38)
  }
  if (ctx.original === -1) {
    r.findingNote = 'Adjudicator: reject disposition — −1 sustained pending overturn.'
    r.confidence = Math.max(r.confidence, 84)
  }
  return r
}

const valuesAlignment = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = { ...base, gaps: [...base.gaps] }
  const text = hay(ctx)
  if (hasAny(text, ['evenhand', 'both sides', 'balanced', 'neutral', 'soft language', 'nuance theater'])) {
    r.gaps.push('Values alignment: soft-language / evenhand tags — check asymmetric stack')
    r.findingNote = 'Values Alignment: reject forced evenhandedness when stack is asymmetric.'
    if (ctx.original === 1 && ctx.relevance >= 45) {
      r.confidence = Math.max(30, r.confidence - 12)
    }
  }
  if (ctx.original === 1 && isWeakMaterial(ctx.material)) {
    r = demoteToZero(r, 'Values alignment: weak material +1 demoted for integrity check', 40)
  }
  if (ctx.original === -1) {
    r.gaps.push('Values alignment: material −1 must not be softened in summary language')
  }
  return r
}

const antiPattern = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = { ...base, gaps: [...base.gaps] }
  const text = hay(ctx)
  if (hasAny(text, ['not untrue', 'cannot disprove', 'both sides', 'double negative', 'no evidence either way'])) {
    r.gaps.push('Anti-pattern: double-negative / both-sides theater detected')
    r.findingNote = 'Anti-Pattern Scout: rhetorical theater patterns present.'
    if (ctx.original === 1) {
      r = demoteToZero(r, 'Anti-pattern: theater language demotes unsupported +1', 36)
    }
  }
  if (ctx.original === 1 && ctx.material === 'secondary' && hasAny(text, ['alleged', 'rumored', 'reportedly'])) {
    r = demoteToZero(r, 'Anti-pattern: hedged secondary cannot carry clean +1', 40)
  }
  if (ctx.original === 0) {
    r.findingNote = 'Anti-pattern desk: contested score is honest — do not force balance theater.'
  }
  return r
}

// ── Public records family ─────────────────────────────────────────────

const publicRecords = (ctx: RuleCtx, base: RuleResult): RuleResult =>
  requirePrimaryForPlusOne(ctx, base, 'Public records', ['record', 'filing', 'docket', 'archive', 'minutes', 'foia'])

const foia = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = requirePrimaryForPlusOne(ctx, base, 'FOIA', ['foia', 'foia request', 'production', 'withhold', 'exemption', 'redact'])
  const text = hay(ctx)
  if (hasAny(text, ['foia', 'production', 'exemption']) && ctx.original === 0) {
    r.gaps.push('FOIA: document request status and exemption claims before disposition')
    r.findingNote = 'FOIA Analyst: track production timeline and withhold codes.'
  }
  if (ctx.original === 1 && !hasAny(text, ['foia', 'production', 'record', 'agency']) && ctx.material !== 'primary') {
    r = demoteToZero(r, 'FOIA: +1 without FOIA/production trail signals', 40)
  }
  return r
}

const meetingMinutes = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = requirePrimaryForPlusOne(ctx, base, 'Minutes', ['minutes', 'agenda', 'motion', 'vote', 'quorum', 'transcript'])
  if (ctx.original === 1 && !hasAny(hay(ctx), ['minutes', 'agenda', 'motion', 'vote']) && ctx.material !== 'primary') {
    r = demoteToZero(r, 'Minutes: +1 needs minutes/agenda/vote trail', 40)
  }
  if (ctx.original === 0) {
    r.gaps.push('Minutes: pull certified minutes before locking disposition')
  }
  return r
}

const permitPathway = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = requirePrimaryForPlusOne(ctx, base, 'Permit pathway', ['permit', 'license', 'variance', 'zoning', 'application', 'approval'])
  if (ctx.original === 1 && hasAny(hay(ctx), ['permit', 'variance', 'license'])) {
    r.confidence = Math.min(95, r.confidence + 8)
    r.findingNote = (r.findingNote ? r.findingNote + ' ' : '') + 'Permit signals aligned.'
  }
  if (ctx.original === -1) {
    r.gaps.push('Permit pathway: −1 may indicate denial/stop-work — confirm official status')
  }
  return r
}

const constructionOversight = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = requirePrimaryForPlusOne(ctx, base, 'Construction oversight', [
    'inspection',
    'stop-work',
    'contractor',
    'change order',
    'punch list',
    'bid',
  ])
  if (ctx.original === 1 && isSocialOnly(hay(ctx), ctx.material)) {
    r = demoteToZero(r, 'Construction: social-only site claims demoted', 36)
  }
  return r
}

const contractForensics = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = requirePrimaryForPlusOne(ctx, base, 'Contract forensics', [
    'contract',
    'bid',
    'rfp',
    'award',
    'vendor',
    'clause',
    'amendment',
  ])
  if (ctx.original === 1 && ctx.material === 'assumption') {
    r = demoteToZero(r, 'Contract forensics: assumption cannot prove contract terms', 35)
  }
  return r
}

const correspondence = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = requirePrimaryForPlusOne(ctx, base, 'Correspondence', [
    'email',
    'letter',
    'memo',
    'correspondence',
    'reply',
    'thread',
  ])
  if (ctx.original === 1 && hasAny(hay(ctx), ['email', 'letter', 'memo']) && ctx.material === 'primary') {
    r.findingNote = 'Correspondence: primary thread material supports disposition.'
  }
  if (ctx.original === 0) {
    r.gaps.push('Correspondence: need full thread + authenticity check')
  }
  return r
}

// ── Jurisdiction family ───────────────────────────────────────────────

const jurisdictionOps = (ctx: RuleCtx, base: RuleResult): RuleResult =>
  jurisdictionAuthority(ctx, base, 'Jurisdiction ops')

const regulatoryRouting = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = jurisdictionAuthority(ctx, base, 'Regulatory routing')
  const text = hay(ctx)
  if (hasAny(text, ['route', 'referral', 'docket', 'agency']) && ctx.original === 1) {
    r.confidence = Math.min(95, r.confidence + 5)
    r.findingNote = (r.findingNote ? r.findingNote + ' ' : '') + 'Routing signals present.'
  }
  if (ctx.original === 0) {
    r.gaps.push('Regulatory routing: map which desk owns the next official act')
  }
  return r
}

const multiJurisdiction = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = jurisdictionAuthority(ctx, base, 'Multi-jurisdiction')
  const text = hay(ctx)
  if (hasAny(text, ['multi', 'conflict', 'overlap', 'concurrent', 'preempt', 'forum']) || ctx.tags.some((t) => t.includes('multi'))) {
    if (ctx.original === 1) {
      r = demoteToZero(
        r,
        'Multi-jurisdiction: conflict tags → 0 until routing clear',
        40,
        'Multi-J: concurrent authority not yet resolved.',
      )
    } else {
      r.gaps.push('Multi-jurisdiction: document conflicting authorities before promote')
      r.findingNote = 'Multi-J desk: hold until conflict map is explicit.'
    }
  }
  return r
}

const stateOnboarding = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = jurisdictionAuthority(ctx, base, 'State onboarding')
  if (ctx.original === 1 && !hasAny(hay(ctx), ['state', 'statute', 'code', 'agency', 'department', 'playbook'])) {
    r.confidence = Math.max(28, r.confidence - 15)
    r.gaps.push('State onboarding: missing state-level playbook signals')
    r.findingNote = 'State playbook: claim lacks state-system anchors.'
  }
  return r
}

const adminLaw = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = jurisdictionAuthority(ctx, base, 'Admin law')
  const text = hay(ctx)
  if (ctx.original === 1 && !hasAny(text, ['rule', 'hearing', 'notice', 'order', 'appeal', 'apa', 'administrative'])) {
    r = demoteToZero(
      r,
      'Admin law: +1 without admin-process anchors held at 0',
      40,
      'Admin Law: need notice/hearing/order trail.',
    )
  }
  if (ctx.original === -1) {
    r.gaps.push('Admin law: −1 may reflect final order — confirm appeal window')
  }
  return r
}

const crossBorder = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = jurisdictionAuthority(ctx, base, 'Cross-border')
  const text = hay(ctx)
  if (hasAny(text, ['border', 'treaty', 'interstate', 'international', 'extraterritorial', 'comity'])) {
    r.findingNote = 'Cross-border: transnational/interstate hooks present.'
    if (ctx.original === 1 && isWeakMaterial(ctx.material)) {
      r = demoteToZero(r, 'Cross-border: weak material cannot clear multi-sovereign claims', 38)
    }
  } else if (ctx.original === 1) {
    r.confidence = Math.max(30, r.confidence - 12)
    r.gaps.push('Cross-border: no cross-border markers — verify desk fit')
  }
  return r
}

const legislativeIntent = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = { ...base, gaps: [...base.gaps] }
  const text = hay(ctx)
  if (ctx.original === 1 && !hasAny(text, ['statute', 'bill', 'legislative', 'intent', 'committee', 'hearing', 'code section'])) {
    r = demoteToZero(
      r,
      'Legislative intent: +1 without statute/bill anchors demoted',
      40,
      'Legislative Intent: cite bill/section or floor history.',
    )
  } else if (hasAny(text, ['intent', 'legislative history', 'committee'])) {
    r.findingNote = 'Legislative intent signals engaged.'
    r.confidence = Math.min(95, r.confidence + 6)
  }
  if (ctx.original === 0) {
    r.gaps.push('Legislative intent: pull committee report before disposition')
  }
  return r
}

// ── Oversight family ──────────────────────────────────────────────────

const oversightKit = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = { ...base, gaps: [...base.gaps] }
  if (ctx.original === 1 && isWeakMaterial(ctx.material)) {
    r = demoteToZero(r, 'Oversight kit: allegation/weak material cannot stand as +1', 38)
  }
  if (ctx.original === 1 && ctx.material !== 'primary' && ctx.material !== 'secondary') {
    r.gaps.push('Oversight: need document trail for accountability claim')
  }
  if (ctx.original === -1) {
    r.confidence = Math.max(r.confidence, 80)
    r.findingNote = 'Oversight kit: −1 accountability claim is material — do not bury.'
  }
  if (ctx.original === 0) {
    r.gaps.push('Oversight kit: map accountable office and controlling record')
  }
  return r
}

const influenceMap = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = { ...base, gaps: [...base.gaps] }
  const text = hay(ctx)
  if (ctx.original === 1 && !hasAny(text, ['lobby', 'donor', 'influence', 'pac', 'relationship', 'network', 'disclosure'])) {
    r.confidence = Math.max(28, r.confidence - 14)
    r.gaps.push('Influence map: missing network/disclosure anchors')
    r.findingNote = 'Influence Map: claim lacks influence-graph hooks.'
  }
  if (ctx.original === 1 && isWeakMaterial(ctx.material)) {
    r = demoteToZero(r, 'Influence map: +1 allegation without record demoted', 36)
  }
  return r
}

const procurementEthics = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = { ...base, gaps: [...base.gaps] }
  const text = hay(ctx)
  if (ctx.original === 1 && isWeakMaterial(ctx.material)) {
    r = demoteToZero(
      r,
      'Procurement ethics: +1 on allegation without record → 0',
      35,
      'Procurement Ethics: need bid/award/ethics filing.',
    )
  }
  if (hasAny(text, ['bid', 'rfp', 'award', 'sole source', 'vendor', 'procurement']) && ctx.original === 1 && ctx.material === 'primary') {
    r.confidence = Math.min(95, r.confidence + 10)
    r.findingNote = 'Procurement ethics: primary procurement trail supports read.'
  }
  if (ctx.original === 0) {
    r.gaps.push('Procurement: pull solicitation and award docs')
  }
  return r
}

const coi = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = { ...base, gaps: [...base.gaps] }
  if (ctx.original === 1 && isWeakMaterial(ctx.material)) {
    r = demoteToZero(r, 'COI: +1 allegation without disclosure/record → 0', 35)
  }
  if (ctx.original === 1 && !hasAny(hay(ctx), ['conflict', 'coi', 'disclosure', 'recusal', 'interest', 'gift'])) {
    r.confidence = Math.max(30, r.confidence - 12)
    r.gaps.push('COI: name the conflicted interest and disclosure status')
    r.findingNote = 'COI desk: interest not yet particularized.'
  }
  if (ctx.original === -1) {
    r.gaps.push('COI: −1 may indicate undisclosed conflict — escalate carefully')
  }
  return r
}

const whistleblower = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = { ...base, gaps: [...base.gaps] }
  r.gaps.push('Whistleblower: protect source identity; avoid re-identification in notes')
  r.findingNote = 'Whistleblower Protections: source-safety gaps always active.'
  if (ctx.original === 1 && isWeakMaterial(ctx.material)) {
    r = demoteToZero(
      r,
      'Whistleblower: corroborate before +1; protect source while seeking records',
      40,
      'Whistleblower: allegation held at 0 pending independent record.',
      'Corroborate via non-source records; never publish source-identifying detail.',
    )
  }
  if (ctx.original === -1) {
    r.confidence = Math.max(r.confidence, 78)
    r.actionOverride = 'Document retaliation/risk; keep source protected while clearing −1 via records.'
  }
  return r
}

const fiscalTransparency = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = { ...base, gaps: [...base.gaps] }
  if (ctx.original === 1 && ctx.material !== 'primary' && ctx.material !== 'secondary') {
    r = demoteToZero(
      r,
      'Fiscal transparency: +1 needs document trail (budget/spend/audit)',
      38,
      'Fiscal desk: no spend trail for +1.',
    )
  }
  if (hasAny(hay(ctx), ['budget', 'expenditure', 'audit', 'appropriation', 'spend', 'invoice']) && ctx.original === 1) {
    r.confidence = Math.min(95, r.confidence + 8)
    r.findingNote = 'Fiscal transparency: money-trail tags present.'
  }
  if (ctx.original === 0) {
    r.gaps.push('Fiscal: attach ledger line / budget page cite')
  }
  return r
}

const civicCoordinator = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = { ...base, gaps: [...base.gaps] }
  const text = hay(ctx)
  if (ctx.original === 1 && !hasAny(text, ['stakeholder', 'public', 'meeting', 'comment', 'outreach', 'hearing', 'notice'])) {
    r.confidence = Math.max(30, r.confidence - 10)
    r.gaps.push('Civic coordinator: missing public-process / stakeholder anchors')
    r.findingNote = 'Civic Coordinator: process participation trail incomplete.'
  }
  if (ctx.original === 1 && isWeakMaterial(ctx.material)) {
    r = demoteToZero(r, 'Civic coordinator: weak material demoted for process claims', 40)
  }
  return r
}

// ── Sector regulatory ─────────────────────────────────────────────────

const environmental = (ctx: RuleCtx, base: RuleResult): RuleResult =>
  sectorTagMatch(ctx, base, ['environment', 'epa', 'pollution', 'wetland', 'emission', 'cleanup', 'habitat', 'nepa'], 'Environmental')

const publicHealth = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = sectorTagMatch(ctx, base, ['health', 'cdc', 'outbreak', 'clinic', 'epidemi', 'vaccine', 'mortality', 'morbidity'], 'Public health')
  if (ctx.original === 1 && isWeakMaterial(ctx.material)) {
    r = demoteToZero(r, 'Public health: high-impact health claims need stronger material', 36)
  }
  return r
}

const transportSafety = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = sectorTagMatch(ctx, base, ['transport', 'traffic', 'nhtsa', 'faa', 'rail', 'crash', 'safety', 'ntsb'], 'Transport safety')
  if (ctx.original === -1) {
    r.confidence = Math.max(r.confidence, 82)
    r.gaps.push('Transport safety: −1 may imply unsafe condition — escalate ops risk')
  }
  return r
}

const landUse = (ctx: RuleCtx, base: RuleResult): RuleResult =>
  sectorTagMatch(ctx, base, ['zoning', 'land use', 'parcel', 'variance', 'comprehensive plan', 'setback', 'rezoning'], 'Land use')

const assessor = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = sectorTagMatch(ctx, base, ['assess', 'appraisal', 'millage', 'property tax', 'valuation', 'parcel', 'levy'], 'Assessor')
  if (ctx.original === 1 && ctx.material === 'assumption') {
    r = demoteToZero(r, 'Assessor: valuation claims need roll/appraisal record', 38)
  }
  return r
}

const emergencyGov = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = sectorTagMatch(ctx, base, ['emergency', 'fema', 'disaster', 'eoc', 'evacuation', 'declaration', 'ics'], 'Emergency gov')
  if (ctx.lens.highStakes && ctx.original === 1 && ctx.material !== 'primary') {
    r = demoteToZero(r, 'Emergency gov: high-stakes strict — non-primary +1 demoted', 34)
  }
  if (ctx.original === -1) {
    r.confidence = Math.max(r.confidence, 88)
    r.actionOverride = 'Emergency desk: treat −1 as operational risk until official status clears.'
  }
  return r
}

const electionAdmin = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = sectorTagMatch(ctx, base, ['election', 'ballot', 'canvass', 'poll', 'certif', 'voter', 'clerk'], 'Election admin')
  if (ctx.lens.highStakes && ctx.original === 1 && isWeakMaterial(ctx.material)) {
    r = demoteToZero(r, 'Election admin: high-stakes strict demotion of weak +1', 32)
  }
  if (ctx.original === 1 && isSocialOnly(hay(ctx), ctx.material)) {
    r = demoteToZero(r, 'Election admin: social/rumor pathway demoted', 30)
  }
  if (ctx.original === -1) {
    r.confidence = Math.max(r.confidence, 90)
    r.gaps.push('Election admin: −1 is high-stakes — primary official source required')
  }
  return r
}

const privacyData = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = sectorTagMatch(ctx, base, ['privacy', 'pii', 'gdpr', 'hipaa', 'data', 'retention', 'breach', 'ssn'], 'Privacy/data')
  const text = hay(ctx)
  if (hasAny(text, ['pii', 'ssn', 'dob', 'address list', 'medical', 'breach', 'personal data'])) {
    r.gaps.push('Privacy: PII risk — minimize identifiers in working notes and exports')
    r.findingNote = 'Privacy/Data: PII exposure risk flagged.'
    r.actionOverride = 'Redact PII; confirm lawful basis before any publish/export.'
  }
  if (ctx.original === 1 && isWeakMaterial(ctx.material)) {
    r = demoteToZero(r, 'Privacy: weak material cannot clear data-handling claims as +1', 38)
  }
  return r
}

// ── Method & process ──────────────────────────────────────────────────

const auditLadder = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = { ...base, gaps: [...base.gaps] }
  if (ctx.original === 1 && isWeakMaterial(ctx.material)) {
    r = demoteToZero(r, 'Audit ladder: cannot climb levels on assumption-class +1', 40)
  }
  if (ctx.original === 0) {
    r.gaps.push('Audit ladder: specify ladder level and exit criteria for this claim')
    r.findingNote = 'Audit Ladder: level-style gap — define L0–L3 exit for claim.'
  }
  if (ctx.original === -1) {
    r.gaps.push('Audit ladder: −1 blocks advancement past current level')
    r.confidence = Math.max(r.confidence, 82)
    r.findingNote = 'Audit Ladder: −1 freezes ladder advance on this branch.'
  }
  if (ctx.original === 1 && ctx.material === 'primary') {
    r.findingNote = 'Audit ladder: primary support may satisfy current level gate.'
    r.confidence = Math.min(95, r.confidence + 6)
  }
  return r
}

const verificationPlaybook = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = { ...base, gaps: [...base.gaps] }
  const text = hay(ctx)
  const corroborationHints = ['corroborat', 'confirm', 'second source', 'independent', 'cross-check']
  if (ctx.original === 1 && !hasAny(text, corroborationHints) && ctx.material !== 'primary') {
    r = demoteToZero(
      r,
      'Verification playbook: demand corroboration count — +1 demoted without multi-source signal',
      40,
      'Verification: need ≥2 independent paths for promote.',
      'Log corroboration count; pull second independent source.',
    )
  } else if (ctx.original === 1 && hasAny(text, corroborationHints)) {
    r.confidence = Math.min(95, r.confidence + 10)
    r.findingNote = 'Verification playbook: corroboration language present.'
  }
  if (ctx.original === 0) {
    r.gaps.push('Verification playbook: list corroboration steps and owners')
  }
  if (ctx.original === -1) {
    r.gaps.push('Verification: −1 requires documented overturn path')
  }
  return r
}

const sourceHierarchy = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = { ...base, gaps: [...base.gaps] }
  const text = hay(ctx)
  if (ctx.original === 1 && (isSocialOnly(text, ctx.material) || hasAny(text, ['rumor', 'secondary only', 'hearsay', 'anonymous']))) {
    r = demoteToZero(
      r,
      'Source hierarchy: social/secondary/rumor tags demote +1 → 0',
      34,
      'Source Hierarchy: lower-tier sources cannot carry +1 alone.',
      'Replace with primary official record before promote.',
    )
  }
  if (ctx.material === 'primary' && ctx.original === 1) {
    r.confidence = Math.min(95, r.confidence + 12)
    r.findingNote = 'Source hierarchy: primary material boosts confidence.'
  }
  if (ctx.material === 'secondary' && ctx.original === 1 && ctx.relevance < 55) {
    r = demoteToZero(r, 'Source hierarchy: low-relevance secondary +1 held at 0', 40)
  }
  if (ctx.original === -1) {
    r.confidence = Math.max(r.confidence, 80)
    r.gaps.push('Source hierarchy: −1 stands until higher-tier source overturns')
  }
  return r
}

const exportClearance = (ctx: RuleCtx, base: RuleResult): RuleResult => {
  let r = { ...base, gaps: [...base.gaps] }
  if (ctx.original === -1) {
    r.score = -1
    r.confidence = Math.max(r.confidence, 90)
    r.gaps.push('Export clearance: any −1 → high-confidence hold on publish package')
    r.findingNote = 'Export Clearance: −1 blocks package promotion language.'
    r.actionOverride =
      'HOLD export/publish. Do not use promotion language. Clear −1 or document Layer-0 override.'
  }
  if (ctx.original === 1 && isWeakMaterial(ctx.material)) {
    r = demoteToZero(
      r,
      'Export clearance: weak material cannot ship as +1 in package',
      36,
      'Export Clearance: demote until primary cite attached.',
    )
  }
  if (ctx.original === 0) {
    r.gaps.push('Export clearance: contested claims must not be framed as established in export')
    r.findingNote = 'Export Clearance: 0 stays 0 in outbound package language.'
  }
  if (ctx.original === 1 && ctx.material === 'primary') {
    r.findingNote = 'Export clearance: primary +1 eligible subject to package gates.'
  }
  return r
}

// ── Technical / reasoning family ──────────────────────────────────────

const METHOD_TAGS = [
  'measurement',
  'measure',
  'method',
  'test',
  'experiment',
  'protocol',
  'instrument',
  'calibration',
  'sensor',
  'meter',
  'survey',
  'scope',
  'metrology',
  'validation',
  'verification',
  'simulation',
  'model',
  'calculation',
  'calc',
  'analysis',
]

const IMPOSSIBILITY_TAGS = [
  'impossible',
  'perpetual',
  'free energy',
  'violates',
  'violation of',
  'always safe',
  'never fails',
  'zero risk',
  '100% certain',
  'guaranteed safe',
  'cannot fail',
  'frictionless',
  'lossless forever',
]

const RHETORIC_TAGS = [
  'motive',
  'viral',
  'rumor',
  'narrative',
  'both sides',
  'obviously',
  'everyone knows',
  'common sense only',
  'rhetoric',
  'smear',
]

const SAFETY_ENGINEERING_TAGS = [
  'safety factor',
  'factor of safety',
  'failure mode',
  'fmea',
  'standard',
  'code',
  'asme',
  'ieee',
  'iso',
  'margin',
  'allowable',
  'design basis',
  'sil',
  'lopa',
  'interlock',
]

function boostMeasurementPrimary(ctx: RuleCtx, base: RuleResult, label: string): RuleResult {
  let r = { ...base, gaps: [...base.gaps] }
  const text = hay(ctx)
  const methodish = hasAny(text, METHOD_TAGS) || ctx.tags.some((t) => METHOD_TAGS.some((m) => t.toLowerCase().includes(m)))
  if (ctx.material === 'primary' && methodish && r.score !== -1) {
    r.confidence = Math.min(95, r.confidence + 12)
    r.findingNote = (r.findingNote ? r.findingNote + ' ' : '') + `${label}: primary + method/measurement boost.`
  } else if (ctx.material === 'primary' && r.score === 1) {
    r.confidence = Math.min(95, r.confidence + 6)
    r.findingNote = (r.findingNote ? r.findingNote + ' ' : '') + `${label}: primary material present.`
  }
  return r
}

/** Engineering: demand failure mode / safety factor / standard; demote impossibility without method */
function engineeringRule(
  label: string,
  domainTags: string[],
  opts?: { highStakesDefault?: boolean },
): (ctx: RuleCtx, base: RuleResult) => RuleResult {
  return (ctx, base) => {
    let r = sectorTagMatch(ctx, base, domainTags, label)
    r = boostMeasurementPrimary(ctx, r, label)
    const text = hay(ctx)
    if (ctx.original === 1 && hasAny(text, IMPOSSIBILITY_TAGS) && !hasAny(text, METHOD_TAGS)) {
      r = demoteToZero(
        r,
        `${label}: physical impossibility / absolute-safety claim without measurement/method → 0`,
        34,
        `${label}: absolute claim lacks method tags.`,
        `Attach measurement method or demote narrative absolute to contested.`,
      )
    }
    if (
      ctx.original === 1 &&
      (ctx.lens.highStakes || opts?.highStakesDefault) &&
      !hasAny(text, SAFETY_ENGINEERING_TAGS) &&
      !hasAny(text, METHOD_TAGS) &&
      isWeakMaterial(ctx.material)
    ) {
      r = demoteToZero(
        r,
        `${label}: engineering risk claim lacks failure mode / safety factor / standard / method`,
        36,
        `${label}: demand failure mode or standard reference.`,
        `Name failure mode, safety factor, or applicable standard before +1.`,
      )
    } else if (ctx.original === 1 && !hasAny(text, SAFETY_ENGINEERING_TAGS) && ctx.relevance >= 45 && isWeakMaterial(ctx.material)) {
      r.confidence = Math.max(28, r.confidence - 14)
      r.gaps.push(`${label}: missing failure-mode / standard anchors on weak material`)
    }
    if (hasAny(text, SAFETY_ENGINEERING_TAGS) && ctx.original === 1 && ctx.material === 'primary') {
      r.confidence = Math.min(95, r.confidence + 8)
      r.findingNote = (r.findingNote ? r.findingNote + ' ' : '') + `${label}: safety/standard language with primary.`
    }
    if (ctx.original === 1 && isSocialOnly(text, ctx.material)) {
      r = demoteToZero(r, `${label}: social/rumor pathway cannot carry technical +1`, 36)
    }
    return r
  }
}

/** Math/physics: demote rhetoric/motive; demand model assumptions */
function theoryRule(
  label: string,
  domainTags: string[],
  extra?: { demoteImpossibility?: boolean },
): (ctx: RuleCtx, base: RuleResult) => RuleResult {
  return (ctx, base) => {
    let r = sectorTagMatch(ctx, base, domainTags, label)
    r = boostMeasurementPrimary(ctx, r, label)
    const text = hay(ctx)
    if (ctx.original === 1 && hasAny(text, RHETORIC_TAGS)) {
      r = demoteToZero(
        r,
        `${label}: rhetoric/motive/viral language demotes +1 → 0`,
        34,
        `${label}: non-model rhetoric cannot sustain technical +1.`,
        `Rewrite as model assumption + observable; drop motive language.`,
      )
    }
    if (ctx.original === 1 && !hasAny(text, [...METHOD_TAGS, 'assumption', 'equation', 'model', 'proof', 'derivation', 'theorem', 'distribution', 'sample'])) {
      if (isWeakMaterial(ctx.material) || ctx.material === 'secondary') {
        r = demoteToZero(
          r,
          `${label}: +1 without model assumptions / method / formal statement held at 0`,
          38,
          `${label}: demand model assumptions or formal claim statement.`,
        )
      } else {
        r.confidence = Math.max(30, r.confidence - 12)
        r.gaps.push(`${label}: state model assumptions, equations, or proof obligations`)
      }
    }
    if ((extra?.demoteImpossibility ?? true) && ctx.original === 1 && hasAny(text, IMPOSSIBILITY_TAGS) && !hasAny(text, METHOD_TAGS)) {
      r = demoteToZero(
        r,
        `${label}: impossibility claim without measurement/method → 0`,
        32,
        `${label}: extraordinary physical claim needs method.`,
      )
    }
    if (ctx.original === 0) {
      r.gaps.push(`${label}: contested — list assumptions, domain of validity, and falsifier`)
    }
    return r
  }
}

const techStatics = engineeringRule('Statics/Dynamics', ['static', 'dynamic', 'force', 'moment', 'fbd', 'equilibrium', 'load', 'torque'])
const techMachine = engineeringRule('Machine design', ['stress', 'fatigue', 'shaft', 'bearing', 'gear', 'safety factor', 'yield'], { highStakesDefault: true })
/**
 * WP4 (1.2.1): dimensionless / regime discipline for fluid-thermal-flight claims.
 * Demotes absolute +1 that cite numbers without Re/Ma/Nu/FoS-style anchors on weak material.
 */
const DIMENSIONLESS_TAGS = [
  'reynolds',
  'mach',
  'nusselt',
  'prandtl',
  'froude',
  'knudsen',
  'dimensionless',
  'regime',
  'laminar',
  'turbulent',
  'compressib',
  'incompressib',
  'safety factor',
  'margin',
  'nondimensional',
]

function withDimensionlessRegime(
  baseRule: (ctx: RuleCtx, base: RuleResult) => RuleResult,
  label: string,
): (ctx: RuleCtx, base: RuleResult) => RuleResult {
  return (ctx, base) => {
    let r = baseRule(ctx, base)
    const text = hay(ctx)
    const hasNum = /\d/.test(text)
    const hasRegime = hasAny(text, DIMENSIONLESS_TAGS) || hasAny(text, METHOD_TAGS)
    if (
      ctx.original === 1 &&
      hasNum &&
      !hasRegime &&
      isWeakMaterial(ctx.material) &&
      r.score === 1
    ) {
      r = demoteToZero(
        r,
        `${label}: numeric claim without dimensionless regime / method anchors → 0`,
        35,
        `${label}: state Re/Ma/Nu (or equivalent regime) before promoting magnitudes.`,
        `Add regime (e.g. Reynolds/Mach) or measurement method; otherwise hold at 0.`,
      )
    } else if (ctx.original === 1 && hasRegime && ctx.material === 'primary' && r.score !== -1) {
      r.confidence = Math.min(95, r.confidence + 6)
      r.findingNote =
        (r.findingNote ? r.findingNote + ' ' : '') +
        `${label}: dimensionless/regime language with primary.`
    }
    return r
  }
}

const techThermofluids = withDimensionlessRegime(
  engineeringRule('Thermofluids', ['heat', 'fluid', 'flow', 'convection', 'pressure', 'reynolds', 'cfd', 'enthalpy']),
  'Thermofluids',
)
const techHvac = engineeringRule('HVAC/Thermal', ['hvac', 'thermal', 'cooling', 'heating', 'load calc', 'cfm', 'setpoint'])
const techVibration = engineeringRule('Vibration/Acoustics', ['vibration', 'modal', 'resonance', 'noise', 'acoustic', 'spectrum', 'db'])
const techRobotics = engineeringRule('Robotics/Mechatronics', ['robot', 'mechatronic', 'actuator', 'servo', 'kinematics', 'payload'], { highStakesDefault: true })
const techStructural = engineeringRule('Structural', ['structural', 'beam', 'column', 'load path', 'capacity', 'lrfd', 'seismic'], { highStakesDefault: true })
const techGeotech = engineeringRule('Geotech', ['geotech', 'soil', 'foundation', 'bearing', 'settlement', 'boring', 'pile'])
const techTransport = engineeringRule('Transport infra', ['highway', 'bridge', 'transit', 'traffic', 'capacity', 'corridor', 'pavement'])
const techWater = engineeringRule('Water resources', ['hydrology', 'flood', 'hydraulic', 'watershed', 'runoff', 'discharge'], { highStakesDefault: true })
const techPower = engineeringRule('Power systems', ['power', 'grid', 'voltage', 'fault', 'relay', 'outage', 'transformer'], { highStakesDefault: true })
const techElectronics = engineeringRule('Electronics/Embedded', ['pcb', 'mcu', 'firmware', 'embedded', 'schematic', 'adc', 'emc'])
const techRf = engineeringRule('RF/Comms', ['rf', 'antenna', 'link budget', 'spectrum', 'snr', 'interference', 'path loss'])
const techControls = engineeringRule('Controls', ['control', 'pid', 'plc', 'dcs', 'loop', 'interlock', 'scada'], { highStakesDefault: true })
const techSemi = engineeringRule('Semiconductor', ['semiconductor', 'transistor', 'wafer', 'node', 'yield', 'fab', 'lithography'])
const techProcess = engineeringRule('Chem process', ['process', 'pfd', 'material balance', 'unit operation', 'throughput', 'yield'])
const techReaction = engineeringRule('Reaction eng', ['kinetics', 'reaction', 'conversion', 'selectivity', 'catalyst', 'reactor'])
const techLopa = engineeringRule('Process safety/LOPA', ['lopa', 'hazop', 'sis', 'psm', 'relief', 'ipl', 'sil'], { highStakesDefault: true })
const techFlight = withDimensionlessRegime(
  engineeringRule('Flight mech', ['flight', 'aero', 'lift', 'drag', 'stability', 'envelope', 'mach'], {
    highStakesDefault: true,
  }),
  'Flight mech',
)
const techPropulsion = engineeringRule('Propulsion', ['thrust', 'isp', 'propulsion', 'engine', 'turbine', 'nozzle', 'combustion'])
const techAvionics = engineeringRule('Avionics/cert tech', ['avionics', 'certification', 'do-178', 'do-254', 'dal', 'airworthiness'], { highStakesDefault: true })
const techMetallurgy = engineeringRule('Metallurgy', ['metallurgy', 'alloy', 'heat treat', 'microstructure', 'hardness', 'tensile', 'fracture'])
const techComposites = engineeringRule('Composites', ['composite', 'laminate', 'fiber', 'resin', 'cure', 'delamination', 'ndi'])
const techMfg = engineeringRule('Manufacturing', ['manufacturing', 'process capability', 'cpk', 'tooling', 'spc', 'cycle time'])
const techQuality = engineeringRule('Quality/Reliability', ['quality', 'reliability', 'mtbf', 'dppm', 'six sigma', 'fmea', 'defect'])
const techGrid = engineeringRule('Grid/Energy', ['grid', 'energy', 'adequacy', 'renewable', 'storage', 'dispatch', 'interconnection'])
const techPetroleum = engineeringRule('Petroleum subsurface', ['reservoir', 'petroleum', 'production', 'well', 'porosity', 'decline', 'subsurface'])
const techNuclear = engineeringRule('Nuclear systems', ['nuclear', 'reactor', 'dose', 'coolant', 'criticality', 'radiological', 'design basis'], {
  highStakesDefault: true,
})
const techBioDevices = engineeringRule('Bio devices', ['device', 'biomedical', 'verification', 'validation', 'biocompatibility', 'implant'], { highStakesDefault: true })
const techBiomechanics = engineeringRule('Biomechanics', ['biomechanics', 'kinematics', 'kinetics', 'joint', 'gait', 'strain', 'ergonomics'])
const techPhysio = theoryRule('Physio systems', ['physiology', 'pk', 'pd', 'compartment', 'homeostasis', 'parameter', 'model'])
const techArch = engineeringRule('Computer architecture', ['architecture', 'cpu', 'gpu', 'cache', 'benchmark', 'pipeline', 'latency'])
const techSoftware = engineeringRule('Software systems', ['software', 'correctness', 'concurrency', 'api', 'test', 'reliability'], { highStakesDefault: true })
const techCps = engineeringRule('Cyber-physical', ['cyber-physical', 'realtime', 'sensor', 'actuator', 'latency', 'sampling'], { highStakesDefault: true })
const techSignal = engineeringRule('Signal processing', ['signal', 'filter', 'fft', 'snr', 'estimation', 'detection', 'kalman'])
const techOptics = engineeringRule('Optics/Photonics', ['optics', 'photonics', 'laser', 'lens', 'mtf', 'wavelength', 'fiber', 'imaging'])
const techAppliedMath = theoryRule('Applied math', ['applied math', 'pde', 'ode', 'scaling', 'model', 'boundary condition', 'equation'])
const techPureMath = theoryRule('Pure math', ['proof', 'theorem', 'definition', 'lemma', 'axiom', 'logic', 'existence'])
const techProbability = theoryRule('Probability', ['probability', 'distribution', 'independence', 'expectation', 'bayes', 'random'])
const techStatistics = theoryRule('Statistics', ['statistics', 'inference', 'p-value', 'confidence', 'estimator', 'sample', 'regression', 'causal'])
const techOptimization = theoryRule('Optimization/OR', ['optimization', 'objective', 'constraint', 'solver', 'optimal', 'linear program'])
const techCompMath = theoryRule('Computational math', ['numerical', 'discretization', 'convergence', 'stability', 'error', 'finite element'])
const techInfoTheory = theoryRule('Information theory', ['entropy', 'mutual information', 'channel', 'coding', 'bits', 'rate'])
const techClassical = theoryRule('Classical mechanics', ['classical', 'lagrangian', 'hamiltonian', 'newton', 'constraint', 'momentum'])
const techEm = theoryRule('Electromagnetism', ['electromagnetism', 'maxwell', 'field', 'charge', 'magnetic', 'poynting'])
const techQuantum = theoryRule('Quantum mechanics', ['quantum', 'wavefunction', 'operator', 'measurement', 'spin', 'entanglement', 'hilbert'])
const techStatMech = theoryRule('Stat mech/Thermo', ['statistical mechanics', 'entropy', 'ensemble', 'partition function', 'temperature', 'thermo'])
const techRelativity = theoryRule('Relativity', ['relativity', 'lorentz', 'metric', 'spacetime', 'gravity', 'geodesic', 'redshift'])
const techCondensed = theoryRule('Condensed matter', ['condensed matter', 'band structure', 'phase', 'superconductor', 'phonon', 'magnetism'])
const techFluidPlasma = withDimensionlessRegime(
  theoryRule('Fluid/Plasma', ['fluid', 'turbulence', 'navier-stokes', 'plasma', 'reynolds', 'mach', 'mhd']),
  'Fluid/Plasma',
)

/** Complete registry — every SME_LENSES id must appear here. */
export const LENS_RULES: Record<string, (ctx: RuleCtx, base: RuleResult) => RuleResult> = {
  'sme-evidence-gate': evidenceGate,
  'sme-layer0-prefilter': layer0Prefilter,
  'sme-working-doc': workingDoc,
  'sme-narrative-integrity': narrativeIntegrity,
  'sme-claims-adjudicator': claimsAdjudicator,
  'sme-values-alignment': valuesAlignment,
  'sme-anti-pattern': antiPattern,
  'sme-public-records': publicRecords,
  'sme-foia': foia,
  'sme-meeting-minutes': meetingMinutes,
  'sme-permit-pathway': permitPathway,
  'sme-construction-oversight': constructionOversight,
  'sme-contract-forensics': contractForensics,
  'sme-correspondence': correspondence,
  'sme-jurisdiction-ops': jurisdictionOps,
  'sme-regulatory-routing': regulatoryRouting,
  'sme-multi-jurisdiction': multiJurisdiction,
  'sme-state-onboarding': stateOnboarding,
  'sme-admin-law': adminLaw,
  'sme-cross-border': crossBorder,
  'sme-legislative-intent': legislativeIntent,
  'sme-oversight-kit': oversightKit,
  'sme-influence-map': influenceMap,
  'sme-procurement-ethics': procurementEthics,
  'sme-coi': coi,
  'sme-whistleblower': whistleblower,
  'sme-fiscal-transparency': fiscalTransparency,
  'sme-civic-coordinator': civicCoordinator,
  'sme-environmental': environmental,
  'sme-public-health': publicHealth,
  'sme-transport-safety': transportSafety,
  'sme-land-use': landUse,
  'sme-assessor': assessor,
  'sme-emergency-gov': emergencyGov,
  'sme-election-admin': electionAdmin,
  'sme-privacy-data': privacyData,
  'sme-audit-ladder': auditLadder,
  'sme-verification-playbook': verificationPlaybook,
  'sme-source-hierarchy': sourceHierarchy,
  'sme-export-clearance': exportClearance,
  // Technical (50)
  'sme-mech-statics-dynamics': techStatics,
  'sme-mech-machine-design': techMachine,
  'sme-mech-thermofluids': techThermofluids,
  'sme-mech-hvac-thermal': techHvac,
  'sme-mech-vibration-acoustics': techVibration,
  'sme-mech-robotics-mechatronics': techRobotics,
  'sme-civil-structural': techStructural,
  'sme-civil-geotech': techGeotech,
  'sme-civil-transport-infra': techTransport,
  'sme-civil-water-resources': techWater,
  'sme-ee-power-systems': techPower,
  'sme-ee-electronics': techElectronics,
  'sme-ee-rf-comms': techRf,
  'sme-ee-controls': techControls,
  'sme-ee-semiconductor': techSemi,
  'sme-chem-process': techProcess,
  'sme-chem-reaction': techReaction,
  'sme-chem-safety-lopa': techLopa,
  'sme-aero-flight': techFlight,
  'sme-aero-propulsion': techPropulsion,
  'sme-aero-avionics': techAvionics,
  'sme-mat-metallurgy': techMetallurgy,
  'sme-mat-composites': techComposites,
  'sme-mfg-process': techMfg,
  'sme-mfg-quality-reliability': techQuality,
  'sme-energy-grid': techGrid,
  'sme-energy-petroleum': techPetroleum,
  'sme-nuclear-systems': techNuclear,
  'sme-bio-devices': techBioDevices,
  'sme-bio-biomechanics': techBiomechanics,
  'sme-bio-systems-physio': techPhysio,
  'sme-cps-architecture': techArch,
  'sme-cps-software-systems': techSoftware,
  'sme-cps-cyberphysical': techCps,
  'sme-cps-signal-processing': techSignal,
  'sme-cps-optics-photonics': techOptics,
  'sme-math-applied': techAppliedMath,
  'sme-math-pure': techPureMath,
  'sme-math-probability': techProbability,
  'sme-math-statistics': techStatistics,
  'sme-math-optimization': techOptimization,
  'sme-math-computational': techCompMath,
  'sme-math-info-theory': techInfoTheory,
  'sme-phys-classical': techClassical,
  'sme-phys-em': techEm,
  'sme-phys-quantum': techQuantum,
  'sme-phys-stat-mech': techStatMech,
  'sme-phys-relativity': techRelativity,
  'sme-phys-condensed': techCondensed,
  'sme-phys-fluid-plasma': techFluidPlasma,
  // -- 1.3.0 expansion (+90) --
  'sme-claim-chain-of-custody': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Chain Custody', ["custody","hash","provenance","exhibit","chain"]),
  'sme-conflict-calendar': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Conflict Cal', ["timeline","chronology","date","sequence","docket"]),
  'sme-attribution-hygiene': (ctx, base) => {
    let r = requirePrimaryForPlusOne(ctx, base, 'Attribution', ["attribution","quote","speaker","paraphrase","social"])
    const text = hay(ctx)
    if (ctx.original === 1 && isSocialOnly(text, ctx.material)) {
      r = demoteToZero(r, 'Attribution: social/rumor cannot carry +1', 36)
    }
    return r
  },
  'sme-redaction-gap': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Redaction', ["redaction","withhold","exemption","foia","production"]),
  'sme-multi-source-corroboration': (ctx, base) => {
    let r = requirePrimaryForPlusOne(ctx, base, 'Corroborate', ["corroborat","independent","echo","circular","wire"])
    const text = hay(ctx)
    if (ctx.original === 1 && isSocialOnly(text, ctx.material)) {
      r = demoteToZero(r, 'Corroborate: social/rumor cannot carry +1', 36)
    }
    return r
  },
  'sme-harm-escalation-gate': (ctx, base) => {
    let r = requirePrimaryForPlusOne(ctx, base, 'Harm Gate', ["harm","defamation","export","publish","layer-0"])
    const text = hay(ctx)
    if (ctx.original === -1 && (text.includes('export') || text.includes('publish') || text.includes('harm'))) {
      r.confidence = Math.max(r.confidence, 88)
      r.gaps.push('Harm Gate: high-stakes −1 — Layer-0 before export')
    }
    return r
  },
  'sme-decision-lock-auditor': (ctx, base) => {
    let r = requirePrimaryForPlusOne(ctx, base, 'Decision Lock', ["decision","lock","working","owner","wd"])
    const text = hay(ctx)
    if (ctx.original === 1 && !hasAny(text, ['decision', 'lock', 'working', 'wd', 'owner', 'timestamp', 'log'])) {
      if (isWeakMaterial(ctx.material)) r = demoteToZero(r, 'Decision Lock: decision lock claim lacks WD anchors', 40)
    }
    return r
  },
  'sme-docket-navigator': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Docket Nav', ["docket","filing","comment","rulemaking","notice"]),
  'sme-budget-line-forensics': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Budget Line', ["budget","appropriation","obligation","outlay","fiscal"]),
  'sme-hearing-transcript': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Hearing TX', ["hearing","transcript","testimony","witness","committee"]),
  'sme-license-registry': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'License Reg', ["license","credential","registry","suspension","scope"]),
  'sme-property-title-chain': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Title Chain', ["title","deed","lien","parcel","ownership"]),
  'sme-inspection-history': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Inspect Hist', ["inspection","violation","citation","code","reinspect"]),
  'sme-procurement-tabulation': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Bid Tabs', ["bid","tabulation","award","rfp","procurement"]),
  'sme-preemption-map': (ctx, base) => {
    let r = sectorTagMatch(ctx, base, ["preemption","savings","supremacy","conflict","field"], 'Preemption')
    r = requirePrimaryForPlusOne(ctx, r, 'Preemption', ["preemption","savings","supremacy","conflict","field"])
    const text = hay(ctx)
    if (ctx.original === 1 && !hasAny(text, ['statute', 'code', 'section', 'clause', 'docket', 'order', 'treaty', 'charter', 'rule']) && isWeakMaterial(ctx.material)) {
      r = demoteToZero(r, 'Preemption: jurisdiction claim lacks instrument anchors', 38)
    }
    return r
  },
  'sme-special-district': (ctx, base) => {
    let r = sectorTagMatch(ctx, base, ["special district","authority","levy","charter","board"], 'Spec District')
    r = requirePrimaryForPlusOne(ctx, r, 'Spec District', ["special district","authority","levy","charter","board"])
    const text = hay(ctx)
    if (ctx.original === 1 && !hasAny(text, ['statute', 'code', 'section', 'clause', 'docket', 'order', 'treaty', 'charter', 'rule']) && isWeakMaterial(ctx.material)) {
      r = demoteToZero(r, 'Spec District: jurisdiction claim lacks instrument anchors', 38)
    }
    return r
  },
  'sme-interlocal-agreement': (ctx, base) => {
    let r = sectorTagMatch(ctx, base, ["interlocal","mou","mutual aid","agreement","duty"], 'Interlocal')
    r = requirePrimaryForPlusOne(ctx, r, 'Interlocal', ["interlocal","mou","mutual aid","agreement","duty"])
    const text = hay(ctx)
    if (ctx.original === 1 && !hasAny(text, ['statute', 'code', 'section', 'clause', 'docket', 'order', 'treaty', 'charter', 'rule']) && isWeakMaterial(ctx.material)) {
      r = demoteToZero(r, 'Interlocal: jurisdiction claim lacks instrument anchors', 38)
    }
    return r
  },
  'sme-venue-standing': (ctx, base) => {
    let r = sectorTagMatch(ctx, base, ["venue","standing","court","forum","complaint"], 'Venue')
    r = requirePrimaryForPlusOne(ctx, r, 'Venue', ["venue","standing","court","forum","complaint"])
    const text = hay(ctx)
    if (ctx.original === 1 && !hasAny(text, ['statute', 'code', 'section', 'clause', 'docket', 'order', 'treaty', 'charter', 'rule']) && isWeakMaterial(ctx.material)) {
      r = demoteToZero(r, 'Venue: jurisdiction claim lacks instrument anchors', 38)
    }
    return r
  },
  'sme-tribal-federal': (ctx, base) => {
    let r = sectorTagMatch(ctx, base, ["tribal","treaty","trust","sovereign","compact"], 'Tribal Fed')
    r = requirePrimaryForPlusOne(ctx, r, 'Tribal Fed', ["tribal","treaty","trust","sovereign","compact"])
    const text = hay(ctx)
    if (ctx.original === 1 && !hasAny(text, ['statute', 'code', 'section', 'clause', 'docket', 'order', 'treaty', 'charter', 'rule']) && isWeakMaterial(ctx.material)) {
      r = demoteToZero(r, 'Tribal Fed: jurisdiction claim lacks instrument anchors', 38)
    }
    return r
  },
  'sme-extraterritorial': (ctx, base) => {
    let r = sectorTagMatch(ctx, base, ["extraterritorial","foreign","reach","export control","sanctions"], 'Extraterr.')
    r = requirePrimaryForPlusOne(ctx, r, 'Extraterr.', ["extraterritorial","foreign","reach","export control","sanctions"])
    const text = hay(ctx)
    if (ctx.original === 1 && !hasAny(text, ['statute', 'code', 'section', 'clause', 'docket', 'order', 'treaty', 'charter', 'rule']) && isWeakMaterial(ctx.material)) {
      r = demoteToZero(r, 'Extraterr.: jurisdiction claim lacks instrument anchors', 38)
    }
    return r
  },
  'sme-delegation-doctrine': (ctx, base) => {
    let r = sectorTagMatch(ctx, base, ["delegation","enabling","agency power","ultra vires","apa"], 'Delegation')
    r = requirePrimaryForPlusOne(ctx, r, 'Delegation', ["delegation","enabling","agency power","ultra vires","apa"])
    const text = hay(ctx)
    if (ctx.original === 1 && !hasAny(text, ['statute', 'code', 'section', 'clause', 'docket', 'order', 'treaty', 'charter', 'rule']) && isWeakMaterial(ctx.material)) {
      r = demoteToZero(r, 'Delegation: jurisdiction claim lacks instrument anchors', 38)
    }
    return r
  },
  'sme-inspector-general': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'IG Desk', ["ig","inspector general","finding","recommendation","audit"]),
  'sme-lobby-disclosure': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Lobby LD', ["lobby","lda","registrant","disclosure","influence"]),
  'sme-campaign-finance-edge': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Camp Fin', ["campaign","contribution","fec","pac","donor"]),
  'sme-revolving-door': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Rev Door', ["revolving door","cooling-off","ethics","post-employment"]),
  'sme-performance-audit': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Perf Audit', ["performance audit","efficiency","criteria","condition","gao"]),
  'sme-open-meetings': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Open Meet', ["open meetings","sunshine","notice","quorum","executive session"]),
  'sme-settlement-transparency': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Settlement', ["settlement","nda","judgment","payout","docket"]),
  'sme-telecom-spectrum': (ctx, base) => {
    let r = sectorTagMatch(ctx, base, ["spectrum","fcc","license","auction","wireless"], 'Spectrum')
    r = requirePrimaryForPlusOne(ctx, r, 'Spectrum', ["spectrum","fcc","license","auction","wireless"])
    if (ctx.original === 1 && isSocialOnly(hay(ctx), ctx.material)) {
      r = demoteToZero(r, 'Spectrum: social-only sector claim held at 0', 36)
    }
    return r
  },
  'sme-food-safety-reg': (ctx, base) => {
    let r = sectorTagMatch(ctx, base, ["food","fda","recall","fsma","usda"], 'Food Safety')
    r = requirePrimaryForPlusOne(ctx, r, 'Food Safety', ["food","fda","recall","fsma","usda"])
    if (ctx.original === 1 && isSocialOnly(hay(ctx), ctx.material)) {
      r = demoteToZero(r, 'Food Safety: social-only sector claim held at 0', 36)
    }
    return r
  },
  'sme-aviation-ops-reg': (ctx, base) => {
    let r = sectorTagMatch(ctx, base, ["aviation","faa","airworthiness","ad","ntsb"], 'Aviation Ops')
    r = requirePrimaryForPlusOne(ctx, r, 'Aviation Ops', ["aviation","faa","airworthiness","ad","ntsb"])
    if (ctx.original === 1 && isSocialOnly(hay(ctx), ctx.material)) {
      r = demoteToZero(r, 'Aviation Ops: social-only sector claim held at 0', 36)
    }
    return r
  },
  'sme-banking-prudential': (ctx, base) => {
    let r = sectorTagMatch(ctx, base, ["banking","capital","liquidity","fdic","supervisory"], 'Bank Super')
    r = requirePrimaryForPlusOne(ctx, r, 'Bank Super', ["banking","capital","liquidity","fdic","supervisory"])
    if (ctx.original === 1 && isSocialOnly(hay(ctx), ctx.material)) {
      r = demoteToZero(r, 'Bank Super: social-only sector claim held at 0', 36)
    }
    return r
  },
  'sme-labor-wage-hour': (ctx, base) => {
    let r = sectorTagMatch(ctx, base, ["wage","overtime","flsa","dol","classification"], 'Wage Hour')
    r = requirePrimaryForPlusOne(ctx, r, 'Wage Hour', ["wage","overtime","flsa","dol","classification"])
    if (ctx.original === 1 && isSocialOnly(hay(ctx), ctx.material)) {
      r = demoteToZero(r, 'Wage Hour: social-only sector claim held at 0', 36)
    }
    return r
  },
  'sme-cyber-incident-reg': (ctx, base) => {
    let r = sectorTagMatch(ctx, base, ["cyber","incident","cisa","notification","breach"], 'Cyber Inc')
    r = requirePrimaryForPlusOne(ctx, r, 'Cyber Inc', ["cyber","incident","cisa","notification","breach"])
    if (ctx.original === 1 && isSocialOnly(hay(ctx), ctx.material)) {
      r = demoteToZero(r, 'Cyber Inc: social-only sector claim held at 0', 36)
    }
    return r
  },
  'sme-export-controls-reg': (ctx, base) => {
    let r = sectorTagMatch(ctx, base, ["export","ear","bis","entity list","itar"], 'Export Ctrl')
    r = requirePrimaryForPlusOne(ctx, r, 'Export Ctrl', ["export","ear","bis","entity list","itar"])
    if (ctx.original === 1 && isSocialOnly(hay(ctx), ctx.material)) {
      r = demoteToZero(r, 'Export Ctrl: social-only sector claim held at 0', 36)
    }
    return r
  },
  'sme-antitrust-remedy': (ctx, base) => {
    let r = sectorTagMatch(ctx, base, ["antitrust","remedy","consent","divestiture","injunction"], 'AT Remedy')
    r = requirePrimaryForPlusOne(ctx, r, 'AT Remedy', ["antitrust","remedy","consent","divestiture","injunction"])
    if (ctx.original === 1 && isSocialOnly(hay(ctx), ctx.material)) {
      r = demoteToZero(r, 'AT Remedy: social-only sector claim held at 0', 36)
    }
    return r
  },
  'sme-uncertainty-budget': (ctx, base) => {
    let r = sectorTagMatch(ctx, base, ["uncertainty","error","confidence","interval","estimate"], 'Uncert Budg')
    const text = hay(ctx)
    if (ctx.original === 1 && !hasAny(text, ['method', 'protocol', 'definition', 'measurement', 'metric', 'test', 'replicate', 'uncertainty', 'lineage']) && isWeakMaterial(ctx.material)) {
      r = demoteToZero(r, 'Uncert Budg: method claim lacks operational definition/protocol', 37)
    }
    return r
  },
  'sme-reproducibility-gate': (ctx, base) => {
    let r = sectorTagMatch(ctx, base, ["reproducib","protocol","replication","verify","method"], 'Repro Gate')
    const text = hay(ctx)
    if (ctx.original === 1 && !hasAny(text, ['method', 'protocol', 'definition', 'measurement', 'metric', 'test', 'replicate', 'uncertainty', 'lineage']) && isWeakMaterial(ctx.material)) {
      r = demoteToZero(r, 'Repro Gate: method claim lacks operational definition/protocol', 37)
    }
    return r
  },
  'sme-adversarial-review': (ctx, base) => {
    let r = sectorTagMatch(ctx, base, ["adversarial","falsif","red team","counter","critique"], 'Red Team')
    const text = hay(ctx)
    if (ctx.original === 1 && !hasAny(text, ['method', 'protocol', 'definition', 'measurement', 'metric', 'test', 'replicate', 'uncertainty', 'lineage']) && isWeakMaterial(ctx.material)) {
      r = demoteToZero(r, 'Red Team: method claim lacks operational definition/protocol', 37)
    }
    return r
  },
  'sme-metric-definition': (ctx, base) => {
    let r = sectorTagMatch(ctx, base, ["metric","kpi","definition","population","dashboard"], 'Metric Def')
    const text = hay(ctx)
    if (ctx.original === 1 && !hasAny(text, ['method', 'protocol', 'definition', 'measurement', 'metric', 'test', 'replicate', 'uncertainty', 'lineage']) && isWeakMaterial(ctx.material)) {
      r = demoteToZero(r, 'Metric Def: method claim lacks operational definition/protocol', 37)
    }
    return r
  },
  'sme-mech-fatigue-fracture': engineeringRule('Fatigue/Frac', ["fatigue","fracture","crack","s-n","inspection"], { highStakesDefault: true }),
  'sme-mech-tribology': engineeringRule('Tribology', ["tribology","friction","wear","lubrication","bearing"], { highStakesDefault: false }),
  'sme-mech-heat-transfer': withDimensionlessRegime(engineeringRule('Heat Xfer', ["heat","convection","nusselt","thermal","conduction"], { highStakesDefault: false }), 'Heat Xfer'),
  'sme-mech-pressure-vessels': engineeringRule('Pressure V', ["pressure","vessel","asme","mawp","relief"], { highStakesDefault: true }),
  'sme-mech-cfd-vnv': withDimensionlessRegime(engineeringRule('CFD V&V', ["cfd","validation","mesh","turbulence","reynolds"], { highStakesDefault: false }), 'CFD V&V'),
  'sme-mech-seals-gaskets': engineeringRule('Seals', ["seal","gasket","leak","torque","compatibility"], { highStakesDefault: true }),
  'sme-civil-seismic': engineeringRule('Seismic', ["seismic","earthquake","ductility","asce","drift"], { highStakesDefault: true }),
  'sme-civil-bridge': engineeringRule('Bridge', ["bridge","load rating","scour","inspection","fatigue"], { highStakesDefault: true }),
  'sme-civil-hydraulics': withDimensionlessRegime(engineeringRule('Hydraulics', ["hydraulic","flood","storm","manning","culvert"], { highStakesDefault: true }), 'Hydraulics'),
  'sme-civil-geohazard': engineeringRule('Geohazard', ["slope","liquefaction","fos","geohazard","stability"], { highStakesDefault: true }),
  'sme-ee-emc': engineeringRule('EMC/EMI', ["emc","emi","emissions","immunity","fcc"], { highStakesDefault: false }),
  'sme-ee-power-electronics': engineeringRule('Power Elec', ["converter","inverter","switching","efficiency","thermal"], { highStakesDefault: true }),
  'sme-ee-protection': engineeringRule('Protection', ["protection","relay","coordination","fault","arc flash"], { highStakesDefault: true }),
  'sme-ee-embedded': engineeringRule('Embedded', ["embedded","firmware","watchdog","timing","rtos"], { highStakesDefault: true }),
  'sme-ee-battery-systems': engineeringRule('Battery Sys', ["battery","bms","thermal","soc","cell"], { highStakesDefault: true }),
  'sme-chem-mass-energy': engineeringRule('Mass/Energy', ["mass balance","energy balance","yield","closure","inventory"], { highStakesDefault: false }),
  'sme-chem-separation': engineeringRule('Separation', ["distillation","membrane","separation","selectivity","fouling"], { highStakesDefault: false }),
  'sme-chem-corrosion': engineeringRule('Corrosion', ["corrosion","pitting","mpy","coating","compatibility"], { highStakesDefault: true }),
  'sme-aero-structures': engineeringRule('Aero Struct', ["airframe","loads","allowable","damage tolerance","margin"], { highStakesDefault: true }),
  'sme-aero-gnc': engineeringRule('GNC', ["gnc","navigation","kalman","control","stability"], { highStakesDefault: true }),
  'sme-aero-space-systems': withDimensionlessRegime(engineeringRule('Space Sys', ["orbit","link budget","spacecraft","launch","radiation"], { highStakesDefault: true }), 'Space Sys'),
  'sme-mat-additive': engineeringRule('Additive Mfg', ["additive","anisotropy","porosity","qualification","powder"], { highStakesDefault: true }),
  'sme-mat-welding': engineeringRule('Welding', ["weld","wps","pqr","nde","haz"], { highStakesDefault: true }),
  'sme-mat-polymers': engineeringRule('Polymers', ["polymer","elastomer","tg","aging","compatibility"], { highStakesDefault: false }),
  'sme-mfg-lean-sixsigma': engineeringRule('Lean/SS', ["cpk","msa","spc","yield","six sigma"], { highStakesDefault: false }),
  'sme-energy-storage-grid': engineeringRule('Grid Storage', ["storage","battery","rte","interconnection","grid"], { highStakesDefault: false }),
  'sme-energy-renewables': engineeringRule('Renewables', ["capacity factor","solar","wind","resource","curtailment"], { highStakesDefault: false }),
  'sme-nuclear-safety-case': engineeringRule('Nuc Safety', ["nuclear","design basis","safety case","dose","pra"], { highStakesDefault: true }),
  'sme-bio-imaging': engineeringRule('Med Imaging', ["imaging","mri","ct","dose","reconstruction"], { highStakesDefault: true }),
  'sme-bio-regulatory-device': (ctx, base) => {
    let r = sectorTagMatch(ctx, base, ["fda","device","510k","pma","labeling"], 'Device Reg')
    r = requirePrimaryForPlusOne(ctx, r, 'Device Reg', ["fda","device","510k","pma","labeling"])
    if (ctx.original === 1 && isSocialOnly(hay(ctx), ctx.material)) {
      r = demoteToZero(r, 'Device Reg: social-only sector claim held at 0', 36)
    }
    return r
  },
  'sme-bio-human-factors': engineeringRule('Human Fact', ["human factors","usability","use error","ifu","workflow"], { highStakesDefault: true }),
  'sme-cps-security': engineeringRule('CPS Sec', ["security","threat model","ot","ics","sbom"], { highStakesDefault: true }),
  'sme-cps-realtime': engineeringRule('Realtime', ["realtime","wcet","deadline","latency","scheduling"], { highStakesDefault: true }),
  'sme-cps-data-lineage': (ctx, base) => {
    let r = sectorTagMatch(ctx, base, ["lineage","provenance","dataset","etl","leakage"], 'Data Lineage')
    const text = hay(ctx)
    if (ctx.original === 1 && !hasAny(text, ['method', 'protocol', 'definition', 'measurement', 'metric', 'test', 'replicate', 'uncertainty', 'lineage']) && isWeakMaterial(ctx.material)) {
      r = demoteToZero(r, 'Data Lineage: method claim lacks operational definition/protocol', 37)
    }
    return r
  },
  'sme-cps-formal-methods': theoryRule('Formal Meth', ["formal","proof","model checking","specification","invariant"]),
  'sme-cps-ml-systems': (ctx, base) => {
    let r = sectorTagMatch(ctx, base, ["ml","metric","drift","evaluation","calibration"], 'ML Systems')
    const text = hay(ctx)
    if (ctx.original === 1 && !hasAny(text, ['method', 'protocol', 'definition', 'measurement', 'metric', 'test', 'replicate', 'uncertainty', 'lineage']) && isWeakMaterial(ctx.material)) {
      r = demoteToZero(r, 'ML Systems: method claim lacks operational definition/protocol', 37)
    }
    return r
  },
  'sme-math-linear-algebra': theoryRule('Lin Alg', ["matrix","conditioning","rank","svd","numerical"]),
  'sme-math-dynamical-systems': theoryRule('Dyn Sys', ["stability","bifurcation","lyapunov","dynamical","chaos"]),
  'sme-math-bayesian': theoryRule('Bayesian', ["bayesian","prior","posterior","mcmc","likelihood"]),
  'sme-math-causal': theoryRule('Causal Inf', ["causal","identification","confound","dag","treatment"]),
  'sme-math-time-series': theoryRule('Time Series', ["time series","forecast","stationarity","backtest","seasonality"]),
  'sme-math-graph-theory': theoryRule('Graph Thry', ["graph","network","centrality","path","adjacency"]),
  'sme-math-numerical-pde': theoryRule('Num PDE', ["pde","cfl","convergence","stability","mesh"]),
  'sme-phys-particle': theoryRule('Particle', ["particle","significance","detector","cross section","background"]),
  'sme-phys-cosmo': theoryRule('Cosmology', ["cosmology","cmb","hubble","survey","redshift"]),
  'sme-phys-atomic': theoryRule('Atomic/Mol', ["spectrum","linewidth","atomic","calibration","laser"]),
  'sme-phys-soft-matter': withDimensionlessRegime(theoryRule('Soft Matter', ["rheology","colloid","viscoelastic","deborah","soft matter"]), 'Soft Matter'),
  'sme-phys-nonlinear': withDimensionlessRegime(theoryRule('Nonlinear', ["nonlinear","turbulence","wave","dispersion","shock"]), 'Nonlinear'),
  'sme-applied-metrology': (ctx, base) => {
    let r = sectorTagMatch(ctx, base, ["metrology","calibration","traceability","uncertainty","standard"], 'Metrology')
    const text = hay(ctx)
    if (ctx.original === 1 && !hasAny(text, ['method', 'protocol', 'definition', 'measurement', 'metric', 'test', 'replicate', 'uncertainty', 'lineage']) && isWeakMaterial(ctx.material)) {
      r = demoteToZero(r, 'Metrology: method claim lacks operational definition/protocol', 37)
    }
    return r
  },
  'sme-applied-acoustics-env': engineeringRule('Env Acoust', ["acoustics","spl","dba","noise","measurement"], { highStakesDefault: false }),
  // -- 1.4.0 expansion (+72) --
  'sme-gov-integrity-score': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Integ Score', ["integrity", "scorecard", "export", "narrative", "evidence"]),
  'sme-gov-cross-claim': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Cross-Claim', ["cross", "claim", "consistency", "contradiction", "ledger"]),
  'sme-gov-source-decay': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Source Decay', ["source", "freshness", "stale", "docket", "outdated"]),
  'sme-gov-alias-entity': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Entity Alias', ["entity", "alias", "shell", "org", "name"]),
  'sme-gov-burden-proof': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Burden Proof', ["burden", "proof", "allocate", "record", "producer"]),
  'sme-gov-escalation-path': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Escalation', ["escalation", "path", "high", "stakes", "export"]),
  'sme-pr-retention': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Retention', ["retention", "schedule", "destruction", "hold", "archive"]),
  'sme-pr-metadata': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Rec Metadata', ["metadata", "filing", "production", "fields", "completeness"]),
  'sme-pr-version-control': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Doc Version', ["version", "ordinance", "policy", "pdf", "lineage"]),
  'sme-pr-access-log': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Access Log', ["access", "log", "portal", "retrieve", "custodian"]),
  'sme-pr-certified-copy': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Cert Copy', ["certified", "copy", "plain", "seal", "custodian"]),
  'sme-pr-bulk-export': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Bulk Export', ["bulk", "export", "pagination", "dump", "integrity"]),
  'sme-ju-choice-law': (ctx, base) => { let r = sectorTagMatch(ctx, base, ["choice", "law", "conflict", "forum", "governing"], 'Choice Law'); r = requirePrimaryForPlusOne(ctx, r, 'Choice Law', ["choice", "law", "conflict", "forum", "governing"]); const text = hay(ctx); if (ctx.original === 1 && !hasAny(text, ['statute','code','section','order','docket','clause']) && isWeakMaterial(ctx.material)) r = demoteToZero(r, 'Choice Law: lacks instrument anchors', 38); return r },
  'sme-ju-sovereign-immunity': (ctx, base) => { let r = sectorTagMatch(ctx, base, ["sovereign", "immunity", "waiver", "tort", "claim"], 'Sov Immun'); r = requirePrimaryForPlusOne(ctx, r, 'Sov Immun', ["sovereign", "immunity", "waiver", "tort", "claim"]); const text = hay(ctx); if (ctx.original === 1 && !hasAny(text, ['statute','code','section','order','docket','clause']) && isWeakMaterial(ctx.material)) r = demoteToZero(r, 'Sov Immun: lacks instrument anchors', 38); return r },
  'sme-ju-agency-capture': (ctx, base) => { let r = sectorTagMatch(ctx, base, ["capture", "revolving", "edge", "agency", "influence"], 'Agency Cap'); r = requirePrimaryForPlusOne(ctx, r, 'Agency Cap', ["capture", "revolving", "edge", "agency", "influence"]); const text = hay(ctx); if (ctx.original === 1 && !hasAny(text, ['statute','code','section','order','docket','clause']) && isWeakMaterial(ctx.material)) r = demoteToZero(r, 'Agency Cap: lacks instrument anchors', 38); return r },
  'sme-ju-federalism-funds': (ctx, base) => { let r = sectorTagMatch(ctx, base, ["federalism", "spending", "condition", "grant", "string"], 'Fed Funds'); r = requirePrimaryForPlusOne(ctx, r, 'Fed Funds', ["federalism", "spending", "condition", "grant", "string"]); const text = hay(ctx); if (ctx.original === 1 && !hasAny(text, ['statute','code','section','order','docket','clause']) && isWeakMaterial(ctx.material)) r = demoteToZero(r, 'Fed Funds: lacks instrument anchors', 38); return r },
  'sme-ju-emergency-powers': (ctx, base) => { let r = sectorTagMatch(ctx, base, ["emergency", "powers", "declaration", "sunset", "temporary"], 'Emerg Pwr'); r = requirePrimaryForPlusOne(ctx, r, 'Emerg Pwr', ["emergency", "powers", "declaration", "sunset", "temporary"]); const text = hay(ctx); if (ctx.original === 1 && !hasAny(text, ['statute','code','section','order','docket','clause']) && isWeakMaterial(ctx.material)) r = demoteToZero(r, 'Emerg Pwr: lacks instrument anchors', 38); return r },
  'sme-ju-compact-clause': (ctx, base) => { let r = sectorTagMatch(ctx, base, ["interstate", "compact", "consent", "congress", "approval"], 'Compact'); r = requirePrimaryForPlusOne(ctx, r, 'Compact', ["interstate", "compact", "consent", "congress", "approval"]); const text = hay(ctx); if (ctx.original === 1 && !hasAny(text, ['statute','code','section','order','docket','clause']) && isWeakMaterial(ctx.material)) r = demoteToZero(r, 'Compact: lacks instrument anchors', 38); return r },
  'sme-ov-whistle-channel': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Whistle Ch', ["whistle", "channel", "retaliation", "hotline", "protected"]),
  'sme-ov-metrics-game': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Metric Game', ["metric", "gaming", "goodhart", "kpi", "operational"]),
  'sme-ov-sole-source': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Sole Source', ["sole", "source", "justification", "award", "bid"]),
  'sme-ov-grant-compliance': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Grant Comp', ["grant", "compliance", "allowability", "reporting", "clock"]),
  'sme-ov-shadow-policy': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Shadow Pol', ["shadow", "policy", "unwritten", "practice", "memo"]),
  'sme-ov-public-comment': (ctx, base) => requirePrimaryForPlusOne(ctx, base, 'Pub Comment', ["public", "comment", "docket", "mass", "campaign"]),
  'sme-sr-data-broker': (ctx, base) => { let r = sectorTagMatch(ctx, base, ["data", "broker", "registration", "deletion", "privacy"], 'Data Broker'); r = requirePrimaryForPlusOne(ctx, r, 'Data Broker', ["data", "broker", "registration", "deletion", "privacy"]); if (ctx.original === 1 && isSocialOnly(hay(ctx), ctx.material)) r = demoteToZero(r, 'Data Broker: social-only held at 0', 36); return r },
  'sme-sr-crypto-asset': (ctx, base) => { let r = sectorTagMatch(ctx, base, ["crypto", "asset", "market", "structure", "sec"], 'Crypto Asset'); r = requirePrimaryForPlusOne(ctx, r, 'Crypto Asset', ["crypto", "asset", "market", "structure", "sec"]); if (ctx.original === 1 && isSocialOnly(hay(ctx), ctx.material)) r = demoteToZero(r, 'Crypto Asset: social-only held at 0', 36); return r },
  'sme-sr-ai-safety-eval': (ctx, base) => { let r = sectorTagMatch(ctx, base, ["safety", "evaluation", "red", "team", "method"], 'AI Eval'); r = requirePrimaryForPlusOne(ctx, r, 'AI Eval', ["safety", "evaluation", "red", "team", "method"]); if (ctx.original === 1 && isSocialOnly(hay(ctx), ctx.material)) r = demoteToZero(r, 'AI Eval: social-only held at 0', 36); return r },
  'sme-sr-privacy-impact': (ctx, base) => { let r = sectorTagMatch(ctx, base, ["privacy", "impact", "assessment", "pia", "scope"], 'PIA'); r = requirePrimaryForPlusOne(ctx, r, 'PIA', ["privacy", "impact", "assessment", "pia", "scope"]); if (ctx.original === 1 && isSocialOnly(hay(ctx), ctx.material)) r = demoteToZero(r, 'PIA: social-only held at 0', 36); return r },
  'sme-sr-critical-infra': (ctx, base) => { let r = sectorTagMatch(ctx, base, ["critical", "infrastructure", "sector", "cisa", "duty"], 'Crit Infra'); r = requirePrimaryForPlusOne(ctx, r, 'Crit Infra', ["critical", "infrastructure", "sector", "cisa", "duty"]); if (ctx.original === 1 && isSocialOnly(hay(ctx), ctx.material)) r = demoteToZero(r, 'Crit Infra: social-only held at 0', 36); return r },
  'sme-sr-consumer-finance': (ctx, base) => { let r = sectorTagMatch(ctx, base, ["consumer", "finance", "disclosure", "unfair", "practices"], 'Cons Fin'); r = requirePrimaryForPlusOne(ctx, r, 'Cons Fin', ["consumer", "finance", "disclosure", "unfair", "practices"]); if (ctx.original === 1 && isSocialOnly(hay(ctx), ctx.material)) r = demoteToZero(r, 'Cons Fin: social-only held at 0', 36); return r },
  'sme-mp-sample-design': (ctx, base) => { let r = sectorTagMatch(ctx, base, ["sample", "design", "frame", "selection", "bias"], 'Sample Des'); const text = hay(ctx); if (ctx.original === 1 && !hasAny(text, ['method','protocol','definition','measurement','sample','plan','metric']) && isWeakMaterial(ctx.material)) r = demoteToZero(r, 'Sample Des: lacks method anchors', 37); return r },
  'sme-mp-interrater': (ctx, base) => { let r = sectorTagMatch(ctx, base, ["interrater", "reliability", "kappa", "agreement", "coding"], 'Interrater'); const text = hay(ctx); if (ctx.original === 1 && !hasAny(text, ['method','protocol','definition','measurement','sample','plan','metric']) && isWeakMaterial(ctx.material)) r = demoteToZero(r, 'Interrater: lacks method anchors', 37); return r },
  'sme-mp-preanalysis': (ctx, base) => { let r = sectorTagMatch(ctx, base, ["pre", "analysis", "plan", "registered", "fishing"], 'Pre-Analysis'); const text = hay(ctx); if (ctx.original === 1 && !hasAny(text, ['method','protocol','definition','measurement','sample','plan','metric']) && isWeakMaterial(ctx.material)) r = demoteToZero(r, 'Pre-Analysis: lacks method anchors', 37); return r },
  'sme-me-rotordynamics': engineeringRule('Rotor Dyn', ["rotor", "dynamics", "critical", "speed", "imbalance"], { highStakesDefault: false }),
  'sme-me-pneumatics': engineeringRule('Pneumatics', ["pneumatics", "fluid", "power", "pressure", "flow"], { highStakesDefault: false }),
  'sme-me-nvh': engineeringRule('NVH', ["nvh", "noise", "vibration", "spectrum", "harshness"], { highStakesDefault: false }),
  'sme-me-dfm': engineeringRule('DFM', ["dfm", "dfa", "manufacturing", "capability", "tolerance"], { highStakesDefault: false }),
  'sme-me-reliability-growth': engineeringRule('Rel Growth', ["reliability", "growth", "mtbf", "test", "analyze"], { highStakesDefault: false }),
  'sme-cs-fire-life': engineeringRule('Fire Life', ["fire", "life", "safety", "egress", "resistance"], { highStakesDefault: true }),
  'sme-cs-coastal': engineeringRule('Coastal', ["coastal", "floodplain", "hazard", "surge", "freb"], { highStakesDefault: false }),
  'sme-cs-pavement': engineeringRule('Pavement', ["pavement", "distress", "design", "load", "traffic"], { highStakesDefault: false }),
  'sme-ee-grounding': engineeringRule('Grounding', ["grounding", "bonding", "earthing", "equipotential", "electrical"], { highStakesDefault: false }),
  'sme-ee-hvdc': engineeringRule('HVDC', ["hvdc", "converter", "grid", "interface", "transmission"], { highStakesDefault: true }),
  'sme-ee-sensor-fusion': engineeringRule('Sensor Fus', ["sensor", "fusion", "kalman", "covariance", "observability"], { highStakesDefault: false }),
  'sme-ee-pcb-signal': engineeringRule('PCB SI', ["pcb", "signal", "integrity", "impedance", "stackup"], { highStakesDefault: false }),
  'sme-ch-catalyst': engineeringRule('Catalyst', ["catalyst", "selectivity", "deactivation", "reactor", "chemical"], { highStakesDefault: false }),
  'sme-ch-hazard-ops': engineeringRule('Haz Ops', ["hazop", "lopa", "action", "item", "process"], { highStakesDefault: true }),
  'sme-ad-human-rating': engineeringRule('Human Rate', ["human", "rating", "abort", "criteria", "crew"], { highStakesDefault: true }),
  'sme-ad-mission-assurance': engineeringRule('Msn Assur', ["mission", "assurance", "anomaly", "closeout", "gate"], { highStakesDefault: true }),
  'sme-mm-coatings': engineeringRule('Coatings', ["coating", "adhesion", "corrosion", "thickness", "materials"], { highStakesDefault: false }),
  'sme-mm-ceramics': engineeringRule('Ceramics', ["ceramic", "toughness", "sintering", "glass", "materials"], { highStakesDefault: false }),
  'sme-mm-supply-chain': engineeringRule('Mfg Supply', ["supply", "chain", "dual", "source", "lead"], { highStakesDefault: false }),
  'sme-en-hydrogen': engineeringRule('Hydrogen', ["hydrogen", "purity", "leakage", "materials", "safety"], { highStakesDefault: true }),
  'sme-en-carbon-capture': engineeringRule('CCS', ["carbon", "capture", "rate", "energy", "penalty"], { highStakesDefault: false }),
  'sme-bm-clinical-eval': engineeringRule('Clin Eval', ["clinical", "evaluation", "evidence", "hierarchy", "device"], { highStakesDefault: true }),
  'sme-bm-biocompatibility': engineeringRule('Biocompat', ["biocompatibility", "iso", "cytotoxicity", "leachables", "biomedical"], { highStakesDefault: false }),
  'sme-cp-zero-trust': engineeringRule('Zero Trust', ["zero", "trust", "identity", "policy", "microsegmentation"], { highStakesDefault: false }),
  'sme-cp-observability': engineeringRule('Observabil', ["observability", "slo", "trace", "alert", "latency"], { highStakesDefault: false }),
  'sme-cp-supply-sbom': engineeringRule('SBOM', ["sbom", "supply", "chain", "provenance", "vulnerability"], { highStakesDefault: false }),
  'sme-cp-edge-compute': engineeringRule('Edge Comp', ["edge", "computing", "latency", "offline", "sync"], { highStakesDefault: false }),
  'sme-ms-measure-theory': theoryRule('Measure Th', ["measure", "theory", "sigma", "algebra", "almost"]),
  'sme-ms-nonparametrics': theoryRule('Nonparam', ["nonparametric", "rank", "test", "distribution", "free"]),
  'sme-ms-experimental-design': theoryRule('Exp Design', ["experimental", "design", "randomization", "power", "blocking"]),
  'sme-ms-robust-stats': theoryRule('Robust St', ["robust", "statistics", "outlier", "influence", "breakdown"]),
  'sme-ms-stochastic-proc': theoryRule('Stoch Proc', ["stochastic", "process", "markov", "martingale", "stationary"]),
  'sme-ms-info-geometry': theoryRule('Info Geom', ["information", "geometry", "divergence", "fisher", "natural"]),
  'sme-tp-qft-lite': withDimensionlessRegime(theoryRule('QFT Lite', ["qft", "field", "cutoff", "renormalization", "literacy"]), 'QFT Lite'),
  'sme-tp-gr-tests': withDimensionlessRegime(theoryRule('GR Tests', ["general", "relativity", "test", "dataset", "model"]), 'GR Tests'),
  'sme-tp-stat-field': withDimensionlessRegime(theoryRule('Stat Field', ["statistical", "field", "critical", "scaling", "universality"]), 'Stat Field'),
  'sme-tp-plasma-kinetics': withDimensionlessRegime(theoryRule('Plasma Kin', ["plasma", "kinetic", "fluid", "regime", "debye"]), 'Plasma Kin'),
  'sme-ap-remote-sensing': (ctx, base) => { let r = sectorTagMatch(ctx, base, ["remote", "sensing", "sensor", "processing", "calibration"], 'Remote Sens'); const text = hay(ctx); if (ctx.original === 1 && !hasAny(text, ['method','protocol','definition','measurement','sample','plan','metric']) && isWeakMaterial(ctx.material)) r = demoteToZero(r, 'Remote Sens: lacks method anchors', 37); return r },
  'sme-ap-instrumentation': (ctx, base) => { let r = sectorTagMatch(ctx, base, ["instrumentation", "uncertainty", "calibration", "traceability", "applied"], 'Instrum'); const text = hay(ctx); if (ctx.original === 1 && !hasAny(text, ['method','protocol','definition','measurement','sample','plan','metric']) && isWeakMaterial(ctx.material)) r = demoteToZero(r, 'Instrum: lacks method anchors', 37); return r },
}

/**
 * Returns lens ids missing from LENS_RULES (empty if complete).
 * Used by tests / dev assertions.
 */
export function assertAllLensesHaveRules(): string[] {
  return SME_LENSES.map((l) => l.id).filter((id) => !LENS_RULES[id])
}

export function applyLensRule(ctx: RuleCtx, base: RuleResult): RuleResult {
  const rule = LENS_RULES[ctx.lens.id]
  if (!rule) {
    return {
      ...base,
      gaps: [...base.gaps, `No specialized rule registered for ${ctx.lens.id}`],
    }
  }
  return rule(ctx, base)
}
