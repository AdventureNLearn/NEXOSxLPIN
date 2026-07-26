import type { LayoutPresetId, PaneId } from '../types/useCase'

/** Default primary fraction hints by preset (before depth adjust). */
export const PRESET_PRIMARY_FRACTION: Record<LayoutPresetId, number> = {
  /** Atlas owns most of the board when spatial work is active */
  'spatial-primary': 0.58,
  'research-first': 0.5,
  'design-primary': 0.48,
  'triage-compact': 0.52,
  'export-review': 0.4,
}

/** Preferred region for known panes under a preset. */
export function preferredRegion(
  pane: PaneId,
  preset: LayoutPresetId,
  index: number,
): 'primary' | 'secondary' | 'tertiary' {
  if (preset === 'spatial-primary' && pane === 'atlas') return 'primary'
  if (preset === 'research-first' && pane === 'research-hub') return 'primary'
  if (preset === 'design-primary' && pane === 'design-lab') return 'primary'
  if (preset === 'triage-compact' && pane === 'research-hub') return 'primary'
  if (preset === 'export-review' && (pane === 'export-kit' || pane === 'research-hub')) {
    return index === 0 ? 'primary' : 'secondary'
  }
  if (index === 0) return 'primary'
  if (index === 1) return 'secondary'
  return 'tertiary'
}
