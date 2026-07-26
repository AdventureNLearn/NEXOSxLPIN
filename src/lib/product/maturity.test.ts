import { describe, expect, it } from 'vitest'
import {
  MATURITY_BADGE,
  MATURITY_MATRIX,
  PRODUCT_CHANNEL,
  PRODUCT_VERSION,
  DISCLAIMER_SHARE,
  DISCLAIMER_ILLUSTRATIVE,
  GITHUB_DESCRIPTION,
} from './maturity'

describe('product maturity (experimental channel)', () => {
  it('is experimental channel at 2.0.0', () => {
    expect(PRODUCT_CHANNEL).toBe('experimental')
    expect(PRODUCT_VERSION).toBe('2.0.0')
    expect(MATURITY_BADGE).toBe('EXPERIMENTAL')
  })

  it('disclaimers refuse forensic overclaim', () => {
    expect(DISCLAIMER_ILLUSTRATIVE.toLowerCase()).toMatch(/illustrative/)
    expect(DISCLAIMER_ILLUSTRATIVE.toLowerCase()).toMatch(/not forensic/)
    expect(DISCLAIMER_SHARE.toLowerCase()).toMatch(/experimental/)
    expect(DISCLAIMER_SHARE.toLowerCase()).toMatch(/not a certified/)
  })

  it('maturity matrix has four tiers', () => {
    expect(MATURITY_MATRIX.stableCore.length).toBeGreaterThan(0)
    expect(MATURITY_MATRIX.beta.length).toBeGreaterThan(0)
    expect(MATURITY_MATRIX.lab.length).toBeGreaterThan(0)
    expect(MATURITY_MATRIX.planned.length).toBeGreaterThan(0)
  })

  it('GitHub description states experimental training tool', () => {
    expect(GITHUB_DESCRIPTION.toLowerCase()).toMatch(/experimental/)
    expect(GITHUB_DESCRIPTION.toLowerCase()).toMatch(/not legal/)
  })
})
