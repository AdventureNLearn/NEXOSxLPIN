/**
 * Plain-language story layer for each investigation.
 * Maps technical modules → narrative roles (story, map, claims, model, publish).
 */

import type { EvidenceScore, ModuleId } from '../../types/core'
import { getUseCase } from './catalog'
import { getSimulation } from './simulations'
import { CONGRESS_STORIES as CONGRESS_STORIES_FILE } from './congressStories'
import { CONGRESS_STORIES as CONGRESS_STORIES_DESK } from './congressDesks'
import { CORPUS_STORIES } from './storyCorpus100'
import { buildClaimLedger } from '../../lib/verify/claimLedger'
import { claimPackIsBoilerplate } from '../../lib/verify/dedupe'

export type ClaimStatus = 'supported' | 'uncertain' | 'disputed'

export interface StoryClaimCard {
  plain: string
  status: ClaimStatus
  score: EvidenceScore
  why: string
  /** Bound ActiveSource ids for this claim (cited) */
  sourceIds?: string[]
  /** Human-readable citation labels */
  citations?: string[]
}

export interface InvestigationStory {
  useCaseId: string
  /** Clean title for humans */
  title: string
  /** One-line where */
  where: string
  /** Opening paragraphs */
  lede: string
  /** Why it matters */
  stakes: string
  /** What “we know so far” in plain speech */
  knownSoFar: string[]
  /** What is still fuzzy */
  stillOpen: string[]
  /** Claim cards rewritten for non-technical readers */
  claims: StoryClaimCard[]
  /** How each major surface serves the story */
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
  /** Tab short labels when this story is active */
  tabLabels: Partial<Record<ModuleId, string>>
  /** Suggested next step for the operator */
  nextStep: string
}

function statusFromScore(score: EvidenceScore): ClaimStatus {
  if (score === 1) return 'supported'
  if (score === -1) return 'disputed'
  return 'uncertain'
}

function plainTitle(label: string): string {
  return label.replace(/^[①-⑩0-9.\s]+/, '').replace(/^[#\d]+\s*/, '').trim()
}

const STORIES: Record<string, InvestigationStory> = {
  'trend-01-berlin-csd': {
    useCaseId: 'trend-01-berlin-csd',
    title: 'Berlin Pride evening — vehicle into a crowd',
    where: 'Tiergarten park, Berlin',
    lede:
      'On a summer evening during Christopher Street Day celebrations, a vehicle struck people on a park path near the parade. Videos spread within minutes. Police treated it as a major incident; the driver fled. The story you are holding is about what can be shown as fact versus what went viral without proof.',
    stakes:
      'People were hurt and at least one life was lost in early reporting. Getting the place, the timing, and the casualty numbers right matters more than being first on social media.',
    knownSoFar: [
      'A vehicle struck pedestrians in Tiergarten during CSD-related activity.',
      'Police launched a manhunt; remaining festival events were called off.',
      'Major outlets broadly agree on a single main scene that night.',
    ],
    stillOpen: [
      'Exact motive is not established in early official statements.',
      'Final hospital tallies may still move.',
      'Viral posts claiming “dozens dead” or a second attack site conflict with the main reporting.',
    ],
    claims: [
      {
        plain: 'A car hit people on a park path during Pride events.',
        status: 'supported',
        score: 1,
        why: 'Police posture and multiple newsrooms describe the same kind of incident.',
      },
      {
        plain: 'Roughly one person killed and about 14–15 injured (early figures).',
        status: 'supported',
        score: 1,
        why: 'Outlets cluster around this band — treat as provisional, not final.',
      },
      {
        plain: 'We already know the political motive.',
        status: 'uncertain',
        score: 0,
        why: 'Officials had not locked a motive in the first wave of statements.',
      },
      {
        plain: 'Dozens died or there was a second simultaneous attack.',
        status: 'disputed',
        score: -1,
        why: 'Clashes with multi-outlet reporting and the single-scene police picture.',
      },
    ],
    surfaces: {
      map: 'Shows where the park path sits in the city, and greys other world stories so this one stays in focus.',
      research: 'Holds the human claims in plain language — what is backed, fuzzy, or false so far.',
      design: 'Sets the rules of the story: criminal vs media risk, how careful we must be with victims, how deep verification must go before publishing.',
      ladder: 'How far the story has been built — from “what happened” to “ready to package.”',
      analyst: 'Fast commands to score new claims as tips come in.',
      model: 'A simple 3D stand-in for crowd paths and markers — not a crime-scene survey.',
      export: 'Only ships a package when dangerous false claims are cleared and you acknowledge the integrity check.',
      sources: 'One-click doors to police pages, German public media, and maps.',
    },
    tabLabels: {
      information: 'Story',
      atlas: 'Map',
      'research-hub': 'Claims',
      'design-lab': 'Story rules',
      'audit-ladder': 'Depth',
      analyst: 'Tips desk',
      'procedural-forge': 'Model',
      'massing-viewer': '3D view',
      'export-kit': 'Publish pack',
    },
    nextStep:
      'On the Map, confirm the park path. In Claims, resolve or remove the “dozens dead” line before any Publish pack.',
  },

  'trend-02-iberian-fires': {
    useCaseId: 'trend-02-iberian-fires',
    title: 'Iberian wildfires — mass flight from heat and flame',
    where: 'South-west France and parts of Spain',
    lede:
      'Extreme heat and fast fires forced huge evacuations — beach towns, villages, and corridors toward cities. Phone and boat videos show fear and scale. The job here is to tell the human story without turning every clip into “the whole city is gone.”',
    stakes:
      'Evacuees need accurate orders and numbers. Exaggeration can block roads or erase real loss under noise.',
    knownSoFar: [
      'Large fires and multi-country emergency coverage are real.',
      'Cap Ferret and Gironde saw major evacuations in reporting.',
      'Spain also fought large fires near Madrid-region complexes.',
    ],
    stillOpen: [
      'Exact headcounts differ by source — use ranges until official tables land.',
      'Claims that Bordeaux city center was destroyed conflict with mainstream coverage.',
    ],
    claims: [
      {
        plain: 'This is a real multi-country fire emergency with mass evacuations.',
        status: 'supported',
        score: 1,
        why: 'Wire and public broadcasters agree on scale.',
      },
      {
        plain: 'Bordeaux’s city center was fully destroyed.',
        status: 'disputed',
        score: -1,
        why: 'Reporting points to threatened suburbs, not a wiped city core.',
      },
      {
        plain: 'We have one final Europe-wide hectare total for the week.',
        status: 'uncertain',
        score: 0,
        why: 'Official aggregates lag the viral count posts.',
      },
    ],
    surfaces: {
      map: 'Pins the fire theaters and evacuation zones so clips can be placed in real geography.',
      research: 'Separates evacuation truth from apocalypse posts.',
      design: 'Civil-protection rules: whose numbers count, how graphic we go, satellite-first checks.',
      ladder: 'How solid the disaster package is before sharing.',
      analyst: 'Log new tip videos and score them fast.',
      model: 'Simple observation-mast stand-in for perimeter thinking — illustrative only.',
      export: 'Blocked while false “city destroyed” claims stay open.',
      sources: 'Satellites, weather services, and emergency coverage links.',
    },
    tabLabels: {
      information: 'Story',
      atlas: 'Map',
      'research-hub': 'Claims',
      'design-lab': 'Story rules',
      'audit-ladder': 'Depth',
      analyst: 'Tips desk',
      'procedural-forge': 'Model',
      'massing-viewer': '3D view',
      'export-kit': 'Publish pack',
    },
    nextStep: 'Open Map, then Claims — knock out the destroyed-city claim before publishing.',
  },

  'trend-03-hormuz-conflict': {
    useCaseId: 'trend-03-hormuz-conflict',
    title: 'Hormuz and the fog of war',
    where: 'Strait of Hormuz and linked maritime corridors',
    lede:
      'Conflict coverage and shipping risk fill the feed: explosions, missiles, tankers, maps. Many clips are real somewhere — but not always here and now. This story is about refusing to publish the wrong war on the wrong day.',
    stakes:
      'False strike videos can escalate fear and erase real civilian harm under recycled footage.',
    knownSoFar: [
      'Serious multi-outlet coverage of US–Iran linked actions continued into mid-2026.',
      'Shipping risk talk around Hormuz and nearby seas is ongoing in industry and news.',
    ],
    stillOpen: [
      'Any single “city destroyed tonight” video needs place and time proof.',
      'Some viral strike clips are older wars re-labeled.',
    ],
    claims: [
      {
        plain: 'There is ongoing conflict coverage involving US and Iranian-linked forces.',
        status: 'supported',
        score: 1,
        why: 'Sustained wire and broadcaster reporting.',
      },
      {
        plain: 'This viral explosion video is tonight’s strike in the place the caption says.',
        status: 'uncertain',
        score: 0,
        why: 'Must pass reverse-search and landmark checks first.',
      },
      {
        plain: 'Recycled old war footage sold as live July 2026.',
        status: 'disputed',
        score: -1,
        why: 'Classic failure mode when landmarks or dates do not match.',
      },
    ],
    surfaces: {
      map: 'Keeps theaters separate — do not collapse every blast onto one pin.',
      research: 'Warfog claims ledger: supported, unknown, recycled.',
      design: 'Rules for conflict reporting — who you trust, how deep you verify, harm to civilians.',
      ladder: 'How far the verification package has climbed.',
      analyst: 'Score tips without leaving the map story.',
      model: 'Optional coastal stand-in geometry — not a real base model.',
      export: 'Will not ship while recycled clips stay open as −1.',
      sources: 'Maritime advisories, wires, maps.',
    },
    tabLabels: {
      information: 'Story',
      atlas: 'Map',
      'research-hub': 'Claims',
      'design-lab': 'Story rules',
      'audit-ladder': 'Depth',
      analyst: 'Tips desk',
      'procedural-forge': 'Model',
      'massing-viewer': '3D view',
      'export-kit': 'Publish pack',
    },
    nextStep: 'Treat every new blast clip as unknown until Map + reverse-search agree.',
  },

  'trend-04-india-education': {
    useCaseId: 'trend-04-india-education',
    title: 'India’s youth education uprising',
    where: 'Campuses and capital — national story',
    lede:
      'Young people organized online and in the streets over education and accountability. Phones were the notebook. Political cost followed in coverage. The story is about genuine grievance versus smear campaigns that erase it.',
    stakes:
      'Policy claims need official text. Violence claims need per-incident proof. Blanket “foreign plot” lines can bury real student harm.',
    knownSoFar: [
      'Sustained youth protest coverage around education and governance.',
      'Social video was central to how the story moved.',
    ],
    stillOpen: [
      'Which policy texts actually changed vs symbolic resignations.',
      'Any force claim must be checked event-by-event.',
    ],
    claims: [
      {
        plain: 'Youth protests over education created real political pressure.',
        status: 'supported',
        score: 1,
        why: 'National and international coverage of consequences.',
      },
      {
        plain: 'The whole movement is only a foreign operation with no local cause.',
        status: 'disputed',
        score: -1,
        why: 'Needs documents; as a blanket line it erases domestic grievance.',
      },
      {
        plain: 'Every viral “massacre” clip is already verified.',
        status: 'uncertain',
        score: 0,
        why: 'Each clip is its own story.',
      },
    ],
    surfaces: {
      map: 'Places campus and capital nodes without turning the story into a street-engineering file.',
      research: 'Accountability claims and smear filters.',
      design: 'Civic forum rules — policy text, protest rights, speech risk.',
      ladder: 'How complete the accountability package is.',
      analyst: 'File new tips from livestreams.',
      model: 'Optional density stand-in — not campus CCTV design.',
      export: 'Blocked while smear −1 stays open.',
      sources: 'PIB, ministry, national press.',
    },
    tabLabels: {
      information: 'Story',
      atlas: 'Map',
      'research-hub': 'Claims',
      'design-lab': 'Story rules',
      'audit-ladder': 'Depth',
      analyst: 'Tips desk',
      'procedural-forge': 'Model',
      'massing-viewer': '3D view',
      'export-kit': 'Publish pack',
    },
    nextStep: 'In Story rules, keep policy claims tied to official text; kill smear lines without proof.',
  },

  'trend-05-la-velada': {
    useCaseId: 'trend-05-la-velada',
    title: 'La Velada — the night the internet watched a fight card',
    where: 'Seville-area mega livestream event',
    lede:
      'A huge creator boxing show took over global trends. Results, memes, and safety rumors mixed in one firehose. This story separates the official card from panic posts about the crowd.',
    stakes:
      'False mass-casualty rumors can overshadow both the event and any real medical emergency.',
    knownSoFar: [
      'The event dominated worldwide trends.',
      'Official show channels are the right place for fight outcomes.',
    ],
    stillOpen: [
      'Injury rumors without team or medical confirmation.',
      'Stampede claims that lack multi-source support.',
    ],
    claims: [
      {
        plain: 'This was a real major livestream combat event.',
        status: 'supported',
        score: 1,
        why: 'Trend data and multi-platform coverage.',
      },
      {
        plain: 'There was a stampede with mass deaths at the venue.',
        status: 'disputed',
        score: -1,
        why: 'Needs multi-source emergency confirmation — not one anonymous video.',
      },
      {
        plain: 'A fighter is critically injured backstage.',
        status: 'uncertain',
        score: 0,
        why: 'Hold until primary medical or team word.',
      },
    ],
    surfaces: {
      map: 'Locates the venue story against greyed-out world desks.',
      research: 'Results vs rumors, written for fans and journalists alike.',
      design: 'Event vs safety vs betting risk rules.',
      ladder: 'Package readiness for a clean recap.',
      analyst: 'Score fight-night tips live.',
      model: 'Simple venue corridor marker — illustrative.',
      export: 'No pack while mass-casualty rumor stays disputed.',
      sources: 'Official channels and local press.',
    },
    tabLabels: {
      information: 'Story',
      atlas: 'Map',
      'research-hub': 'Claims',
      'design-lab': 'Story rules',
      'audit-ladder': 'Depth',
      analyst: 'Tips desk',
      'procedural-forge': 'Model',
      'massing-viewer': '3D view',
      'export-kit': 'Publish pack',
    },
    nextStep: 'Lock fight results to official posts only; park safety rumors until EMS/press agree.',
  },

  'trend-06-ufc-abu-dhabi': {
    useCaseId: 'trend-06-ufc-abu-dhabi',
    title: 'UFC Abu Dhabi — fight night, rumors included',
    where: 'Abu Dhabi fight card',
    lede:
      'Another combat-sports night: real results, loud judging arguments, and the usual death-hoax spam. The story is simple — celebrate the sport without spreading cruelty.',
    stakes: 'Fake death posts hurt families. Betting fakes confuse fans.',
    knownSoFar: [
      'The card is a real promotion event on the trend boards.',
      'Official UFC channels own the result graphics.',
    ],
    stillOpen: ['Judging arguments need scorecards, not slogans.', 'Any medical scare needs dual confirmation.'],
    claims: [
      {
        plain: 'Official fight results come from UFC.',
        status: 'supported',
        score: 1,
        why: 'Promotion primary.',
      },
      {
        plain: 'A fighter died (unconfirmed social posts).',
        status: 'disputed',
        score: -1,
        why: 'Recurring hoax pattern without hospital/promotion word.',
      },
      {
        plain: 'The judges robbed a fighter.',
        status: 'uncertain',
        score: 0,
        why: 'Opinion until scorecards and multi-source review.',
      },
    ],
    surfaces: {
      map: 'Pins the card city; greys other desks.',
      research: 'Results, judging, hoaxes in plain speech.',
      design: 'Sports vs betting vs defamation risk rules.',
      ladder: 'How clean the recap package is.',
      analyst: 'Kill hoaxes with one score command.',
      model: 'Optional media-riser stand-in.',
      export: 'Blocked while death-hoax −1 remains.',
      sources: 'UFC, ESPN MMA, map.',
    },
    tabLabels: {
      information: 'Story',
      atlas: 'Map',
      'research-hub': 'Claims',
      'design-lab': 'Story rules',
      'audit-ladder': 'Depth',
      analyst: 'Tips desk',
      'procedural-forge': 'Model',
      'massing-viewer': '3D view',
      'export-kit': 'Publish pack',
    },
    nextStep: 'Open Claims and remove or rescore the death hoax before any publish.',
  },

  'trend-07-world-cup': {
    useCaseId: 'trend-07-world-cup',
    title: 'After the World Cup final — scoreline vs street stories',
    where: 'Final result global; celebrations local',
    lede:
      'Spain beat Argentina in extra time in the 2026 final (per major summaries). The feed kept running: fan cams, joy, and some posts that turned one city night into a “civil war.” This desk keeps the score honest and the streets local.',
    stakes: 'Mixing match facts with national catastrophe talk misleads everyone.',
    knownSoFar: [
      'A final result is reported by major references — confirm on FIFA for publish.',
      'Celebrations produced large volumes of citizen video.',
    ],
    stillOpen: [
      'City-level arrest or injury stats need local primary tables.',
      'Nationwide mass-death riot frames lack evidence as a single event.',
    ],
    claims: [
      {
        plain: 'Spain won the final 1–0 in extra time (reported).',
        status: 'supported',
        score: 1,
        why: 'Major summaries — still cite FIFA when packaging.',
      },
      {
        plain: 'The whole country collapsed into civil war after the match.',
        status: 'disputed',
        score: -1,
        why: 'Catastrophe framing without multi-city primary body counts.',
      },
      {
        plain: 'A specific referee corruption file exists.',
        status: 'uncertain',
        score: 0,
        why: 'Needs documents or official inquiry.',
      },
    ],
    surfaces: {
      map: 'Sample celebration geography — not proof of every city claim.',
      research: 'Two ledgers: the match, and each city’s night.',
      design: 'Sports forum vs civic order vs media narrative.',
      ladder: 'Depth of the dual package.',
      analyst: 'Score new city tips without touching the scoreline.',
      model: 'Corridor marker for crowd stories — illustrative.',
      export: 'Blocked while catastrophe −1 is open.',
      sources: 'FIFA, wires, maps.',
    },
    tabLabels: {
      information: 'Story',
      atlas: 'Map',
      'research-hub': 'Claims',
      'design-lab': 'Story rules',
      'audit-ladder': 'Depth',
      analyst: 'Tips desk',
      'procedural-forge': 'Model',
      'massing-viewer': '3D view',
      'export-kit': 'Publish pack',
    },
    nextStep: 'Keep the final score on FIFA; treat each city clip as its own map pin.',
  },

  'trend-08-venezuela-quake': {
    useCaseId: 'trend-08-venezuela-quake',
    title: 'After the quake — what the ground and the phones show',
    where: 'Venezuela (Caracas-area story pin)',
    lede:
      'Earthquake aftermath brings rescue clips, broken buildings, and grief. Some rubble videos are from other countries. This story starts with the science of the quake, then places only the clips that truly belong.',
    stakes: 'Wrong-country rubble steals attention from real survivors.',
    knownSoFar: [
      'Citizen rescue and damage media appeared in coverage of a significant quake impact.',
      'Seismic agencies are the first stop for magnitude and place.',
    ],
    stillOpen: [
      'Death tolls revise — do not freeze a single number early.',
      'Any damage tour needs landmark proof.',
    ],
    claims: [
      {
        plain: 'There was a real quake-impact story with citizen ground media.',
        status: 'supported',
        score: 1,
        why: 'Multi-outlet aftermath reporting.',
      },
      {
        plain: 'This rubble clip is from another country labeled as Venezuela.',
        status: 'disputed',
        score: -1,
        why: 'Geolocation fails the caption.',
      },
      {
        plain: 'The death toll is final.',
        status: 'uncertain',
        score: 0,
        why: 'Civil protection tables still move.',
      },
    ],
    surfaces: {
      map: 'Homes the story and rejects mislocated rubble.',
      research: 'Science first, then human clips that pass the map.',
      design: 'Disaster forum, harm rules, seismic-first verification.',
      ladder: 'How ready the ground-truth package is.',
      analyst: 'Score new damage tours.',
      model: 'Field mast stand-in — not a engineering survey.',
      export: 'Blocked while mislocated −1 remains.',
      sources: 'USGS, EMSC, aid orgs.',
    },
    tabLabels: {
      information: 'Story',
      atlas: 'Map',
      'research-hub': 'Claims',
      'design-lab': 'Story rules',
      'audit-ladder': 'Depth',
      analyst: 'Tips desk',
      'procedural-forge': 'Model',
      'massing-viewer': '3D view',
      'export-kit': 'Publish pack',
    },
    nextStep: 'Open Map with USGS in Sources; drop any clip that fails landmarks.',
  },

  'trend-09-political-claims': {
    useCaseId: 'trend-09-political-claims',
    title: 'Viral politics — paper trails, not prophecy',
    where: 'Process desk (Washington symbolic pin)',
    lede:
      'A multi-day wave of 2028 speculation, quote cards, and “internal poll” screenshots. This is not a campaign ad. It is a story about how to refuse fake paperwork while still covering real filings and full speeches.',
    stakes: 'Forged polls and cut quotes corrode trust for everyone.',
    knownSoFar: [
      'The conversation cluster on X was real and multi-day.',
      'Conversation volume is not the same as a legal filing.',
    ],
    stillOpen: [
      'Any “filed today” claim needs a document link.',
      'Poll graphics need a field house, dates, and sample.',
    ],
    claims: [
      {
        plain: 'People were heavily discussing 2028 online.',
        status: 'supported',
        score: 1,
        why: 'Trend presence is observable.',
      },
      {
        plain: 'This screenshot is a real internal poll.',
        status: 'disputed',
        score: -1,
        why: 'No methodology — treat as fabrication until proven.',
      },
      {
        plain: 'A filing happened today.',
        status: 'uncertain',
        score: 0,
        why: 'Needs FEC or equivalent primary.',
      },
    ],
    surfaces: {
      map: 'Symbolic process pin — the story lives in documents, not pavement.',
      research: 'Filings, quotes, polls in plain English.',
      design: 'Election / court / speech forums and document-first rules.',
      ladder: 'How close the process package is to shareable.',
      analyst: 'Score new screenshots fast.',
      model: 'Optional records-node stand-in.',
      export: 'Blocked while fake-poll −1 is open.',
      sources: 'FEC, CourtListener, Congress.gov.',
    },
    tabLabels: {
      information: 'Story',
      atlas: 'Map',
      'research-hub': 'Claims',
      'design-lab': 'Story rules',
      'audit-ladder': 'Depth',
      analyst: 'Tips desk',
      'procedural-forge': 'Model',
      'massing-viewer': '3D view',
      'export-kit': 'Publish pack',
    },
    nextStep: 'Open Sources → FEC before believing any filing meme.',
  },

  'trend-10-clip-authenticity': {
    useCaseId: 'trend-10-clip-authenticity',
    title: 'Is this video real — and from when it claims?',
    where: 'Everywhere the feed invents a “here and now”',
    lede:
      'This meta-story sits under every other desk. A clip can look true and still be old, elsewhere, or synthetic. The plot is provenance: who filmed it, where, and whether the caption lies.',
    stakes: 'One fake “eyewitness” can hijack a real crisis.',
    knownSoFar: [
      'Feeds still outrun institutions on breaking days.',
      'Recycled and synthetic media are common failure modes.',
    ],
    stillOpen: [
      'Each viral item starts unknown until reverse-search and place checks finish.',
      'Uploader history and original files are often missing.',
    ],
    claims: [
      {
        plain: 'Speed beats institutions on breaking video.',
        status: 'supported',
        score: 1,
        why: 'Structural pattern across disasters and conflict.',
      },
      {
        plain: 'This viral clip is authentic original capture of the captioned event.',
        status: 'uncertain',
        score: 0,
        why: 'Default until tools and geography agree.',
      },
      {
        plain: 'AI “eyewitness” accepted because it looks real.',
        status: 'disputed',
        score: -1,
        why: 'Lookism is not verification.',
      },
    ],
    surfaces: {
      map: 'A hub for the method — and a place to park rejects.',
      research: 'The authenticity ledger in human language.',
      design: 'Provenance rules that overlay every other story.',
      ladder: 'How deep the method package goes.',
      analyst: 'Log reverse-search kills.',
      model: 'Review-bench stand-in.',
      export: 'Hard-blocked while synthetic/recycled −1s remain.',
      sources: 'InVID, Wayback, reverse image tools.',
    },
    tabLabels: {
      information: 'Story',
      atlas: 'Map',
      'research-hub': 'Claims',
      'design-lab': 'Story rules',
      'audit-ladder': 'Depth',
      analyst: 'Tips desk',
      'procedural-forge': 'Model',
      'massing-viewer': '3D view',
      'export-kit': 'Publish pack',
    },
    nextStep: 'Run reverse-search on the top clip before it infects another desk.',
  },
}

// Prefer desk-built stories (sourced claims); file stories fill gaps; expansion boilerplate loses
Object.assign(STORIES, CONGRESS_STORIES_FILE as Record<string, InvestigationStory>)
Object.assign(STORIES, CONGRESS_STORIES_DESK as Record<string, InvestigationStory>)
Object.assign(STORIES, CORPUS_STORIES)

export function getStory(useCaseId: string): InvestigationStory | undefined {
  return STORIES[useCaseId]
}

function enrichClaims(useCaseId: string, claims: StoryClaimCard[]): StoryClaimCard[] {
  const plains = claims.map((c) => c.plain)
  const needsRebuild = !claims.length || claimPackIsBoilerplate(plains)
  const ledger = buildClaimLedger(
    useCaseId,
    needsRebuild
      ? undefined
      : claims.map((c) => ({
          plain: c.plain,
          score: c.score,
          why: c.why,
          sourceIds: c.sourceIds,
        })),
  )
  return ledger.map((c) => ({
    plain: c.plain,
    status: c.status,
    score: c.score,
    why: c.why,
    sourceIds: c.sourceIds,
    citations: c.citations,
  }))
}

/** Prefer curated story; fall back to report + sim for unknown desks */
export function resolveStory(useCaseId: string): InvestigationStory | null {
  const curated = STORIES[useCaseId]
  if (curated) {
    return {
      ...curated,
      claims: enrichClaims(useCaseId, curated.claims),
    }
  }
  const profile = getUseCase(useCaseId)
  const sim = getSimulation(useCaseId)
  if (!profile.report && !sim) return null
  const rawClaims: StoryClaimCard[] =
    profile.report?.claims.map((c) => ({
      plain: c.statement,
      status: statusFromScore(c.score),
      score: c.score,
      why: c.notes,
    })) ??
    sim?.evidence.map((e) => ({
      plain: e.title,
      status: statusFromScore(e.score),
      score: e.score,
      why: e.summary,
      sourceIds: e.sourceRefs,
    })) ??
    []
  return {
    useCaseId,
    title: plainTitle(profile.label),
    where: sim?.mapPin.cityHint ?? '—',
    lede: profile.report?.executiveSummary ?? profile.description,
    stakes: profile.tagline,
    knownSoFar: profile.report?.timeline.slice(0, 3).map((t) => t.what) ?? [],
    stillOpen: profile.report?.openQuestions.slice(0, 3) ?? [],
    claims: enrichClaims(useCaseId, rawClaims),
    surfaces: {
      map: 'Places this investigation on the world map.',
      research: 'Scored claims with citations — tools not media.',
      design: 'Rules for how hard we verify before publishing.',
      ladder: 'How deep the package has gone.',
      analyst: 'Command tips desk.',
      model: 'Optional 3D stand-in.',
      export: 'Share only when integrity checks pass.',
      sources: 'Links to pull more.',
    },
    tabLabels: {
      information: 'Story',
      atlas: 'Map',
      'research-hub': 'Claims',
      'design-lab': 'Story rules',
      'sme-lenses': 'SME lenses',
      'export-kit': 'Publish pack',
    },
    nextStep: 'Bind +1 claims to primary sources, run multi-loop verify, then export.',
  }
}

export function storyTabLabel(useCaseId: string, moduleId: ModuleId, fallback: string): string {
  const s = resolveStory(useCaseId)
  return s?.tabLabels[moduleId] ?? fallback
}

export function claimStatusLabel(status: ClaimStatus): string {
  if (status === 'supported') return 'Supported'
  if (status === 'disputed') return 'Disputed'
  return 'Not proven yet'
}
