import type { Breakpoint, ViewportSize } from './types'

export function measureViewport(): ViewportSize {
  if (typeof window === 'undefined') return { width: 1440, height: 900 }
  return { width: window.innerWidth, height: window.innerHeight }
}

export function breakpointFor(width: number): Breakpoint {
  if (width >= 1400) return 'wide'
  if (width >= 1100) return 'medium'
  return 'narrow'
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}
