/**
 * NEXOSxLPIN 1.3.0 expansion generator
 * - 90 new SME lenses (exact domain doubles) + rule registry stubs
 * - 20 new congressional desks (cong-21…40)
 * Writes TypeScript packs; does not touch the original 90 / 20.
 */
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/** @type {Record<string, Array<{id:string,short:string,name:string,tagline:string,description:string,credential:string,voice:string,tags:string[],questions:string[],sources:string[],gates:string[],highStakes?:boolean,ruleKind:string,ruleTags:string[]}>>} */
const GOV = {
  'core-governance': [
    {
      id: 'sme-claim-chain-of-custody',
      short: 'Chain Custody',
      name: 'Evidence Chain-of-Custody SME',
      tagline: 'Provenance continuity from collection to export package',
      description:
        'Adjudicates whether exhibits retain unbroken custody notes, hashes, and transfer logs. Refuses +1 on “we found it online” without acquisition metadata.',
      credential: 'Evidence integrity · civic intelligence stack',
      voice: 'Forensic clerk; timestamps and handlers only.',
      tags: ['custody', 'hash', 'provenance', 'exhibit', 'transfer', 'integrity', 'log', 'chain'],
      questions: [
        'Who collected the exhibit and when?',
        'Is there a hash or version id across transfers?',
        'Where does the chain break?',
      ],
      sources: ['Custody log', 'Hash manifest', 'Acquisition note'],
      gates: ['+1 exhibits require custody continuity or documented gap'],
      highStakes: true,
      ruleKind: 'gov-primary',
      ruleTags: ['custody', 'hash', 'provenance', 'exhibit', 'chain'],
    },
    {
      id: 'sme-conflict-calendar',
      short: 'Conflict Cal',
      name: 'Timeline Conflict Calendar SME',
      tagline: 'Detects impossible sequences and date collisions',
      description:
        'Cross-checks claimed event order against clocks, dockets, and travel constraints. Demotes narrative timelines that violate documented chronology.',
      credential: 'Chronology auditor · Layer-0 adjacent',
      voice: 'Calendar-first; refuses soft “around then” for material order claims.',
      tags: ['timeline', 'chronology', 'date', 'sequence', 'docket', 'clock', 'order', 'conflict'],
      questions: [
        'What absolute timestamps anchor each beat?',
        'Which events are mutually exclusive in time?',
        'Is “same day” proven or inferred?',
      ],
      sources: ['Docket entries', 'Timestamped primary media', 'Official logs'],
      gates: ['Material sequence +1 needs absolute timestamps'],
      highStakes: false,
      ruleKind: 'gov-primary',
      ruleTags: ['timeline', 'chronology', 'date', 'sequence', 'docket'],
    },
    {
      id: 'sme-attribution-hygiene',
      short: 'Attribution',
      name: 'Source Attribution Hygiene SME',
      tagline: 'Who said what, on which channel, with what standing',
      description:
        'Separates speaker, channel, and paraphrase drift. Blocks laundering anonymous social into named official voice.',
      credential: 'Attribution desk · narrative integrity',
      voice: 'Quote-level pedant; names speaker and medium.',
      tags: ['attribution', 'quote', 'speaker', 'paraphrase', 'channel', 'standing', 'source', 'byline'],
      questions: [
        'Is the speaker named with standing?',
        'Is this a direct quote or paraphrase?',
        'Did the channel change mid-retell?',
      ],
      sources: ['Primary quote with URL', 'Transcript', 'Official release'],
      gates: ['Attributed quotes for +1 speech claims'],
      highStakes: true,
      ruleKind: 'gov-social',
      ruleTags: ['attribution', 'quote', 'speaker', 'paraphrase', 'social'],
    },
    {
      id: 'sme-redaction-gap',
      short: 'Redaction',
      name: 'Redaction & Withholding Gap SME',
      tagline: 'Reads what is missing as carefully as what is present',
      description:
        'Flags over-claiming from redacted productions and exemption strings. Treats silence as 0 unless statute explains the withhold.',
      credential: 'FOIA forensics · withhold analysis',
      voice: 'Gap-focused; never invents redacted content.',
      tags: ['redaction', 'withhold', 'exemption', 'gap', 'foia', 'production', 'blackout', 'b5'],
      questions: [
        'Which exemption is cited?',
        'What volume is withheld vs released?',
        'Does the claim assert content inside the blackout?',
      ],
      sources: ['Production letter', 'Exemption log', 'Vaughn index if public'],
      gates: ['Do not +1 content asserted only inside redactions'],
      highStakes: true,
      ruleKind: 'gov-primary',
      ruleTags: ['redaction', 'withhold', 'exemption', 'foia', 'production'],
    },
    {
      id: 'sme-multi-source-corroboration',
      short: 'Corroborate',
      name: 'Multi-Source Corroboration SME',
      tagline: 'Independent channels vs circular citation chains',
      description:
        'Scores whether confirmations are independent or the same wire recycled. Demotes +1 built on single-source echo chambers.',
      credential: 'Corroboration graph · evidence gate',
      voice: 'Graph skeptic; independence first.',
      tags: ['corroborat', 'independent', 'echo', 'wire', 'circular', 'confirm', 'multi-source', 'channel'],
      questions: [
        'Are sources independent or rewrites of one original?',
        'What is the earliest primary?',
        'How many independent channels agree?',
      ],
      sources: ['Earliest primary', 'Second independent channel', 'Contradiction log'],
      gates: ['+1 material claims need independent corroboration or primary'],
      highStakes: false,
      ruleKind: 'gov-social',
      ruleTags: ['corroborat', 'independent', 'echo', 'circular', 'wire'],
    },
    {
      id: 'sme-harm-escalation-gate',
      short: 'Harm Gate',
      name: 'Harm Escalation Gate SME',
      tagline: 'Pre-publish harm and defamation risk triage',
      description:
        'Elevates Layer-0 when claims can cause personal harm, doxxing, or market panic without primary support. Not a content ban—an export arming gate.',
      credential: 'High-stakes publish triage',
      voice: 'Safety officer; names harm class and required ACK.',
      tags: ['harm', 'defamation', 'doxx', 'panic', 'export', 'publish', 'risk', 'layer-0'],
      questions: [
        'What harm class attaches if wrong?',
        'Is Layer-0 ACK required?',
        'Can the claim be de-identified without losing meaning?',
      ],
      sources: ['Layer-0 log', 'Evidence ledger −1 list', 'PII scan'],
      gates: ['Harmful publish requires Layer-0 ACK + −1 clearance'],
      highStakes: true,
      ruleKind: 'gov-export',
      ruleTags: ['harm', 'defamation', 'export', 'publish', 'layer-0'],
    },
    {
      id: 'sme-decision-lock-auditor',
      short: 'Decision Lock',
      name: 'Decision Lock Auditor',
      tagline: 'Working-document locked decisions vs silent drift',
      description:
        'Checks whether operator decisions are locked in the working document with owners and timestamps. Flags analysis that rewrites prior locks without a new entry.',
      credential: 'Working document steward',
      voice: 'Archivist; insists on decision ids.',
      tags: ['decision', 'lock', 'working document', 'owner', 'timestamp', 'drift', 'wd', 'log'],
      questions: [
        'Is the decision locked with an owner?',
        'What entry id supersedes the prior lock?',
        'Is drift silent or documented?',
      ],
      sources: ['Working document', 'Decision log', 'Verification entries'],
      gates: ['Export packages cite WD decision locks for material calls'],
      highStakes: false,
      ruleKind: 'gov-wd',
      ruleTags: ['decision', 'lock', 'working', 'owner', 'wd'],
    },
  ],
  'public-records': [
    {
      id: 'sme-docket-navigator',
      short: 'Docket Nav',
      name: 'Administrative Docket Navigator',
      tagline: 'Docket ids, filings, and comment clocks',
      description:
        'Maps administrative docket numbers, filing types, and comment deadlines. Refuses “the agency decided” without docket citation.',
      credential: 'Admin docket desk',
      voice: 'Docket clerk energy; numbers first.',
      tags: ['docket', 'filing', 'comment', 'deadline', 'administrative', 'notice', 'rulemaking', 'regulations.gov'],
      questions: [
        'What is the docket id?',
        'What filing type and date?',
        'Is the comment period open or closed?',
      ],
      sources: ['Regulations.gov / state portal', 'Notice of proposed rulemaking', 'Final rule'],
      gates: ['Agency decision +1 cites docket id'],
      highStakes: false,
      ruleKind: 'gov-primary',
      ruleTags: ['docket', 'filing', 'comment', 'rulemaking', 'notice'],
    },
    {
      id: 'sme-budget-line-forensics',
      short: 'Budget Line',
      name: 'Budget Line-Item Forensics SME',
      tagline: 'Appropriation vs obligation vs outlay language',
      description:
        'Disambiguates budgeted, appropriated, obligated, and expended figures. Demotes money claims that conflate fiscal stages.',
      credential: 'Public finance forensics',
      voice: 'Budget analyst; stage labels mandatory.',
      tags: ['budget', 'appropriation', 'obligation', 'outlay', 'fiscal', 'line-item', 'spend', 'fy'],
      questions: [
        'Is the figure budgeted, appropriated, obligated, or expended?',
        'Which fiscal year?',
        'What line-item code applies?',
      ],
      sources: ['Budget book', 'Treasury/agency spend portal', 'Appropriation act text'],
      gates: ['Money +1 names fiscal stage + year'],
      highStakes: false,
      ruleKind: 'gov-primary',
      ruleTags: ['budget', 'appropriation', 'obligation', 'outlay', 'fiscal'],
    },
    {
      id: 'sme-hearing-transcript',
      short: 'Hearing TX',
      name: 'Hearing Transcript Analyst',
      tagline: 'Spoken testimony vs written statement vs press spin',
      description:
        'Compares hearing video/transcript, submitted testimony, and later press summaries for drift and invented quotes.',
      credential: 'Hearing record desk',
      voice: 'Transcript pedant; page and timestamp.',
      tags: ['hearing', 'transcript', 'testimony', 'witness', 'committee', 'q&a', 'markup', 'video'],
      questions: [
        'Is the quote from transcript, written testimony, or press?',
        'What timestamp or page?',
        'Did the witness correct the record later?',
      ],
      sources: ['Hearing transcript', 'Submitted testimony PDF', 'Committee video'],
      gates: ['Hearing quotes cite transcript location'],
      highStakes: false,
      ruleKind: 'gov-primary',
      ruleTags: ['hearing', 'transcript', 'testimony', 'witness', 'committee'],
    },
    {
      id: 'sme-license-registry',
      short: 'License Reg',
      name: 'License & Credential Registry SME',
      tagline: 'Active licenses, suspensions, and scope of practice',
      description:
        'Reads professional and facility license registries for status and scope. Demotes “licensed” claims without registry hits.',
      credential: 'Licensure registry desk',
      voice: 'Registry searcher; status date required.',
      tags: ['license', 'credential', 'registry', 'suspension', 'revocation', 'scope', 'permittee', 'board'],
      questions: [
        'Is the license active on the registry date checked?',
        'What is the scope of practice?',
        'Any discipline actions?',
      ],
      sources: ['State/federal license registry', 'Board order', 'Facility permit'],
      gates: ['Licensure +1 cites registry check date'],
      highStakes: true,
      ruleKind: 'gov-primary',
      ruleTags: ['license', 'credential', 'registry', 'suspension', 'scope'],
    },
    {
      id: 'sme-property-title-chain',
      short: 'Title Chain',
      name: 'Property Title Chain SME',
      tagline: 'Deed, lien, and ownership sequence forensics',
      description:
        'Follows deed and lien chains for ownership claims. Refuses viral “who owns it” threads without recorder citations.',
      credential: 'Recorder / title desk',
      voice: 'Title examiner lite; instrument numbers.',
      tags: ['title', 'deed', 'lien', 'parcel', 'ownership', 'recorder', 'mortgage', 'encumbrance'],
      questions: [
        'What is the parcel/instrument number?',
        'Who is grantee of record on the as-of date?',
        'Are there open liens affecting control claims?',
      ],
      sources: ['County recorder', 'Assessor parcel page', 'Title plant if public'],
      gates: ['Ownership +1 cites instrument + as-of date'],
      highStakes: false,
      ruleKind: 'gov-primary',
      ruleTags: ['title', 'deed', 'lien', 'parcel', 'ownership'],
    },
    {
      id: 'sme-inspection-history',
      short: 'Inspect Hist',
      name: 'Inspection History Reconstruct SME',
      tagline: 'Inspection cycles, failures, and reopenings',
      description:
        'Rebuilds inspection timelines: scheduled, failed, reinspected, closed. Demotes single viral photos as “always illegal.”',
      credential: 'Inspection history desk',
      voice: 'Inspector-historian; cycle complete or not.',
      tags: ['inspection', 'reinspect', 'violation', 'closed', 'open', 'cycle', 'code', 'citation'],
      questions: [
        'What inspection class and date?',
        'Was the violation closed or still open?',
        'Is the photo contemporaneous with the order?',
      ],
      sources: ['Inspection portal', 'Citation PDF', 'Close-out notice'],
      gates: ['Violation status +1 needs portal or order cite'],
      highStakes: true,
      ruleKind: 'gov-primary',
      ruleTags: ['inspection', 'violation', 'citation', 'code', 'reinspect'],
    },
    {
      id: 'sme-procurement-tabulation',
      short: 'Bid Tabs',
      name: 'Bid Tabulation Analyst',
      tagline: 'Bid tabs, responsiveness, and award rationale',
      description:
        'Reads public bid tabulations for responsiveness, scoring, and sole-source justifications. Flags award claims without tabs.',
      credential: 'Procurement tab desk',
      voice: 'Tabulation reader; responsive vs non-responsive.',
      tags: ['bid', 'tabulation', 'award', 'responsive', 'rfp', 'score', 'sole-source', 'procurement'],
      questions: [
        'Is the bid tab public?',
        'Was the low bidder responsive?',
        'What justification supports non-low award?',
      ],
      sources: ['Bid tab PDF', 'Award notice', 'RFP scoring sheet if public'],
      gates: ['Award +1 cites tab or award notice'],
      highStakes: false,
      ruleKind: 'gov-primary',
      ruleTags: ['bid', 'tabulation', 'award', 'rfp', 'procurement'],
    },
  ],
  jurisdiction: [
    {
      id: 'sme-preemption-map',
      short: 'Preemption',
      name: 'Preemption Map Specialist',
      tagline: 'Express vs field preemption and savings clauses',
      description:
        'Maps whether federal/state/local rules conflict and which savings clauses preserve local power. Demotes “federal banned it” without clause cites.',
      credential: 'Preemption cartographer',
      voice: 'Conflict-of-laws; clause numbers.',
      tags: ['preemption', 'savings', 'field', 'express', 'conflict', 'supremacy', 'home rule', 'occupy'],
      questions: [
        'Is preemption express, implied, or field?',
        'Is there a savings clause?',
        'Can both rules be complied with?',
      ],
      sources: ['Statute preemption clause', 'AG opinion', 'Controlling case summary (public)'],
      gates: ['Controlling-law claims cite preemption text'],
      highStakes: true,
      ruleKind: 'gov-jurisdiction',
      ruleTags: ['preemption', 'savings', 'supremacy', 'conflict', 'field'],
    },
    {
      id: 'sme-special-district',
      short: 'Spec District',
      name: 'Special District Authority SME',
      tagline: 'Water, school, transit, and improvement districts',
      description:
        'Identifies special-purpose districts that hold taxing/regulatory power outside city/county org charts.',
      credential: 'Special district ops',
      voice: 'District charter reader.',
      tags: ['special district', 'authority', 'board', 'levy', 'transit', 'water district', 'improvement', 'charter'],
      questions: [
        'What enabling statute creates the district?',
        'Who sits on the board and how selected?',
        'What levy or fee power exists?',
      ],
      sources: ['District charter', 'Enabling statute', 'Board minutes'],
      gates: ['District power claims cite enabling law'],
      highStakes: false,
      ruleKind: 'gov-jurisdiction',
      ruleTags: ['special district', 'authority', 'levy', 'charter', 'board'],
    },
    {
      id: 'sme-interlocal-agreement',
      short: 'Interlocal',
      name: 'Interlocal Agreement Analyst',
      tagline: 'MOUs, mutual aid, and shared services contracts',
      description:
        'Reads interlocal and mutual-aid instruments for who actually holds duty and liability when agencies share work.',
      credential: 'Interlocal instruments desk',
      voice: 'Agreement parser; duty allocation first.',
      tags: ['interlocal', 'mou', 'mutual aid', 'shared services', 'agreement', 'duty', 'liability', 'jurisdiction'],
      questions: [
        'Is the instrument executed and in force?',
        'Who is lead agency for the function?',
        'How is liability allocated?',
      ],
      sources: ['Executed interlocal PDF', 'Mutual aid plan', 'Council approval minutes'],
      gates: ['Shared-duty claims cite the instrument'],
      highStakes: false,
      ruleKind: 'gov-jurisdiction',
      ruleTags: ['interlocal', 'mou', 'mutual aid', 'agreement', 'duty'],
    },
    {
      id: 'sme-venue-standing',
      short: 'Venue',
      name: 'Venue & Standing Advisor',
      tagline: 'Where a claim can be heard and who may bring it',
      description:
        'Flags training-desk claims that assert “lawsuit will succeed” without venue/standing analysis. Not legal advice—process literacy.',
      credential: 'Procedure literacy desk',
      voice: 'Cautious; process not outcome prophecy.',
      tags: ['venue', 'standing', 'jurisdiction', 'court', 'complaint', 'plaintiff', 'forum', 'ripeness'],
      questions: [
        'Which forum has venue?',
        'What injury supports standing (as alleged)?',
        'Is the claim ripe?',
      ],
      sources: ['Docket search', 'Complaint if public', 'Court rules summary'],
      gates: ['Outcome prophecy held at 0 without primary filings'],
      highStakes: true,
      ruleKind: 'gov-jurisdiction',
      ruleTags: ['venue', 'standing', 'court', 'forum', 'complaint'],
    },
    {
      id: 'sme-tribal-federal',
      short: 'Tribal Fed',
      name: 'Tribal–Federal Interface SME',
      tagline: 'Treaties, trust, and concurrent authority literacy',
      description:
        'Handles claims involving tribal sovereignty and federal interfaces with care: cite treaties/statutes; refuse stereotype narratives.',
      credential: 'Tribal–federal interface literacy',
      voice: 'Respectful precision; primary instruments only.',
      tags: ['tribal', 'treaty', 'trust', 'sovereign', 'bia', 'reservation', 'compact', 'federal'],
      questions: [
        'What treaty or statute is cited?',
        'Is the claim about federal, tribal, or concurrent power?',
        'Is the source a primary instrument?',
      ],
      sources: ['Treaty text / statutes at large', 'BIA/tribal government primary pages', 'Compact text if public'],
      gates: ['Sovereignty claims need primary instrument cites'],
      highStakes: true,
      ruleKind: 'gov-jurisdiction',
      ruleTags: ['tribal', 'treaty', 'trust', 'sovereign', 'compact'],
    },
    {
      id: 'sme-extraterritorial',
      short: 'Extraterr.',
      name: 'Extraterritorial Reach Analyst',
      tagline: 'When domestic rules claim overseas effect',
      description:
        'Separates domestic jurisdiction from claimed extraterritorial reach. Demotes “US law bans X globally” without textual basis.',
      credential: 'Extraterritoriality desk',
      voice: 'Textual; reach must be written.',
      tags: ['extraterritorial', 'overseas', 'foreign', 'jurisdiction', 'reach', 'sanctions', 'export control', 'territorial'],
      questions: [
        'Does the statute claim extraterritorial application?',
        'Is enforcement practical or only theoretical?',
        'Which sovereign has primary enforcement?',
      ],
      sources: ['Statute text', 'Agency guidance on reach', 'Treaty if any'],
      gates: ['Global-ban claims need textual reach support'],
      highStakes: true,
      ruleKind: 'gov-jurisdiction',
      ruleTags: ['extraterritorial', 'foreign', 'reach', 'export control', 'sanctions'],
    },
    {
      id: 'sme-delegation-doctrine',
      short: 'Delegation',
      name: 'Delegation Doctrine Literacy SME',
      tagline: 'Agency power bounds and major-questions framing (training)',
      description:
        'Helps operators spot when claims about agency power ignore enabling statutes or major-questions style limits—without outcome prophecy.',
      credential: 'Admin power literacy',
      voice: 'Enabling-act first; no court-score predictions.',
      tags: ['delegation', 'enabling', 'agency power', 'major questions', 'ultra vires', 'rulemaking', 'authority', 'apa'],
      questions: [
        'What enabling act is claimed?',
        'Is the action within textual grant?',
        'Is “major questions” rhetoric or briefed doctrine?',
      ],
      sources: ['Enabling statute', 'Final rule preamble', 'Public litigation filings if any'],
      gates: ['Agency-power +1 cites enabling text'],
      highStakes: true,
      ruleKind: 'gov-jurisdiction',
      ruleTags: ['delegation', 'enabling', 'agency power', 'ultra vires', 'apa'],
    },
  ],
  oversight: [
    {
      id: 'sme-inspector-general',
      short: 'IG Desk',
      name: 'Inspector General Report Analyst',
      tagline: 'IG findings, recommendations, and open issues',
      description:
        'Reads IG reports for findings vs recommendations vs management responses. Demotes “IG proved criminality” when report is administrative.',
      credential: 'IG report desk',
      voice: 'Finding/recommendation separator.',
      tags: ['ig', 'inspector general', 'audit', 'finding', 'recommendation', 'management response', 'semiannual', 'hotline'],
      questions: [
        'Is it a finding or a recommendation?',
        'What is management’s response status?',
        'Does the report allege crime or program weakness?',
      ],
      sources: ['IG report PDF', 'Semiannual report', 'Open recommendations tracker'],
      gates: ['IG claims distinguish findings vs recommendations'],
      highStakes: false,
      ruleKind: 'gov-primary',
      ruleTags: ['ig', 'inspector general', 'finding', 'recommendation', 'audit'],
    },
    {
      id: 'sme-lobby-disclosure',
      short: 'Lobby LD',
      name: 'Lobbying Disclosure Analyst',
      tagline: 'LDA filings, issues, and registrant identity',
      description:
        'Uses public lobbying disclosures to edge-map influence claims. Refuses “secret lobby” +1 without filing or equivalent primary.',
      credential: 'Lobby disclosure desk',
      voice: 'Filing-number first.',
      tags: ['lobby', 'lda', 'registrant', 'client', 'issue', 'disclosure', 'influence', 'filing'],
      questions: [
        'Is there an LDA filing?',
        'Who is registrant vs client?',
        'What issues are listed?',
      ],
      sources: ['Senate/House lobby disclosure', 'State lobby portals', 'Filing PDF'],
      gates: ['Lobby +1 cites filing id or portal hit'],
      highStakes: true,
      ruleKind: 'gov-primary',
      ruleTags: ['lobby', 'lda', 'registrant', 'disclosure', 'influence'],
    },
    {
      id: 'sme-campaign-finance-edge',
      short: 'Camp Fin',
      name: 'Campaign Finance Edge Mapper',
      tagline: 'Contribution edges with cycle and committee precision',
      description:
        'Maps public contribution edges without inventing quid-pro-quo. Demotes motive claims lacking contemporaneous edge + decision link.',
      credential: 'Campaign finance edges',
      voice: 'Edge type + cycle; no mind-reading.',
      tags: ['campaign', 'contribution', 'fec', 'committee', 'pac', 'cycle', 'donor', 'edge'],
      questions: [
        'What is the committee and cycle?',
        'Is the edge contribution, independent expenditure, or other?',
        'Is the decision contemporaneous?',
      ],
      sources: ['FEC / state campaign finance portal', 'Committee filings', 'Vote/decision record'],
      gates: ['No “bought vote” +1 without edge + decision primary'],
      highStakes: true,
      ruleKind: 'gov-primary',
      ruleTags: ['campaign', 'contribution', 'fec', 'pac', 'donor'],
    },
    {
      id: 'sme-revolving-door',
      short: 'Rev Door',
      name: 'Revolving-Door Cooling-Off SME',
      tagline: 'Post-employment restrictions and disclosure',
      description:
        'Checks cooling-off and representation restrictions against ethics rules. Training desk—not a determination of guilt.',
      credential: 'Ethics cooling-off desk',
      voice: 'Rule-section first; dates matter.',
      tags: ['revolving door', 'cooling-off', 'ethics', 'post-employment', 'representation', 'lobby', 'disclosure', 'former'],
      questions: [
        'What cooling-off period applies?',
        'Is the person registered or disclosed?',
        'What matter is at issue?',
      ],
      sources: ['Ethics code', 'Disclosure forms', 'Lobby registration'],
      gates: ['Cooling-off claims cite rule section + timeline'],
      highStakes: true,
      ruleKind: 'gov-primary',
      ruleTags: ['revolving door', 'cooling-off', 'ethics', 'post-employment'],
    },
    {
      id: 'sme-performance-audit',
      short: 'Perf Audit',
      name: 'Performance Audit SME',
      tagline: 'Economy, efficiency, effectiveness findings',
      description:
        'Interprets performance audits (not only financial). Separates criteria, condition, cause, effect, recommendation.',
      credential: 'Performance audit literacy',
      voice: 'Yellow-book structure.',
      tags: ['performance audit', 'efficiency', 'effectiveness', 'criteria', 'condition', 'cause', 'effect', 'gao'],
      questions: [
        'What criteria did the auditor apply?',
        'What is condition vs cause?',
        'Are recommendations open or closed?',
      ],
      sources: ['Performance audit PDF', 'Standards citation', 'Follow-up report'],
      gates: ['Audit claims map to criteria/condition/cause/effect'],
      highStakes: false,
      ruleKind: 'gov-primary',
      ruleTags: ['performance audit', 'efficiency', 'criteria', 'condition', 'gao'],
    },
    {
      id: 'sme-open-meetings',
      short: 'Open Meet',
      name: 'Open Meetings / Sunshine SME',
      tagline: 'Notice, quorum, and executive-session limits',
      description:
        'Checks whether meetings met sunshine/notice requirements. Demotes “secret illegal meeting” without statute + fact pattern.',
      credential: 'Sunshine law desk',
      voice: 'Notice clock + agenda.',
      tags: ['open meetings', 'sunshine', 'notice', 'quorum', 'executive session', 'agenda', 'minutes', 'serial meeting'],
      questions: [
        'Was notice timely under the statute?',
        'Was quorum present?',
        'Was executive session authorized?',
      ],
      sources: ['Sunshine statute', 'Posted notice', 'Minutes'],
      gates: ['Meeting-illegality claims need statute + fact anchors'],
      highStakes: true,
      ruleKind: 'gov-primary',
      ruleTags: ['open meetings', 'sunshine', 'notice', 'quorum', 'executive session'],
    },
    {
      id: 'sme-settlement-transparency',
      short: 'Settlement',
      name: 'Public Settlement Transparency SME',
      tagline: 'Settlement amounts, NDAs, and public interest carve-outs',
      description:
        'Tracks public settlement disclosures and confidentiality limits for public bodies. Refuses invented settlement figures.',
      credential: 'Settlement disclosure desk',
      voice: 'Dollar + docket; no rumor amounts.',
      tags: ['settlement', 'nda', 'confidential', 'judgment', 'release', 'public body', 'claim', 'payout'],
      questions: [
        'Is the settlement public record?',
        'What docket or ordinance approved it?',
        'Are figures confirmed in primary?',
      ],
      sources: ['Settlement agreement if public', 'Council approval', 'Court docket'],
      gates: ['Settlement $ +1 needs primary document'],
      highStakes: false,
      ruleKind: 'gov-primary',
      ruleTags: ['settlement', 'nda', 'judgment', 'payout', 'docket'],
    },
  ],
  'sector-regulatory': [
    {
      id: 'sme-telecom-spectrum',
      short: 'Spectrum',
      name: 'Telecom Spectrum Regulatory SME',
      tagline: 'Licenses, auctions, and interference claims',
      description:
        'Adjudicates spectrum license and interference narratives with FCC primary. Demotes “banned all 5G” social absolutes.',
      credential: 'Spectrum regulatory desk',
      voice: 'License class and band first.',
      tags: ['spectrum', 'fcc', 'license', 'auction', 'interference', 'wireless', 'band', 'allocation'],
      questions: [
        'What band and license class?',
        'Is there an FCC order or ULS entry?',
        'Is interference measured or alleged?',
      ],
      sources: ['FCC ULS / orders', 'Auction public notice', 'OET lab notes if public'],
      gates: ['Spectrum +1 cites FCC instrument'],
      highStakes: false,
      ruleKind: 'sector',
      ruleTags: ['spectrum', 'fcc', 'license', 'auction', 'wireless'],
    },
    {
      id: 'sme-food-safety-reg',
      short: 'Food Safety',
      name: 'Food Safety Regulatory SME',
      tagline: 'FSMA, recalls, and facility registration',
      description:
        'Reads food safety recalls and FSMA-framed duties carefully. Demotes panic claims without recall class or agency notice.',
      credential: 'Food safety regulatory desk',
      voice: 'Recall class + product code.',
      tags: ['food', 'fda', 'fsma', 'recall', 'facility', 'haccp', 'usda', 'inspection'],
      questions: [
        'Is there an official recall notice?',
        'What classification?',
        'Which facilities are named?',
      ],
      sources: ['FDA/USDA recall pages', 'Warning letters', 'Inspection classification'],
      gates: ['Recall +1 cites official notice'],
      highStakes: true,
      ruleKind: 'sector',
      ruleTags: ['food', 'fda', 'recall', 'fsma', 'usda'],
    },
    {
      id: 'sme-aviation-ops-reg',
      short: 'Aviation Ops',
      name: 'Aviation Operations Regulatory SME',
      tagline: 'Ops specs, ADs, and airworthiness directives',
      description:
        'Separates airworthiness directives, ops specs, and rumor groundings. High-stakes: no cause claims before investigating authority.',
      credential: 'Aviation ops regulatory',
      voice: 'AD number first; no cockpit speculation.',
      tags: ['aviation', 'faa', 'airworthiness', 'ad', 'ops specs', 'ntsb', 'grounding', 'certificate'],
      questions: [
        'Is there an AD or emergency order?',
        'Who has investigative primacy?',
        'Is the claim preliminary or final?',
      ],
      sources: ['FAA AD library', 'NTSB prelim', 'Carrier ops public notices'],
      gates: ['Cause claims held until authority speaks'],
      highStakes: true,
      ruleKind: 'sector',
      ruleTags: ['aviation', 'faa', 'airworthiness', 'ad', 'ntsb'],
    },
    {
      id: 'sme-banking-prudential',
      short: 'Bank Super',
      name: 'Banking Prudential Oversight SME',
      tagline: 'Capital, liquidity, and supervisory actions (public)',
      description:
        'Uses public supervisory materials carefully; respects confidential exam limits. Demotes “bank is insolvent” without primary.',
      credential: 'Prudential oversight literacy',
      voice: 'Public-info only; exam confidentiality aware.',
      tags: ['banking', 'capital', 'liquidity', 'fdic', 'occ', 'fed', 'supervisory', 'camels'],
      questions: [
        'Is the source public or confidential exam rumor?',
        'What agency has primacy?',
        'What metric is actually published?',
      ],
      sources: ['Call reports / public filings', 'Agency enforcement orders', 'FDIC failed bank list if applicable'],
      gates: ['Solvency claims need public primary'],
      highStakes: true,
      ruleKind: 'sector',
      ruleTags: ['banking', 'capital', 'liquidity', 'fdic', 'supervisory'],
    },
    {
      id: 'sme-labor-wage-hour',
      short: 'Wage Hour',
      name: 'Wage & Hour Regulatory SME',
      tagline: 'FLSA-framed overtime, classification, and recovery',
      description:
        'Scores wage-hour claims with statute/reg literacy; refuses meme minimums without jurisdiction.',
      credential: 'Wage-hour regulatory desk',
      voice: 'Coverage and exemption first.',
      tags: ['wage', 'overtime', 'flsa', 'classification', 'dol', 'tip', 'exempt', 'payroll'],
      questions: [
        'Which statute and jurisdiction?',
        'Is the role exempt under the claimed test?',
        'Is there an agency opinion letter or order?',
      ],
      sources: ['DOL pages', 'State labor dept', 'Public judgments'],
      gates: ['Wage claims cite jurisdiction + rule'],
      highStakes: false,
      ruleKind: 'sector',
      ruleTags: ['wage', 'overtime', 'flsa', 'dol', 'classification'],
    },
    {
      id: 'sme-cyber-incident-reg',
      short: 'Cyber Inc',
      name: 'Cyber Incident Reporting SME',
      tagline: 'CIRCIA-shaped duties and sector notifications',
      description:
        'Tracks incident reporting duty claims for critical infrastructure firms. Demotes “must report in 1 hour to everyone” without text.',
      credential: 'Cyber incident regulatory',
      voice: 'Clock and sector first.',
      tags: ['cyber', 'incident', 'circia', 'cisa', 'notification', 'breach', 'critical infrastructure', 'report'],
      questions: [
        'Which sector and statute/rule?',
        'What is the reporting clock?',
        'To whom is notice owed?',
      ],
      sources: ['CISA guidance', 'Sector-specific rules', 'Company 8-K if public'],
      gates: ['Reporting-duty +1 cites rule text'],
      highStakes: true,
      ruleKind: 'sector',
      ruleTags: ['cyber', 'incident', 'cisa', 'notification', 'breach'],
    },
    {
      id: 'sme-export-controls-reg',
      short: 'Export Ctrl',
      name: 'Export Controls Compliance SME',
      tagline: 'EAR/ITAR-shaped private compliance burden',
      description:
        'Handles export control compliance narratives with BIS/DDTC primary. No entity-list invention.',
      credential: 'Export controls desk',
      voice: 'ECCN/USML careful; list versions dated.',
      tags: ['export', 'ear', 'itar', 'bis', 'entity list', 'license', 'dual-use', 'ddtc'],
      questions: [
        'What is the classification claimed?',
        'Is the party on a public list as of which date?',
        'Is a license exception asserted with basis?',
      ],
      sources: ['BIS pages', 'Entity List public', 'DDTC public materials'],
      gates: ['List status +1 needs dated public list cite'],
      highStakes: true,
      ruleKind: 'sector',
      ruleTags: ['export', 'ear', 'bis', 'entity list', 'itar'],
    },
    {
      id: 'sme-antitrust-remedy',
      short: 'AT Remedy',
      name: 'Antitrust Remedy Effects SME',
      tagline: 'Structural vs behavioral remedies and private impact',
      description:
        'Separates complaint theories, liability findings, and remedies. Demotes “company is banned forever” without order text.',
      credential: 'Antitrust remedy literacy',
      voice: 'Order text > punditry.',
      tags: ['antitrust', 'remedy', 'divestiture', 'consent', 'injunction', 'doj', 'ftc', 'conduct'],
      questions: [
        'Is this a complaint, settlement, or final judgment?',
        'What remedy is actually ordered?',
        'What is the duration and scope?',
      ],
      sources: ['DOJ/FTC case pages', 'Consent decree', 'Court order'],
      gates: ['Remedy +1 cites order/decree'],
      highStakes: true,
      ruleKind: 'sector',
      ruleTags: ['antitrust', 'remedy', 'consent', 'divestiture', 'injunction'],
    },
  ],
  'method-process': [
    {
      id: 'sme-uncertainty-budget',
      short: 'Uncert Budg',
      name: 'Uncertainty Budget SME',
      tagline: 'Error bars, confidence, and estimate laundering',
      description:
        'Forces explicit uncertainty on quantitative claims. Demotes point estimates presented as exact truths without error model.',
      credential: 'Measurement uncertainty desk',
      voice: 'Error bars or hold.',
      tags: ['uncertainty', 'error', 'confidence', 'interval', 'precision', 'accuracy', 'budget', 'estimate'],
      questions: [
        'What is the uncertainty model?',
        'Is the number a point estimate or interval?',
        'What would change the estimate materially?',
      ],
      sources: ['Method note', 'Calibration record', 'Replication'],
      gates: ['Quantitative +1 states uncertainty class'],
      highStakes: false,
      ruleKind: 'method',
      ruleTags: ['uncertainty', 'error', 'confidence', 'interval', 'estimate'],
    },
    {
      id: 'sme-reproducibility-gate',
      short: 'Repro Gate',
      name: 'Reproducibility Gate SME',
      tagline: 'Can a second operator redo the check?',
      description:
        'Requires steps another operator can follow. Demotes “trust me” verification theater.',
      credential: 'Reproducibility desk',
      voice: 'Checklist author.',
      tags: ['reproducib', 'replication', 'protocol', 'steps', 'operator', 'verify', 'repeat', 'method'],
      questions: [
        'Can another operator redo this from the note?',
        'What inputs are required?',
        'What is the pass/fail criterion?',
      ],
      sources: ['Protocol note', 'Input pack', 'Second-operator log'],
      gates: ['Verified language needs reproducible steps'],
      highStakes: false,
      ruleKind: 'method',
      ruleTags: ['reproducib', 'protocol', 'replication', 'verify', 'method'],
    },
    {
      id: 'sme-adversarial-review',
      short: 'Red Team',
      name: 'Adversarial Review SME',
      tagline: 'Steelman the opposite claim before publish',
      description:
        'Forces an opposite-case pass on material claims. Not both-sides theater—structured falsification attempt.',
      credential: 'Adversarial review desk',
      voice: 'Falsifier-hunter.',
      tags: ['adversarial', 'falsif', 'red team', 'counter', 'steelman', 'critique', 'review', 'opposite'],
      questions: [
        'What is the strongest contrary primary?',
        'What would falsify our +1?',
        'Did we document the attempt?',
      ],
      sources: ['Contrary primary', 'Disconfirming test', 'WD red-team note'],
      gates: ['High-stakes +1 has documented falsification attempt'],
      highStakes: true,
      ruleKind: 'method',
      ruleTags: ['adversarial', 'falsif', 'red team', 'counter', 'critique'],
    },
    {
      id: 'sme-metric-definition',
      short: 'Metric Def',
      name: 'Metric Definition SME',
      tagline: 'Operational definitions before dashboards',
      description:
        'Blocks KPI theater: every metric needs an operational definition, population, and time window.',
      credential: 'Metrics definition desk',
      voice: 'Define then measure.',
      tags: ['metric', 'kpi', 'definition', 'population', 'window', 'dashboard', 'indicator', 'operational'],
      questions: [
        'What is the operational definition?',
        'What population and window?',
        'Who owns the metric?',
      ],
      sources: ['Metric dictionary', 'Data lineage note', 'Source system'],
      gates: ['Dashboard +1 needs metric dictionary entry'],
      highStakes: false,
      ruleKind: 'method',
      ruleTags: ['metric', 'kpi', 'definition', 'population', 'dashboard'],
    },
  ],
}

const TECH = {
  'mechanical-engineering': [
    {
      id: 'sme-mech-fatigue-fracture',
      short: 'Fatigue/Frac',
      name: 'Fatigue & Fracture Mechanics SME',
      tagline: 'Crack growth, S-N, and damage-tolerant claims',
      description:
        'Adjudicates fatigue life and fracture claims with stress intensity and inspection intervals. Refuses “infinite life” without regime.',
      credential: 'Fatigue & fracture desk',
      voice: 'da/dN and spectrum first.',
      tags: ['fatigue', 'fracture', 'crack', 's-n', 'paris', 'damage tolerant', 'inspection', 'kic'],
      questions: ['Load spectrum defined?', 'Initiation vs propagation?', 'Inspection interval basis?'],
      sources: ['Fatigue test report', 'Spectrum definition', 'NDI procedure'],
      gates: ['Life +1 needs spectrum + method'],
      highStakes: true,
      ruleKind: 'eng',
      ruleTags: ['fatigue', 'fracture', 'crack', 's-n', 'inspection'],
    },
    {
      id: 'sme-mech-tribology',
      short: 'Tribology',
      name: 'Tribology & Wear SME',
      tagline: 'Friction, lubrication, and wear-rate claims',
      description:
        'Scores tribology claims with regime (boundary/mixed/EHL) and wear metrics. Demotes “frictionless forever.”',
      credential: 'Tribology desk',
      voice: 'Lubrication regime first.',
      tags: ['tribology', 'friction', 'wear', 'lubrication', 'bearing', 'ehl', 'boundary', 'viscosity'],
      questions: ['Lubrication regime?', 'Wear metric and units?', 'Contamination controlled?'],
      sources: ['Tribo test log', 'Oil analysis', 'Bearing OEM data'],
      gates: ['Wear +1 needs regime + measurement'],
      highStakes: false,
      ruleKind: 'eng',
      ruleTags: ['tribology', 'friction', 'wear', 'lubrication', 'bearing'],
    },
    {
      id: 'sme-mech-heat-transfer',
      short: 'Heat Xfer',
      name: 'Heat Transfer Specialist',
      tagline: 'Conduction, convection, radiation with Nu/Bi',
      description:
        'Requires dimensionless heat-transfer regime and boundary conditions. Demotes “cools instantly” rhetoric.',
      credential: 'Heat transfer desk',
      voice: 'Nu, Bi, Fo first.',
      tags: ['heat transfer', 'conduction', 'convection', 'radiation', 'nusselt', 'biot', 'thermal', 'flux'],
      questions: ['Dominant mode?', 'BCs specified?', 'Transient or steady?'],
      sources: ['Thermal model note', 'TC data', 'Property table'],
      gates: ['Thermal +1 needs regime + BCs'],
      highStakes: false,
      ruleKind: 'eng-dim',
      ruleTags: ['heat', 'convection', 'nusselt', 'thermal', 'conduction'],
    },
    {
      id: 'sme-mech-pressure-vessels',
      short: 'Pressure V',
      name: 'Pressure Vessel & Piping SME',
      tagline: 'ASME-framed design, MAWP, and relief',
      description:
        'Adjudicates vessel/piping claims with code class, MAWP, and relief paths. High-stakes engineering gate.',
      credential: 'Pressure equipment desk',
      voice: 'Code section + MAWP.',
      tags: ['pressure vessel', 'piping', 'mawp', 'asme', 'relief', 'psv', 'hydrotest', 'nozzle'],
      questions: ['Code class?', 'MAWP and design T?', 'Relief adequate?'],
      sources: ['U-1 / data report if public', 'Relief calc', 'Hydrotest record'],
      gates: ['Pressure integrity +1 needs code/method'],
      highStakes: true,
      ruleKind: 'eng',
      ruleTags: ['pressure', 'vessel', 'asme', 'mawp', 'relief'],
    },
    {
      id: 'sme-mech-cfd-vnv',
      short: 'CFD V&V',
      name: 'CFD Verification & Validation SME',
      tagline: 'Mesh, residuals, and experimental validation',
      description:
        'Separates pretty pictures from verified CFD. Demotes unvalidated color plots as engineering proof.',
      credential: 'CFD V&V desk',
      voice: 'Grid independence or hold.',
      tags: ['cfd', 'verification', 'validation', 'mesh', 'residual', 'turbulence', 'y+', 'benchmark'],
      questions: ['Grid independence shown?', 'What turbulence model?', 'Experimental anchor?'],
      sources: ['V&V report', 'Mesh study', 'Benchmark case'],
      gates: ['CFD +1 needs V&V evidence'],
      highStakes: false,
      ruleKind: 'eng-dim',
      ruleTags: ['cfd', 'validation', 'mesh', 'turbulence', 'reynolds'],
    },
    {
      id: 'sme-mech-seals-gaskets',
      short: 'Seals',
      name: 'Seals & Gaskets Reliability SME',
      tagline: 'Leak paths, materials compatibility, torque',
      description:
        'Scores sealing claims with media compatibility, torque procedure, and leak rate definition.',
      credential: 'Sealing systems desk',
      voice: 'Leak rate units first.',
      tags: ['seal', 'gasket', 'leak', 'o-ring', 'compatibility', 'torque', 'fugitive', 'packing'],
      questions: ['Media and temperature?', 'Torque procedure?', 'Leak criterion?'],
      sources: ['Material compatibility chart', 'Torque procedure', 'Leak test'],
      gates: ['Seal integrity +1 needs test/method'],
      highStakes: true,
      ruleKind: 'eng',
      ruleTags: ['seal', 'gasket', 'leak', 'torque', 'compatibility'],
    },
  ],
  'civil-structural': [
    {
      id: 'sme-civil-seismic',
      short: 'Seismic',
      name: 'Seismic Design & Performance SME',
      tagline: 'Seismic category, ductility, and performance objectives',
      description:
        'Adjudicates seismic claims with site class, design category, and performance objective—not vibes.',
      credential: 'Seismic structural desk',
      voice: 'SDS/SD1 and objective first.',
      tags: ['seismic', 'earthquake', 'ductility', 'site class', 'response spectrum', 'base shear', 'drift', 'asce'],
      questions: ['Site class and SDC?', 'Performance objective?', 'Nonlinear or ELF?'],
      sources: ['Seismic design criteria', 'Analysis report', 'Peer review'],
      gates: ['Seismic +1 needs criteria + method'],
      highStakes: true,
      ruleKind: 'eng',
      ruleTags: ['seismic', 'earthquake', 'ductility', 'asce', 'drift'],
    },
    {
      id: 'sme-civil-bridge',
      short: 'Bridge',
      name: 'Bridge Engineering SME',
      tagline: 'Load rating, fatigue, and scour',
      description:
        'Scores bridge condition and rating claims with inspection cycle and load-rating method.',
      credential: 'Bridge engineering desk',
      voice: 'NBI/rating first.',
      tags: ['bridge', 'load rating', 'scour', 'fatigue', 'deck', 'pier', 'nbi', 'inspection'],
      questions: ['Current load rating?', 'Scour critical?', 'Last inspection?'],
      sources: ['Inspection report', 'Load rating calc', 'NBI extract if public'],
      gates: ['Rating +1 cites method + date'],
      highStakes: true,
      ruleKind: 'eng',
      ruleTags: ['bridge', 'load rating', 'scour', 'inspection', 'fatigue'],
    },
    {
      id: 'sme-civil-hydraulics',
      short: 'Hydraulics',
      name: 'Open-Channel & Urban Hydraulics SME',
      tagline: 'Manning, culverts, and HGL claims',
      description:
        'Requires hydraulic method and storm frequency. Demotes “always floods because of X” without model.',
      credential: 'Hydraulics desk',
      voice: 'Storm frequency + method.',
      tags: ['hydraulic', 'manning', 'culvert', 'hgl', 'storm', 'flood', 'open channel', 'swmm'],
      questions: ['Design storm?', 'Method/software?', 'Boundary conditions?'],
      sources: ['Hydraulic report', 'Survey/topo', 'Rainfall criteria'],
      gates: ['Flood claim +1 needs method + storm'],
      highStakes: true,
      ruleKind: 'eng-dim',
      ruleTags: ['hydraulic', 'flood', 'storm', 'manning', 'culvert'],
    },
    {
      id: 'sme-civil-geohazard',
      short: 'Geohazard',
      name: 'Geohazard & Slope Stability SME',
      tagline: 'Landslide, liquefaction, and factor of safety',
      description:
        'Adjudicates slope and liquefaction claims with FoS, groundwater, and investigation data.',
      credential: 'Geohazard desk',
      voice: 'FoS and groundwater first.',
      tags: ['landslide', 'slope', 'liquefaction', 'fos', 'groundwater', 'shear strength', 'geohazard', 'stability'],
      questions: ['FoS method?', 'Groundwater assumption?', 'Investigation density?'],
      sources: ['Geotech report', 'Lab strengths', 'Inclinometer/monitoring'],
      gates: ['Stability +1 needs FoS + investigation'],
      highStakes: true,
      ruleKind: 'eng',
      ruleTags: ['slope', 'liquefaction', 'fos', 'geohazard', 'stability'],
    },
  ],
  'electrical-electronics': [
    {
      id: 'sme-ee-emc',
      short: 'EMC/EMI',
      name: 'EMC/EMI Compliance SME',
      tagline: 'Emissions, immunity, and test standards',
      description:
        'Scores EMC claims against test standards and setups. Demotes “device is silent RF” without lab method.',
      credential: 'EMC desk',
      voice: 'Standard + setup photo.',
      tags: ['emc', 'emi', 'emissions', 'immunity', 'cispr', 'fcc part 15', 'shielding', 'esd'],
      questions: ['Which standard?', 'Test setup?', 'Margin to limit?'],
      sources: ['EMC test report', 'Standard clause', 'Chamber notes'],
      gates: ['EMC +1 needs standard test'],
      highStakes: false,
      ruleKind: 'eng',
      ruleTags: ['emc', 'emi', 'emissions', 'immunity', 'fcc'],
    },
    {
      id: 'sme-ee-power-electronics',
      short: 'Power Elec',
      name: 'Power Electronics SME',
      tagline: 'Converters, switching loss, and thermal derating',
      description:
        'Adjudicates converter efficiency and reliability with topology, switching, and thermal path.',
      credential: 'Power electronics desk',
      voice: 'Topology + loss budget.',
      tags: ['power electronics', 'converter', 'inverter', 'switching', 'sic', 'gan', 'derating', 'efficiency'],
      questions: ['Topology?', 'Loss budget?', 'Thermal derating?'],
      sources: ['Efficiency test', 'Thermal image/model', 'Device SOA'],
      gates: ['Efficiency +1 needs measurement method'],
      highStakes: true,
      ruleKind: 'eng',
      ruleTags: ['converter', 'inverter', 'switching', 'efficiency', 'thermal'],
    },
    {
      id: 'sme-ee-protection',
      short: 'Protection',
      name: 'Power System Protection SME',
      tagline: 'Relays, coordination, and fault studies',
      description:
        'Scores protection claims with coordination studies and settings—not folklore.',
      credential: 'Protection engineering desk',
      voice: 'TCC and settings first.',
      tags: ['protection', 'relay', 'coordination', 'fault', 'breaker', 'ct', 'settings', 'arc flash'],
      questions: ['Coordination study current?', 'CT ratios?', 'Arc-flash labels?'],
      sources: ['Coordination study', 'Relay settings file summary', 'One-line'],
      gates: ['Protection +1 needs study/settings'],
      highStakes: true,
      ruleKind: 'eng',
      ruleTags: ['protection', 'relay', 'coordination', 'fault', 'arc flash'],
    },
    {
      id: 'sme-ee-embedded',
      short: 'Embedded',
      name: 'Embedded Systems Reliability SME',
      tagline: 'Watchdogs, timing, and firmware assurance',
      description:
        'Adjudicates embedded reliability claims with timing analysis, watchdogs, and update provenance.',
      credential: 'Embedded reliability desk',
      voice: 'WCET and update hash.',
      tags: ['embedded', 'firmware', 'watchdog', 'rtos', 'timing', 'interrupt', 'bootloader', 'ota'],
      questions: ['Timing analysis?', 'Update signing?', 'Fault handling?'],
      sources: ['Timing report', 'Firmware SBOM/hash', 'HIL test log'],
      gates: ['Firmware safety +1 needs method/tests'],
      highStakes: true,
      ruleKind: 'eng',
      ruleTags: ['embedded', 'firmware', 'watchdog', 'timing', 'rtos'],
    },
    {
      id: 'sme-ee-battery-systems',
      short: 'Battery Sys',
      name: 'Battery Systems SME',
      tagline: 'BMS, thermal runaway, and SOC claims',
      description:
        'Scores battery system claims with BMS functions, thermal design, and test standards. High-stakes energy storage.',
      credential: 'Battery systems desk',
      voice: 'Thermal runaway path first.',
      tags: ['battery', 'bms', 'soc', 'thermal runaway', 'cell', 'pack', 'ul', 'energy storage'],
      questions: ['Cell chemistry?', 'BMS protections?', 'Abuse test basis?'],
      sources: ['Pack test report', 'BMS requirements', 'Thermal model'],
      gates: ['Safety +1 needs test/standard'],
      highStakes: true,
      ruleKind: 'eng',
      ruleTags: ['battery', 'bms', 'thermal', 'soc', 'cell'],
    },
  ],
  'chemical-process': [
    {
      id: 'sme-chem-mass-energy',
      short: 'Mass/Energy',
      name: 'Mass & Energy Balance SME',
      tagline: 'Closure, yields, and inventory claims',
      description:
        'Requires balance closure and basis of calculation. Demotes miraculous yields without inventory method.',
      credential: 'Process balances desk',
      voice: 'Basis and closure %.',
      tags: ['mass balance', 'energy balance', 'yield', 'closure', 'inventory', 'stoichiometry', 'recycle', 'purge'],
      questions: ['Basis of calculation?', 'Closure achieved?', 'Recycle accounted?'],
      sources: ['Balance spreadsheet/report', 'Lab assays', 'Meter data'],
      gates: ['Yield +1 needs balance method'],
      highStakes: false,
      ruleKind: 'eng',
      ruleTags: ['mass balance', 'energy balance', 'yield', 'closure', 'inventory'],
    },
    {
      id: 'sme-chem-separation',
      short: 'Separation',
      name: 'Separation Processes SME',
      tagline: 'Distillation, membranes, adsorption claims',
      description:
        'Adjudicates separation performance with stage counts, selectivity, and fouling assumptions.',
      credential: 'Separations desk',
      voice: 'Selectivity + fouling.',
      tags: ['distillation', 'membrane', 'adsorption', 'separation', 'selectivity', 'stage', 'reflux', 'fouling'],
      questions: ['Selectivity basis?', 'Fouling model?', 'Scale-up method?'],
      sources: ['Pilot data', 'VLE/property package', 'Vendor performance test'],
      gates: ['Separation +1 needs data + method'],
      highStakes: false,
      ruleKind: 'eng',
      ruleTags: ['distillation', 'membrane', 'separation', 'selectivity', 'fouling'],
    },
    {
      id: 'sme-chem-corrosion',
      short: 'Corrosion',
      name: 'Corrosion & Materials Compatibility SME',
      tagline: 'Corrosion rate, environment, and inspection',
      description:
        'Scores corrosion claims with environment definition, rate units, and inspection method.',
      credential: 'Corrosion desk',
      voice: 'mpy and environment first.',
      tags: ['corrosion', 'compatibility', 'mpy', 'pitting', 'cathodic', 'coating', 'coupon', 'environment'],
      questions: ['Environment defined?', 'Rate units?', 'Inspection method?'],
      sources: ['Coupon data', 'Inspection report', 'Materials selection note'],
      gates: ['Corrosion +1 needs rate + environment'],
      highStakes: true,
      ruleKind: 'eng',
      ruleTags: ['corrosion', 'pitting', 'mpy', 'coating', 'compatibility'],
    },
  ],
  'aerospace-defense-tech': [
    {
      id: 'sme-aero-structures',
      short: 'Aero Struct',
      name: 'Aerospace Structures SME',
      tagline: 'Loads, composites allowables, and damage tolerance',
      description:
        'Adjudicates aero structure claims with load cases and allowables. Demotes “unbreakable airframe.”',
      credential: 'Aerospace structures desk',
      voice: 'Load case + allowable.',
      tags: ['airframe', 'loads', 'allowable', 'composite', 'damage tolerance', 'fatigue', 'flutter', 'margin'],
      questions: ['Critical load case?', 'Allowables basis?', 'Damage tolerance plan?'],
      sources: ['Loads report', 'Allowables program', 'DT analysis'],
      gates: ['Structure +1 needs loads/allowables method'],
      highStakes: true,
      ruleKind: 'eng',
      ruleTags: ['airframe', 'loads', 'allowable', 'damage tolerance', 'margin'],
    },
    {
      id: 'sme-aero-gnc',
      short: 'GNC',
      name: 'Guidance Navigation & Control SME',
      tagline: 'Guidance laws, nav filters, and control margins',
      description:
        'Scores GNC claims with filter assumptions, sensor suite, and stability margins.',
      credential: 'GNC desk',
      voice: 'Margins and observability.',
      tags: ['gnc', 'guidance', 'navigation', 'kalman', 'control margin', 'autopilot', 'sensor fusion', 'stability'],
      questions: ['Nav filter assumptions?', 'Control margins?', 'Failure modes?'],
      sources: ['GNC design note', 'HITL results', 'Sensor calibration'],
      gates: ['GNC +1 needs analysis/test'],
      highStakes: true,
      ruleKind: 'eng',
      ruleTags: ['gnc', 'navigation', 'kalman', 'control', 'stability'],
    },
    {
      id: 'sme-aero-space-systems',
      short: 'Space Sys',
      name: 'Space Systems Engineering SME',
      tagline: 'Orbits, link budgets, and launch environments',
      description:
        'Adjudicates space system claims with orbit regime, link budget, and environmental specs.',
      credential: 'Space systems desk',
      voice: 'Orbit and link first.',
      tags: ['orbit', 'link budget', 'spacecraft', 'launch', 'radiation', 'thermal vacuum', 'tt&c', 'delta-v'],
      questions: ['Orbit regime?', 'Link margin?', 'Launch loads?'],
      sources: ['Mission design note', 'Link budget', 'Env test plan'],
      gates: ['Mission +1 needs design/test anchors'],
      highStakes: true,
      ruleKind: 'eng-dim',
      ruleTags: ['orbit', 'link budget', 'spacecraft', 'launch', 'radiation'],
    },
  ],
  'materials-manufacturing': [
    {
      id: 'sme-mat-additive',
      short: 'Additive Mfg',
      name: 'Additive Manufacturing SME',
      tagline: 'Process parameters, anisotropy, and qualification',
      description:
        'Scores AM claims with process parameters, post-process, and qualification path—not hype.',
      credential: 'AM process desk',
      voice: 'Parameters + anisotropy.',
      tags: ['additive', '3d print', 'powder', 'laser', 'anisotropy', 'hip', 'qualification', 'porosity'],
      questions: ['Process parameters locked?', 'Anisotropy tested?', 'Qualification standard?'],
      sources: ['Build report', 'CT/porosity data', 'Mechanical allowables'],
      gates: ['AM structural +1 needs qual data'],
      highStakes: true,
      ruleKind: 'eng',
      ruleTags: ['additive', 'anisotropy', 'porosity', 'qualification', 'powder'],
    },
    {
      id: 'sme-mat-welding',
      short: 'Welding',
      name: 'Welding & Joining SME',
      tagline: 'WPS/PQR, HAZ, and NDE',
      description:
        'Adjudicates weld quality claims with WPS/PQR and NDE method. Demotes “perfect weld” photos alone.',
      credential: 'Welding engineering desk',
      voice: 'WPS number first.',
      tags: ['weld', 'wps', 'pqr', 'haz', 'nde', 'penetration', 'filler', 'procedure'],
      questions: ['WPS/PQR?', 'NDE method?', 'Acceptance criteria?'],
      sources: ['WPS/PQR', 'NDE report', 'Welder quals'],
      gates: ['Weld accept +1 needs NDE/criteria'],
      highStakes: true,
      ruleKind: 'eng',
      ruleTags: ['weld', 'wps', 'pqr', 'nde', 'haz'],
    },
    {
      id: 'sme-mat-polymers',
      short: 'Polymers',
      name: 'Polymers & Elastomers SME',
      tagline: 'Tg, aging, and chemical compatibility',
      description:
        'Scores polymer claims with thermal transitions, aging, and media compatibility.',
      credential: 'Polymer materials desk',
      voice: 'Tg/aging first.',
      tags: ['polymer', 'elastomer', 'tg', 'aging', 'creep', 'compatibility', 'viscosity', 'cure'],
      questions: ['Service T vs Tg?', 'Aging model?', 'Media exposure?'],
      sources: ['DSC/DMA data', 'Aging study', 'Compatibility chart'],
      gates: ['Polymer life +1 needs aging/method'],
      highStakes: false,
      ruleKind: 'eng',
      ruleTags: ['polymer', 'elastomer', 'tg', 'aging', 'compatibility'],
    },
    {
      id: 'sme-mfg-lean-sixsigma',
      short: 'Lean/SS',
      name: 'Lean & Six Sigma Process SME',
      tagline: 'Capability, MSA, and causal claims on yield',
      description:
        'Demotes dashboard miracles without MSA and capability studies. Requires operational definitions.',
      credential: 'Process excellence desk',
      voice: 'MSA then Cpk.',
      tags: ['six sigma', 'lean', 'cpk', 'msa', 'spc', 'yield', 'doe', 'capability'],
      questions: ['MSA done?', 'Capability window?', 'Causal DOE or anecdote?'],
      sources: ['MSA study', 'Control charts', 'DOE report'],
      gates: ['Yield miracle +1 needs capability evidence'],
      highStakes: false,
      ruleKind: 'eng',
      ruleTags: ['cpk', 'msa', 'spc', 'yield', 'six sigma'],
    },
  ],
  'energy-nuclear': [
    {
      id: 'sme-energy-storage-grid',
      short: 'Grid Storage',
      name: 'Grid Energy Storage SME',
      tagline: 'Duration, round-trip efficiency, interconnection',
      description:
        'Scores storage claims with duration, RTE, and interconnection status—not marketing MWh.',
      credential: 'Grid storage desk',
      voice: 'Duration at rated power.',
      tags: ['storage', 'battery', 'rte', 'duration', 'interconnection', 'inverter', 'capacity firming', 'grid'],
      questions: ['Duration at rated power?', 'RTE measured how?', 'Interconnection status?'],
      sources: ['Performance test', 'Interconnection queue public', 'EMS data summary'],
      gates: ['Storage +1 needs measured performance'],
      highStakes: false,
      ruleKind: 'eng',
      ruleTags: ['storage', 'battery', 'rte', 'interconnection', 'grid'],
    },
    {
      id: 'sme-energy-renewables',
      short: 'Renewables',
      name: 'Renewable Generation Resource SME',
      tagline: 'Capacity factor, resource assessment, curtailment',
      description:
        'Adjudicates renewable resource claims with assessment method and capacity factor basis.',
      credential: 'Renewables resource desk',
      voice: 'P50/P90 and CF basis.',
      tags: ['solar', 'wind', 'capacity factor', 'resource', 'curtailment', 'p50', 'irradiance', 'wind speed'],
      questions: ['Resource assessment method?', 'CF basis years?', 'Curtailment assumed?'],
      sources: ['Resource study', 'Production data', 'Meteorological mast/sat data note'],
      gates: ['CF +1 needs method + years'],
      highStakes: false,
      ruleKind: 'eng',
      ruleTags: ['capacity factor', 'solar', 'wind', 'resource', 'curtailment'],
    },
    {
      id: 'sme-nuclear-safety-case',
      short: 'Nuc Safety',
      name: 'Nuclear Safety Case SME',
      tagline: 'Design basis, beyond design basis, defense-in-depth',
      description:
        'High-stakes nuclear claims require design-basis language and primary safety docs—not vibes.',
      credential: 'Nuclear safety case desk',
      voice: 'Design basis first.',
      tags: ['nuclear', 'design basis', 'safety case', 'defense in depth', 'pra', 'coolant', 'reactivity', 'dose'],
      questions: ['Design basis event?', 'Defense-in-depth layer?', 'Primary safety doc?'],
      sources: ['FSAR/public safety summary', 'NRC ADAMS public', 'Inspection report'],
      gates: ['Nuclear safety +1 needs primary safety basis'],
      highStakes: true,
      ruleKind: 'eng',
      ruleTags: ['nuclear', 'design basis', 'safety case', 'dose', 'pra'],
    },
  ],
  'biomedical-systems': [
    {
      id: 'sme-bio-imaging',
      short: 'Med Imaging',
      name: 'Biomedical Imaging SME',
      tagline: 'Modality limits, dose, and reconstruction claims',
      description:
        'Scores imaging claims with modality physics and reconstruction assumptions. Demotes diagnostic certainty theater.',
      credential: 'Biomedical imaging desk',
      voice: 'Modality limits first.',
      tags: ['imaging', 'mri', 'ct', 'ultrasound', 'dose', 'reconstruction', 'snr', 'artifact'],
      questions: ['Modality and protocol?', 'Dose metric?', 'Reconstruction assumptions?'],
      sources: ['Protocol', 'Phantom study', 'Device labeling'],
      gates: ['Diagnostic +1 needs method limits stated'],
      highStakes: true,
      ruleKind: 'eng',
      ruleTags: ['imaging', 'mri', 'ct', 'dose', 'reconstruction'],
    },
    {
      id: 'sme-bio-regulatory-device',
      short: 'Device Reg',
      name: 'Medical Device Regulatory Pathway SME',
      tagline: '510(k)/PMA-shaped pathway literacy (training)',
      description:
        'Separates clearance/approval pathways and labeling claims. Not legal advice; primary FDA databases preferred.',
      credential: 'Device regulatory pathway desk',
      voice: 'Pathway + product code.',
      tags: ['510k', 'pma', 'device', 'fda', 'labeling', 'predicate', 'clinical', 'qsr'],
      questions: ['Pathway claimed?', 'Product code?', 'Labeling indication?'],
      sources: ['Devices@FDA', 'Labeling', 'Guidance'],
      gates: ['Approval claims cite FDA primary'],
      highStakes: true,
      ruleKind: 'sector',
      ruleTags: ['fda', 'device', '510k', 'pma', 'labeling'],
    },
    {
      id: 'sme-bio-human-factors',
      short: 'Human Fact',
      name: 'Human Factors & Usability SME',
      tagline: 'Use errors, IFU, and formative/summative testing',
      description:
        'Adjudicates usability claims with human-factors study design—not anecdote.',
      credential: 'Human factors desk',
      voice: 'Use error taxonomy.',
      tags: ['human factors', 'usability', 'ifu', 'use error', 'formative', 'summative', 'heuristic', 'workflow'],
      questions: ['Study type?', 'Critical tasks?', 'Use errors observed?'],
      sources: ['HF report', 'IFU', 'Task analysis'],
      gates: ['Usability +1 needs HF evidence'],
      highStakes: true,
      ruleKind: 'eng',
      ruleTags: ['human factors', 'usability', 'use error', 'ifu', 'workflow'],
    },
  ],
  'computing-cyberphysical': [
    {
      id: 'sme-cps-security',
      short: 'CPS Sec',
      name: 'Cyber-Physical Security SME',
      tagline: 'Threat models, zoning, and safety-security interactions',
      description:
        'Scores CPS security claims with threat model and zoning—not scanner theater alone.',
      credential: 'CPS security desk',
      voice: 'Threat model first.',
      tags: ['security', 'threat model', 'ot', 'ics', 'zoning', 'sbom', 'patch', 'safety'],
      questions: ['Threat model?', 'OT/IT boundary?', 'Safety interaction?'],
      sources: ['Threat model doc', 'Architecture diagram', 'Pentest scoped report'],
      gates: ['Secure +1 needs threat model + evidence'],
      highStakes: true,
      ruleKind: 'eng',
      ruleTags: ['security', 'threat model', 'ot', 'ics', 'sbom'],
    },
    {
      id: 'sme-cps-realtime',
      short: 'Realtime',
      name: 'Real-Time Systems SME',
      tagline: 'Deadlines, scheduling, and WCET',
      description:
        'Adjudicates real-time claims with scheduling policy and WCET evidence.',
      credential: 'Real-time systems desk',
      voice: 'Deadline miss rate.',
      tags: ['realtime', 'wcet', 'scheduling', 'deadline', 'latency', 'jitter', 'rtos', 'priority'],
      questions: ['Deadline class?', 'WCET method?', 'Observed misses?'],
      sources: ['Timing analysis', 'Trace logs', 'Scheduler config'],
      gates: ['Hard real-time +1 needs WCET/method'],
      highStakes: true,
      ruleKind: 'eng',
      ruleTags: ['realtime', 'wcet', 'deadline', 'latency', 'scheduling'],
    },
    {
      id: 'sme-cps-data-lineage',
      short: 'Data Lineage',
      name: 'Data Lineage & Provenance SME',
      tagline: 'Dataset origin, transforms, and leakage',
      description:
        'Scores data claims with lineage and transform logs. Demotes “clean dataset” without provenance.',
      credential: 'Data lineage desk',
      voice: 'Transform graph first.',
      tags: ['lineage', 'provenance', 'dataset', 'etl', 'leakage', 'schema', 'version', 'pipeline'],
      questions: ['Source systems?', 'Transforms documented?', 'Train/test leakage checked?'],
      sources: ['Lineage graph', 'Schema registry', 'Data contract'],
      gates: ['Dataset +1 needs lineage'],
      highStakes: false,
      ruleKind: 'method',
      ruleTags: ['lineage', 'provenance', 'dataset', 'etl', 'leakage'],
    },
    {
      id: 'sme-cps-formal-methods',
      short: 'Formal Meth',
      name: 'Formal Methods SME',
      tagline: 'Specs, model checking, and proof obligations',
      description:
        'Adjudicates formal verification claims with property specs and tool assumptions—not logo drops.',
      credential: 'Formal methods desk',
      voice: 'Property and assumptions.',
      tags: ['formal methods', 'model checking', 'proof', 'specification', 'invariant', 'tla', 'smt', 'verification'],
      questions: ['What property?', 'What assumptions?', 'What tool/version?'],
      sources: ['Spec', 'Proof/log', 'Assumptions note'],
      gates: ['Proved +1 needs property + artifact'],
      highStakes: false,
      ruleKind: 'theory',
      ruleTags: ['formal', 'proof', 'model checking', 'specification', 'invariant'],
    },
    {
      id: 'sme-cps-ml-systems',
      short: 'ML Systems',
      name: 'ML Systems Evaluation SME',
      tagline: 'Metrics, splits, drift, and deployment gates',
      description:
        'Demotes accuracy theater without split hygiene, drift monitoring, and failure modes.',
      credential: 'ML systems desk',
      voice: 'Split then metric.',
      tags: ['ml', 'model', 'metric', 'drift', 'split', 'calibration', 'deployment', 'evaluation'],
      questions: ['Split strategy?', 'Metric definition?', 'Drift monitors?'],
      sources: ['Eval report', 'Data card', 'Monitoring dashboard def'],
      gates: ['Production ML +1 needs eval protocol'],
      highStakes: true,
      ruleKind: 'method',
      ruleTags: ['ml', 'metric', 'drift', 'evaluation', 'calibration'],
    },
  ],
  'mathematics-statistics': [
    {
      id: 'sme-math-linear-algebra',
      short: 'Lin Alg',
      name: 'Linear Algebra Applications SME',
      tagline: 'Conditioning, rank, and numerical stability',
      description:
        'Scores linear algebra claims with conditioning and numerical method—not handwavy invertibility.',
      credential: 'Applied linear algebra desk',
      voice: 'κ(A) first.',
      tags: ['matrix', 'conditioning', 'rank', 'eigen', 'svd', 'numerical', 'stability', 'nullspace'],
      questions: ['Condition number?', 'Rank deficiency?', 'Algorithm stability?'],
      sources: ['Notebook/repro', 'Conditioning diagnostic', 'Method note'],
      gates: ['Numerical +1 needs stability discussion'],
      highStakes: false,
      ruleKind: 'theory',
      ruleTags: ['matrix', 'conditioning', 'rank', 'svd', 'numerical'],
    },
    {
      id: 'sme-math-dynamical-systems',
      short: 'Dyn Sys',
      name: 'Dynamical Systems SME',
      tagline: 'Stability, bifurcations, and attractors',
      description:
        'Adjudicates dynamical claims with Lyapunov/linearization regime—not “chaos means anything.”',
      credential: 'Dynamical systems desk',
      voice: 'Equilibrium then linearize.',
      tags: ['dynamical', 'stability', 'bifurcation', 'lyapunov', 'attractor', 'phase space', 'chaos', 'equilibrium'],
      questions: ['Equilibrium identified?', 'Stability criterion?', 'Parameter regime?'],
      sources: ['Analysis note', 'Simulation with IC', 'Bifurcation diagram'],
      gates: ['Stability +1 needs criterion'],
      highStakes: false,
      ruleKind: 'theory',
      ruleTags: ['stability', 'bifurcation', 'lyapunov', 'dynamical', 'chaos'],
    },
    {
      id: 'sme-math-bayesian',
      short: 'Bayesian',
      name: 'Bayesian Inference SME',
      tagline: 'Priors, likelihoods, and posterior predictive checks',
      description:
        'Demotes posterior claims without prior/likelihood transparency and checks.',
      credential: 'Bayesian inference desk',
      voice: 'Prior then likelihood.',
      tags: ['bayesian', 'prior', 'posterior', 'likelihood', 'mcmc', 'ppc', 'hierarchical', 'credible'],
      questions: ['Prior justified?', 'Sampler diagnostics?', 'PPC done?'],
      sources: ['Model code', 'Diagnostics', 'PPC plots'],
      gates: ['Posterior +1 needs diagnostics'],
      highStakes: false,
      ruleKind: 'theory',
      ruleTags: ['bayesian', 'prior', 'posterior', 'mcmc', 'likelihood'],
    },
    {
      id: 'sme-math-causal',
      short: 'Causal Inf',
      name: 'Causal Inference SME',
      tagline: 'Identification, DAG, and design',
      description:
        'Blocks causal language without identification strategy. Correlation is 0 until design supports cause.',
      credential: 'Causal inference desk',
      voice: 'Identification first.',
      tags: ['causal', 'identification', 'dag', 'confound', 'instrument', 'rdd', 'difference-in-differences', 'treatment'],
      questions: ['Identification strategy?', 'Confounders?', 'Design or observational?'],
      sources: ['Pre-analysis plan', 'DAG', 'Robustness checks'],
      gates: ['Causal +1 needs identification'],
      highStakes: true,
      ruleKind: 'theory',
      ruleTags: ['causal', 'identification', 'confound', 'dag', 'treatment'],
    },
    {
      id: 'sme-math-time-series',
      short: 'Time Series',
      name: 'Time Series Analysis SME',
      tagline: 'Stationarity, seasonality, and forecast skill',
      description:
        'Scores forecast claims with backtests and stationarity checks—not curve-fit cosplay.',
      credential: 'Time series desk',
      voice: 'Backtest then skill.',
      tags: ['time series', 'arima', 'stationarity', 'seasonality', 'forecast', 'acf', 'backtest', 'residual'],
      questions: ['Stationarity addressed?', 'Backtest protocol?', 'Residual diagnostics?'],
      sources: ['Backtest notebook', 'Diagnostics', 'Data window note'],
      gates: ['Forecast +1 needs backtest'],
      highStakes: false,
      ruleKind: 'theory',
      ruleTags: ['time series', 'forecast', 'stationarity', 'backtest', 'seasonality'],
    },
    {
      id: 'sme-math-graph-theory',
      short: 'Graph Thry',
      name: 'Graph Theory & Networks SME',
      tagline: 'Connectivity, centrality, and cut sets',
      description:
        'Adjudicates network claims with defined graph model—not vague “connected to.”',
      credential: 'Graph theory desk',
      voice: 'Define the graph.',
      tags: ['graph', 'network', 'centrality', 'path', 'cut', 'community', 'adjacency', 'degree'],
      questions: ['Nodes/edges defined?', 'What centrality?', 'Robustness metric?'],
      sources: ['Graph construction note', 'Algorithm params', 'Sensitivity'],
      gates: ['Network +1 needs graph definition'],
      highStakes: false,
      ruleKind: 'theory',
      ruleTags: ['graph', 'network', 'centrality', 'path', 'adjacency'],
    },
    {
      id: 'sme-math-numerical-pde',
      short: 'Num PDE',
      name: 'Numerical PDE SME',
      tagline: 'Discretization, stability, and convergence',
      description:
        'Scores PDE numerics with CFL/stability and convergence evidence.',
      credential: 'Numerical PDE desk',
      voice: 'Scheme + stability.',
      tags: ['pde', 'finite element', 'finite volume', 'cfl', 'convergence', 'stability', 'discretization', 'mesh'],
      questions: ['Scheme?', 'Stability criterion?', 'Convergence study?'],
      sources: ['Convergence plot', 'Scheme note', 'Manufactured solution'],
      gates: ['PDE sim +1 needs convergence'],
      highStakes: false,
      ruleKind: 'theory',
      ruleTags: ['pde', 'cfl', 'convergence', 'stability', 'mesh'],
    },
  ],
  'theoretical-physics': [
    {
      id: 'sme-phys-particle',
      short: 'Particle',
      name: 'Particle Physics Literacy SME',
      tagline: 'Cross sections, detectors, and discovery claims',
      description:
        'Demotes discovery theater without statistical thresholds and detector context.',
      credential: 'Particle physics literacy',
      voice: 'Sigma and systematics.',
      tags: ['particle', 'cross section', 'detector', 'luminosity', 'significance', 'background', 'higgs', 'collider'],
      questions: ['Significance method?', 'Systematics?', 'Detector acceptance?'],
      sources: ['Paper/note', 'Supplementary', 'Collaboration public'],
      gates: ['Discovery +1 needs stats threshold'],
      highStakes: false,
      ruleKind: 'theory',
      ruleTags: ['particle', 'significance', 'detector', 'cross section', 'background'],
    },
    {
      id: 'sme-phys-cosmo',
      short: 'Cosmology',
      name: 'Cosmology & Large-Scale Structure SME',
      tagline: 'Parameters, surveys, and model dependence',
      description:
        'Scores cosmology claims with survey and parameter assumptions—not pop-sci absolute.',
      credential: 'Cosmology desk',
      voice: 'ΛCDM params first.',
      tags: ['cosmology', 'cmb', 'dark matter', 'hubble', 'survey', 'power spectrum', 'redshift', 'lambda'],
      questions: ['Dataset?', 'Parameter priors?', 'Model alternatives?'],
      sources: ['Survey release', 'Likelihood note', 'Replication'],
      gates: ['Cosmology +1 needs dataset+model'],
      highStakes: false,
      ruleKind: 'theory',
      ruleTags: ['cosmology', 'cmb', 'hubble', 'survey', 'redshift'],
    },
    {
      id: 'sme-phys-atomic',
      short: 'Atomic/Mol',
      name: 'Atomic & Molecular Physics SME',
      tagline: 'Spectra, linewidths, and transition claims',
      description:
        'Adjudicates spectroscopic claims with linewidth and calibration.',
      credential: 'AMO physics desk',
      voice: 'Linewidth and calibration.',
      tags: ['atomic', 'molecular', 'spectrum', 'linewidth', 'transition', 'laser', 'calibration', 'fwhm'],
      questions: ['Calibration?', 'Linewidth?', 'Environment broadening?'],
      sources: ['Spectrum log', 'Calibration lamp', 'Method note'],
      gates: ['Spectral +1 needs calibration'],
      highStakes: false,
      ruleKind: 'theory',
      ruleTags: ['spectrum', 'linewidth', 'atomic', 'calibration', 'laser'],
    },
    {
      id: 'sme-phys-soft-matter',
      short: 'Soft Matter',
      name: 'Soft Matter Physics SME',
      tagline: 'Colloids, polymers physics, and rheology regimes',
      description:
        'Requires rheological regime and length-scale hierarchy for soft-matter claims.',
      credential: 'Soft matter desk',
      voice: 'Pe and Deborah numbers.',
      tags: ['soft matter', 'colloid', 'rheology', 'polymer physics', 'viscoelastic', 'deborah', 'peclet', 'gel'],
      questions: ['Length scales?', 'Rheology regime?', 'Interaction potential?'],
      sources: ['Rheometry', 'Microscopy', 'Model note'],
      gates: ['Soft-matter +1 needs regime'],
      highStakes: false,
      ruleKind: 'theory-dim',
      ruleTags: ['rheology', 'colloid', 'viscoelastic', 'deborah', 'soft matter'],
    },
    {
      id: 'sme-phys-nonlinear',
      short: 'Nonlinear',
      name: 'Nonlinear Dynamics & Waves SME',
      tagline: 'Solitons, turbulence cascades, nonlinear waves',
      description:
        'Scores nonlinear wave claims with regime diagrams—not aesthetic simulations alone.',
      credential: 'Nonlinear dynamics desk',
      voice: 'Dispersion then nonlinearity.',
      tags: ['nonlinear', 'soliton', 'wave', 'turbulence', 'cascade', 'dispersion', 'shock', 'instability'],
      questions: ['Dispersion relation?', 'Nonlinear term?', 'Energy cascade evidence?'],
      sources: ['Analysis', 'Experiment', 'DNS validation'],
      gates: ['Nonlinear +1 needs regime+evidence'],
      highStakes: false,
      ruleKind: 'theory-dim',
      ruleTags: ['nonlinear', 'turbulence', 'wave', 'dispersion', 'shock'],
    },
  ],
  'applied-physical-sciences': [
    {
      id: 'sme-applied-metrology',
      short: 'Metrology',
      name: 'Metrology & Calibration SME',
      tagline: 'Traceability, uncertainty, and standards',
      description:
        'Requires metrological traceability and uncertainty budgets for measurement claims.',
      credential: 'Metrology desk',
      voice: 'Traceability chain.',
      tags: ['metrology', 'calibration', 'traceability', 'uncertainty', 'standard', 'si', 'gauge', 'tolerance'],
      questions: ['Traceability chain?', 'Calibration due date?', 'Uncertainty budget?'],
      sources: ['Cal certificate', 'Uncertainty budget', 'Standard procedure'],
      gates: ['Measurement +1 needs cal/uncertainty'],
      highStakes: false,
      ruleKind: 'method',
      ruleTags: ['metrology', 'calibration', 'traceability', 'uncertainty', 'standard'],
    },
    {
      id: 'sme-applied-acoustics-env',
      short: 'Env Acoust',
      name: 'Environmental Acoustics SME',
      tagline: 'SPL, weighting, and measurement standards',
      description:
        'Scores noise claims with weighting, distance, and standard method—not phone dB apps alone.',
      credential: 'Environmental acoustics desk',
      voice: 'dBA and distance.',
      tags: ['acoustics', 'spl', 'dba', 'noise', 'weighting', 'octave', 'measurement', 'standard'],
      questions: ['Weighting?', 'Distance/geometry?', 'Standard method?'],
      sources: ['Sound level log', 'Calibration', 'Standard procedure'],
      gates: ['Noise +1 needs method+geometry'],
      highStakes: false,
      ruleKind: 'eng',
      ruleTags: ['acoustics', 'spl', 'dba', 'noise', 'measurement'],
    },
  ],
}

// Verify domain counts
const govTargets = { 'core-governance': 7, 'public-records': 7, jurisdiction: 7, oversight: 7, 'sector-regulatory': 8, 'method-process': 4 }
const techTargets = {
  'mechanical-engineering': 6,
  'civil-structural': 4,
  'electrical-electronics': 5,
  'chemical-process': 3,
  'aerospace-defense-tech': 3,
  'materials-manufacturing': 4,
  'energy-nuclear': 3,
  'biomedical-systems': 3,
  'computing-cyberphysical': 5,
  'mathematics-statistics': 7,
  'theoretical-physics': 5,
  'applied-physical-sciences': 2,
}

function assertCounts(map, targets, label) {
  for (const [d, n] of Object.entries(targets)) {
    const got = (map[d] || []).length
    if (got !== n) throw new Error(`${label} ${d}: expected ${n} new, got ${got}`)
  }
}
assertCounts(GOV, govTargets, 'GOV')
assertCounts(TECH, techTargets, 'TECH')

const allNew = []
for (const [domain, arr] of Object.entries(GOV)) for (const x of arr) allNew.push({ ...x, domain, bank: 'gov' })
for (const [domain, arr] of Object.entries(TECH)) for (const x of arr) allNew.push({ ...x, domain, bank: 'tech' })
if (allNew.length !== 90) throw new Error(`expected 90 new lenses, got ${allNew.length}`)

// uniqueness
const ids = new Set()
const shorts = new Set()
for (const x of allNew) {
  if (ids.has(x.id)) throw new Error(`dup id ${x.id}`)
  ids.add(x.id)
  const sk = `${x.domain}::${x.short.toLowerCase()}`
  if (shorts.has(sk)) throw new Error(`dup short ${sk}`)
  shorts.add(sk)
  if (x.tags.length < 6) throw new Error(`${x.id} tags < 6`)
  if (x.questions.length < 3) throw new Error(`${x.id} questions < 3`)
}

function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function emitLensTS(x, domain) {
  const hs = x.highStakes ? 'true' : 'false'
  const dom = domain || x.domain
  if (!dom) throw new Error(`missing domain for ${x.id}`)
  return `  lens({
    id: '${x.id}',
    short: '${esc(x.short)}',
    name: '${esc(x.name)}',
    domain: '${dom}',
    tagline: '${esc(x.tagline)}',
    description:
      '${esc(x.description)}',
    credential: '${esc(x.credential)}',
    voice: '${esc(x.voice)}',
    focusTags: ${JSON.stringify(x.tags)},
    questions: ${JSON.stringify(x.questions)},
    sources: ${JSON.stringify(x.sources)},
    gates: ${JSON.stringify(x.gates)},
    highStakes: ${hs},
  }),`
}

const govBody = Object.entries(GOV)
  .map(([d, arr]) => `  // ── ${d} (+${arr.length}) ──\n` + arr.map((x) => emitLensTS(x, d)).join('\n'))
  .join('\n')

const techBody = Object.entries(TECH)
  .map(([d, arr]) => `  // ── ${d} (+${arr.length}) ──\n` + arr.map((x) => emitLensTS(x, d)).join('\n'))
  .join('\n')

const govFile = `/**
 * Governance SME expansion pack v1.3.0 — +40 lenses (domain doubles).
 * AUTO-GENERATED by scripts/gen_1_3_0_expansion.mjs — review before ship.
 */
import type { SmeDomain, SmeLens } from '../../types/sme'

const P = {
  evidence: 'Label every material claim +1 / 0 / −1. Never promote −1 as fact.',
  sources: 'Prefer primary public records and official statements over secondary social.',
  action: 'Every finding ends with an owner-ready next step, not a restatement of the claim.',
  layer0: 'High-stakes publish/export requires Layer-0 ACK and unresolved −1 clearance.',
}

type LensDef = {
  id: string
  short: string
  name: string
  domain: SmeDomain
  tagline: string
  description: string
  credential: string
  voice: string
  focusTags: string[]
  questions: string[]
  sources: string[]
  gates: string[]
  highStakes?: boolean
}

function lens(d: LensDef): SmeLens {
  return {
    id: d.id,
    short: d.short,
    name: d.name,
    domain: d.domain,
    tagline: d.tagline,
    description: d.description,
    persona: {
      title: d.name,
      credential: d.credential,
      voice: d.voice,
      principles: [P.evidence, P.sources, P.action, P.layer0],
    },
    focusTags: d.focusTags,
    questionBank: d.questions,
    preferredSources: d.sources,
    publishGates: d.gates,
    highStakes: d.highStakes ?? false,
  }
}

export const GOVERNANCE_EXPANSION_LENSES: SmeLens[] = [
${govBody}
]

if (GOVERNANCE_EXPANSION_LENSES.length !== 40) {
  throw new Error(\`GOVERNANCE_EXPANSION_LENSES must be 40, got \${GOVERNANCE_EXPANSION_LENSES.length}\`)
}
`

const techFile = `/**
 * Technical SME expansion pack v1.3.0 — +50 lenses (domain doubles).
 * AUTO-GENERATED by scripts/gen_1_3_0_expansion.mjs — review before ship.
 */
import type { SmeDomain, SmeLens } from '../../types/sme'

const T = {
  measure: 'Prefer measurement, method, and primary technical record over narrative assertion.',
  model: 'State model assumptions, boundary conditions, and validity domain before promoting claims.',
  failure: 'Name failure modes, safety factors, and applicable standards when engineering risk is claimed.',
  evidence: 'Label every material claim +1 / 0 / −1. Never promote physical impossibility without method.',
}

type LensDef = {
  id: string
  short: string
  name: string
  domain: SmeDomain
  tagline: string
  description: string
  credential: string
  voice: string
  focusTags: string[]
  questions: string[]
  sources: string[]
  gates: string[]
  highStakes?: boolean
}

function lens(d: LensDef): SmeLens {
  return {
    id: d.id,
    short: d.short,
    name: d.name,
    domain: d.domain,
    tagline: d.tagline,
    description: d.description,
    persona: {
      title: d.name,
      credential: d.credential,
      voice: d.voice,
      principles: [T.evidence, T.measure, T.model, T.failure],
    },
    focusTags: d.focusTags,
    questionBank: d.questions,
    preferredSources: d.sources,
    publishGates: d.gates,
    highStakes: d.highStakes ?? false,
  }
}

export const TECHNICAL_EXPANSION_LENSES: SmeLens[] = [
${techBody}
]

if (TECHNICAL_EXPANSION_LENSES.length !== 50) {
  throw new Error(\`TECHNICAL_EXPANSION_LENSES must be 50, got \${TECHNICAL_EXPANSION_LENSES.length}\`)
}
`

// Rules expansion
function ruleEntry(x) {
  const tags = JSON.stringify(x.ruleTags)
  const label = esc(x.short)
  switch (x.ruleKind) {
    case 'gov-primary':
      return `  '${x.id}': (ctx, base) => requirePrimaryForPlusOne(ctx, base, '${label}', ${tags}),`
    case 'gov-social':
      return `  '${x.id}': (ctx, base) => {
    let r = requirePrimaryForPlusOne(ctx, base, '${label}', ${tags})
    const text = hay(ctx)
    if (ctx.original === 1 && isSocialOnly(text, ctx.material)) {
      r = demoteToZero(r, '${label}: social/rumor cannot carry +1', 36)
    }
    return r
  },`
    case 'gov-export':
      return `  '${x.id}': (ctx, base) => {
    let r = requirePrimaryForPlusOne(ctx, base, '${label}', ${tags})
    const text = hay(ctx)
    if (ctx.original === -1 && (text.includes('export') || text.includes('publish') || text.includes('harm'))) {
      r.confidence = Math.max(r.confidence, 88)
      r.gaps.push('${label}: high-stakes −1 — Layer-0 before export')
    }
    return r
  },`
    case 'gov-wd':
      return `  '${x.id}': (ctx, base) => {
    let r = requirePrimaryForPlusOne(ctx, base, '${label}', ${tags})
    const text = hay(ctx)
    if (ctx.original === 1 && !hasAny(text, ['decision', 'lock', 'working', 'wd', 'owner', 'timestamp', 'log'])) {
      if (isWeakMaterial(ctx.material)) r = demoteToZero(r, '${label}: decision lock claim lacks WD anchors', 40)
    }
    return r
  },`
    case 'gov-jurisdiction':
      return `  '${x.id}': (ctx, base) => {
    let r = sectorTagMatch(ctx, base, ${tags}, '${label}')
    r = requirePrimaryForPlusOne(ctx, r, '${label}', ${tags})
    const text = hay(ctx)
    if (ctx.original === 1 && !hasAny(text, ['statute', 'code', 'section', 'clause', 'docket', 'order', 'treaty', 'charter', 'rule']) && isWeakMaterial(ctx.material)) {
      r = demoteToZero(r, '${label}: jurisdiction claim lacks instrument anchors', 38)
    }
    return r
  },`
    case 'sector':
      return `  '${x.id}': (ctx, base) => {
    let r = sectorTagMatch(ctx, base, ${tags}, '${label}')
    r = requirePrimaryForPlusOne(ctx, r, '${label}', ${tags})
    if (ctx.original === 1 && isSocialOnly(hay(ctx), ctx.material)) {
      r = demoteToZero(r, '${label}: social-only sector claim held at 0', 36)
    }
    return r
  },`
    case 'method':
      return `  '${x.id}': (ctx, base) => {
    let r = sectorTagMatch(ctx, base, ${tags}, '${label}')
    const text = hay(ctx)
    if (ctx.original === 1 && !hasAny(text, ['method', 'protocol', 'definition', 'measurement', 'metric', 'test', 'replicate', 'uncertainty', 'lineage']) && isWeakMaterial(ctx.material)) {
      r = demoteToZero(r, '${label}: method claim lacks operational definition/protocol', 37)
    }
    return r
  },`
    case 'eng':
      return `  '${x.id}': engineeringRule('${label}', ${tags}, { highStakesDefault: ${x.highStakes ? 'true' : 'false'} }),`
    case 'eng-dim':
      return `  '${x.id}': withDimensionlessRegime(engineeringRule('${label}', ${tags}, { highStakesDefault: ${x.highStakes ? 'true' : 'false'} }), '${label}'),`
    case 'theory':
      return `  '${x.id}': theoryRule('${label}', ${tags}),`
    case 'theory-dim':
      return `  '${x.id}': withDimensionlessRegime(theoryRule('${label}', ${tags}), '${label}'),`
    default:
      return `  '${x.id}': (ctx, base) => requirePrimaryForPlusOne(ctx, base, '${label}', ${tags}),`
  }
}

const rulesEntries = allNew.map(ruleEntry).join('\n')

// Dead draft strings kept for generator archaeology (entries are injected into rules.ts)
const _rulesFile = `/**
 * LENS_RULES expansion for 1.3.0 (+90 ids).
 * AUTO-GENERATED — merged into rules.ts registry.
 * This file exports only the expansion map; helpers live in rules.ts
 */
import type { RuleCtx, RuleResult } from './rules'

// NOTE: This module is not imported standalone — gen embeds entries into rules.ts
export const RULES_EXPANSION_IDS = ${JSON.stringify(allNew.map((x) => x.id), null, 2)} as const

// Placeholder type check
export type ExpansionRule = (ctx: RuleCtx, base: RuleResult) => RuleResult
`

// Actually we need to inject into rules.ts - write a fragment file that rules imports
const _rulesExpansionTs = `/**
 * Specialized LENS_RULES for 1.3.0 expansion lenses (+90).
 * Uses helpers from rules.ts via factory registration in rules.ts
 */
import type { RuleCtx, RuleResult } from './rulesCore'
// rulesCore not used — entries are string-injected into rules.ts by generator.
export const EXPANSION_RULE_SOURCE = true
`

// silence unused draft strings in lint while keeping for regen docs
void _rulesFile
void _rulesExpansionTs

// Export helpers from rules OR append entries into LENS_RULES object via search_replace.

writeFileSync(join(root, 'src/data/sme/governanceExpansion.ts'), govFile)
writeFileSync(join(root, 'src/data/sme/technicalExpansion.ts'), techFile)
writeFileSync(join(root, 'scripts/_rules_expansion_fragment.txt'), rulesEntries + '\n')
writeFileSync(join(root, 'scripts/_lens_ids_1_3_0.json'), JSON.stringify(allNew.map((x) => ({ id: x.id, domain: x.domain, short: x.short })), null, 2))

// Congressional desks 21-40
const DESKS = [
  { id: 'cong-21-spectrum-fcc', short: 'Spectrum/FCC', title: 'Spectrum auctions & private wireless network effects', industry: 'Carriers, private 5G, equipment OEMs', agency: 'FCC', agencyUrl: 'https://www.fcc.gov/', agencyWhy: 'Spectrum licensing and auction public notices.', billHint: 'Congress.gov search: spectrum auction', billUrl: 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22spectrum%20auction%22%7D', tags: ['spectrum', 'fcc', 'wireless', 'auction'], stakes: 'Auction design and interference rules shift capital cost and coverage economics for private networks.', lede: 'Oversight of spectrum allocation and auction rules affects carriers and private wireless deployments. This training desk scores industry-effect claims against FCC primary materials—not social “banned band” posts.' },
  { id: 'cong-22-pharma-patents', short: 'Pharma patents', title: 'Pharma patent thickets & Orange Book oversight effects', industry: 'Pharma, generics, PBMs', agency: 'FDA Orange Book', agencyUrl: 'https://www.fda.gov/drugs/drug-approvals-and-databases/orange-book-data-files', agencyWhy: 'Patent/exclusivity listings affecting generic entry.', billHint: 'Congress.gov search: Orange Book patent', billUrl: 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22Orange%20Book%20patent%22%7D', tags: ['pharma', 'patent', 'orange book', 'generic'], stakes: 'Listing and challenge procedures change generic entry timing and private litigation spend.', lede: 'Patent listing and challenge oversight can alter when competitors enter. Training desk: primary FDA/PTO materials over price-meme certainty.' },
  { id: 'cong-23-space-commerce', short: 'Space commerce', title: 'Commercial space launch oversight — FAA AST industry effects', industry: 'Launch providers, satellite operators', agency: 'FAA commercial space', agencyUrl: 'https://www.faa.gov/space', agencyWhy: 'Commercial launch licensing public materials.', billHint: 'Congress.gov search: commercial space launch', billUrl: 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22commercial%20space%20launch%22%7D', tags: ['space', 'launch', 'faa', 'satellite'], stakes: 'Licensing timelines and safety cases drive private launch cadence and insurance.', lede: 'Commercial space oversight is operational for private launch and satellite firms. Score claims with FAA AST primary—not hype timelines.' },
  { id: 'cong-24-maritime-jones', short: 'Maritime/Jones', title: 'Maritime industrial base & Jones Act-shaped effects', industry: 'Shipbuilding, shipping, energy logistics', agency: 'MARAD', agencyUrl: 'https://www.maritime.dot.gov/', agencyWhy: 'Maritime administration public programs.', billHint: 'Congress.gov search: Jones Act maritime', billUrl: 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22Jones%20Act%22%7D', tags: ['maritime', 'jones act', 'shipbuilding', 'shipping'], stakes: 'Cabotage and shipyard capacity rules reshape logistics costs and industrial base investment.', lede: 'Maritime rules affect private shipping and shipbuilding economics. Prefer statute and MARAD/USCG primary over slogan wars.' },
  { id: 'cong-25-agribusiness', short: 'Agribusiness', title: 'Agribusiness competition & packers oversight effects', industry: 'Packers, growers, retailers', agency: 'USDA AMS', agencyUrl: 'https://www.ams.usda.gov/', agencyWhy: 'Market news and competition-related public materials.', billHint: 'Congress.gov search: packers stockyards', billUrl: 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22Packers%20and%20Stockyards%22%7D', tags: ['agriculture', 'packers', 'usda', 'competition'], stakes: 'Market transparency and competition rules change contracting power along the food chain.', lede: 'Oversight of livestock and packing markets has private contract and price-discovery effects. Use USDA/DOJ primary.' },
  { id: 'cong-26-housing-gse', short: 'Housing/GSE', title: 'Housing finance & GSE/appraisal oversight effects', industry: 'Mortgage, appraisal, proptech', agency: 'FHFA', agencyUrl: 'https://www.fhfa.gov/', agencyWhy: 'GSE oversight public materials.', billHint: 'Congress.gov search: GSE housing finance', billUrl: 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22GSE%20housing%20finance%22%7D', tags: ['housing', 'gse', 'mortgage', 'appraisal'], stakes: 'Guarantee fees, appraisal rules, and capital standards reprice private mortgage credit.', lede: 'Housing finance oversight is an industry-effect desk for lenders and appraisal firms. FHFA and statute text over viral rate claims.' },
  { id: 'cong-27-student-loans', short: 'Student loans', title: 'Student loan servicing oversight — industry operations effects', industry: 'Servicers, schools, fintech tools', agency: 'Federal Student Aid', agencyUrl: 'https://studentaid.gov/', agencyWhy: 'Servicing and borrower public materials.', billHint: 'Congress.gov search: student loan servicing', billUrl: 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22student%20loan%20servicing%22%7D', tags: ['student loans', 'servicing', 'ed', 'borrower'], stakes: 'Servicing rules and oversight change private operating cost and liability for servicers.', lede: 'Student loan servicing oversight affects private operators and borrower-facing processes. Prefer ED primary notices.' },
  { id: 'cong-28-cyber-circia', short: 'Cyber CIRCIA', title: 'Cyber incident reporting (CIRCIA-shaped) — CI firm burden', industry: 'Critical infrastructure operators, MSSPs', agency: 'CISA', agencyUrl: 'https://www.cisa.gov/', agencyWhy: 'Cyber incident reporting and sector guidance.', billHint: 'Congress.gov search: CIRCIA cyber incident', billUrl: 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22CIRCIA%22%7D', tags: ['cyber', 'circia', 'cisa', 'incident'], stakes: 'Reporting clocks and covered-entity definitions drive private IR process and vendor demand.', lede: 'Incident reporting oversight for critical infrastructure is an industry compliance desk. CISA primary over meme clocks.' },
  { id: 'cong-29-ai-copyright', short: 'AI copyright', title: 'AI training data & copyright oversight — licensing industry effects', industry: 'AI labs, publishers, platforms', agency: 'Copyright Office', agencyUrl: 'https://www.copyright.gov/', agencyWhy: 'Copyright office public materials on AI and registration.', billHint: 'Congress.gov search: AI copyright training data', billUrl: 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22artificial%20intelligence%20copyright%22%7D', tags: ['copyright', 'ai', 'training data', 'licensing'], stakes: 'Licensing norms and liability theories change data acquisition cost for model builders.', lede: 'AI training-data copyright oversight is contested. Training desk: Copyright Office and court primaries—not fan theories as +1.' },
  { id: 'cong-30-fedramp-cloud', short: 'FedRAMP', title: 'FedRAMP / gov cloud burden on SaaS vendors', industry: 'SaaS, cloud, integrators', agency: 'FedRAMP', agencyUrl: 'https://www.fedramp.gov/', agencyWhy: 'Authorization program public materials.', billHint: 'Congress.gov search: FedRAMP cloud', billUrl: 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22FedRAMP%22%7D', tags: ['fedramp', 'cloud', 'saas', 'authorization'], stakes: 'Authorization paths and continuous monitoring costs gate private SaaS into federal markets.', lede: 'Gov cloud authorization is a private compliance cost story. Use FedRAMP program primary for pathway claims.' },
  { id: 'cong-31-insurance-climate', short: 'Ins climate', title: 'Insurance climate risk models & federal/NAIC-facing oversight', industry: 'Insurers, reinsurers, modelers', agency: 'NAIC', agencyUrl: 'https://content.naic.org/', agencyWhy: 'Insurance regulatory association public resources.', billHint: 'Congress.gov search: insurance climate risk', billUrl: 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22insurance%20climate%20risk%22%7D', tags: ['insurance', 'climate', 'risk model', 'naic'], stakes: 'Model governance and disclosure pressure change underwriting and reinsurance pricing.', lede: 'Climate risk modeling oversight affects private insurance economics. Prefer NAIC/state DOI and federal hearing primaries.' },
  { id: 'cong-32-rail-safety', short: 'Rail safety', title: 'Rail safety / FRA tank car & PSR-shaped industry effects', industry: 'Class I rails, shippers, tank car lessors', agency: 'FRA', agencyUrl: 'https://railroads.dot.gov/', agencyWhy: 'Rail safety rules and accident data public materials.', billHint: 'Congress.gov search: rail safety tank car', billUrl: 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22rail%20safety%22%7D', tags: ['rail', 'fra', 'tank car', 'safety'], stakes: 'Tank car standards and operating practices change private capex and routing.', lede: 'Rail safety oversight after major incidents focuses private compliance. FRA primary over viral crash narratives for duty claims.' },
  { id: 'cong-33-cfats-chem', short: 'CFATS chem', title: 'Chemical facility security (CFATS-shaped) private costs', industry: 'Chem plants, logistics, security vendors', agency: 'CISA chemical security', agencyUrl: 'https://www.cisa.gov/chemical-security', agencyWhy: 'Chemical facility security program public materials.', billHint: 'Congress.gov search: CFATS chemical facility', billUrl: 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22CFATS%22%7D', tags: ['cfats', 'chemical', 'security', 'facility'], stakes: 'Security plans and inspections drive private compliance spend and site design.', lede: 'Chemical facility security oversight is a private cost desk. CISA chemical security primary for duty claims.' },
  { id: 'cong-34-export-bis', short: 'Export BIS', title: 'Export controls / BIS entity list compliance burden', industry: 'Semiconductors, cloud, dual-use exporters', agency: 'BIS', agencyUrl: 'https://www.bis.doc.gov/', agencyWhy: 'Export administration public materials and lists.', billHint: 'Congress.gov search: export controls entity list', billUrl: 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22export%20controls%22%7D', tags: ['export', 'bis', 'entity list', 'ear'], stakes: 'List updates and license policy change private go-to-market and compliance headcount.', lede: 'Export control oversight is high-stakes for tech exporters. Dated public list entries only—no invented designations.' },
  { id: 'cong-35-ofac-sanctions', short: 'OFAC', title: 'Sanctions compliance (OFAC) for banks & fintech rails', industry: 'Banks, fintech, payment processors', agency: 'OFAC', agencyUrl: 'https://ofac.treasury.gov/', agencyWhy: 'Sanctions lists and compliance resources.', billHint: 'Congress.gov search: sanctions OFAC compliance', billUrl: 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22OFAC%20sanctions%22%7D', tags: ['sanctions', 'ofac', 'banking', 'fintech'], stakes: 'Screening expectations and penalties shape private compliance systems and market access.', lede: 'Sanctions compliance is a private rails desk. OFAC list and guidance primary; no rumor designations as +1.' },
  { id: 'cong-36-child-safety-apps', short: 'Child safety', title: 'Online child safety & app store age-design duties (industry)', industry: 'App stores, social apps, games', agency: 'FTC', agencyUrl: 'https://www.ftc.gov/', agencyWhy: 'Consumer protection and COPPA-related public materials.', billHint: 'Congress.gov search: child online safety', billUrl: 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22child%20online%20safety%22%7D', tags: ['child safety', 'coppa', 'app store', 'age'], stakes: 'Age design and app store policies change product UX and liability for platforms.', lede: 'Child online safety oversight has private product-design effects. FTC/statute primary; avoid moral-panic +1 without text.' },
  { id: 'cong-37-ticketing', short: 'Ticketing', title: 'Live events ticketing competition — venue & platform effects', industry: 'Ticketing platforms, venues, artists services', agency: 'DOJ ATR', agencyUrl: 'https://www.justice.gov/atr', agencyWhy: 'Antitrust enforcement public materials.', billHint: 'Congress.gov search: ticketing competition', billUrl: 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22ticket%20competition%22%7D', tags: ['ticketing', 'antitrust', 'venues', 'live events'], stakes: 'Competition remedies and disclosure rules reallocate fees and exclusive dealing economics.', lede: 'Ticketing market structure oversight is an industry desk for platforms and venues. DOJ/FTC/hearing primaries.' },
  { id: 'cong-38-postal-lastmile', short: 'Postal/last-mile', title: 'Postal & package last-mile competition effects', industry: 'USPS competitors, parcel carriers, retailers', agency: 'PRC', agencyUrl: 'https://www.prc.gov/', agencyWhy: 'Postal Regulatory Commission public materials.', billHint: 'Congress.gov search: postal reform package delivery', billUrl: 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22postal%20reform%22%7D', tags: ['postal', 'package', 'last-mile', 'usps'], stakes: 'Service standards and pricing oversight change private parcel competition.', lede: 'Postal and package markets sit at public-private interfaces. PRC/USPS primary for duty and pricing claims.' },
  { id: 'cong-39-pfas-water', short: 'PFAS water', title: 'PFAS water infrastructure liability — utilities & manufacturers', industry: 'Utilities, chem manufacturers, insurers', agency: 'EPA PFAS', agencyUrl: 'https://www.epa.gov/pfas', agencyWhy: 'PFAS regulatory and scientific public materials.', billHint: 'Congress.gov search: PFAS drinking water', billUrl: 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22PFAS%20drinking%20water%22%7D', tags: ['pfas', 'water', 'epa', 'liability'], stakes: 'MCLs and liability frameworks reallocate treatment capex and insurance for private and municipal systems.', lede: 'PFAS oversight is a capital and liability story for utilities and manufacturers. EPA primary; no invented MCLs.' },
  { id: 'cong-40-pqc-crypto', short: 'PQC crypto', title: 'Post-quantum crypto migration — vendor & enterprise burden', industry: 'Crypto libraries, HSMs, enterprise IT', agency: 'NIST PQC', agencyUrl: 'https://csrc.nist.gov/projects/post-quantum-cryptography', agencyWhy: 'PQC standardization public project pages.', billHint: 'Congress.gov search: post-quantum cryptography', billUrl: 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22post-quantum%20cryptography%22%7D', tags: ['pqc', 'cryptography', 'nist', 'migration'], stakes: 'Standards timelines force private crypto inventory and migration projects across vendors.', lede: 'Post-quantum migration is a multi-year private engineering cost story. NIST CSRC primary for algorithm status claims.' },
]

// lat/lng jitter around DC
DESKS.forEach((d, i) => {
  d.rank = 31 + i
  d.lat = 38.8899 + (i % 5) * 0.012 - 0.02
  d.lng = -77.0091 - (i % 7) * 0.01 + 0.03
  d.cityHint = 'Washington, DC area'
})

const deskSeedsTs = DESKS.map((d) => `  {
    id: '${d.id}',
    rank: ${d.rank},
    short: '${esc(d.short)}',
    title: '${esc(d.title)}',
    industry: '${esc(d.industry)}',
    stakes: '${esc(d.stakes)}',
    lede: '${esc(d.lede)}',
    agency: '${esc(d.agency)}',
    agencyUrl: '${d.agencyUrl}',
    agencyWhy: '${esc(d.agencyWhy)}',
    billHint: '${esc(d.billHint)}',
    billUrl: '${d.billUrl}',
    lat: ${d.lat.toFixed(4)},
    lng: ${d.lng.toFixed(4)},
    cityHint: '${esc(d.cityHint)}',
    tags: ${JSON.stringify(d.tags)},
    extraClaims: [
      {
        statement: '${esc(d.agency)} publishes primary materials used for compliance planning in ${esc(d.industry)}.',
        score: 1,
        material: 'secondary',
        notes: 'Agency home is a starting point — cite specific instruments for +1 duties.',
      },
      {
        statement: 'A single social post fully states the legal duty for all firms in ${esc(d.short)}.',
        score: -1,
        material: 'assumption',
        notes: 'Social-only legal duty claims are disqualifying without primary text.',
      },
      {
        statement: 'Oversight and potential rules can change private compliance cost and market access in ${esc(d.industry)}.',
        score: 1,
        material: 'derived',
        notes: 'Industry-effect directionally supported; magnitude needs studies.',
      },
      {
        statement: 'All firms face identical compliance costs regardless of size or sector under any rule change.',
        score: 0,
        material: 'assumption',
        notes: 'Heterogeneous impact — hold until analysis.',
      },
      {
        statement: 'Congress.gov search links help locate measures related to ${esc(d.short)} but are not enrolled text.',
        score: 1,
        material: 'secondary',
        notes: 'Search ≠ statute; open specific bills for operative language.',
      },
    ],
  }`).join(',\n')

writeFileSync(join(root, 'scripts/_congress_seeds_21_40.txt'), deskSeedsTs)

// Sources expansion TS
let sourcesTs = `/** Congressional sources expansion cong-21…40 — generated */\nimport type { ActiveSource } from '../../types/useCase'\n\nfunction s(id: string, title: string, url: string, why: string, kind: ActiveSource['kind'], publisher?: string, publicRecord = true, tags: string[] = []): ActiveSource {\n  return { id, title, url, why, kind, publisher, publicRecord, tags }\n}\n\nexport const CONGRESS_SOURCES_EXPANSION: Record<string, ActiveSource[]> = {\n`
for (const d of DESKS) {
  sourcesTs += `  '${d.id}': [
    s('${d.id}-src-1', 'Congress.gov', 'https://www.congress.gov/', 'Bill and committee materials', 'official', 'Congress.gov', true, ${JSON.stringify(d.tags)}),
    s('${d.id}-src-2', '${esc(d.agency)}', '${d.agencyUrl}', '${esc(d.agencyWhy)}', 'official', '${esc(d.agency)}', true, ${JSON.stringify(d.tags)}),
    s('${d.id}-src-3', '${esc(d.billHint)}', '${d.billUrl}', 'Legislation search for this desk family', 'official', 'Congress.gov', true, ['legislation']),
    s('${d.id}-src-4', 'GAO', 'https://www.gao.gov/', 'Independent evaluations', 'official', 'GAO', true, ['audit']),
    s('${d.id}-src-5', 'CRS', 'https://crsreports.congress.gov/', 'Legislative analysis', 'official', 'CRS', true, ['crs']),
  ],\n`
}
sourcesTs += `}\n`
writeFileSync(join(root, 'src/data/useCases/congressSourcesExpansion.ts'), sourcesTs)

// Stories expansion - compact but full InvestigationStory shape used by congressStories
let storiesTs = `/** Congressional stories expansion cong-21…40 — generated */\nimport type { EvidenceScore } from '../../types/core'\nimport type { CongressStory } from './congressStories'\n\nfunction st(score: EvidenceScore): 'supported' | 'uncertain' | 'disputed' {\n  if (score === 1) return 'supported'\n  if (score === -1) return 'disputed'\n  return 'uncertain'\n}\n\nexport const CONGRESS_STORIES_EXPANSION: Record<string, CongressStory> = {\n`
for (const d of DESKS) {
  storiesTs += `  '${d.id}': {
    useCaseId: '${d.id}',
    title: '${esc(d.title)}',
    where: '${esc(d.cityHint)}',
    lede: '${esc(d.lede)}',
    stakes: '${esc(d.stakes)}',
    knownSoFar: [
      'Oversight activity and agency materials are public starting points for ${esc(d.short)}.',
      'Industry effects concentrate in ${esc(d.industry)}.',
      'Primary sources preferred: Congress.gov, ${esc(d.agency)}, GAO/CRS.',
    ],
    stillOpen: [
      'Which specific measures are active vs draft?',
      'What is the quantified private cost by firm size?',
      'Which claims are social-only noise?',
      'What verification steps unlock export?',
    ],
    claims: [
      { plain: '${esc(d.agency)} publishes materials relevant to compliance planning.', status: st(1), score: 1 as EvidenceScore, why: 'Agency primary starting point.' },
      { plain: 'Social posts alone establish legal duties for ${esc(d.short)}.', status: st(-1), score: -1 as EvidenceScore, why: 'Disqualifying without primary text.' },
      { plain: 'Rules can change compliance cost for ${esc(d.industry)}.', status: st(1), score: 1 as EvidenceScore, why: 'Directionally supported industry effect.' },
      { plain: 'Impacts are identical for all firms.', status: st(0), score: 0 as EvidenceScore, why: 'Heterogeneous — hold.' },
      { plain: 'Congress.gov search is not enrolled bill text.', status: st(1), score: 1 as EvidenceScore, why: 'Method hygiene.' },
    ],
    surfaces: {
      map: 'Capitol-region pin for orientation; effects often national.',
      research: 'Score industry-effect claims with primary hierarchy.',
      design: 'Verification depth before publish.',
      ladder: 'Raise detail with sources intact.',
      analyst: 'sme multi-select for domain packs.',
      model: 'Optional schematic only.',
      export: 'Layer-0; clear −1 first.',
      sources: 'Agency + Congress + GAO/CRS.',
    },
    tabLabels: { 'research-hub': 'Claims', atlas: 'Desk map', 'sme-lenses': 'SME', analyst: 'Commands', 'export-kit': 'Export' },
    nextStep: 'Open Claims, attach agency primary, run Evidence Gate + relevant sector SME.',
  },\n`
}
storiesTs += `}\n`
writeFileSync(join(root, 'src/data/useCases/congressStoriesExpansion.ts'), storiesTs)

console.log('Generated:')
console.log('  governanceExpansion.ts', allNew.filter((x) => x.bank === 'gov').length)
console.log('  technicalExpansion.ts', allNew.filter((x) => x.bank === 'tech').length)
console.log('  rules fragment lines', rulesEntries.split('\n').length)
console.log('  congress desks', DESKS.length)
console.log('OK')
