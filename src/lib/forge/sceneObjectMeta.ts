/**
 * Hover metadata for interactive Massing story objects.
 * What it is · notes · SME topics · source links (not export).
 */

import type { EvidenceScore } from '../../types/core'
import type { ProceduralAsset } from '../../types/core'
import type { ActiveSource } from '../../types/useCase'
import type { SmeDomain, SmeLens } from '../../types/sme'
import { SME_LENSES } from '../../data/sme/lenses'
import { getMeshFamily, resolveMeshFamilyId } from '../../data/forge/meshCatalog'
import type { EvidentiaryObject } from './objectReasoning'
import { verifiabilityLabel } from './objectReasoning'

export interface SceneHoverLink {
  id: string
  label: string
  /** Safe external URL when available */
  url?: string
  kind: 'source' | 'sme' | 'preferred' | 'agency'
  /** SME lens id when kind is sme */
  smeId?: string
  /** Domain for chip color */
  domain?: SmeDomain | string
}

export interface SceneObjectMeta {
  objectId: string
  /** Human name of the mesh / story object */
  name: string
  /** What this object is (family + role) */
  what: string
  /** Spatial slot if placed */
  slot?: string
  score: EvidenceScore
  verifiability?: string
  importance?: string
  /** Claim / note this object is associated with */
  claimNote?: string
  /** Reasoning notes (why this object) */
  notes: string[]
  flags: string[]
  /** SME domains from mesh family */
  smeDomains: SmeDomain[]
  /** Matched SME lenses (topics) */
  smeTopics: Array<{ id: string; short: string; name: string; domain: SmeDomain }>
  /** Links for hover menu (sources + SME preferred references) */
  links: SceneHoverLink[]
  industries: string[]
  familyId: string
  familyName: string
  accent?: string
  /** Rendering-layer potential status (ghost when open) */
  potentialStatus?: string
  /** true → dashed/ghost material in MassingCanvas */
  ghost?: boolean
  layer?: 'mapping' | 'rendering'
}

function lensesForDomains(domains: SmeDomain[], limit = 4): SmeLens[] {
  const out: SmeLens[] = []
  const seen = new Set<string>()
  for (const d of domains) {
    for (const lens of SME_LENSES) {
      if (lens.domain !== d || seen.has(lens.id)) continue
      seen.add(lens.id)
      out.push(lens)
      if (out.length >= limit) return out
    }
  }
  // Fallback: tag overlap via focus tags matching industries
  return out
}

function lensesForTags(tags: string[], limit = 3): SmeLens[] {
  const norm = tags.map((t) => t.toLowerCase())
  const scored = SME_LENSES.map((lens) => {
    let hits = 0
    for (const ft of lens.focusTags ?? []) {
      const f = ft.toLowerCase()
      if (norm.some((t) => t.includes(f) || f.includes(t))) hits++
    }
    return { lens, hits }
  })
    .filter((x) => x.hits > 0)
    .sort((a, b) => b.hits - a.hits)
  return scored.slice(0, limit).map((x) => x.lens)
}

/**
 * Build hover meta for a procedural asset in the interactive scene.
 */
export function buildSceneObjectMeta(input: {
  asset: ProceduralAsset
  evidentiary?: EvidentiaryObject
  slot?: string
  activeSources?: ActiveSource[]
  agencyUrl?: string
  agencyLabel?: string
}): SceneObjectMeta {
  const { asset, evidentiary, slot, activeSources = [] } = input
  const fam = getMeshFamily(resolveMeshFamilyId(asset.assetType))
  const familyId = fam?.id ?? asset.assetType
  const familyName = fam?.name ?? asset.assetType
  const smeDomains = (fam?.smeDomains ?? evidentiary?.smeDomains ?? []) as SmeDomain[]
  const industries = fam?.industries ?? evidentiary?.industries ?? []
  const keywords = fam?.keywords ?? []

  let smeLenses = lensesForDomains(smeDomains, 4)
  if (smeLenses.length < 2) {
    const more = lensesForTags([...industries, ...keywords, asset.name], 4)
    const ids = new Set(smeLenses.map((l) => l.id))
    for (const l of more) {
      if (!ids.has(l.id)) smeLenses.push(l)
    }
    smeLenses = smeLenses.slice(0, 5)
  }

  const notes: string[] = []
  if (evidentiary?.description) notes.push(evidentiary.description)
  if (asset.relatedClaimHint) notes.push(`Claim: ${asset.relatedClaimHint}`)
  for (const r of asset.reasoning ?? evidentiary?.reasoning ?? []) {
    if (r && !notes.includes(r)) notes.push(r)
  }
  if (evidentiary?.role) notes.push(`Role: ${evidentiary.role}`)
  if (slot) notes.push(`Spatial slot: ${slot}`)
  if (!notes.length) notes.push(asset.description.slice(0, 200) || 'Illustrative story object.')

  const links: SceneHoverLink[] = []
  const sourceIds = new Set([
    ...(asset.sourceIds ?? []),
    ...(evidentiary?.sourceIds ?? []),
  ])

  for (const src of activeSources) {
    const tagged =
      sourceIds.has(src.id) ||
      (src.tags ?? []).some((t) =>
        industries.some((i) => i.toLowerCase().includes(t.toLowerCase())),
      ) ||
      smeDomains.length > 0
    if (!tagged && sourceIds.size > 0 && !sourceIds.has(src.id)) continue
    if (src.url) {
      links.push({
        id: `src-${src.id}`,
        label: src.publisher || src.title,
        url: src.url,
        kind: 'source',
      })
    }
  }

  // Prefer bound sources first; if empty, attach desk sources (cap)
  if (links.length === 0) {
    for (const src of activeSources.slice(0, 4)) {
      if (src.url) {
        links.push({
          id: `src-${src.id}`,
          label: src.publisher || src.title,
          url: src.url,
          kind: 'source',
        })
      }
    }
  }

  if (input.agencyUrl) {
    links.push({
      id: 'agency',
      label: input.agencyLabel ?? 'Primary agency',
      url: input.agencyUrl,
      kind: 'agency',
    })
  }

  // SME preferred sources as topic-linked references (text + open SME module)
  for (const lens of smeLenses) {
    links.push({
      id: `sme-${lens.id}`,
      label: `SME · ${lens.short}`,
      kind: 'sme',
      smeId: lens.id,
      domain: lens.domain,
    })
    for (const pref of (lens.preferredSources ?? []).slice(0, 2)) {
      links.push({
        id: `pref-${lens.id}-${pref.slice(0, 24)}`,
        label: `${lens.short}: ${pref}`,
        kind: 'preferred',
        smeId: lens.id,
        domain: lens.domain,
      })
    }
  }

  // Dedupe links by label
  const seen = new Set<string>()
  const deduped = links.filter((l) => {
    const k = `${l.kind}:${l.label}`
    if (seen.has(k)) return false
    seen.add(k)
    return true
  })

  const what = [
    familyName,
    evidentiary?.role ? `(${evidentiary.role})` : null,
    slot ? `· ${slot}` : null,
  ]
    .filter(Boolean)
    .join(' ')

  return {
    objectId: asset.id,
    name: asset.name,
    what,
    slot,
    score: asset.score,
    verifiability: asset.verifiability
      ? verifiabilityLabel(asset.verifiability)
      : evidentiary
        ? verifiabilityLabel(evidentiary.verifiability)
        : undefined,
    importance: asset.importance ?? evidentiary?.importance,
    claimNote: asset.relatedClaimHint ?? evidentiary?.relatedClaimHint,
    notes: notes.slice(0, 8),
    flags: asset.flags ?? evidentiary?.flags ?? [],
    smeDomains,
    smeTopics: smeLenses.map((l) => ({
      id: l.id,
      short: l.short,
      name: l.name,
      domain: l.domain,
    })),
    links: deduped.slice(0, 14),
    industries,
    familyId,
    familyName,
    accent: fam?.accent,
  }
}
