/**
 * Plain-language stories for congressional industry-effect desks.
 */

import type { EvidenceScore, ModuleId } from '../../types/core'
import { CONGRESS_STORIES_EXPANSION } from './congressStoriesExpansion'
import { CONGRESS_STORIES_EXPANSION_14 } from './congressStoriesExpansion14'

/** Mirrors InvestigationStory without importing stories.ts (avoids cycles). */
export interface CongressStory {
  useCaseId: string
  title: string
  where: string
  lede: string
  stakes: string
  knownSoFar: string[]
  stillOpen: string[]
  claims: Array<{
    plain: string
    status: 'supported' | 'uncertain' | 'disputed'
    score: EvidenceScore
    why: string
  }>
  surfaces: {
    map: string
    research: string
    design: string
    ladder: string
    analyst: string
    model: string
    export: string
    sources: string
  }
  tabLabels: Partial<Record<ModuleId, string>>
  nextStep: string
}

function statusFromScore(score: EvidenceScore): 'supported' | 'uncertain' | 'disputed' {
  if (score === 1) return 'supported'
  if (score === -1) return 'disputed'
  return 'uncertain'
}

export const CONGRESS_STORIES: Record<string, CongressStory> = {
  'cong-01-ai-frontier': {
    useCaseId: 'cong-01-ai-frontier',
    title: 'Frontier AI oversight / model risk',
    where: 'Washington, DC · national industry effects',
    lede:
      'This desk is a training investigation into how oversight and potential rules affect foundation model labs, cloud hyperscalers, enterprise AI vendors. It is not legal advice. Use official Congress, agency, GAO, and CRS materials to score compliance cost, market structure, liability, and capital access.',
    stakes:
      'Private operators need durable evidence on cost and liability — not partisan cheerleading. Wrong scores can mislead export packages and working documents.',
    knownSoFar: [
      'Public agencies and Congress publish materials operators can cite as primary or official secondary.',
      'Industry effects show up first in compliance programs, contracts, and capital planning.',
      'GAO and CRS often summarize program design without endorsing a political outcome.',
    ],
    stillOpen: [
      'Final statutory text and effective dates may still move.',
      'Quantified compliance cost ranges need firm-specific primary.',
      'Enforcement posture can shift faster than statute.',
      'Cross-border or state interactions may dominate for some firms.',
    ],
    claims: [
      {
        plain: 'Congress and agencies have published AI risk frameworks and hearing records operators can cite as public-record anchors.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Enterprise buyers face rising contractual and compliance due-diligence costs when deploying frontier models.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'A single federal AI licensing regime will pass in the current session with stable text.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Model evaluation benchmarks fully capture deployment risk for all industry verticals.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      }
    ],
    surfaces: {
      map: 'Capitol-region pin for the oversight desk; industry effects are often national.',
      research: 'Score claims with agency and Congress primary; demote social-only +1.',
      design: 'Model compliance axes (reporting burden, liability, market access) not physical roads.',
      ladder: 'Raise detail only with source hierarchy intact.',
      analyst: 'Use sme tech and governance lenses; multi-select batch runs welcome.',
      model: 'Lightweight scene objects for hearing-room / filing metaphors only.',
      export: 'Layer-0 for packages; no unresolved −1.',
      sources: 'Prefer congress.gov, GAO, CRS, and named agency homes.',
    },
    tabLabels: {
      'research-hub': 'Claims',
      atlas: 'Desk map',
      'sme-lenses': 'SME',
      analyst: 'Commands',
      'export-kit': 'Export',
    },
    nextStep: 'Open Active sources, run an SME multi-select (governance + technical), and lock verification steps into the working document.',
  },
  'cong-02-bigtech-competition': {
    useCaseId: 'cong-02-bigtech-competition',
    title: 'Large platform competition / antitrust oversight',
    where: 'Washington, DC · national industry effects',
    lede:
      'This desk is a training investigation into how oversight and potential rules affect large digital platforms, app stores, advertisers, complementary software vendors. It is not legal advice. Use official Congress, agency, GAO, and CRS materials to score compliance cost, market structure, liability, and capital access.',
    stakes:
      'Private operators need durable evidence on cost and liability — not partisan cheerleading. Wrong scores can mislead export packages and working documents.',
    knownSoFar: [
      'Public agencies and Congress publish materials operators can cite as primary or official secondary.',
      'Industry effects show up first in compliance programs, contracts, and capital planning.',
      'GAO and CRS often summarize program design without endorsing a political outcome.',
    ],
    stillOpen: [
      'Final statutory text and effective dates may still move.',
      'Quantified compliance cost ranges need firm-specific primary.',
      'Enforcement posture can shift faster than statute.',
      'Cross-border or state interactions may dominate for some firms.',
    ],
    claims: [
      {
        plain: 'DOJ and FTC maintain public case dockets and competition policy statements affecting platform conduct.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Remedies and conduct rules can raise compliance and product design costs for platforms and partners.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'A single structural breakup remedy is certain for every major platform this Congress.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Advertiser switching costs are fully measured in public filings for all verticals.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      }
    ],
    surfaces: {
      map: 'Capitol-region pin for the oversight desk; industry effects are often national.',
      research: 'Score claims with agency and Congress primary; demote social-only +1.',
      design: 'Model compliance axes (reporting burden, liability, market access) not physical roads.',
      ladder: 'Raise detail only with source hierarchy intact.',
      analyst: 'Use sme tech and governance lenses; multi-select batch runs welcome.',
      model: 'Lightweight scene objects for hearing-room / filing metaphors only.',
      export: 'Layer-0 for packages; no unresolved −1.',
      sources: 'Prefer congress.gov, GAO, CRS, and named agency homes.',
    },
    tabLabels: {
      'research-hub': 'Claims',
      atlas: 'Desk map',
      'sme-lenses': 'SME',
      analyst: 'Commands',
      'export-kit': 'Export',
    },
    nextStep: 'Open Active sources, run an SME multi-select (governance + technical), and lock verification steps into the working document.',
  },
  'cong-03-section-230': {
    useCaseId: 'cong-03-section-230',
    title: 'Intermediary liability / Section 230 reform stakes',
    where: 'Washington, DC · national industry effects',
    lede:
      'This desk is a training investigation into how oversight and potential rules affect online platforms, hosting providers, moderation tooling vendors. It is not legal advice. Use official Congress, agency, GAO, and CRS materials to score compliance cost, market structure, liability, and capital access.',
    stakes:
      'Private operators need durable evidence on cost and liability — not partisan cheerleading. Wrong scores can mislead export packages and working documents.',
    knownSoFar: [
      'Public agencies and Congress publish materials operators can cite as primary or official secondary.',
      'Industry effects show up first in compliance programs, contracts, and capital planning.',
      'GAO and CRS often summarize program design without endorsing a political outcome.',
    ],
    stillOpen: [
      'Final statutory text and effective dates may still move.',
      'Quantified compliance cost ranges need firm-specific primary.',
      'Enforcement posture can shift faster than statute.',
      'Cross-border or state interactions may dominate for some firms.',
    ],
    claims: [
      {
        plain: 'Section 230 remains a statutory baseline; reform proposals are tracked on Congress.gov.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Liability redesign would change insurance, moderation staffing, and product risk for intermediaries.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Reform language is stable enough for multi-year capital planning without further amendment risk.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'All platforms would face identical compliance costs under any reform variant.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      }
    ],
    surfaces: {
      map: 'Capitol-region pin for the oversight desk; industry effects are often national.',
      research: 'Score claims with agency and Congress primary; demote social-only +1.',
      design: 'Model compliance axes (reporting burden, liability, market access) not physical roads.',
      ladder: 'Raise detail only with source hierarchy intact.',
      analyst: 'Use sme tech and governance lenses; multi-select batch runs welcome.',
      model: 'Lightweight scene objects for hearing-room / filing metaphors only.',
      export: 'Layer-0 for packages; no unresolved −1.',
      sources: 'Prefer congress.gov, GAO, CRS, and named agency homes.',
    },
    tabLabels: {
      'research-hub': 'Claims',
      atlas: 'Desk map',
      'sme-lenses': 'SME',
      analyst: 'Commands',
      'export-kit': 'Export',
    },
    nextStep: 'Open Active sources, run an SME multi-select (governance + technical), and lock verification steps into the working document.',
  },
  'cong-04-consumer-privacy': {
    useCaseId: 'cong-04-consumer-privacy',
    title: 'Federal privacy / data broker industry effects',
    where: 'Washington, DC · national industry effects',
    lede:
      'This desk is a training investigation into how oversight and potential rules affect data brokers, adtech, retailers with loyalty graphs, SaaS processors. It is not legal advice. Use official Congress, agency, GAO, and CRS materials to score compliance cost, market structure, liability, and capital access.',
    stakes:
      'Private operators need durable evidence on cost and liability — not partisan cheerleading. Wrong scores can mislead export packages and working documents.',
    knownSoFar: [
      'Public agencies and Congress publish materials operators can cite as primary or official secondary.',
      'Industry effects show up first in compliance programs, contracts, and capital planning.',
      'GAO and CRS often summarize program design without endorsing a political outcome.',
    ],
    stillOpen: [
      'Final statutory text and effective dates may still move.',
      'Quantified compliance cost ranges need firm-specific primary.',
      'Enforcement posture can shift faster than statute.',
      'Cross-border or state interactions may dominate for some firms.',
    ],
    claims: [
      {
        plain: 'FTC and Congress publish privacy enforcement and bill materials affecting broker models.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Uniform federal rules could reduce multi-state patchwork costs but raise baseline controls spend.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'A comprehensive federal privacy law will pre-empt all state regimes without carve-outs.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Data broker revenue impact is precisely known from public filings alone.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      }
    ],
    surfaces: {
      map: 'Capitol-region pin for the oversight desk; industry effects are often national.',
      research: 'Score claims with agency and Congress primary; demote social-only +1.',
      design: 'Model compliance axes (reporting burden, liability, market access) not physical roads.',
      ladder: 'Raise detail only with source hierarchy intact.',
      analyst: 'Use sme tech and governance lenses; multi-select batch runs welcome.',
      model: 'Lightweight scene objects for hearing-room / filing metaphors only.',
      export: 'Layer-0 for packages; no unresolved −1.',
      sources: 'Prefer congress.gov, GAO, CRS, and named agency homes.',
    },
    tabLabels: {
      'research-hub': 'Claims',
      atlas: 'Desk map',
      'sme-lenses': 'SME',
      analyst: 'Commands',
      'export-kit': 'Export',
    },
    nextStep: 'Open Active sources, run an SME multi-select (governance + technical), and lock verification steps into the working document.',
  },
  'cong-05-health-algo-pbm': {
    useCaseId: 'cong-05-health-algo-pbm',
    title: 'Health plan algorithms and PBM transparency',
    where: 'Washington, DC · national industry effects',
    lede:
      'This desk is a training investigation into how oversight and potential rules affect PBMs, health plans, pharmacies, digital health vendors. It is not legal advice. Use official Congress, agency, GAO, and CRS materials to score compliance cost, market structure, liability, and capital access.',
    stakes:
      'Private operators need durable evidence on cost and liability — not partisan cheerleading. Wrong scores can mislead export packages and working documents.',
    knownSoFar: [
      'Public agencies and Congress publish materials operators can cite as primary or official secondary.',
      'Industry effects show up first in compliance programs, contracts, and capital planning.',
      'GAO and CRS often summarize program design without endorsing a political outcome.',
    ],
    stillOpen: [
      'Final statutory text and effective dates may still move.',
      'Quantified compliance cost ranges need firm-specific primary.',
      'Enforcement posture can shift faster than statute.',
      'Cross-border or state interactions may dominate for some firms.',
    ],
    claims: [
      {
        plain: 'Congress and agencies have open dockets on PBM transparency and plan algorithm oversight.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Transparency rules raise reporting and audit costs for PBMs and contracted pharmacies.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Algorithm disclosure will fully eliminate formulary disputes.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Patient out-of-pocket effects are uniform across all plan designs.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      }
    ],
    surfaces: {
      map: 'Capitol-region pin for the oversight desk; industry effects are often national.',
      research: 'Score claims with agency and Congress primary; demote social-only +1.',
      design: 'Model compliance axes (reporting burden, liability, market access) not physical roads.',
      ladder: 'Raise detail only with source hierarchy intact.',
      analyst: 'Use sme tech and governance lenses; multi-select batch runs welcome.',
      model: 'Lightweight scene objects for hearing-room / filing metaphors only.',
      export: 'Layer-0 for packages; no unresolved −1.',
      sources: 'Prefer congress.gov, GAO, CRS, and named agency homes.',
    },
    tabLabels: {
      'research-hub': 'Claims',
      atlas: 'Desk map',
      'sme-lenses': 'SME',
      analyst: 'Commands',
      'export-kit': 'Export',
    },
    nextStep: 'Open Active sources, run an SME multi-select (governance + technical), and lock verification steps into the working document.',
  },
  'cong-06-drug-pricing': {
    useCaseId: 'cong-06-drug-pricing',
    title: 'Prescription drug pricing oversight',
    where: 'Washington, DC · national industry effects',
    lede:
      'This desk is a training investigation into how oversight and potential rules affect manufacturers, wholesalers, pharmacies, plan sponsors. It is not legal advice. Use official Congress, agency, GAO, and CRS materials to score compliance cost, market structure, liability, and capital access.',
    stakes:
      'Private operators need durable evidence on cost and liability — not partisan cheerleading. Wrong scores can mislead export packages and working documents.',
    knownSoFar: [
      'Public agencies and Congress publish materials operators can cite as primary or official secondary.',
      'Industry effects show up first in compliance programs, contracts, and capital planning.',
      'GAO and CRS often summarize program design without endorsing a political outcome.',
    ],
    stillOpen: [
      'Final statutory text and effective dates may still move.',
      'Quantified compliance cost ranges need firm-specific primary.',
      'Enforcement posture can shift faster than statute.',
      'Cross-border or state interactions may dominate for some firms.',
    ],
    claims: [
      {
        plain: 'CMS and HHS publish program rules affecting manufacturer pricing negotiations and reporting.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Pricing policy shifts change launch strategy, formulary access, and rebate contracting.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'List price cuts always flow dollar-for-dollar to every patient at retail.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'R and D investment response is fully measurable from a single earnings call.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      }
    ],
    surfaces: {
      map: 'Capitol-region pin for the oversight desk; industry effects are often national.',
      research: 'Score claims with agency and Congress primary; demote social-only +1.',
      design: 'Model compliance axes (reporting burden, liability, market access) not physical roads.',
      ladder: 'Raise detail only with source hierarchy intact.',
      analyst: 'Use sme tech and governance lenses; multi-select batch runs welcome.',
      model: 'Lightweight scene objects for hearing-room / filing metaphors only.',
      export: 'Layer-0 for packages; no unresolved −1.',
      sources: 'Prefer congress.gov, GAO, CRS, and named agency homes.',
    },
    tabLabels: {
      'research-hub': 'Claims',
      atlas: 'Desk map',
      'sme-lenses': 'SME',
      analyst: 'Commands',
      'export-kit': 'Export',
    },
    nextStep: 'Open Active sources, run an SME multi-select (governance + technical), and lock verification steps into the working document.',
  },
  'cong-07-hospital-consolidation': {
    useCaseId: 'cong-07-hospital-consolidation',
    title: 'Hospital and payer consolidation',
    where: 'Washington, DC · national industry effects',
    lede:
      'This desk is a training investigation into how oversight and potential rules affect hospital systems, insurers, physician groups, PE-backed platforms. It is not legal advice. Use official Congress, agency, GAO, and CRS materials to score compliance cost, market structure, liability, and capital access.',
    stakes:
      'Private operators need durable evidence on cost and liability — not partisan cheerleading. Wrong scores can mislead export packages and working documents.',
    knownSoFar: [
      'Public agencies and Congress publish materials operators can cite as primary or official secondary.',
      'Industry effects show up first in compliance programs, contracts, and capital planning.',
      'GAO and CRS often summarize program design without endorsing a political outcome.',
    ],
    stillOpen: [
      'Final statutory text and effective dates may still move.',
      'Quantified compliance cost ranges need firm-specific primary.',
      'Enforcement posture can shift faster than statute.',
      'Cross-border or state interactions may dominate for some firms.',
    ],
    claims: [
      {
        plain: 'FTC and DOJ publish merger challenges and policy statements on healthcare concentration.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Consolidation can alter payer-provider bargaining and local service lines.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Every hospital merger raises prices in every market by the same percent.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Cross-market system effects are fully settled in public literature.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      }
    ],
    surfaces: {
      map: 'Capitol-region pin for the oversight desk; industry effects are often national.',
      research: 'Score claims with agency and Congress primary; demote social-only +1.',
      design: 'Model compliance axes (reporting burden, liability, market access) not physical roads.',
      ladder: 'Raise detail only with source hierarchy intact.',
      analyst: 'Use sme tech and governance lenses; multi-select batch runs welcome.',
      model: 'Lightweight scene objects for hearing-room / filing metaphors only.',
      export: 'Layer-0 for packages; no unresolved −1.',
      sources: 'Prefer congress.gov, GAO, CRS, and named agency homes.',
    },
    tabLabels: {
      'research-hub': 'Claims',
      atlas: 'Desk map',
      'sme-lenses': 'SME',
      analyst: 'Commands',
      'export-kit': 'Export',
    },
    nextStep: 'Open Active sources, run an SME multi-select (governance + technical), and lock verification steps into the working document.',
  },
  'cong-08-energy-permitting': {
    useCaseId: 'cong-08-energy-permitting',
    title: 'Energy permitting, LNG, and grid reliability',
    where: 'Washington, DC · national industry effects',
    lede:
      'This desk is a training investigation into how oversight and potential rules affect developers, LNG exporters, transmission owners, EPCs. It is not legal advice. Use official Congress, agency, GAO, and CRS materials to score compliance cost, market structure, liability, and capital access.',
    stakes:
      'Private operators need durable evidence on cost and liability — not partisan cheerleading. Wrong scores can mislead export packages and working documents.',
    knownSoFar: [
      'Public agencies and Congress publish materials operators can cite as primary or official secondary.',
      'Industry effects show up first in compliance programs, contracts, and capital planning.',
      'GAO and CRS often summarize program design without endorsing a political outcome.',
    ],
    stillOpen: [
      'Final statutory text and effective dates may still move.',
      'Quantified compliance cost ranges need firm-specific primary.',
      'Enforcement posture can shift faster than statute.',
      'Cross-border or state interactions may dominate for some firms.',
    ],
    claims: [
      {
        plain: 'FERC and DOE host public dockets and reliability materials affecting project timelines.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Permitting duration is a material cost and financing variable for developers.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'A single permitting reform bill eliminates all NEPA litigation risk.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'LNG export approvals have identical local and global price effects in all scenarios.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      }
    ],
    surfaces: {
      map: 'Capitol-region pin for the oversight desk; industry effects are often national.',
      research: 'Score claims with agency and Congress primary; demote social-only +1.',
      design: 'Model compliance axes (reporting burden, liability, market access) not physical roads.',
      ladder: 'Raise detail only with source hierarchy intact.',
      analyst: 'Use sme tech and governance lenses; multi-select batch runs welcome.',
      model: 'Lightweight scene objects for hearing-room / filing metaphors only.',
      export: 'Layer-0 for packages; no unresolved −1.',
      sources: 'Prefer congress.gov, GAO, CRS, and named agency homes.',
    },
    tabLabels: {
      'research-hub': 'Claims',
      atlas: 'Desk map',
      'sme-lenses': 'SME',
      analyst: 'Commands',
      'export-kit': 'Export',
    },
    nextStep: 'Open Active sources, run an SME multi-select (governance + technical), and lock verification steps into the working document.',
  },
  'cong-09-critical-minerals': {
    useCaseId: 'cong-09-critical-minerals',
    title: 'Critical minerals and supply chain',
    where: 'Washington, DC · national industry effects',
    lede:
      'This desk is a training investigation into how oversight and potential rules affect miners, processors, battery OEMs, defense primes. It is not legal advice. Use official Congress, agency, GAO, and CRS materials to score compliance cost, market structure, liability, and capital access.',
    stakes:
      'Private operators need durable evidence on cost and liability — not partisan cheerleading. Wrong scores can mislead export packages and working documents.',
    knownSoFar: [
      'Public agencies and Congress publish materials operators can cite as primary or official secondary.',
      'Industry effects show up first in compliance programs, contracts, and capital planning.',
      'GAO and CRS often summarize program design without endorsing a political outcome.',
    ],
    stillOpen: [
      'Final statutory text and effective dates may still move.',
      'Quantified compliance cost ranges need firm-specific primary.',
      'Enforcement posture can shift faster than statute.',
      'Cross-border or state interactions may dominate for some firms.',
    ],
    claims: [
      {
        plain: 'USGS and DOE publish mineral criticality and program materials used in industrial planning.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Processing capacity and offtake contracts are industry bottlenecks beyond mine permits.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Domestic mining alone solves refined chemical intermediate shortfalls this decade.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Price spikes map one-to-one to mine output without inventory or substitution effects.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      }
    ],
    surfaces: {
      map: 'Capitol-region pin for the oversight desk; industry effects are often national.',
      research: 'Score claims with agency and Congress primary; demote social-only +1.',
      design: 'Model compliance axes (reporting burden, liability, market access) not physical roads.',
      ladder: 'Raise detail only with source hierarchy intact.',
      analyst: 'Use sme tech and governance lenses; multi-select batch runs welcome.',
      model: 'Lightweight scene objects for hearing-room / filing metaphors only.',
      export: 'Layer-0 for packages; no unresolved −1.',
      sources: 'Prefer congress.gov, GAO, CRS, and named agency homes.',
    },
    tabLabels: {
      'research-hub': 'Claims',
      atlas: 'Desk map',
      'sme-lenses': 'SME',
      analyst: 'Commands',
      'export-kit': 'Export',
    },
    nextStep: 'Open Active sources, run an SME multi-select (governance + technical), and lock verification steps into the working document.',
  },
  'cong-10-defense-contracting': {
    useCaseId: 'cong-10-defense-contracting',
    title: 'Defense contractor oversight and waste-fraud-abuse desk',
    where: 'Arlington, VA / DC · national industry effects',
    lede:
      'This desk is a training investigation into how oversight and potential rules affect defense primes, subcontractors, services firms. It is not legal advice. Use official Congress, agency, GAO, and CRS materials to score compliance cost, market structure, liability, and capital access.',
    stakes:
      'Private operators need durable evidence on cost and liability — not partisan cheerleading. Wrong scores can mislead export packages and working documents.',
    knownSoFar: [
      'Public agencies and Congress publish materials operators can cite as primary or official secondary.',
      'Industry effects show up first in compliance programs, contracts, and capital planning.',
      'GAO and CRS often summarize program design without endorsing a political outcome.',
    ],
    stillOpen: [
      'Final statutory text and effective dates may still move.',
      'Quantified compliance cost ranges need firm-specific primary.',
      'Enforcement posture can shift faster than statute.',
      'Cross-border or state interactions may dominate for some firms.',
    ],
    claims: [
      {
        plain: 'GAO and Congress publish recurring acquisition and waste-fraud-abuse findings.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Cost accounting and cybersecurity requirements raise subcontractor barriers to entry.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Every cost overrun is intentional fraud without further evidence.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Prime-sub cash flow stress is uniform across all program types.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      }
    ],
    surfaces: {
      map: 'Capitol-region pin for the oversight desk; industry effects are often national.',
      research: 'Score claims with agency and Congress primary; demote social-only +1.',
      design: 'Model compliance axes (reporting burden, liability, market access) not physical roads.',
      ladder: 'Raise detail only with source hierarchy intact.',
      analyst: 'Use sme tech and governance lenses; multi-select batch runs welcome.',
      model: 'Lightweight scene objects for hearing-room / filing metaphors only.',
      export: 'Layer-0 for packages; no unresolved −1.',
      sources: 'Prefer congress.gov, GAO, CRS, and named agency homes.',
    },
    tabLabels: {
      'research-hub': 'Claims',
      atlas: 'Desk map',
      'sme-lenses': 'SME',
      analyst: 'Commands',
      'export-kit': 'Export',
    },
    nextStep: 'Open Active sources, run an SME multi-select (governance + technical), and lock verification steps into the working document.',
  },
  'cong-11-cfius-tech': {
    useCaseId: 'cong-11-cfius-tech',
    title: 'Foreign investment in sensitive tech (CFIUS-shaped desk)',
    where: 'Washington, DC · national industry effects',
    lede:
      'This desk is a training investigation into how oversight and potential rules affect VC and PE, strategic acquirers, semiconductors, AI, dual-use startups. It is not legal advice. Use official Congress, agency, GAO, and CRS materials to score compliance cost, market structure, liability, and capital access.',
    stakes:
      'Private operators need durable evidence on cost and liability — not partisan cheerleading. Wrong scores can mislead export packages and working documents.',
    knownSoFar: [
      'Public agencies and Congress publish materials operators can cite as primary or official secondary.',
      'Industry effects show up first in compliance programs, contracts, and capital planning.',
      'GAO and CRS often summarize program design without endorsing a political outcome.',
    ],
    stillOpen: [
      'Final statutory text and effective dates may still move.',
      'Quantified compliance cost ranges need firm-specific primary.',
      'Enforcement posture can shift faster than statute.',
      'Cross-border or state interactions may dominate for some firms.',
    ],
    claims: [
      {
        plain: 'Treasury publishes CFIUS process materials affecting covered transactions.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Filing timelines and mitigation agreements change deal certainty and counsel spend.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'All minority VC rounds from allied funds are identically covered.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Mitigation always blocks technology collaboration entirely.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      }
    ],
    surfaces: {
      map: 'Capitol-region pin for the oversight desk; industry effects are often national.',
      research: 'Score claims with agency and Congress primary; demote social-only +1.',
      design: 'Model compliance axes (reporting burden, liability, market access) not physical roads.',
      ladder: 'Raise detail only with source hierarchy intact.',
      analyst: 'Use sme tech and governance lenses; multi-select batch runs welcome.',
      model: 'Lightweight scene objects for hearing-room / filing metaphors only.',
      export: 'Layer-0 for packages; no unresolved −1.',
      sources: 'Prefer congress.gov, GAO, CRS, and named agency homes.',
    },
    tabLabels: {
      'research-hub': 'Claims',
      atlas: 'Desk map',
      'sme-lenses': 'SME',
      analyst: 'Commands',
      'export-kit': 'Export',
    },
    nextStep: 'Open Active sources, run an SME multi-select (governance + technical), and lock verification steps into the working document.',
  },
  'cong-12-digital-assets': {
    useCaseId: 'cong-12-digital-assets',
    title: 'Digital assets and market structure',
    where: 'Washington, DC · national industry effects',
    lede:
      'This desk is a training investigation into how oversight and potential rules affect exchanges, custodians, issuers, broker-dealers exploring crypto rails. It is not legal advice. Use official Congress, agency, GAO, and CRS materials to score compliance cost, market structure, liability, and capital access.',
    stakes:
      'Private operators need durable evidence on cost and liability — not partisan cheerleading. Wrong scores can mislead export packages and working documents.',
    knownSoFar: [
      'Public agencies and Congress publish materials operators can cite as primary or official secondary.',
      'Industry effects show up first in compliance programs, contracts, and capital planning.',
      'GAO and CRS often summarize program design without endorsing a political outcome.',
    ],
    stillOpen: [
      'Final statutory text and effective dates may still move.',
      'Quantified compliance cost ranges need firm-specific primary.',
      'Enforcement posture can shift faster than statute.',
      'Cross-border or state interactions may dominate for some firms.',
    ],
    claims: [
      {
        plain: 'SEC and CFTC plus Congress publish market-structure materials affecting token platforms.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Custody, disclosure, and registration paths drive industry compliance architecture.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'A single market-structure bill settles all security versus commodity classifications permanently.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Retail loss statistics from one exchange generalize to all venues.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      }
    ],
    surfaces: {
      map: 'Capitol-region pin for the oversight desk; industry effects are often national.',
      research: 'Score claims with agency and Congress primary; demote social-only +1.',
      design: 'Model compliance axes (reporting burden, liability, market access) not physical roads.',
      ladder: 'Raise detail only with source hierarchy intact.',
      analyst: 'Use sme tech and governance lenses; multi-select batch runs welcome.',
      model: 'Lightweight scene objects for hearing-room / filing metaphors only.',
      export: 'Layer-0 for packages; no unresolved −1.',
      sources: 'Prefer congress.gov, GAO, CRS, and named agency homes.',
    },
    tabLabels: {
      'research-hub': 'Claims',
      atlas: 'Desk map',
      'sme-lenses': 'SME',
      analyst: 'Commands',
      'export-kit': 'Export',
    },
    nextStep: 'Open Active sources, run an SME multi-select (governance + technical), and lock verification steps into the working document.',
  },
  'cong-13-fintech-consumer': {
    useCaseId: 'cong-13-fintech-consumer',
    title: 'Fintech and consumer financial protection',
    where: 'Washington, DC · national industry effects',
    lede:
      'This desk is a training investigation into how oversight and potential rules affect fintech lenders, payment apps, banks partnering with fintechs. It is not legal advice. Use official Congress, agency, GAO, and CRS materials to score compliance cost, market structure, liability, and capital access.',
    stakes:
      'Private operators need durable evidence on cost and liability — not partisan cheerleading. Wrong scores can mislead export packages and working documents.',
    knownSoFar: [
      'Public agencies and Congress publish materials operators can cite as primary or official secondary.',
      'Industry effects show up first in compliance programs, contracts, and capital planning.',
      'GAO and CRS often summarize program design without endorsing a political outcome.',
    ],
    stillOpen: [
      'Final statutory text and effective dates may still move.',
      'Quantified compliance cost ranges need firm-specific primary.',
      'Enforcement posture can shift faster than statute.',
      'Cross-border or state interactions may dominate for some firms.',
    ],
    claims: [
      {
        plain: 'CFPB publishes rules and enforcement that set compliance baselines for consumer fintech.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Bank-fintech partnerships reallocate compliance and reputational risk via contracts.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Open banking mandates have identical cost for all asset sizes.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'APR comparisons alone capture total consumer cost of credit products.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      }
    ],
    surfaces: {
      map: 'Capitol-region pin for the oversight desk; industry effects are often national.',
      research: 'Score claims with agency and Congress primary; demote social-only +1.',
      design: 'Model compliance axes (reporting burden, liability, market access) not physical roads.',
      ladder: 'Raise detail only with source hierarchy intact.',
      analyst: 'Use sme tech and governance lenses; multi-select batch runs welcome.',
      model: 'Lightweight scene objects for hearing-room / filing metaphors only.',
      export: 'Layer-0 for packages; no unresolved −1.',
      sources: 'Prefer congress.gov, GAO, CRS, and named agency homes.',
    },
    tabLabels: {
      'research-hub': 'Claims',
      atlas: 'Desk map',
      'sme-lenses': 'SME',
      analyst: 'Commands',
      'export-kit': 'Export',
    },
    nextStep: 'Open Active sources, run an SME multi-select (governance + technical), and lock verification steps into the working document.',
  },
  'cong-14-chips-semiconductor': {
    useCaseId: 'cong-14-chips-semiconductor',
    title: 'Semiconductor incentives and CHIPS implementation',
    where: 'Washington, DC · national industry effects',
    lede:
      'This desk is a training investigation into how oversight and potential rules affect fabs, equipment suppliers, OSATs, materials vendors. It is not legal advice. Use official Congress, agency, GAO, and CRS materials to score compliance cost, market structure, liability, and capital access.',
    stakes:
      'Private operators need durable evidence on cost and liability — not partisan cheerleading. Wrong scores can mislead export packages and working documents.',
    knownSoFar: [
      'Public agencies and Congress publish materials operators can cite as primary or official secondary.',
      'Industry effects show up first in compliance programs, contracts, and capital planning.',
      'GAO and CRS often summarize program design without endorsing a political outcome.',
    ],
    stillOpen: [
      'Final statutory text and effective dates may still move.',
      'Quantified compliance cost ranges need firm-specific primary.',
      'Enforcement posture can shift faster than statute.',
      'Cross-border or state interactions may dominate for some firms.',
    ],
    claims: [
      {
        plain: 'NIST and Commerce publish CHIPS program notices affecting award compliance and guardrails.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Incentive guardrails shape site selection and partner diligence for fabs and suppliers.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Every awarded fab will reach nameplate capacity on the original public timeline.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Workforce constraints are identical across all U.S. regions.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      }
    ],
    surfaces: {
      map: 'Capitol-region pin for the oversight desk; industry effects are often national.',
      research: 'Score claims with agency and Congress primary; demote social-only +1.',
      design: 'Model compliance axes (reporting burden, liability, market access) not physical roads.',
      ladder: 'Raise detail only with source hierarchy intact.',
      analyst: 'Use sme tech and governance lenses; multi-select batch runs welcome.',
      model: 'Lightweight scene objects for hearing-room / filing metaphors only.',
      export: 'Layer-0 for packages; no unresolved −1.',
      sources: 'Prefer congress.gov, GAO, CRS, and named agency homes.',
    },
    tabLabels: {
      'research-hub': 'Claims',
      atlas: 'Desk map',
      'sme-lenses': 'SME',
      analyst: 'Commands',
      'export-kit': 'Export',
    },
    nextStep: 'Open Active sources, run an SME multi-select (governance + technical), and lock verification steps into the working document.',
  },
  'cong-15-auto-av-safety': {
    useCaseId: 'cong-15-auto-av-safety',
    title: 'Auto safety, AV, and NHTSA oversight',
    where: 'Washington, DC · national industry effects',
    lede:
      'This desk is a training investigation into how oversight and potential rules affect OEMs, AV stack vendors, suppliers, fleet operators. It is not legal advice. Use official Congress, agency, GAO, and CRS materials to score compliance cost, market structure, liability, and capital access.',
    stakes:
      'Private operators need durable evidence on cost and liability — not partisan cheerleading. Wrong scores can mislead export packages and working documents.',
    knownSoFar: [
      'Public agencies and Congress publish materials operators can cite as primary or official secondary.',
      'Industry effects show up first in compliance programs, contracts, and capital planning.',
      'GAO and CRS often summarize program design without endorsing a political outcome.',
    ],
    stillOpen: [
      'Final statutory text and effective dates may still move.',
      'Quantified compliance cost ranges need firm-specific primary.',
      'Enforcement posture can shift faster than statute.',
      'Cross-border or state interactions may dominate for some firms.',
    ],
    claims: [
      {
        plain: 'NHTSA publishes defect, recall, and AV policy materials affecting OEM compliance.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'ADS reporting and safety cases change development cost and deployment geography.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Miles-without-crash statistics alone prove citywide readiness.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Liability allocation among OEM, stack vendor, and fleet is uniform nationwide.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      }
    ],
    surfaces: {
      map: 'Capitol-region pin for the oversight desk; industry effects are often national.',
      research: 'Score claims with agency and Congress primary; demote social-only +1.',
      design: 'Model compliance axes (reporting burden, liability, market access) not physical roads.',
      ladder: 'Raise detail only with source hierarchy intact.',
      analyst: 'Use sme tech and governance lenses; multi-select batch runs welcome.',
      model: 'Lightweight scene objects for hearing-room / filing metaphors only.',
      export: 'Layer-0 for packages; no unresolved −1.',
      sources: 'Prefer congress.gov, GAO, CRS, and named agency homes.',
    },
    tabLabels: {
      'research-hub': 'Claims',
      atlas: 'Desk map',
      'sme-lenses': 'SME',
      analyst: 'Commands',
      'export-kit': 'Export',
    },
    nextStep: 'Open Active sources, run an SME multi-select (governance + technical), and lock verification steps into the working document.',
  },
  'cong-16-aviation-cert': {
    useCaseId: 'cong-16-aviation-cert',
    title: 'Aviation certification and OEM supply chain',
    where: 'Washington, DC · national industry effects',
    lede:
      'This desk is a training investigation into how oversight and potential rules affect airframe OEMs, engine makers, tier suppliers, airlines. It is not legal advice. Use official Congress, agency, GAO, and CRS materials to score compliance cost, market structure, liability, and capital access.',
    stakes:
      'Private operators need durable evidence on cost and liability — not partisan cheerleading. Wrong scores can mislead export packages and working documents.',
    knownSoFar: [
      'Public agencies and Congress publish materials operators can cite as primary or official secondary.',
      'Industry effects show up first in compliance programs, contracts, and capital planning.',
      'GAO and CRS often summarize program design without endorsing a political outcome.',
    ],
    stillOpen: [
      'Final statutory text and effective dates may still move.',
      'Quantified compliance cost ranges need firm-specific primary.',
      'Enforcement posture can shift faster than statute.',
      'Cross-border or state interactions may dominate for some firms.',
    ],
    claims: [
      {
        plain: 'FAA certification and airworthiness directive processes drive OEM and supplier cost.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Supply-chain quality escapes and certification lag affect delivery rates and aftermarket.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Every airworthiness directive has identical cost impact across all operators.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Software change classification is trivial for all flight software.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      }
    ],
    surfaces: {
      map: 'Capitol-region pin for the oversight desk; industry effects are often national.',
      research: 'Score claims with agency and Congress primary; demote social-only +1.',
      design: 'Model compliance axes (reporting burden, liability, market access) not physical roads.',
      ladder: 'Raise detail only with source hierarchy intact.',
      analyst: 'Use sme tech and governance lenses; multi-select batch runs welcome.',
      model: 'Lightweight scene objects for hearing-room / filing metaphors only.',
      export: 'Layer-0 for packages; no unresolved −1.',
      sources: 'Prefer congress.gov, GAO, CRS, and named agency homes.',
    },
    tabLabels: {
      'research-hub': 'Claims',
      atlas: 'Desk map',
      'sme-lenses': 'SME',
      analyst: 'Commands',
      'export-kit': 'Export',
    },
    nextStep: 'Open Active sources, run an SME multi-select (governance + technical), and lock verification steps into the working document.',
  },
  'cong-17-fda-pathways': {
    useCaseId: 'cong-17-fda-pathways',
    title: 'FDA pathways — drugs and devices industry impact',
    where: 'Silver Spring / DC · national industry effects',
    lede:
      'This desk is a training investigation into how oversight and potential rules affect sponsors, CROs, device makers, generic and biosimilar firms. It is not legal advice. Use official Congress, agency, GAO, and CRS materials to score compliance cost, market structure, liability, and capital access.',
    stakes:
      'Private operators need durable evidence on cost and liability — not partisan cheerleading. Wrong scores can mislead export packages and working documents.',
    knownSoFar: [
      'Public agencies and Congress publish materials operators can cite as primary or official secondary.',
      'Industry effects show up first in compliance programs, contracts, and capital planning.',
      'GAO and CRS often summarize program design without endorsing a political outcome.',
    ],
    stillOpen: [
      'Final statutory text and effective dates may still move.',
      'Quantified compliance cost ranges need firm-specific primary.',
      'Enforcement posture can shift faster than statute.',
      'Cross-border or state interactions may dominate for some firms.',
    ],
    claims: [
      {
        plain: 'FDA publishes pathway guidance and approval databases used for industry planning.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'User fees, trial design expectations, and CMC controls drive development capital intensity.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Accelerated pathway always means lower total evidence burden for all products.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Device 510(k) predicates remove all clinical uncertainty.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      }
    ],
    surfaces: {
      map: 'Capitol-region pin for the oversight desk; industry effects are often national.',
      research: 'Score claims with agency and Congress primary; demote social-only +1.',
      design: 'Model compliance axes (reporting burden, liability, market access) not physical roads.',
      ladder: 'Raise detail only with source hierarchy intact.',
      analyst: 'Use sme tech and governance lenses; multi-select batch runs welcome.',
      model: 'Lightweight scene objects for hearing-room / filing metaphors only.',
      export: 'Layer-0 for packages; no unresolved −1.',
      sources: 'Prefer congress.gov, GAO, CRS, and named agency homes.',
    },
    tabLabels: {
      'research-hub': 'Claims',
      atlas: 'Desk map',
      'sme-lenses': 'SME',
      analyst: 'Commands',
      'export-kit': 'Export',
    },
    nextStep: 'Open Active sources, run an SME multi-select (governance + technical), and lock verification steps into the working document.',
  },
  'cong-18-climate-disclosure': {
    useCaseId: 'cong-18-climate-disclosure',
    title: 'Climate and sustainability disclosure — issuer burden',
    where: 'Washington, DC · national industry effects',
    lede:
      'This desk is a training investigation into how oversight and potential rules affect public issuers, auditors and assurance firms, ESG data vendors. It is not legal advice. Use official Congress, agency, GAO, and CRS materials to score compliance cost, market structure, liability, and capital access.',
    stakes:
      'Private operators need durable evidence on cost and liability — not partisan cheerleading. Wrong scores can mislead export packages and working documents.',
    knownSoFar: [
      'Public agencies and Congress publish materials operators can cite as primary or official secondary.',
      'Industry effects show up first in compliance programs, contracts, and capital planning.',
      'GAO and CRS often summarize program design without endorsing a political outcome.',
    ],
    stillOpen: [
      'Final statutory text and effective dates may still move.',
      'Quantified compliance cost ranges need firm-specific primary.',
      'Enforcement posture can shift faster than statute.',
      'Cross-border or state interactions may dominate for some firms.',
    ],
    claims: [
      {
        plain: 'SEC and related agencies publish disclosure frameworks affecting issuer controls spend.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Scope measurement, assurance, and supplier data requests create industry cost cascades.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'All issuers face identical materiality thresholds regardless of sector.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Litigation risk is fully priced in every industry peer multiple.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      }
    ],
    surfaces: {
      map: 'Capitol-region pin for the oversight desk; industry effects are often national.',
      research: 'Score claims with agency and Congress primary; demote social-only +1.',
      design: 'Model compliance axes (reporting burden, liability, market access) not physical roads.',
      ladder: 'Raise detail only with source hierarchy intact.',
      analyst: 'Use sme tech and governance lenses; multi-select batch runs welcome.',
      model: 'Lightweight scene objects for hearing-room / filing metaphors only.',
      export: 'Layer-0 for packages; no unresolved −1.',
      sources: 'Prefer congress.gov, GAO, CRS, and named agency homes.',
    },
    tabLabels: {
      'research-hub': 'Claims',
      atlas: 'Desk map',
      'sme-lenses': 'SME',
      analyst: 'Commands',
      'export-kit': 'Export',
    },
    nextStep: 'Open Active sources, run an SME multi-select (governance + technical), and lock verification steps into the working document.',
  },
  'cong-19-labor-platforms': {
    useCaseId: 'cong-19-labor-platforms',
    title: 'Labor, platform work, and NLRB-shaped oversight',
    where: 'Washington, DC · national industry effects',
    lede:
      'This desk is a training investigation into how oversight and potential rules affect platform work companies, franchise systems, staffing intermediaries. It is not legal advice. Use official Congress, agency, GAO, and CRS materials to score compliance cost, market structure, liability, and capital access.',
    stakes:
      'Private operators need durable evidence on cost and liability — not partisan cheerleading. Wrong scores can mislead export packages and working documents.',
    knownSoFar: [
      'Public agencies and Congress publish materials operators can cite as primary or official secondary.',
      'Industry effects show up first in compliance programs, contracts, and capital planning.',
      'GAO and CRS often summarize program design without endorsing a political outcome.',
    ],
    stillOpen: [
      'Final statutory text and effective dates may still move.',
      'Quantified compliance cost ranges need firm-specific primary.',
      'Enforcement posture can shift faster than statute.',
      'Cross-border or state interactions may dominate for some firms.',
    ],
    claims: [
      {
        plain: 'NLRB and DOL publish standards affecting classification and collective activity.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Reclassification risk changes benefits cost, control design, and contractor models.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'A single federal test will end all state classification divergence.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Platform take-rates are a pure function of labor status alone.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      }
    ],
    surfaces: {
      map: 'Capitol-region pin for the oversight desk; industry effects are often national.',
      research: 'Score claims with agency and Congress primary; demote social-only +1.',
      design: 'Model compliance axes (reporting burden, liability, market access) not physical roads.',
      ladder: 'Raise detail only with source hierarchy intact.',
      analyst: 'Use sme tech and governance lenses; multi-select batch runs welcome.',
      model: 'Lightweight scene objects for hearing-room / filing metaphors only.',
      export: 'Layer-0 for packages; no unresolved −1.',
      sources: 'Prefer congress.gov, GAO, CRS, and named agency homes.',
    },
    tabLabels: {
      'research-hub': 'Claims',
      atlas: 'Desk map',
      'sme-lenses': 'SME',
      analyst: 'Commands',
      'export-kit': 'Export',
    },
    nextStep: 'Open Active sources, run an SME multi-select (governance + technical), and lock verification steps into the working document.',
  },
  'cong-20-small-business-capital': {
    useCaseId: 'cong-20-small-business-capital',
    title: 'Small business investment and SBIC capital rules',
    where: 'Washington, DC · national industry effects',
    lede:
      'This desk is a training investigation into how oversight and potential rules affect SBIC funds, community banks, small business borrowers, fund counsel. It is not legal advice. Use official Congress, agency, GAO, and CRS materials to score compliance cost, market structure, liability, and capital access.',
    stakes:
      'Private operators need durable evidence on cost and liability — not partisan cheerleading. Wrong scores can mislead export packages and working documents.',
    knownSoFar: [
      'Public agencies and Congress publish materials operators can cite as primary or official secondary.',
      'Industry effects show up first in compliance programs, contracts, and capital planning.',
      'GAO and CRS often summarize program design without endorsing a political outcome.',
    ],
    stillOpen: [
      'Final statutory text and effective dates may still move.',
      'Quantified compliance cost ranges need firm-specific primary.',
      'Enforcement posture can shift faster than statute.',
      'Cross-border or state interactions may dominate for some firms.',
    ],
    claims: [
      {
        plain: 'SBA publishes SBIC program rules affecting leverage and fund formation.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Eligibility and compliance changes alter capital access for underserved markets and fund economics.',
        status: statusFromScore(1 as EvidenceScore),
        score: 1 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'Program changes immediately equalize regional capital availability.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      },
      {
        plain: 'All small business credit gaps are identical across industries.',
        status: statusFromScore(0 as EvidenceScore),
        score: 0 as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      }
    ],
    surfaces: {
      map: 'Capitol-region pin for the oversight desk; industry effects are often national.',
      research: 'Score claims with agency and Congress primary; demote social-only +1.',
      design: 'Model compliance axes (reporting burden, liability, market access) not physical roads.',
      ladder: 'Raise detail only with source hierarchy intact.',
      analyst: 'Use sme tech and governance lenses; multi-select batch runs welcome.',
      model: 'Lightweight scene objects for hearing-room / filing metaphors only.',
      export: 'Layer-0 for packages; no unresolved −1.',
      sources: 'Prefer congress.gov, GAO, CRS, and named agency homes.',
    },
    tabLabels: {
      'research-hub': 'Claims',
      atlas: 'Desk map',
      'sme-lenses': 'SME',
      analyst: 'Commands',
      'export-kit': 'Export',
    },
    nextStep: 'Open Active sources, run an SME multi-select (governance + technical), and lock verification steps into the working document.',
  },
  ...CONGRESS_STORIES_EXPANSION,
  ...CONGRESS_STORIES_EXPANSION_14,
}
