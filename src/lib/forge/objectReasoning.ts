/**
 * Evidentiary scene-object reasoning — mesh families from claims + industry + SME.
 * Selects from 100+ unique catalog families; multi-select ready.
 */

import type { EvidenceItem, EvidenceScore, MaterialClass } from '../../types/core'
import type { SmeDomain } from '../../types/sme'
import type { StoryClaimCard } from '../../data/useCases/stories'
import type { StoryModelItem, StoryModelPack } from '../../data/useCases/storyModels'
import { getStoryModels as getCuratedStoryModels } from '../../data/useCases/storyModels'
import { getCongressDeskSeedMeta } from '../../data/useCases/congressDesks'
import { resolveStory } from '../../data/useCases/stories'
import { dedupeByText } from '../verify/dedupe'
import {
  getMeshFamily,
  listMeshFamilies,
  resolveMeshFamilyId,
  selectMeshFamiliesForContext,
  type MeshFamily,
} from '../../data/forge/meshCatalog'
import { SME_LENSES } from '../../data/sme/lenses'
import {
  computeOperationalOverlap,
  explainMeshSmeOverlap,
  scoreFamilyWithOverlap,
  type OperationalOverlap,
} from '../sme/tagOverlap'

export type VerifiabilityFlag =
  | 'verified_supported'
  | 'plausible_unverified'
  | 'disputed_unverifiable'
  | 'narrative_only'
  | 'method_gate'

export type ObjectImportance = 'critical' | 'supporting' | 'background'

export type SceneMeshId = string

export interface EvidentiaryObject {
  id: string
  name: string
  role: string
  description: string
  assetType: SceneMeshId
  relatedClaimHint: string
  sourceText: string
  score: EvidenceScore
  material?: MaterialClass
  verifiability: VerifiabilityFlag
  importance: ObjectImportance
  importanceScore: number
  reasoning: string[]
  flags: string[]
  sourceIds: string[]
  curated: boolean
  /** Industry tags from mesh family */
  industries?: string[]
  /** SME domains from mesh family */
  smeDomains?: SmeDomain[]
  /** Depth layer for interactive multi-select composition */
  depth?: 'foreground' | 'midground' | 'background'
  accent?: string
}

export interface ObjectReasoningReport {
  deskId: string
  deskTitle: string
  at: string
  objects: EvidentiaryObject[]
  selectedIds: string[]
  summary: string
  methodNote: string
  /** Suggested families from industry/SME even without keyword hits */
  catalogMatches: MeshFamily[]
  /** Many-to-many tag↔SME operational overlap for this desk */
  operationalOverlap: OperationalOverlap
  /** Integrated reasoning notes (overlap + multi-domain tags) */
  overlapNotes: string[]
}

const MODEL_SKETCH =
  'Illustrative geometry only — not a certified survey, forensic reconstruction, or product design.'

const NARRATIVE_ONLY =
  /\b(viral|rumor|social post|influencer|trending|allegedly|unconfirmed clip)\b/i

function flagFromScore(
  score: EvidenceScore,
  text: string,
  hasSource: boolean,
): { verifiability: VerifiabilityFlag; flags: string[]; reasoning: string[] } {
  const flags: string[] = []
  const reasoning: string[] = []
  if (NARRATIVE_ONLY.test(text) && score !== 1) {
    flags.push('NARRATIVE_CAPTURE_RISK')
    reasoning.push('Language suggests social/viral channel — treat as narrative until primary attaches.')
  }
  if (score === 1 && hasSource) {
    flags.push('PRIMARY_LINKED')
    reasoning.push('Score +1 with bound source — model as supported geometry sketch.')
    return { verifiability: 'verified_supported', flags, reasoning }
  }
  if (score === 1 && !hasSource) {
    flags.push('PLUS_WITHOUT_SOURCE', 'PLAUSIBLE_UNVERIFIED')
    reasoning.push('Score +1 but no bound desk source — PLAUSIBLE / UNVERIFIED for modeling.')
    return { verifiability: 'plausible_unverified', flags, reasoning }
  }
  if (score === -1) {
    flags.push('DISPUTED', 'DO_NOT_TREAT_AS_FACT')
    reasoning.push('Score −1 — contested locus only; do not treat as fact.')
    return { verifiability: 'disputed_unverifiable', flags, reasoning }
  }
  flags.push('PLAUSIBLE_UNVERIFIED')
  reasoning.push('Score 0 — plausible under the desk but not proven.')
  if (NARRATIVE_ONLY.test(text)) return { verifiability: 'narrative_only', flags, reasoning }
  return { verifiability: 'plausible_unverified', flags, reasoning }
}

export function verifiabilityLabel(v: VerifiabilityFlag): string {
  switch (v) {
    case 'verified_supported':
      return 'Verified / supported'
    case 'plausible_unverified':
      return 'Plausible · unverified'
    case 'disputed_unverifiable':
      return 'Disputed · unverifiable'
    case 'narrative_only':
      return 'Narrative-only'
    case 'method_gate':
      return 'Method gate'
  }
}

export function meshAccentColor(v: VerifiabilityFlag): string {
  if (v === 'verified_supported') return '#34d399'
  if (v === 'disputed_unverifiable') return '#fb7185'
  if (v === 'narrative_only') return '#a78bfa'
  if (v === 'method_gate') return '#64748b'
  return '#fbbf24'
}

function deskContext(deskId: string, claims: StoryClaimCard[], evidence: EvidenceItem[]) {
  const seed = getCongressDeskSeedMeta(deskId)
  const story = resolveStory(deskId)
  const text = [
    story?.title,
    story?.lede,
    story?.stakes,
    seed?.industry,
    seed?.title,
    seed?.agency,
    ...claims.map((c) => c.plain),
    ...evidence.map((e) => e.title + ' ' + e.summary),
  ]
    .filter(Boolean)
    .join(' ')

  const industries: string[] = []
  if (seed?.industry) {
    industries.push(...seed.industry.split(/[,/]/).map((s) => s.trim()).filter(Boolean))
  }
  // pull industry-ish tokens from tags on seed
  if (seed?.tags) industries.push(...seed.tags)

  // SME domains: prefer lenses whose tags hit the text
  const smeDomains: SmeDomain[] = []
  const t = text.toLowerCase()
  for (const lens of SME_LENSES) {
    const hit = lens.focusTags?.some((tag) => t.includes(tag.toLowerCase()))
    if (hit && !smeDomains.includes(lens.domain)) smeDomains.push(lens.domain)
  }
  // always include method-process lightly for training desks
  if (!smeDomains.includes('method-process')) smeDomains.push('method-process')
  if (deskId.startsWith('cong-') && !smeDomains.includes('oversight')) {
    smeDomains.push('oversight', 'public-records', 'sector-regulatory')
  }

  return { text, industries, smeDomains, seed, story }
}

function fromFamily(
  family: MeshFamily,
  deskId: string,
  score: EvidenceScore,
  sourceText: string,
  sourceIds: string[],
  curated: boolean,
  overlap?: OperationalOverlap,
  ctxText = '',
): EvidentiaryObject {
  const { verifiability, flags, reasoning } = flagFromScore(
    score,
    sourceText,
    sourceIds.length > 0,
  )
  const ov = scoreFamilyWithOverlap(family, {
    text: ctxText || sourceText,
    industries: family.industries,
    smeDomains: overlap?.domainsByCentrality ?? family.smeDomains,
    overlap,
  })

  const importanceScore =
    10 +
    (score === 1 ? 4 : score === -1 ? 5 : 1) +
    (sourceIds.length ? 3 : 0) +
    (curated ? 4 : 0) +
    family.keywords.length * 0.2 +
    (family.smeDomains.length >= 2 ? 2 : 0) +
    (ov.hitDomains.length >= 2 ? 3 : 0)

  const importance: ObjectImportance =
    importanceScore >= 16 ? 'critical' : importanceScore >= 12 ? 'supporting' : 'background'

  return {
    id: `obj-${deskId}-${family.id}`,
    name: family.name,
    role: family.role,
    description: `${family.role}. ${MODEL_SKETCH} Industries: ${family.industries.join(', ')}. SME domains (multi): ${family.smeDomains.join(', ')}.`,
    assetType: family.id,
    relatedClaimHint: sourceText.slice(0, 140),
    sourceText,
    score,
    verifiability,
    importance,
    importanceScore,
    reasoning: [
      `Mesh family ${family.id} (${family.layout}, seed ${family.seed}, depth ${family.depth}).`,
      `SME association is many-to-many: this family links [${family.smeDomains.join(', ')}].`,
      ov.overlapNote,
      ov.hitTags.length
        ? `Shared/activated tags: ${ov.hitTags.slice(0, 6).join(', ')}.`
        : 'Tag lock via industry/domain membership.',
      ...reasoning,
    ],
    flags: [
      ...flags,
      `MESH:${family.id}`,
      `LAYOUT:${family.layout}`,
      `DEPTH:${family.depth}`,
      ...family.smeDomains.map((d) => `SME:${d}`),
      ...(ov.hitDomains.length >= 2 ? ['MULTI_SME_OVERLAP'] : []),
      ...ov.hitTags.slice(0, 4).map((t) => `TAG:${t}`),
    ],
    sourceIds,
    curated,
    industries: family.industries,
    smeDomains: family.smeDomains,
    depth: family.depth,
    accent: family.accent,
  }
}

function fromCurated(
  item: StoryModelItem,
  deskId: string,
  claims: StoryClaimCard[],
): EvidentiaryObject {
  const familyId = resolveMeshFamilyId(item.assetType)
  const family = getMeshFamily(familyId)
  const linked = claims.find(
    (c) =>
      item.relatedClaimHint &&
      (c.plain.toLowerCase().includes(item.relatedClaimHint.toLowerCase().slice(0, 20)) ||
        item.relatedClaimHint.toLowerCase().includes(c.plain.toLowerCase().slice(0, 20))),
  )
  const score = (linked?.score ?? 0) as EvidenceScore
  const sourceIds = linked?.sourceIds ?? []
  if (family) {
    return fromFamily(
      family,
      deskId,
      score,
      linked?.plain ?? item.relatedClaimHint ?? item.role,
      sourceIds,
      true,
    )
  }
  const { verifiability, flags, reasoning } = flagFromScore(score, item.name, sourceIds.length > 0)
  return {
    id: `cur-${deskId}-${item.id}`,
    name: item.name,
    role: item.role,
    description: `${item.description} ${MODEL_SKETCH}`,
    assetType: familyId,
    relatedClaimHint: item.relatedClaimHint ?? '',
    sourceText: item.relatedClaimHint ?? item.role,
    score,
    verifiability,
    importance: 'critical',
    importanceScore: 16,
    reasoning: ['Curated pack item.', ...reasoning],
    flags: [...flags, 'CURATED_PACK'],
    sourceIds,
    curated: true,
    depth: 'midground',
  }
}

export function reasonSceneObjects(input: {
  deskId: string
  claims?: StoryClaimCard[]
  evidence?: EvidenceItem[]
}): ObjectReasoningReport {
  const story = resolveStory(input.deskId)
  const claims = input.claims ?? story?.claims ?? []
  const evidence = input.evidence ?? []
  const ctx = deskContext(input.deskId, claims, evidence)
  const curated = getCuratedStoryModels(input.deskId)

  // Many-to-many tag↔SME operational overlap for this desk's active domains
  const operationalOverlap = computeOperationalOverlap(ctx.smeDomains, ctx.text)

  const raw: EvidentiaryObject[] = []

  if (curated) {
    for (const item of curated.items) {
      raw.push(fromCurated(item, input.deskId, claims))
    }
  }

  // Dynamic catalog: industry + multi-SME domains + shared-tag overlap
  const catalogMatches = selectMeshFamiliesForContext(
    {
      text: ctx.text,
      industries: ctx.industries,
      smeDomains: ctx.smeDomains,
      overlap: operationalOverlap,
    },
    20,
  )

  // Force-include families whose keywords appear in claims/evidence (story-literal objects)
  const forced = new Map(catalogMatches.map((f) => [f.id, f]))
  const claimText = claims.map((c) => c.plain).join(' ').toLowerCase()
  const evText = evidence.map((e) => `${e.title} ${e.summary}`).join(' ').toLowerCase()
  const literal = `${claimText} ${evText} ${ctx.text}`.toLowerCase()
  for (const fam of listMeshFamilies()) {
    if (forced.has(fam.id)) continue
    if (fam.keywords.some((k) => k.length > 2 && literal.includes(k.toLowerCase()))) {
      forced.set(fam.id, fam)
    }
  }
  const mergedFamilies = [...forced.values()].slice(0, 24)

  for (const family of mergedFamilies) {
    const hitClaim = claims.find((c) =>
      family.keywords.some((k) => c.plain.toLowerCase().includes(k.toLowerCase())),
    )
    const hitEv = evidence.find((e) =>
      family.keywords.some(
        (k) =>
          e.title.toLowerCase().includes(k.toLowerCase()) ||
          e.summary.toLowerCase().includes(k.toLowerCase()),
      ),
    )
    const score = (hitClaim?.score ?? hitEv?.score ?? 0) as EvidenceScore
    const sourceIds = hitClaim?.sourceIds ?? hitEv?.sourceRefs ?? []
    const sourceText =
      hitClaim?.plain ?? hitEv?.title ?? `${family.name} for ${ctx.seed?.short ?? input.deskId}`
    if (raw.some((o) => o.assetType === family.id)) continue
    raw.push(
      fromFamily(
        family,
        input.deskId,
        score,
        sourceText,
        sourceIds,
        false,
        operationalOverlap,
        ctx.text,
      ),
    )
  }

  // Contested claims get an explicit disputed locus (method / intelligence overlap)
  const disputedClaim = claims.find((c) => c.score === -1)
  if (disputedClaim) {
    const locus = getMeshFamily('mf-env-smoke-locus')
    if (locus) {
      const disputedObj = fromFamily(
        locus,
        input.deskId,
        -1,
        disputedClaim.plain,
        disputedClaim.sourceIds ?? [],
        false,
        operationalOverlap,
        ctx.text,
      )
      // Replace any prior same-family entry so −1 is not deduped away
      const idx = raw.findIndex((o) => o.assetType === locus.id)
      if (idx >= 0) raw[idx] = disputedObj
      else raw.push(disputedObj)
    }
  }

  if (input.deskId.startsWith('cong-') && raw.length < 3) {
    for (const id of ['mf-gov-docket-stack', 'mf-mfg-foundry-bay', 'mf-env-smoke-locus']) {
      const fam = getMeshFamily(id)
      if (fam && !raw.some((o) => o.assetType === fam.id)) {
        raw.push(
          fromFamily(
            fam,
            input.deskId,
            id.includes('smoke') ? -1 : id.includes('docket') ? 1 : 0,
            ctx.seed?.lede ?? ctx.text.slice(0, 120),
            [],
            false,
            operationalOverlap,
            ctx.text,
          ),
        )
      }
    }
  }

  if (!raw.length) {
    for (const id of ['mf-civic-path-strip', 'mf-civic-crowd-plaza', 'mf-gov-docket-stack']) {
      const fam = getMeshFamily(id)
      if (fam)
        raw.push(
          fromFamily(fam, input.deskId, 0, ctx.text.slice(0, 80), [], false, operationalOverlap, ctx.text),
        )
    }
  }

  const deduped = dedupeByText(raw, (o) => `${o.assetType} ${o.name}`, 0.9)
  const sorted = [...deduped].sort((a, b) => b.importanceScore - a.importanceScore)
  const top = sorted.slice(0, 14)

  const critical = top.filter((o) => o.importance === 'critical').length
  const multiSmeObjects = top.filter((o) => (o.smeDomains?.length ?? 0) >= 2).length

  const topFamilies = top
    .map((o) => getMeshFamily(o.assetType))
    .filter((f): f is MeshFamily => Boolean(f))
  const overlapNotes = [
    ...operationalOverlap.notes,
    ...explainMeshSmeOverlap(topFamilies),
  ]

  return {
    deskId: input.deskId,
    deskTitle: story?.title ?? input.deskId,
    at: new Date().toISOString(),
    objects: top,
    selectedIds: top.filter((o) => o.importance === 'critical').map((o) => o.id).slice(0, 6),
    summary: `${top.length} objects · ${listMeshFamilies().length} families · ${multiSmeObjects} multi-SME · ${critical} critical · domains ${ctx.smeDomains.slice(0, 4).join('/')}`,
    methodNote:
      'Tags↔SMEs are many-to-many: one tag can activate multiple specialists; each SME carries many tags. Mesh families list multiple SME domains so operational overlap is visible in the scene.',
    catalogMatches: mergedFamilies,
    operationalOverlap,
    overlapNotes,
  }
}

export function reportToModelPack(report: ObjectReasoningReport): StoryModelPack {
  const items: StoryModelItem[] = report.objects.map((o) => ({
    id: o.id,
    name: o.name,
    role: `${o.role} · ${verifiabilityLabel(o.verifiability)}`,
    assetType: o.assetType as StoryModelItem['assetType'],
    description: [o.description, `Flags: ${o.flags.join(', ')}`, ...o.reasoning.slice(0, 2)].join(
      ' · ',
    ),
    relatedClaimHint: o.relatedClaimHint,
  }))
  return {
    useCaseId: report.deskId,
    headline: `Evidentiary models · ${report.deskTitle}`,
    intro: `${report.summary}. ${report.methodNote}`,
    items: items.length
      ? items
      : [
          {
            id: 'fallback',
            name: 'Generic locus',
            role: 'Placeholder',
            assetType: 'mf-env-smoke-locus',
            description: MODEL_SKETCH,
          },
        ],
    defaultItemId: items[0]?.id ?? 'fallback',
  }
}

export function getDynamicStoryModels(
  deskId: string,
  claims?: StoryClaimCard[],
  evidence?: EvidenceItem[],
): StoryModelPack {
  return reportToModelPack(reasonSceneObjects({ deskId, claims, evidence }))
}
