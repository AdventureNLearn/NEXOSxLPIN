# Public Data APIs — Roadside Surveillance Device Compliance Audit

**Class:** Roadside Surveillance Device Compliance  
**Pillars:** Funding · Distribution · Data Sharing · Density · Public Accountability  
**Mode:** Dynamic (live sources preferred; static catalogs are fallbacks)  
**Rule:** Every claim stays Evidence / Inference / Assumption. No auto file dump.

This document outlines external APIs and public endpoints Nexus should wire to move from catalog-assisted audits to comprehensive, source-backed packages.

---

## Current live integrations (baseline)

| Source | Purpose | Status in Nexus |
|--------|---------|-----------------|
| OpenStreetMap **Overpass** | ALPR / camera density (Deflock-compatible tags) | Live (`deflockService` + Vite proxy) |
| **Nominatim** | Geocode location labels → lat/lng | Live (`locationService`) |
| **USASpending.gov** | Federal awards by recipient + keywords (Funding pillar) | **Phase A live** (`src/lib/publicApi/usaspending.ts` + Vite `/api/usaspending` proxy) |
| Static catalogs | Federal programs, devices, states, install conditions | In-repo fallbacks (kept when live fails) |

Everything below is the gap list for a **fully comprehensive** audit.

---

## Tier 1 — Must-have for funding + awards (Evidence spine)

### 1. USASpending.gov API — **Phase A DONE**
- **Why:** Separate local LE budget claims from federal award dollars (FUNDING_SEPARATION).
- **Base:** `https://api.usaspending.gov/api/v2/`
- **Dev proxy:** `/api/usaspending` → `https://api.usaspending.gov` (browser calls `/api/usaspending/api/v2/...`)
- **Modules:**
  - `src/lib/publicApi/usaspending.ts` — `searchAwardsForAgency`, optional `fetchAwardDetail`
  - `src/lib/publicApi/evidenceBridge.ts` — award rows → Evidence/Inference + zero-hit Evidence
  - `src/lib/publicApi/rateLimit.ts` — token bucket
  - `src/lib/publicApi/enrichFunding.ts` — wired from `populateFromAudit`
- **Primary calls (wired):**
  - `POST /search/spending_by_award/` — awards by recipient + keywords ✅
  - `GET /awards/{award_id}/` — optional detail helper (not required for list path) ✅ helper
  - `POST /search/spending_by_geography/` — metro / county rollups — residual
  - `POST /recipient/children/` — agency hierarchy — residual
- **Query shape:** recipient name + keywords (`ALPR`, `license plate`, `camera`, `surveillance`, `Flock`, `Rekor`, `Motorola`, `ITS`, `public safety technology`)
- **Maps to:** Funding research note, dual-column matrix rows, evidence/sources, AuditWorkbench status line
- **Evidence class:** Award rows with IDs → **Evidence** only with SOW language; keyword-only hits → **Inference**; zero HTTP hits → **Evidence** (searched none); network fail → **Assumption** + `missingData` (no fake rows)
- **Auth / CORS:** Public API; Vite proxy in dev
- **Priority:** P0 — **Phase A complete**; residual: geography rollups, recipient hierarchy, production reverse-proxy

### 2. SAM.gov / Assistance Listings (CFDA successors)
- **Why:** Normalize program families already sketched in `federalFundingPrograms.ts`.
- **Base:** `https://api.sam.gov/` (API key required)
- **Calls:** Assistance listings search; entity registration for vendor / recipient UEI
- **Maps to:** Program catalog enrichment, NDAA §889 entity flags where published
- **Priority:** P0

### 3. Grants.gov / NOFO search (where API or bulk extract available)
- **Why:** Current solicitations that can fund roadside / public-safety tech.
- **Use:** Opportunity number, agency, eligibility, award ceiling
- **Maps to:** “All fundable programs” screen, missing-data prompts
- **Priority:** P1 (bulk XML/CSV acceptable if REST is thin)

### 4. FEMA OpenFEMA
- **Why:** HSGP / UASI / SHSP pass-through often funds cameras and fusion tooling.
- **Base:** `https://www.fema.gov/about/openfema/api`
- **Calls:** Disaster and grant-related datasets where ALPR/ITS appears in narratives
- **Priority:** P1

---

## Tier 2 — Density, siting, ROW (GIS spine)

### 5. Overpass API (expand tags)
- **Already live.** Expand query set:
  - `man_made=surveillance`
  - `surveillance:type=ALPR` / `license_plate`
  - brand/operator tags when present
- **Maps to:** Density pillar, Deflock panel, GIS markers
- **Priority:** P0 (harden + cache)

### 6. Nominatim / photon (geocode)
- **Already live.** Add reverse-geocode for pin → jurisdiction label.
- **Priority:** P0

### 7. US Census Geocoder + TIGER/Cartographic
- **Why:** Place device in county / place / tract for jurisdiction routing.
- **Base:** `https://geocoding.geo.census.gov/geocoder/`
- **Maps to:** state/local law pack selection, FOIA target agency guess
- **Priority:** P1

### 8. FHWA / state DOT open data (where published)
- **Why:** ROW, functional class, speed, NHS — drives install-condition engine.
- **Examples:** state ArcGIS FeatureServers, FHWA HPMS extracts
- **Maps to:** Design Lab conditions (clear zone, curb vs shoulder, typically-not-allowed on signal poles)
- **Priority:** P1 (per-state adapters)

### 9. OpenAddresses / local open address points (optional)
- **Why:** Nearest public facility / intersection labeling without inventing parcels
- **Priority:** P2

---

## Tier 3 — Vendor, trade, NDAA §889 (device spine)

### 10. FCC ULS / ASR (if radio backhaul claimed)
- **Why:** Some fixed sites have licensed links; evidence of physical install
- **Priority:** P2

### 11. BIS / entity & covered ICTS public lists (NDAA §889 adjacency)
- **Why:** Covered telecommunications / video-surveillance supplier screening
- **Note:** Prefer official bulk lists + dated snapshot hash in audit package
- **Maps to:** NDAA_889 findings, OEM panel
- **Priority:** P0 for static snapshot; P1 for automated refresh

### 12. GSA Schedules / government price lists (public)
- **Why:** Contract vehicle hints for agencies buying cameras/ALPR SaaS
- **Priority:** P2

### 13. SEC EDGAR (public companies only)
- **Why:** Vendor revenue / product segment language (Inference, not install proof)
- **Priority:** P2

---

## Tier 4 — Law, policy, retention, sharing (accountability spine)

### 14. Congress.gov API
- **Why:** Federal statutes / bills touching ALPR, FISA-adjacent discourse, appropriations riders
- **Base:** `https://api.congress.gov/` (API key)
- **Priority:** P1

### 15. GovInfo / USLM (statutes)
- **Why:** Stable cites for NDAA sections, privacy acts
- **Priority:** P1

### 16. State legislature open data (per state)
- **Why:** ALPR-specific statutes (retention, sharing, warrant rules) — today `states50.ts` is discourse-grade
- **Pattern:** LegiScan API **or** state bulk; start with high-ALPR states (CA, VA, TX, FL, GA, IL, NY, AZ)
- **Maps to:** STATE_PRIVACY findings
- **Priority:** P0 for top-10 states; P1 remainder

### 17. CourtListener / RECAP (case law)
- **Why:** 4A and ALPR case trail (Evidence when opinion text retrieved)
- **Base:** `https://www.courtlistener.com/api/rest/v4/`
- **Priority:** P1

### 18. Municipal open data portals (Socrata / ArcGIS Hub)
- **Why:** Contracts, APRA/FOIA logs, camera inventories, budget line items
- **Pattern:** Adapter interface `MunicipalPortalAdapter { searchContracts, searchBudgets, searchCameraInventory }`
- **Examples:** city/county Socrata `*.json` SODA endpoints
- **Priority:** P0 for pilot metro (e.g. Atlanta region); template thereafter

### 19. Police / city budget PDFs (no single API)
- **Why:** Local LE own-source purchases
- **Approach:** URL registry + PDF text extract (ocr-and-documents skill path) on **explicit** user fetch
- **Priority:** P1

---

## Tier 5 — Distribution & data sharing (pathway spine)

### 20. State fusion center / HIDTA public pages (scrape registry, not silent crawl farm)
- **Why:** Multi-agency sharing topology
- **Evidence:** Only what is published; else Assumption + FOIA prompt
- **Priority:** P2

### 21. Vendor trust / partner network pages (documented public marketing)
- **Why:** Capture → cloud → agency → commercial hop diagram
- **Rule:** Marketing = Inference unless contract/FOIA confirms
- **Priority:** P1

### 22. Breach / incident public notices (state AG portals where API/bulk exists)
- **Why:** Accountability when ALPR vendors appear in notices
- **Priority:** P2

---

## Recommended Nexus architecture

```
Browser (Nexus UI)
    │
    ├─ direct (CORS-ok): Overpass, Nominatim (rate-limited)
    │
    └─ /api/*  Vite proxy OR small local Hermes/Node bridge
            ├─ usaspending
            ├─ sam
            ├─ congress
            ├─ courtlistener
            ├─ census-geocode
            ├─ state-leg (adapter)
            └─ municipal (adapter per portal)
```

### Module map (proposed)

| Module | Role |
|--------|------|
| `src/lib/publicApi/usaspending.ts` | Award search + award detail |
| `src/lib/publicApi/samListings.ts` | Assistance listings / UEI |
| `src/lib/publicApi/congressGov.ts` | Bill/statute snippets |
| `src/lib/publicApi/courtListener.ts` | ALPR/4A opinions |
| `src/lib/publicApi/censusGeo.ts` | County/place attach |
| `src/lib/publicApi/municipal/types.ts` | Portal adapter interface |
| `src/lib/publicApi/municipal/atlanta.ts` | Pilot adapter |
| `src/lib/publicApi/rateLimit.ts` | Token bucket + cache |
| `src/lib/publicApi/evidenceBridge.ts` | API row → `EvidenceItem` + source cite |
| `auditEngine` / `privacyEngine` | Consume live packs; static fallback if offline |

### Evidence bridge contract (required)

Every API hit becomes:

```ts
{
  sourceId: string           // stable
  title: string
  citation: string           // URL + retrievedAt + query hash
  publicRecord: true
  retrievedAt: ISO string
  class: 'Evidence' | 'Inference' | 'Assumption'
  confidence: 'high' | 'medium' | 'low'
  rawRef?: string            // cache key, not dumped unless Export Kit
}
```

### Caching rules
- Session cache in memory; optional IndexedDB
- Export Oversight Kit only on explicit user action (include source URLs + timestamps)
- Never invent award amounts; missing → `missingData[]` prompt

---

## Phase A status (USASpending live)

**Status:** Implemented

| Piece | Path |
|-------|------|
| Vite proxy | `vite.config.ts` → `/api/usaspending` |
| Client | `src/lib/publicApi/usaspending.ts` |
| Evidence bridge | `src/lib/publicApi/evidenceBridge.ts` |
| Enrich | `src/lib/publicApi/enrichFunding.ts` |
| Wire | `populateFromAudit` in `App.tsx` + `replaceActiveAudit` in store |

### Behavior
1. On audit populate, derive recipient from query/location
2. POST grants + contracts separately to USASpending spending_by_award
3. Strong ALPR text → **Evidence**; weak camera text → **Inference**; zero-hit success → **Evidence**; network fail → **Assumption** + missingData
4. Funding research note + structured brief get live markdown section
5. Static `FEDERAL_GRANT_PROGRAMS` checklist always retained

### Residual
- SAM.gov, Congress, CourtListener, municipal adapters = later phases
- Production deploy needs same proxy or backend bridge (browser CORS)
- Recipient derivation is heuristic — improve with Census geo later

---

## Implementation phases

### Phase A — Funding live — **DONE**
1. Proxy + USASpending award search by agency/recipient hint  
2. Attach results to Funding note + findings  
3. Keep static `FEDERAL_GRANT_PROGRAMS` as checklist of program classes  


### Phase B — Density + jurisdiction (already partial)
1. Harden Overpass + reverse geocode  
2. Census county/place attach  
3. Auto-select state privacy pack  

### Phase C — Law pack refresh
1. Congress.gov + CourtListener for federal spine  
2. LegiScan/state bulk for top-10 ALPR states  

### Phase D — Municipal pilot
1. One metro open-data adapter (contracts + budgets)  
2. Template for next cities  

### Phase E — NDAA refresh
1. Dated official covered-list snapshot in repo  
2. Optional auto-refresh job (cron) with hash diff in log  

---

## What stays offline / FOIA (no API substitutes)

- Actual ALPR **sharing MOUs** and non-LE recipient lists  
- Unreleased **SOWs** and invoice line items  
- **Private** HOA / vendor-financed installs without public record  
- Engineering **as-built** certified drawings  

These remain `missingData` + remediation hints (FOIA language), never fabricated.

---

## Success criteria for “comprehensive”

| Pillar | Live signal |
|--------|-------------|
| Funding | ≥1 USASpending query result set or explicit zero-hit Evidence |
| Distribution | Pathway diagram with each hop sourced or marked Assumption |
| Data sharing | State statute pack + any municipal policy URL retrieved |
| Density | Overpass/Deflock points in bbox with timestamp |
| Accountability | FOIA/request checklist generated; export only on demand |

---

## Non-goals
- Not a vendor-branded product  
- Not legal advice  
- Not automatic mass scraping of paywalled or ToS-hostile targets  
- Not silent cross-domain legacy audits (DoD etc.)

---

*Human locus of responsibility. Evidence-gated. Dynamic mode.*
