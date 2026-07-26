/**
 * URL / open hardening — tools not media: only http(s), no javascript:, no data: navigations.
 */

const BLOCKED_PROTOCOLS = /^(javascript|data|vbscript|file|blob):/i

/** Return a safe absolute http(s) URL or null. */
export function safeExternalUrl(raw: string | undefined | null): string | null {
  if (!raw || typeof raw !== 'string') return null
  const trimmed = raw.trim()
  if (!trimmed || BLOCKED_PROTOCOLS.test(trimmed)) return null
  try {
    const u = new URL(trimmed, typeof window !== 'undefined' ? window.location.origin : 'https://localhost')
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null
    // Block obvious credential leakage in query (training OPSEC)
    if (/api[_-]?key|secret|password|token=/i.test(u.search)) return null
    return u.href
  } catch {
    return null
  }
}

/** Open in a new tab with noopener/noreferrer. Returns false if blocked. */
export function openSafeExternal(raw: string | undefined | null): boolean {
  const href = safeExternalUrl(raw)
  if (!href) return false
  if (typeof window === 'undefined') return false
  window.open(href, '_blank', 'noopener,noreferrer')
  return true
}

/** Strip control chars from user-facing template text before sending to public Grok. */
export function sanitizePromptText(text: string, maxLen = 12000): string {
  // Strip C0 controls without a control-char character class (lint-safe)
  let out = ''
  for (let i = 0; i < text.length && out.length < maxLen; i++) {
    const code = text.charCodeAt(i)
    if (code === 9 || code === 10 || code === 13 || code >= 32) out += text[i]
  }
  return out.trim()
}
