/**
 * Working-document persistence helpers.
 */

import type { EvidenceScore, ModuleId, WorkingDocEntry, WorkingDocument } from '../types/core'
import { uid } from '../types/core'

export function createWorkingDocument(title = 'Session Working Document'): WorkingDocument {
  const now = new Date().toISOString()
  return {
    id: uid('wd'),
    title,
    createdAt: now,
    updatedAt: now,
    entries: [
      {
        id: uid('wde'),
        at: now,
        kind: 'note',
        title: 'Session opened',
        body: 'Working document initialized. Major decisions, generations, and exports will append here.',
        moduleId: 'information',
      },
    ],
  }
}

export function appendEntry(
  doc: WorkingDocument,
  partial: Omit<WorkingDocEntry, 'id' | 'at'> & { at?: string },
): WorkingDocument {
  const entry: WorkingDocEntry = {
    id: uid('wde'),
    at: partial.at ?? new Date().toISOString(),
    kind: partial.kind,
    title: partial.title,
    body: partial.body,
    score: partial.score,
    moduleId: partial.moduleId,
    meta: partial.meta,
  }
  return {
    ...doc,
    updatedAt: entry.at,
    entries: [...doc.entries, entry],
  }
}

export function logDecision(
  doc: WorkingDocument,
  title: string,
  body: string,
  opts?: { score?: EvidenceScore; moduleId?: ModuleId },
): WorkingDocument {
  return appendEntry(doc, {
    kind: 'decision',
    title,
    body,
    score: opts?.score,
    moduleId: opts?.moduleId,
  })
}

export function logGeneration(
  doc: WorkingDocument,
  title: string,
  body: string,
  moduleId: ModuleId = 'procedural-forge',
): WorkingDocument {
  return appendEntry(doc, { kind: 'generation', title, body, moduleId })
}

export function logExport(
  doc: WorkingDocument,
  title: string,
  body: string,
): WorkingDocument {
  return appendEntry(doc, { kind: 'export', title, body, moduleId: 'export-kit' })
}

export function logRewrite(
  doc: WorkingDocument,
  title: string,
  body: string,
): WorkingDocument {
  return appendEntry(doc, { kind: 'rewrite', title, body, moduleId: 'procedural-forge' })
}

export function workingDocumentMarkdown(doc: WorkingDocument): string {
  const lines: string[] = [
    `# ${doc.title}`,
    '',
    `- Document ID: \`${doc.id}\``,
    `- Created: ${doc.createdAt}`,
    `- Updated: ${doc.updatedAt}`,
    `- Entries: ${doc.entries.length}`,
    '',
    '---',
    '',
  ]
  for (const e of doc.entries) {
    const score = e.score === undefined ? '' : ` · score ${e.score === 1 ? '+1' : e.score === -1 ? '−1' : '0'}`
    const mod = e.moduleId ? ` · ${e.moduleId}` : ''
    lines.push(`## ${e.title}`)
    lines.push('')
    lines.push(`*${e.at} · ${e.kind}${mod}${score}*`)
    lines.push('')
    lines.push(e.body)
    lines.push('')
  }
  return lines.join('\n')
}

export function downloadText(filename: string, content: string, mime = 'text/markdown;charset=utf-8') {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
