/**
 * Many-to-many tag ↔ SME intelligence graph.
 *
 * Tags are not owned by a single SME. The same tag can activate multiple lenses
 * and domains; each SME carries many tags. Overlap is how we integrate reasoning
 * across intelligence and operational surfaces (mesh families, claims, desks).
 */

import type { SmeDomain, SmeLens } from '../../types/sme'
import { SME_LENSES } from '../../data/sme/lenses'
import type { MeshFamily } from '../../data/forge/meshCatalog'
import { MESH_FAMILIES } from '../../data/forge/meshCatalog'

export interface TagNode {
  /** Normalized tag key */
  tag: string
  /** Lenses that declare this focus tag */
  lensIds: string[]
  /** Domains those lenses belong to (unique) */
  domains: SmeDomain[]
  /** Mesh family ids whose keywords/industries hit this tag */
  meshFamilyIds: string[]
}

export interface SmeOverlapEdge {
  domainA: SmeDomain
  domainB: SmeDomain
  /** Shared tags (intersection) */
  sharedTags: string[]
  /** Jaccard |A∩B| / |A∪B| on focus-tag sets */
  jaccard: number
  /** Lenses that bridge both domains via shared tags */
  bridgeLensIds: string[]
}

export interface OperationalOverlap {
  /** Tags from context that hit ≥2 domains */
  multiDomainTags: Array<{ tag: string; domains: SmeDomain[] }>
  /** Domain pairs with meaningful tag overlap among active set */
  domainEdges: SmeOverlapEdge[]
  /** Active domains ordered by connectivity */
  domainsByCentrality: SmeDomain[]
  /** Human-readable notes for reasoning panels */
  notes: string[]
}

function norm(tag: string): string {
  return tag.trim().toLowerCase()
}

let _tagIndex: Map<string, TagNode> | null = null
let _domainTags: Map<SmeDomain, Set<string>> | null = null
let _lensById: Map<string, SmeLens> | null = null

function ensureIndexes(lenses: SmeLens[] = SME_LENSES): void {
  if (_tagIndex && _domainTags && _lensById) return
  _tagIndex = new Map()
  _domainTags = new Map()
  _lensById = new Map()

  for (const lens of lenses) {
    _lensById.set(lens.id, lens)
    if (!_domainTags.has(lens.domain)) _domainTags.set(lens.domain, new Set())
    for (const raw of lens.focusTags ?? []) {
      const tag = norm(raw)
      if (!tag) continue
      _domainTags.get(lens.domain)!.add(tag)
      let node = _tagIndex.get(tag)
      if (!node) {
        node = { tag, lensIds: [], domains: [], meshFamilyIds: [] }
        _tagIndex.set(tag, node)
      }
      if (!node.lensIds.includes(lens.id)) node.lensIds.push(lens.id)
      if (!node.domains.includes(lens.domain)) node.domains.push(lens.domain)
    }
  }

  // Wire mesh keywords + industries as tags (many meshes → many domains already on family)
  for (const fam of MESH_FAMILIES) {
    const tagSet = new Set<string>([
      ...fam.keywords.map(norm),
      ...fam.industries.map(norm),
    ])
    for (const tag of tagSet) {
      let node = _tagIndex.get(tag)
      if (!node) {
        node = { tag, lensIds: [], domains: [...fam.smeDomains], meshFamilyIds: [] }
        _tagIndex.set(tag, node)
      }
      if (!node.meshFamilyIds.includes(fam.id)) node.meshFamilyIds.push(fam.id)
      for (const d of fam.smeDomains) {
        if (!node.domains.includes(d)) node.domains.push(d)
        if (!_domainTags.has(d)) _domainTags.set(d, new Set())
        _domainTags.get(d)!.add(tag)
      }
    }
  }
}

/** Reset caches (tests) */
export function resetTagOverlapIndex(): void {
  _tagIndex = null
  _domainTags = null
  _lensById = null
}

export function getTagNode(tag: string): TagNode | undefined {
  ensureIndexes()
  return _tagIndex!.get(norm(tag))
}

/** All domains that share this tag (many-to-many) */
export function domainsForTag(tag: string): SmeDomain[] {
  return getTagNode(tag)?.domains.slice() ?? []
}

/** All lenses that declare this tag */
export function lensesForTag(tag: string): string[] {
  return getTagNode(tag)?.lensIds.slice() ?? []
}

/** All tags associated with a domain (union of its lenses + mesh links) */
export function tagsForDomain(domain: SmeDomain): string[] {
  ensureIndexes()
  return [...(_domainTags!.get(domain) ?? [])]
}

/** Mesh families linked to a tag */
export function meshFamiliesForTag(tag: string): string[] {
  return getTagNode(tag)?.meshFamilyIds.slice() ?? []
}

/**
 * Jaccard overlap of two domains' tag sets.
 * High overlap ⇒ operational / intelligence surface is shared.
 */
export function domainTagJaccard(a: SmeDomain, b: SmeDomain): SmeOverlapEdge {
  ensureIndexes()
  const A = _domainTags!.get(a) ?? new Set()
  const B = _domainTags!.get(b) ?? new Set()
  const shared: string[] = []
  for (const t of A) if (B.has(t)) shared.push(t)
  const union = A.size + B.size - shared.length
  const jaccard = union === 0 ? 0 : shared.length / union

  const bridgeLensIds: string[] = []
  for (const t of shared) {
    const node = _tagIndex!.get(t)
    if (!node) continue
    for (const lid of node.lensIds) {
      const lens = _lensById!.get(lid)
      if (!lens) continue
      if (
        (lens.domain === a || lens.domain === b) &&
        !bridgeLensIds.includes(lid)
      ) {
        // prefer lenses that sit on either side of the edge
        bridgeLensIds.push(lid)
      }
    }
  }

  return {
    domainA: a,
    domainB: b,
    sharedTags: shared.sort(),
    jaccard,
    bridgeLensIds: bridgeLensIds.slice(0, 12),
  }
}

/**
 * Build operational overlap among an active domain set (from desk context).
 */
export function computeOperationalOverlap(
  activeDomains: SmeDomain[],
  contextText = '',
): OperationalOverlap {
  ensureIndexes()
  const domains = [...new Set(activeDomains)]
  const t = contextText.toLowerCase()

  // Tags present in text that span multiple domains
  const multiDomainTags: OperationalOverlap['multiDomainTags'] = []
  for (const [tag, node] of _tagIndex!) {
    if (node.domains.length < 2) continue
    if (t && !t.includes(tag)) continue
    // if no text, still list highly multi-domain tags that touch active domains
    const touch = node.domains.filter((d) => domains.includes(d))
    if (t) {
      if (node.domains.length >= 2) multiDomainTags.push({ tag, domains: [...node.domains] })
    } else if (touch.length >= 2) {
      multiDomainTags.push({ tag, domains: touch })
    }
  }
  // Prefer tags with more domain span
  multiDomainTags.sort((a, b) => b.domains.length - a.domains.length)

  const domainEdges: SmeOverlapEdge[] = []
  for (let i = 0; i < domains.length; i++) {
    for (let j = i + 1; j < domains.length; j++) {
      const edge = domainTagJaccard(domains[i]!, domains[j]!)
      if (edge.jaccard > 0.02 || edge.sharedTags.length > 0) domainEdges.push(edge)
    }
  }
  domainEdges.sort((a, b) => b.jaccard - a.jaccard)

  // Centrality = sum of jaccard to peers
  const centrality = new Map<SmeDomain, number>()
  for (const d of domains) centrality.set(d, 0)
  for (const e of domainEdges) {
    centrality.set(e.domainA, (centrality.get(e.domainA) ?? 0) + e.jaccard)
    centrality.set(e.domainB, (centrality.get(e.domainB) ?? 0) + e.jaccard)
  }
  const domainsByCentrality = [...domains].sort(
    (a, b) => (centrality.get(b) ?? 0) - (centrality.get(a) ?? 0),
  )

  const notes: string[] = []
  if (multiDomainTags.length) {
    const top = multiDomainTags.slice(0, 4)
    notes.push(
      `Multi-domain tags (shared SME surfaces): ${top
        .map((m) => `“${m.tag}”→[${m.domains.join(', ')}]`)
        .join('; ')}.`,
    )
  }
  if (domainEdges.length) {
    const topE = domainEdges.slice(0, 3)
    notes.push(
      `Operational overlap: ${topE
        .map(
          (e) =>
            `${e.domainA}∩${e.domainB} (J=${e.jaccard.toFixed(2)}, shared ${e.sharedTags.slice(0, 4).join('/')})`,
        )
        .join('; ')}.`,
    )
  }
  if (!notes.length) {
    notes.push(
      'Tag↔SME graph is many-to-many: tags activate multiple lenses/domains; domains share tags for integrated reasoning.',
    )
  }

  return {
    multiDomainTags: multiDomainTags.slice(0, 24),
    domainEdges: domainEdges.slice(0, 24),
    domainsByCentrality,
    notes,
  }
}

/**
 * Score a mesh family using multi-SME / multi-tag overlap (not single-domain ownership).
 */
export function scoreFamilyWithOverlap(
  family: MeshFamily,
  ctx: {
    text: string
    industries: string[]
    smeDomains: SmeDomain[]
    /** Optional: boost when family bridges high-overlap domain pairs */
    overlap?: OperationalOverlap
  },
): { score: number; hitTags: string[]; hitDomains: SmeDomain[]; overlapNote: string } {
  ensureIndexes()
  const t = ctx.text.toLowerCase()
  let score = 0
  const hitTags: string[] = []
  const hitDomains = new Set<SmeDomain>()

  // Keyword / industry hits (tags)
  for (const kw of family.keywords) {
    const k = norm(kw)
    if (t.includes(k)) {
      score += 8
      hitTags.push(k)
      const node = _tagIndex!.get(k)
      node?.domains.forEach((d) => hitDomains.add(d))
    }
  }
  for (const ind of family.industries) {
    const k = norm(ind)
    if (
      ctx.industries.some(
        (i) => norm(i).includes(k) || k.includes(norm(i)) || t.includes(k),
      )
    ) {
      score += 6
      hitTags.push(k)
    }
  }

  // Direct domain membership (family may list many SMEs)
  for (const d of family.smeDomains) {
    if (ctx.smeDomains.includes(d)) {
      score += 5
      hitDomains.add(d)
    }
  }

  // Overlap bonus: family domains that sit on high-jaccard edges among active SMEs
  if (ctx.overlap) {
    for (const edge of ctx.overlap.domainEdges.slice(0, 8)) {
      const bridges =
        family.smeDomains.includes(edge.domainA) &&
        family.smeDomains.includes(edge.domainB)
      const touches =
        family.smeDomains.includes(edge.domainA) ||
        family.smeDomains.includes(edge.domainB)
      if (bridges) score += 7 * edge.jaccard + 2
      else if (touches) score += 3 * edge.jaccard
    }
    // Multi-domain tags on family keywords that appear in context
    for (const mt of ctx.overlap.multiDomainTags.slice(0, 12)) {
      if (family.keywords.some((k) => norm(k) === mt.tag) || t.includes(mt.tag)) {
        if (family.keywords.some((k) => norm(k) === mt.tag) || family.industries.some((i) => norm(i).includes(mt.tag))) {
          score += 1.5 * Math.min(mt.domains.length, 4)
          if (!hitTags.includes(mt.tag)) hitTags.push(mt.tag)
          mt.domains.forEach((d) => hitDomains.add(d))
        }
      }
    }
  }

  // Diversity micro-tie-break
  score += (family.seed % 7) * 0.01

  const domains = [...hitDomains]
  const overlapNote =
    domains.length >= 2
      ? `Integrates ${domains.length} SME domains [${domains.join(', ')}] via shared tags [${hitTags.slice(0, 5).join(', ') || 'domain-link'}].`
      : domains.length === 1
        ? `Primary SME surface: ${domains[0]}.`
        : 'General surface — weak multi-SME tag lock.'

  return { score, hitTags: [...new Set(hitTags)], hitDomains: domains, overlapNote }
}

/** Explain which SMEs share operational tags for a set of mesh families */
export function explainMeshSmeOverlap(families: MeshFamily[]): string[] {
  ensureIndexes()
  const domainCount = new Map<SmeDomain, number>()
  const tagCount = new Map<string, number>()
  for (const f of families) {
    for (const d of f.smeDomains) domainCount.set(d, (domainCount.get(d) ?? 0) + 1)
    for (const k of f.keywords) tagCount.set(norm(k), (tagCount.get(norm(k)) ?? 0) + 1)
  }
  const multiTags = [...tagCount.entries()]
    .filter(([tag, n]) => n >= 1 && (getTagNode(tag)?.domains.length ?? 0) >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)

  const notes: string[] = []
  notes.push(
    `Scene spans ${domainCount.size} SME domain(s): ${[...domainCount.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([d, n]) => `${d}×${n}`)
      .join(', ')}.`,
  )
  if (multiTags.length) {
    notes.push(
      `Shared tags across SMEs in this scene: ${multiTags
        .map(([t]) => {
          const d = getTagNode(t)?.domains ?? []
          return `${t}[${d.slice(0, 3).join('+')}]`
        })
        .join('; ')}.`,
    )
  }
  notes.push(
    'Model: tags↔SMEs are many-to-many — one tag can activate multiple specialists; one SME carries many tags (operational overlap).',
  )
  return notes
}
