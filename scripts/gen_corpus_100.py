# -*- coding: utf-8 -*-
"""Generate storyCorpus100.ts — 33 desks (10 geo + 23 topical) to reach 100 total."""
from __future__ import annotations
import json
from pathlib import Path

ROOT = Path(r"C:\NEXOSxLPIN")
OUT = ROOT / "src" / "data" / "useCases" / "storyCorpus100.ts"

def C(plain, score, why):
    return {"plain": plain, "score": score, "why": why}

def S(title, url, why, publisher):
    return {"title": title, "url": url, "why": why, "publisher": publisher}

def seed(**kw):
    return kw

SEEDS = []

# ─── 10 GEOPOLITICAL (detailed) ───
SEEDS += [
seed(id="geo-01-scs-collision", topic="geopolitical", subtopic="maritime-asia", rank=101, short="SCS collision",
    title="South China Sea — vessel collision claims and primary-record hygiene",
    where="Spratly approaches / contested EEZ lanes", lat=10.72, lng=115.82,
    lede="Viral clips allege deliberate ramming between a coast-guard cutter and a resupply craft in contested South China Sea waters. Multi-language accounts disagree on who initiated contact, whether water cannon preceded impact, and whether anyone was injured. Train operators to separate AIS tracks, official statements, and geolocated stills from nationalist dubbing and recycled footage.",
    stakes="Mis-attributed collision narratives can escalate patrol postures, insurance premiums for commercial traffic, and domestic pressure for force-protection ROE changes.",
    known=["Competing coast-guard and fishing-militia narratives appear within hours of hard contact in the Spratlys.","Open AIS can place hull classes near a scene even when flags are spoofed or AIS is dark.","Primary hierarchy: maritime authority releases, wire with named officers, geolocated original video, then commentary."],
    open=["Exact lat/long of impact and AIS status of hulls?","Is circulating video continuous or cut from two incidents?","Any independent third-flag witness?"],
    claims=[C("Hard-contact incidents between state-linked vessels and resupply craft have occurred repeatedly in SCS patrol zones in recent years.",1,"Multi-year open reporting pattern; specific new incident still needs primary lock."),C("A single social video alone proves intentional ramming and legal fault under UNCLOS.",-1,"Intent and legal fault require investigation."),C("Water-cannon use immediately before contact is established for this specific event.",0,"Often alleged; needs continuous footage or official log."),C("Casualty counts on messenger apps should default to 0 until named medical or SAR sources appear.",1,"Method hygiene for conflict fog."),C("Commercial shipping risk premia can move on credible corridor disruption claims before fault is settled.",1,"Insurance is forward-looking; not proof of fault.")],
    sources=[S("IMO","https://www.imo.org/","Maritime safety frameworks","IMO"),S("MarineTraffic","https://www.marinetraffic.com/","AIS placement starting point","MarineTraffic"),S("UNCLOS text","https://www.un.org/depts/los/convention_agreements/texts/unclos/unclos_e.pdf","Treaty text","UN"),S("USNI News","https://news.usni.org/","Naval open reporting","USNI")],
    agency="Maritime authority releases", agencyUrl="https://www.imo.org/", tags=["scs","maritime","collision","ais","geopolitical"]),
seed(id="geo-02-sahel-junta", topic="geopolitical", subtopic="west-africa-security", rank=102, short="Sahel junta",
    title="Sahel security realignment — junta statements vs independent casualty claims",
    where="Central Sahel corridor (multi-state)", lat=13.51, lng=2.11,
    lede="After successive coups, Sahel juntas issue victory and partnership statements while NGOs and local reporters publish conflicting civilian-harm tallies. Separate decree text, AU/ECOWAS communiques, and named-field reporting from influencer war maps that invent unit designations.",
    stakes="False victory or atrocity claims can freeze humanitarian access negotiations and misdirect diaspora fundraising.",
    known=["Junta media systems tightly control official combat narratives.","Independent tallies lag and use different civilian definitions.","Foreign partner presence claims need MoU or basing evidence."],
    open=["Which casualty methodology is cited?","Are place names consistent with road networks?","Dual-sourced continuous video?"],
    claims=[C("Multiple Sahel states experienced unconstitutional changes of government in the early-mid 2020s, altering security partnerships.",1,"Documented political fact pattern."),C("A single Telegram map proves control of a named district today.",-1,"Maps without methodology are narrative products."),C("Civilian harm claims require named organization methodology and date range before +1.",1,"Method gate for atrocity tallies."),C("Foreign trainer presence is confirmed for every junta statement naming a partner.",0,"Needs basing or contract primary.")],
    sources=[S("AU Peace & Security","https://www.peaceau.org/","Regional communiques","AU"),S("UN OCHA","https://www.unocha.org/","Humanitarian reporting","OCHA"),S("ACLED","https://acleddata.com/","Event data methods","ACLED"),S("ECOWAS","https://www.ecowas.int/","Regional statements","ECOWAS")],
    agency="AU / OCHA", agencyUrl="https://www.unocha.org/", tags=["sahel","junta","civilian-harm","geopolitical"]),
seed(id="geo-03-red-sea-shipping", topic="geopolitical", subtopic="maritime-mideast", rank=103, short="Red Sea shipping",
    title="Red Sea corridor risk — attack claims, AIS dark, and insurer notices",
    where="Bab el-Mandeb / southern Red Sea", lat=12.58, lng=43.34,
    lede="Ship attack and diversion claims move markets overnight. Force primary hierarchy: company and flag-state notices, navy incident releases, AIS gaps — not anonymous missile cams with wrong coastlines.",
    stakes="False attack reports divert fleets, spike freight rates, and pressure escort coalitions.",
    known=["Commercial operators publish advisories when risk thresholds change.","AIS gaps have multiple causes.","Kinetic claims need time-place-hull consistency."],
    open=["Named hull and flag?","Which navy acknowledged?","Clip geolocated to stated basin?"],
    claims=[C("Southern Red Sea / Bab el-Mandeb has been a high-risk commercial corridor during regional conflict spikes.",1,"Industry and government advisories converge."),C("Every viral explosion video over water is a confirmed anti-ship missile strike on a named tanker today.",-1,"Provenance and identification required."),C("Freight and war-risk premium moves evidence market perception, not legal attribution of a specific actor.",1,"Separate market reaction from fault."),C("Coalition escort presence for a given week is established by official task-force releases only.",0,"Presence varies; cite the release.")],
    sources=[S("UKMTO","https://www.ukmto.org/","Maritime trade reporting","UKMTO"),S("US MARAD","https://www.maritime.dot.gov/","Advisory channel","MARAD"),S("IMO","https://www.imo.org/","Maritime security","IMO"),S("Reuters markets","https://www.reuters.com/markets/","Wire routing coverage","Reuters")],
    agency="UKMTO / MARAD", agencyUrl="https://www.ukmto.org/", tags=["red-sea","shipping","ais","war-risk","geopolitical"]),
seed(id="geo-04-taiwan-strait", topic="geopolitical", subtopic="indo-pacific", rank=104, short="Taiwan Strait",
    title="Taiwan Strait — drill notices, ADIZ tracks, and invasion-meme hygiene",
    where="Taiwan Strait median approaches", lat=24.5, lng=119.5,
    lede="PLA drill announcements and Taiwan MoD track reports create screenshot fog. Separate NOTAMs, MoD daily updates, and reputable defense open-source from D-Day-tomorrow meme calendars.",
    stakes="False invasion clocks move markets, fuel hate targeting, and degrade civil-defense readiness messaging.",
    known=["Taiwan MoD publishes activity summaries during tension spikes.","NOTAMs and maritime danger areas are primary for exercise boxes.","Amphibious invasion logistics claims need force-structure literacy."],
    open=["Which NOTAM numbers apply?","Is the track screenshot from a different day?","Commercial satellite tasking notes?"],
    claims=[C("Cross-strait military activity spikes are publicly reported by Taiwan authorities during major PLA exercises.",1,"Recurring MoD reporting pattern."),C("A viral countdown graphic is evidence of an imminent full-scale invasion date.",-1,"Memes are not operational orders."),C("Exercise danger areas can be cross-checked via aviation/maritime notices when published.",1,"NOTAM method."),C("Sortie counts on social cards match official tallies without citation.",0,"Hold until MoD table cited.")],
    sources=[S("Taiwan MND","https://www.mnd.gov.tw/","Official activity releases","MND"),S("FAA (NOTAM literacy)","https://www.faa.gov/","Aviation notice literacy","FAA"),S("CSIS China Power","https://chinapower.csis.org/","Structured open analysis","CSIS"),S("IISS","https://www.iiss.org/","Defense analysis standards","IISS")],
    agency="Taiwan MoD / NOTAMs", agencyUrl="https://www.mnd.gov.tw/", tags=["taiwan","strait","drills","adiz","geopolitical"]),
seed(id="geo-05-arctic-dual-use", topic="geopolitical", subtopic="arctic-routes", rank=105, short="Arctic dual-use",
    title="Arctic sea lanes — dual-use basing claims and commercial ice data",
    where="Northern Sea Route approaches", lat=71.2, lng=72.5,
    lede="Arctic militarization posts mix commercial ice charts, dual-use port investments, and genuine military infrastructure. Bind basing claims to ministry primary or satellite-derived analysis with stated methods.",
    stakes="Overstated basing distorts alliance debates; understated basing misses dual-use logistics realities.",
    known=["Sea-ice extent products are scientific primary for navigability seasons.","Port dual-use is a policy judgment needing facility-level evidence.","National Arctic strategies state intent, not completed basing."],
    open=["Named facility and coordinates?","Civilian vs military berth evidence?","Ice-season product vintage?"],
    claims=[C("Arctic navigability windows are constrained by seasonal ice; open products track multi-year change.",1,"NSIDC-class products."),C("Every new Arctic port photo is a secret naval base.",-1,"Dual-use needs facility evidence."),C("Declared national Arctic strategies should be cited when claiming strategy shifts.",1,"Strategy documents are primary for intent."),C("Year-round container service on the NSR is routine for all vessel classes.",0,"Seasonal and class-dependent.")],
    sources=[S("NSIDC","https://nsidc.org/","Ice extent science","NSIDC"),S("Arctic Council","https://arctic-council.org/","Governance forum","Arctic Council"),S("IMO polar","https://www.imo.org/","Polar shipping rules","IMO"),S("USGS","https://www.usgs.gov/","Geoscience context","USGS")],
    agency="NSIDC / Arctic Council", agencyUrl="https://nsidc.org/", tags=["arctic","dual-use","shipping","ice","geopolitical"]),
seed(id="geo-06-balkans-border", topic="geopolitical", subtopic="europe-balkans", rank=106, short="Balkans flashpoint",
    title="Western Balkans border flashpoint — municipal decrees vs clash videos",
    where="Northern Kosovo / border municipalities (training geo)", lat=42.89, lng=20.87,
    lede="Local decree fights, license-plate rules, and roadblock videos reheat faster than diplomatic statements. Lock municipal and KFOR/EULEX statements before scoring war-restart claims.",
    stakes="Inflated clash narratives trigger diaspora mobilization and mis-rank civilian risk.",
    known=["License-plate and municipal disputes have multi-year history.","International mission statements are primary for force posture.","Roadblock videos need continuous capture and location locks."],
    open=["Which decree is operative today?","Injuries confirmed by medical sources?","Is the video from this week?"],
    claims=[C("Northern border municipalities have seen recurring disputes over administrative control and symbols.",1,"Multi-year open record."),C("A single clash clip proves general war has restarted across the Balkans.",-1,"Scope inflation."),C("KFOR/EULEX posture changes should be taken from mission releases.",1,"Mission primary."),C("Casualty figures on partisan channels match hospital logs.",0,"Hold for medical primary.")],
    sources=[S("KFOR","https://jfcnaples.nato.int/kfor","Mission posture","NATO KFOR"),S("EULEX","https://www.eulex-kosovo.eu/","Rule-of-law mission","EULEX"),S("UNMIK","https://unmik.unmissions.org/","UN mission context","UN"),S("EEAS","https://www.eeas.europa.eu/","EU diplomatic statements","EEAS")],
    agency="KFOR / EULEX", agencyUrl="https://jfcnaples.nato.int/kfor", tags=["balkans","border","kfor","geopolitical"]),
seed(id="geo-07-caucasus-corridor", topic="geopolitical", subtopic="caucasus", rank=107, short="Caucasus corridor",
    title="South Caucasus corridor deals — treaty text vs victory broadcasts",
    where="South Caucasus transit corridors", lat=40.18, lng=44.51,
    lede="Corridor access deals are announced with maximalist language. Enforce treaty/MOU text over parade rhetoric; check whether open corridor means customs regime, peacekeeping, or road repair.",
    stakes="Misread corridor status misprices logistics bets and inflames displacement fears.",
    known=["Ceasefire and delimitation texts are primary for territorial claims.","Road opening can mean temporary humanitarian access only.","Third-party monitoring language matters for enforcement claims."],
    open=["Signed vs initialed instrument?","Customs sovereignty terms?","Monitoring mechanism named?"],
    claims=[C("Corridor and transit arrangements are defined by specific instruments, not slogans.",1,"Legal-text method gate."),C("A parade speech rewrites an international boundary.",-1,"Speech is not a treaty."),C("Humanitarian access windows may be time-limited even when roads are physically open.",1,"Access vs sovereignty."),C("All displaced persons have returned under the latest announcement.",0,"Needs UNHCR-class data.")],
    sources=[S("UN Peacemaker","https://peacemaker.un.org/","Agreement patterns","UN"),S("OSCE","https://www.osce.org/","Regional security forum","OSCE"),S("UNHCR","https://www.unhcr.org/","Displacement data","UNHCR"),S("World Bank","https://www.worldbank.org/","Corridor economics","World Bank")],
    agency="OSCE / UNHCR", agencyUrl="https://www.osce.org/", tags=["caucasus","corridor","treaty","geopolitical"]),
seed(id="geo-08-dprk-launch", topic="geopolitical", subtopic="northeast-asia", rank=108, short="DPRK launch",
    title="Korean peninsula — launch notices, debris claims, and early-warning hygiene",
    where="Sea of Japan / East Sea ranges", lat=39.0, lng=128.0,
    lede="Missile claims arrive as alerts, ministry posts, and crater photos of uncertain provenance. Prioritize Japanese, ROK, and US Indo-Pacific releases before scoring range, warhead, or failure narratives.",
    stakes="False warhead claims panic publics; missed real launches undermine warning literacy.",
    known=["ROK JCS and Japan MoD often issue rapid launch notices.","Apogee/range numbers on social cards invent precision.","Debris photos need geolocation and time-of-day checks."],
    open=["Which ministry first acknowledged?","Trajectory parameters cited from where?","Debris photos original?"],
    claims=[C("ROK and Japanese authorities publicly report many DPRK projectile launches in near-real time.",1,"Recurring official notice pattern."),C("A social graphic with exact MIRV count is authoritative without ministry sourcing.",-1,"Invented precision."),C("Civil alert systems firing is evidence of official risk communication, not of city impact.",1,"Separate alert from impact."),C("Failure vs success is settled within minutes on messenger channels.",0,"Needs technical assessment primary.")],
    sources=[S("ROK MND","https://www.mnd.go.kr/","Launch notices","ROK MND"),S("Japan MoD","https://www.mod.go.jp/","Japan official releases","Japan MoD"),S("US INDOPACOM","https://www.pacom.mil/","US theater statements","INDOPACOM"),S("UN Security Council","https://www.un.org/securitycouncil/","Resolutions context","UNSC")],
    agency="ROK JCS / Japan MoD", agencyUrl="https://www.mod.go.jp/", tags=["dprk","missile","early-warning","geopolitical"]),
seed(id="geo-09-gl-minerals", topic="geopolitical", subtopic="great-lakes-africa", rank=109, short="Conflict minerals",
    title="Great Lakes conflict minerals — supply-chain claims vs mine-site verification",
    where="Eastern DRC mineral corridors (training geo)", lat=-1.68, lng=29.22,
    lede="Armed-group tax and blood mineral claims move ESG and sanctions debates. Require mine-to-export chain evidence, OECD due-diligence language, and named smelter audits — not map aesthetics.",
    stakes="False linkage can destroy legitimate artisanal livelihoods; missed linkage can fund armed actors.",
    known=["OECD due-diligence guidance is the method spine.","Tagging schemes are partial, not perfect.","Armed control of roads can matter as much as pit ownership."],
    open=["Which 3TG mineral and site?","Audit date and auditor?","Transport route control evidence?"],
    claims=[C("Eastern DRC mineral supply chains have documented conflict-finance risks requiring enhanced due diligence.",1,"UN Group of Experts / OECD framing."),C("A single phone brand is uniquely guilty based on one undated pit photo.",-1,"Chain-of-custody missing."),C("Smelter audit status is a relevant control point for refiners.",1,"RMAP-class audits."),C("All artisanal production is illegally taxed this month in every territory.",0,"Territory-time specific evidence required.")],
    sources=[S("OECD minerals","https://www.oecd.org/corporate/mne/mining.htm","Due-diligence standard","OECD"),S("UN GoE DRC","https://www.un.org/securitycouncil/sanctions/1533/panel-experts","UN investigative reports","UN"),S("RMI","https://www.responsiblemineralsinitiative.org/","Smelter audit programs","RMI"),S("IPIS","https://ipisresearch.be/","Mine mapping research","IPIS")],
    agency="OECD / UN GoE", agencyUrl="https://www.oecd.org/corporate/mne/mining.htm", tags=["minerals","drc","supply-chain","geopolitical"]),
seed(id="geo-10-caribbean-intercept", topic="geopolitical", subtopic="americas-migration", rank=110, short="Caribbean intercept",
    title="Caribbean maritime migration — intercept claims, capacity, and due-process flags",
    where="Windward Passage / Mona Passage corridors", lat=19.8, lng=-73.9,
    lede="Intercept videos and mass expulsion claims outrun official Coast Guard and migration-agency stats. Separate operational releases, asylum-process rules, and hospital reports from influencer boat counts.",
    stakes="Inflated numbers harden policy; suppressed numbers hide capacity crises and rights violations.",
    known=["Coast guards publish interdiction statistics with definitions.","Individual boat videos do not equal monthly totals.","Due-process claims need legal instrument and case-level primary."],
    open=["Which agency statistical table?","Medical outcomes primary?","Legal status of persons aboard?"],
    claims=[C("Caribbean maritime interdictions are regularly reported in official statistical releases.",1,"Recurring official stats pattern."),C("One viral boat video proves a record-breaking monthly total.",-1,"Anecdote is not aggregate."),C("Asylum and protection claims require legal-process primary, not comment-section consensus.",1,"Legal method gate."),C("All intercepted persons were economic migrants with no protection needs.",0,"Status is individualized.")],
    sources=[S("US Coast Guard newsroom","https://www.news.uscg.mil/","Operational releases","USCG"),S("IOM","https://www.iom.int/","Migration data methods","IOM"),S("UNHCR","https://www.unhcr.org/","Protection framework","UNHCR"),S("DHS","https://www.dhs.gov/","US aggregate stats channels","DHS")],
    agency="USCG / IOM", agencyUrl="https://www.news.uscg.mil/", tags=["caribbean","migration","intercept","geopolitical"]),
]

# ─── 23 TOPICAL ───
def T(id, topic, sub, rank, short, title, where, lat, lng, lede, stakes, known, open, claims, sources, agency, agencyUrl, tags):
    return seed(id=id, topic=topic, subtopic=sub, rank=rank, short=short, title=title, where=where, lat=lat, lng=lng, lede=lede, stakes=stakes, known=known, open=open, claims=claims, sources=sources, agency=agency, agencyUrl=agencyUrl, tags=tags)

SEEDS += [
T("top-01-grid-cascade","infrastructure","electric-grid",111,"Grid cascade","Regional grid disturbance — operator reports vs blackout memes","Eastern Interconnection (training)",39.0,-77.5,
 "A multi-state voltage event sparks blackout maps and cyber-attack claims within minutes. Force utility and reliability-coordinator primaries before scoring cause.",
 "False cyber attribution triggers overreaction; missed physical faults delay mutual aid.",
 ["Balancing authorities publish disturbance reports.","Social outage maps invent polygons.","Cyber cause needs ICS evidence."],
 ["Which RC acknowledged?","Load lost MW band?","Physical vs cyber indicators?"],
 [C("Bulk-power disturbances are documented through reliability reporting when thresholds are met.",1,"NERC/EIA-class patterns."),C("A dark city TikTok proves nation-state cyber sabotage.",-1,"No ICS primary."),C("Mutual-aid crew movements can fit weather-driven faults without proving root cause.",0,"Corroborating not conclusive.")],
 [S("EIA","https://www.eia.gov/","Energy statistics","EIA"),S("NERC","https://www.nerc.com/","Reliability standards","NERC"),S("CISA ICS","https://www.cisa.gov/","ICS advisories","CISA"),S("FERC","https://www.ferc.gov/","Regulatory context","FERC")],
 "NERC/EIA","https://www.eia.gov/",["grid","outage","nerc"]),
T("top-02-bridge-closure","infrastructure","transport-infra",112,"Bridge closure","Major bridge emergency closure — inspection orders vs collapse rumors","Interstate river crossing (training)",38.63,-90.2,
 "Emergency bridge closure after inspection races ahead of structural detail. Separate DOT orders from influencer collapse physics.",
 "Panic diversions overload detours; delayed closures risk lives.",
 ["Closure orders are primary.","Fracture-critical language is technical.","Collapse rumors recycle other bridges."],
 ["Inspection report date?","Official detour?","Cracking photos geolocated?"],
 [C("Emergency closure authority rests on the asset owner/DOT order text.",1,"Order is primary."),C("A photo of rust alone proves immediate collapse tonight.",-1,"Needs engineer of record."),C("Detour travel-time claims should cite DOT or probe data.",0,"Hold for measurement.")],
 [S("FHWA","https://www.fhwa.dot.gov/","Bridge programs","FHWA"),S("NTSB","https://www.ntsb.gov/","Accident investigations","NTSB"),S("State DOT patterns","https://www.transportation.gov/","Owner orders","USDOT"),S("USGS water","https://waterdata.usgs.gov/","River stage context","USGS")],
 "State DOT/FHWA","https://www.fhwa.dot.gov/",["bridge","inspection","dot"]),
T("top-03-port-congestion","infrastructure","ports-logistics",113,"Port congestion","Container port congestion — AIS dwell vs supply-chain collapse rhetoric","Major US container complex (training)",33.74,-118.27,
 "Anchorage counts and dwell charts are real metrics often misused as civilizational collapse proof.",
 "Misread congestion distorts inventory policy and labor narratives.",
 ["Ports publish monthly stats.","AIS anchorage counts need definition.","Labor actions have separate notices."],
 ["Which terminal?","Import vs export dwell?","Weather vs labor vs chassis?"],
 [C("Port authorities publish throughput and dwell statistics as operational evidence.",1,"Port statistics primary."),C("Anchorage photos prove permanent national supply-chain failure.",-1,"Scope inflation."),C("Chassis shortages can raise dwell without a single root cause.",0,"Multi-factor.")],
 [S("MARAD","https://www.maritime.dot.gov/","Maritime admin","MARAD"),S("BTS","https://www.bts.gov/","Transport statistics","BTS"),S("FMC","https://www.fmc.gov/","Ocean shipping regulation","FMC"),S("Port authority portals","https://www.portoflosangeles.org/","Example port stats","Ports")],
 "MARAD/Port authority","https://www.maritime.dot.gov/",["port","congestion","ais"]),
T("top-04-rail-hazmat","infrastructure","rail-safety",114,"Rail hazmat","Rail hazmat derailment — NTSB/PHMSA vs plume apps","Midwest mainline (training)",40.44,-80.0,
 "Derailment videos spawn chemical plume claims. Prioritize NTSB prelim, PHMSA commodity data, and local EMA orders.",
 "Wrong chemical ID drives wrong shelter-in-place behavior.",
 ["Consist and placard evidence matters.","Evacuation orders are primary.","Plume apps are models not measurements."],
 ["UN number confirmed?","EMA order text?","Air monitoring data?"],
 [C("NTSB preliminary notices are primary for early accident framing.",1,"NTSB primary."),C("A color-of-smoke guess identifies the exact chemical with certainty.",-1,"Not analytical chemistry."),C("Shelter-in-place orders should be followed from EMA channels.",1,"Public safety primary.")],
 [S("NTSB","https://www.ntsb.gov/","Accident primary","NTSB"),S("PHMSA","https://www.phmsa.dot.gov/","Hazmat regulation","PHMSA"),S("EPA air","https://www.epa.gov/","Air monitoring context","EPA"),S("FEMA","https://www.fema.gov/","Emergency management","FEMA")],
 "NTSB/PHMSA","https://www.ntsb.gov/",["rail","hazmat","ntsb"]),
T("top-05-h5n1-dairy","public-health","zoonosis",115,"H5N1 dairy","H5N1 in dairy cattle — USDA/CDC updates vs farm rumor mills","US dairy belt (training)",42.0,-93.6,
 "Animal health detections and sporadic human cases generate pasteurization myths. Bind claims to USDA APHIS and CDC updates.",
 "False food-safety panic vs under-prepared occupational risk.",
 ["Pasteurization science is settled for milk safety claims.","Farm worker PPE guidance is occupational primary.","Sequence claims need lab primary."],
 ["State detection table?","Human case confirmation?","Raw milk exposure pathway?"],
 [C("USDA/CDC situation updates are primary for detection counts when specifically cited.",1,"Agency primary."),C("Grocery milk is unsafe nationwide because of a single herd detection.",-1,"Pasteurization and overgeneralization."),C("Occupational exposure risk for dairy workers is distinct from retail food risk.",1,"Pathway separation.")],
 [S("CDC","https://www.cdc.gov/","Human health updates","CDC"),S("USDA APHIS","https://www.aphis.usda.gov/","Animal health","USDA"),S("FDA food","https://www.fda.gov/food","Food safety","FDA"),S("WHO","https://www.who.int/","International health context","WHO")],
 "USDA/CDC","https://www.cdc.gov/",["h5n1","dairy","zoonosis"]),
T("top-06-hospital-cyber","public-health","health-cyber",116,"Hospital ransomware","Hospital ransomware diversion — HHS notices vs ER chaos clips","Regional health system (training)",41.88,-87.63,
 "Diversion status and downtime procedures are operational facts often replaced by hallway panic videos of unknown hospitals.",
 "Wrong diversion claims misroute ambulances; denialism delays mutual aid IT.",
 ["Hospital can declare diversion.","HHS HC3 tracks health-sector cyber threats.","Clips need facility ID."],
 ["Named hospital?","Diversion board?","Ransom note authenticity?"],
 [C("Diversion status is an operational declaration by the facility/EMS system.",1,"Operational primary."),C("A hallway video from an unknown hospital proves national hospital cyber collapse.",-1,"Identification missing."),C("Downtime paper procedures can maintain emergency care at reduced efficiency.",0,"Context-specific.")],
 [S("HHS","https://www.hhs.gov/","Health sector","HHS"),S("CISA","https://www.cisa.gov/","Cyber advisories","CISA"),S("HC3 patterns","https://www.hhs.gov/about/agencies/asa/ocr/index.html","Health cyber context","HHS"),S("AHA","https://www.aha.org/","Hospital association context","AHA")],
 "HHS/CISA","https://www.hhs.gov/",["ransomware","hospital","hc3"]),
T("top-07-drug-shortage","public-health","pharma-supply",117,"Drug shortage","Critical drug shortage — FDA list vs compounding rumors","US national (training)",39.0,-77.0,
 "Shortage lists are primary; forever-shortage memes and unsafe compounding advice are not.",
 "Patients ration meds; unsafe workarounds harm.",
 ["FDA shortage database is primary.","Reason codes matter.","Compounding has legal limits."],
 ["NDC-level status?","Estimated recovery?","Therapeutic alternative guidance?"],
 [C("FDA drug shortage listings are primary for US shortage status of listed products.",1,"FDA primary."),C("Social advice to import unlabeled product is medically and legally sound.",-1,"Unsafe and often unlawful."),C("Manufacturer discontinuation notices explain some shortages.",1,"When cited.")],
 [S("FDA shortages","https://www.fda.gov/drugs/drug-safety-and-availability/drug-shortages","Shortage database","FDA"),S("ASHP","https://www.ashp.org/","Pharmacy shortage resources","ASHP"),S("CDC","https://www.cdc.gov/","Public health context","CDC"),S("CMS","https://www.cms.gov/","Coverage context","CMS")],
 "FDA","https://www.fda.gov/drugs/drug-safety-and-availability/drug-shortages",["shortage","fda","pharmacy"]),
T("top-08-municipal-ransomware","cyber-security","local-gov-cyber",118,"City ransomware","Municipal ransomware — payment claims and public-record outages","Mid-size US city (training)",39.1,-84.5,
 "City services offline claims need CIO/incident notices; Bitcoin paid rumors need appropriation or disclosure primary.",
 "Rumor can move bond chatter; silence can hide resident service gaps.",
 ["MS-ISAC/CISA advisories are sector primary.","Payment claims are high-bar.","911 impacts need EMA confirmation."],
 ["Which systems?","Ransom demand primary?","FOIA status of incident report?"],
 [C("Municipal incident notices are primary for service outage scope.",1,"City primary."),C("Anonymous leak site PDF proves payment completed.",-1,"Unverified extortion channel."),C("911 impacts require public-safety confirmation, not app downtime alone.",0,"Corroborate.")],
 [S("CISA","https://www.cisa.gov/","Cyber advisories","CISA"),S("MS-ISAC","https://www.cisecurity.org/ms-isac","State local cyber","CIS"),S("FBI IC3","https://www.ic3.gov/","Cyber crime reporting","FBI"),S("NACCHO","https://www.naccho.org/","Local public health IT context","NACCHO")],
 "CISA/MS-ISAC","https://www.cisa.gov/",["ransomware","municipal","cisa"]),
T("top-09-telecom-outage","cyber-security","telecom",119,"Telecom outage","Nationwide telecom outage claims — FCC reporting vs map screenshots","US national (training)",38.9,-77.0,
 "Carrier outage maps and complaint spikes are not interchangeable with FCC outage thresholds.",
 "Emergency calling failures are high-stakes; exaggeration erodes warning trust.",
 ["Carriers issue status pages.","FCC has outage reporting rules.","Third-party apps measure complaint volume."],
 ["911 impact confirmed?","Which MSA?","Maintenance window?"],
 [C("Carrier status pages are primary for acknowledged incidents.",1,"Carrier primary."),C("Complaint-volume charts equal network failure percentage.",-1,"Different metric."),C("911 special procedures may be invoked during major outages.",1,"When PSAPs confirm.")],
 [S("FCC","https://www.fcc.gov/","Outage and 911 rules","FCC"),S("CISA","https://www.cisa.gov/","Critical infrastructure","CISA"),S("CTIA","https://www.ctia.org/","Industry context","CTIA"),S("NENA","https://www.nena.org/","911 standards context","NENA")],
 "FCC","https://www.fcc.gov/",["telecom","outage","fcc"]),
T("top-10-deepfake-official","cyber-security","synthetic-media",120,"Deepfake official","Synthetic official video — platform labels vs authentication","Global digital (training)",37.4,-122.1,
 "A viral minister announces clip lacks chain-of-custody. Use reverse search, original channel, and forensic notes — not vibes.",
 "Synthetic orders can move markets and crowds.",
 ["Official channels are authentication hubs.","Labels help but lag.","AV artifacts are hints not proof alone."],
 ["Original upload account?","Matching official transcript?","Forensic report?"],
 [C("Authentication starts at the official channel and contemporaneous transcript.",1,"Auth method."),C("Any facial artifact proves state-sponsored deepfake.",-1,"Artifacts have many causes."),C("Platform labels are secondary risk signals, not forensic conclusions.",0,"Useful but incomplete.")],
 [S("CISA","https://www.cisa.gov/","Synthetic media guidance","CISA"),S("NIST","https://www.nist.gov/","Measurement science","NIST"),S("FTC","https://www.ftc.gov/","Consumer deception","FTC"),S("First Draft archives patterns","https://firstdraftnews.org/","Verification methods heritage","First Draft")],
 "CISA","https://www.cisa.gov/",["deepfake","synthetic","auth"]),
T("top-11-heat-dome","climate-extreme","extreme-heat",121,"Heat dome","Extreme heat emergency — NWS products vs mortality guess posts","US South/Southwest (training)",33.4,-112.0,
 "Heat advisories are primary for risk communication; death tolls need vital-statistics methods.",
 "Under-warning kills; fake tolls polarize aid.",
 ["NWS issues heat products.","Excess mortality is statistical.","Cooling-center lists are local primary."],
 ["Which WFO product?","ER surge confirmed?","Power load shedding?"],
 [C("NWS heat products are primary for meteorological risk messaging.",1,"NWS primary."),C("A social death count without vital records is authoritative.",-1,"No methodology."),C("Cooling centers listed by city/utility are mitigations to verify.",1,"When officially listed.")],
 [S("NWS","https://www.weather.gov/","Heat products","NWS"),S("CDC heat","https://www.cdc.gov/disasters/extremeheat/","Health guidance","CDC"),S("EPA","https://www.epa.gov/","Environmental context","EPA"),S("FEMA","https://www.fema.gov/","Emergency support","FEMA")],
 "NWS/CDC","https://www.weather.gov/",["heat","nws","mortality"]),
T("top-12-flood-urban","climate-extreme","flooding",122,"Urban flood","Flash flood emergency — USGS gauges vs basement videos","Urban watershed (training)",39.95,-75.16,
 "Gauge height and flood stages are measurable; undated basement clips are not hydrographs.",
 "Wrong flood stage confuses rescue priorities.",
 ["USGS gauges are primary for stage.","NWS flood warnings name river points.","Clips need time/place."],
 ["Gauge ID?","Crest forecast?","Dam release notices?"],
 [C("USGS gauge height is primary for stage at a station.",1,"USGS primary."),C("Any wet street video proves a 500-year flood.",-1,"No return-period math."),C("Road closure lists from DOT/EMA are primary for motorist action.",1,"Operational primary.")],
 [S("USGS water","https://waterdata.usgs.gov/","Gauge primary","USGS"),S("NWS","https://www.weather.gov/","Flood warnings","NWS"),S("USACE","https://www.usace.army.mil/","Dam/river context","USACE"),S("FEMA flood maps","https://www.fema.gov/flood-maps","Flood hazard maps","FEMA")],
 "NWS/USGS","https://waterdata.usgs.gov/",["flood","usgs","nws"]),
T("top-13-smoke-aqi","climate-extreme","air-quality",123,"Smoke AQI","Wildfire smoke transport — AirNow vs toxic cloud memes","Downwind metro (training)",44.98,-93.27,
 "AQI methods differ between regulatory monitors and low-cost sensors; both beat uncalibrated sunset photos.",
 "Sensitive groups need accurate guidance; hype causes unnecessary flight.",
 ["AirNow blends official monitors.","PurpleAir needs correction factors.","School outdoor policies reference AQI bands."],
 ["Monitor vs sensor?","Forecast plume model?","School policy trigger?"],
 [C("AirNow AQI is the public-facing regulatory-oriented index for US messaging.",1,"AirNow primary."),C("Orange sky photo equals hazardous AQI without a monitor.",-1,"Not a measurement."),C("Low-cost sensors can inform hyperlocal patterns when corrected and sited well.",0,"Method-dependent.")],
 [S("AirNow","https://www.airnow.gov/","AQI primary","EPA AirNow"),S("EPA air","https://www.epa.gov/air-quality","Air quality","EPA"),S("NWS fire weather","https://www.weather.gov/","Fire weather","NWS"),S("CDC smoke","https://www.cdc.gov/air/wildfire-smoke/","Health guidance","CDC")],
 "AirNow/EPA","https://www.airnow.gov/",["aqi","smoke","airnow"]),
T("top-14-bank-run-rumor","markets-finance","banking",124,"Bank rumor","Regional bank stress rumor — 8-K/FDIC vs screenshot ledgers","US regional banking (training)",40.7,-74.0,
 "Deposit-flight claims need call reports, 8-Ks, and FDIC notices — not cropped mobile-bank screenshots.",
 "Rumor can create the run it claims to report.",
 ["Material events may be 8-K.","FDIC insurance limits are primary.","Screenshots forge easily."],
 ["Filer CIK?","Liquidity facility drawn?","Regulator statement?"],
 [C("SEC filings and FDIC notices are primary for material US bank events.",1,"Filing primary."),C("A cropped balance screenshot proves insolvency.",-1,"Easily fabricated."),C("Social deposit-flight anecdotes can be early warning but remain 0 until filings.",0,"Signal only.")],
 [S("FDIC","https://www.fdic.gov/","Deposit insurance","FDIC"),S("SEC EDGAR","https://www.sec.gov/edgar","Filings","SEC"),S("Federal Reserve","https://www.federalreserve.gov/","Supervision context","Fed"),S("OCC","https://www.occ.gov/","National bank supervision","OCC")],
 "FDIC/SEC","https://www.fdic.gov/",["bank","fdic","8k"]),
T("top-15-sanctions-evasion","markets-finance","sanctions",125,"Sanctions evasion","Sanctions evasion shipping — OFAC lists vs AIS dark lore","Global maritime (training)",25.2,55.3,
 "Dark fleet narratives mix real OFAC designations with undated AIS tracks. Bind vessel IDs to designation lists.",
 "Wrong hull naming creates legal risk; missed evasion undermines policy.",
 ["OFAC SDN is primary for US designations.","AIS dark is not automatic violation.","Ownership chains are multi-hop."],
 ["IMO number?","Designation date?","STS transfer evidence?"],
 [C("OFAC designation lists are primary for US sanctions status of listed parties.",1,"OFAC primary."),C("Any AIS gap proves sanctions evasion.",-1,"Many benign causes."),C("Ship-to-ship transfer patterns can be investigative leads requiring multi-source lock.",0,"Lead not proof.")],
 [S("OFAC","https://ofac.treasury.gov/","Sanctions lists","OFAC"),S("BIS","https://www.bis.doc.gov/","Export controls","BIS"),S("IMO","https://www.imo.org/","Maritime identity","IMO"),S("UN sanctions","https://www.un.org/securitycouncil/sanctions","UN sanctions","UN")],
 "OFAC","https://ofac.treasury.gov/",["sanctions","ofac","ais"]),
T("top-16-commodity-squeeze","markets-finance","commodities",126,"Commodity squeeze","Commodity squeeze claims — exchange notices vs influencer price targets","Global futures (training)",41.88,-87.63,
 "Margin changes and delivery notices are primary; to-the-moon threads are not inventory audits.",
 "Retail FOMO vs commercial hedger risk.",
 ["Exchanges publish margin alerts.","Warehouse stock reports vary by commodity.","CFTC commitments data is structured."],
 ["Which contract month?","Exchange notice?","Physical stock primary?"],
 [C("Exchange margin and delivery notices are primary market-structure facts.",1,"Exchange primary."),C("An anonymous inventory photo proves global shortage.",-1,"No chain of custody."),C("COT positioning is public data useful for context, not price destiny.",1,"When cited correctly.")],
 [S("CFTC","https://www.cftc.gov/","Futures regulation","CFTC"),S("CME Group","https://www.cmegroup.com/","Exchange notices example","CME"),S("EIA","https://www.eia.gov/","Energy inventories","EIA"),S("USDA","https://www.usda.gov/","Ag inventories","USDA")],
 "CFTC/exchanges","https://www.cftc.gov/",["commodity","futures","cftc"]),
T("top-17-ballot-cure","elections-process","election-admin",127,"Ballot cure","Ballot cure process — state code vs viral rejection piles","US county (training)",42.33,-83.05,
 "Cure windows and rejection codes are statutory. Viral trays of ballots without chain-of-custody are narrative fuel.",
 "Undermining lawful cure or hiding real admin failures both harm trust.",
 ["State code defines cure.","County canvass is primary for counts.","Photos need context."],
 ["Statute cite?","County notice?","Observer rules?"],
 [C("Ballot cure procedures are defined in state election code and county instructions.",1,"Legal primary."),C("A photo of ballots in a mailroom proves systemic fraud.",-1,"No chain of custody."),C("Provisional ballot rates can be audited via canvass documents.",1,"When published.")],
 [S("EAC","https://www.eac.gov/","Election administration","EAC"),S("NASS","https://www.nass.org/","Secretaries of state","NASS"),S("NCSL elections","https://www.ncsl.org/elections-and-campaigns","State law trackers","NCSL"),S("DOJ Civil Rights voting","https://www.justice.gov/crt","Federal voting rights","DOJ")],
 "State SOS/EAC","https://www.eac.gov/",["ballot","cure","election"]),
T("top-18-pollbook-outage","elections-process","election-tech",128,"Pollbook outage","Electronic pollbook outage — contingency paper process","US metro county (training)",33.75,-84.39,
 "EPB downtime triggers paper pollbook contingencies. Separate official incident tickets from stolen election livestreams.",
 "Lines and provisional ballots rise; rumor weaponizes normal contingency.",
 ["Contingency procedures exist.","Incident duration should come from election office.","Video of a line is not a turnout model."],
 ["Vendor ticket?","Paper activated countywide?","Court orders?"],
 [C("Election offices can lawfully switch to paper pollbooks under contingency plans.",1,"Admin primary."),C("Any EPB glitch proves intentional disenfranchisement of a named group without evidence.",-1,"Intent not shown."),C("Wait-time estimates need systematic measurement, not one camera angle.",0,"Method needed.")],
 [S("EAC","https://www.eac.gov/","Voting system context","EAC"),S("CISA election security","https://www.cisa.gov/election-security","Election cyber","CISA"),S("NASS","https://www.nass.org/","State election officials","NASS"),S("NIST voting","https://www.nist.gov/itl/voting","Standards context","NIST")],
 "EAC/State SOS","https://www.eac.gov/",["pollbook","election","outage"]),
T("top-19-ai-robocall","elections-process","election-comms",129,"AI robocall","AI robocall suppression claims — FCC/state AG actions","US multi-state (training)",38.9,-77.0,
 "Synthetic voice robocalls targeting voters generate enforcement actions. Bind claims to FCC citations and state AG complaints.",
 "Real suppression harms turnout; false alarms dull response.",
 ["TCPA/FCC rules apply.","Audio forensics need originals.","Campaign disavowals are secondary."],
 ["Complaint docket?","Caller ID traceback?","Script authentication?"],
 [C("FCC and state AG enforcement actions are primary for regulatory findings when issued.",1,"Enforcement primary."),C("Any odd-sounding call is proven AI without analysis.",-1,"Insufficient."),C("Traceback notes can support attribution leads.",0,"Lead quality varies.")],
 [S("FCC","https://www.fcc.gov/","Robocall enforcement","FCC"),S("FTC","https://www.ftc.gov/","Consumer protection","FTC"),S("NAG","https://www.naag.org/","State AGs","NAAG"),S("CISA","https://www.cisa.gov/","Synthetic media","CISA")],
 "FCC","https://www.fcc.gov/",["robocall","ai","fcc"]),
T("top-20-app-store-remedy","tech-governance","platform-competition",130,"App store remedy","App store remedy orders — court docket vs founder threads","US federal courts (training)",37.77,-122.42,
 "Injunctive remedy language lives in orders, not podcasts. Score compliance claims from docket entries.",
 "Developers misread duties; platforms overclaim compliance.",
 ["Orders are primary.","Compliance plans may be filed.","Timelines slip — check docket."],
 ["Order date and judge?","Stay pending appeal?","Fee schedule exhibit?"],
 [C("Operative injunctive language is in the court order text.",1,"Order primary."),C("A CEO thread rewrites the injunction.",-1,"Speech is not an order."),C("Appeals can stay remedies; check appellate docket.",1,"Procedure.")],
 [S("CourtListener","https://www.courtlistener.com/","Dockets","CourtListener"),S("PACER info","https://pacer.uscourts.gov/","Federal dockets","US Courts"),S("DOJ ATR","https://www.justice.gov/atr","Antitrust","DOJ"),S("FTC competition","https://www.ftc.gov/","Competition","FTC")],
 "Courts/DOJ","https://www.courtlistener.com/",["antitrust","app-store","docket"]),
T("top-21-model-eval-leak","tech-governance","ai-safety",131,"Model eval leak","Frontier model eval leak — lab cards vs screenshot science","AI lab ecosystem (training)",37.48,-122.16,
 "Purported eval tables circulate without methodology. Prefer lab system cards and replicable harness notes.",
 "Fake evals move policy and investor narratives.",
 ["System cards are lab primary when published.","Evals need harness details.","Screenshots forge easily."],
 ["Harness repo?","Date of run?","Contamination notes?"],
 [C("Published system cards are primary lab disclosures when authentic.",1,"Lab primary."),C("An anonymous leaderboard screenshot is definitive science.",-1,"No method."),C("NIST AI RMF is a voluntary risk framework often cited in policy, not a statute.",1,"Framework literacy.")],
 [S("NIST AI","https://www.nist.gov/artificial-intelligence","AI RMF","NIST"),S("NTIA","https://www.ntia.gov/","AI policy context","NTIA"),S("OECD AI","https://oecd.ai/","International AI policy","OECD"),S("arXiv","https://arxiv.org/","Research preprints","arXiv")],
 "NIST AI","https://www.nist.gov/artificial-intelligence",["ai","eval","nist"]),
T("top-22-biometric-ban","tech-governance","surveillance",132,"Biometric ban","Municipal biometric ban — ordinance text vs vendor marketing","US city council (training)",41.88,-87.63,
 "Ban/moratorium claims live in ordinance numbers. Vendor compliant badges are marketing until mapped to text.",
 "Agencies over-install; activists over-claim bans.",
 ["Ordinance number and effective date matter.","Exemptions are common.","Procurement contracts are separate primaries."],
 ["Ordinance ID?","Exemptions list?","Active RFP?"],
 [C("Municipal ordinance text is primary for local biometric restrictions.",1,"Code primary."),C("A vendor slide deck proves legal compliance.",-1,"Marketing."),C("State preemption may limit local bans — check state code.",0,"Jurisdiction-specific.")],
 [S("Municode patterns","https://www.municode.com/","Municipal code","Municode"),S("GAO","https://www.gao.gov/","Oversight reports","GAO"),S("NIST biometrics","https://www.nist.gov/programs-projects/biometrics","Standards","NIST"),S("FTC privacy","https://www.ftc.gov/","Consumer privacy","FTC")],
 "Municipal code","https://www.municode.com/",["biometric","ordinance","privacy"]),
T("top-23-open-weights-export","tech-governance","ai-export",133,"Open weights export","Open-weight model export controls — BIS rules vs Discord policy","US export control (training)",38.9,-77.0,
 "Export control claims need Federal Register / BIS rule text. Community myths invent license exceptions.",
 "Developers risk violations; overclaim chills legitimate research.",
 ["BIS publishes rules.","Parameter thresholds change — check vintage.","Open release is not always uncontrolled."],
 ["FR citation?","Model parameter count primary?","End-use red flags?"],
 [C("BIS rule text and Federal Register notices are primary for US export controls.",1,"BIS primary."),C("A Discord pin is an authoritative license exception.",-1,"Not law."),C("Model cards stating parameter counts help classification discussions but are not legal advice.",0,"Input only.")],
 [S("BIS","https://www.bis.doc.gov/","Export controls","BIS"),S("Federal Register","https://www.federalregister.gov/","Rule text","NARA"),S("NIST AI","https://www.nist.gov/artificial-intelligence","Measurement context","NIST"),S("State DDTC","https://www.pmddtc.state.gov/","Defense trade context","State")],
 "BIS","https://www.bis.doc.gov/",["export","bis","open-weights"]),
]

assert len(SEEDS) == 33, len(SEEDS)
assert len({s["id"] for s in SEEDS}) == 33

def j(s):
    return json.dumps(s, ensure_ascii=False)

# Emit TypeScript via JSON embed + thin builders (avoids escaping hell)
json_path = ROOT / "src" / "data" / "useCases" / "corpusSeeds100.json"
json_path.write_text(json.dumps(SEEDS, indent=2, ensure_ascii=False), encoding="utf-8")

ts = r'''/**
 * Story corpus expansion to 100 desks (v1.6.1 final night pack).
 * Keeps tops: gen-explore + trend-01…10 + cong-01…56 (=67).
 * Adds 33: 10 detailed geopolitical + 23 topical.
 * Catalogue by topic / subtopic via catalogueByTopic().
 */
import seedsJson from './corpusSeeds100.json'
import type { EvidenceScore, MaterialClass, ModuleId } from '../../types/core'
import type {
  ActiveSource,
  PaneId,
  PaneWeight,
  UseCaseProfile,
  UseCaseReport,
} from '../../types/useCase'
import type { InvestigationStory } from './stories'
import type { InvestigationSimulation } from './simulations'
import { emptyLadder, uid } from '../../types/core'

const AS_OF = '2026-07-26'

export type StoryTopic =
  | 'geopolitical'
  | 'infrastructure'
  | 'public-health'
  | 'cyber-security'
  | 'climate-extreme'
  | 'markets-finance'
  | 'elections-process'
  | 'tech-governance'
  | 'energy-resources'
  | 'humanitarian'

export interface CorpusSeed {
  id: string
  topic: StoryTopic
  subtopic: string
  rank: number
  short: string
  title: string
  where: string
  lat: number
  lng: number
  lede: string
  stakes: string
  known: string[]
  open: string[]
  claims: Array<{ plain: string; score: EvidenceScore; why: string }>
  sources: Array<{ title: string; url: string; why: string; publisher: string }>
  agency: string
  agencyUrl: string
  tags: string[]
}

export const CORPUS_SEEDS = seedsJson as CorpusSeed[]

function st(score: EvidenceScore): 'supported' | 'uncertain' | 'disputed' {
  if (score === 1) return 'supported'
  if (score === -1) return 'disputed'
  return 'uncertain'
}

const ALL_ON: PaneId[] = [
  'information', 'atlas', 'design-lab', 'research-hub', 'analyst', 'sme-lenses',
  'audit-ladder', 'procedural-forge', 'massing-viewer', 'export-kit',
]

function panes(
  primary: PaneId[],
  weights: PaneWeight[],
  onDemand: PaneId[],
  preset: UseCaseProfile['layoutPreset'],
) {
  return {
    layoutPreset: preset,
    primaryPanes: primary,
    secondaryPanes: onDemand.slice(0, 3),
    defaultOpen: primary.slice(0, 5),
    paneWeights: weights,
    onDemand,
  }
}

function buildReport(seed: CorpusSeed): UseCaseReport {
  const claims = seed.claims.map((c, i) => ({
    id: `${seed.id}-c${i + 1}`,
    statement: c.plain,
    score: c.score,
    material: (c.score === 1 ? 'secondary' : c.score === -1 ? 'assumption' : 'derived') as MaterialClass,
    confidence: (c.score === 1 ? 'high' : c.score === -1 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
    notes: c.why,
    tags: seed.tags,
  }))
  const body = [
    `# ${seed.title}`,
    '',
    `**Topic:** ${seed.topic} / ${seed.subtopic}`,
    `**As of:** ${AS_OF}`,
    '',
    seed.lede,
    '',
    '## Stakes',
    seed.stakes,
    '',
    '## Claims',
    ...claims.map(
      (c) =>
        `- **[${c.score === 1 ? '+1' : c.score === -1 ? '−1' : '0'}]** ${c.statement} — _${c.notes}_`,
    ),
    '',
    '_NEXOSxLPIN training desk · Layer-0 · not legal advice._',
  ].join('\n')
  return {
    asOf: AS_OF,
    trendSignal: `${seed.topic}/${seed.subtopic} · ${seed.short}`,
    headline: seed.title,
    executiveSummary: `${seed.lede} Stakes: ${seed.stakes}`,
    claims,
    timeline: [
      { when: '2025–2026', what: `Reporting cycle for ${seed.short}.` },
      { when: AS_OF, what: 'Desk assembled for NEXOSxLPIN 100-story corpus.' },
      { when: 'Ongoing', what: `${seed.agency} materials are starting points — cite instruments.` },
    ],
    openQuestions: seed.open,
    verificationPlaybook: [
      'Pull primary agency/mission releases before scoring duties.',
      'Geolocate and reverse-search viral media.',
      'Separate market/perception moves from legal fault.',
      'Resolve −1 rumor lines before export.',
    ],
    sourcesToSeek: seed.sources.map((s) => s.title),
    noiseRisks: [
      'Recycled footage',
      'Invented precision numbers',
      'Scope inflation from single clips',
      'Partisan maps without methodology',
    ],
    geographicNotes: seed.where,
    fullBriefMarkdown: body,
  }
}

function buildProfile(seed: CorpusSeed): UseCaseProfile {
  const rep = buildReport(seed)
  const spatial = seed.topic === 'geopolitical'
  return {
    id: seed.id,
    trendRank: seed.rank,
    label: seed.short,
    tagline: seed.title,
    family: seed.topic,
    description: rep.executiveSummary,
    workflow: rep.verificationPlaybook.slice(0, 4),
    sampleClaimHints: rep.claims.map(
      (c) => `${c.score === 1 ? '+1' : c.score === -1 ? '−1' : '0'}: ${c.statement}`,
    ),
    report: rep,
    mapPin: {
      useCaseId: seed.id,
      label: seed.short,
      shortLabel: seed.short,
      lat: seed.lat,
      lng: seed.lng,
      kind: seed.topic,
      score: 0,
      cityHint: seed.where,
    },
    dataPackId: 'pack-sample-alpha',
    ...panes(
      spatial ? ['atlas', 'research-hub', 'sme-lenses'] : ['research-hub', 'atlas', 'sme-lenses'],
      [
        { pane: spatial ? 'atlas' : 'research-hub', weight: 5, minPx: 300, pinned: true },
        { pane: 'research-hub', weight: 4, minPx: 260 },
        { pane: 'sme-lenses', weight: 3, minPx: 220 },
      ],
      ALL_ON.filter((p) => !['atlas', 'research-hub', 'sme-lenses'].includes(p)),
      spatial ? 'spatial-primary' : 'research-first',
    ),
  }
}

function buildStory(seed: CorpusSeed): InvestigationStory {
  return {
    useCaseId: seed.id,
    title: seed.title,
    where: seed.where,
    lede: seed.lede,
    stakes: seed.stakes,
    knownSoFar: seed.known,
    stillOpen: seed.open,
    claims: seed.claims.map((c) => ({
      plain: c.plain,
      status: st(c.score),
      score: c.score,
      why: c.why,
    })),
    surfaces: {
      map: `Pins ${seed.short} · ${seed.where}.`,
      research: 'Score claims with primary hierarchy; flag plausible-unverified.',
      design: 'Verification depth before publish.',
      ladder: 'Raise detail with sources intact.',
      analyst: 'SME multi-select for domain overlap.',
      model: 'Story meshes from claims/industry/SME tags.',
      export: 'Layer-0; clear −1 first.',
      sources: 'Agency and mission primaries listed on desk.',
    },
    tabLabels: {
      'research-hub': 'Claims',
      atlas: 'Desk map',
      'sme-lenses': 'SME',
      analyst: 'Commands',
      'export-kit': 'Export',
    },
    nextStep: 'Open Claims, bind +1 to primary, run multi-loop verify, seed Massing.',
  }
}

function buildSources(seed: CorpusSeed): ActiveSource[] {
  return seed.sources.map((s, i) => ({
    id: `${seed.id}-src-${i + 1}`,
    title: s.title,
    url: s.url,
    why: s.why,
    kind: 'official' as const,
    publisher: s.publisher,
    publicRecord: true,
    tags: seed.tags,
  }))
}

function buildSim(seed: CorpusSeed): InvestigationSimulation {
  const sources = buildSources(seed)
  const rep = buildReport(seed)
  const evidence = rep.claims.map((c) => ({
    id: uid('ev'),
    title: c.statement.slice(0, 120),
    summary: c.notes,
    score: c.score,
    confidence: c.confidence,
    material: c.material,
    tags: ['corpus-100', seed.topic, ...seed.tags],
    sourceRefs: sources.slice(0, 2).map((s) => s.id),
    createdAt: new Date().toISOString(),
    moduleId: 'research-hub' as ModuleId,
  }))
  const ladder = emptyLadder(1)
  ladder.current = 1
  ladder.populated[0] = true
  ladder.populated[1] = true
  return {
    useCaseId: seed.id,
    mapPin: {
      useCaseId: seed.id,
      label: seed.short,
      shortLabel: seed.short,
      lat: seed.lat,
      lng: seed.lng,
      kind: seed.topic,
      score: 0,
      cityHint: seed.where,
    },
    scenePoints: [],
    graphNodes: [
      { id: 'n-primary', label: 'Primary record', kind: 'control', score: 1 },
      { id: 'n-noise', label: 'Narrative noise', kind: 'risk', score: -1 },
      { id: 'n-export', label: 'Export gate', kind: 'control', score: 0 },
    ],
    graphEdges: [
      { id: 'e1', source: 'n-primary', target: 'n-export', label: 'clear if scored', score: 1 },
      { id: 'e2', source: 'n-noise', target: 'n-export', label: 'block', score: -1 },
    ],
    conditions: {
      matrixId: 'matrix-alpha',
      selections: {
        jurisdiction: 'j-01',
        'device-type': 'dev-a',
        'site-class': 'site-open',
        'power-path': 'pwr-grid',
        clearance: 'clr-std',
      },
      notes: `Corpus desk ${seed.id}`,
      updatedAt: new Date().toISOString(),
    },
    evidence,
    researchNotes: [
      {
        id: uid('rn'),
        title: `Desk · ${seed.short}`,
        body: seed.lede,
        score: 0 as EvidenceScore,
        material: 'secondary' as MaterialClass,
        tags: seed.tags,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    ladder,
    wdEntries: [
      {
        kind: 'decision',
        title: `Opened ${seed.short}`,
        body: seed.stakes,
        score: 1,
        moduleId: 'research-hub',
      },
    ],
    analystLog: [
      `Corpus desk ${seed.id} · ${seed.topic}/${seed.subtopic}`,
      '› Prefer primary hierarchy · sme multi-select for overlap',
    ],
    designNotes: 'Verification depth axes for training desk.',
    forgeAssetType: seed.topic === 'geopolitical' ? 'mf-gov-docket-stack' : 'mf-civic-path-strip',
    forgeName: seed.short,
    forgeDescription: `Scene objects for ${seed.short}`,
    sessionMode: 'analyze',
    sources,
  }
}

export const CORPUS_PROFILES: UseCaseProfile[] = CORPUS_SEEDS.map(buildProfile)
export const CORPUS_STORIES: Record<string, InvestigationStory> = Object.fromEntries(
  CORPUS_SEEDS.map((s) => [s.id, buildStory(s)]),
)
export const CORPUS_SOURCES: Record<string, ActiveSource[]> = Object.fromEntries(
  CORPUS_SEEDS.map((s) => [s.id, buildSources(s)]),
)
export const CORPUS_SIMS: InvestigationSimulation[] = CORPUS_SEEDS.map(buildSim)

export const CORPUS_TOPIC_LABELS: Record<string, string> = {
  geopolitical: 'Geopolitical',
  infrastructure: 'Infrastructure',
  'public-health': 'Public health',
  'cyber-security': 'Cyber security',
  'climate-extreme': 'Climate & extreme weather',
  'markets-finance': 'Markets & finance',
  'elections-process': 'Elections process',
  'tech-governance': 'Tech governance',
  'citizen-journalism': 'Citizen journalism / trends',
  congressional: 'Congressional / industry-effect',
  general: 'General',
}

export function catalogueByTopic(): Record<string, { subtopic: string; ids: string[] }[]> {
  const map: Record<string, Map<string, string[]>> = {}
  for (const s of CORPUS_SEEDS) {
    if (!map[s.topic]) map[s.topic] = new Map()
    const m = map[s.topic]!
    if (!m.has(s.subtopic)) m.set(s.subtopic, [])
    m.get(s.subtopic)!.push(s.id)
  }
  const out: Record<string, { subtopic: string; ids: string[] }[]> = {}
  for (const [topic, sub] of Object.entries(map)) {
    out[topic] = [...sub.entries()].map(([subtopic, ids]) => ({ subtopic, ids }))
  }
  return out
}

if (CORPUS_SEEDS.length !== 33) {
  throw new Error(`Expected 33 corpus seeds, got ${CORPUS_SEEDS.length}`)
}
'''

OUT.write_text(ts, encoding="utf-8")
print("JSON", json_path)
print("TS", OUT)
print("seeds", len(SEEDS))
print("geo", sum(1 for s in SEEDS if s["topic"]=="geopolitical"))
