/**
 * Mesh family catalog — 100+ unique scene families.
 * Correlated to industry surfaces and SME domains for dynamic selection.
 * Geometry is illustrative training geometry, not certified product design.
 */

import type { SmeDomain } from '../../types/sme'

/** Layout recipe kinds — each produces structurally different meshes */
export type MeshLayoutKind =
  | 'vehicle'
  | 'vessel'
  | 'building'
  | 'tower'
  | 'cabinet'
  | 'stack'
  | 'cluster'
  | 'path'
  | 'barrier'
  | 'debris'
  | 'pad'
  | 'drone'
  | 'radial'
  | 'arch'
  | 'pipe'
  | 'tank'
  | 'lattice'
  | 'canopy'
  | 'platform'
  | 'row'
  | 'crane'
  | 'array'
  | 'rack'
  | 'frame'
  | 'locus'
  | 'silo'
  | 'console'
  | 'gantry'
  | 'module'
  | 'hull_armor'

export type DepthLayer = 'foreground' | 'midground' | 'background'

export interface MeshFamily {
  /** Unique stable id */
  id: string
  /** Human name */
  name: string
  /** One-line role in a story */
  role: string
  /** Industry / sector tags for desk matching */
  industries: string[]
  /** SME domains this family supports */
  smeDomains: SmeDomain[]
  /** Claim/evidence keyword hooks */
  keywords: string[]
  /** Geometry layout recipe */
  layout: MeshLayoutKind
  /** Seed 0–999 for unique proportions (no twin geometry) */
  seed: number
  /** Depth layer for multi-select composition */
  depth: DepthLayer
  /** Accent hue hint */
  accent: string
}

function f(
  id: string,
  name: string,
  role: string,
  industries: string[],
  smeDomains: SmeDomain[],
  keywords: string[],
  layout: MeshLayoutKind,
  seed: number,
  depth: DepthLayer,
  accent: string,
): MeshFamily {
  return { id, name, role, industries, smeDomains, keywords, layout, seed, depth, accent }
}

/**
 * 105 unique mesh families — ids and names must stay unique.
 * Organized by sector affinity; many cross-link multiple SME domains.
 */
export const MESH_FAMILIES: MeshFamily[] = [
  // —— Civic / scene (12) ——
  f('mf-civic-path-strip', 'Path strip', 'Sidewalk / park path geometry', ['civic', 'events', 'public space'], ['jurisdiction', 'method-process'], ['path', 'sidewalk', 'walkway', 'park'], 'path', 11, 'midground', '#94a3b8'),
  f('mf-civic-crowd-plaza', 'Crowd plaza', 'People density sketch', ['civic', 'events', 'venues'], ['method-process', 'oversight'], ['crowd', 'pedestrian', 'attendee', 'plaza'], 'cluster', 12, 'foreground', '#64748b'),
  f('mf-civic-barrier-cordon', 'Barrier cordon', 'Police / event cordon line', ['civic', 'public order'], ['oversight', 'jurisdiction'], ['cordon', 'barrier', 'fence', 'standoff'], 'barrier', 13, 'midground', '#fbbf24'),
  f('mf-civic-refuge-canopy', 'Refuge canopy', 'Muster / shelter node', ['civic', 'emergency'], ['oversight', 'civil-structural'], ['refuge', 'muster', 'shelter', 'evac'], 'canopy', 14, 'midground', '#0ea5e9'),
  f('mf-civic-media-riser', 'Media riser', 'Broadcast platform edge', ['media', 'events'], ['public-records', 'method-process'], ['media', 'press', 'broadcast', 'riser'], 'platform', 15, 'foreground', '#22d3ee'),
  f('mf-civic-assembly-stage', 'Assembly stage', 'Stage / dais for gatherings', ['events', 'venues'], ['oversight'], ['stage', 'assembly', 'rally'], 'platform', 16, 'midground', '#a78bfa'),
  f('mf-civic-egress-gate', 'Egress gate', 'Exit control geometry', ['venues', 'transit'], ['civil-structural', 'jurisdiction'], ['egress', 'exit', 'gate'], 'barrier', 17, 'midground', '#f59e0b'),
  f('mf-civic-standoff-line', 'Standoff line', 'Distance marker from harm', ['civic', 'media'], ['method-process'], ['standoff', 'distance', 'line'], 'barrier', 18, 'foreground', '#fb7185'),
  f('mf-civic-wayfinding', 'Wayfinding post', 'Directional post only when needed', ['civic', 'transit'], ['method-process'], ['wayfinding', 'sign', 'post'], 'tower', 19, 'background', '#94a3b8'),
  f('mf-civic-plaza-pad', 'Plaza pad', 'Open hardscape pad', ['civic', 'venues'], ['civil-structural'], ['plaza', 'pad', 'square'], 'pad', 20, 'background', '#475569'),
  f('mf-civic-flood-gauge', 'Flood gauge', 'Water-level marker', ['civic', 'water', 'insurance'], ['civil-structural', 'applied-physical-sciences'], ['flood', 'gauge', 'water level'], 'tower', 21, 'foreground', '#38bdf8'),
  f('mf-civic-levee-section', 'Levee section', 'Embankment sketch', ['civic', 'water', 'infrastructure'], ['civil-structural'], ['levee', 'embankment', 'dike'], 'row', 22, 'background', '#78716c'),

  // —— Transport (14) ——
  f('mf-transport-vehicle-sedan', 'Sedan vehicle', 'Car body stand-in', ['auto', 'transport', 'insurance'], ['mechanical-engineering', 'sector-regulatory'], ['vehicle', 'car', 'sedan'], 'vehicle', 31, 'foreground', '#22d3ee'),
  f('mf-transport-vehicle-truck', 'Truck vehicle', 'Truck / van body', ['logistics', 'freight', 'transport'], ['mechanical-engineering', 'sector-regulatory'], ['truck', 'van', 'freight vehicle'], 'vehicle', 32, 'foreground', '#64748b'),
  f('mf-transport-vehicle-bus', 'Bus vehicle', 'Transit bus body', ['transit', 'transport'], ['mechanical-engineering', 'jurisdiction'], ['bus', 'transit'], 'vehicle', 33, 'midground', '#475569'),
  f('mf-transport-rail-car', 'Rail car', 'Rolling stock body', ['rail', 'freight', 'transit'], ['mechanical-engineering', 'civil-structural'], ['rail', 'train', 'rolling stock'], 'vehicle', 34, 'midground', '#334155'),
  f('mf-transport-rail-switch', 'Rail switch', 'Track switch geometry', ['rail', 'infrastructure'], ['civil-structural'], ['switch', 'track', 'rail junction'], 'frame', 35, 'background', '#94a3b8'),
  f('mf-transport-vessel-hull', 'Vessel hull', 'Ship on water plane', ['maritime', 'shipping', 'energy'], ['mechanical-engineering', 'sector-regulatory'], ['ship', 'vessel', 'maritime'], 'vessel', 36, 'midground', '#0ea5e9'),
  f('mf-transport-vessel-barge', 'Barge hull', 'Low barge profile', ['maritime', 'inland waterway'], ['mechanical-engineering'], ['barge', 'inland', 'tow'], 'vessel', 37, 'midground', '#0369a1'),
  f('mf-transport-port-crane', 'Port crane', 'Quayside crane arm', ['ports', 'logistics', 'shipping'], ['mechanical-engineering', 'civil-structural'], ['crane', 'port', 'quay'], 'crane', 38, 'background', '#fbbf24'),
  f('mf-transport-runway-pad', 'Runway pad', 'Airfield pad sketch', ['aviation', 'airports'], ['aerospace-defense-tech', 'civil-structural'], ['runway', 'taxiway', 'airfield'], 'pad', 39, 'background', '#64748b'),
  f('mf-transport-drone-quad', 'Quadcopter pad', 'UAS quad + pad', ['uas', 'logistics', 'security'], ['aerospace-defense-tech', 'computing-cyberphysical'], ['drone', 'uas', 'quadcopter', 'bvlos'], 'drone', 40, 'foreground', '#22d3ee'),
  f('mf-transport-drone-fixed', 'Fixed-wing UAS', 'Fixed-wing UAS sketch', ['uas', 'defense', 'survey'], ['aerospace-defense-tech'], ['fixed-wing', 'uas', 'rpas'], 'drone', 41, 'foreground', '#67e8f9'),
  f('mf-transport-cargo-box', 'Cargo container', 'ISO container stand-in', ['logistics', 'ports', 'trade'], ['sector-regulatory', 'mechanical-engineering'], ['container', 'cargo', 'box'], 'module', 42, 'midground', '#0ea5e9'),
  f('mf-transport-av-stack', 'AV sensor stack', 'Autonomous vehicle sensor bar', ['auto', 'av', 'semiconductors'], ['computing-cyberphysical', 'electrical-electronics'], ['av', 'lidar', 'autonomous'], 'frame', 43, 'foreground', '#a78bfa'),
  f('mf-transport-ev-charger', 'EV charger', 'Charge pedestal', ['auto', 'energy', 'utilities'], ['electrical-electronics', 'energy-nuclear'], ['charger', 'ev', 'charging'], 'tower', 44, 'midground', '#34d399'),

  // —— Energy (14) ——
  f('mf-energy-solar-array', 'Solar array', 'Panel row sketch', ['energy', 'utilities', 'developers'], ['energy-nuclear', 'electrical-electronics'], ['solar', 'pv', 'panel'], 'array', 51, 'background', '#fbbf24'),
  f('mf-energy-wind-nacelle', 'Wind nacelle', 'Tower + nacelle', ['energy', 'utilities', 'offshore'], ['energy-nuclear', 'mechanical-engineering'], ['wind', 'turbine', 'nacelle'], 'tower', 52, 'background', '#94a3b8'),
  f('mf-energy-smr-containment', 'SMR containment', 'Small modular reactor massing', ['nuclear', 'utilities', 'smr'], ['energy-nuclear', 'civil-structural'], ['smr', 'nuclear', 'reactor'], 'building', 53, 'midground', '#22d3ee'),
  f('mf-energy-substation', 'Substation bay', 'Bay equipment row', ['utilities', 'grid', 'transmission'], ['electrical-electronics', 'energy-nuclear'], ['substation', 'grid', 'bay'], 'row', 54, 'midground', '#fbbf24'),
  f('mf-energy-pipeline', 'Pipeline run', 'Pipe segments', ['energy', 'midstream', 'oil gas'], ['mechanical-engineering', 'chemical-process'], ['pipeline', 'pipe', 'midstream'], 'pipe', 55, 'background', '#78716c'),
  f('mf-energy-lng-tank', 'LNG tank', 'Spherical / tank storage', ['lng', 'energy', 'export'], ['chemical-process', 'energy-nuclear'], ['lng', 'tank', 'cryogenic'], 'tank', 56, 'midground', '#38bdf8'),
  f('mf-energy-battery-rack', 'Battery rack', 'BESS rack row', ['storage', 'utilities', 'grid'], ['electrical-electronics', 'energy-nuclear'], ['battery', 'bess', 'storage'], 'rack', 57, 'midground', '#34d399'),
  f('mf-energy-tx-tower', 'Transmission tower', 'Lattice TX tower', ['transmission', 'utilities'], ['electrical-electronics', 'civil-structural'], ['transmission', 'high voltage', 'pylon'], 'lattice', 58, 'background', '#94a3b8'),
  f('mf-energy-wellhead', 'Wellhead pad', 'Well pad equipment', ['oil gas', 'upstream'], ['mechanical-engineering', 'chemical-process'], ['wellhead', 'well pad', 'upstream'], 'pad', 59, 'midground', '#a16207'),
  f('mf-energy-cooling-tower', 'Cooling tower', 'Hyperboloid sketch', ['nuclear', 'thermal', 'utilities'], ['energy-nuclear', 'civil-structural'], ['cooling tower', 'thermal'], 'tower', 60, 'background', '#cbd5e1'),
  f('mf-energy-transformer', 'Transformer pad', 'Pad-mount transformer', ['utilities', 'grid'], ['electrical-electronics'], ['transformer', 'pad-mount'], 'module', 61, 'midground', '#64748b'),
  f('mf-energy-fuel-silo', 'Fuel silo', 'Vertical silo', ['energy', 'agribusiness', 'bulk'], ['mechanical-engineering'], ['silo', 'fuel store', 'bulk'], 'silo', 62, 'background', '#78716c'),
  f('mf-energy-hydrogen-skid', 'Hydrogen skid', 'Skid-mounted process module', ['hydrogen', 'energy'], ['chemical-process', 'mechanical-engineering'], ['hydrogen', 'skid', 'h2'], 'module', 63, 'midground', '#67e8f9'),
  f('mf-energy-metering-skid', 'Metering skid', 'Custody transfer skid', ['midstream', 'utilities'], ['mechanical-engineering', 'mathematics-statistics'], ['metering', 'custody', 'flow'], 'module', 64, 'foreground', '#22d3ee'),

  // —— Manufacturing / materials (14) ——
  f('mf-mfg-foundry-bay', 'Foundry bay', 'Process bay massing', ['semiconductors', 'foundries', 'manufacturing'], ['materials-manufacturing', 'mechanical-engineering'], ['foundry', 'fab', 'bay'], 'building', 71, 'midground', '#a78bfa'),
  f('mf-mfg-cnc-cell', 'CNC cell', 'Machine cell envelope', ['manufacturing', 'defense', 'auto'], ['mechanical-engineering', 'materials-manufacturing'], ['cnc', 'machine cell', 'machining'], 'frame', 72, 'foreground', '#64748b'),
  f('mf-mfg-conveyor', 'Conveyor line', 'Belt / line geometry', ['manufacturing', 'logistics', 'warehousing'], ['mechanical-engineering'], ['conveyor', 'line', 'belt'], 'pipe', 73, 'midground', '#94a3b8'),
  f('mf-mfg-wafer-tool', 'Wafer tool', 'Process tool envelope', ['semiconductors', 'eda', 'osat'], ['materials-manufacturing', 'electrical-electronics'], ['wafer', 'tool', 'semiconductor tool'], 'module', 74, 'foreground', '#22d3ee'),
  f('mf-mfg-assembly-line', 'Assembly line', 'Station row', ['auto', 'electronics', 'manufacturing'], ['mechanical-engineering', 'method-process'], ['assembly line', 'station'], 'row', 75, 'midground', '#475569'),
  f('mf-mfg-warehouse-rack', 'Warehouse rack', 'High-bay rack', ['warehousing', 'logistics', 'retail'], ['civil-structural', 'mechanical-engineering'], ['rack', 'warehouse', 'high-bay'], 'rack', 76, 'background', '#64748b'),
  f('mf-mfg-osat-handler', 'OSAT handler', 'Backend handler sketch', ['osat', 'semiconductors'], ['materials-manufacturing', 'electrical-electronics'], ['osat', 'handler', 'packaging'], 'gantry', 77, 'foreground', '#a78bfa'),
  f('mf-mfg-press-frame', 'Press frame', 'Stamping press frame', ['auto', 'metals', 'manufacturing'], ['mechanical-engineering', 'materials-manufacturing'], ['press', 'stamp', 'forming'], 'frame', 78, 'midground', '#78716c'),
  f('mf-mfg-cleanroom', 'Cleanroom module', 'Modular clean envelope', ['semiconductors', 'biotech', 'pharma'], ['materials-manufacturing', 'biomedical-systems'], ['cleanroom', 'iso class'], 'module', 79, 'midground', '#e2e8f0'),
  f('mf-mfg-injection', 'Injection press', 'Molding press body', ['plastics', 'manufacturing'], ['mechanical-engineering', 'chemical-process'], ['injection', 'molding'], 'frame', 80, 'foreground', '#64748b'),
  f('mf-mfg-metrology', 'Metrology gantry', 'Inspection gantry', ['semiconductors', 'aerospace', 'auto'], ['mathematics-statistics', 'materials-manufacturing'], ['metrology', 'cmm', 'inspection'], 'gantry', 81, 'foreground', '#22d3ee'),
  f('mf-mfg-pallet', 'Pallet stack', 'Palletized goods', ['logistics', 'warehousing'], ['method-process'], ['pallet', 'stack', 'goods'], 'stack', 82, 'midground', '#a16207'),
  f('mf-mfg-robot-cell', 'Robot cell', 'Workcell with arm envelope', ['auto', 'electronics', 'manufacturing'], ['mechanical-engineering', 'computing-cyberphysical'], ['robot', 'workcell', 'cobot'], 'frame', 83, 'foreground', '#fbbf24'),
  f('mf-mfg-heat-treat', 'Heat-treat furnace', 'Furnace massing', ['metals', 'aerospace', 'manufacturing'], ['materials-manufacturing', 'chemical-process'], ['furnace', 'heat treat', 'anneal'], 'building', 84, 'midground', '#b45309'),

  // —— Health / bio (10) ——
  f('mf-health-hospital-wing', 'Hospital wing', 'Clinical massing', ['hospitals', 'health systems'], ['biomedical-systems', 'civil-structural'], ['hospital', 'clinic', 'wing'], 'building', 91, 'background', '#67e8f9'),
  f('mf-health-pharmacy', 'Pharmacy counter', 'Dispense counter', ['pharmacies', 'pharma', '340b'], ['biomedical-systems', 'sector-regulatory'], ['pharmacy', '340b', 'dispense'], 'console', 92, 'foreground', '#34d399'),
  f('mf-health-device-tray', 'Device tray', 'Device kit tray', ['device oems', 'hospitals'], ['biomedical-systems', 'electrical-electronics'], ['device', 'tray', 'kit'], 'stack', 93, 'foreground', '#22d3ee'),
  f('mf-health-ambulance', 'Ambulance bay', 'Vehicle + bay', ['ems', 'hospitals'], ['biomedical-systems', 'mechanical-engineering'], ['ambulance', 'ems'], 'vehicle', 94, 'midground', '#fb7185'),
  f('mf-health-lab-bench', 'Lab bench', 'Bench + instruments', ['labs', 'biotech', 'pharma'], ['biomedical-systems', 'chemical-process'], ['lab', 'bench', 'assay'], 'console', 95, 'foreground', '#a78bfa'),
  f('mf-health-imaging', 'Imaging gantry', 'CT/MRI envelope sketch', ['hospitals', 'device oems'], ['biomedical-systems', 'electrical-electronics'], ['imaging', 'mri', 'ct'], 'gantry', 96, 'midground', '#67e8f9'),
  f('mf-health-bio-cabinet', 'Biosafety cabinet', 'BSC envelope', ['labs', 'biotech'], ['biomedical-systems', 'chemical-process'], ['biosafety', 'bsc', 'cabinet'], 'cabinet', 97, 'foreground', '#34d399'),
  f('mf-health-triage-tent', 'Triage tent', 'Field triage canopy', ['emergency', 'hospitals'], ['biomedical-systems', 'oversight'], ['triage', 'field hospital'], 'canopy', 98, 'midground', '#fbbf24'),
  f('mf-health-cold-chain', 'Cold-chain unit', 'Refrigerated unit', ['pharma', 'logistics', 'vaccines'], ['biomedical-systems', 'mechanical-engineering'], ['cold chain', 'refrigerated', 'vaccine'], 'module', 99, 'midground', '#38bdf8'),
  f('mf-health-sterile-pack', 'Sterile pack cart', 'Sterile supply cart', ['hospitals', 'device oems'], ['biomedical-systems', 'method-process'], ['sterile', 'pack', 'or supply'], 'module', 100, 'foreground', '#e2e8f0'),

  // —— Defense / aero (10) ——
  f('mf-def-radar-dome', 'Radar dome', 'Sensor dome', ['defense', 'aerospace'], ['aerospace-defense-tech', 'electrical-electronics'], ['radar', 'dome', 'sensor'], 'tank', 111, 'background', '#94a3b8'),
  f('mf-def-hangar', 'Hangar bay', 'Hangar massing', ['defense', 'aviation', 'mro'], ['aerospace-defense-tech', 'civil-structural'], ['hangar', 'mro'], 'building', 112, 'background', '#475569'),
  f('mf-def-launch-rail', 'Launch rail', 'Rail / launcher sketch', ['defense', 'space'], ['aerospace-defense-tech', 'mechanical-engineering'], ['launch', 'rail', 'launcher'], 'frame', 113, 'midground', '#fbbf24'),
  f('mf-def-secure-cab', 'Secure cabinet', 'SCIF-adjacent cabinet', ['defense', 'primes'], ['aerospace-defense-tech', 'oversight'], ['secure', 'scif', 'classified store'], 'cabinet', 114, 'foreground', '#334155'),
  f('mf-def-comms-mast', 'Comms mast', 'Defense comms mast', ['defense', 'telecom'], ['aerospace-defense-tech', 'electrical-electronics'], ['comms', 'mast', 'antenna'], 'tower', 115, 'background', '#22d3ee'),
  f('mf-def-armor-hull', 'Armor hull', 'Hull stand-in', ['defense', 'primes'], ['aerospace-defense-tech', 'materials-manufacturing'], ['armor', 'hull', 'vehicle armor'], 'hull_armor', 116, 'midground', '#57534e'),
  f('mf-def-range-target', 'Range target', 'Target silhouette', ['defense', 'training'], ['aerospace-defense-tech', 'method-process'], ['range', 'target'], 'locus', 117, 'foreground', '#fb7185'),
  f('mf-def-sensor-pod', 'Sensor pod', 'Pod under hardpoint', ['defense', 'uas', 'aircraft'], ['aerospace-defense-tech', 'electrical-electronics'], ['pod', 'sensor pod', 'hardpoint'], 'module', 118, 'foreground', '#a78bfa'),
  f('mf-def-sat-dish', 'Satellite dish', 'Ground dish', ['space', 'telecom', 'defense'], ['aerospace-defense-tech', 'electrical-electronics'], ['satellite', 'dish', 'ground station'], 'radial', 119, 'background', '#94a3b8'),
  f('mf-def-bunker-entry', 'Bunker entry', 'Hardened entry massing', ['defense', 'continuity'], ['civil-structural', 'aerospace-defense-tech'], ['bunker', 'hardened', 'coop'], 'building', 120, 'background', '#44403c'),

  // —— Governance / records (12) ——
  f('mf-gov-docket-stack', 'Docket stack', 'Filing stack on bench', ['oversight', 'congress', 'agencies'], ['public-records', 'core-governance', 'oversight'], ['docket', 'filing', 'bill', 'records'], 'stack', 131, 'foreground', '#fef3c7'),
  f('mf-gov-hearing-dais', 'Hearing dais', 'Dais / witness table', ['congress', 'oversight'], ['core-governance', 'oversight'], ['hearing', 'dais', 'testimony'], 'platform', 132, 'midground', '#64748b'),
  f('mf-gov-filing-cabinet', 'Filing cabinet', 'Records cabinet', ['agencies', 'oversight'], ['public-records', 'core-governance'], ['cabinet', 'file', 'archive'], 'cabinet', 133, 'foreground', '#475569'),
  f('mf-gov-ballot-box', 'Ballot box', 'Ballot receptacle', ['elections', 'civic'], ['public-records', 'jurisdiction'], ['ballot', 'election', 'vote box'], 'module', 134, 'foreground', '#22d3ee'),
  f('mf-gov-records-shelf', 'Records shelf', 'Shelf of binders', ['agencies', 'archives'], ['public-records'], ['shelf', 'binder', 'archive'], 'rack', 135, 'midground', '#a16207'),
  f('mf-gov-seal-podium', 'Seal podium', 'Official podium', ['congress', 'agencies'], ['core-governance'], ['podium', 'seal', 'official'], 'platform', 136, 'foreground', '#fbbf24'),
  f('mf-gov-committee-table', 'Committee table', 'Long table geometry', ['congress', 'oversight'], ['core-governance', 'oversight'], ['committee', 'table'], 'console', 137, 'midground', '#78716c'),
  f('mf-gov-crs-cart', 'CRS cart', 'Research cart', ['congress', 'crs'], ['public-records', 'method-process'], ['crs', 'research cart'], 'module', 138, 'foreground', '#34d399'),
  f('mf-gov-gao-wall', 'GAO binder wall', 'Audit binder wall', ['gao', 'oversight'], ['oversight', 'public-records'], ['gao', 'audit', 'binder'], 'rack', 139, 'background', '#94a3b8'),
  f('mf-gov-agency-kiosk', 'Agency kiosk', 'Public-facing kiosk', ['agencies', 'civic'], ['public-records', 'jurisdiction'], ['kiosk', 'service counter'], 'console', 140, 'midground', '#22d3ee'),
  f('mf-gov-foia-bin', 'FOIA intake bin', 'Request intake', ['agencies', 'media'], ['public-records', 'method-process'], ['foia', 'intake', 'request'], 'module', 141, 'foreground', '#a78bfa'),
  f('mf-gov-rulemaking-stack', 'Rulemaking stack', 'NPRM / FR stack', ['agencies', 'sector-regulatory'], ['sector-regulatory', 'public-records'], ['nprm', 'rulemaking', 'federal register'], 'stack', 142, 'foreground', '#fef3c7'),

  // —— Digital / compute (10) ——
  f('mf-dig-server-rack', 'Server rack', '19" rack row', ['cloud', 'data centers', 'software'], ['computing-cyberphysical', 'electrical-electronics'], ['server', 'rack', 'data center'], 'rack', 151, 'midground', '#22d3ee'),
  f('mf-dig-edge-node', 'Edge node', 'Edge appliance', ['telecom', 'cloud', 'iot'], ['computing-cyberphysical'], ['edge', 'appliance', 'node'], 'module', 152, 'foreground', '#67e8f9'),
  f('mf-dig-chip-carrier', 'Chip carrier', 'Die / carrier sketch', ['semiconductors', 'eda'], ['electrical-electronics', 'materials-manufacturing'], ['chip', 'die', 'package'], 'module', 153, 'foreground', '#a78bfa'),
  f('mf-dig-fiber-splice', 'Fiber splice', 'Splice enclosure', ['telecom', 'broadband'], ['electrical-electronics', 'civil-structural'], ['fiber', 'splice', 'broadband'], 'module', 154, 'midground', '#34d399'),
  f('mf-dig-data-hall', 'Data hall row', 'Hot/cold aisle sketch', ['cloud', 'colocation'], ['computing-cyberphysical', 'energy-nuclear'], ['data hall', 'aisle', 'colo'], 'row', 155, 'background', '#475569'),
  f('mf-dig-switch', 'Switch chassis', 'Network switch', ['telecom', 'cloud', 'enterprise'], ['computing-cyberphysical', 'electrical-electronics'], ['switch', 'router', 'chassis'], 'module', 156, 'foreground', '#22d3ee'),
  f('mf-dig-cdu', 'Cooling CDU', 'Coolant distribution', ['data centers', 'cloud'], ['mechanical-engineering', 'computing-cyberphysical'], ['cdu', 'liquid cooling'], 'module', 157, 'midground', '#38bdf8'),
  f('mf-dig-id-scanner', 'ID scanner', 'Identity kiosk', ['identity', 'banks', 'platforms'], ['computing-cyberphysical', 'sector-regulatory'], ['identity', 'scanner', 'idp'], 'console', 158, 'foreground', '#fbbf24'),
  f('mf-dig-hsm', 'HSM vault', 'Hardware security module cage', ['finance', 'cloud', 'crypto'], ['computing-cyberphysical', 'sector-regulatory'], ['hsm', 'keystore', 'vault'], 'cabinet', 159, 'foreground', '#fb7185'),
  f('mf-dig-model-server', 'Model server', 'AI inference node', ['ai', 'cloud', 'labs'], ['computing-cyberphysical', 'mathematics-statistics'], ['model', 'inference', 'gpu node'], 'rack', 160, 'midground', '#a78bfa'),

  // —— Environment (9) ——
  f('mf-env-firebreak', 'Firebreak row', 'Break segments', ['wildfire', 'forestry', 'insurance'], ['civil-structural', 'applied-physical-sciences'], ['firebreak', 'wildfire', 'fire line'], 'row', 171, 'midground', '#f97316'),
  f('mf-env-debris-pile', 'Debris pile', 'Rubble / debris', ['disaster', 'insurance', 'construction'], ['civil-structural', 'method-process'], ['debris', 'rubble', 'damage'], 'debris', 172, 'foreground', '#a8a29e'),
  f('mf-env-smoke-locus', 'Smoke locus', 'Plume / contested locus', ['wildfire', 'industrial'], ['applied-physical-sciences', 'method-process'], ['smoke', 'plume', 'haze'], 'locus', 173, 'foreground', '#fb7185'),
  f('mf-env-sensor-buoy', 'Sensor buoy', 'Water quality buoy', ['water', 'environment'], ['applied-physical-sciences', 'electrical-electronics'], ['buoy', 'water quality'], 'tank', 174, 'midground', '#0ea5e9'),
  f('mf-env-soil-pad', 'Soil sample pad', 'Sampling pad', ['environment', 'mining', 'ag'], ['applied-physical-sciences', 'chemical-process'], ['soil', 'sample', 'pad'], 'pad', 175, 'foreground', '#a16207'),
  f('mf-env-wildlife-fence', 'Wildlife fence', 'Fence line', ['environment', 'transport', 'energy'], ['civil-structural', 'jurisdiction'], ['wildlife', 'fence', 'crossing'], 'barrier', 176, 'background', '#78716c'),
  f('mf-env-carbon-plot', 'Carbon plot marker', 'Offset project marker', ['carbon', 'offsets', 'ag'], ['sector-regulatory', 'applied-physical-sciences'], ['carbon', 'offset', 'plot'], 'locus', 177, 'midground', '#34d399'),
  f('mf-env-air-monitor', 'Air monitor mast', 'AQ monitor', ['environment', 'cities', 'industry'], ['applied-physical-sciences', 'electrical-electronics'], ['air quality', 'monitor', 'aqi'], 'tower', 178, 'foreground', '#22d3ee'),
  f('mf-env-spill-boom', 'Spill boom', 'Containment boom', ['maritime', 'environment', 'oil gas'], ['chemical-process', 'mechanical-engineering'], ['boom', 'spill', 'containment'], 'barrier', 179, 'midground', '#fbbf24'),
]

/** Hard uniqueness guards at module load */
function assertCatalogUnique(list: MeshFamily[]): void {
  const ids = new Set<string>()
  const names = new Set<string>()
  for (const m of list) {
    if (ids.has(m.id)) throw new Error(`Duplicate mesh family id: ${m.id}`)
    if (names.has(m.name.toLowerCase())) throw new Error(`Duplicate mesh family name: ${m.name}`)
    ids.add(m.id)
    names.add(m.name.toLowerCase())
  }
  if (list.length < 100) throw new Error(`Mesh catalog must have ≥100 families, got ${list.length}`)
}

assertCatalogUnique(MESH_FAMILIES)

export const MESH_FAMILY_COUNT = MESH_FAMILIES.length

export function getMeshFamily(id: string): MeshFamily | undefined {
  return MESH_FAMILIES.find((m) => m.id === id)
}

export function listMeshFamilies(): MeshFamily[] {
  return MESH_FAMILIES
}

/**
 * Score a family against desk context.
 * Uses many-to-many tag↔SME overlap when available (see tagOverlap.ts).
 */
export function scoreMeshFamily(
  family: MeshFamily,
  ctx: {
    text: string
    industries: string[]
    smeDomains: SmeDomain[]
    /** Precomputed operational overlap among active SME domains */
    overlap?: import('../../lib/sme/tagOverlap').OperationalOverlap
  },
): number {
  // Lazy import pattern avoided — call site may pass overlap from tagOverlap
  const t = ctx.text.toLowerCase()
  let s = 0
  for (const kw of family.keywords) {
    if (t.includes(kw.toLowerCase())) s += 8
  }
  for (const ind of family.industries) {
    if (
      ctx.industries.some(
        (i) =>
          i.toLowerCase().includes(ind.toLowerCase()) ||
          ind.toLowerCase().includes(i.toLowerCase()),
      )
    ) {
      s += 6
    }
  }
  // Multi-SME membership: each matching domain adds weight (families list many domains)
  let domainHits = 0
  for (const d of family.smeDomains) {
    if (ctx.smeDomains.includes(d)) {
      s += 5
      domainHits++
    }
  }
  // Bonus when a family deliberately bridges 2+ active SME domains
  if (domainHits >= 2) s += 4 + domainHits

  if (ctx.overlap) {
    for (const edge of ctx.overlap.domainEdges.slice(0, 8)) {
      const bridges =
        family.smeDomains.includes(edge.domainA) &&
        family.smeDomains.includes(edge.domainB)
      if (bridges) s += 6 * edge.jaccard + 2
      else if (
        family.smeDomains.includes(edge.domainA) ||
        family.smeDomains.includes(edge.domainB)
      ) {
        s += 2.5 * edge.jaccard
      }
    }
  }

  s += (family.seed % 7) * 0.01
  return s
}

export function selectMeshFamiliesForContext(
  ctx: {
    text: string
    industries: string[]
    smeDomains: SmeDomain[]
    overlap?: import('../../lib/sme/tagOverlap').OperationalOverlap
  },
  limit = 12,
): MeshFamily[] {
  return [...MESH_FAMILIES]
    .map((f) => ({ f, s: scoreMeshFamily(f, ctx) }))
    .filter((x) => x.s >= 5)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map((x) => x.f)
}

/** Legacy short ids map into catalog (compat for older story packs) */
export const LEGACY_MESH_MAP: Record<string, string> = {
  'mast-enclosure-a': 'mf-def-comms-mast',
  'cabinet-node-b': 'mf-gov-filing-cabinet',
  'barrier-line-c': 'mf-civic-barrier-cordon',
  'locus-sphere-d': 'mf-env-smoke-locus',
  'vehicle-body-e': 'mf-transport-vehicle-sedan',
  'crowd-cluster-f': 'mf-civic-crowd-plaza',
  'path-strip-g': 'mf-civic-path-strip',
  'building-mass-h': 'mf-mfg-foundry-bay',
  'vessel-hull-i': 'mf-transport-vessel-hull',
  'debris-pile-j': 'mf-env-debris-pile',
  'docket-stack-k': 'mf-gov-docket-stack',
  'drone-pad-l': 'mf-transport-drone-quad',
  'firebreak-m': 'mf-env-firebreak',
  'media-riser-p': 'mf-civic-media-riser',
  'refuge-node-q': 'mf-civic-refuge-canopy',
}

export function resolveMeshFamilyId(id: string): string {
  return LEGACY_MESH_MAP[id] ?? id
}
