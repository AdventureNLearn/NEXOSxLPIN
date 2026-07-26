import { useMemo, useState } from 'react'
import { usePlatformStore } from '../../store/platformStore'
import { Panel, Btn, EvidenceBadge } from '../ui/primitives'
import {
  buildExportMarkdown,
  suggestExportFilename,
  triggerExportDownload,
  triggerCodeDownload,
} from '../../lib/export/exportKit'
import { workingDocumentMarkdown, downloadText } from '../../core/workingDocument'
import { countByScore, unresolvedNegatives } from '../../core/evidence'
import { SAMPLE_PACK } from '../../data/packs/samplePack'
import { DISCLAIMER_SHARE, MATURITY_BADGE } from '../../lib/product/maturity'

export function ExportKitModule({ compact }: { compact?: boolean } = {}) {
  const workingDocument = usePlatformStore((s) => s.workingDocument)
  const evidence = usePlatformStore((s) => s.evidence)
  const ladder = usePlatformStore((s) => s.ladder)
  const assets = usePlatformStore((s) => s.assets)
  const activeAsset = usePlatformStore((s) => s.assets.find((a) => a.id === s.activeAssetId) ?? null)
  const dataPack = usePlatformStore((s) => s.dataPack)
  const conditions = usePlatformStore((s) => s.conditions)
  const layer0AckToken = usePlatformStore((s) => s.layer0AckToken)
  const recordExport = usePlatformStore((s) => s.recordExport)
  const requestAction = usePlatformStore((s) => s.requestAction)
  const acknowledgeLayer0 = usePlatformStore((s) => s.acknowledgeLayer0)
  const appendWorkingNote = usePlatformStore((s) => s.appendWorkingNote)
  const loadDataPack = usePlatformStore((s) => s.loadDataPack)
  const pack = usePlatformStore((s) => s.dataPack)

  const [includeUnity, setIncludeUnity] = useState(true)
  const [includeThree, setIncludeThree] = useState(true)
  const [includeWorkingDoc, setIncludeWorkingDoc] = useState(true)
  const [preview, setPreview] = useState('')
  const [lastFilename, setLastFilename] = useState<string | null>(null)

  const conditionsSummary = useMemo(() => {
    if (!conditions) return ''
    const matrix = dataPack.conditionMatrices.find((m) => m.id === conditions.matrixId)
    return Object.entries(conditions.selections)
      .map(([axisId, optId]) => {
        const axis = matrix?.axes.find((a) => a.id === axisId)
        const opt = axis?.options.find((o) => o.id === optId)
        return `${axis?.label ?? axisId}: ${opt?.label ?? optId}`
      })
      .join(' · ')
  }, [conditions, dataPack])

  const scores = countByScore(evidence)
  const neg = unresolvedNegatives(evidence)
  const ackArmed = Boolean(layer0AckToken)
  const blockedByNeg = neg.length > 0
  const missingSources = evidence.filter(
    (e) => e.score === 1 && (!e.sourceRefs || e.sourceRefs.length === 0),
  ).length
  const uncited = evidence.filter((e) => !e.tags?.length).length
  const exportReady = !blockedByNeg && ackArmed

  const preflight = useMemo(
    () => [
      {
        ok: !blockedByNeg,
        label: blockedByNeg
          ? `−1 open: ${neg.length} (must clear)`
          : '−1 open: 0',
      },
      {
        ok: ackArmed,
        label: ackArmed ? 'Layer-0 ACK: armed' : 'Layer-0 ACK: not armed',
      },
      {
        ok: evidence.length > 0,
        label: `Evidence ledger: ${evidence.length} items (+1 ${scores['+1']} · 0 ${scores['0']} · −1 ${scores['-1']})`,
      },
      {
        ok: missingSources === 0,
        label:
          missingSources === 0
            ? '+1 claims: all have sourceRefs'
            : `+1 claims missing sourceRefs: ${missingSources}`,
      },
      {
        ok: workingDocument.entries.length > 0,
        label: `Working document entries: ${workingDocument.entries.length}`,
      },
      {
        ok: ladder.current >= 0,
        label: `Audit ladder: L${ladder.current}`,
      },
      {
        ok: uncited < evidence.length || evidence.length === 0,
        label: `Untagged claims: ${uncited}`,
      },
    ],
    [blockedByNeg, neg, ackArmed, evidence.length, scores, missingSources, workingDocument.entries.length, ladder, uncited],
  )

  const gateMessage = blockedByNeg
    ? `Blocked: ${neg.length} unresolved −1 evidence item(s). Resolve or remove them in Research Hub, then ACK Layer-0.`
    : !ackArmed
      ? 'Blocked: Layer-0 not acknowledged. Click ACK Layer-0 (here or status bar), then download once.'
      : missingSources > 0
        ? `Caution: ready for download, but ${missingSources} +1 claim(s) lack sourceRefs — cite before high-stakes share.`
        : 'Ready: Layer-0 ACK armed and no open −1 items. Preview is free; download is user-triggered only.'

  const build = () =>
    buildExportMarkdown({
      workingDocument,
      evidence,
      ladder,
      assets,
      activeAsset,
      dataPack,
      conditionsSummary,
      includeUnity,
      includeThree,
      includeWorkingDoc,
    })

  const showBlockedPreview = (reason: string) => {
    const md = build()
    setPreview(`// EXPORT BLOCKED\n// ${reason}\n\n${md.slice(0, 1800)}`)
  }

  const doExport = () => {
    if (blockedByNeg) {
      showBlockedPreview(`${neg.length} unresolved −1 item(s). Export hard-blocked.`)
      return
    }
    if (!ackArmed) {
      showBlockedPreview('Layer-0 ACK required before package download.')
      return
    }
    const md = build()
    const filename = suggestExportFilename()
    const ok = recordExport(
      'Export Kit package',
      `File ${filename} · evidence ${evidence.length} · unity=${includeUnity} three=${includeThree}`,
    )
    if (!ok) {
      showBlockedPreview('Layer-0 hold — ACK and clear open −1 items, then retry.')
      return
    }
    triggerExportDownload(filename, md)
    setLastFilename(filename)
    setPreview(md)
  }

  const downloadCode = (kind: 'unity' | 'three') => {
    if (!activeAsset) return
    if (blockedByNeg) {
      showBlockedPreview(`${neg.length} unresolved −1 item(s). Code export blocked.`)
      return
    }
    if (!ackArmed) {
      showBlockedPreview('Layer-0 ACK required before code download.')
      return
    }
    const action = kind === 'unity' ? 'export.unity' : 'export.three'
    const g = requestAction(action)
    if (!g.allowed) {
      showBlockedPreview(g.message)
      return
    }
    const base = `${activeAsset.name.replace(/\s+/g, '_')}_v${activeAsset.version}`
    const filename = kind === 'unity' ? `${base}.cs` : `${base}.tsx`
    const body = kind === 'unity' ? activeAsset.unityCSharp : activeAsset.threeTsx
    triggerCodeDownload(filename, body)
    appendWorkingNote(
      kind === 'unity' ? 'Unity C# download' : 'Three/R3F download',
      `${filename} · ${activeAsset.name} v${activeAsset.version}`,
      'export-kit',
    )
    setLastFilename(filename)
    setPreview(`// Downloaded ${filename}\n// ${g.message}\n\n${body.slice(0, 2000)}`)
  }

  if (compact) {
    return (
      <div className="h-full min-h-0 flex flex-col gap-2">
        <div
          className={`rounded-md border p-2 text-[11px] ${
            exportReady
              ? 'border-emerald-900/60 bg-emerald-950/20 text-emerald-100/90'
              : blockedByNeg
                ? 'border-rose-900/60 bg-rose-950/25 text-rose-100/90'
                : 'border-amber-900/50 bg-amber-950/20 text-amber-100/90'
          }`}
          role="status"
        >
          <div className="font-semibold text-[10px] uppercase opacity-80">
            Export · {exportReady ? 'Ready' : blockedByNeg ? 'Hard block (−1)' : 'Needs ACK'}
          </div>
          <p className="mt-0.5 line-clamp-2">{gateMessage}</p>
          <div className="mt-1 flex flex-wrap gap-2">
            <EvidenceBadge score={1} /> {scores['+1']}
            <EvidenceBadge score={0} /> {scores['0']}
            <EvidenceBadge score={-1} /> {scores['-1']}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Btn variant="ghost" onClick={() => acknowledgeLayer0('Export Kit ACK')}>
            ACK Layer-0
          </Btn>
          <Btn onClick={() => setPreview(build())}>Preview</Btn>
          <Btn variant="primary" onClick={doExport}>
            Download package
          </Btn>
        </div>
        {preview && (
          <pre className="flex-1 min-h-0 overflow-auto rounded-md bg-black/50 border border-slate-800 p-2 text-[9px] font-mono text-slate-500 whitespace-pre-wrap">
            {preview.slice(0, 1200)}
          </pre>
        )}
      </div>
    )
  }

  return (
    <div className="h-full grid grid-cols-1 xl:grid-cols-2 gap-3 min-h-0">
      <Panel title="Share pack — explicit only">
        <p className="text-xs text-amber-200/80 mb-2 border border-amber-900/40 rounded-md px-2 py-1.5 bg-amber-950/20">
          <span className="font-bold tracking-wide">{MATURITY_BADGE}.</span> {DISCLAIMER_SHARE}
        </p>
        <p className="text-xs text-slate-500 mb-3">
          Packages download only when you click a download button. Preview never downloads. This desk
          never auto-downloads.
        </p>

        <div
          className={`rounded-md border p-3 mb-3 text-xs space-y-1 ${
            exportReady
              ? 'border-emerald-900/60 bg-emerald-950/20 text-emerald-100/90'
              : blockedByNeg
                ? 'border-rose-900/60 bg-rose-950/25 text-rose-100/90'
                : 'border-amber-900/50 bg-amber-950/20 text-amber-100/90'
          }`}
          role="status"
        >
          <div className="font-semibold tracking-wide uppercase text-[10px] opacity-80">
            Export gate · {exportReady ? 'Ready' : blockedByNeg ? 'Hard block (−1)' : 'Needs ACK'}
          </div>
          <p>{gateMessage}</p>
          {lastFilename && exportReady && (
            <p className="text-[10px] opacity-70">Last download: {lastFilename}</p>
          )}
          <ul className="mt-2 space-y-0.5 text-[10px] font-mono">
            {preflight.map((p) => (
              <li key={p.label} className={p.ok ? 'text-emerald-300/90' : 'text-amber-200/90'}>
                {p.ok ? '✓' : '○'} {p.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-md border border-slate-800 p-3 mb-3 text-xs space-y-1">
          <div className="flex flex-wrap gap-3">
            <span>
              Evidence <EvidenceBadge score={1} /> {scores['+1']}
            </span>
            <span>
              <EvidenceBadge score={0} /> {scores['0']}
            </span>
            <span>
              <EvidenceBadge score={-1} /> {scores['-1']}
            </span>
          </div>
          <div className="text-slate-400">Pack: {dataPack.meta.name}</div>
          <div className="text-slate-500">Conditions: {conditionsSummary || '—'}</div>
          <div className="text-slate-500">
            Ladder L{ladder.current} · WD {workingDocument.entries.length} entries · Assets{' '}
            {assets.length}
            {activeAsset ? ` · Active ${activeAsset.name} v${activeAsset.version}` : ''}
          </div>
          {neg.length > 0 && (
            <div className="text-rose-300/90 pt-1">
              Unresolved −1 item(s):
              <ul className="mt-1 list-disc pl-4 text-rose-200/80">
                {neg.map((n) => (
                  <li key={n.id}>{n.title}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-2 text-xs text-slate-300 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeWorkingDoc}
              onChange={(e) => setIncludeWorkingDoc(e.target.checked)}
            />
            Include working document
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeUnity}
              onChange={(e) => setIncludeUnity(e.target.checked)}
            />
            Include Unity C# (active asset)
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeThree}
              onChange={(e) => setIncludeThree(e.target.checked)}
            />
            Include Three.js / R3F (active asset)
          </label>
        </div>

        <div className="flex flex-wrap gap-2">
          <Btn
            variant="ghost"
            title="Arm one-shot Layer-0 clearance for the next high-stakes export"
            onClick={() => acknowledgeLayer0('Export Kit ACK')}
          >
            ACK Layer-0
          </Btn>
          <Btn
            title="Build markdown package in the preview pane only — no download"
            onClick={() => {
              setPreview(build())
              setLastFilename(null)
            }}
          >
            Preview package
          </Btn>
          <Btn
            variant="primary"
            title={
              exportReady
                ? 'Download versioned markdown package'
                : 'Blocked until ACK and no open −1 items'
            }
            onClick={doExport}
          >
            Generate & download package
          </Btn>
          <Btn
            title="Download working document markdown only (Layer-0 gated)"
            onClick={() => {
              if (blockedByNeg) {
                showBlockedPreview(`${neg.length} unresolved −1 item(s). WD export blocked.`)
                return
              }
              if (!ackArmed) {
                showBlockedPreview('Layer-0 ACK required before working-document download.')
                return
              }
              const g = requestAction('export.working-document')
              if (g.allowed) {
                const fn = `nexus-working-document-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}.md`
                downloadText(fn, workingDocumentMarkdown(workingDocument))
                // requestAction already consumed the one-shot ACK; do not re-gate via recordExport
                appendWorkingNote('Working document download', `Standalone WD · ${fn}`, 'export-kit')
                setLastFilename(fn)
                setPreview(workingDocumentMarkdown(workingDocument))
              } else {
                showBlockedPreview(g.message)
              }
            }}
          >
            Download working document
          </Btn>
          {activeAsset && (
            <>
              <Btn
                title={
                  exportReady
                    ? `Download ${activeAsset.name} Unity C# v${activeAsset.version}`
                    : 'Blocked until ACK and no open −1 items'
                }
                onClick={() => downloadCode('unity')}
              >
                Unity only
              </Btn>
              <Btn
                title={
                  exportReady
                    ? `Download ${activeAsset.name} Three/R3F v${activeAsset.version}`
                    : 'Blocked until ACK and no open −1 items'
                }
                onClick={() => downloadCode('three')}
              >
                Three only
              </Btn>
            </>
          )}
        </div>

        <div className="mt-6 border-t border-slate-800 pt-3">
          <h3 className="text-xs font-semibold text-slate-400 mb-2">Data pack</h3>
          <p className="text-[11px] text-slate-500 mb-2">
            Active: {pack.meta.name} ({pack.meta.id}@{pack.meta.version})
          </p>
          <Btn
            title="Reload Sample Pack Alpha (requires Layer-0 ACK)"
            onClick={() => {
              acknowledgeLayer0('Reload sample pack')
              loadDataPack(SAMPLE_PACK)
            }}
          >
            Reload Sample Pack Alpha
          </Btn>
        </div>
      </Panel>

      <Panel title="Package preview">
        <pre className="h-full min-h-[360px] overflow-auto rounded-md bg-black/50 border border-slate-800 p-3 text-[10px] font-mono text-slate-400 whitespace-pre-wrap">
          {preview ||
            'Preview builds the package in-pane without downloading. Use Generate & download for an explicit file.'}
        </pre>
      </Panel>
    </div>
  )
}

export default ExportKitModule
