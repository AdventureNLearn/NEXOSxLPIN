/**
 * Trend desk — top citizen-journalism topics (assembled 2026-07-25).
 * Full reports are verification briefings: +1 / 0 / −1 only.
 * Claims are scored for desk hygiene, not as final public truth.
 */

import type { EvidenceScore, MaterialClass } from '../../types/core'
import type { PaneId, PaneWeight, UseCaseProfile, UseCaseReport } from '../../types/useCase'
import { CONGRESS_DESK_PROFILES } from './congressDesks'
import { CORPUS_PROFILES } from './storyCorpus100'

const AS_OF = '2026-07-25'

function claim(
  id: string,
  statement: string,
  score: EvidenceScore,
  material: MaterialClass,
  notes: string,
  tags: string[],
  confidence: 'high' | 'medium' | 'low' | 'unknown' = score === 1 ? 'high' : score === -1 ? 'medium' : 'low',
) {
  return { id, statement, score, material, confidence, notes, tags }
}

function panes(
  primary: PaneId[],
  weights: PaneWeight[],
  onDemand: PaneId[],
  preset: UseCaseProfile['layoutPreset'],
): Pick<
  UseCaseProfile,
  | 'layoutPreset'
  | 'primaryPanes'
  | 'secondaryPanes'
  | 'defaultOpen'
  | 'paneWeights'
  | 'onDemand'
> {
  return {
    layoutPreset: preset,
    primaryPanes: primary,
    secondaryPanes: onDemand.slice(0, 3),
    defaultOpen: primary.slice(0, 5),
    paneWeights: weights,
    onDemand,
  }
}

const ALL_ON: PaneId[] = [
  'information',
  'analyst',
  'audit-ladder',
  'export-kit',
  'procedural-forge',
  'massing-viewer',
  'design-lab',
  'atlas',
  'research-hub',
]

function md(report: Omit<UseCaseReport, 'fullBriefMarkdown'> & { bodyExtra?: string }): string {
  const lines = [
    `# ${report.headline}`,
    '',
    `**As of:** ${report.asOf} · **Trend signal:** ${report.trendSignal}`,
    '',
    '## Executive summary',
    '',
    report.executiveSummary,
    '',
    '## Scored claims',
    '',
    ...report.claims.map(
      (c) =>
        `- **[${c.score === 1 ? '+1' : c.score === -1 ? '−1' : '0'}]** ${c.statement}\n  - _${c.material} · ${c.confidence}_ — ${c.notes}`,
    ),
    '',
    '## Timeline',
    '',
    ...report.timeline.map((t) => `- **${t.when}** — ${t.what}`),
    '',
    '## Open questions',
    '',
    ...report.openQuestions.map((q) => `- ${q}`),
    '',
    '## Verification playbook',
    '',
    ...report.verificationPlaybook.map((s, i) => `${i + 1}. ${s}`),
    '',
    '## Sources to seek',
    '',
    ...report.sourcesToSeek.map((s) => `- ${s}`),
    '',
    '## Noise / risk',
    '',
    ...report.noiseRisks.map((s) => `- ${s}`),
    '',
    report.geographicNotes ? `## Geography\n\n${report.geographicNotes}\n` : '',
    report.bodyExtra ?? '',
    '',
    '_Nexus trend desk · Layer-0 export only · scores are operator judgments._',
    '',
  ]
  return lines.filter((l) => l !== undefined).join('\n')
}

function report(r: Omit<UseCaseReport, 'fullBriefMarkdown'> & { bodyExtra?: string }): UseCaseReport {
  const { bodyExtra, ...rest } = r
  return {
    ...rest,
    fullBriefMarkdown: md({ ...rest, bodyExtra }),
  }
}

/** —— 10 trending citizen-journalist desks —— */

const R01 = report({
  asOf: AS_OF,
  trendSignal: 'Breaking on X: vehicle-into-crowd videos, police manhunt posts, CSD cancellation',
  headline: 'Berlin Christopher Street Day — vehicle into crowd near Tiergarten',
  executiveSummary:
    'On the evening of 25 July 2026, a vehicle struck pedestrians on a path in Berlin’s Tiergarten during/near Christopher Street Day (CSD) Pride activity. Multiple outlets report at least one death and roughly 14–15 injured; the driver fled on foot. Police launched a manhunt; organizers cut remaining events. Citizen video broke faster than official detail — classic high-velocity verification desk.',
  claims: [
    claim(
      'b1',
      'A vehicle struck pedestrians in Tiergarten during CSD-related activity on 25 Jul 2026 evening (local).',
      1,
      'primary',
      'Converging reports from major outlets (Guardian, ABC, German public broadcasters) and police major-incident posture.',
      ['berlin', 'csd', 'incident'],
    ),
    claim(
      'b2',
      'At least one person killed; on the order of 14–15 injured (some serious).',
      1,
      'secondary',
      'Casualty band consistent across early multi-outlet reporting; final counts may revise — treat as provisional +1.',
      ['casualties'],
    ),
    claim(
      'b3',
      'Driver fled the scene on foot; manhunt ongoing; no public suspect description for tactical reasons.',
      1,
      'secondary',
      'Police communications described in live coverage; description withheld — do not invent facial/vehicle IDs from viral posts.',
      ['police', 'manhunt'],
    ),
    claim(
      'b4',
      'Motive is established as a targeted ideological attack.',
      0,
      'assumption',
      'Motive not established in early official statements. Hold political framing until primary confirmation.',
      ['motive'],
    ),
    claim(
      'b5',
      'Viral clip claiming “dozens dead” or a second simultaneous attack site.',
      -1,
      'assumption',
      'Conflicts with multi-outlet casualty band and single-scene police posture. Score −1 until primary counters.',
      ['viral', 'inflation'],
    ),
  ],
  timeline: [
    { when: '25 Jul 2026 ~22:00 local', what: 'Vehicle strikes pedestrians on Tiergarten path (Ahornsteig / near Lennéstraße in early reports).' },
    { when: 'Minutes after', what: 'Eyewitness phone video circulates on X; police declare major incident.' },
    { when: 'Same evening', what: 'CSD remaining program cancelled; attendees directed away from Tiergarten / Victory Column area.' },
    { when: 'Into 26 Jul', what: 'Manhunt continues; mayor condemns attack on open society; motive still unclear in public briefings.' },
  ],
  openQuestions: [
    'Exact vehicle type/color confirmed by police (not only social media)?',
    'Is there CCTV / ANPR chain establishing approach path?',
    'Were counter-demonstrations nearby operationally related or only coincident?',
    'Final casualty and injury classification from hospital/police primary?',
  ],
  verificationPlaybook: [
    'Freeze first 10 viral videos; hash/time-order; reject unlocated reposts.',
    'Map scene claims to Tiergarten paths — reject clips geolocated elsewhere.',
    'Separate police statements from mayor political speech — both useful, different scores.',
    'Do not publish suspect face from anonymous accounts.',
    'Ladder: L0 scene identity → L1 path geometry → L2 response systems → export only after −1 cleared.',
  ],
  sourcesToSeek: [
    'Berlin Police official channels',
    'Tagesschau / ZDF live tickers',
    'Hospital/EMS aggregate statements',
    'Organizer CSD cancellation notice',
    'Court charging document when issued',
  ],
  noiseRisks: [
    'Repurposed parade videos from prior years',
    'Casualty inflation for engagement',
    'Partisan motive attribution without evidence',
    'Deepfake audio of officials',
  ],
  geographicNotes: 'Tiergarten, Berlin — park paths adjacent to Pride route; not the full parade spine for all clips.',
})

const R02 = report({
  asOf: AS_OF,
  trendSignal: 'Mass evacuation videos, Cap Ferret boat exits, Madrid-area fire fronts on X',
  headline: 'Iberian wildfires — Spain & SW France mass evacuations',
  executiveSummary:
    'Extreme heat and drought-driven wildfires across Spain (incl. Madrid region / Guadalajara) and southwestern France (Gironde, Landes, Cap Ferret) forced very large evacuations — cumulative figures in the low hundreds of thousands depending on source. Citizen drone/phone video shows scale; official numbers still move. Desk priority: map claims, separate tourist panic from primary evacuation orders, kill exaggerated “city burned” posts.',
  claims: [
    claim(
      'w1',
      'Large multi-jurisdiction wildfire emergency with mass evacuations in Spain and SW France in late July 2026.',
      1,
      'primary',
      'AP, BBC, DW, Euronews, France24 multi-source agreement on scale and dual-country impact.',
      ['wildfire', 'eu'],
    ),
    claim(
      'w2',
      'France: order-of-magnitude 100k+ evacuated in Gironde/Landes area including Cap Ferret tourist zone.',
      1,
      'secondary',
      'Range 110k–200k appears across outlets — use range language; do not hard-lock a single integer without prefecture primary.',
      ['france', 'gironde'],
    ),
    claim(
      'w3',
      'Spain: major fires near Madrid region / Guadalajara with village evacuations and at least one civilian death (Valencia-area reporting).',
      1,
      'secondary',
      'Death of elderly man near Valencia reported; Madrid-region evacuations/confinement orders multi-sourced.',
      ['spain', 'casualties'],
    ),
    claim(
      'w4',
      '“Bordeaux city center is fully evacuated / destroyed.”',
      -1,
      'assumption',
      'Fires approached suburbs; city-center destruction claim conflicts with mainstream reporting. −1 until primary.',
      ['exaggeration'],
    ),
    claim(
      'w5',
      'Exact total hectares burned Europe-wide this week is a single settled number.',
      0,
      'derived',
      'EU aggregates lag; treat as 0 until Copernicus/civil protection table cited.',
      ['stats'],
    ),
  ],
  timeline: [
    { when: 'Mid–late Jul 2026', what: 'Heatwave + dry fuels; multiple large fires ignite/expand in Spain & France.' },
    { when: '24–25 Jul', what: 'Cap Ferret and Gironde evacuations surge; EU water-bomber mutual aid.' },
    { when: '25 Jul', what: 'Additional precautionary night evacuations near Bordeaux suburbs; Spanish national emergency framing in some reports.' },
  ],
  openQuestions: [
    'Prefecture-by-prefecture official headcount tables?',
    'Which fires remain convective vs contained?',
    'Negligence arrest in Spain — charging status?',
    'Air quality / hospital surge data primary?',
  ],
  verificationPlaybook: [
    'Geolocate every fire clip (road signs, coastline shape for Cap Ferret).',
    'Prefer prefecture / Protezione Civile-equivalent posts over influencer tallies.',
    'Chart evacuation orders vs “I left because smoke” anecdotes.',
    'Atlas: pin corridors; Design Lab: model wind/access constraints as conditions only.',
  ],
  sourcesToSeek: [
    'French prefectures (Gironde, Landes)',
    'Spanish regional emergency accounts',
    'EU Civil Protection / Copernicus EMS',
    'Local fire service briefings',
  ],
  noiseRisks: [
    'Old 2022 fire footage recycled',
    'AI-upscaled “apocalypse” stills',
    'Tourism marketing denialism vs panic inflation',
  ],
  geographicNotes: 'SW France Atlantic coast + central Spain fire complexes — not a single continuous burn scar.',
})

const R03 = report({
  asOf: AS_OF,
  trendSignal: 'Strike/missile videos, Hormuz shipping risk posts, multi-language warfog threads',
  headline: 'US–Iran / Strait of Hormuz — conflict verification desk',
  executiveSummary:
    'Ongoing regional conflict coverage (US strikes on Iranian targets; Iranian/proxy responses; shipping risk in Hormuz/Red Sea) dominates serious news + X warfog. Citizen journalists must separate geolocated primary footage from recycled war clips, official claims, and engagement bait. This desk is high −1 risk for misattributed explosions.',
  claims: [
    claim(
      'h1',
      'Armed conflict actions involving US and Iranian-linked forces continued into July 2026 with public multi-outlet coverage.',
      1,
      'secondary',
      'Sustained reporting from major wires/broadcasters; treat operational detail as fluid.',
      ['conflict', 'geopolitics'],
    ),
    claim(
      'h2',
      'Commercial shipping faces elevated risk narratives around Hormuz / Red Sea corridors.',
      1,
      'secondary',
      'Industry and news reporting on threats/attacks to shipping; verify each incident separately.',
      ['shipping', 'hormuz'],
    ),
    claim(
      'h3',
      'Any single viral “city X completely destroyed tonight” clip is verified as tonight’s event.',
      0,
      'assumption',
      'Default 0 until reverse-image, shadow, and landmark geolocation complete.',
      ['viral', 'geolocation'],
    ),
    claim(
      'h4',
      'Recycled footage from prior conflicts presented as live July 2026 strikes.',
      -1,
      'assumption',
      'Common failure mode. Score −1 when metadata/landmarks prove prior event.',
      ['recycled'],
    ),
  ],
  timeline: [
    { when: '2026 summer', what: 'Escalatory strike/response cycle reported across major outlets.' },
    { when: 'Ongoing', what: 'Shipping advisories and proxy maritime incidents enter feeds intermittently.' },
  ],
  openQuestions: [
    'Which clips reverse-image to older archives?',
    'Official vs opposition casualty methodologies?',
    'Insurance / shipping NOTAMs primary text?',
  ],
  verificationPlaybook: [
    'Never amplify unlocated explosion audio alone.',
    'Pair every strike claim with two independent sources or one primary official + one local.',
    'Maintain separate ledger for Hormuz vs Red Sea vs inland cities.',
    'Export only after open −1 recycled-footage items resolved.',
  ],
  sourcesToSeek: [
    'Wire services with on-record officials',
    'Maritime insurance / UKMTO-style advisories',
    'Satellite fire/thermal products when available',
    'Local journalists with established track record',
  ],
  noiseRisks: ['Fog of war', 'State media amplification', 'Botnet hashtag floods', 'Deepfake officials'],
  geographicNotes: 'Multiple theaters — do not collapse into one map pin.',
})

const R04 = report({
  asOf: AS_OF,
  trendSignal: '#DharmendraPradhan and Gen Z protest clips; minister resignation discourse',
  headline: 'India youth education protests — “phones in hand” accountability desk',
  executiveSummary:
    'Gen Z-led protests against education system failures forced high political cost (education minister resignation in multi-outlet coverage). Movement organizes and documents via phones/memes — textbook citizen journalism. Desk task: verify resignation/primary documents, separate protest violence claims, avoid communal reframing without evidence.',
  claims: [
    claim(
      'i1',
      'Sustained youth protests over education policy/governance generated national political consequences in July 2026.',
      1,
      'secondary',
      'NYT and other outlets describe resignation as rare win; confirm with government gazette/primary notice.',
      ['india', 'education', 'protest'],
    ),
    claim(
      'i2',
      'Social media and phone video were central organizing/documentation tools.',
      1,
      'secondary',
      'Consistent theme in coverage of digital-native protest methods.',
      ['citizen-journalism'],
    ),
    claim(
      'i3',
      'Every viral “police massacre” clip from this protest wave is verified.',
      0,
      'assumption',
      'Verify each incident with hospital/court/police primary — do not batch-score.',
      ['force'],
    ),
    claim(
      'i4',
      'Protest is only a foreign-funded op with no domestic grievance.',
      -1,
      'assumption',
      'Blanket foreign-funding claim without documentary trail — −1 as disqualifying smear until primary.',
      ['disinfo'],
    ),
  ],
  timeline: [
    { when: 'Weeks leading to late Jul 2026', what: 'Campus and street actions escalate; digital narratives dominate.' },
    { when: 'Late Jul 2026', what: 'Ministerial resignation reported; movement demands may continue.' },
  ],
  openQuestions: [
    'Primary resignation text / official communique URL?',
    'Policy concessions actually enacted vs symbolic?',
    'Arrest counts primary from police vs activist tallies?',
  ],
  verificationPlaybook: [
    'Archive protest livestreams with time + city tags.',
    'Score policy claims only against gazette/legislation text.',
    'Ladder L0 movement identity → L2 institutions → L4 package for explainer.',
  ],
  sourcesToSeek: [
    'Press Information Bureau / ministry notices',
    'Indian national and regional papers of record',
    'Court filings if any',
    'University administration circulars',
  ],
  noiseRisks: ['Communal hijacking of education story', 'Bot amplification', 'Out-of-context campus brawls'],
})

const R05 = report({
  asOf: AS_OF,
  trendSignal: '#LaVeladaDelAñoVI worldwide top trend — fight clips, crowd scale, celebrity crossovers',
  headline: 'La Velada del Año VI — mass livestream event verification',
  executiveSummary:
    'Ibai Llanos’ influencer boxing spectacle (#LaVeladaDelAñoVI) is among the strongest global X trends. Millions engage with fight results, crowd shots, and side controversies. CJ value: practice rapid claim triage on results, injuries, and “stadium incident” rumors without treating fandom as fact.',
  claims: [
    claim(
      'v1',
      'La Velada del Año VI is a major 2026 livestream combat/entertainment event driving global trends.',
      1,
      'primary',
      'Dominant worldwide trend listings and multi-platform coverage.',
      ['event', 'livestream'],
    ),
    claim(
      'v2',
      'Specific fight outcomes as posted by official show channels.',
      1,
      'primary',
      'Score +1 only when matched to official card result posts — not random fan accounts.',
      ['results'],
    ),
    claim(
      'v3',
      'Unverified “fighter critically injured backstage” rumor threads.',
      0,
      'assumption',
      'Hold at 0 until medical/team primary.',
      ['injury', 'rumor'],
    ),
    claim(
      'v4',
      'Crowd stampede with mass casualties at the venue (if only single anonymous video).',
      -1,
      'assumption',
      'Absent multi-source confirmation, treat mass-casualty stampede claims as −1 conflict with event coverage.',
      ['safety'],
    ),
  ],
  timeline: [
    { when: 'Event night 2026', what: 'Livestream card runs; X flooded with clips and results.' },
    { when: 'Immediate aftermath', what: 'Memes, betting disputes, side drama trends.' },
  ],
  openQuestions: [
    'Official attendance vs capacity?',
    'Any formal security incident reports?',
    'Licensing/commission result sheets?',
  ],
  verificationPlaybook: [
    'Whitelist official show + commission accounts for results.',
    'Geolocate “incident” clips to venue exterior vs unrelated streets.',
    'Separate sports result desk from safety incident desk.',
  ],
  sourcesToSeek: ['Official Velada channels', 'Local Seville emergency services if incident claimed', 'Commission records'],
  noiseRisks: ['Betting disinformation', 'Edited KO angles', 'Fake injury screenshots'],
  geographicNotes: 'Event associated with large Spanish venue / Seville-area reporting in prior editions — confirm 2026 site from official card.',
})

const R06 = report({
  asOf: AS_OF,
  trendSignal: '#UFCAbuDhabi + fight-night clips, injury rumors, judging controversies',
  headline: 'UFC Abu Dhabi — fight-night claim triage',
  executiveSummary:
    'UFC Abu Dhabi card trends alongside combat-sports noise. Citizen desk: official result vs gambling rumor; medical suspensions; judging controversies. Same hygiene as any sports-misinfo desk.',
  claims: [
    claim(
      'u1',
      'UFC Abu Dhabi event is an active July 2026 combat-sports trend cluster on X.',
      1,
      'primary',
      'Present on US/global trend boards with fight-related handles.',
      ['ufc', 'sports'],
    ),
    claim(
      'u2',
      'Official fight results as published by UFC.',
      1,
      'primary',
      '+1 only with UFC result graphic/page — not tipster screenshots.',
      ['results'],
    ),
    claim(
      'u3',
      'Judging “robbery” narratives.',
      0,
      'derived',
      'Subjective; score media scorecards separately from conspiracy claims.',
      ['judging'],
    ),
    claim(
      'u4',
      'Fighter death rumor without hospital/promotion confirmation.',
      -1,
      'assumption',
      'Recurring hoax pattern — −1 until primary.',
      ['hoax'],
    ),
  ],
  timeline: [
    { when: 'Fight week / night', what: 'Weigh-ins, card, results, and rumor cascade.' },
  ],
  openQuestions: ['Athletic commission medical suspensions?', 'Purse/drug testing primaries?'],
  verificationPlaybook: [
    'Pin UFC.com / official app results.',
    'Cross-check injury claims with multiple beat reporters.',
    'Export kit only for confirmed result packages, not rumor threads.',
  ],
  sourcesToSeek: ['UFC official', 'Abu Dhabi commission if public', 'Established MMA beat reporters'],
  noiseRisks: ['Gambling bots', 'Fake screenshots', 'Old fight clips labeled live'],
})

const R07 = report({
  asOf: AS_OF,
  trendSignal: 'World Cup aftermath fan cams, celebration/riot claims, final result discourse',
  headline: 'FIFA World Cup 2026 aftermath — public order & result verification',
  executiveSummary:
    'After the 2026 final (reported Spain 1–0 Argentina extra time, 19 Jul), aftermath content still circulates: celebrations, disorder claims, referee debates. CJ desk separates match facts from street-order claims city-by-city.',
  claims: [
    claim(
      'f1',
      'Spain defeated Argentina 1–0 in extra time in the 2026 World Cup final (19 Jul 2026) per major encyclopedic/news summaries.',
      1,
      'secondary',
      'Confirm against FIFA primary result for publication.',
      ['worldcup', 'result'],
    ),
    claim(
      'f2',
      'Celebration gatherings occurred in multiple cities with large citizen video volume.',
      1,
      'secondary',
      'Expected pattern; still geolocate each viral “riot” claim.',
      ['fans'],
    ),
    claim(
      'f3',
      'Nationwide “civil war” or mass fatality celebration riots as a single event.',
      -1,
      'assumption',
      'Catastrophic framing without multi-city primary body counts — −1.',
      ['exaggeration'],
    ),
    claim(
      'f4',
      'Specific referee corruption allegation with document proof.',
      0,
      'assumption',
      'Hold 0 until documents or official investigation primary.',
      ['refereeing'],
    ),
  ],
  timeline: [
    { when: '19 Jul 2026', what: 'Final played; result reported Spain win in ET.' },
    { when: '20–25 Jul', what: 'Aftermath memes, fan cams, and public-order claims linger on X.' },
  ],
  openQuestions: ['FIFA disciplinary cases?', 'City-level arrest stats primary?'],
  verificationPlaybook: [
    'One ledger for match facts; separate ledger per city for street claims.',
    'Reject cross-country footage mismatches.',
  ],
  sourcesToSeek: ['FIFA.com', 'Host-city police blotters', 'Local papers of record'],
  noiseRisks: ['Old hooligan footage', 'AI crowd synthesis', 'Betting disinfo'],
})

const R08 = report({
  asOf: AS_OF,
  trendSignal: 'Earthquake aftermath rescue clips, damage tours, inequality narratives',
  headline: 'Venezuela earthquake aftermath — ground-truth desk',
  executiveSummary:
    'Post-quake citizen footage (rescue, damage, pets, inequality) continues to surface. Desk priorities: magnitude/epicenter primary from seismological agencies; reject mislocated damage clips; track aid access claims carefully.',
  claims: [
    claim(
      'q1',
      'Significant earthquake impacts in Venezuela generated citizen rescue/damage media in 2026 coverage.',
      1,
      'secondary',
      'Multi-outlet aftermath reporting; pin USGS/FUNVISIS numbers for magnitude.',
      ['earthquake', 'venezuela'],
    ),
    claim(
      'q2',
      'Exact death toll is settled and static.',
      0,
      'derived',
      'Tolls revise — keep 0 until civil protection final table.',
      ['casualties'],
    ),
    claim(
      'q3',
      'Clip from a different country’s quake labeled as Venezuela 2026.',
      -1,
      'assumption',
      'Classic misinfo; −1 when geolocation fails.',
      ['mislocated'],
    ),
  ],
  timeline: [
    { when: 'Event + days after', what: 'Rescue phase citizen media peaks.' },
    { when: 'Weeks after', what: 'Recovery, aid politics, inequality framing.' },
  ],
  openQuestions: ['Official damage assessment PDF?', 'International aid manifests?'],
  verificationPlaybook: [
    'USGS/EMSC first for seismic parameters.',
    'Building-style geolocation before amplifying damage tours.',
    'Atlas pins for verified neighborhoods only.',
  ],
  sourcesToSeek: ['USGS', 'National civil protection', 'Local journalists', 'Red Cross/IFRC updates'],
  noiseRisks: ['Compassion fraud fundraising', 'Mislocated rubble', 'Political score-settling via casualty inflation'],
})

const R09 = report({
  asOf: AS_OF,
  trendSignal: '“Trump 2028” multi-day trend; political speculation threads',
  headline: 'Viral political claims desk — election speculation hygiene',
  executiveSummary:
    'Multi-day X trend energy around 2028 US election speculation. Citizen journalists should treat this as a claim-triage gym: separate court filings, FEC paperwork, and speech transcripts (+1) from meme prophecy (0) and fabricated “internal polls” (−1). No partisan product identity — process only.',
  claims: [
    claim(
      'p1',
      '“Trump 2028” is an active multi-day political conversation cluster on X as of late July 2026.',
      1,
      'primary',
      'Trend calendars list multi-day presence; conversation ≠ legal candidacy paperwork.',
      ['politics', 'trends'],
    ),
    claim(
      'p2',
      'Any specific “he filed today” claim without FEC/primary document.',
      0,
      'assumption',
      'Require document link or agency confirmation.',
      ['filing'],
    ),
    claim(
      'p3',
      'Screenshot “internal poll” with no field house, dates, or sample.',
      -1,
      'assumption',
      'Unsourced poll graphics are disqualifying noise.',
      ['polling', 'fabrication'],
    ),
    claim(
      'p4',
      'Quotes: score only against full video/transcript.',
      0,
      'derived',
      'Partial clips default 0 until full context.',
      ['quotes'],
    ),
  ],
  timeline: [
    { when: 'Ongoing 2026', what: 'Speculation cycles pulse with speeches, court news, and meme waves.' },
  ],
  openQuestions: ['Primary legal eligibility documents?', 'Actual exploratory committee filings?'],
  verificationPlaybook: [
    'FEC / court dockets first.',
    'Full-speech transcript before quote cards.',
    'Label speculation explicitly in WD.',
  ],
  sourcesToSeek: ['FEC.gov', 'CourtListener/PACER summaries', 'Full speech videos', 'AP/Reuters election wires'],
  noiseRisks: ['Partisan forgeries', 'Out-of-context clips', 'Fake ballot images'],
})

const R10 = report({
  asOf: AS_OF,
  trendSignal: 'Cross-cutting: recycled clips, AI media, and “source: trust me bro” on every desk above',
  headline: 'X clip authenticity — deepfake & recycled-media desk',
  executiveSummary:
    'Meta-desk for all other trends. July 2026 feeds mix real eyewitness video with recycled archives and synthetic media. This profile trains the signal/noise loop: provenance, geolocation, reverse search, uploader history, and Layer-0 before any export of “proof clips.”',
  claims: [
    claim(
      'a1',
      'Platform distribution speed routinely outpaces institutional verification on breaking stories.',
      1,
      'secondary',
      'Structural observation supported by conflict/disaster case pattern.',
      ['platform', 'verification'],
    ),
    claim(
      'a2',
      'A given viral clip is authentic original capture of the claimed event.',
      0,
      'assumption',
      'Default 0 until reverse-image, upload lineage, and geolocation pass.',
      ['authenticity'],
    ),
    claim(
      'a3',
      'Clip proven to be from a different date/location than caption claims.',
      -1,
      'primary',
      'When verification shows mismatch, score −1 and block export of packages relying on it.',
      ['recycled', 'disinfo'],
    ),
    claim(
      'a4',
      'AI-generated “eyewitness” video accepted because it “looks real.”',
      -1,
      'assumption',
      'Lookism is not a method. −1 without provenance.',
      ['synthetic'],
    ),
  ],
  timeline: [
    { when: 'Every breaking desk', what: 'T0 viral post → T+minutes duets → T+hours fact-check backlog.' },
  ],
  openQuestions: [
    'Uploader account age / bot indicators?',
    'Original file metadata if obtained?',
    'Corroborating camera angles?',
  ],
  verificationPlaybook: [
    'Reverse image/video search first.',
    'Check shadow length, weather, signage language.',
    'Prefer two independent capture devices.',
    'Log every reject as −1 with reason in WD.',
  ],
  sourcesToSeek: [
    'InVID/WeVerify-style tooling notes',
    'Original uploader thread',
    'Local journalists confirming scene',
    'Official CCTV releases when any',
  ],
  noiseRisks: ['Engagement farming', 'State sockpuppets', 'Synthetic audio of officials'],
})

function profile(
  partial: Omit<UseCaseProfile, 'dataPackId' | 'family'> & { family?: string },
): UseCaseProfile {
  return {
    dataPackId: 'pack-sample-alpha',
    family: partial.family ?? 'citizen-journalism',
    ...partial,
  }
}

export const USE_CASE_CATALOG: UseCaseProfile[] = [
  profile({
    id: 'gen-explore',
    label: 'General explore',
    tagline: 'Orient on the workbench, then open a ranked trend desk',
    family: 'general',
    description: 'Onboarding layout. Switch into any of the 10 trending citizen-journalist desks from the header.',
    workflow: [
      'Read Information → Use cases & research',
      'Open a ranked trend desk (1–10)',
      'Score claims; resolve −1 before export',
    ],
    sampleClaimHints: [
      'Pick a trend desk for live claims',
      'Default new viral media to 0 until proven',
      '−1 recycled or fabricated clips block export',
    ],
    ...panes(
      ['information', 'research-hub', 'atlas'],
      [
        { pane: 'information', weight: 4, minPx: 280 },
        { pane: 'research-hub', weight: 4, minPx: 260 },
        { pane: 'atlas', weight: 4, minPx: 400 },
      ],
      ALL_ON.filter((p) => !['information', 'research-hub', 'atlas'].includes(p)),
      'research-first',
    ),
  }),

  profile({
    id: 'trend-01-berlin-csd',
    trendRank: 1,
    label: '① Berlin CSD vehicle attack',
    tagline: R01.headline,
    description: R01.executiveSummary,
    workflow: R01.verificationPlaybook.slice(0, 4),
    sampleClaimHints: R01.claims.map(
      (c) => `${c.score === 1 ? '+1' : c.score === -1 ? '−1' : '0'}: ${c.statement}`,
    ),
    report: R01,
    ...panes(
      ['atlas', 'research-hub', 'audit-ladder'],
      [
        { pane: 'atlas', weight: 5, minPx: 520, pinned: true },
        { pane: 'research-hub', weight: 4, minPx: 260 },
        { pane: 'audit-ladder', weight: 3, minPx: 200 },
      ],
      ['analyst', 'export-kit', 'design-lab', 'information', 'procedural-forge', 'massing-viewer'],
      'spatial-primary',
    ),
  }),

  profile({
    id: 'trend-02-iberian-fires',
    trendRank: 2,
    label: '② Iberian wildfires',
    tagline: R02.headline,
    description: R02.executiveSummary,
    workflow: R02.verificationPlaybook.slice(0, 4),
    sampleClaimHints: R02.claims.map(
      (c) => `${c.score === 1 ? '+1' : c.score === -1 ? '−1' : '0'}: ${c.statement}`,
    ),
    report: R02,
    ...panes(
      ['atlas', 'research-hub', 'design-lab'],
      [
        { pane: 'atlas', weight: 5, minPx: 520, pinned: true },
        { pane: 'research-hub', weight: 4, minPx: 260 },
        { pane: 'design-lab', weight: 3, minPx: 240 },
      ],
      ['analyst', 'export-kit', 'audit-ladder', 'information', 'procedural-forge', 'massing-viewer'],
      'spatial-primary',
    ),
  }),

  profile({
    id: 'trend-03-hormuz-conflict',
    trendRank: 3,
    label: '③ Hormuz / Iran conflict fog',
    tagline: R03.headline,
    description: R03.executiveSummary,
    workflow: R03.verificationPlaybook.slice(0, 4),
    sampleClaimHints: R03.claims.map(
      (c) => `${c.score === 1 ? '+1' : c.score === -1 ? '−1' : '0'}: ${c.statement}`,
    ),
    report: R03,
    ...panes(
      ['research-hub', 'atlas', 'analyst'],
      [
        { pane: 'research-hub', weight: 5, minPx: 280, pinned: true },
        { pane: 'atlas', weight: 4, minPx: 420 },
        { pane: 'analyst', weight: 3, minPx: 200 },
      ],
      ['audit-ladder', 'export-kit', 'design-lab', 'information', 'procedural-forge', 'massing-viewer'],
      'research-first',
    ),
  }),

  profile({
    id: 'trend-04-india-education',
    trendRank: 4,
    label: '④ India education protests',
    tagline: R04.headline,
    description: R04.executiveSummary,
    workflow: R04.verificationPlaybook.slice(0, 4),
    sampleClaimHints: R04.claims.map(
      (c) => `${c.score === 1 ? '+1' : c.score === -1 ? '−1' : '0'}: ${c.statement}`,
    ),
    report: R04,
    ...panes(
      ['research-hub', 'audit-ladder', 'analyst'],
      [
        { pane: 'research-hub', weight: 5, minPx: 280, pinned: true },
        { pane: 'audit-ladder', weight: 3, minPx: 200 },
        { pane: 'analyst', weight: 3, minPx: 200 },
      ],
      ['export-kit', 'atlas', 'design-lab', 'information', 'procedural-forge', 'massing-viewer'],
      'triage-compact',
    ),
  }),

  profile({
    id: 'trend-05-la-velada',
    trendRank: 5,
    label: '⑤ La Velada del Año VI',
    tagline: R05.headline,
    description: R05.executiveSummary,
    workflow: R05.verificationPlaybook.slice(0, 4),
    sampleClaimHints: R05.claims.map(
      (c) => `${c.score === 1 ? '+1' : c.score === -1 ? '−1' : '0'}: ${c.statement}`,
    ),
    report: R05,
    ...panes(
      ['research-hub', 'analyst', 'export-kit'],
      [
        { pane: 'research-hub', weight: 5, minPx: 280, pinned: true },
        { pane: 'analyst', weight: 3, minPx: 200 },
        { pane: 'export-kit', weight: 3, minPx: 220 },
      ],
      ['atlas', 'audit-ladder', 'design-lab', 'information', 'procedural-forge', 'massing-viewer'],
      'triage-compact',
    ),
  }),

  profile({
    id: 'trend-06-ufc-abu-dhabi',
    trendRank: 6,
    label: '⑥ UFC Abu Dhabi',
    tagline: R06.headline,
    description: R06.executiveSummary,
    workflow: R06.verificationPlaybook.slice(0, 4),
    sampleClaimHints: R06.claims.map(
      (c) => `${c.score === 1 ? '+1' : c.score === -1 ? '−1' : '0'}: ${c.statement}`,
    ),
    report: R06,
    ...panes(
      ['research-hub', 'analyst', 'audit-ladder'],
      [
        { pane: 'research-hub', weight: 5, minPx: 280, pinned: true },
        { pane: 'analyst', weight: 3, minPx: 200 },
        { pane: 'audit-ladder', weight: 3, minPx: 200 },
      ],
      ['export-kit', 'atlas', 'design-lab', 'information', 'procedural-forge', 'massing-viewer'],
      'triage-compact',
    ),
  }),

  profile({
    id: 'trend-07-world-cup',
    trendRank: 7,
    label: '⑦ World Cup 2026 aftermath',
    tagline: R07.headline,
    description: R07.executiveSummary,
    workflow: R07.verificationPlaybook.slice(0, 4),
    sampleClaimHints: R07.claims.map(
      (c) => `${c.score === 1 ? '+1' : c.score === -1 ? '−1' : '0'}: ${c.statement}`,
    ),
    report: R07,
    ...panes(
      ['research-hub', 'atlas', 'export-kit'],
      [
        { pane: 'research-hub', weight: 4, minPx: 260, pinned: true },
        { pane: 'atlas', weight: 4, minPx: 400 },
        { pane: 'export-kit', weight: 3, minPx: 220 },
      ],
      ['analyst', 'audit-ladder', 'design-lab', 'information', 'procedural-forge', 'massing-viewer'],
      'research-first',
    ),
  }),

  profile({
    id: 'trend-08-venezuela-quake',
    trendRank: 8,
    label: '⑧ Venezuela quake aftermath',
    tagline: R08.headline,
    description: R08.executiveSummary,
    workflow: R08.verificationPlaybook.slice(0, 4),
    sampleClaimHints: R08.claims.map(
      (c) => `${c.score === 1 ? '+1' : c.score === -1 ? '−1' : '0'}: ${c.statement}`,
    ),
    report: R08,
    ...panes(
      ['atlas', 'research-hub', 'audit-ladder'],
      [
        { pane: 'atlas', weight: 5, minPx: 520, pinned: true },
        { pane: 'research-hub', weight: 4, minPx: 260 },
        { pane: 'audit-ladder', weight: 3, minPx: 200 },
      ],
      ['export-kit', 'analyst', 'design-lab', 'information', 'procedural-forge', 'massing-viewer'],
      'spatial-primary',
    ),
  }),

  profile({
    id: 'trend-09-political-claims',
    trendRank: 9,
    label: '⑨ Political viral claims (2028)',
    tagline: R09.headline,
    description: R09.executiveSummary,
    workflow: R09.verificationPlaybook.slice(0, 4),
    sampleClaimHints: R09.claims.map(
      (c) => `${c.score === 1 ? '+1' : c.score === -1 ? '−1' : '0'}: ${c.statement}`,
    ),
    report: R09,
    ...panes(
      ['research-hub', 'audit-ladder', 'export-kit'],
      [
        { pane: 'research-hub', weight: 5, minPx: 280, pinned: true },
        { pane: 'audit-ladder', weight: 3, minPx: 200 },
        { pane: 'export-kit', weight: 3, minPx: 220 },
      ],
      ['analyst', 'atlas', 'design-lab', 'information', 'procedural-forge', 'massing-viewer'],
      'export-review',
    ),
  }),

  profile({
    id: 'trend-10-clip-authenticity',
    trendRank: 10,
    label: '⑩ X clip authenticity desk',
    tagline: R10.headline,
    description: R10.executiveSummary,
    workflow: R10.verificationPlaybook.slice(0, 4),
    sampleClaimHints: R10.claims.map(
      (c) => `${c.score === 1 ? '+1' : c.score === -1 ? '−1' : '0'}: ${c.statement}`,
    ),
    report: R10,
    ...panes(
      ['research-hub', 'analyst', 'export-kit'],
      [
        { pane: 'research-hub', weight: 5, minPx: 280, pinned: true },
        { pane: 'analyst', weight: 3, minPx: 200 },
        { pane: 'export-kit', weight: 3, minPx: 220 },
      ],
      ['audit-ladder', 'atlas', 'design-lab', 'information', 'procedural-forge', 'massing-viewer'],
      'triage-compact',
    ),
  }),

  // 56 congressional / industry-effect training desks
  ...CONGRESS_DESK_PROFILES.map((p) =>
    profile({
      ...p,
      family: 'congressional',
    }),
  ),

  // +33 corpus desks (10 geopolitical detailed + 23 topical) → 100 total
  ...CORPUS_PROFILES.map((p) => profile({ ...p })),
]

/** Fresh sessions land on general explore; trend desks activate via switcher. */
export const DEFAULT_USE_CASE_ID = 'gen-explore'

/** Alias used by UI labels — keep in sync with maturity channel */
export { PRODUCT_VERSION } from '../../lib/product/maturity'

export function getUseCase(id: string): UseCaseProfile {
  return USE_CASE_CATALOG.find((p) => p.id === id) ?? USE_CASE_CATALOG[0]!
}

export function groupUseCasesByFamily(): Record<string, UseCaseProfile[]> {
  const map: Record<string, UseCaseProfile[]> = {}
  for (const p of USE_CASE_CATALOG) {
    if (!map[p.family]) map[p.family] = []
    map[p.family]!.push(p)
  }
  return map
}

export const FAMILY_LABELS: Record<string, string> = {
  'citizen-journalism': 'Trend desk (citizen journalism)',
  congressional: 'Congressional / industry-effect desks',
  general: 'General',
  geopolitical: 'Geopolitical',
  infrastructure: 'Infrastructure',
  'public-health': 'Public health',
  'cyber-security': 'Cyber security',
  'climate-extreme': 'Climate & extreme weather',
  'markets-finance': 'Markets & finance',
  'elections-process': 'Elections process',
  'tech-governance': 'Tech governance',
  regulatory: 'Regulatory',
  network: 'Network',
  technical: 'Technical',
  civic: 'Civic',
  trending: 'Trending',
}

export function congressionalDesks(): UseCaseProfile[] {
  return USE_CASE_CATALOG.filter((p) => p.family === 'congressional')
}

export function trendingDesks(): UseCaseProfile[] {
  return USE_CASE_CATALOG.filter((p) => p.trendRank != null).sort(
    (a, b) => (a.trendRank ?? 99) - (b.trendRank ?? 99),
  )
}
