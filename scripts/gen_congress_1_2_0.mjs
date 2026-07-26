/**
 * Generate congressional desk data files for NEXOSxLPIN 1.2.0
 */
import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const AS_OF = '2026-07-25'

const desks = [
  {
    id: 'cong-01-ai-frontier',
    short: 'AI Frontier',
    title: 'Frontier AI oversight / model risk',
    industry: 'foundation model labs, cloud hyperscalers, enterprise AI vendors',
    agencies: ['NIST AI RMF', 'FTC', 'Congress AI materials'],
    hub: { city: 'Washington, DC', lat: 38.8899, lng: -77.0091 },
    urls: [
      ['Congress.gov', 'https://www.congress.gov/', 'Bill and committee text for AI oversight measures'],
      ['NIST AI', 'https://www.nist.gov/artificial-intelligence', 'AI RMF and measurement science'],
      ['GAO', 'https://www.gao.gov/', 'Technology assessment and oversight reports'],
      ['CRS', 'https://crsreports.congress.gov/', 'Legislative analysis on AI policy'],
      ['FTC', 'https://www.ftc.gov/', 'Consumer protection and unfair practices authority'],
    ],
    claims: [
      [1, 'primary', 'Congress and agencies have published AI risk frameworks and hearing records operators can cite as public-record anchors.', 'nist,hearing,framework'],
      [1, 'primary', 'Enterprise buyers face rising contractual and compliance due-diligence costs when deploying frontier models.', 'compliance,contract,cost'],
      [0, 'secondary', 'A single federal AI licensing regime will pass in the current session with stable text.', 'bill,timing'],
      [0, 'derived', 'Model evaluation benchmarks fully capture deployment risk for all industry verticals.', 'benchmark,eval'],
      [-1, 'assumption', 'Frontier labs have zero compliance burden until a final statute is enacted.', 'compliance'],
      [-1, 'assumption', 'Industry impact can be scored from social posts alone without agency or filing primary.', 'social,rumor'],
    ],
  },
  {
    id: 'cong-02-bigtech-competition',
    short: 'Platform Antitrust',
    title: 'Large platform competition / antitrust oversight',
    industry: 'large digital platforms, app stores, advertisers, complementary software vendors',
    agencies: ['DOJ Antitrust Division', 'FTC', 'Judiciary committees'],
    hub: { city: 'Washington, DC', lat: 38.8921, lng: -77.0189 },
    urls: [
      ['DOJ ATR', 'https://www.justice.gov/atr', 'Antitrust enforcement primary'],
      ['FTC', 'https://www.ftc.gov/', 'Competition policy and cases'],
      ['Congress.gov', 'https://www.congress.gov/', 'Competition bills and hearings'],
      ['GAO', 'https://www.gao.gov/', 'Market structure and agency capacity reviews'],
      ['CRS', 'https://crsreports.congress.gov/', 'Antitrust legislative history'],
    ],
    claims: [
      [1, 'primary', 'DOJ and FTC maintain public case dockets and competition policy statements affecting platform conduct.', 'doj,ftc,docket'],
      [1, 'secondary', 'Remedies and conduct rules can raise compliance and product design costs for platforms and partners.', 'remedy,compliance'],
      [0, 'secondary', 'A single structural breakup remedy is certain for every major platform this Congress.', 'remedy,timing'],
      [0, 'derived', 'Advertiser switching costs are fully measured in public filings for all verticals.', 'advertising'],
      [-1, 'assumption', 'Antitrust outcomes can be predicted from viral posts without court or agency documents.', 'social'],
      [-1, 'assumption', 'Industry partners face no commercial uncertainty while cases are pending.', 'uncertainty'],
    ],
  },
  {
    id: 'cong-03-section-230',
    short: 'Section 230',
    title: 'Intermediary liability / Section 230 reform stakes',
    industry: 'online platforms, hosting providers, moderation tooling vendors',
    agencies: ['Congress', 'CRS', 'courts via public opinions'],
    hub: { city: 'Washington, DC', lat: 38.8865, lng: -77.0045 },
    urls: [
      ['Congress.gov search 230', 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22section%20230%22%7D', 'Legislation mentioning Section 230'],
      ['CRS', 'https://crsreports.congress.gov/', 'Section 230 explainers and reform options'],
      ['Congress.gov', 'https://www.congress.gov/', 'Committee hearings and bill text'],
      ['GAO', 'https://www.gao.gov/', 'Related online content oversight reviews'],
      ['FTC', 'https://www.ftc.gov/', 'Consumer protection adjacent to platform practices'],
    ],
    claims: [
      [1, 'primary', 'Section 230 remains a statutory baseline; reform proposals are tracked on Congress.gov.', 'statute,congress'],
      [1, 'secondary', 'Liability redesign would change insurance, moderation staffing, and product risk for intermediaries.', 'liability,insurance'],
      [0, 'secondary', 'Reform language is stable enough for multi-year capital planning without further amendment risk.', 'bill text'],
      [0, 'derived', 'All platforms would face identical compliance costs under any reform variant.', 'cost'],
      [-1, 'assumption', 'Repeal would have no effect on small hosts or infrastructure providers.', 'sme'],
      [-1, 'assumption', 'Court holdings can be ignored if social consensus disagrees.', 'court'],
    ],
  },
  {
    id: 'cong-04-consumer-privacy',
    short: 'Privacy Brokers',
    title: 'Federal privacy / data broker industry effects',
    industry: 'data brokers, adtech, retailers with loyalty graphs, SaaS processors',
    agencies: ['FTC', 'Congress commerce committees'],
    hub: { city: 'Washington, DC', lat: 38.9001, lng: -77.0212 },
    urls: [
      ['FTC', 'https://www.ftc.gov/', 'Privacy enforcement and policy'],
      ['Congress.gov privacy', 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22consumer%20privacy%22%7D', 'Federal privacy bills'],
      ['CRS', 'https://crsreports.congress.gov/', 'Privacy legislative analysis'],
      ['GAO', 'https://www.gao.gov/', 'Data broker and privacy program reviews'],
      ['Congress.gov', 'https://www.congress.gov/', 'Hearing records'],
    ],
    claims: [
      [1, 'primary', 'FTC and Congress publish privacy enforcement and bill materials affecting broker models.', 'ftc,privacy'],
      [1, 'secondary', 'Uniform federal rules could reduce multi-state patchwork costs but raise baseline controls spend.', 'compliance,cost'],
      [0, 'secondary', 'A comprehensive federal privacy law will pre-empt all state regimes without carve-outs.', 'preemption'],
      [0, 'derived', 'Data broker revenue impact is precisely known from public filings alone.', 'broker'],
      [-1, 'assumption', 'Privacy compliance is free for small processors.', 'sme'],
      [-1, 'assumption', 'Broker deletion rights can be ignored if data was purchased lawfully.', 'deletion'],
    ],
  },
  {
    id: 'cong-05-health-algo-pbm',
    short: 'Health Algo PBM',
    title: 'Health plan algorithms and PBM transparency',
    industry: 'PBMs, health plans, pharmacies, digital health vendors',
    agencies: ['HHS', 'FTC', 'Congress health committees'],
    hub: { city: 'Washington, DC', lat: 38.885, lng: -77.0155 },
    urls: [
      ['HHS', 'https://www.hhs.gov/', 'Health policy primary'],
      ['FTC', 'https://www.ftc.gov/', 'PBM and pharmacy benefit scrutiny'],
      ['Congress.gov', 'https://www.congress.gov/', 'PBM transparency bills'],
      ['GAO', 'https://www.gao.gov/', 'Drug pricing and PBM reviews'],
      ['CMS', 'https://www.cms.gov/', 'Plan and pharmacy program rules'],
    ],
    claims: [
      [1, 'primary', 'Congress and agencies have open dockets on PBM transparency and plan algorithm oversight.', 'pbm,hearing'],
      [1, 'secondary', 'Transparency rules raise reporting and audit costs for PBMs and contracted pharmacies.', 'reporting,cost'],
      [0, 'secondary', 'Algorithm disclosure will fully eliminate formulary disputes.', 'algorithm'],
      [0, 'derived', 'Patient out-of-pocket effects are uniform across all plan designs.', 'oop'],
      [-1, 'assumption', 'Plan algorithms have no industry compliance footprint until a final rule.', 'compliance'],
      [-1, 'assumption', 'Social anecdotes prove rebate pass-through without contract primary.', 'rebate'],
    ],
  },
  {
    id: 'cong-06-drug-pricing',
    short: 'Drug Pricing',
    title: 'Prescription drug pricing oversight',
    industry: 'manufacturers, wholesalers, pharmacies, plan sponsors',
    agencies: ['HHS', 'CMS', 'Congress'],
    hub: { city: 'Washington, DC', lat: 38.8935, lng: -77.002 },
    urls: [
      ['CMS', 'https://www.cms.gov/', 'Medicare drug pricing program materials'],
      ['HHS', 'https://www.hhs.gov/', 'Department policy'],
      ['Congress.gov', 'https://www.congress.gov/', 'Drug pricing legislation'],
      ['GAO', 'https://www.gao.gov/', 'Drug pricing evaluations'],
      ['FDA', 'https://www.fda.gov/', 'Approval and competition pathways'],
    ],
    claims: [
      [1, 'primary', 'CMS and HHS publish program rules affecting manufacturer pricing negotiations and reporting.', 'cms,pricing'],
      [1, 'secondary', 'Pricing policy shifts change launch strategy, formulary access, and rebate contracting.', 'launch,rebate'],
      [0, 'secondary', 'List price cuts always flow dollar-for-dollar to every patient at retail.', 'list price'],
      [0, 'derived', 'R and D investment response is fully measurable from a single earnings call.', 'rnd'],
      [-1, 'assumption', 'Manufacturers face no compliance cost for price reporting programs.', 'reporting'],
      [-1, 'assumption', 'Viral claims of a drug price can replace official list or net sources.', 'viral'],
    ],
  },
  {
    id: 'cong-07-hospital-consolidation',
    short: 'Hospital MA',
    title: 'Hospital and payer consolidation',
    industry: 'hospital systems, insurers, physician groups, PE-backed platforms',
    agencies: ['FTC', 'DOJ', 'state AGs public actions'],
    hub: { city: 'Washington, DC', lat: 38.898, lng: -77.025 },
    urls: [
      ['FTC', 'https://www.ftc.gov/', 'Hospital merger review'],
      ['DOJ ATR', 'https://www.justice.gov/atr', 'Healthcare competition'],
      ['Congress.gov', 'https://www.congress.gov/', 'Consolidation oversight hearings'],
      ['GAO', 'https://www.gao.gov/', 'Healthcare market reviews'],
      ['CMS', 'https://www.cms.gov/', 'Provider payment context'],
    ],
    claims: [
      [1, 'primary', 'FTC and DOJ publish merger challenges and policy statements on healthcare concentration.', 'merger,ftc'],
      [1, 'secondary', 'Consolidation can alter payer-provider bargaining and local service lines.', 'bargaining'],
      [0, 'secondary', 'Every hospital merger raises prices in every market by the same percent.', 'price'],
      [0, 'derived', 'Cross-market system effects are fully settled in public literature.', 'cross-market'],
      [-1, 'assumption', 'Quality always improves automatically after system acquisition.', 'quality'],
      [-1, 'assumption', 'Private equity ownership can be scored without ownership filings or state notices.', 'pe'],
    ],
  },
  {
    id: 'cong-08-energy-permitting',
    short: 'Energy Permitting',
    title: 'Energy permitting, LNG, and grid reliability',
    industry: 'developers, LNG exporters, transmission owners, EPCs',
    agencies: ['FERC', 'DOE', 'Congress energy committees'],
    hub: { city: 'Washington, DC', lat: 38.884, lng: -77.028 },
    urls: [
      ['FERC', 'https://www.ferc.gov/', 'Electric and gas infrastructure dockets'],
      ['DOE', 'https://www.energy.gov/', 'Energy infrastructure and reliability'],
      ['Congress.gov', 'https://www.congress.gov/', 'Permitting reform legislation'],
      ['GAO', 'https://www.gao.gov/', 'Permitting and grid reviews'],
      ['EIA', 'https://www.eia.gov/', 'Energy statistics primary'],
    ],
    claims: [
      [1, 'primary', 'FERC and DOE host public dockets and reliability materials affecting project timelines.', 'ferc,docket'],
      [1, 'secondary', 'Permitting duration is a material cost and financing variable for developers.', 'permitting,cost'],
      [0, 'secondary', 'A single permitting reform bill eliminates all NEPA litigation risk.', 'nepa'],
      [0, 'derived', 'LNG export approvals have identical local and global price effects in all scenarios.', 'lng'],
      [-1, 'assumption', 'Grid reliability claims need no ISO or utility primary if a map goes viral.', 'reliability'],
      [-1, 'assumption', 'Projects face zero soft-cost spend before final notice to proceed.', 'soft cost'],
    ],
  },
  {
    id: 'cong-09-critical-minerals',
    short: 'Critical Minerals',
    title: 'Critical minerals and supply chain',
    industry: 'miners, processors, battery OEMs, defense primes',
    agencies: ['DOE', 'USGS', 'Commerce', 'Congress'],
    hub: { city: 'Washington, DC', lat: 38.901, lng: -77.012 },
    urls: [
      ['USGS', 'https://www.usgs.gov/', 'Mineral commodity summaries'],
      ['DOE', 'https://www.energy.gov/', 'Critical minerals programs'],
      ['Congress.gov', 'https://www.congress.gov/', 'Supply chain legislation'],
      ['GAO', 'https://www.gao.gov/', 'Strategic materials reviews'],
      ['Commerce', 'https://www.commerce.gov/', 'Industrial base context'],
    ],
    claims: [
      [1, 'primary', 'USGS and DOE publish mineral criticality and program materials used in industrial planning.', 'usgs,minerals'],
      [1, 'secondary', 'Processing capacity and offtake contracts are industry bottlenecks beyond mine permits.', 'processing'],
      [0, 'secondary', 'Domestic mining alone solves refined chemical intermediate shortfalls this decade.', 'refining'],
      [0, 'derived', 'Price spikes map one-to-one to mine output without inventory or substitution effects.', 'price'],
      [-1, 'assumption', 'Export controls have no compliance cost for midstream processors.', 'export control'],
      [-1, 'assumption', 'Social maps of mines replace USGS commodity data.', 'social'],
    ],
  },
  {
    id: 'cong-10-defense-contracting',
    short: 'Defense Oversight',
    title: 'Defense contractor oversight and waste-fraud-abuse desk',
    industry: 'defense primes, subcontractors, services firms',
    agencies: ['DoD', 'GAO', 'DoD IG', 'Congress armed services'],
    hub: { city: 'Arlington, VA / DC', lat: 38.8719, lng: -77.0563 },
    urls: [
      ['GAO', 'https://www.gao.gov/', 'Defense acquisition and WFA reports'],
      ['Congress.gov', 'https://www.congress.gov/', 'NDAA and oversight hearings'],
      ['DoD', 'https://www.defense.gov/', 'Department public releases'],
      ['USAspending', 'https://www.usaspending.gov/', 'Award and spend transparency'],
      ['CRS', 'https://crsreports.congress.gov/', 'Acquisition policy analysis'],
    ],
    claims: [
      [1, 'primary', 'GAO and Congress publish recurring acquisition and waste-fraud-abuse findings.', 'gao,acquisition'],
      [1, 'secondary', 'Cost accounting and cybersecurity requirements raise subcontractor barriers to entry.', 'dfars,compliance'],
      [0, 'secondary', 'Every cost overrun is intentional fraud without further evidence.', 'fraud'],
      [0, 'derived', 'Prime-sub cash flow stress is uniform across all program types.', 'cash'],
      [-1, 'assumption', 'Classified program details can be filled from social media.', 'opsec'],
      [-1, 'assumption', 'IG findings can be dismissed without reading the public report.', 'ig'],
    ],
  },
  {
    id: 'cong-11-cfius-tech',
    short: 'CFIUS Tech',
    title: 'Foreign investment in sensitive tech (CFIUS-shaped desk)',
    industry: 'VC and PE, strategic acquirers, semiconductors, AI, dual-use startups',
    agencies: ['Treasury CFIUS', 'Commerce', 'Congress'],
    hub: { city: 'Washington, DC', lat: 38.8977, lng: -77.0365 },
    urls: [
      ['CFIUS Treasury', 'https://home.treasury.gov/policy-issues/international/the-committee-on-foreign-investment-in-the-united-states-cfius', 'CFIUS process primary'],
      ['Treasury', 'https://home.treasury.gov/', 'Department materials'],
      ['Congress.gov', 'https://www.congress.gov/', 'Investment screening legislation'],
      ['GAO', 'https://www.gao.gov/', 'CFIUS process reviews'],
      ['Commerce BIS', 'https://www.bis.doc.gov/', 'Export control adjacent'],
    ],
    claims: [
      [1, 'primary', 'Treasury publishes CFIUS process materials affecting covered transactions.', 'cfius,treasury'],
      [1, 'secondary', 'Filing timelines and mitigation agreements change deal certainty and counsel spend.', 'mitigation,cost'],
      [0, 'secondary', 'All minority VC rounds from allied funds are identically covered.', 'coverage'],
      [0, 'derived', 'Mitigation always blocks technology collaboration entirely.', 'mitigation'],
      [-1, 'assumption', 'Parties can ignore covered-transaction analysis if the target is small.', 'small target'],
      [-1, 'assumption', 'Closed CFIUS deliberations can be reconstructed from rumors as fact.', 'rumor'],
    ],
  },
  {
    id: 'cong-12-digital-assets',
    short: 'Digital Assets',
    title: 'Digital assets and market structure',
    industry: 'exchanges, custodians, issuers, broker-dealers exploring crypto rails',
    agencies: ['SEC', 'CFTC', 'Congress', 'Treasury'],
    hub: { city: 'Washington, DC', lat: 38.892, lng: -77.0235 },
    urls: [
      ['SEC', 'https://www.sec.gov/', 'Securities market structure and crypto statements'],
      ['CFTC', 'https://www.cftc.gov/', 'Commodities derivatives oversight'],
      ['Congress.gov', 'https://www.congress.gov/', 'Market structure bills'],
      ['Treasury', 'https://home.treasury.gov/', 'Illicit finance and policy'],
      ['GAO', 'https://www.gao.gov/', 'Digital asset program reviews'],
    ],
    claims: [
      [1, 'primary', 'SEC and CFTC plus Congress publish market-structure materials affecting token platforms.', 'sec,cftc'],
      [1, 'secondary', 'Custody, disclosure, and registration paths drive industry compliance architecture.', 'custody,registration'],
      [0, 'secondary', 'A single market-structure bill settles all security versus commodity classifications permanently.', 'classification'],
      [0, 'derived', 'Retail loss statistics from one exchange generalize to all venues.', 'retail'],
      [-1, 'assumption', 'Token marketing claims replace registration analysis.', 'marketing'],
      [-1, 'assumption', 'On-chain transfers need no AML program if software is open-source.', 'aml'],
    ],
  },
  {
    id: 'cong-13-fintech-consumer',
    short: 'Fintech CFPB',
    title: 'Fintech and consumer financial protection',
    industry: 'fintech lenders, payment apps, banks partnering with fintechs',
    agencies: ['CFPB', 'Federal Reserve', 'OCC', 'Congress'],
    hub: { city: 'Washington, DC', lat: 38.899, lng: -77.031 },
    urls: [
      ['CFPB', 'https://www.consumerfinance.gov/', 'Consumer financial protection rules'],
      ['Federal Reserve', 'https://www.federalreserve.gov/', 'Payment system and banking context'],
      ['Congress.gov', 'https://www.congress.gov/', 'Fintech and consumer finance bills'],
      ['GAO', 'https://www.gao.gov/', 'Fintech oversight reviews'],
      ['OCC', 'https://www.occ.gov/', 'Bank charter and fintech partnerships public materials'],
    ],
    claims: [
      [1, 'primary', 'CFPB publishes rules and enforcement that set compliance baselines for consumer fintech.', 'cfpb,rule'],
      [1, 'secondary', 'Bank-fintech partnerships reallocate compliance and reputational risk via contracts.', 'partnership'],
      [0, 'secondary', 'Open banking mandates have identical cost for all asset sizes.', 'open banking'],
      [0, 'derived', 'APR comparisons alone capture total consumer cost of credit products.', 'apr'],
      [-1, 'assumption', 'App UI design is outside unfair or deceptive scrutiny.', 'ui'],
      [-1, 'assumption', 'Viral complaint threads replace complaint database primary.', 'complaints'],
    ],
  },
  {
    id: 'cong-14-chips-semiconductor',
    short: 'CHIPS Semi',
    title: 'Semiconductor incentives and CHIPS implementation',
    industry: 'fabs, equipment suppliers, OSATs, materials vendors',
    agencies: ['Commerce NIST CHIPS', 'Congress', 'DoD industrial base'],
    hub: { city: 'Washington, DC', lat: 38.905, lng: -77.008 },
    urls: [
      ['NIST CHIPS', 'https://www.nist.gov/chips', 'CHIPS program implementation'],
      ['Commerce', 'https://www.commerce.gov/', 'Department industrial policy'],
      ['Congress.gov', 'https://www.congress.gov/', 'CHIPS-related oversight'],
      ['GAO', 'https://www.gao.gov/', 'Semiconductor program reviews'],
      ['USGS', 'https://www.usgs.gov/', 'Materials inputs context'],
    ],
    claims: [
      [1, 'primary', 'NIST and Commerce publish CHIPS program notices affecting award compliance and guardrails.', 'chips,nist'],
      [1, 'secondary', 'Incentive guardrails shape site selection and partner diligence for fabs and suppliers.', 'guardrails'],
      [0, 'secondary', 'Every awarded fab will reach nameplate capacity on the original public timeline.', 'timeline'],
      [0, 'derived', 'Workforce constraints are identical across all U.S. regions.', 'workforce'],
      [-1, 'assumption', 'Award press releases equal verified construction milestones.', 'milestone'],
      [-1, 'assumption', 'Export control interfaces can be ignored by incentive recipients.', 'export'],
    ],
  },
  {
    id: 'cong-15-auto-av-safety',
    short: 'Auto AV Safety',
    title: 'Auto safety, AV, and NHTSA oversight',
    industry: 'OEMs, AV stack vendors, suppliers, fleet operators',
    agencies: ['NHTSA', 'DOT', 'Congress'],
    hub: { city: 'Washington, DC', lat: 38.875, lng: -77.017 },
    urls: [
      ['NHTSA', 'https://www.nhtsa.gov/', 'Vehicle safety and AV policy'],
      ['DOT', 'https://www.transportation.gov/', 'Department transportation policy'],
      ['Congress.gov', 'https://www.congress.gov/', 'AV and auto safety legislation'],
      ['GAO', 'https://www.gao.gov/', 'Vehicle safety program reviews'],
      ['NHTSA recalls', 'https://www.nhtsa.gov/recalls', 'Recall and defect primary'],
    ],
    claims: [
      [1, 'primary', 'NHTSA publishes defect, recall, and AV policy materials affecting OEM compliance.', 'nhtsa,recall'],
      [1, 'secondary', 'ADS reporting and safety cases change development cost and deployment geography.', 'ads,compliance'],
      [0, 'secondary', 'Miles-without-crash statistics alone prove citywide readiness.', 'miles'],
      [0, 'derived', 'Liability allocation among OEM, stack vendor, and fleet is uniform nationwide.', 'liability'],
      [-1, 'assumption', 'Dashcam social clips replace NHTSA investigation files.', 'social'],
      [-1, 'assumption', 'Safety drivers eliminate the need for system-level hazard analysis.', 'safety driver'],
    ],
  },
  {
    id: 'cong-16-aviation-cert',
    short: 'Aviation Cert',
    title: 'Aviation certification and OEM supply chain',
    industry: 'airframe OEMs, engine makers, tier suppliers, airlines',
    agencies: ['FAA', 'NTSB', 'Congress'],
    hub: { city: 'Washington, DC', lat: 38.8512, lng: -77.0402 },
    urls: [
      ['FAA', 'https://www.faa.gov/', 'Certification and safety primary'],
      ['NTSB', 'https://www.ntsb.gov/', 'Accident investigation public dockets'],
      ['Congress.gov', 'https://www.congress.gov/', 'Aviation oversight hearings'],
      ['GAO', 'https://www.gao.gov/', 'Aviation certification reviews'],
      ['FAA regulations', 'https://www.faa.gov/regulations_policies', 'Regulatory library'],
    ],
    claims: [
      [1, 'primary', 'FAA certification and airworthiness directive processes drive OEM and supplier cost.', 'faa,cert'],
      [1, 'secondary', 'Supply-chain quality escapes and certification lag affect delivery rates and aftermarket.', 'supply chain'],
      [0, 'secondary', 'Every airworthiness directive has identical cost impact across all operators.', 'ad'],
      [0, 'derived', 'Software change classification is trivial for all flight software.', 'software'],
      [-1, 'assumption', 'Social flight tracking proves root cause before NTSB or FAA findings.', 'social'],
      [-1, 'assumption', 'Suppliers can skip quality system evidence if the OEM is large.', 'quality'],
    ],
  },
  {
    id: 'cong-17-fda-pathways',
    short: 'FDA Pathways',
    title: 'FDA pathways — drugs and devices industry impact',
    industry: 'sponsors, CROs, device makers, generic and biosimilar firms',
    agencies: ['FDA', 'HHS', 'Congress'],
    hub: { city: 'Silver Spring / DC', lat: 38.996, lng: -77.028 },
    urls: [
      ['FDA', 'https://www.fda.gov/', 'Drug and device pathway primary'],
      ['FDA guidance', 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents', 'Guidance library'],
      ['Congress.gov', 'https://www.congress.gov/', 'FDA user fee and oversight bills'],
      ['GAO', 'https://www.gao.gov/', 'FDA program evaluations'],
      ['HHS', 'https://www.hhs.gov/', 'Department context'],
    ],
    claims: [
      [1, 'primary', 'FDA publishes pathway guidance and approval databases used for industry planning.', 'fda,guidance'],
      [1, 'secondary', 'User fees, trial design expectations, and CMC controls drive development capital intensity.', 'cmc,capital'],
      [0, 'secondary', 'Accelerated pathway always means lower total evidence burden for all products.', 'accelerated'],
      [0, 'derived', 'Device 510(k) predicates remove all clinical uncertainty.', '510k'],
      [-1, 'assumption', 'Press releases equal approval letters.', 'press'],
      [-1, 'assumption', 'Social patient anecdotes replace trial primary endpoints.', 'anecdote'],
    ],
  },
  {
    id: 'cong-18-climate-disclosure',
    short: 'Climate Disclosure',
    title: 'Climate and sustainability disclosure — issuer burden',
    industry: 'public issuers, auditors and assurance firms, ESG data vendors',
    agencies: ['SEC', 'EPA', 'Congress'],
    hub: { city: 'Washington, DC', lat: 38.8905, lng: -77.032 },
    urls: [
      ['SEC', 'https://www.sec.gov/', 'Disclosure rules and litigation updates'],
      ['EPA', 'https://www.epa.gov/', 'Emissions and environmental data programs'],
      ['Congress.gov', 'https://www.congress.gov/', 'Climate disclosure legislation'],
      ['GAO', 'https://www.gao.gov/', 'Climate risk and disclosure reviews'],
      ['CRS', 'https://crsreports.congress.gov/', 'Legislative analysis'],
    ],
    claims: [
      [1, 'primary', 'SEC and related agencies publish disclosure frameworks affecting issuer controls spend.', 'sec,disclosure'],
      [1, 'secondary', 'Scope measurement, assurance, and supplier data requests create industry cost cascades.', 'assurance,scope'],
      [0, 'secondary', 'All issuers face identical materiality thresholds regardless of sector.', 'materiality'],
      [0, 'derived', 'Litigation risk is fully priced in every industry peer multiple.', 'litigation'],
      [-1, 'assumption', 'Marketing ESG claims substitute for controlled disclosure processes.', 'marketing'],
      [-1, 'assumption', 'Private company supply chains never receive data requests from public customers.', 'supply chain'],
    ],
  },
  {
    id: 'cong-19-labor-platforms',
    short: 'Labor Platforms',
    title: 'Labor, platform work, and NLRB-shaped oversight',
    industry: 'platform work companies, franchise systems, staffing intermediaries',
    agencies: ['NLRB', 'DOL', 'Congress'],
    hub: { city: 'Washington, DC', lat: 38.897, lng: -77.0265 },
    urls: [
      ['NLRB', 'https://www.nlrb.gov/', 'Labor law decisions and resources'],
      ['DOL', 'https://www.dol.gov/', 'Wage and hour and classification context'],
      ['Congress.gov', 'https://www.congress.gov/', 'Platform work and labor bills'],
      ['GAO', 'https://www.gao.gov/', 'Contingent work reviews'],
      ['CRS', 'https://crsreports.congress.gov/', 'Labor policy analysis'],
    ],
    claims: [
      [1, 'primary', 'NLRB and DOL publish standards affecting classification and collective activity.', 'nlrb,classification'],
      [1, 'secondary', 'Reclassification risk changes benefits cost, control design, and contractor models.', 'benefits,cost'],
      [0, 'secondary', 'A single federal test will end all state classification divergence.', 'preemption'],
      [0, 'derived', 'Platform take-rates are a pure function of labor status alone.', 'take rate'],
      [-1, 'assumption', 'App ratings replace wage-and-hour primary records.', 'ratings'],
      [-1, 'assumption', 'Joint-employer exposure can be ignored in multi-sided contracts.', 'joint employer'],
    ],
  },
  {
    id: 'cong-20-small-business-capital',
    short: 'SB Capital',
    title: 'Small business investment and SBIC capital rules',
    industry: 'SBIC funds, community banks, small business borrowers, fund counsel',
    agencies: ['SBA', 'Treasury', 'Congress small business committees'],
    hub: { city: 'Washington, DC', lat: 38.8945, lng: -77.0148 },
    urls: [
      ['SBA', 'https://www.sba.gov/', 'SBIC and small business capital programs'],
      ['SBA SBIC', 'https://www.sba.gov/partners/sbics', 'SBIC partner / program materials'],
      ['Congress.gov SBIC', 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22SBIC%22%7D', 'SBIC and small business capital legislation search'],
      ['Treasury', 'https://home.treasury.gov/', 'Capital markets context'],
      ['GAO', 'https://www.gao.gov/', 'SBA program evaluations'],
    ],
    claims: [
      [1, 'primary', 'SBA publishes SBIC program rules affecting leverage and fund formation.', 'sba,sbic'],
      [1, 'secondary', 'Eligibility and compliance changes alter capital access for underserved markets and fund economics.', 'access,compliance'],
      [0, 'secondary', 'Program changes immediately equalize regional capital availability.', 'regional'],
      [0, 'derived', 'All small business credit gaps are identical across industries.', 'credit gap'],
      [-1, 'assumption', 'Fund marketing decks replace SBA licensing and exam primary.', 'marketing'],
      [-1, 'assumption', 'Leverage rules have no effect on LP appetite or portfolio construction.', 'leverage'],
    ],
  },
]

function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function claimBlock(claims, id) {
  return claims
    .map((c, i) => {
      const [score, material, statement, tags] = c
      const conf = score === 1 ? 'high' : score === -1 ? 'medium' : 'low'
      const notes =
        score === 1
          ? 'Public-record or secondary industry effect anchor for training desk.'
          : score === -1
            ? 'Disqualifying training claim — do not promote without primary overturn.'
            : 'Contested — needs further primary before promotion.'
      const tagLit = tags
        .split(',')
        .map((t) => `'${t.trim()}'`)
        .join(', ')
      return `    claim(
      '${id}-c${i + 1}',
      '${esc(statement)}',
      ${score},
      '${material}',
      '${esc(notes)}',
      [${tagLit}],
      '${conf}',
    )`
    })
    .join(',\n')
}

// ——— congressDesks.ts ———
let desksTs = `/**
 * 20 congressional / industry-effect investigation desks — NEXOSxLPIN 1.2.0
 * Training desks only: public-record oriented, not legal advice, no PII.
 */

import type { EvidenceScore, MaterialClass } from '../../types/core'
import type { PaneId, PaneWeight, UseCaseProfile, UseCaseReport } from '../../types/useCase'

const AS_OF = '${AS_OF}'

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

const CONG_ON: PaneId[] = [
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
    \`# \${report.headline}\`,
    '',
    \`**As of:** \${report.asOf} · **Trend signal:** \${report.trendSignal}\`,
    '',
    '## Executive summary',
    '',
    report.executiveSummary,
    '',
    '## Scored claims',
    '',
    ...report.claims.map(
      (c) =>
        \`- **[\${c.score === 1 ? '+1' : c.score === -1 ? '−1' : '0'}]** \${c.statement}\\n  - _\${c.material} · \${c.confidence}_ — \${c.notes}\`,
    ),
    '',
    '## Timeline',
    '',
    ...report.timeline.map((t) => \`- **\${t.when}** — \${t.what}\`),
    '',
    '## Open questions',
    '',
    ...report.openQuestions.map((q) => \`- \${q}\`),
    '',
    '## Verification playbook',
    '',
    ...report.verificationPlaybook.map((s, i) => \`\${i + 1}. \${s}\`),
    '',
    '## Sources to seek',
    '',
    ...report.sourcesToSeek.map((s) => \`- \${s}\`),
    '',
    '## Noise / risk',
    '',
    ...report.noiseRisks.map((s) => \`- \${s}\`),
    '',
    report.geographicNotes ? \`## Geography\\n\\n\${report.geographicNotes}\\n\` : '',
    report.bodyExtra ?? '',
    '',
    '_Nexus congressional training desk · industry-effect focus · Layer-0 export only · not legal advice._',
    '',
  ]
  return lines.filter((l) => l !== undefined).join('\\n')
}

function report(r: Omit<UseCaseReport, 'fullBriefMarkdown'> & { bodyExtra?: string }): UseCaseReport {
  const { bodyExtra, ...rest } = r
  return {
    ...rest,
    fullBriefMarkdown: md({ ...rest, bodyExtra }),
  }
}

function congPanes() {
  return panes(
    ['sme-lenses', 'research-hub', 'atlas', 'analyst', 'export-kit'],
    [
      { pane: 'sme-lenses', weight: 5, minPx: 280, pinned: true },
      { pane: 'research-hub', weight: 4, minPx: 260 },
      { pane: 'atlas', weight: 3, minPx: 360 },
      { pane: 'analyst', weight: 3, minPx: 200 },
      { pane: 'export-kit', weight: 2, minPx: 200 },
    ],
    CONG_ON.filter((p) => !['sme-lenses', 'research-hub', 'atlas', 'analyst', 'export-kit'].includes(p)),
    'research-first',
  )
}

`

const profileParts = []
for (let i = 0; i < desks.length; i++) {
  const d = desks[i]
  const constName = 'R_' + d.id.replace(/-/g, '_').toUpperCase()
  const rank = 11 + i
  const exec = `This training desk examines industry and private-sector effects of congressional and agency oversight on ${d.industry}. Operators score public-record claims about compliance cost, market structure, liability, supply chain, and capital access — not partisan outcomes. Agency anchors include ${d.agencies.join(', ')}. Scores are operator judgments for verification hygiene; they are not legal conclusions or investment advice.`
  const headline = `${d.title} — industry-effect investigation desk`
  const trend = `Congressional / agency oversight cycle · ${d.short} · industry compliance and market structure`
  const pinLat = d.hub.lat + (i % 5) * 0.004
  const pinLng = d.hub.lng - (i % 4) * 0.005

  desksTs += `
const ${constName} = report({
  asOf: AS_OF,
  trendSignal: '${esc(trend)}',
  headline: '${esc(headline)}',
  executiveSummary:
    '${esc(exec)}',
  claims: [
${claimBlock(d.claims, d.id)}
  ],
  timeline: [
    { when: 'Ongoing', what: 'Committee hearings and agency dockets update industry compliance expectations.' },
    { when: 'Session cycle', what: 'Bill text and markups create optionality for compliance programs and capital plans.' },
    { when: 'Rule / guidance windows', what: 'Comment periods and effective dates set implementation spend timing.' },
    { when: 'Enforcement / GAO reviews', what: 'Public findings recalibrate residual risk for operators and counterparties.' },
    { when: 'As of ${AS_OF}', what: 'Desk freeze for training pack 1.2.0 — re-verify live URLs before export.' },
  ],
  openQuestions: [
    'Which bill sections or rule paragraphs are load-bearing for industry cost?',
    'What primary filing or docket entry corroborates the market-structure claim?',
    'How do compliance timelines interact with capital expenditure cycles?',
    'Which counterparties (insurers, lenders, suppliers) reprice first?',
    'What would falsify the highest-confidence +1 on this desk?',
  ],
  verificationPlaybook: [
    'Pull Congress.gov bill text / committee report before scoring statutory claims.',
    'Prefer agency final rules, guidance, and dockets over secondary commentary.',
    'Map industry effect (cost, liability, access) separately from political narrative.',
    'Tag material class; demote social-only +1 to 0.',
    'Run SME lenses (governance + technical) before export.',
  ],
  sourcesToSeek: [
    'Congress.gov bill and hearing pages for this topic',
    '${esc(d.agencies[0])} primary materials',
    'GAO evaluations touching this industry effect',
    'CRS reports for legislative history',
    'Company or trade association public comment letters (secondary)',
  ],
  noiseRisks: [
    'Partisan framing that skips compliance cost evidence',
    'Stock-promotion or activism content treated as primary',
    'Out-of-date bill numbers after reintroduction',
    'OPSEC overreach into non-public investigations',
  ],
  geographicNotes: 'Primary map pin: Capitol region / ${esc(d.hub.city)} with slight jitter for multi-desk atlas. Industry effects are national unless a claim names a facility.',
  bodyExtra: '### Industry effect focus\\n\\nTrack compliance cost, liability, market structure, supply chain, and capital access for ${esc(d.industry)}.',
})
`

  profileParts.push(`  {
    id: '${d.id}',
    trendRank: ${rank},
    label: 'Ⓒ ${esc(d.short)}',
    tagline: ${constName}.headline,
    family: 'congressional',
    description: ${constName}.executiveSummary,
    workflow: ${constName}.verificationPlaybook.slice(0, 4),
    sampleClaimHints: ${constName}.claims.map(
      (c) => \`\${c.score === 1 ? '+1' : c.score === -1 ? '−1' : '0'}: \${c.statement}\`,
    ),
    report: ${constName},
    mapPin: {
      useCaseId: '${d.id}',
      label: '${esc(d.short)} · Capitol region',
      shortLabel: '${esc(d.short)}',
      lat: ${pinLat.toFixed(4)},
      lng: ${pinLng.toFixed(4)},
      kind: 'oversight-desk',
      score: 0 as const,
      cityHint: '${esc(d.hub.city)}',
    },
    ...congPanes(),
  }`)
}

desksTs += `
export const CONGRESS_DESK_PROFILES: UseCaseProfile[] = [
${profileParts.join(',\n')}
]

export const CONGRESS_DESK_IDS = CONGRESS_DESK_PROFILES.map((p) => p.id)

if (CONGRESS_DESK_PROFILES.length !== 20) {
  throw new Error(\`Expected 20 congressional desks, got \${CONGRESS_DESK_PROFILES.length}\`)
}
`

writeFileSync(join(root, 'src/data/useCases/congressDesks.ts'), desksTs)

// Sources
let src = `/**
 * Active sources for 20 congressional industry-effect desks.
 * Prefer stable official URLs (Congress, GAO, CRS, agencies).
 */

import type { ActiveSource } from '../../types/useCase'

function s(
  id: string,
  title: string,
  url: string,
  why: string,
  kind: ActiveSource['kind'],
  publisher?: string,
  publicRecord = false,
  tags: string[] = [],
): ActiveSource {
  return { id, title, url, why, kind, publisher, publicRecord, tags }
}

export const CONGRESS_SOURCES_BY_DESK: Record<string, ActiveSource[]> = {
`

for (const d of desks) {
  src += `  '${d.id}': [\n`
  d.urls.forEach((u, i) => {
    const [title, url, why] = u
    src += `    s(
      '${d.id}-src-${i + 1}',
      '${esc(title)}',
      '${url}',
      '${esc(why)}',
      'official',
      '${esc(title.split(' ')[0])}',
      true,
      ['congressional', 'industry-effect'],
    ),\n`
  })
  src += `  ],\n`
}
src += `}
`
writeFileSync(join(root, 'src/data/useCases/congressSources.ts'), src)

// Stories
let stories = `/**
 * Plain-language stories for congressional industry-effect desks.
 */

import type { InvestigationStory } from './stories'
import type { EvidenceScore } from '../../types/core'

function statusFromScore(score: EvidenceScore): 'supported' | 'uncertain' | 'disputed' {
  if (score === 1) return 'supported'
  if (score === -1) return 'disputed'
  return 'uncertain'
}

export const CONGRESS_STORIES: Record<string, InvestigationStory> = {
`

for (const d of desks) {
  const claims = d.claims
    .slice(0, 4)
    .map((c) => {
      const [score, , statement] = c
      return `      {
        plain: '${esc(statement.slice(0, 160))}',
        status: statusFromScore(${score} as EvidenceScore),
        score: ${score} as EvidenceScore,
        why: 'Training desk claim — verify against official sources before export.',
      }`
    })
    .join(',\n')
  stories += `  '${d.id}': {
    useCaseId: '${d.id}',
    title: '${esc(d.title)}',
    where: '${esc(d.hub.city)} · national industry effects',
    lede:
      'This desk is a training investigation into how oversight and potential rules affect ${esc(d.industry)}. It is not legal advice. Use official Congress, agency, GAO, and CRS materials to score compliance cost, market structure, liability, and capital access.',
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
${claims}
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
`
}
stories += `}
`
writeFileSync(join(root, 'src/data/useCases/congressStories.ts'), stories)

// Simulations
const sims = `/**
 * Minimal investigation simulations for congressional desks.
 */

import type {
  ActiveConditions,
  EvidenceItem,
  EvidenceScore,
  GraphEdge,
  GraphNode,
  MaterialClass,
  ResearchNote,
  SpatialPoint,
  WorkingDocEntry,
} from '../../types/core'
import { emptyLadder, uid } from '../../types/core'
import type { ActiveSource } from '../../types/useCase'
import type { InvestigationSimulation } from './simulations'
import { CONGRESS_DESK_PROFILES } from './congressDesks'
import { CONGRESS_SOURCES_BY_DESK } from './congressSources'
import { SHARED_VERIFY_TOOLS } from './activeSources'

const NOW = () => new Date().toISOString()

function ev(
  title: string,
  summary: string,
  score: EvidenceScore,
  tags: string[],
  material: MaterialClass = score === 1 ? 'primary' : score === -1 ? 'assumption' : 'secondary',
): EvidenceItem {
  return {
    id: uid('ev'),
    title,
    summary,
    score,
    confidence: score === 1 ? 'high' : score === -1 ? 'medium' : 'low',
    material,
    tags: ['congressional', 'simulation', ...tags],
    sourceRefs: ['sim-cong'],
    createdAt: NOW(),
    moduleId: 'research-hub',
  }
}

function cond(notes: string): ActiveConditions {
  return {
    matrixId: 'matrix-alpha',
    selections: {
      jurisdiction: 'j-01',
      'device-type': 'dev-a',
      'site-class': 'site-open',
      'power-path': 'pwr-grid',
      clearance: 'clr-std',
    },
    notes,
    updatedAt: NOW(),
  }
}

export function buildCongressSimulations(): InvestigationSimulation[] {
  return CONGRESS_DESK_PROFILES.map((p) => {
    const pin = p.mapPin!
    const report = p.report!
    const deskSources = CONGRESS_SOURCES_BY_DESK[p.id] ?? []
    const sources: ActiveSource[] = []
    const seen = new Set<string>()
    for (const src of [...deskSources, ...SHARED_VERIFY_TOOLS]) {
      if (seen.has(src.id)) continue
      seen.add(src.id)
      sources.push(src)
    }
    const evidence = report.claims.map((c) =>
      ev(c.statement.slice(0, 120), c.notes, c.score, c.tags, c.material),
    )
    const scenePoints: SpatialPoint[] = [
      {
        id: \`\${p.id}-capitol\`,
        label: pin.label,
        lat: pin.lat,
        lng: pin.lng,
        kind: 'oversight',
        score: 0,
        tags: ['congressional'],
      },
    ]
    const graphNodes: GraphNode[] = [
      { id: 'n-congress', label: 'Congress / bill text', kind: 'control', score: 1 },
      { id: 'n-agency', label: 'Agency docket', kind: 'control', score: 1 },
      { id: 'n-industry', label: 'Industry effect', kind: 'stage', score: 0 },
      { id: 'n-noise', label: 'Narrative noise', kind: 'risk', score: -1 },
      { id: 'n-export', label: 'Export gate', kind: 'control', score: 0 },
    ]
    const graphEdges: GraphEdge[] = [
      { id: 'e1', source: 'n-congress', target: 'n-industry', label: 'compliance cost' },
      { id: 'e2', source: 'n-agency', target: 'n-industry', label: 'rule effect' },
      { id: 'e3', source: 'n-noise', target: 'n-export', label: 'block', score: -1 },
      { id: 'e4', source: 'n-industry', target: 'n-export', label: 'clear if scored', score: 1 },
    ]
    const researchNotes: ResearchNote[] = [
      {
        id: uid('rn'),
        title: \`Desk brief · \${p.label}\`,
        body: report.executiveSummary,
        score: 0,
        material: 'secondary',
        tags: ['congressional', p.id],
        createdAt: NOW(),
        updatedAt: NOW(),
      },
    ]
    const wdEntries: Array<Omit<WorkingDocEntry, 'id' | 'at'> & { at?: string }> = [
      {
        kind: 'decision',
        title: 'Congressional training desk loaded',
        body: \`\${p.id} · industry-effect focus · not legal advice\`,
        score: 1,
        moduleId: 'research-hub',
      },
    ]
    const baseLadder = emptyLadder(1)
    baseLadder.unlocked = true
    baseLadder.current = 1
    return {
      useCaseId: p.id,
      mapPin: pin,
      scenePoints,
      graphNodes,
      graphEdges,
      conditions: cond(\`Congressional desk \${p.id}: score industry effects with official sources.\`),
      evidence,
      researchNotes,
      ladder: baseLadder,
      wdEntries,
      analystLog: [
        \`Congressional desk \${pin.shortLabel} loaded.\`,
        '› Prefer congress.gov / agency / GAO primary',
        '› sme list · sme tech · sme select <id> · sme run',
        'Training desk — not legal advice; no PII.',
      ],
      designNotes: 'Compliance burden / liability / market access axes for industry-effect modeling.',
      forgeAssetType: 'cabinet-node-b',
      forgeName: 'Oversight Filing Node',
      forgeDescription: 'Lightweight cabinet stand-in for docket / filing metaphor.',
      sessionMode: 'analyze' as const,
      sources,
    }
  })
}
`

writeFileSync(join(root, 'src/data/useCases/congressSimulations.ts'), sims)

console.log('OK: 20 desks written')
console.log('ids:', desks.map((d) => d.id).join(', '))
