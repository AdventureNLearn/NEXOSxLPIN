/**
 * Multi-loop verification pipeline — signal focus, objective gates.
 * Loop 1: structural integrity
 * Loop 2: source binding
 * Loop 3: score hygiene (+1/0/−1)
 * Loop 4: dedupe / boilerplate
 * Loop 5: export readiness (Layer-0 adjacent)
 */

import type { EvidenceItem, EvidenceScore } from '../../types/core'
import type { ActiveSource } from '../../types/useCase'
import { dedupeByText, looksLikeBoilerplate, normalizeClaimText } from './dedupe'
import type { LedgedClaim } from './claimLedger'

export type VerifyLoopId = 'structure' | 'sources' | 'scores' | 'dedupe' | 'export'

export interface VerifyFinding {
  loop: VerifyLoopId
  severity: 'info' | 'warn' | 'block'
  code: string
  message: string
  claimKey?: string
}

export interface VerifyReport {
  deskId: string
  at: string
  loops: VerifyLoopId[]
  findings: VerifyFinding[]
  pass: boolean
  stats: {
    claims: number
    withSources: number
    plus: number
    zero: number
    neg: number
    boilerplate: number
    duplicatesRemoved: number
  }
}

function loopStructure(claims: LedgedClaim[]): VerifyFinding[] {
  const out: VerifyFinding[] = []
  if (!claims.length) {
    out.push({
      loop: 'structure',
      severity: 'block',
      code: 'empty-ledger',
      message: 'No claims on ledger — load a desk or run claim rebuild.',
    })
  }
  for (const c of claims) {
    if (c.plain.trim().length < 24) {
      out.push({
        loop: 'structure',
        severity: 'warn',
        code: 'thin-claim',
        message: 'Claim text too thin for granular verification.',
        claimKey: c.claimKey,
      })
    }
  }
  return out
}

function loopSources(claims: LedgedClaim[], sources: ActiveSource[]): VerifyFinding[] {
  const out: VerifyFinding[] = []
  const ids = new Set(sources.map((s) => s.id))
  let unboundPlus = 0
  for (const c of claims) {
    if (c.score === 1) {
      const ok = c.sourceIds.some((id) => ids.has(id))
      if (!ok) {
        unboundPlus++
        out.push({
          loop: 'sources',
          severity: 'warn',
          code: 'plus-without-source',
          message: `+1 claim lacks bound desk source: “${c.plain.slice(0, 72)}…”`,
          claimKey: c.claimKey,
        })
      }
    }
    for (const id of c.sourceIds) {
      if (!ids.has(id)) {
        out.push({
          loop: 'sources',
          severity: 'warn',
          code: 'dangling-ref',
          message: `Source id ${id} not on desk source list.`,
          claimKey: c.claimKey,
        })
      }
    }
  }
  if (unboundPlus >= 3) {
    out.push({
      loop: 'sources',
      severity: 'block',
      code: 'plus-unbound-cluster',
      message: 'Multiple +1 claims lack source binding — attach primary before export.',
    })
  }
  return out
}

function loopScores(claims: LedgedClaim[]): VerifyFinding[] {
  const out: VerifyFinding[] = []
  const scores = claims.map((c) => c.score)
  if (scores.length && scores.every((s) => s === 1)) {
    out.push({
      loop: 'scores',
      severity: 'warn',
      code: 'all-plus',
      message: 'All claims +1 — unlikely for a live desk; re-score disputed lines.',
    })
  }
  if (!scores.includes(-1) && claims.length >= 4) {
    out.push({
      loop: 'scores',
      severity: 'info',
      code: 'no-neg',
      message: 'No −1 method gates on ledger — consider adding social-only disqualifiers.',
    })
  }
  return out
}

function loopDedupe(claims: LedgedClaim[]): { findings: VerifyFinding[]; cleaned: LedgedClaim[] } {
  const findings: VerifyFinding[] = []
  let boiler = 0
  for (const c of claims) {
    if (looksLikeBoilerplate(c.plain)) {
      boiler++
      findings.push({
        loop: 'dedupe',
        severity: 'warn',
        code: 'boilerplate',
        message: `Boilerplate pattern: “${c.plain.slice(0, 64)}…”`,
        claimKey: c.claimKey,
      })
    }
  }
  const cleaned = dedupeByText(claims, (c) => c.plain, 0.85)
  const removed = claims.length - cleaned.length
  if (removed > 0) {
    findings.push({
      loop: 'dedupe',
      severity: 'info',
      code: 'dupes-removed',
      message: `Removed ${removed} near-duplicate claim(s).`,
    })
  }
  if (boiler >= Math.max(2, Math.floor(claims.length * 0.4))) {
    findings.push({
      loop: 'dedupe',
      severity: 'block',
      code: 'boilerplate-pack',
      message: 'Claim pack looks generated boilerplate — rebuild ledger from desk sources.',
    })
  }
  return { findings, cleaned }
}

function loopExport(
  claims: LedgedClaim[],
  evidence: EvidenceItem[],
  openNegatives: number,
): VerifyFinding[] {
  const out: VerifyFinding[] = []
  if (openNegatives > 0) {
    out.push({
      loop: 'export',
      severity: 'block',
      code: 'open-negatives',
      message: `${openNegatives} unresolved −1 on evidence board — clear or re-score before publish pack.`,
    })
  }
  const plusUncited = claims.filter((c) => c.score === 1 && !c.sourceIds.length).length
  if (plusUncited > 0) {
    out.push({
      loop: 'export',
      severity: 'warn',
      code: 'export-uncited-plus',
      message: `${plusUncited} +1 ledger claim(s) still uncited.`,
    })
  }
  if (!evidence.length && !claims.length) {
    out.push({
      loop: 'export',
      severity: 'block',
      code: 'empty-board',
      message: 'Empty evidence board — nothing to export.',
    })
  }
  return out
}

export function runVerificationPipeline(input: {
  deskId: string
  claims: LedgedClaim[]
  sources: ActiveSource[]
  evidence: EvidenceItem[]
  openNegatives: number
}): VerifyReport {
  const loops: VerifyLoopId[] = ['structure', 'sources', 'scores', 'dedupe', 'export']
  const findings: VerifyFinding[] = []

  findings.push(...loopStructure(input.claims))
  findings.push(...loopSources(input.claims, input.sources))
  findings.push(...loopScores(input.claims))
  const { findings: dFind, cleaned } = loopDedupe(input.claims)
  findings.push(...dFind)
  findings.push(...loopExport(cleaned, input.evidence, input.openNegatives))

  const plus = cleaned.filter((c) => c.score === 1).length
  const zero = cleaned.filter((c) => c.score === 0).length
  const neg = cleaned.filter((c) => c.score === -1).length
  const withSources = cleaned.filter((c) => c.sourceIds.length > 0).length
  const boilerplate = input.claims.filter((c) => looksLikeBoilerplate(c.plain)).length

  const pass = !findings.some((f) => f.severity === 'block')

  return {
    deskId: input.deskId,
    at: new Date().toISOString(),
    loops,
    findings,
    pass,
    stats: {
      claims: cleaned.length,
      withSources,
      plus,
      zero,
      neg,
      boilerplate,
      duplicatesRemoved: input.claims.length - cleaned.length,
    },
  }
}

export function scoreHistogram(scores: EvidenceScore[]): string {
  const p = scores.filter((s) => s === 1).length
  const z = scores.filter((s) => s === 0).length
  const n = scores.filter((s) => s === -1).length
  return `+${p} · 0=${z} · −${n}`
}

export { normalizeClaimText }
