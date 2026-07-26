import { describe, expect, it } from 'vitest'
import { claimPackIsBoilerplate, looksLikeBoilerplate, dedupeByText } from './dedupe'
import { buildClaimLedger } from './claimLedger'

describe('dedupe / boilerplate', () => {
  it('detects expansion boilerplate', () => {
    expect(looksLikeBoilerplate('BIS publishes materials relevant to compliance planning.')).toBe(
      true,
    )
    expect(
      looksLikeBoilerplate(
        'BIS export-control public pages are a primary-record entry point for operators.',
      ),
    ).toBe(false)
  })

  it('flags boilerplate packs', () => {
    const pack = [
      'Social posts alone establish legal duties for X.',
      'All firms face identical impacts.',
      'Congress.gov search is not enrolled bill text.',
      'Agency publishes materials relevant to compliance planning.',
    ]
    expect(claimPackIsBoilerplate(pack)).toBe(true)
  })

  it('dedupes near twins', () => {
    const items = [
      { t: 'Agency pages are a start for compliance planning on chips.' },
      { t: 'Agency pages are a start for compliance planning on semiconductors.' },
      { t: 'Completely different claim about BVLOS corridors.' },
    ]
    const d = dedupeByText(items, (i) => i.t, 0.7)
    expect(d.length).toBeLessThan(items.length)
    expect(d.some((i) => /BVLOS/.test(i.t))).toBe(true)
  })
})

describe('claim ledger', () => {
  it('builds sourced non-empty ledger for a congress desk', () => {
    const ledger = buildClaimLedger('cong-41-ai-chip-export')
    expect(ledger.length).toBeGreaterThanOrEqual(4)
    expect(ledger.some((c) => c.score === -1)).toBe(true)
    expect(ledger.some((c) => c.sourceIds.length > 0 || c.citations.length > 0)).toBe(true)
    const plains = ledger.map((c) => c.plain)
    expect(claimPackIsBoilerplate(plains)).toBe(false)
  })

  it('replaces boilerplate existing packs', () => {
    const ledger = buildClaimLedger('cong-42-biometric-procurement', [
      {
        plain: 'GAO publishes materials relevant to compliance planning.',
        score: 1,
        why: 'Agency primary start.',
      },
      {
        plain: 'Social posts alone establish legal duties for Biometric proc.',
        score: -1,
        why: 'Disqualifying without primary.',
      },
    ])
    expect(ledger.every((c) => !looksLikeBoilerplate(c.plain) || c.score === -1)).toBe(true)
    // rebuilt pack should not be majority boilerplate templates
    expect(claimPackIsBoilerplate(ledger.map((c) => c.plain))).toBe(false)
  })
})
