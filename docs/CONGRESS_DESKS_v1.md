# Congressional / industry-effect desks v1

**Product:** NEXOSxLPIN 1.3.0  
**Family:** `congressional`  
**Count:** **40** full-depth training investigation desks  
**Framing:** Public-record **training/investigation desks** — not legal advice, not partisan advocacy, no PII.

**1.2.1 bill links (confident, browser-verify congress.gov):** H.R.4346 CHIPS · H.R.5376 IRA · H.R.3684 IIJA · H.R.5515 FIRRMA/NDAA · H.R.2066 SBIC family · 47 U.S.C. § 230.

## Purpose

Each desk trains operators to score **industry and private-sector effects** of oversight and potential rules:

- Compliance cost and reporting burden  
- Market structure and competition  
- Liability and insurance  
- Supply chain and capital access  

Claims use tri-state **+1 / 0 / −1** with mixed material classes. Prefer **official sources**.

## Source hierarchy (prefer in order)

1. **Congress.gov** — bill text, hearings, committee pages  
2. **Agency primary** — FTC, DOJ ATR, SEC, CFTC, FERC, DOE, FDA, NHTSA, FAA, CFPB, NLRB, SBA, Treasury/CFIUS, NIST, CMS, HHS, EPA, USGS, etc.  
3. **GAO** — program evaluations  
4. **CRS** — legislative analysis (`crsreports.congress.gov`)  
5. Secondary: public comments, reputable wire — never social-only as +1  

If a specific bill URL 404s, fall back to Congress.gov search URLs (several desks already use search links).

## Inventory

| id | Focus |
|----|--------|
| `cong-01-ai-frontier` | Frontier AI oversight / model risk & industry compliance |
| `cong-02-bigtech-competition` | Large platform competition / antitrust |
| `cong-03-section-230` | Intermediary liability / Section 230 stakes |
| `cong-04-consumer-privacy` | Federal privacy / data broker effects |
| `cong-05-health-algo-pbm` | Health plan algorithms & PBM transparency |
| `cong-06-drug-pricing` | Prescription drug pricing oversight |
| `cong-07-hospital-consolidation` | Hospital / payer consolidation |
| `cong-08-energy-permitting` | Energy permitting, LNG, grid reliability |
| `cong-09-critical-minerals` | Critical minerals & supply chain |
| `cong-10-defense-contracting` | Defense contractor oversight / WFA |
| `cong-11-cfius-tech` | Foreign investment in sensitive tech (CFIUS-shaped) |
| `cong-12-digital-assets` | Digital assets / market structure |
| `cong-13-fintech-consumer` | Fintech & consumer financial protection |
| `cong-14-chips-semiconductor` | Semiconductor / CHIPS implementation |
| `cong-15-auto-av-safety` | Auto safety / AV / NHTSA |
| `cong-16-aviation-cert` | Aviation certification & OEM supply |
| `cong-17-fda-pathways` | FDA pathways — drugs/devices industry |
| `cong-18-climate-disclosure` | Climate / sustainability disclosure issuer burden |
| `cong-19-labor-platforms` | Labor / platform work / NLRB-shaped |
| `cong-20-small-business-capital` | Small business investment / SBIC capital |

`trendRank` values **11–30** place desks after the original 10 citizen-journalism trend desks. Discoverable via story switcher family **Congressional / industry-effect desks**.

## Depth contract (each desk)

- `UseCaseReport` asOf **2026-07-25**, executive summary ≥3 sentences  
- ≥5 scored claims mixed +1/0/−1  
- Timeline ≥4, openQuestions ≥4, verificationPlaybook ≥4, sourcesToSeek ≥4, noiseRisks ≥3  
- `fullBriefMarkdown` generated  
- `InvestigationStory` plain-language layer  
- `ActiveSource[]` with stable official URLs  
- Simulation stub + Capitol-region map pin (jittered)  
- `defaultOpen` / primary panes include **`sme-lenses`**

## Code map

- `src/data/useCases/congressDesks.ts` — profiles + reports  
- `src/data/useCases/congressSources.ts` — per-desk URLs  
- `src/data/useCases/congressStories.ts` — plain-language stories  
- `src/data/useCases/congressSimulations.ts` — sim stubs  
- Wired: `catalog.ts`, `activeSources.ts`, `stories.ts`, `simulations.ts`  
- Generator (rebuild): `scripts/gen_congress_1_2_0.mjs`

## Expansion desks (cong-21�40)
See congressDesks.ts SEEDS + congressSourcesExpansion.ts / congressStoriesExpansion.ts.

