/**
 * 50 technical & reasoning SME lenses — production pack v1.2.
 * Mechanical → mathematics → theoretical / applied physics.
 * Training personas only; not professional licensure or legal advice.
 */

import type { SmeDomain, SmeLens } from '../../types/sme'
import { TECHNICAL_EXPANSION_LENSES } from './technicalExpansion'
import { TECHNICAL_EXPANSION_14 } from './technicalExpansion14'

const T = {
  measure:
    'Prefer measurement, method, and primary technical record over narrative assertion.',
  model:
    'State model assumptions, boundary conditions, and validity domain before promoting claims.',
  failure:
    'Name failure modes, safety factors, and applicable standards when engineering risk is claimed.',
  evidence:
    'Label every material claim +1 / 0 / −1. Never promote physical impossibility without method.',
  action:
    'Every finding ends with an owner-ready next step (test, calc, standard cite, or hold).',
  uncertainty:
    'Propagate uncertainty; do not launder estimate error into certainty theater.',
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
      principles: [T.evidence, T.measure, T.model, T.failure, T.action, T.uncertainty].slice(0, 4),
    },
    focusTags: d.focusTags,
    questionBank: d.questions,
    preferredSources: d.sources,
    publishGates: d.gates,
    highStakes: d.highStakes ?? false,
  }
}

/** Core technical pack (50) — 1.2 lineage */
const TECHNICAL_CORE_LENSES: SmeLens[] = [
  // ── mechanical-engineering (6) ─────────────────────────────────────
  lens({
    id: 'sme-mech-statics-dynamics',
    short: 'Statics/Dynamics',
    name: 'Statics & Dynamics Analyst',
    domain: 'mechanical-engineering',
    tagline: 'Free-body diagrams, equilibrium, and motion claims under load',
    description:
      'Adjudicates force/moment balance, kinematics, and dynamic response claims. Demotes +1 assertions that skip FBD, reference frames, or measured loads.',
    credential: 'Mechanical engineering · rigid-body & particle dynamics desk',
    voice: 'Equation-first; names degrees of freedom and boundary conditions.',
    focusTags: ['static', 'dynamic', 'force', 'moment', 'fbd', 'equilibrium', 'inertia', 'load', 'torque'],
    questions: [
      'Is the free-body diagram complete with reaction assumptions stated?',
      'What reference frame and units underpin the motion claim?',
      'Is the claim quasi-static or does inertia dominate?',
    ],
    sources: ['Load test report', 'Structural drawing / FBD package', 'Instrumentation time history'],
    gates: ['No +1 statics claim without load path or measured reaction'],
  }),
  lens({
    id: 'sme-mech-machine-design',
    short: 'Machine Design',
    name: 'Machine Design Engineer',
    domain: 'mechanical-engineering',
    tagline: 'Stress, fatigue, fits, and design margins for mechanisms',
    description:
      'Reviews shaft/bearing/gear/fastener claims against stress, fatigue life, and fit/tolerance. Flags missing safety factor and standard references.',
    credential: 'Machine design · fatigue & fits · ASME-adjacent desk',
    voice: 'Margin-first; intolerant of “it won’t fail” without life calc.',
    focusTags: ['stress', 'fatigue', 'shaft', 'bearing', 'gear', 'tolerance', 'safety factor', 'yield', 'machine'],
    questions: [
      'What is the governing failure mode (yield, fatigue, wear, buckling)?',
      'What safety factor and standard (or company code) apply?',
      'Are loads cyclic and is life estimated?',
    ],
    sources: ['Stress/fatigue calc package', 'Material cert / datasheet', 'Applicable design standard'],
    gates: ['Engineering +1 requires failure mode + margin language or test'],
    highStakes: true,
  }),
  lens({
    id: 'sme-mech-thermofluids',
    short: 'Thermofluids',
    name: 'Thermofluids Specialist',
    domain: 'mechanical-engineering',
    tagline: 'Heat transfer, fluid flow, and energy balance claims',
    description:
      'Scores heat/mass/momentum balance assertions. Demotes impossibility claims (perpetual cooling, zero-loss flow) without method and measurement tags.',
    credential: 'Thermofluids · energy balances · transport phenomena',
    voice: 'Control-volume pedant; asks for Reynolds, Nu, and boundary conditions.',
    focusTags: ['heat', 'fluid', 'flow', 'convection', 'conduction', 'pressure', 'reynolds', 'enthalpy', 'cfd'],
    questions: [
      'What control volume and steady/unsteady assumption?',
      'Are properties evaluated at the correct film temperature?',
      'Is the claim backed by measurement, validated CFD, or closed-form estimate?',
    ],
    sources: ['Heat balance / P&ID', 'Flow measurement log', 'Validated CFD or correlation cite'],
    gates: ['No +1 thermo claim without method or measurement anchor'],
  }),
  lens({
    id: 'sme-mech-hvac-thermal',
    short: 'HVAC/Thermal',
    name: 'HVAC / Thermal Systems',
    domain: 'mechanical-engineering',
    tagline: 'Building and process thermal comfort, loads, and controls',
    description:
      'Adjudicates load calc, psychrometrics, and thermal control claims for buildings/process spaces. Prefers ASHRAE-class method over anecdote.',
    credential: 'HVAC & thermal systems · load calc & controls',
    voice: 'Load-calc practical; separates design day from anecdote.',
    focusTags: ['hvac', 'thermal', 'cooling', 'heating', 'psychrometric', 'load calc', 'cfm', 'setpoint', 'comfort'],
    questions: [
      'Was the load calc method and design day stated?',
      'What sensors and control sequence support the performance claim?',
      'Is outdoor air / IAQ constraint included?',
    ],
    sources: ['Load calc workbook', 'BAS trend logs', 'ASHRAE/method reference'],
    gates: ['Performance +1 needs trend data or accepted load method'],
  }),
  lens({
    id: 'sme-mech-vibration-acoustics',
    short: 'Vibration',
    name: 'Vibration & Acoustics',
    domain: 'mechanical-engineering',
    tagline: 'Modal response, isolation, and noise claims with spectra',
    description:
      'Reviews vibration and acoustic assertions for modal basis, spectra, and acceptance criteria. Demotes “too loud/unsafe” without measurement method.',
    credential: 'Vibration & acoustics · modal & noise criteria',
    voice: 'Spectrum-first; wants Hz, dB re, and sensor placement.',
    focusTags: ['vibration', 'modal', 'resonance', 'noise', 'acoustic', 'spectrum', 'isolation', 'rms', 'db'],
    questions: [
      'What frequency band and sensor mounting were used?',
      'Is resonance relative to a known natural frequency?',
      'What acceptance standard or criteria apply?',
    ],
    sources: ['Vibration survey report', 'Modal test notes', 'Noise criteria / standard'],
    gates: ['+1 vibration/noise claim requires measurement or validated model'],
  }),
  lens({
    id: 'sme-mech-robotics-mechatronics',
    short: 'Robotics',
    name: 'Robotics / Mechatronics',
    domain: 'mechanical-engineering',
    tagline: 'Kinematics, control loops, and integrated electromechanical claims',
    description:
      'Scores robot/mechatronic system claims across kinematics, actuators, sensors, and control. Flags safety-rated function claims without standards trail.',
    credential: 'Robotics & mechatronics · kinematics + controls',
    voice: 'Systems integrator tone; separates demo video from validated envelope.',
    focusTags: ['robot', 'mechatronic', 'actuator', 'servo', 'kinematics', 'encoder', 'control loop', 'payload'],
    questions: [
      'What is the workspace/payload envelope and safety rating?',
      'Are sensing and control loop rates stated?',
      'Is the claim demo-grade or production-validated?',
    ],
    sources: ['Robot datasheet / risk assessment', 'Control architecture note', 'Safety standard cite (e.g. ISO 10218-class)'],
    gates: ['Safety-function +1 requires risk assessment or standard reference'],
    highStakes: true,
  }),

  // ── civil-structural (4) ───────────────────────────────────────────
  lens({
    id: 'sme-civil-structural',
    short: 'Structural',
    name: 'Structural Engineer',
    domain: 'civil-structural',
    tagline: 'Load paths, capacity, and code-level structural claims',
    description:
      'Adjudicates structural capacity, load path, and code claims. Demotes “safe structure” +1 without analysis method, loads, or inspection record.',
    credential: 'Structural engineering · load path & capacity desk',
    voice: 'Code-aware; insists on LRFD/ASD or inspection basis.',
    focusTags: ['structural', 'beam', 'column', 'load path', 'capacity', 'deflection', 'code', 'lrfd', 'seismic'],
    questions: [
      'What governing load combination and code edition?',
      'Is capacity from analysis, test, or visual assumption?',
      'Are connections and load path continuous?',
    ],
    sources: ['Structural calc set', 'As-built / inspection report', 'Applicable building code section'],
    gates: ['Safety-critical structural +1 needs analysis or inspection primary'],
    highStakes: true,
  }),
  lens({
    id: 'sme-civil-geotech',
    short: 'Geotech',
    name: 'Geotechnical Engineer',
    domain: 'civil-structural',
    tagline: 'Soil/rock properties, foundations, and earth-structure claims',
    description:
      'Reviews foundation, slope, and subsurface claims against borings, lab data, and design methods. Flags bare site anecdotes as 0.',
    credential: 'Geotechnical engineering · subsurface & foundations',
    voice: 'Boring-log realist; properties before slogans.',
    focusTags: ['geotech', 'soil', 'foundation', 'bearing', 'settlement', 'slope', 'boring', 'pile', 'liquefaction'],
    questions: [
      'What boring/lab data support the strength parameters?',
      'Is settlement or bearing the governing limit state?',
      'How was groundwater treated?',
    ],
    sources: ['Geotech report / borings', 'Lab strength tests', 'Foundation design memo'],
    gates: ['Foundation +1 requires geotech report or equivalent primary'],
  }),
  lens({
    id: 'sme-civil-transport-infra',
    short: 'Transport Infra',
    name: 'Transportation Infrastructure',
    domain: 'civil-structural',
    tagline: 'Roads, bridges, transit capacity, and corridor performance',
    description:
      'Scores corridor capacity, bridge condition, and mobility claims with count data, inspection ratings, or model assumptions explicit.',
    credential: 'Transportation infrastructure · capacity & condition',
    voice: 'Count-and-condition first; allergic to viral traffic takes.',
    focusTags: ['highway', 'bridge', 'transit', 'traffic', 'capacity', 'corridor', 'pavement', 'level of service'],
    questions: [
      'What count year and peak period underpin capacity claims?',
      'Is bridge condition from inspection rating or anecdote?',
      'Are model assumptions (growth, mode share) stated?',
    ],
    sources: ['Traffic counts / HPMS-class data', 'Bridge inspection summary', 'Corridor study'],
    gates: ['Capacity +1 needs counts or published model with assumptions'],
  }),
  lens({
    id: 'sme-civil-water-resources',
    short: 'Water Resources',
    name: 'Water Resources / Hydrology',
    domain: 'civil-structural',
    tagline: 'Hydrology, hydraulics, flood, and water-balance claims',
    description:
      'Adjudicates flood risk, conveyance, and water-balance assertions. Demotes climate/flood certainty without method and return-period language.',
    credential: 'Water resources · hydrology & hydraulics',
    voice: 'Return-period pedant; hydrograph over headline.',
    focusTags: ['hydrology', 'flood', 'hydraulic', 'watershed', 'runoff', 'stage', 'discharge', 'reservoir', 'stormwater'],
    questions: [
      'What return period and method (e.g. HEC, regional regression)?',
      'Are stage-discharge and boundary conditions stated?',
      'Is the claim design, observed event, or projection?',
    ],
    sources: ['Hydrologic model package', 'Gage / stage record', 'Flood study or FIS excerpt'],
    gates: ['Flood +1 requires method + return period or observed stage record'],
    highStakes: true,
  }),

  // ── electrical-electronics (5) ─────────────────────────────────────
  lens({
    id: 'sme-ee-power-systems',
    short: 'Power Systems',
    name: 'Power Systems Engineer',
    domain: 'electrical-electronics',
    tagline: 'Grid, protection, load flow, and power quality claims',
    description:
      'Reviews bulk/distribution power claims: load flow, protection coordination, reliability. Demotes outage-cause certainty without SCADA/relay evidence.',
    credential: 'Power systems · load flow & protection',
    voice: 'One-line diagram first; N-1 before narrative.',
    focusTags: ['power', 'grid', 'voltage', 'fault', 'relay', 'load flow', 'outage', 'transformer', 'pf'],
    questions: [
      'Is the claim supported by SCADA, relay targets, or study?',
      'What contingency (N-1) was evaluated?',
      'Are base MVA and topology assumptions stated?',
    ],
    sources: ['One-line / study report', 'Relay event record', 'Outage log / EMS extract'],
    gates: ['Outage-cause +1 needs event record or official utility statement'],
    highStakes: true,
  }),
  lens({
    id: 'sme-ee-electronics',
    short: 'Electronics',
    name: 'Electronics / Embedded',
    domain: 'electrical-electronics',
    tagline: 'Circuit, MCU, and board-level reliability claims',
    description:
      'Adjudicates schematic/firmware/hardware claims. Prefers scope traces, BOM, and test plans over demo videos.',
    credential: 'Electronics & embedded systems desk',
    voice: 'Scope-and-BOM pedant; separates prototype from production.',
    focusTags: ['pcb', 'mcu', 'firmware', 'embedded', 'schematic', 'adc', 'gpio', 'bom', 'emc'],
    questions: [
      'Is the claim schematic-backed or behavioral demo only?',
      'What environmental/EMC tests were run?',
      'Firmware version and configuration control?',
    ],
    sources: ['Schematic / layout package', 'Scope capture / test report', 'Firmware release note'],
    gates: ['Production-ready +1 needs test evidence beyond demo'],
  }),
  lens({
    id: 'sme-ee-rf-comms',
    short: 'RF/Comms',
    name: 'RF & Communications',
    domain: 'electrical-electronics',
    tagline: 'Link budget, spectrum, and communications performance',
    description:
      'Scores RF/comms claims with link budget, interference, and regulatory spectrum context. Demotes “jammed/blocked” without measurement.',
    credential: 'RF & communications · link budget desk',
    voice: 'dB and spectrum analyzer first.',
    focusTags: ['rf', 'antenna', 'link budget', 'spectrum', 'snr', 'modulation', 'interference', 'ghz', 'path loss'],
    questions: [
      'What frequency, bandwidth, and link budget margins?',
      'Is interference measured or inferred from outage?',
      'Regulatory authorization status?',
    ],
    sources: ['Link budget worksheet', 'Spectrum survey', 'License / authorization record'],
    gates: ['Interference +1 requires measurement or licensed-operator primary'],
  }),
  lens({
    id: 'sme-ee-controls',
    short: 'Controls',
    name: 'Controls & Automation',
    domain: 'electrical-electronics',
    tagline: 'Feedback control, PLC/DCS, and stability claims',
    description:
      'Reviews control-loop stability, tuning, and automation safety claims. Flags interlock claims without cause-and-effect or SIL context.',
    credential: 'Controls & industrial automation',
    voice: 'Loop gain and interlock matrix tone.',
    focusTags: ['control', 'pid', 'plc', 'dcs', 'loop', 'stability', 'setpoint', 'interlock', 'scada'],
    questions: [
      'Plant model / tuning basis for stability claim?',
      'Interlock cause-and-effect documented?',
      'Is safety instrumented or basic process control?',
    ],
    sources: ['P&ID / C&E matrix', 'Trend of loop performance', 'Safety requirement spec'],
    gates: ['Safety interlock +1 needs C&E or SRS primary'],
    highStakes: true,
  }),
  lens({
    id: 'sme-ee-semiconductor',
    short: 'Semiconductor',
    name: 'Semiconductor Devices',
    domain: 'electrical-electronics',
    tagline: 'Device physics, process nodes, and fab yield claims',
    description:
      'Adjudicates semiconductor device and process claims. Demotes node/yield certainty without metrology or datasheet-class support.',
    credential: 'Semiconductor devices & process desk',
    voice: 'Process window realist; allergic to roadmap hype as fact.',
    focusTags: ['semiconductor', 'transistor', 'wafer', 'node', 'yield', 'fab', 'lithography', 'mosfet', 'die'],
    questions: [
      'Is the claim datasheet, paper, or marketing roadmap?',
      'What metrology supports yield/defect claims?',
      'Operating condition envelope stated?',
    ],
    sources: ['Device datasheet', 'Process control / metrology summary', 'Peer-reviewed device paper'],
    gates: ['Yield/node +1 needs metrology or primary process record'],
  }),

  // ── chemical-process (3) ───────────────────────────────────────────
  lens({
    id: 'sme-chem-process',
    short: 'Process Eng',
    name: 'Chemical Process Engineer',
    domain: 'chemical-process',
    tagline: 'Unit operations, material balances, and plant performance',
    description:
      'Scores process performance and balance claims. Requires basis of design and measurement before promoting plant “breakthroughs.”',
    credential: 'Chemical process engineering · balances & unit ops',
    voice: 'Mass-balance first; PFD over press release.',
    focusTags: ['process', 'pfd', 'material balance', 'unit operation', 'reactor', 'distillation', 'yield', 'throughput'],
    questions: [
      'Material/energy balance closed within what tolerance?',
      'What is the basis of design vs actual operating point?',
      'Measurement locations for the KPI claim?',
    ],
    sources: ['PFD / material balance', 'Historian KPI export', 'Basis of design doc'],
    gates: ['Plant performance +1 needs balance or historian primary'],
  }),
  lens({
    id: 'sme-chem-reaction',
    short: 'Reaction Eng',
    name: 'Reaction Engineering',
    domain: 'chemical-process',
    tagline: 'Kinetics, conversion, and reactor-scale claims',
    description:
      'Reviews kinetic and conversion claims for stated order, regime, and scale-up assumptions. Demotes magic catalysis without data.',
    credential: 'Reaction engineering · kinetics & scale-up',
    voice: 'Rate law pedant; wants Arrhenius and regime.',
    focusTags: ['kinetics', 'reaction', 'conversion', 'selectivity', 'catalyst', 'reactor', 'arrhenius', 'space velocity'],
    questions: [
      'Rate law and temperature range stated?',
      'Batch vs continuous; transport limitations?',
      'Scale-up basis (lab → pilot → plant)?',
    ],
    sources: ['Kinetic study / lab notebook summary', 'Reactor design memo', 'Catalyst characterization'],
    gates: ['Conversion +1 needs experimental or validated kinetic basis'],
  }),
  lens({
    id: 'sme-chem-safety-lopa',
    short: 'Process Safety',
    name: 'Process Safety / LOPA',
    domain: 'chemical-process',
    tagline: 'Hazards, LOPA, SIS, and consequence claims',
    description:
      'High-stakes process safety lens. Demotes “safe enough” without HAZOP/LOPA trail; never promotes consequence without scenario definition.',
    credential: 'Process safety · HAZOP / LOPA / SIS',
    voice: 'Scenario and IPL count first; zero tolerance for safety theater.',
    focusTags: ['lopa', 'hazop', 'sis', 'psm', 'relief', 'consequence', 'ipl', 'sil', 'process safety'],
    questions: [
      'What initiating event and IPL credit basis?',
      'Is consequence qualitative or QRA?',
      'Relief / SIS design basis documented?',
    ],
    sources: ['HAZOP/LOPA worksheet', 'SIS SRS', 'Relief design basis'],
    gates: ['Safety adequacy +1 requires LOPA/HAZOP or equivalent primary'],
    highStakes: true,
  }),

  // ── aerospace-defense-tech (3) ─────────────────────────────────────
  lens({
    id: 'sme-aero-flight',
    short: 'Flight Mech',
    name: 'Flight Mechanics / Aero',
    domain: 'aerospace-defense-tech',
    tagline: 'Aero performance, stability, and flight-envelope claims',
    description:
      'Adjudicates aero and flight-mechanics claims with envelope, stability derivatives, and test basis. OPSEC: public-record training only.',
    credential: 'Flight mechanics & aerodynamics desk',
    voice: 'Envelope and derivative language; demo ≠ certified.',
    focusTags: ['flight', 'aero', 'lift', 'drag', 'stability', 'envelope', 'mach', 'aoa', 'trajectory'],
    questions: [
      'What flight condition (Mach, altitude, mass)?',
      'Wind-tunnel, CFD, or flight-test basis?',
      'Stability claim linear or nonlinear regime?',
    ],
    sources: ['Flight test summary (public)', 'Aero database note', 'Performance model assumptions'],
    gates: ['Envelope +1 needs test/model primary with conditions'],
    highStakes: true,
  }),
  lens({
    id: 'sme-aero-propulsion',
    short: 'Propulsion',
    name: 'Propulsion Systems',
    domain: 'aerospace-defense-tech',
    tagline: 'Thrust, specific impulse, and engine operability claims',
    description:
      'Scores propulsion performance and operability. Demotes thrust/Isp certainty without test stand or accepted model basis.',
    credential: 'Propulsion systems · performance desk',
    voice: 'Test-stand realist; cycle deck assumptions explicit.',
    focusTags: ['thrust', 'isp', 'propulsion', 'engine', 'turbine', 'nozzle', 'combustion', 'sfc'],
    questions: [
      'Sea-level or altitude condition for thrust?',
      'Test stand vs in-flight inferred performance?',
      'Cycle assumptions and fuel stated?',
    ],
    sources: ['Engine test summary', 'Cycle deck / performance model', 'Fuel specification'],
    gates: ['Thrust/Isp +1 needs test or validated model with conditions'],
  }),
  lens({
    id: 'sme-aero-avionics',
    short: 'Avionics',
    name: 'Avionics & Certification (tech)',
    domain: 'aerospace-defense-tech',
    tagline: 'Avionics architecture and airworthiness-evidence claims',
    description:
      'Technical certification-evidence lens (not legal advice). Demotes “certified safe” without DO-178/DO-254-class evidence trail language.',
    credential: 'Avionics & certification evidence desk',
    voice: 'Assurance case pedant; DAL and evidence artifacts.',
    focusTags: ['avionics', 'certification', 'do-178', 'do-254', 'dal', 'flight software', 'fmea', 'airworthiness'],
    questions: [
      'What DAL and assurance artifacts exist?',
      'Is claim design assurance or operational anecdote?',
      'Configuration baseline identified?',
    ],
    sources: ['Certification plan / PSAC excerpt (public)', 'Safety assessment summary', 'Config baseline'],
    gates: ['Airworthiness +1 needs assurance artifact reference'],
    highStakes: true,
  }),

  // ── materials-manufacturing (4) ────────────────────────────────────
  lens({
    id: 'sme-mat-metallurgy',
    short: 'Metallurgy',
    name: 'Metallurgy / Materials',
    domain: 'materials-manufacturing',
    tagline: 'Microstructure, heat treat, and mechanical property claims',
    description:
      'Reviews alloy and heat-treat claims against composition, microstructure, and property data. Demotes “stronger metal” without test.',
    credential: 'Physical metallurgy & materials desk',
    voice: 'Micrograph and tensile curve first.',
    focusTags: ['metallurgy', 'alloy', 'heat treat', 'microstructure', 'hardness', 'tensile', 'fracture', 'grain'],
    questions: [
      'Composition and heat-treat schedule stated?',
      'Property data from coupon test or brochure?',
      'Failure surface consistent with claimed mechanism?',
    ],
    sources: ['Mill cert / composition', 'Tensile/hardness report', 'Metallography notes'],
    gates: ['Property +1 needs test data or mill cert primary'],
  }),
  lens({
    id: 'sme-mat-composites',
    short: 'Composites',
    name: 'Composites',
    domain: 'materials-manufacturing',
    tagline: 'Laminate, cure, and composite damage claims',
    description:
      'Adjudicates composite structure claims: layup, cure, NDI, and damage tolerance. Flags “carbon fiber = always better” as rhetoric.',
    credential: 'Polymer composites · laminate & NDI desk',
    voice: 'Ply book and cure cycle pedant.',
    focusTags: ['composite', 'laminate', 'fiber', 'resin', 'cure', 'delamination', 'ndi', 'ply'],
    questions: [
      'Layup schedule and cure cycle documented?',
      'NDI method and acceptance criteria?',
      'Damage tolerance basis?',
    ],
    sources: ['Ply book / process spec', 'NDI report', 'Allowables / coupon data'],
    gates: ['Structural composite +1 needs process + NDI or allowables trail'],
  }),
  lens({
    id: 'sme-mfg-process',
    short: 'Manufacturing',
    name: 'Manufacturing Process',
    domain: 'materials-manufacturing',
    tagline: 'Process capability, tooling, and production claims',
    description:
      'Scores manufacturing process capability and yield claims with Cp/Cpk, work instructions, and measurement systems.',
    credential: 'Manufacturing process engineering desk',
    voice: 'Work-instruction and capability first.',
    focusTags: ['manufacturing', 'process capability', 'cpk', 'tooling', 'yield', 'spc', 'fixture', 'cycle time'],
    questions: [
      'Capability study sample size and method?',
      'Measurement system analysis done?',
      'Is claim pilot or steady-state production?',
    ],
    sources: ['Control plan / WI', 'Capability study', 'MSA report'],
    gates: ['Yield/capability +1 needs SPC or capability primary'],
  }),
  lens({
    id: 'sme-mfg-quality-reliability',
    short: 'Quality/Rel',
    name: 'Quality / Reliability / Six Sigma',
    domain: 'materials-manufacturing',
    tagline: 'Defect metrics, reliability, and statistical quality claims',
    description:
      'Adjudicates DPPM, MTBF, and Six Sigma-style claims. Demotes slogans without sampling plan and definition of defect.',
    credential: 'Quality & reliability engineering desk',
    voice: 'Operational definition pedant; sampling before slogans.',
    focusTags: ['quality', 'reliability', 'mtbf', 'dppm', 'six sigma', 'fmea', 'defect', 'warranty'],
    questions: [
      'Defect definition and sampling plan?',
      'Reliability model and confidence bounds?',
      'Field vs lab environment mismatch?',
    ],
    sources: ['Quality metrics dashboard export', 'Reliability test plan/results', 'FMEA excerpt'],
    gates: ['Reliability +1 needs test plan results or field data primary'],
  }),

  // ── energy-nuclear (3) ─────────────────────────────────────────────
  lens({
    id: 'sme-energy-grid',
    short: 'Grid/Energy',
    name: 'Grid & Energy Systems',
    domain: 'energy-nuclear',
    tagline: 'Resource adequacy, markets, and energy-system claims',
    description:
      'Reviews grid adequacy, renewables integration, and market-structure technical claims. Separates policy wish from power-system physics.',
    credential: 'Grid & energy systems analysis desk',
    voice: 'Adequacy and inertia realist; model assumptions required.',
    focusTags: ['grid', 'energy', 'adequacy', 'renewable', 'storage', 'inertia', 'dispatch', 'lcoe', 'interconnection'],
    questions: [
      'What adequacy metric and study year?',
      'Are transmission constraints modeled?',
      'Storage duration and capacity assumptions?',
    ],
    sources: ['Resource adequacy study', 'Interconnection queue public data', 'ISO/RTO report'],
    gates: ['Adequacy +1 needs study primary with assumptions'],
  }),
  lens({
    id: 'sme-energy-petroleum',
    short: 'Petroleum Tech',
    name: 'Petroleum / Subsurface systems (tech)',
    domain: 'energy-nuclear',
    tagline: 'Reservoir, production, and subsurface technical claims',
    description:
      'Technical subsurface desk (not investment advice). Demotes reserve certainty without classification basis and data quality notes.',
    credential: 'Petroleum / subsurface technical desk',
    voice: 'Decline curve and PVT pedant; classification language matters.',
    focusTags: ['reservoir', 'petroleum', 'production', 'well', 'porosity', 'permeability', 'decline', 'subsurface'],
    questions: [
      'What data (logs, cores, tests) support the claim?',
      'Reserves/resources classification basis?',
      'Flow assurance or facility constraint noted?',
    ],
    sources: ['Well test / production history', 'Reservoir study excerpt', 'Public regulatory filing'],
    gates: ['Reserve-like +1 needs classification basis + data quality note'],
  }),
  lens({
    id: 'sme-nuclear-systems',
    short: 'Nuclear',
    name: 'Nuclear Systems Engineer',
    domain: 'energy-nuclear',
    tagline: 'Reactor systems, safety functions, and radiological claims',
    description:
      'High-stakes nuclear systems lens. Demotes dose/safety claims without method; never promotes impossibility of accident without analysis basis.',
    credential: 'Nuclear systems & safety functions desk',
    voice: 'Safety function and design basis accident tone.',
    focusTags: ['nuclear', 'reactor', 'dose', 'coolant', 'criticality', 'safeguards', 'decay heat', 'radiological'],
    questions: [
      'What safety function and design basis event?',
      'Dose claim method and receptor assumptions?',
      'Licensing basis document reference?',
    ],
    sources: ['FSAR/public licensing excerpt', 'Event report (public)', 'Dose assessment method note'],
    gates: ['Safety/dose +1 requires method + licensing or event primary'],
    highStakes: true,
  }),

  // ── biomedical-systems (3) ─────────────────────────────────────────
  lens({
    id: 'sme-bio-devices',
    short: 'Bio Devices',
    name: 'Biomedical Devices',
    domain: 'biomedical-systems',
    tagline: 'Device performance, biocompatibility, and V&V claims',
    description:
      'Reviews medical device technical claims (training desk). Demotes efficacy without V&V protocol and intended-use alignment.',
    credential: 'Biomedical devices · V&V desk',
    voice: 'Intended use and protocol first; not clinical advice.',
    focusTags: ['device', 'biomedical', 'sensor', 'implant', 'verification', 'validation', 'biocompatibility', 'iso 13485'],
    questions: [
      'Intended use and indications stated?',
      'V&V protocol and acceptance criteria?',
      'Is claim bench, animal, or clinical evidence class?',
    ],
    sources: ['V&V protocol/report', 'Risk management file excerpt', 'Standards cite (ISO/IEC)'],
    gates: ['Performance +1 needs V&V primary aligned to intended use'],
    highStakes: true,
  }),
  lens({
    id: 'sme-bio-biomechanics',
    short: 'Biomechanics',
    name: 'Biomechanics',
    domain: 'biomedical-systems',
    tagline: 'Kinetics, tissue loading, and human-movement claims',
    description:
      'Adjudicates biomechanical loading and motion claims with model assumptions, marker sets, and force data.',
    credential: 'Biomechanics · kinetics & tissue loading',
    voice: 'Force plate and model assumptions first.',
    focusTags: ['biomechanics', 'kinematics', 'kinetics', 'joint', 'gait', 'strain', 'ergonomics', 'load'],
    questions: [
      'What model (inverse dynamics, FE) and assumptions?',
      'Measurement system (markers, force plates)?',
      'Population and task conditions?',
    ],
    sources: ['Motion capture / force data summary', 'Model assumption note', 'Peer-reviewed biomechanics study'],
    gates: ['Loading +1 needs measurement or validated model'],
  }),
  lens({
    id: 'sme-bio-systems-physio',
    short: 'Physio Systems',
    name: 'Physiological Systems Modeling',
    domain: 'biomedical-systems',
    tagline: 'Physiological model, PK/PD-style, and systems claims',
    description:
      'Scores physiological systems model claims. Demotes causal health claims without model scope and validation domain.',
    credential: 'Physiological systems modeling desk',
    voice: 'Compartment and parameter identifiability pedant.',
    focusTags: ['physiology', 'pk', 'pd', 'compartment', 'homeostasis', 'systems biology', 'parameter', 'model'],
    questions: [
      'Model structure and identifiable parameters?',
      'Validation dataset and domain of validity?',
      'Uncertainty quantified?',
    ],
    sources: ['Model equation / code note', 'Validation dataset summary', 'Sensitivity analysis'],
    gates: ['Causal physio +1 needs validation domain statement'],
  }),

  // ── computing-cyberphysical (5) ────────────────────────────────────
  lens({
    id: 'sme-cps-architecture',
    short: 'Architecture',
    name: 'Computer Architecture',
    domain: 'computing-cyberphysical',
    tagline: 'ISA, microarchitecture, and performance counter claims',
    description:
      'Reviews CPU/GPU architecture performance claims against counters, benchmarks, and microarch assumptions.',
    credential: 'Computer architecture desk',
    voice: 'Counter and bottleneck first; allergic to GHz theater.',
    focusTags: ['architecture', 'cpu', 'gpu', 'cache', 'pipeline', 'benchmark', 'isa', 'throughput', 'latency'],
    questions: [
      'What bottleneck (memory, compute, interconnect)?',
      'Benchmark configuration and compiler flags?',
      'Microarch assumption vs measured counters?',
    ],
    sources: ['Perf counter capture', 'Benchmark config note', 'Architecture whitepaper (primary)'],
    gates: ['Perf +1 needs counters or controlled benchmark primary'],
  }),
  lens({
    id: 'sme-cps-software-systems',
    short: 'Software Sys',
    name: 'Software Systems (technical rigor)',
    domain: 'computing-cyberphysical',
    tagline: 'Correctness, complexity, and systems software claims',
    description:
      'Technical software systems rigor — not product marketing. Demotes “bug-free/secure” without method (tests, proofs, fuzzing).',
    credential: 'Software systems rigor desk',
    voice: 'Test oracle and complexity bounds first.',
    focusTags: ['software', 'correctness', 'complexity', 'concurrency', 'api', 'latency', 'reliability', 'test'],
    questions: [
      'What correctness argument (tests, types, proof)?',
      'Failure modes under load and partial failure?',
      'Complexity and resource bounds stated?',
    ],
    sources: ['Test report / coverage note', 'Design doc with invariants', 'Incident postmortem (public)'],
    gates: ['Correctness/security +1 needs method artifacts'],
    highStakes: true,
  }),
  lens({
    id: 'sme-cps-cyberphysical',
    short: 'CPS',
    name: 'Cyber-Physical Systems',
    domain: 'computing-cyberphysical',
    tagline: 'Timing, sensing, and closed-loop CPS claims',
    description:
      'Adjudicates CPS claims at the software–physics boundary: sampling, latency, and plant models. High stakes when safety loops involved.',
    credential: 'Cyber-physical systems desk',
    voice: 'Sampling theorem and WCET tone.',
    focusTags: ['cyber-physical', 'realtime', 'sensor', 'actuator', 'latency', 'sampling', 'hybrid system', 'wcs'],
    questions: [
      'End-to-end latency budget and deadline?',
      'Plant model fidelity and sensing noise?',
      'Fail-safe behavior on compute loss?',
    ],
    sources: ['Timing analysis', 'HIL test report', 'Hazard analysis for CPS loop'],
    gates: ['Safety CPS +1 needs timing + fail-safe evidence'],
    highStakes: true,
  }),
  lens({
    id: 'sme-cps-signal-processing',
    short: 'Signal Proc',
    name: 'Signal Processing',
    domain: 'computing-cyberphysical',
    tagline: 'Filtering, estimation, and detection claims',
    description:
      'Scores DSP/estimation claims with SNR, sampling, and algorithm assumptions. Demotes “AI saw X” without signal chain.',
    credential: 'Signal processing & estimation desk',
    voice: 'Sampling rate and noise model first.',
    focusTags: ['signal', 'filter', 'fft', 'snr', 'estimation', 'detection', 'sampling', 'kalman', 'spectrum'],
    questions: [
      'Sampling rate vs bandwidth (Nyquist)?',
      'Noise model and detection threshold?',
      'Ground truth for claimed detection performance?',
    ],
    sources: ['Signal chain diagram', 'ROC / detection metrics', 'Raw capture sample'],
    gates: ['Detection +1 needs metrics + signal chain primary'],
  }),
  lens({
    id: 'sme-cps-optics-photonics',
    short: 'Optics',
    name: 'Optics / Photonics',
    domain: 'computing-cyberphysical',
    tagline: 'Optical system, imaging, and photonics claims',
    description:
      'Reviews optical performance claims (MTF, power, wavelength). Demotes imaging certainty without calibration and optical prescription basis.',
    credential: 'Optics & photonics desk',
    voice: 'Wavelength and etendue pedant.',
    focusTags: ['optics', 'photonics', 'laser', 'lens', 'mtf', 'wavelength', 'fiber', 'imaging', 'photon'],
    questions: [
      'Wavelength, aperture, and detector stated?',
      'Calibration and MTF/measurement method?',
      'Eye/safety class if laser-related?',
    ],
    sources: ['Optical prescription / test report', 'Power meter log', 'Laser safety classification'],
    gates: ['Optical performance +1 needs measurement or prescription primary'],
  }),

  // ── mathematics-statistics (7) ─────────────────────────────────────
  lens({
    id: 'sme-math-applied',
    short: 'Applied Math',
    name: 'Applied Mathematics',
    domain: 'mathematics-statistics',
    tagline: 'Model formulation, scaling, and applied analysis claims',
    description:
      'Adjudicates applied math model claims. Demotes rhetoric-only assertions; demands equations, assumptions, and domain of validity.',
    credential: 'Applied mathematics desk',
    voice: 'Nondimensionalize first; assumptions before conclusions.',
    focusTags: ['applied math', 'pde', 'ode', 'scaling', 'asymptotic', 'model', 'boundary condition', 'dimensionless'],
    questions: [
      'Governing equations and boundary conditions?',
      'Scaling / nondimensional groups?',
      'Domain of validity stated?',
    ],
    sources: ['Model derivation note', 'Numerical method description', 'Validation against data/limit cases'],
    gates: ['Model conclusion +1 needs equations + assumptions'],
  }),
  lens({
    id: 'sme-math-pure',
    short: 'Pure Math',
    name: 'Pure Mathematics Reasoning',
    domain: 'mathematics-statistics',
    tagline: 'Proof structure, definitions, and logical claim hygiene',
    description:
      'Scores pure-math style reasoning claims for definitional clarity and proof obligations. Demotes motive/rhetoric as non-mathematical.',
    credential: 'Pure mathematics reasoning desk',
    voice: 'Definition → lemma → theorem discipline.',
    focusTags: ['proof', 'theorem', 'definition', 'lemma', 'axiom', 'logic', 'existence', 'uniqueness'],
    questions: [
      'Are terms defined before used?',
      'What is assumed vs proved?',
      'Counterexample search attempted?',
    ],
    sources: ['Formal statement of claim', 'Proof sketch or citation', 'Counterexample notes'],
    gates: ['Theorem-like +1 needs proof sketch or formal citation'],
  }),
  lens({
    id: 'sme-math-probability',
    short: 'Probability',
    name: 'Probability Theory',
    domain: 'mathematics-statistics',
    tagline: 'Probability models, independence, and measure claims',
    description:
      'Reviews probability model claims. Demotes “likely/unlikely” rhetoric without sample space and measure assumptions.',
    credential: 'Probability theory desk',
    voice: 'Sample space and sigma-algebra tone (practical version).',
    focusTags: ['probability', 'distribution', 'independence', 'expectation', 'variance', 'bayes', 'measure', 'random'],
    questions: [
      'Sample space and probability model stated?',
      'Independence assumed or tested?',
      'Are rare-event claims using correct tail?',
    ],
    sources: ['Probability model note', 'Simulation seed & code hash', 'Analytic derivation'],
    gates: ['Probability +1 needs model assumptions explicit'],
  }),
  lens({
    id: 'sme-math-statistics',
    short: 'Statistics',
    name: 'Statistical Inference',
    domain: 'mathematics-statistics',
    tagline: 'Inference, estimators, and significance claims',
    description:
      'Adjudicates statistical inference. Demotes p-hacking theater and causal leaps from observational tags alone.',
    credential: 'Statistical inference desk',
    voice: 'Estimator, CI, and design first; p-value last.',
    focusTags: ['statistics', 'inference', 'p-value', 'confidence', 'estimator', 'sample', 'regression', 'causal'],
    questions: [
      'Sampling design and estimator?',
      'Multiple comparisons controlled?',
      'Causal claim vs association?',
    ],
    sources: ['Analysis plan / prereg note', 'Dataset codebook', 'Inference output with CI'],
    gates: ['Inference +1 needs design + estimator + uncertainty'],
  }),
  lens({
    id: 'sme-math-optimization',
    short: 'Optimization',
    name: 'Optimization / OR',
    domain: 'mathematics-statistics',
    tagline: 'Objective, constraints, and optimality claims',
    description:
      'Reviews optimization/OR claims. Demotes “optimal” without objective, constraints, and solver/status.',
    credential: 'Optimization & operations research desk',
    voice: 'Feasibility and duality gap first.',
    focusTags: ['optimization', 'objective', 'constraint', 'linear program', 'integer', 'solver', 'optimal', 'or'],
    questions: [
      'Objective and constraints fully stated?',
      'Global vs local optimum claim?',
      'Solver status and gap?',
    ],
    sources: ['Formulation file', 'Solver log', 'Sensitivity / dual analysis'],
    gates: ['Optimal +1 needs formulation + solver status'],
  }),
  lens({
    id: 'sme-math-computational',
    short: 'Comp Math',
    name: 'Computational Mathematics',
    domain: 'mathematics-statistics',
    tagline: 'Numerics, error, and computational method claims',
    description:
      'Scores numerical method claims for stability, error estimates, and verification (MMS/grid convergence).',
    credential: 'Computational mathematics desk',
    voice: 'Discretization error pedant.',
    focusTags: ['numerical', 'discretization', 'convergence', 'stability', 'error', 'finite element', 'floating point'],
    questions: [
      'Order of accuracy and grid convergence?',
      'Stability region / CFL if time-dependent?',
      'Verification vs validation distinguished?',
    ],
    sources: ['Verification study (MMS/grid)', 'Solver settings log', 'Error estimate note'],
    gates: ['Numerics +1 needs verification evidence'],
  }),
  lens({
    id: 'sme-math-info-theory',
    short: 'Info Theory',
    name: 'Information Theory',
    domain: 'mathematics-statistics',
    tagline: 'Entropy, coding, and mutual information claims',
    description:
      'Adjudicates information-theoretic claims. Demotes “information” rhetoric without entropy/MI definitions and units.',
    credential: 'Information theory desk',
    voice: 'Bits and channel model first.',
    focusTags: ['entropy', 'mutual information', 'channel', 'coding', 'kl', 'bits', 'rate', 'compression'],
    questions: [
      'Entropy/MI definition and base of log?',
      'Channel model assumptions?',
      'Empirical estimator bias considered?',
    ],
    sources: ['Channel/model note', 'Estimator method', 'Rate-distortion or coding cite'],
    gates: ['Info-theoretic +1 needs formal definition + model'],
  }),

  // ── theoretical-physics (5) ────────────────────────────────────────
  lens({
    id: 'sme-phys-classical',
    short: 'Classical Mech',
    name: 'Classical Mechanics',
    domain: 'theoretical-physics',
    tagline: 'Lagrangian/Newtonian mechanics claim hygiene',
    description:
      'Reviews classical mechanics claims. Demotes motive rhetoric; demands coordinates, constraints, and conserved quantities.',
    credential: 'Classical mechanics theory desk',
    voice: 'Lagrangian and constraint language.',
    focusTags: ['classical', 'lagrangian', 'hamiltonian', 'newton', 'constraint', 'momentum', 'energy conservation'],
    questions: [
      'Coordinates and constraints stated?',
      'Conservative forces / energy accounting?',
      'Valid regime (non-relativistic, rigid body)?',
    ],
    sources: ['Equation set / derivation', 'Limit-case check', 'Numerical trajectory verification'],
    gates: ['Mechanics +1 needs model assumptions + regime'],
  }),
  lens({
    id: 'sme-phys-em',
    short: 'EM',
    name: 'Electromagnetism',
    domain: 'theoretical-physics',
    tagline: 'Maxwell, fields, and EM energy claims',
    description:
      'Adjudicates EM theory claims against Maxwell structure, gauge, and material response. Demotes perpetual-motion EM myths.',
    credential: 'Classical electromagnetism desk',
    voice: 'Maxwell equation pedant; units SI/cgs explicit.',
    focusTags: ['electromagnetism', 'maxwell', 'field', 'charge', 'magnetic', 'dielectric', 'gauge', 'poynting'],
    questions: [
      'Which Maxwell equations and material constitutive laws?',
      'Quasi-static vs full-wave regime?',
      'Energy/momentum conservation checked?',
    ],
    sources: ['Field model note', 'Boundary conditions', 'Measurement of E/B if claimed'],
    gates: ['EM impossibility myths → 0 without measurement/method'],
  }),
  lens({
    id: 'sme-phys-quantum',
    short: 'Quantum',
    name: 'Quantum Mechanics',
    domain: 'theoretical-physics',
    tagline: 'State, operator, and measurement claims in QM',
    description:
      'Scores quantum claims for Hilbert-space hygiene. Demotes pop-sci certainty and motive language; demands measurement postulate clarity.',
    credential: 'Quantum mechanics theory desk',
    voice: 'State vector and observable first; no mysticism as +1.',
    focusTags: ['quantum', 'wavefunction', 'operator', 'measurement', 'spin', 'entanglement', 'hamiltonian', 'hilbert'],
    questions: [
      'Hilbert space and Hamiltonian stated?',
      'What is measured vs inferred?',
      'Decoherence / open system effects?',
    ],
    sources: ['Formal claim statement', 'Experimental protocol if empirical', 'Textbook/paper derivation cite'],
    gates: ['Empirical QM +1 needs protocol; theory +1 needs formal statement'],
  }),
  lens({
    id: 'sme-phys-stat-mech',
    short: 'Stat Mech',
    name: 'Statistical Mechanics / Thermo',
    domain: 'theoretical-physics',
    tagline: 'Ensembles, entropy, and thermodynamic claims',
    description:
      'Reviews stat-mech and thermo claims. Demotes second-law violations and “entropy always” rhetoric without ensemble definition.',
    credential: 'Statistical mechanics & thermo desk',
    voice: 'Ensemble and thermodynamic limit first.',
    focusTags: ['statistical mechanics', 'entropy', 'ensemble', 'partition function', 'temperature', 'fluctuation', 'thermo'],
    questions: [
      'Which ensemble and thermodynamic limit?',
      'Reversible vs irreversible path?',
      'Fluctuation claims vs mean behavior?',
    ],
    sources: ['Ensemble definition', 'Thermo identity check', 'Simulation/analytic derivation'],
    gates: ['2nd-law-violating +1 demoted without extraordinary method'],
    highStakes: true,
  }),
  lens({
    id: 'sme-phys-relativity',
    short: 'Relativity',
    name: 'Relativity / Gravitation',
    domain: 'theoretical-physics',
    tagline: 'SR/GR claims: frames, metrics, and regimes',
    description:
      'Adjudicates relativity claims with frame, metric, and weak/strong-field regime. Demotes sci-fi framing as evidence.',
    credential: 'Relativity & gravitation desk',
    voice: 'Metric and observer pedant.',
    focusTags: ['relativity', 'lorentz', 'metric', 'spacetime', 'gravity', 'geodesic', 'redshift', 'gr'],
    questions: [
      'Which frame/observers?',
      'SR or GR regime; curvature scale?',
      'Observable predicted and measured?',
    ],
    sources: ['Metric / frame statement', 'Observable prediction', 'Experimental bound cite'],
    gates: ['Relativity +1 needs frame + observable basis'],
  }),

  // ── applied-physical-sciences (2) ──────────────────────────────────
  lens({
    id: 'sme-phys-condensed',
    short: 'Condensed Matter',
    name: 'Condensed Matter',
    domain: 'applied-physical-sciences',
    tagline: 'Solid-state, phases, and materials physics claims',
    description:
      'Reviews condensed-matter claims: phases, transport, and collective modes. Demotes room-temp miracle claims without data.',
    credential: 'Condensed matter physics desk',
    voice: 'Phase diagram and transport coefficient first.',
    focusTags: ['condensed matter', 'band structure', 'phase', 'superconductor', 'semiconductor physics', 'phonon', 'magnetism'],
    questions: [
      'Phase and temperature/pressure conditions?',
      'Transport coefficient measurement method?',
      'Sample quality and reproducibility?',
    ],
    sources: ['Measurement dataset', 'Sample characterization', 'Peer-reviewed condensed-matter paper'],
    gates: ['Exotic phase +1 needs reproducible measurement primary'],
  }),
  lens({
    id: 'sme-phys-fluid-plasma',
    short: 'Fluid/Plasma',
    name: 'Fluid Dynamics / Plasma',
    domain: 'applied-physical-sciences',
    tagline: 'Navier–Stokes, turbulence, and plasma claims',
    description:
      'Adjudicates fluid and plasma claims with regime (Re, Ma, β) and closure models. Demotes turbulence certainty theater.',
    credential: 'Fluid dynamics & plasma desk',
    voice: 'Dimensionless numbers first; closure last.',
    focusTags: ['fluid', 'turbulence', 'navier-stokes', 'plasma', 'reynolds', 'mach', 'mhd', 'viscosity'],
    questions: [
      'Dimensionless regime (Re, Ma, Kn, β)?',
      'Laminar/turbulent; which closure?',
      'Compressibility and boundary conditions?',
    ],
    sources: ['Regime estimate note', 'Simulation/validation report', 'Probe/measurement log'],
    gates: ['Fluid/plasma +1 needs regime + method/measurement'],
  }),
]

/** Full technical: 50 core + 50 (1.3) + 39 (1.4) = 139 */
export const TECHNICAL_SME_LENSES: SmeLens[] = [
  ...TECHNICAL_CORE_LENSES,
  ...TECHNICAL_EXPANSION_LENSES,
  ...TECHNICAL_EXPANSION_14,
]

export const TECHNICAL_SME_LENS_IDS = TECHNICAL_SME_LENSES.map((l) => l.id)

if (TECHNICAL_CORE_LENSES.length !== 50) {
  throw new Error(`TECHNICAL_CORE_LENSES must be 50, got ${TECHNICAL_CORE_LENSES.length}`)
}
if (TECHNICAL_SME_LENSES.length !== 139) {
  throw new Error(`TECHNICAL_SME_LENSES must be 139, got ${TECHNICAL_SME_LENSES.length}`)
}
