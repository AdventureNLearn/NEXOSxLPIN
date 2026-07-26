/**
 * Format + lock tiled layout — no cascade, max 5 panes.
 */

import type { PaneId, PaneWeight } from '../types/useCase'
import { MAX_OPEN_PANES } from '../types/useCase'
import { breakpointFor, clamp } from './measure'
import { PRESET_PRIMARY_FRACTION, preferredRegion } from './presets'
import { computeDepthWeights, isPinned, minPxFor } from './depthWeights'
import type { FormatLayoutInput, FormattedLayout, LayoutSlot } from './types'

export function formatLayout(input: FormatLayoutInput): FormattedLayout {
  const bp = breakpointFor(input.viewport.width)
  const atlasPinned = input.openPanes.includes('atlas') && isPinned('atlas', input.paneWeights)

  if (input.maximizedPane && input.openPanes.includes(input.maximizedPane)) {
    return {
      preset: input.preset,
      breakpoint: bp,
      slots: [
        {
          pane: input.maximizedPane,
          weight: 5,
          minPx: 200,
          pinned: isPinned(input.maximizedPane, input.paneWeights),
          region: 'primary',
        },
      ],
      mode: 'maximized',
      primaryFraction: 1,
      secondaryFraction: 0.5,
      atlasPinned,
    }
  }

  if (input.singleModuleMode || input.openPanes.length <= 1) {
    const pane = input.openPanes[0] ?? input.focusedPane ?? 'information'
    return {
      preset: input.preset,
      breakpoint: bp,
      slots: [
        {
          pane,
          weight: 5,
          minPx: 200,
          pinned: isPinned(pane, input.paneWeights),
          region: 'primary',
        },
      ],
      mode: 'single',
      primaryFraction: 1,
      secondaryFraction: 0.5,
      atlasPinned,
    }
  }

  const weights = computeDepthWeights(input.openPanes, input.paneWeights, input.signals)
  const slots: LayoutSlot[] = input.openPanes.map((pane, index) => ({
    pane,
    weight: weights.get(pane) ?? 2,
    minPx: minPxFor(pane, input.paneWeights),
    pinned: isPinned(pane, input.paneWeights),
    region: preferredRegion(pane, input.preset, index),
  }))

  // Spatial: force Atlas into primary region
  if (input.preset === 'spatial-primary') {
    for (const s of slots) {
      if (s.pane === 'atlas') s.region = 'primary'
      else if (s.region === 'primary') s.region = 'secondary'
    }
  }

  let primaryFraction =
    input.primaryFraction || PRESET_PRIMARY_FRACTION[input.preset] || 0.42
  if (input.preset === 'spatial-primary') {
    // Map column stays dominant — never crush Atlas below ~58%
    primaryFraction = clamp(Math.max(primaryFraction, 0.58), 0.55, 0.78)
  } else if (input.openPanes[0] === 'atlas' || input.openPanes.includes('atlas')) {
    // Even outside spatial-primary, if Atlas is open as primary slot give it room
    const atlasIsPrimary =
      preferredRegion('atlas', input.preset, input.openPanes.indexOf('atlas')) === 'primary' ||
      input.openPanes[0] === 'atlas'
    if (atlasIsPrimary) {
      primaryFraction = clamp(Math.max(primaryFraction, 0.55), 0.5, 0.75)
    } else {
      primaryFraction = clamp(primaryFraction, 0.28, 0.62)
    }
  } else {
    primaryFraction = clamp(primaryFraction, 0.28, 0.62)
  }

  const secondaryFraction = clamp(input.secondaryFraction || 0.55, 0.35, 0.7)

  let mode: FormattedLayout['mode'] = 'three-col'
  if (bp === 'narrow') mode = 'stacked-tabs'
  else if (bp === 'medium' || slots.length === 2) mode = 'two-col'
  else if (slots.length >= 3) mode = 'three-col'
  else mode = 'two-col'

  return {
    preset: input.preset,
    breakpoint: bp,
    slots,
    mode,
    primaryFraction,
    secondaryFraction,
    atlasPinned,
  }
}

/**
 * Open or focus a module in the tiled workspace.
 * Pinned panes never evicted; max MAX_OPEN_PANES.
 */
export function openPaneInWorkspace(
  openPanes: PaneId[],
  pane: PaneId,
  paneWeights: PaneWeight[],
): PaneId[] {
  if (openPanes.includes(pane)) return openPanes
  if (openPanes.length < MAX_OPEN_PANES) return [...openPanes, pane]

  // Evict lowest weight unpinned (prefer tertiary = last)
  let victimIdx = -1
  let victimScore = Infinity
  for (let i = openPanes.length - 1; i >= 0; i--) {
    const p = openPanes[i]!
    if (isPinned(p, paneWeights)) continue
    if (p === 'atlas' && isPinned('atlas', paneWeights)) continue
    const w = paneWeights.find((x) => x.pane === p)?.weight ?? 2
    const score = w + i * 0.01
    if (score < victimScore) {
      victimScore = score
      victimIdx = i
    }
  }
  if (victimIdx < 0) {
    // all pinned — still replace last non-atlas if possible
    victimIdx = openPanes.findIndex((p) => p !== 'atlas')
    if (victimIdx < 0) return openPanes
  }
  const next = [...openPanes]
  next[victimIdx] = pane
  return next
}

export function closePaneInWorkspace(
  openPanes: PaneId[],
  pane: PaneId,
  paneWeights: PaneWeight[],
): PaneId[] {
  if (isPinned(pane, paneWeights) && openPanes.includes(pane)) {
    // allow close only if more than one pane
    if (openPanes.length <= 1) return openPanes
  }
  const next = openPanes.filter((p) => p !== pane)
  return next.length ? next : openPanes
}
