import type { PaneId, PaneWeight } from '../types/useCase'
import type { DepthSignals } from './types'
import { clamp } from './measure'

/**
 * Merge profile weights with live depth signals.
 * Returns weight map for open panes only; values stay in ~1–6 range.
 */
export function computeDepthWeights(
  openPanes: PaneId[],
  profileWeights: PaneWeight[],
  signals: DepthSignals,
): Map<PaneId, number> {
  const base = new Map<PaneId, number>()
  for (const p of openPanes) {
    const w = profileWeights.find((x) => x.pane === p)
    base.set(p, w?.weight ?? 2)
  }

  const boost = (pane: PaneId, amount: number) => {
    if (!base.has(pane)) return
    base.set(pane, clamp((base.get(pane) ?? 2) + amount, 1, 6))
  }

  if (signals.spatialPointCount > 0) boost('atlas', 0.8)
  if (signals.graphEdgeCount > 3) boost('atlas', 0.4)
  if (signals.researchChars > 400) boost('research-hub', 0.6)
  if (signals.evidenceCount > 5) boost('research-hub', 0.4)
  if (signals.openNegatives > 0) {
    boost('research-hub', 0.8)
    boost('export-kit', 0.5)
    boost('audit-ladder', 0.3)
    boost('sme-lenses', 0.7)
  }
  if (signals.evidenceCount > 3) boost('sme-lenses', 0.4)
  if (signals.unscoredCount > 0) boost('research-hub', 0.3)
  if (signals.ladderCurrent >= 2) boost('audit-ladder', 0.5)
  if (signals.conditionAxisCount >= 3) boost('design-lab', 0.6)

  return base
}

export function minPxFor(pane: PaneId, profileWeights: PaneWeight[]): number {
  const w = profileWeights.find((x) => x.pane === pane)
  if (w?.minPx) return w.minPx
  if (pane === 'atlas') return 480
  if (pane === 'research-hub') return 260
  if (pane === 'design-lab') return 240
  return 180
}

export function isPinned(pane: PaneId, profileWeights: PaneWeight[]): boolean {
  return Boolean(profileWeights.find((x) => x.pane === pane)?.pinned)
}
