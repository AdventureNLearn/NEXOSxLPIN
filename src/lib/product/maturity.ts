/**
 * Product maturity — single source of truth for experimental labeling.
 * Public builds must present as experimental training software, not finished
 * forensic / legal / production intel platforms.
 */

export const PRODUCT_NAME = 'NEXOSxLPIN'
export const PRODUCT_VERSION = '2.0.0'
/** Semver channel for humans and GitHub */
export const PRODUCT_CHANNEL = 'experimental' as const

export const MATURITY_BADGE = 'EXPERIMENTAL'
export const MATURITY_SHORT = 'Experimental build'

export const TAGLINE =
  'Figure out what is true — before the story runs away with itself.'

export const MATURITY_ONE_LINER =
  'Experimental evidence desk — training and research workbench. Not legal, medical, or forensic software.'

export const MATURITY_BULLETS = [
  'Claim scores are operator judgments, not automated verdicts.',
  'Maps and 3D are illustrative aids — never survey- or crime-scene proof.',
  'Sample desks are for practice. No private personal data belongs in shared packs.',
  'UI and assistive tools will change; treat this as a public experiment.',
] as const

export const DISCLAIMER_TRAINING =
  'Training desks are practice — not legal advice. No private personal data in sample packs.'

export const DISCLAIMER_ILLUSTRATIVE =
  'Illustrative only — not forensic, not certified, not a digital twin of reality.'

export const DISCLAIMER_SHARE =
  'Experimental export — operator work product, not a certified evidence package.'

export const DISCLAIMER_ASSISTANT =
  'Coach suggestions only — you decide every score and every share.'

export const DISCLAIMER_STATUS_BAR =
  'Experimental · training · not legal advice · illustrative maps/3D'

export const GITHUB_DESCRIPTION =
  'Experimental evidence desk — score claims, map place, optional sketches. Training tool, not legal/forensic software.'

/** What is relatively stable vs lab (for Guide / README). */
export const MATURITY_MATRIX = {
  stableCore: [
    'Story pick',
    'Claim scores (+1 / 0 / −1)',
    'Share gate on open disputed lines',
    'Layer-0 high-stakes acknowledgement',
  ],
  beta: [
    'Map + basemaps',
    'Immersive stage layout',
    'Visual Assistant coach',
    'Plain-language module names',
  ],
  lab: [
    '3D / Massing / Forge sketches',
    '252 SME lens catalog',
    'Auto-scale inspection zooms',
    'Mobile / narrow layout',
    'Map layer toggles (explain > filter)',
  ],
  planned: [
    'Claim miner (propose at 0)',
    'Contradiction assistant',
    'SME top-3 recommender',
    'Layer toggles bound to pin visibility',
  ],
} as const
