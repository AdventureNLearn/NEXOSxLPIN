/**
 * Export Kit — explicit, user-triggered packages only.
 */

import type {
  AuditLadderState,
  DataPack,
  EvidenceItem,
  ProceduralAsset,
  WorkingDocument,
} from '../../types/core'
import { DETAIL_LADDER_LABELS, scoreToLabel } from '../../types/core'
import { workingDocumentMarkdown, downloadText } from '../../core/workingDocument'
import { countByScore } from '../../core/evidence'

export interface ExportBundleInput {
  workingDocument: WorkingDocument
  evidence: EvidenceItem[]
  ladder: AuditLadderState
  assets: ProceduralAsset[]
  activeAsset: ProceduralAsset | null
  dataPack: DataPack
  conditionsSummary: string
  includeUnity: boolean
  includeThree: boolean
  includeWorkingDoc: boolean
}

export function buildExportMarkdown(input: ExportBundleInput): string {
  const scores = countByScore(input.evidence)
  const lines: string[] = [
    '# Nexus Export Kit',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    '> Explicit user-triggered export. Nexus never auto-downloads packages.',
    '',
    '## Session',
    '',
    `- Data pack: ${input.dataPack.meta.name} (\`${input.dataPack.meta.id}@${input.dataPack.meta.version}\`)`,
    `- Conditions: ${input.conditionsSummary || 'none'}`,
    `- Evidence: +1=${scores['+1']} · 0=${scores['0']} · −1=${scores['-1']}`,
    `- Audit ladder: L${input.ladder.current} (unlocked L${input.ladder.unlocked})`,
    '',
    '## Audit Ladder',
    '',
  ]

  for (let i = 0; i <= 4; i++) {
    const lvl = i as 0 | 1 | 2 | 3 | 4
    const sc = input.ladder.scores[lvl]
    lines.push(
      `- ${DETAIL_LADDER_LABELS[lvl]}: ${input.ladder.populated[lvl] ? 'populated' : 'empty'}${
        sc === null || sc === undefined ? '' : ` · ${scoreToLabel(sc)}`
      }${input.ladder.notes[lvl] ? ` — ${input.ladder.notes[lvl]}` : ''}`,
    )
  }

  lines.push('', '## Evidence', '')
  for (const e of input.evidence) {
    lines.push(`### [${scoreToLabel(e.score)}] ${e.title}`)
    lines.push('')
    lines.push(e.summary)
    lines.push('')
    lines.push(`- Material: ${e.material}`)
    lines.push(`- Confidence: ${e.confidence}`)
    if (e.tags.length) lines.push(`- Tags: ${e.tags.join(', ')}`)
    lines.push('')
  }

  if (input.activeAsset) {
    lines.push('## Active Procedural Asset', '')
    lines.push(`- Name: ${input.activeAsset.name}`)
    lines.push(`- Type: ${input.activeAsset.assetType}`)
    lines.push(`- Version: ${input.activeAsset.version}`)
    lines.push(`- Description: ${input.activeAsset.description}`)
    lines.push(`- Deploy: ${input.activeAsset.animation.deployProgress}`)
    lines.push('')
  }

  if (input.includeWorkingDoc) {
    lines.push('---', '', workingDocumentMarkdown(input.workingDocument))
  }

  if (input.includeUnity && input.activeAsset) {
    lines.push('', '---', '', '## Unity C# Generator', '', '```csharp', input.activeAsset.unityCSharp, '```')
  }

  if (input.includeThree && input.activeAsset) {
    lines.push('', '---', '', '## Three.js / R3F Component', '', '```tsx', input.activeAsset.threeTsx, '```')
  }

  lines.push('', '---', '', '_Nexus Export Kit — evidence-first, explicit-only._', '')
  return lines.join('\n')
}

export function suggestExportFilename(prefix = 'nexus-export'): string {
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  return `${prefix}-${ts}.md`
}

export function triggerExportDownload(filename: string, markdown: string) {
  downloadText(filename, markdown, 'text/markdown;charset=utf-8')
}

export function triggerCodeDownload(filename: string, code: string) {
  const mime = filename.endsWith('.cs')
    ? 'text/plain;charset=utf-8'
    : 'text/typescript;charset=utf-8'
  downloadText(filename, code, mime)
}
