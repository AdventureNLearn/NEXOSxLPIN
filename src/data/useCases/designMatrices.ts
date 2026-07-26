/**
 * Story-driven Design Lab matrices — citizen journalism / jurisdictional intelligence.
 * Not road/structure siting: claim risk, forum, access, platform, verification depth.
 */

import type { ActiveConditions, ConditionMatrix } from '../../types/core'

function matrix(
  id: string,
  name: string,
  description: string,
  axes: ConditionMatrix['axes'],
): ConditionMatrix {
  return { id, name, description, axes }
}

/** Shared CJ jurisdictional axes used across desks (options vary by story). */
const FORUM = (opts: Array<{ id: string; label: string; description: string }>) => ({
  id: 'legal-forum',
  label: 'Legal / civic forum',
  options: opts,
})

const CLAIM = (opts: Array<{ id: string; label: string; description: string }>) => ({
  id: 'claim-class',
  label: 'Claim class',
  options: opts,
})

const ACCESS = (opts: Array<{ id: string; label: string; description: string }>) => ({
  id: 'source-access',
  label: 'Source access',
  options: opts,
})

const PLATFORM = (opts: Array<{ id: string; label: string; description: string }>) => ({
  id: 'platform-risk',
  label: 'Platform / amplification risk',
  options: opts,
})

const VERIFY = (opts: Array<{ id: string; label: string; description: string }>) => ({
  id: 'verify-depth',
  label: 'Verification depth required',
  options: opts,
})

const HARM = (opts: Array<{ id: string; label: string; description: string }>) => ({
  id: 'harm-exposure',
  label: 'Harm / subject exposure',
  options: opts,
})

export interface DesignStoryPack {
  matrix: ConditionMatrix
  /** Default selections for this story */
  defaultSelections: Record<string, string>
  /** What this matrix means for the journalist */
  intelligenceBrief: string
  /** How Apply affects export / ladder / map framing */
  applyEffects: string[]
}

const DESKS: Record<string, DesignStoryPack> = {
  'trend-01-berlin-csd': {
    intelligenceBrief:
      'German public-order / criminal investigation frame. Prioritize police primary, hospital tallies, and geolocation of path claims. Crowd harm exposure is high — minimize graphic amplification.',
    applyEffects: [
      'Raises Layer-0 sensitivity on export if harm-exposure is high',
      'Sets verification depth expectation for ladder L2+',
      'Tags WD with forum + claim class for peer handoff',
    ],
    defaultSelections: {
      'legal-forum': 'forum-criminal',
      'claim-class': 'claim-eyewitness',
      'source-access': 'access-open',
      'platform-risk': 'plat-high',
      'verify-depth': 'vd-geo',
      'harm-exposure': 'harm-high',
    },
    matrix: matrix(
      'matrix-cj-berlin-csd',
      'Berlin CSD · jurisdictional intelligence',
      'Citizen-journalism constraints for a vehicle-into-crowd scene under German public-order response — not infrastructure siting.',
      [
        FORUM([
          {
            id: 'forum-criminal',
            label: 'Criminal investigation',
            description: 'Police major incident; charging path possible',
          },
          {
            id: 'forum-civil-order',
            label: 'Public-order / event security',
            description: 'Assembly safety and organizer liability angles',
          },
          {
            id: 'forum-media',
            label: 'Media / defamation risk',
            description: 'Naming suspects before primary ID',
          },
        ]),
        CLAIM([
          {
            id: 'claim-eyewitness',
            label: 'Eyewitness / phone video',
            description: 'First-person capture — geolocate first',
          },
          {
            id: 'claim-official',
            label: 'Official statement',
            description: 'Police / mayor / organizer primary',
          },
          {
            id: 'claim-viral',
            label: 'Viral inflation',
            description: 'Casualty or second-site amplification',
          },
        ]),
        ACCESS([
          {
            id: 'access-open',
            label: 'Open public feeds',
            description: 'X / livestream / public posts',
          },
          {
            id: 'access-press',
            label: 'Press pool / wire',
            description: 'Multi-outlet corroboration',
          },
          {
            id: 'access-restricted',
            label: 'Restricted / tactical withhold',
            description: 'Suspect description withheld',
          },
        ]),
        PLATFORM([
          {
            id: 'plat-high',
            label: 'High virality',
            description: 'Graphic clips spread faster than fact-check',
          },
          {
            id: 'plat-med',
            label: 'Moderate',
            description: 'Local + national loop',
          },
          {
            id: 'plat-low',
            label: 'Contained',
            description: 'Primarily local German feeds',
          },
        ]),
        VERIFY([
          {
            id: 'vd-geo',
            label: 'Geolocation mandatory',
            description: 'Path/landmark match before publish',
          },
          {
            id: 'vd-multi',
            label: 'Multi-source band',
            description: 'Casualty figures only as ranges',
          },
          {
            id: 'vd-primary',
            label: 'Primary-only export',
            description: 'Police/hospital before narrative',
          },
        ]),
        HARM([
          {
            id: 'harm-high',
            label: 'High (victims / crowd)',
            description: 'Avoid gratuitous injury imagery',
          },
          {
            id: 'harm-med',
            label: 'Medium',
            description: 'Blur faces; no suspect naming',
          },
          {
            id: 'harm-low',
            label: 'Low (process only)',
            description: 'Timeline and response process focus',
          },
        ]),
      ],
    ),
  },

  'trend-02-iberian-fires': {
    intelligenceBrief:
      'Disaster / civil-protection frame across Spain and SW France. Prefectoral orders and satellite products outrank influencer tallies. Evacuation numbers are ranges until official tables.',
    applyEffects: [
      'Maps claim class to fire-desk export checklist',
      'Platform risk guides whether to amplify boat-evac clips',
      'Verification depth locks satellite-first workflow',
    ],
    defaultSelections: {
      'legal-forum': 'forum-civil-protect',
      'claim-class': 'claim-evac',
      'source-access': 'access-open',
      'platform-risk': 'plat-high',
      'verify-depth': 'vd-sat',
      'harm-exposure': 'harm-med',
    },
    matrix: matrix(
      'matrix-cj-iberian-fires',
      'Iberian fires · civil-protection intelligence',
      'Cross-border disaster desk: evacuation truth, satellite corroboration, anti-exaggeration.',
      [
        FORUM([
          {
            id: 'forum-civil-protect',
            label: 'Civil protection / emergency',
            description: 'Prefecture and national emergency orders',
          },
          {
            id: 'forum-env',
            label: 'Environmental / climate context',
            description: 'Heatwave and fuel conditions',
          },
          {
            id: 'forum-tourism',
            label: 'Tourism / liability',
            description: 'Cap Ferret and visitor safety messaging',
          },
        ]),
        CLAIM([
          {
            id: 'claim-evac',
            label: 'Evacuation scale',
            description: 'Headcounts and order vs voluntary leave',
          },
          {
            id: 'claim-damage',
            label: 'Structure / city damage',
            description: 'Suburb vs city-center claims',
          },
          {
            id: 'claim-cause',
            label: 'Ignition / negligence',
            description: 'Arrest or cause narratives',
          },
        ]),
        ACCESS([
          {
            id: 'access-open',
            label: 'Open citizen video',
            description: 'Drone and phone fronts',
          },
          {
            id: 'access-official',
            label: 'Prefecture / agency',
            description: 'Orders and situation reports',
          },
          {
            id: 'access-sat',
            label: 'Satellite / EMS products',
            description: 'Copernicus / FIRMS class data',
          },
        ]),
        PLATFORM([
          {
            id: 'plat-high',
            label: 'Panic amplification',
            description: 'Apocalypse framing spreads fast',
          },
          {
            id: 'plat-med',
            label: 'Regional loop',
            description: 'National EU coverage',
          },
          {
            id: 'plat-low',
            label: 'Specialist',
            description: 'Civil-protection channels only',
          },
        ]),
        VERIFY([
          {
            id: 'vd-sat',
            label: 'Satellite-first',
            description: 'Thermal/scar before viral still',
          },
          {
            id: 'vd-order',
            label: 'Order-text first',
            description: 'Prefecture PDF/post before headcount',
          },
          {
            id: 'vd-range',
            label: 'Range language only',
            description: 'Never hard-lock single integers',
          },
        ]),
        HARM([
          {
            id: 'harm-med',
            label: 'Medium (evacuees)',
            description: 'Respect displacement privacy',
          },
          {
            id: 'harm-high',
            label: 'High (casualties)',
            description: 'Death reports need multi-source',
          },
          {
            id: 'harm-low',
            label: 'Low (landscape)',
            description: 'Burn scar and weather only',
          },
        ]),
      ],
    ),
  },

  'trend-03-hormuz-conflict': {
    intelligenceBrief:
      'Armed-conflict and maritime-security verification. Warfog defaults: unlocated explosion audio is not evidence. Separate Hormuz vs Red Sea vs inland theaters.',
    applyEffects: [
      'Claim class drives whether export can include strike clips',
      'Access = official/wire vs viral determines Layer-0 posture',
      'Verification depth enforces reverse-search before map pin',
    ],
    defaultSelections: {
      'legal-forum': 'forum-ihl',
      'claim-class': 'claim-strike',
      'source-access': 'access-wire',
      'platform-risk': 'plat-high',
      'verify-depth': 'vd-reverse',
      'harm-exposure': 'harm-high',
    },
    matrix: matrix(
      'matrix-cj-hormuz',
      'Hormuz · conflict verification intelligence',
      'Citizen desk for maritime and strike claims under fog of war — jurisdictional caution, not force design.',
      [
        FORUM([
          {
            id: 'forum-ihl',
            label: 'IHL / conflict reporting',
            description: 'Laws of armed conflict framing',
          },
          {
            id: 'forum-maritime',
            label: 'Maritime security',
            description: 'Shipping advisories and insurance',
          },
          {
            id: 'forum-sanctions',
            label: 'Sanctions / policy',
            description: 'State speech vs operational fact',
          },
        ]),
        CLAIM([
          {
            id: 'claim-strike',
            label: 'Strike / explosion',
            description: 'Location and timing contested',
          },
          {
            id: 'claim-ship',
            label: 'Vessel incident',
            description: 'AIS and advisory text',
          },
          {
            id: 'claim-city',
            label: 'City destroyed',
            description: 'Often recycled or inflated',
          },
        ]),
        ACCESS([
          {
            id: 'access-wire',
            label: 'Wire / official',
            description: 'Reuters, UKMTO, ministries',
          },
          {
            id: 'access-local',
            label: 'Local journalist',
            description: 'Track-record sources',
          },
          {
            id: 'access-viral',
            label: 'Anonymous viral',
            description: 'Default score 0 until proven',
          },
        ]),
        PLATFORM([
          {
            id: 'plat-high',
            label: 'State + bot flood',
            description: 'Hashtag and sockpuppet risk',
          },
          {
            id: 'plat-med',
            label: 'Mixed',
            description: 'Wire + social loop',
          },
          {
            id: 'plat-low',
            label: 'Specialist maritime',
            description: 'Industry channels only',
          },
        ]),
        VERIFY([
          {
            id: 'vd-reverse',
            label: 'Reverse-search mandatory',
            description: 'Kill recycled war clips',
          },
          {
            id: 'vd-two',
            label: 'Two independents',
            description: 'Or official + local',
          },
          {
            id: 'vd-theater',
            label: 'Theater ledger',
            description: 'Separate map pins per sea/city',
          },
        ]),
        HARM([
          {
            id: 'harm-high',
            label: 'High (civilians)',
            description: 'Casualty claims need extreme care',
          },
          {
            id: 'harm-med',
            label: 'Medium',
            description: 'Infrastructure without people',
          },
          {
            id: 'harm-low',
            label: 'Low (shipping stats)',
            description: 'Lane risk without graphic media',
          },
        ]),
      ],
    ),
  },

  'trend-04-india-education': {
    intelligenceBrief:
      'Accountability / protest desk. Score policy against gazette text. Reject blanket foreign-op smears without documents. Phones-in-hand is method, not proof of violence.',
    applyEffects: [
      'Forum choice changes export language (policy vs policing)',
      'Harm exposure gates graphic protest media',
      'Access path lists PIB / ministry as primary',
    ],
    defaultSelections: {
      'legal-forum': 'forum-admin',
      'claim-class': 'claim-policy',
      'source-access': 'access-open',
      'platform-risk': 'plat-med',
      'verify-depth': 'vd-gazette',
      'harm-exposure': 'harm-med',
    },
    matrix: matrix(
      'matrix-cj-india-edu',
      'India education · accountability intelligence',
      'Youth protest and ministerial consequence — civic forum, not street geometry.',
      [
        FORUM([
          {
            id: 'forum-admin',
            label: 'Administrative / education policy',
            description: 'Ministry circulars and resignations',
          },
          {
            id: 'forum-assembly',
            label: 'Assembly / protest rights',
            description: 'Campus and street actions',
          },
          {
            id: 'forum-speech',
            label: 'Speech / defamation',
            description: 'Smear and counter-smear risk',
          },
        ]),
        CLAIM([
          {
            id: 'claim-policy',
            label: 'Policy failure / reform',
            description: 'Education system claims',
          },
          {
            id: 'claim-resign',
            label: 'Political consequence',
            description: 'Minister resignation etc.',
          },
          {
            id: 'claim-force',
            label: 'Force / violence',
            description: 'Per-incident only — no batch +1',
          },
        ]),
        ACCESS([
          {
            id: 'access-open',
            label: 'Open social / livestream',
            description: 'Phones-in-hand documentation',
          },
          {
            id: 'access-press',
            label: 'National press',
            description: 'Hindu / wire corroboration',
          },
          {
            id: 'access-gazette',
            label: 'Gazette / PIB primary',
            description: 'Official text only',
          },
        ]),
        PLATFORM([
          {
            id: 'plat-med',
            label: 'National viral',
            description: 'Memes and campus clips',
          },
          {
            id: 'plat-high',
            label: 'Polarized flood',
            description: 'Communal hijack risk',
          },
          {
            id: 'plat-low',
            label: 'Specialist education',
            description: 'Policy audiences only',
          },
        ]),
        VERIFY([
          {
            id: 'vd-gazette',
            label: 'Gazette-first policy',
            description: 'No +1 on policy without text',
          },
          {
            id: 'vd-incident',
            label: 'Per-incident force',
            description: 'Never batch-score violence',
          },
          {
            id: 'vd-smear',
            label: 'Smear filter',
            description: 'Foreign-op claims need documents',
          },
        ]),
        HARM([
          {
            id: 'harm-med',
            label: 'Medium (students)',
            description: 'Protect minors and doxxing risk',
          },
          {
            id: 'harm-high',
            label: 'High (force victims)',
            description: 'Graphic restraint',
          },
          {
            id: 'harm-low',
            label: 'Low (policy text)',
            description: 'Documents only',
          },
        ]),
      ],
    ),
  },

  'trend-05-la-velada': {
    intelligenceBrief:
      'Mass livestream entertainment desk. Official results vs safety rumors. Stampede/mass-casualty claims need multi-source; fandom is not fact.',
    applyEffects: [
      'Claim class splits results desk from safety desk',
      'Platform risk high → slower publish on injury rumors',
      'Verification depth whitelist official show channels',
    ],
    defaultSelections: {
      'legal-forum': 'forum-event',
      'claim-class': 'claim-result',
      'source-access': 'access-official-show',
      'platform-risk': 'plat-high',
      'verify-depth': 'vd-official',
      'harm-exposure': 'harm-med',
    },
    matrix: matrix(
      'matrix-cj-velada',
      'La Velada · event verification intelligence',
      'Mass livestream card: results hygiene and crowd-safety rumor control.',
      [
        FORUM([
          {
            id: 'forum-event',
            label: 'Licensed event / entertainment',
            description: 'Show and venue rules',
          },
          {
            id: 'forum-safety',
            label: 'Crowd safety',
            description: 'Stampede and medical claims',
          },
          {
            id: 'forum-betting',
            label: 'Betting / consumer',
            description: 'Odds and spoof graphics',
          },
        ]),
        CLAIM([
          {
            id: 'claim-result',
            label: 'Fight result',
            description: 'Official card only for +1',
          },
          {
            id: 'claim-injury',
            label: 'Injury rumor',
            description: 'Default 0 until team/medical',
          },
          {
            id: 'claim-stampede',
            label: 'Stampede / mass harm',
            description: 'Often −1 without multi-source',
          },
        ]),
        ACCESS([
          {
            id: 'access-official-show',
            label: 'Official show channels',
            description: 'Whitelist for results',
          },
          {
            id: 'access-fan',
            label: 'Fan / creator',
            description: 'Unfiltered but noisy',
          },
          {
            id: 'access-ems',
            label: 'EMS / police',
            description: 'Safety incidents only',
          },
        ]),
        PLATFORM([
          {
            id: 'plat-high',
            label: 'Global trend',
            description: 'Peak X velocity',
          },
          {
            id: 'plat-med',
            label: 'Regional',
            description: 'ES/LATAM loop',
          },
          {
            id: 'plat-low',
            label: 'Sports desk only',
            description: 'Specialist MMA/boxing',
          },
        ]),
        VERIFY([
          {
            id: 'vd-official',
            label: 'Official-only results',
            description: 'No tipster screenshots',
          },
          {
            id: 'vd-geo-venue',
            label: 'Venue geolocation',
            description: 'Incident clips at venue',
          },
          {
            id: 'vd-multi-safety',
            label: 'Multi-source safety',
            description: 'EMS + press for harm',
          },
        ]),
        HARM([
          {
            id: 'harm-med',
            label: 'Medium (fighters/crowd)',
            description: 'Injury speculation ethics',
          },
          {
            id: 'harm-high',
            label: 'High (mass casualty claim)',
            description: 'Extreme caution',
          },
          {
            id: 'harm-low',
            label: 'Low (scores only)',
            description: 'Results table only',
          },
        ]),
      ],
    ),
  },

  'trend-06-ufc-abu-dhabi': {
    intelligenceBrief:
      'Sports-misinfo desk. UFC official results are +1; death hoaxes are −1; judging disputes stay 0 unless scorecards exist.',
    applyEffects: [
      'Separates gambling spam from official results',
      'Medical claims need commission/promotion path',
      'Export kit should not ship hoax threads',
    ],
    defaultSelections: {
      'legal-forum': 'forum-sports',
      'claim-class': 'claim-result',
      'source-access': 'access-ufc',
      'platform-risk': 'plat-high',
      'verify-depth': 'vd-official',
      'harm-exposure': 'harm-med',
    },
    matrix: matrix(
      'matrix-cj-ufc',
      'UFC Abu Dhabi · sports claim intelligence',
      'Fight-night triage: official results, medical rumors, betting bots.',
      [
        FORUM([
          {
            id: 'forum-sports',
            label: 'Athletic commission / promotion',
            description: 'Licensed combat sports',
          },
          {
            id: 'forum-consumer',
            label: 'Consumer / betting',
            description: 'Odds and spoof risk',
          },
          {
            id: 'forum-defamation',
            label: 'Defamation / hoax',
            description: 'Death and scandal rumors',
          },
        ]),
        CLAIM([
          {
            id: 'claim-result',
            label: 'Official result',
            description: 'UFC graphic/page',
          },
          {
            id: 'claim-judge',
            label: 'Judging dispute',
            description: 'Subjective — scorecards help',
          },
          {
            id: 'claim-death',
            label: 'Death / critical injury hoax',
            description: 'Default −1 without primary',
          },
        ]),
        ACCESS([
          {
            id: 'access-ufc',
            label: 'UFC official',
            description: 'Primary for outcomes',
          },
          {
            id: 'access-beat',
            label: 'MMA beat reporters',
            description: 'Injury corroboration',
          },
          {
            id: 'access-social',
            label: 'Social rumor',
            description: 'High noise',
          },
        ]),
        PLATFORM([
          {
            id: 'plat-high',
            label: 'Betting bot flood',
            description: 'Spoof screenshots common',
          },
          {
            id: 'plat-med',
            label: 'Fan discourse',
            description: 'Normal fight-night volume',
          },
          {
            id: 'plat-low',
            label: 'Official only',
            description: 'Promotion channels',
          },
        ]),
        VERIFY([
          {
            id: 'vd-official',
            label: 'Official results only',
            description: '+1 path',
          },
          {
            id: 'vd-medical',
            label: 'Medical dual-source',
            description: 'Promotion + hospital/commission',
          },
          {
            id: 'vd-hoax',
            label: 'Hoax kill-switch',
            description: 'Death rumors −1 fast',
          },
        ]),
        HARM([
          {
            id: 'harm-med',
            label: 'Medium (athletes)',
            description: 'Injury ethics',
          },
          {
            id: 'harm-high',
            label: 'High (false death)',
            description: 'Family harm risk',
          },
          {
            id: 'harm-low',
            label: 'Low (records)',
            description: 'Results tables only',
          },
        ]),
      ],
    ),
  },

  'trend-07-world-cup': {
    intelligenceBrief:
      'Split ledgers: match facts vs city public-order claims. Catastrophic “civil war” frames without body counts are −1. FIFA primary for the final score.',
    applyEffects: [
      'Forum switches sports result vs civic order export packs',
      'Verification depth enforces per-city blotters',
      'Platform risk high after final night',
    ],
    defaultSelections: {
      'legal-forum': 'forum-sports',
      'claim-class': 'claim-result',
      'source-access': 'access-fifa',
      'platform-risk': 'plat-high',
      'verify-depth': 'vd-split',
      'harm-exposure': 'harm-med',
    },
    matrix: matrix(
      'matrix-cj-worldcup',
      'World Cup aftermath · dual-ledger intelligence',
      'Results hygiene plus host-city order claims — never one national catastrophe claim without primary.',
      [
        FORUM([
          {
            id: 'forum-sports',
            label: 'FIFA / match officials',
            description: 'Final result and discipline',
          },
          {
            id: 'forum-civic',
            label: 'Host-city public order',
            description: 'Police blotters per city',
          },
          {
            id: 'forum-media',
            label: 'Media narrative',
            description: 'Referee corruption claims',
          },
        ]),
        CLAIM([
          {
            id: 'claim-result',
            label: 'Match result',
            description: 'FIFA primary',
          },
          {
            id: 'claim-order',
            label: 'Street order / celebration',
            description: 'City-level only',
          },
          {
            id: 'claim-catastrophe',
            label: 'Nationwide catastrophe',
            description: 'Usually exaggerated',
          },
        ]),
        ACCESS([
          {
            id: 'access-fifa',
            label: 'FIFA.com',
            description: 'Results primary',
          },
          {
            id: 'access-city',
            label: 'City police / press',
            description: 'Order claims',
          },
          {
            id: 'access-fan',
            label: 'Fan cams',
            description: 'Geolocate required',
          },
        ]),
        PLATFORM([
          {
            id: 'plat-high',
            label: 'Global final night',
            description: 'Peak meme velocity',
          },
          {
            id: 'plat-med',
            label: 'National fans',
            description: 'Country-specific',
          },
          {
            id: 'plat-low',
            label: 'Sports desk',
            description: 'Specialist only',
          },
        ]),
        VERIFY([
          {
            id: 'vd-split',
            label: 'Split ledgers',
            description: 'Match vs city never mixed',
          },
          {
            id: 'vd-fifa',
            label: 'FIFA-first result',
            description: '+1 only with primary',
          },
          {
            id: 'vd-city',
            label: 'City blotter',
            description: 'Arrest stats primary',
          },
        ]),
        HARM([
          {
            id: 'harm-med',
            label: 'Medium (crowds)',
            description: 'Celebration injuries',
          },
          {
            id: 'harm-high',
            label: 'High (riot deaths claim)',
            description: 'Need body counts',
          },
          {
            id: 'harm-low',
            label: 'Low (scoreline)',
            description: 'Results only',
          },
        ]),
      ],
    ),
  },

  'trend-08-venezuela-quake': {
    intelligenceBrief:
      'Disaster ground-truth. Seismic parameters from USGS/EMSC first. Mislocated rubble is −1. Casualty tallies stay 0 until civil protection tables.',
    applyEffects: [
      'Access path prioritizes seismic agencies',
      'Harm exposure gates graphic rescue imagery',
      'Verification depth kills cross-country rubble clips',
    ],
    defaultSelections: {
      'legal-forum': 'forum-disaster',
      'claim-class': 'claim-damage',
      'source-access': 'access-seismic',
      'platform-risk': 'plat-med',
      'verify-depth': 'vd-seismic',
      'harm-exposure': 'harm-high',
    },
    matrix: matrix(
      'matrix-cj-quake',
      'Venezuela quake · ground-truth intelligence',
      'Seismic primary + citizen damage tours with anti-mislocation controls.',
      [
        FORUM([
          {
            id: 'forum-disaster',
            label: 'Disaster response',
            description: 'Civil protection and aid',
          },
          {
            id: 'forum-sci',
            label: 'Scientific / seismic',
            description: 'Magnitude and epicenter',
          },
          {
            id: 'forum-inequality',
            label: 'Accountability / inequality',
            description: 'Aid access narratives',
          },
        ]),
        CLAIM([
          {
            id: 'claim-damage',
            label: 'Building damage',
            description: 'Needs geolocation',
          },
          {
            id: 'claim-toll',
            label: 'Casualty toll',
            description: 'Revises — default 0',
          },
          {
            id: 'claim-aid',
            label: 'Aid blocked / unequal',
            description: 'Need manifests',
          },
        ]),
        ACCESS([
          {
            id: 'access-seismic',
            label: 'USGS / EMSC',
            description: 'Primary parameters',
          },
          {
            id: 'access-citizen',
            label: 'Citizen rescue/damage',
            description: 'Secondary until geo',
          },
          {
            id: 'access-aid',
            label: 'IFRC / NGO',
            description: 'Aid updates',
          },
        ]),
        PLATFORM([
          {
            id: 'plat-med',
            label: 'Compassion virality',
            description: 'Fundraising fraud risk',
          },
          {
            id: 'plat-high',
            label: 'Political score-settling',
            description: 'Toll inflation risk',
          },
          {
            id: 'plat-low',
            label: 'Scientific channels',
            description: 'Seismic only',
          },
        ]),
        VERIFY([
          {
            id: 'vd-seismic',
            label: 'Seismic-first',
            description: 'USGS/EMSC before story',
          },
          {
            id: 'vd-geo',
            label: 'Building geolocation',
            description: 'Kill mislocated rubble',
          },
          {
            id: 'vd-toll',
            label: 'Toll table only',
            description: 'Civil protection final',
          },
        ]),
        HARM([
          {
            id: 'harm-high',
            label: 'High (victims)',
            description: 'Graphic restraint',
          },
          {
            id: 'harm-med',
            label: 'Medium',
            description: 'Damage without faces',
          },
          {
            id: 'harm-low',
            label: 'Low (maps/stats)',
            description: 'Parameters only',
          },
        ]),
      ],
    ),
  },

  'trend-09-political-claims': {
    intelligenceBrief:
      'Process desk only — not partisan product identity. FEC/court/transcript before meme prophecy. Fake polls are −1.',
    applyEffects: [
      'Forum locks export language to process claims',
      'Verification depth requires document links for +1 filings',
      'Platform risk high on election speculation waves',
    ],
    defaultSelections: {
      'legal-forum': 'forum-election',
      'claim-class': 'claim-filing',
      'source-access': 'access-fec',
      'platform-risk': 'plat-high',
      'verify-depth': 'vd-doc',
      'harm-exposure': 'harm-low',
    },
    matrix: matrix(
      'matrix-cj-political',
      'Political viral claims · process intelligence',
      'Election speculation hygiene: filings, quotes, polls — no brand narrative.',
      [
        FORUM([
          {
            id: 'forum-election',
            label: 'Election administration',
            description: 'FEC / filing process',
          },
          {
            id: 'forum-court',
            label: 'Court / eligibility',
            description: 'Dockets and opinions',
          },
          {
            id: 'forum-speech',
            label: 'Public speech / quote',
            description: 'Full transcript required',
          },
        ]),
        CLAIM([
          {
            id: 'claim-filing',
            label: 'Filing / candidacy paper',
            description: 'Document or 0',
          },
          {
            id: 'claim-poll',
            label: 'Poll / internal numbers',
            description: 'Field house required',
          },
          {
            id: 'claim-quote',
            label: 'Quote card',
            description: 'Full video context',
          },
        ]),
        ACCESS([
          {
            id: 'access-fec',
            label: 'FEC.gov / primary',
            description: 'Filings',
          },
          {
            id: 'access-court',
            label: 'CourtListener / docket',
            description: 'Legal process',
          },
          {
            id: 'access-social',
            label: 'Social screenshot',
            description: 'Default 0/−1',
          },
        ]),
        PLATFORM([
          {
            id: 'plat-high',
            label: 'Partisan forge risk',
            description: 'Fake docs and polls',
          },
          {
            id: 'plat-med',
            label: 'Cable + social loop',
            description: 'Normal politics cycle',
          },
          {
            id: 'plat-low',
            label: 'Records only',
            description: 'FEC/court readers',
          },
        ]),
        VERIFY([
          {
            id: 'vd-doc',
            label: 'Document-first',
            description: 'No +1 without PDF/link',
          },
          {
            id: 'vd-quote',
            label: 'Full transcript',
            description: 'Partial clips = 0',
          },
          {
            id: 'vd-poll',
            label: 'Poll methodology',
            description: 'Field house or −1',
          },
        ]),
        HARM([
          {
            id: 'harm-low',
            label: 'Low (process)',
            description: 'Paperwork focus',
          },
          {
            id: 'harm-med',
            label: 'Medium (reputation)',
            description: 'Defamation caution',
          },
          {
            id: 'harm-high',
            label: 'High (incitement)',
            description: 'Do not amplify threats',
          },
        ]),
      ],
    ),
  },

  'trend-10-clip-authenticity': {
    intelligenceBrief:
      'Meta desk for all others. Provenance before narrative. Synthetic and recycled media are −1. Default viral authenticity is 0.',
    applyEffects: [
      'Verification depth becomes the export gate language',
      'Platform risk assumes high bot/synthetic load',
      'Applies to every other desk as overlay checklist',
    ],
    defaultSelections: {
      'legal-forum': 'forum-media',
      'claim-class': 'claim-viral',
      'source-access': 'access-file',
      'platform-risk': 'plat-high',
      'verify-depth': 'vd-provenance',
      'harm-exposure': 'harm-med',
    },
    matrix: matrix(
      'matrix-cj-authenticity',
      'Clip authenticity · provenance intelligence',
      'Cross-cutting OSINT: reverse search, geolocation, uploader lineage, synthetic detection.',
      [
        FORUM([
          {
            id: 'forum-media',
            label: 'Media verification',
            description: 'Editorial standards',
          },
          {
            id: 'forum-platform',
            label: 'Platform integrity',
            description: 'ToS and amplification',
          },
          {
            id: 'forum-legal',
            label: 'Evidence handling',
            description: 'Chain of custody mindset',
          },
        ]),
        CLAIM([
          {
            id: 'claim-viral',
            label: 'Viral original?',
            description: 'Default 0',
          },
          {
            id: 'claim-recycled',
            label: 'Recycled archive',
            description: 'Often −1 when proven',
          },
          {
            id: 'claim-synthetic',
            label: 'Synthetic / AI',
            description: '−1 without provenance',
          },
        ]),
        ACCESS([
          {
            id: 'access-file',
            label: 'Original file',
            description: 'Best case metadata',
          },
          {
            id: 'access-stream',
            label: 'Platform stream only',
            description: 'Compressed, stripped',
          },
          {
            id: 'access-screenshot',
            label: 'Screenshot / re-encode',
            description: 'Weakest',
          },
        ]),
        PLATFORM([
          {
            id: 'plat-high',
            label: 'High synthetic load',
            description: '2026 default assumption',
          },
          {
            id: 'plat-med',
            label: 'Mixed authentic',
            description: 'Normal breaking news',
          },
          {
            id: 'plat-low',
            label: 'Controlled release',
            description: 'Official CCTV drops',
          },
        ]),
        VERIFY([
          {
            id: 'vd-provenance',
            label: 'Provenance stack',
            description: 'Reverse → geo → lineage',
          },
          {
            id: 'vd-two-angle',
            label: 'Two-device rule',
            description: 'Independent captures',
          },
          {
            id: 'vd-tool',
            label: 'Tool-assisted',
            description: 'InVID / reverse / EXIF',
          },
        ]),
        HARM([
          {
            id: 'harm-med',
            label: 'Medium (false context)',
            description: 'Wrong war / wrong city',
          },
          {
            id: 'harm-high',
            label: 'High (incitement media)',
            description: 'Do not amplify',
          },
          {
            id: 'harm-low',
            label: 'Low (method demos)',
            description: 'Training clips',
          },
        ]),
      ],
    ),
  },
}

export function getDesignStory(useCaseId: string): DesignStoryPack | undefined {
  return DESKS[useCaseId]
}

export function conditionsFromDesignStory(useCaseId: string, notes?: string): ActiveConditions | null {
  const story = DESKS[useCaseId]
  if (!story) return null
  return {
    matrixId: story.matrix.id,
    selections: { ...story.defaultSelections },
    notes: notes ?? story.intelligenceBrief,
    updatedAt: new Date().toISOString(),
  }
}
