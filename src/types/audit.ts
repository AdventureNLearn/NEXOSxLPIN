/**
 * Nexus OS — Roadside Surveillance Compliance Audit contracts
 * Focus: Funding · Distribution · Data Sharing · Density · Public Accountability
 * Evidence-gate labeling on every claim. No religious or partisan branding.
 */

export type EvidenceClass = 'Evidence' | 'Inference' | 'Assumption'

export type DetailLevel = 0 | 1 | 2 | 3 | 4

export type ClaimConfidence = 'high' | 'medium' | 'low' | 'unknown'

export interface SourceRef {
  id: string
  title: string
  citation: string
  url?: string
  retrievedAt?: string
  publicRecord: boolean
}

/** Discrete evidence item for Research Hub / Oversight Kit tables */
export interface EvidenceItem {
  id: string
  title: string
  summary: string
  class: EvidenceClass
  confidence: ClaimConfidence
  sourceIds: string[]
  relatedFindingIds?: string[]
  tags: string[]
  createdAt: string
}

export interface GatedClaim {
  id: string
  statement: string
  class: EvidenceClass
  confidence: ClaimConfidence
  sources: string[] // SourceRef ids
  notes?: string
}

export type DeviceClass =
  | 'ALPR'
  | 'CCTV'
  | 'ANPR'
  | 'Roadside_Sensor'
  | 'Traffic_Camera'
  | 'Unknown_Surveillance'

export interface DeviceBrief {
  id: string
  deviceClass: DeviceClass
  vendor?: string
  model?: string
  oemFamily?: string
  formFactor?: string
  typicalMount?: string
  typicalHeightM?: number
  typicalPoleDiameterMm?: number
  connectivityHints?: string[]
  publicSpecsNotes?: string
  visualId?: VisualIdCard
  brandProfileId?: string
  installationMethodId?: string
  dataCollectedTypical?: string[]
  /** Public-data derived model — not a certified survey or engineering drawing. */
  disclaimer: string
}

/** L0 Visual ID card */
export interface VisualIdCard {
  label: string
  silhouette: 'dual_sensor_alpr' | 'single_dome' | 'box_camera' | 'unknown'
  visibleMarks: string[]
  mountStyle: string
  colorHints: string[]
  confidence: ClaimConfidence
  missing: string[]
  disclaimer: string
}

export interface SpatialContext {
  /** Derived from audit content — never hardcoded jurisdiction defaults */
  locationDescription?: string
  lat?: number
  lng?: number
  jurisdictionHints?: string[]
  roadwayContext?: string
  confidence: ClaimConfidence
  sources: string[]
  /** Locations searched/confirmed during this audit */
  savedLocations?: SavedAuditLocation[]
}

export interface SavedAuditLocation {
  id: string
  label: string
  lat: number
  lng: number
  stateCode?: string
  city?: string
  confirmed: boolean
  savedAt: string
  source: 'search' | 'reference' | 'manual'
}

/** Hint for opening the right workspace tab for a finding cluster */
export interface WindowTabHint {
  windowType: 'analyst' | 'research' | 'simulation' | 'mapping' | 'log' | 'files'
  title: string
  reason: string
  findingCount: number
}

export type ComplianceFramework =
  | 'NDAA_889'
  | 'NIST_CSF'
  | 'NIST_SP800'
  | 'CISA_ITS'
  | 'DOT_ITS'
  | 'FOURTH_AMENDMENT'
  | 'STATE_PRIVACY'
  | 'DATA_DISTRIBUTION'
  | 'PUBLIC_NOTICE'
  | 'FUNDING_SEPARATION'
  | 'OTHER'

export interface ComplianceFinding {
  id: string
  framework: ComplianceFramework
  controlOrSection: string
  title: string
  status: 'pass' | 'fail' | 'partial' | 'unknown' | 'not_applicable'
  claim: GatedClaim
  remediationHint?: string
  /** When true, finding is about shielding the surveilled public — not operator convenience */
  publicProtectionFocus?: boolean
}

/** Installation method for visual/forensic modeling */
export interface InstallationMethodSpec {
  id: string
  methodId: string
  label: string
  mountType: string
  typicalHeightM: number
  powerPath: string
  backhaulPath: string
  physicalFootprint: string
  publicVisibility: 'conspicuous' | 'semi_covert' | 'covert_capable'
  notes: string
  brandDefaults?: string[]
  disclaimer: string
}

/** Brand / type profile for device-specific modeling */
export interface DeviceBrandProfile {
  brandId: string
  brandName: string
  aliases: string[]
  deviceTypes: DeviceClass[]
  commercialModel: 'agency_owned' | 'vendor_hosted_saas' | 'hybrid' | 'unknown'
  cloudBackendTypical: boolean
  multiAgencySharingTypical: boolean
  knownProductLines: string[]
  installationMethods: string[]
  dataCollectedTypical: string[]
  thirdPartyRiskNotes: string[]
  ndaa889Covered: boolean
  publicSources: string[]
}

/** One hop in collection → storage → distribution chain */
export interface DistributionHop {
  id: string
  stage: 'capture' | 'edge_process' | 'transit' | 'vendor_cloud' | 'agency_db' | 'fusion_center' | 'commercial_broker' | 'third_party_api' | 'unknown'
  actorType: 'law_enforcement' | 'local_gov' | 'state_gov' | 'federal' | 'private_vendor' | 'data_broker' | 'insurer' | 'other_commercial' | 'unknown'
  actorLabel: string
  disclosedToPublic: 'yes' | 'partial' | 'no' | 'unknown'
  operatesAsLE: boolean
  dataTypes: string[]
  retentionHint?: string
  claim: GatedClaim
}

export interface DataDistributionMap {
  hops: DistributionHop[]
  undisclosedThirdParties: string[]
  publicNoticeGaps: string[]
  individualShieldGaps: string[]
  discourseNotes: string[]
}

export interface RegulatoryConflict {
  id: string
  severity: 'high' | 'medium' | 'low'
  title: string
  leftRegime: string
  rightRegime: string
  conflictSummary: string
  useCaseOverlap: string
  publicImpact: string
  claim: GatedClaim
}

export type StateAlprPosture =
  | 'restrictive'
  | 'regulated'
  | 'permissive_or_silent'
  | 'mixed'
  | 'unknown'

export interface StateRegulatoryProfile {
  stateCode: string
  stateName: string
  alprPosture: StateAlprPosture
  summary: string
  keyStatutesOrPolicies: string[]
  retentionNotes: string
  sharingNotes: string
  noticeTransparencyNotes: string
  individualRightsNotes: string
  commercialVendorNotes: string
  conflictsWithNeighbors?: string[]
  confidence: ClaimConfidence
  sources: string[]
  lastReviewed: string
}

/** Strict Fourth Amendment lens — third-party doctrine is NOT an audit shield */
export interface FourthAmendmentAnalysis {
  auditDoctrineNote: string
  thirdPartyDoctrineWeight: 'none_in_this_audit'
  warrantPreference: GatedClaim
  particularityAndScope: GatedClaim
  prolongedTrackingConcern: GatedClaim
  dragnetCollectionConcern: GatedClaim
  individualAgency: GatedClaim
  publicRightToKnow: GatedClaim
  recommendedShields: string[]
  discoursePrompts: string[]
}

/** Dual-column funding: local LE own-source vs federal grant programs (all fundable) */
export interface FundingSeparationPackage {
  separationRule: string
  localLeBudget: Array<{
    id: string
    sourceClass: string
    label: string
    amountKnown: boolean
    amountNote: string
    evidenceStatus: string
    claimClass: string
    confidence: string
    notes: string
    federalProgramId?: string
  }>
  federalGrantDollars: Array<{
    id: string
    sourceClass: string
    label: string
    amountKnown: boolean
    amountNote: string
    evidenceStatus: string
    claimClass: string
    confidence: string
    notes: string
    federalProgramId?: string
  }>
  otherOrMixed: Array<{
    id: string
    sourceClass: string
    label: string
    amountKnown: boolean
    amountNote: string
    evidenceStatus: string
    claimClass: string
    confidence: string
    notes: string
  }>
  launderingRisks: string[]
  requiredPublicDisclosures: string[]
  allFundableFederalPrograms: Array<{
    id: string
    shortName: string
    fullName: string
    administeringAgency: string
    canFundAlprOrRoadside: boolean
    ndaa889Nexus: string
  }>
  discourseNotes: string[]
  /**
   * Phase A — live USASpending.gov enrichment (optional).
   * Absent when enrich not run; never invent award amounts on failure.
   */
  liveUsaSpending?: {
    status: 'ok' | 'zero' | 'failed' | 'skipped' | 'hits' | 'error'
    recipientName: string
    recipientHint?: string
    keywords?: string[]
    retrievedAt: string
    queriedAt?: string
    endpoint?: string
    hitCount?: number
    errorMessage?: string
    error?: string
    hits: Array<{
      awardId: string
      recipient: string
      amount?: number | null
      amountKnown?: boolean
      description?: string
      agency?: string
      awardingAgency?: string
      cfda?: string
      url?: string
      class?: EvidenceClass
      confidence?: ClaimConfidence
      alprSignal?: 'strong' | 'weak' | 'none'
      awardGroup?: 'grants' | 'contracts'
    }>
    awards?: Array<{
      awardId: string
      recipient: string
      amount: number | null
      description: string
      awardingAgency?: string
      url?: string
      alprSignal: 'strong' | 'weak' | 'none'
      awardGroup: 'grants' | 'contracts'
    }>
    markdown?: string
  }
}

export interface PrivacyCompliancePackage {
  fourthAmendment: FourthAmendmentAnalysis
  distribution: DataDistributionMap
  conflicts: RegulatoryConflict[]
  matchedStates: StateRegulatoryProfile[]
  allStatesIndex: { stateCode: string; stateName: string; alprPosture: StateAlprPosture }[]
  brandProfile?: DeviceBrandProfile
  installation?: InstallationMethodSpec
  /** Local LE budget vs federal grant dollars (all fundable programs) */
  funding?: FundingSeparationPackage
  publicTrustObjectives: string[]
}

export interface MassingSpec {
  level: DetailLevel
  /** meters — typical public geometry, not survey-grade */
  poleHeightM: number
  cameraArmLengthM: number
  cameraBoxMm: [number, number, number]
  roadWidthM: number
  setbackM: number
  enclosureMm?: [number, number, number]
  cabinetPresent?: boolean
  notes: string
  disclaimer: string
}

/** L2 systems context */
export interface SystemsModel {
  power: string
  backhaul: string[]
  networkRole: string
  remoteAccessHints: string[]
  cabinet: string
  csfFunctions: string[]
  confidence: ClaimConfidence
  missing: string[]
  disclaimer: string
}

/** L3 component breakdown */
export interface ComponentsModel {
  sensors: string[]
  compute: string[]
  radios: string[]
  storage: string[]
  oemChain: string[]
  confidence: ClaimConfidence
  missing: string[]
  disclaimer: string
}

export interface MissingDataItem {
  id: string
  field: string
  whyItMatters: string
  suggestedRecord: string
  blocksLevel?: DetailLevel
}

export interface DetailLadderState {
  current: DetailLevel
  unlocked: DetailLevel
  labels: Record<DetailLevel, string>
  populated: Record<DetailLevel, boolean>
}

export interface AuditTarget {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  query: string
  device: DeviceBrief
  spatial: SpatialContext
  sources: SourceRef[]
  claims: GatedClaim[]
  findings: ComplianceFinding[]
  evidenceItems: EvidenceItem[]
  missingData: MissingDataItem[]
  ladder: DetailLadderState
  massing?: MassingSpec
  systems?: SystemsModel
  components?: ComponentsModel
  /** Forensic privacy package: 4A, distribution, 50-state, conflicts */
  privacy?: PrivacyCompliancePackage
  /** Selected engineering drawing product id (modeler dropdown) */
  selectedDrawingId?: string
  /** Intelligent tab routes for this audit */
  tabRoutes?: WindowTabHint[]
  fileTags: string[]
  /** Structured brief JSON for Research Hub */
  structuredBriefMarkdown: string
  learningJourney: LearningStep[]
  /** Public accountability pillars (no religious or partisan branding) */
  compliancePillars: [
    'Funding Transparency',
    'Distribution & Data Sharing',
    'Density & Siting',
    'Public Accountability',
  ]
  modelDisclaimer: string
  overallConfidence: ClaimConfidence
  /** Roadside Surveillance Compliance Audit focus banner */
  auditFocus: string
  /** Selected roadside installation condition id */
  installationConditionId?: string
}

/** Canonical audit class name for the platform */
export const AUDIT_CLASS_NAME = 'Roadside Surveillance Compliance Audit'

export const COMPLIANCE_PILLARS = [
  'Funding Transparency',
  'Distribution & Data Sharing',
  'Density & Siting',
  'Public Accountability',
] as const

export const AUDIT_FOCUS_ROADSIDE =
  'Roadside Surveillance Compliance Audit — Funding · Distribution · Data Sharing · Density · Public Accountability. Map collection and third-party sharing; separate local LE budgets from federal grants; evaluate siting/ROW/clear-zone deployability; evidence-gate every claim. Third-party doctrine is not a compliance shield in this audit.'

/** @deprecated use AUDIT_FOCUS_ROADSIDE */
export const AUDIT_FOCUS_4A_PUBLIC_AGENCY = AUDIT_FOCUS_ROADSIDE

export interface LearningStep {
  id: string
  order: number
  title: string
  body: string
  level: DetailLevel
  completed: boolean
}

export const MODEL_DISCLAIMER =
  'Public-data derived model — not a certified survey or engineering drawing.'

export const DETAIL_LADDER_LABELS: Record<DetailLevel, string> = {
  0: 'L0 Visual ID',
  1: 'L1 Massing',
  2: 'L2 Systems',
  3: 'L3 Components',
  4: 'L4 Full Audit Kit',
}

export function emptyLadder(current: DetailLevel = 0): DetailLadderState {
  return {
    current,
    unlocked: current,
    labels: DETAIL_LADDER_LABELS,
    populated: { 0: false, 1: false, 2: false, 3: false, 4: false },
  }
}
