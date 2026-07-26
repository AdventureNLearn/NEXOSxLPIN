/**
 * Tri-state evidence utilities (+1 / 0 / −1).
 */

import type {
  EvidenceItem,
  EvidenceScore,
  MaterialClass,
  ClaimConfidence,
} from '../types/core'
import { scoreToLabel, uid } from '../types/core'

export function describeScore(score: EvidenceScore): string {
  switch (score) {
    case 1:
      return 'Supported — primary or strongly corroborated material.'
    case -1:
      return 'Contradicted or disqualifying — escalate; do not ship as fact.'
    default:
      return 'Insufficient or contested — hold claim; gather more material.'
  }
}

export function scoreTone(score: EvidenceScore): {
  label: string
  className: string
  border: string
} {
  // Spec v1.0 §3.2 claim status language (P0)
  if (score === 1) {
    return {
      label: '+1',
      className: 'text-emerald-400 bg-emerald-500/15',
      border: 'border-emerald-500/30',
    }
  }
  if (score === -1) {
    return {
      label: '−1',
      className: 'text-rose-400 bg-rose-500/15',
      border: 'border-rose-500/30',
    }
  }
  return {
    label: '0',
    className: 'text-amber-400 bg-amber-500/15',
    border: 'border-amber-500/30',
  }
}

export function createEvidenceItem(input: {
  title: string
  summary: string
  score: EvidenceScore
  material?: MaterialClass
  confidence?: ClaimConfidence
  tags?: string[]
  sourceRefs?: string[]
}): EvidenceItem {
  return {
    id: uid('ev'),
    title: input.title,
    summary: input.summary,
    score: input.score,
    material: input.material ?? (input.score === 1 ? 'primary' : 'derived'),
    confidence: input.confidence ?? (input.score === 1 ? 'high' : input.score === -1 ? 'medium' : 'low'),
    tags: input.tags ?? [],
    sourceRefs: input.sourceRefs ?? [],
    createdAt: new Date().toISOString(),
  }
}

export function countByScore(items: EvidenceItem[]): Record<EvidenceLabelExt, number> {
  const out = { '+1': 0, '0': 0, '-1': 0 } as Record<EvidenceLabelExt, number>
  for (const i of items) {
    out[scoreToLabel(i.score)] += 1
  }
  return out
}

type EvidenceLabelExt = '+1' | '0' | '-1'

export function unresolvedNegatives(items: EvidenceItem[]): EvidenceItem[] {
  return items.filter((i) => i.score === -1)
}

/** Map legacy Evidence/Inference/Assumption class → tri-state when bridging packs. */
export function legacyClassToScore(cls: string): EvidenceScore {
  const c = cls.toLowerCase()
  if (c === 'evidence' || c === 'pass' || c === '+1') return 1
  if (c === 'assumption' || c === 'fail' || c === '-1') return -1
  return 0
}
