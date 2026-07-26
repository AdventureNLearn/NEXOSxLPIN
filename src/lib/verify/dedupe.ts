/**
 * Deduplicate claims / evidence by normalized plain text — no twin noise.
 */

export function normalizeClaimText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[''""]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Jaccard on word sets — >0.85 ≈ near-duplicate */
export function textSimilarity(a: string, b: string): number {
  const wa = new Set(normalizeClaimText(a).split(' ').filter((w) => w.length > 2))
  const wb = new Set(normalizeClaimText(b).split(' ').filter((w) => w.length > 2))
  if (!wa.size || !wb.size) return 0
  let inter = 0
  for (const w of wa) if (wb.has(w)) inter++
  const union = wa.size + wb.size - inter
  return union ? inter / union : 0
}

export function dedupeByText<T>(
  items: T[],
  getText: (item: T) => string,
  threshold = 0.85,
): T[] {
  const out: T[] = []
  for (const item of items) {
    const t = getText(item)
    if (!t.trim()) continue
    const dup = out.some((o) => textSimilarity(t, getText(o)) >= threshold)
    if (!dup) out.push(item)
  }
  return out
}

/** Boilerplate patterns from early expansion generators — must not ship as story claims */
const BOILERPLATE_RES = [
  /training investigation into/i,
  /publishes materials relevant to compliance planning/i,
  /social posts alone establish legal duties/i,
  /all firms face identical impacts/i,
  /all firms face identical costs under any rule change/i,
  /congress\.gov search is not enrolled bill text/i,
  /prefer .+ and congress primary materials/i,
  /agency home is a start/i,
  /disqualifying without primary\.?$/i,
]

export function looksLikeBoilerplate(text: string): boolean {
  return BOILERPLATE_RES.some((re) => re.test(text))
}

export function claimPackIsBoilerplate(texts: string[]): boolean {
  if (texts.length < 2) return false
  const hits = texts.filter(looksLikeBoilerplate).length
  return hits / texts.length >= 0.4
}
