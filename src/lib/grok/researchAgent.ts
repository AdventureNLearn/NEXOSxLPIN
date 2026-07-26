/**
 * Grok research agent — builds verification-first research templates and
 * opens public Grok (or copies prompt) for operator use.
 *
 * Public path: no API key required (opens grok.com with prepared prompt).
 * Optional API path: XAI_API_KEY via Vite env is intentionally NOT read in-browser
 * for OPSEC — use a future local proxy if live API is required.
 */

import { sanitizePromptText } from '../security/urlSafety'
import { openSafeExternal, safeExternalUrl } from '../security/urlSafety'

export type ResearchTemplateId =
  | 'primary-records'
  | 'claim-decomposition'
  | 'agency-docket'
  | 'industry-effect'
  | 'counter-evidence'
  | 'export-gate'
  | 'custom'

export interface ResearchTemplate {
  id: ResearchTemplateId
  label: string
  description: string
  /** Build prompt body from desk context */
  build: (ctx: ResearchContext) => string
}

export interface ResearchContext {
  deskTitle: string
  deskId: string
  where?: string
  lede?: string
  stakes?: string
  claims?: string[]
  sources?: Array<{ title: string; url: string; why: string }>
  operatorQuestion?: string
  agencyHint?: string
  industryHint?: string
}

export const RESEARCH_TEMPLATES: ResearchTemplate[] = [
  {
    id: 'primary-records',
    label: 'Primary records hunt',
    description: 'Locate agency / statute / docket primaries for this desk',
    build: (ctx) =>
      [
        'You are assisting a verification desk (tools, not media). Objective only.',
        `Desk: ${ctx.deskTitle} (${ctx.deskId})`,
        ctx.where ? `Where: ${ctx.where}` : '',
        ctx.agencyHint ? `Agency hint: ${ctx.agencyHint}` : '',
        '',
        'Task: List PRIMARY public-record sources (agency pages, dockets, enrolled text, GAO/CRS) that would ground claims on this desk.',
        'For each source: official title, stable URL pattern, what fact class it can support, and what it cannot prove.',
        'Refuse narrative framing. Flag anything that is secondary or social-only.',
        ctx.operatorQuestion ? `Operator question: ${ctx.operatorQuestion}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
  },
  {
    id: 'claim-decomposition',
    label: 'Claim decomposition',
    description: 'Break claims into atomic facts with +1/0/−1 scoring advice',
    build: (ctx) =>
      [
        'Verification desk — decompose claims into atomic facts.',
        `Desk: ${ctx.deskTitle}`,
        '',
        'Claims under review:',
        ...(ctx.claims?.length
          ? ctx.claims.map((c, i) => `${i + 1}. ${c}`)
          : ['(none listed — ask operator for claims)']),
        '',
        'For each claim: (a) atomic sub-facts, (b) best primary source type, (c) suggested score +1 / 0 / −1 with one-line why,',
        '(d) what would falsify it. No narrative color. No invented statute numbers.',
        ctx.operatorQuestion ? `Focus: ${ctx.operatorQuestion}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
  },
  {
    id: 'agency-docket',
    label: 'Agency / docket map',
    description: 'Map which agency instruments govern this topic',
    build: (ctx) =>
      [
        'Map governing instruments for an industry-effect oversight desk.',
        `Topic: ${ctx.deskTitle}`,
        ctx.agencyHint ? `Start agency: ${ctx.agencyHint}` : '',
        ctx.industryHint ? `Industry: ${ctx.industryHint}` : '',
        '',
        'Output a table: Instrument type | Where published | What duty/cost it can create | Confidence if only homepage cited.',
        'Prefer official domains. Mark unknowns as unknown.',
      ]
        .filter(Boolean)
        .join('\n'),
  },
  {
    id: 'industry-effect',
    label: 'Industry-effect analysis',
    description: 'Compliance cost / market access — heterogeneous, quantified gaps',
    build: (ctx) =>
      [
        'Industry-effect verification (private compliance cost, market access).',
        `Desk: ${ctx.deskTitle}`,
        ctx.industryHint ? `Industry focus: ${ctx.industryHint}` : '',
        ctx.stakes ? `Stakes: ${ctx.stakes}` : '',
        '',
        'Identify: (1) cost channels, (2) who is differentially affected by firm size, (3) data needed to quantify,',
        '(4) claims that are direction-only (score 0), (5) disqualifying overclaims (−1).',
        'Cite public data series or report types, not social media.',
      ]
        .filter(Boolean)
        .join('\n'),
  },
  {
    id: 'counter-evidence',
    label: 'Counter-evidence pass',
    description: 'What would falsify the strongest +1 claims',
    build: (ctx) =>
      [
        'Counter-evidence / falsification pass for a verification desk.',
        `Desk: ${ctx.deskTitle}`,
        'Strongest claims:',
        ...(ctx.claims?.slice(0, 6).map((c, i) => `${i + 1}. ${c}`) ?? ['(none)']),
        '',
        'For each: best falsifier, where it would appear in primary records, and whether current sources are enough to hold +1.',
      ].join('\n'),
  },
  {
    id: 'export-gate',
    label: 'Export / publish gate',
    description: 'Pre-publish integrity checklist for this desk',
    build: (ctx) =>
      [
        'Pre-publish integrity checklist (Layer-0 style).',
        `Desk: ${ctx.deskTitle}`,
        '',
        'Linked sources:',
        ...(ctx.sources?.slice(0, 8).map((s) => `- ${s.title}: ${s.url} (${s.why})`) ?? [
          '- (none linked)',
        ]),
        '',
        'Produce: must-fix before export, open −1 risks, missing primaries, and a one-paragraph objective status (not a news lede).',
      ].join('\n'),
  },
  {
    id: 'custom',
    label: 'Custom question',
    description: 'Operator question wrapped in verification rules',
    build: (ctx) =>
      [
        'Verification desk rules: objective, primary-record preference, no invented citations, tri-state scoring language (+1/0/−1).',
        `Desk context: ${ctx.deskTitle} (${ctx.deskId})`,
        ctx.lede ? `Background: ${ctx.lede.slice(0, 500)}` : '',
        '',
        `Question: ${ctx.operatorQuestion || '(operator did not supply a question)'}`,
        '',
        'Answer with sources to seek, score advice, and gaps. Tools not media.',
      ]
        .filter(Boolean)
        .join('\n'),
  },
]

export function getTemplate(id: ResearchTemplateId): ResearchTemplate {
  return RESEARCH_TEMPLATES.find((t) => t.id === id) ?? RESEARCH_TEMPLATES[0]!
}

export function buildResearchPrompt(
  templateId: ResearchTemplateId,
  ctx: ResearchContext,
): string {
  const t = getTemplate(templateId)
  return sanitizePromptText(t.build(ctx))
}

/** Public Grok entry — opens prepared research in a new tab when possible */
export function publicGrokUrl(prompt: string): string {
  const q = encodeURIComponent(sanitizePromptText(prompt, 4000))
  // Public Grok web surfaces (operator may need to paste if query param ignored)
  return `https://grok.com/?q=${q}`
}

export interface GrokAgentResult {
  prompt: string
  templateId: ResearchTemplateId
  opened: boolean
  url: string | null
  copied: boolean
  message: string
}

/**
 * Run agent: build prompt → try open public Grok → always expose copy path.
 */
export async function runGrokResearchAgent(
  templateId: ResearchTemplateId,
  ctx: ResearchContext,
  opts?: { open?: boolean; copy?: boolean },
): Promise<GrokAgentResult> {
  const prompt = buildResearchPrompt(templateId, ctx)
  const url = publicGrokUrl(prompt)
  const safe = safeExternalUrl(url)
  let opened = false
  let copied = false

  if (opts?.copy !== false && typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(prompt)
      copied = true
    } catch {
      copied = false
    }
  }

  if (opts?.open !== false && safe) {
    opened = openSafeExternal(safe)
  }

  return {
    prompt,
    templateId,
    opened,
    url: safe,
    copied,
    message: opened
      ? copied
        ? 'Opened public Grok · prompt also copied to clipboard'
        : 'Opened public Grok with research template'
      : copied
        ? 'Prompt copied — paste into grok.com if the tab did not open'
        : 'Template ready — copy manually if clipboard blocked',
  }
}
