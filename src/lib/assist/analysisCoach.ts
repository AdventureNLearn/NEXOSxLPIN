/**
 * Analysis Coach — high-agency next-step suggestions for the visual assistant.
 * Pure functions: no network. Humans stay in the loop; this only orients.
 */

import type { EvidenceItem, EvidenceScore, ModuleId } from '../../types/core'
import { unresolvedNegatives } from '../../core/evidence'

export type CoachPhase =
  | 'orient'
  | 'score'
  | 'source'
  | 'place'
  | 'challenge'
  | 'model'
  | 'share'
  | 'steady'

export interface CoachStep {
  phase: CoachPhase
  /** One-line “you are here” */
  here: string
  /** Why this matters for agency */
  why: string
  /** Concrete next action */
  next: string
  /** Module to open */
  go: ModuleId
  /** Optional secondary */
  also?: ModuleId
}

export interface CoachInput {
  useCasePicked: boolean
  deskLabel: string
  evidence: EvidenceItem[]
  sourceCount: number
  hasMapPin: boolean
  assetCount: number
  activeModule: ModuleId
  layer0Blocked: boolean
}

function countScores(evidence: EvidenceItem[]) {
  let plus = 0
  let zero = 0
  let neg = 0
  for (const e of evidence) {
    if (e.score === 1) plus++
    else if (e.score === -1) neg++
    else zero++
  }
  return { plus, zero, neg, total: evidence.length }
}

/** Primary next step for the operator — one spine, not ten panels shouting. */
export function primaryCoachStep(input: CoachInput): CoachStep {
  if (!input.useCasePicked) {
    return {
      phase: 'orient',
      here: 'No story selected yet',
      why: 'Agency starts when you choose what to investigate — not when the feed chooses for you.',
      next: 'Pick one story from the start list.',
      go: 'information',
    }
  }

  const { plus, zero, neg, total } = countScores(input.evidence)
  const openNeg = unresolvedNegatives(input.evidence).length

  if (total === 0) {
    return {
      phase: 'score',
      here: `Story: ${input.deskLabel} · no claims on the board`,
      why: 'Without scored claims, the map and sketches have nothing honest to show.',
      next: 'Open Claims and add or rebuild scored lines from the story.',
      go: 'research-hub',
      also: 'information',
    }
  }

  if (zero > plus + neg) {
    return {
      phase: 'score',
      here: `${zero} claim(s) still “Not proven” · ${plus} supported · ${neg} disputed`,
      why: 'Most of the board is fog. High agency means deciding what can wait vs what needs a record.',
      next: 'Work Claims: attach a source or leave as 0 with a note — do not inflate to +1.',
      go: 'research-hub',
      also: 'atlas',
    }
  }

  if (input.sourceCount === 0 && plus > 0) {
    return {
      phase: 'source',
      here: `${plus} supported claim(s) but no desk sources loaded`,
      why: '+1 without a cite is only a sketch of confidence — treat as provisional.',
      next: 'Open sources on the Claims rail or Map brief; bind primaries where you can.',
      go: 'research-hub',
      also: 'atlas',
    }
  }

  if (openNeg > 0) {
    return {
      phase: 'challenge',
      here: `${openNeg} disputed (−1) line(s) still open`,
      why: 'Disputed lines block honest publish. That is a feature — not a bug.',
      next: 'Resolve or document residual risk before Share. Map the contested locus if place matters.',
      go: 'research-hub',
      also: 'export-kit',
    }
  }

  if (input.hasMapPin && input.activeModule !== 'atlas' && input.activeModule !== 'massing-viewer') {
    return {
      phase: 'place',
      here: 'Claims are in motion · place not checked this session',
      why: 'Words without geography invite narrative drift. Orient on the map before you model.',
      next: 'Open Map. Use Map layers (Where → Claims → Sources). Trust a pin only after the triad.',
      go: 'atlas',
      also: 'massing-viewer',
    }
  }

  if (input.assetCount === 0 && total >= 2 && openNeg === 0) {
    return {
      phase: 'model',
      here: 'Board is stable enough for an optional sketch',
      why: 'Sketches help spatial reasoning — they never replace scores or sources.',
      next: 'Optional: Build sketch or 3D view. Keep the illustrative disclaimer in view.',
      go: 'massing-viewer',
      also: 'procedural-forge',
    }
  }

  if (!input.layer0Blocked && openNeg === 0 && plus > 0) {
    return {
      phase: 'share',
      here: 'No open −1 · supported material exists',
      why: 'Only now is Share an honest option — still your call, still explicit.',
      next: 'Review Share pack preflight. ACK Layer-0 only when you mean it.',
      go: 'export-kit',
      also: 'research-hub',
    }
  }

  return {
    phase: 'steady',
    here: `${plus} supported · ${zero} open · ${neg} disputed · ${input.sourceCount} sources`,
    why: 'You are in the analysis loop. Keep scores honest; ignore chrome that does not serve the next decision.',
    next: 'Stay on Claims or Map. Use Experts only when a specialist checklist would change a score.',
    go: input.activeModule === 'sme-lenses' ? 'research-hub' : input.activeModule,
    also: 'atlas',
  }
}

/** How modules map together — static spine for the assistant panel. */
export const COHERENCE_SPINE: Array<{ id: ModuleId; role: string; feeds: string }> = [
  { id: 'information', role: 'Story', feeds: 'Sets the question and stakes' },
  { id: 'research-hub', role: 'Claims', feeds: 'Scores become the board of truth' },
  { id: 'atlas', role: 'Map', feeds: 'Places claims in public geography' },
  { id: 'sme-lenses', role: 'Experts', feeds: 'Checklists that may change a score (confirm apply)' },
  { id: 'design-lab', role: 'Rules', feeds: 'Conditions that must hold for the story to work' },
  { id: 'audit-ladder', role: 'Depth', feeds: 'How deep you have earned the right to go' },
  { id: 'procedural-forge', role: 'Sketch', feeds: 'Shapes from scores — not proof' },
  { id: 'massing-viewer', role: '3D', feeds: 'Same sketches on a real map scale' },
  { id: 'export-kit', role: 'Share', feeds: 'Leaves the building only when you press it' },
  { id: 'analyst', role: 'Commands', feeds: 'Optional power user — ignore if you do not need it' },
]

export function scorePlain(score: EvidenceScore): string {
  if (score === 1) return 'Supported'
  if (score === -1) return 'Disputed'
  return 'Not proven'
}
