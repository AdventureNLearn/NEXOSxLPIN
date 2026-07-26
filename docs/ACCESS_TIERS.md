# Access tiers — free vs key vs paid

**Updated:** 2026-07-24  
**Rule:** Prefer free/public. Never invent credentials.

---

## LIVE NOW (no API key, no paid plan)

| Integration | Module / proxy | Notes |
|-------------|----------------|-------|
| USASpending.gov | `publicApi/usaspending` + `/api/usaspending` | Phase A |
| Overpass (OSM/Deflock tags) | `deflockService` + `/api/overpass` | Expanded tags + 5m session cache |
| Nominatim forward + **reverse** | `locationService` + `/api/nominatim` | Rate-limit ~1 req/s |
| U.S. Census Geocoder | `publicApi/censusGeo` + `/api/census` | County/place/state attach |
| OpenFEMA | `publicApi/openFema` + `/api/openfema` | Declaration context (Inference for funding) |
| NDAA §889 static snapshot | `data/ndaa889.ts` | Manual refresh metadata |
| Static catalogs | federal programs, devices, states, install | Offline fallbacks |

---

## FREE but **registration / API key required** (not wired)

These are **not paid subscriptions**, but you must create a free account and store a key before wiring.

| Source | Why key | Use in Nexus |
|--------|---------|--------------|
| **SAM.gov** API | Free API key from sam.gov | Assistance listings, UEI, entity flags |
| **Congress.gov** API | Free key from api.data.gov / Congress | Statute/bill spine |
| **CourtListener** | Free account; key raises rate limits | 4A / ALPR opinions |
| **data.gov / api.data.gov** gateway keys | Some federal APIs share this | Misc open datasets |
| **LegiScan** | Free tier limited; commercial plan paid | State bill text at scale |

---

## PAID or commercial (do not wire without budget plan)

| Source | Cost shape | Notes |
|--------|------------|-------|
| **LegiScan** commercial / high volume | Paid tiers | Beyond free daily caps |
| **Google Maps / Places / Geocoding** | Paid after free credits | We use Census + Nominatim instead |
| **Mapbox / HERE / Esri ArcGIS Online** commercial | Paid | Optional basemaps only |
| **Lexis / Westlaw / paid dockets** | Paid | Not required for public-records posture |
| **Clear / private people-search / commercial ALPR vendor APIs** | Paid + ToS risk | Out of scope for public compliance audit |
| **Premium Overpass hosts** | Sometimes paid | Public instances + cache first |
| **Commercial FOIA SaaS** | Paid | Optional later |

---

## FREE bulk / scrape-with-care (no key; ToS + rate limits)

| Source | Notes |
|--------|-------|
| Grants.gov bulk XML/CSV | Prefer bulk over fragile HTML |
| State legislature open data | Per-state; no single free national API |
| Municipal Socrata / ArcGIS Hub | Free where portals publish open data |
| FCC ULS public search | Free; brittle HTML/API mix |
| SEC EDGAR | Free; vendor context Inference only |
| FHWA / state DOT open layers | Free where published |
| BIS / covered ICTS bulk PDF/CSV | Free official drops for NDAA refresh |

---

## Implementation status

| Item | Status |
|------|--------|
| Phase A USASpending | Done |
| Census + reverse Nominatim + OpenFEMA + Overpass harden | Done this turn |
| SAM.gov | **Blocked on free API key** |
| Congress.gov | **Blocked on free API key** |
| CourtListener | **Blocked on free key (optional)** |
| LegiScan full | Free tier or **paid** |
| Google/Mapbox | **Paid — skipped** |
