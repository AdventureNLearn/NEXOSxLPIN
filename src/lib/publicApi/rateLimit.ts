/**
 * Simple client-side rate limit + in-flight cooldown for public APIs.
 */

const lastCall = new Map<string, number>()
const minGapMsDefault = 400

export async function rateLimit(key: string, minGapMs = minGapMsDefault): Promise<void> {
  const now = Date.now()
  const prev = lastCall.get(key) ?? 0
  const wait = minGapMs - (now - prev)
  if (wait > 0) {
    await new Promise((r) => setTimeout(r, wait))
  }
  lastCall.set(key, Date.now())
}

export function clearRateLimit(key?: string): void {
  if (key) lastCall.delete(key)
  else lastCall.clear()
}
