import type { ModuleId } from '../types/core'
import type { LayoutPresetId, PaneId, PaneWeight } from '../types/useCase'

export type Breakpoint = 'wide' | 'medium' | 'narrow'

export interface ViewportSize {
  width: number
  height: number
}

export interface DepthSignals {
  evidenceCount: number
  unscoredCount: number
  openNegatives: number
  researchChars: number
  ladderCurrent: number
  spatialPointCount: number
  conditionAxisCount: number
  graphEdgeCount: number
}

export interface LayoutSlot {
  pane: PaneId
  weight: number
  minPx: number
  pinned: boolean
  /** grid area role */
  region: 'primary' | 'secondary' | 'tertiary'
}

export interface FormattedLayout {
  preset: LayoutPresetId
  breakpoint: Breakpoint
  slots: LayoutSlot[]
  /** CSS grid template areas description */
  mode: 'three-col' | 'two-col' | 'stacked-tabs' | 'single' | 'maximized'
  primaryFraction: number
  secondaryFraction: number
  atlasPinned: boolean
}

export interface FormatLayoutInput {
  openPanes: PaneId[]
  preset: LayoutPresetId
  paneWeights: PaneWeight[]
  signals: DepthSignals
  viewport: ViewportSize
  primaryFraction: number
  secondaryFraction: number
  maximizedPane: ModuleId | null
  singleModuleMode: boolean
  focusedPane: ModuleId | null
}
