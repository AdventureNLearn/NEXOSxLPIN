/**
 * Layer-0 pre-filter — high-stakes action gate.
 * Agnostic: no domain policy baked in; only integrity checks.
 */

import type { EvidenceScore, Layer0State } from '../types/core'
import { uid } from '../types/core'

/** Actions that always require Layer-0 acknowledgment. */
export const HIGH_STAKES_ACTIONS = [
  'export.kit',
  'export.unity',
  'export.three',
  'export.working-document',
  'ladder.promote.L3',
  'ladder.promote.L4',
  'forge.publish',
  'evidence.score.-1',
  'datapack.replace',
  'session.clear',
] as const

export type HighStakesAction = (typeof HIGH_STAKES_ACTIONS)[number] | string

export interface Layer0CheckResult {
  allowed: boolean
  state: Layer0State
  requiresAck: boolean
  message: string
  score: EvidenceScore
}

export function createIdleLayer0(): Layer0State {
  return {
    active: false,
    reason: 'Idle',
    lastCheckedAt: null,
    blockedActions: [],
  }
}

export function isHighStakes(action: string): boolean {
  return HIGH_STAKES_ACTIONS.some(
    (a) => action === a || action.startsWith(`${a}.`) || action.startsWith('export.'),
  )
}

/**
 * Evaluate whether an action may proceed.
 * Layer-0 does not invent domain rules — it enforces explicit ack on high-stakes paths
 * and hard-blocks when an open -1 evidence item is unresolved and action is export.
 */
export function evaluateLayer0(input: {
  action: string
  acknowledged: boolean
  unresolvedNegative: number
  reason?: string
}): Layer0CheckResult {
  const now = new Date().toISOString()
  const high = isHighStakes(input.action)

  if (!high) {
    return {
      allowed: true,
      requiresAck: false,
      score: 1,
      message: 'Routine action — Layer-0 not required.',
      state: {
        active: false,
        reason: 'Routine',
        lastCheckedAt: now,
        blockedActions: [],
      },
    }
  }

  if (input.unresolvedNegative > 0 && input.action.startsWith('export')) {
    return {
      allowed: false,
      requiresAck: true,
      score: -1,
      message: `Export blocked: ${input.unresolvedNegative} unresolved −1 evidence item(s). Resolve or document override.`,
      state: {
        active: true,
        reason: input.reason || 'Unresolved −1 evidence',
        lastCheckedAt: now,
        blockedActions: [input.action],
      },
    }
  }

  if (!input.acknowledged) {
    return {
      allowed: false,
      requiresAck: true,
      score: 0,
      message: `Layer-0 required for “${input.action}”. Acknowledge integrity check to proceed.`,
      state: {
        active: true,
        reason: input.reason || `Pre-filter: ${input.action}`,
        lastCheckedAt: now,
        blockedActions: [input.action],
      },
    }
  }

  return {
    allowed: true,
    requiresAck: false,
    score: 1,
    message: `Layer-0 cleared for “${input.action}”.`,
    state: {
      active: true,
      reason: `Cleared: ${input.action}`,
      lastCheckedAt: now,
      blockedActions: [],
    },
  }
}

export function layer0LogTitle(result: Layer0CheckResult): string {
  return result.allowed ? 'Layer-0 cleared' : 'Layer-0 hold'
}

export function makeLayer0EntryId(): string {
  return uid('l0')
}
