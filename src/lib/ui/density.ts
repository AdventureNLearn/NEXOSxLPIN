/**
 * Workspace density — maximize content on laptop screens.
 */

export type UiDensity = 'comfortable' | 'compact' | 'dense'

export const DENSITY_STORAGE_KEY = 'nexos-lpin-ui-density'

export function loadDensity(): UiDensity {
  try {
    const v = localStorage.getItem(DENSITY_STORAGE_KEY)
    if (v === 'comfortable' || v === 'compact' || v === 'dense') return v
  } catch {
    /* ignore */
  }
  return 'dense'
}

export function saveDensity(d: UiDensity) {
  try {
    localStorage.setItem(DENSITY_STORAGE_KEY, d)
  } catch {
    /* ignore */
  }
}

/** Tailwind-friendly class bundles applied on shell root */
export const DENSITY_CLASS: Record<UiDensity, string> = {
  comfortable: 'nexos-density-comfortable',
  compact: 'nexos-density-compact',
  dense: 'nexos-density-dense',
}
