import { useMemo, useState } from 'react'
import { usePlatformStore } from '../../store/platformStore'
import type { EvidenceScore, ModuleId } from '../../types/core'
import { MODULE_META } from '../../types/core'
import { Panel, Btn, EvidenceBadge } from '../ui/primitives'
import { inputClass } from '../ui/formClasses'
import { SME_LENSES, listTechnicalLenses, smeDomainOrder } from '../../data/sme/lenses'
import { SME_DOMAIN_META } from '../../types/sme'
import { congressionalDesks } from '../../data/useCases/catalog'
import { countByScore, unresolvedNegatives } from '../../core/evidence'
const COMMANDS: Array<{
  match: RegExp
  help: string
  run: (args: string, api: CmdApi) => string
}> = [
  {
    match: /^help$/i,
    help: 'help — list commands',
    run: () =>
      [
        'help',
        'modules',
        'open <module>',
        'ack [reason]',
        'layer0 <action>',
        'score < +1 | 0 | -1 > <title> :: <summary>',
        'conditions apply',
        'ladder <0-4>',
        'forge generate <assetTypeId> | <name>',
        'sme [list|tech|count|domains|search|run|run-domain|select|id]',
        'desk list|cong',
        'evidence summary',
        'layer0 status',
        'export check',
        'ui web|mobile',
        'status',
      ].join('\n'),
  },
  {
    match: /^modules$/i,
    help: 'modules',
    run: () =>
      (Object.keys(MODULE_META) as ModuleId[]).map((id) => `${id} — ${MODULE_META[id].label}`).join('\n'),
  },
  {
    match: /^open\s+(.+)$/i,
    help: 'open <module>',
    run: (args, api) => {
      const id = args.trim().toLowerCase() as ModuleId
      if (!MODULE_META[id]) return `Unknown module: ${args}`
      api.setModule(id)
      return `Opened ${MODULE_META[id].label}`
    },
  },
  {
    match: /^ack(?:\s+(.*))?$/i,
    help: 'ack [reason]',
    run: (args, api) => {
      api.acknowledgeLayer0(args.trim() || 'Analyst ACK')
      return 'Layer-0 acknowledged (one-shot).'
    },
  },
  {
    match: /^layer0\s+(.+)$/i,
    help: 'layer0 <action>',
    run: (args, api) => {
      const r = api.requestAction(args.trim())
      return r.message
    },
  },
  {
      match: /^score\s+([+-]?1|0)\s+(.+?)\s*::\s*(.+)$/i,
      help: 'score <+1|0|-1> <title> :: <summary>',
      run: (args, api) => {
        const m = args.match(/^([+-]?1|0)\s+(.+?)\s*::\s*(.+)$/i)
        if (!m) return 'Usage: score <+1|0|-1> <title> :: <summary>'
        const raw = m[1]
        const score = (raw === '+1' || raw === '1' ? 1 : raw === '-1' ? -1 : 0) as EvidenceScore
        api.addEvidence({
          title: m[2].trim(),
          summary: m[3].trim(),
          score,
          confidence: score === 1 ? 'high' : 'medium',
          material: score === 1 ? 'primary' : score === -1 ? 'assumption' : 'derived',
          tags: ['analyst'],
          sourceRefs: [],
          moduleId: 'analyst',
        })
        return `Evidence filed at ${score === 1 ? '+1' : score === -1 ? '−1' : '0'}`
      },
    },
  {
    match: /^conditions\s+apply$/i,
    help: 'conditions apply',
    run: (_a, api) => {
      api.applyConditions()
      return 'Conditions applied.'
    },
  },
  {
    match: /^ladder\s+([0-4])$/i,
    help: 'ladder <0-4>',
    run: (args, api) => {
      const level = Number(args.trim()) as 0 | 1 | 2 | 3 | 4
      api.setLadderLevel(level)
      return `Ladder set request → L${level} (Layer-0 may hold L3+).`
    },
  },
  {
    match: /^forge\s+generate\s+(.+)$/i,
    help: 'forge generate <assetTypeId>',
    run: (args, api) => {
      const assetType = args.trim()
      const packType = api.assetTypes.find((t) => t.id === assetType)
      const id = packType?.id ?? api.assetTypes[0]?.id ?? 'mast-enclosure-a'
      const asset = api.generateProceduralAsset({
        name: packType?.label ?? 'Generated Asset',
        assetType: id,
        description: packType?.description ?? `Generated via Analyst for type ${assetType}`,
      })
      return asset ? `Generated ${asset.name} (${asset.id})` : 'Generate failed'
    },
  },
  {
    match: /^sme(?:\s+(.*))?$/i,
    help: 'sme [list|tech|count|domains|search <q>|select <id>|run|run-domain <d>|<lens-id>]',
    run: (args, api) => {
      const raw = args.trim()
      const a = raw.toLowerCase()
      if (!a || a === 'list') {
        return api.listSmeLenses()
      }
      if (a === 'tech') {
        return api.listTechSmeLenses()
      }
      if (a === 'count') {
        return api.smeCount()
      }
      if (a === 'domains') {
        return api.smeDomains()
      }
      if (a.startsWith('search ')) {
        return api.smeSearch(raw.slice(7).trim())
      }
      if (a.startsWith('run-domain ')) {
        return api.smeRunDomain(raw.slice(11).trim())
      }
      if (a === 'run' || a === 'run-selected') {
        const briefs = api.runSelectedSmeLenses()
        return `SME multi-run · ${briefs.length}\n` + briefs.map((b) => `· ${b.lensName}: ${b.headline}`).join('\n')
      }
      if (a.startsWith('select ')) {
        const idRaw = raw.slice(7).trim()
        const id = idRaw.startsWith('sme-') ? idRaw : `sme-${idRaw}`
        api.toggleSmeLensSelection(id)
        return `Toggled selection · ${id} · selected=${api.selectedCount()}`
      }
      const brief = api.runSmeLens(a.startsWith('sme-') ? a : `sme-${a}`)
      return `SME · ${brief.lensName}\n${brief.headline}\nTop action: ${brief.actions[0]?.title ?? '—'}`
    },
  },
  {
    match: /^desk(?:\s+(.*))?$/i,
    help: 'desk [list|cong]',
    run: (args, api) => {
      const a = args.trim().toLowerCase()
      if (!a || a === 'list' || a === 'cong') return api.deskList()
      return 'Usage: desk list | desk cong'
    },
  },
  {
    match: /^evidence\s+summary$/i,
    help: 'evidence summary',
    run: (_a, api) => api.evidenceSummary(),
  },
  {
    match: /^layer0\s+status$/i,
    help: 'layer0 status',
    run: (_a, api) => api.layer0Status(),
  },
  {
    match: /^export\s+check$/i,
    help: 'export check',
    run: (_a, api) => api.exportCheck(),
  },
  {
    match: /^ui\s+(web|mobile)$/i,
    help: 'ui web | ui mobile',
    run: (args, api) => {
      const m = args.trim().toLowerCase() as 'web' | 'mobile'
      api.setUiMode(m)
      return `UI mode → ${m}`
    },
  },
  {
    match: /^status$/i,
    help: 'status',
    run: (_a, api) => api.statusLine(),
  },
]

interface CmdApi {
  setModule: (id: ModuleId) => void
  acknowledgeLayer0: (reason: string) => void
  requestAction: (action: string) => { allowed: boolean; message: string }
  addEvidence: ReturnType<typeof usePlatformStore.getState>['addEvidence']
  applyConditions: () => void
  setLadderLevel: (l: 0 | 1 | 2 | 3 | 4) => void
  generateProceduralAsset: ReturnType<typeof usePlatformStore.getState>['generateProceduralAsset']
  assetTypes: { id: string; label: string; description: string }[]
  statusLine: () => string
  runSmeLens: ReturnType<typeof usePlatformStore.getState>['runSmeLens']
  runSelectedSmeLenses: ReturnType<typeof usePlatformStore.getState>['runSelectedSmeLenses']
  toggleSmeLensSelection: ReturnType<typeof usePlatformStore.getState>['toggleSmeLensSelection']
  selectedCount: () => number
  listSmeLenses: () => string
  listTechSmeLenses: () => string
  smeCount: () => string
  smeDomains: () => string
  smeSearch: (q: string) => string
  smeRunDomain: (d: string) => string
  deskList: () => string
  evidenceSummary: () => string
  layer0Status: () => string
  exportCheck: () => string
  setUiMode: (m: 'web' | 'mobile') => void
}

export function AnalystModule({ embedded }: { embedded?: boolean } = {}) {
  const store = usePlatformStore()
  const analystLog = usePlatformStore((s) => s.analystLog)
  const setAnalystLog = usePlatformStore((s) => s.setAnalystLog)
  const activeUseCaseId = usePlatformStore((s) => s.activeUseCaseId)
  const [input, setInput] = useState('')

  const api: CmdApi = useMemo(
    () => ({
      setModule: store.setModule,
      acknowledgeLayer0: store.acknowledgeLayer0,
      requestAction: store.requestAction,
      addEvidence: store.addEvidence,
      applyConditions: store.applyConditions,
      setLadderLevel: store.setLadderLevel,
      generateProceduralAsset: store.generateProceduralAsset,
      assetTypes: store.dataPack.assetTypes,
      runSmeLens: store.runSmeLens,
      runSelectedSmeLenses: store.runSelectedSmeLenses,
      toggleSmeLensSelection: store.toggleSmeLensSelection,
      selectedCount: () => store.selectedSmeLensIds.length,
      listSmeLenses: () => {
        const lines = SME_LENSES.map((l) => `${l.id} — ${l.short} · ${l.domain}`)
        const head = lines.slice(0, 40)
        const more =
          lines.length > 40
            ? `\n… ${lines.length - 40} more (use SME Lenses module filter; total ${lines.length})`
            : ''
        return `SME lenses: ${lines.length}\n` + head.join('\n') + more
      },
      listTechSmeLenses: () =>
        listTechnicalLenses()
          .map((l) => `${l.id} — ${l.short} · ${l.domain}`)
          .join('\n'),
      smeCount: () =>
        `SME total ${SME_LENSES.length} · tech ${listTechnicalLenses().length} · selected ${store.selectedSmeLensIds.length}`,
      smeDomains: () =>
        smeDomainOrder()
          .map((d) => {
            const n = SME_LENSES.filter((l) => l.domain === d).length
            return `${d} · ${SME_DOMAIN_META[d].label} · ${n}`
          })
          .join('\n'),
      smeSearch: (q) => {
        const qq = q.toLowerCase()
        const hits = SME_LENSES.filter(
          (l) =>
            l.id.includes(qq) ||
            l.short.toLowerCase().includes(qq) ||
            l.name.toLowerCase().includes(qq) ||
            l.focusTags.some((t) => t.includes(qq)),
        ).slice(0, 30)
        return hits.length
          ? hits.map((l) => `${l.id} — ${l.short}`).join('\n')
          : `No SME match for “${q}”`
      },
      smeRunDomain: (d) => {
        const dom = d.toLowerCase().replace(/\s+/g, '-')
        const ids = SME_LENSES.filter(
          (l) => l.domain === dom || l.domain.includes(dom) || SME_DOMAIN_META[l.domain].label.toLowerCase().includes(d.toLowerCase()),
        ).map((l) => l.id)
        if (!ids.length) return `No domain match for “${d}”`
        store.setSelectedSmeLenses(ids.slice(0, 12))
        const briefs = store.runSelectedSmeLenses()
        return `Domain run · ${briefs.length} (capped 12)\n` + briefs.map((b) => `· ${b.lensName}`).join('\n')
      },
      deskList: () => {
        const desks = congressionalDesks()
        return (
          `Congressional desks: ${desks.length}\n` +
          desks
            .slice(0, 56)
            .map((p) => `${p.id} — ${p.label}`)
            .join('\n')
        )
      },
      evidenceSummary: () => {
        const c = countByScore(store.evidence)
        const neg = unresolvedNegatives(store.evidence)
        return `evidence=${store.evidence.length} · +1 ${c['+1']} · 0 ${c['0']} · −1 ${c['-1']} · open−1=${neg.length}`
      },
      layer0Status: () =>
        `layer0.active=${store.layer0.active} · reason=${store.layer0.reason || '—'} · ack=${store.layer0AckToken ? 'armed' : 'clear'} · blocked=${store.layer0.blockedActions.join(',') || '—'}`,
      exportCheck: () => {
        const neg = unresolvedNegatives(store.evidence).length
        const ack = Boolean(store.layer0AckToken)
        const miss = store.evidence.filter((e) => e.score === 1 && (!e.sourceRefs || !e.sourceRefs.length)).length
        return [
          neg ? `BLOCK −1 open=${neg}` : 'OK −1 open=0',
          ack ? 'OK Layer-0 ACK armed' : 'NEED Layer-0 ACK',
          miss ? `WARN +1 missing sourceRefs=${miss}` : 'OK +1 sourceRefs',
          `ready=${!neg && ack}`,
        ].join('\n')
      },
      setUiMode: store.setUiMode,
      statusLine: () =>
        [
          `module=${store.activeModule}`,
          `mode=${store.sessionMode}`,
          `ui=${store.uiMode}`,
          `usecase=${activeUseCaseId}`,
          `sme=${store.activeSmeLensId}`,
          `sme-sel=${store.selectedSmeLensIds.length}`,
          `layer0=${store.layer0.reason}`,
          `evidence=${store.evidence.length}`,
          `wd=${store.workingDocument.entries.length}`,
          `assets=${store.assets.length}`,
          `pack=${store.dataPack.meta.id}`,
          `open-1=${store.evidence.filter((e) => e.score === -1).length}`,
        ].join(' · '),
    }),
    [store, activeUseCaseId],
  )

  const run = (line: string) => {
    const trimmed = line.trim()
    if (!trimmed) return
    const out: string[] = [`› ${trimmed}`]
    let matched = false
    for (const c of COMMANDS) {
      const m = trimmed.match(c.match)
      if (!m) continue
      matched = true
      let argStr = m[1] ?? ''
      if (c.match.source.startsWith('^score')) {
        argStr = trimmed.replace(/^score\s+/i, '')
      }
      try {
        out.push(c.run(argStr, api))
      } catch (e) {
        out.push(`Error: ${e instanceof Error ? e.message : String(e)}`)
      }
      break
    }
    if (!matched) out.push('Unknown command. Type help.')
    setAnalystLog([...analystLog, ...out].slice(-200))
    setInput('')
  }

  return (
    <div
      className={`h-full min-h-0 gap-2 ${
        embedded ? 'flex flex-col' : 'grid grid-cols-1 lg:grid-cols-3 gap-3'
      }`}
    >
      <Panel title="Command runtime" className={embedded ? 'flex-1 min-h-0' : 'lg:col-span-2'}>
        <div className={`flex flex-col h-full ${embedded ? 'min-h-[140px]' : 'min-h-[320px]'}`}>
          <pre
            className={`flex-1 overflow-auto rounded-md bg-black/50 border border-slate-800 p-2 text-[11px] font-mono text-slate-300 whitespace-pre-wrap ${
              embedded ? 'max-h-[180px]' : ''
            }`}
          >
            {analystLog.join('\n')}
          </pre>
          <form
            className="mt-2 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              run(input)
            }}
          >
            <input
              className={`${inputClass} font-mono`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Command…"
              aria-label="Analyst command"
            />
            <Btn type="submit" variant="primary">
              Run
            </Btn>
          </form>
        </div>
      </Panel>
      {!embedded && (
        <Panel title="Layer-0 & context">
          <div className="space-y-3 text-xs text-slate-400">
            <div>
              <div className="text-slate-500 mb-1">Layer-0</div>
              <p className="text-slate-200">{store.layer0.reason}</p>
              <p className="text-[10px] mt-1">
                ACK: {store.layer0AckToken ? 'armed' : 'not armed'} · open −1:{' '}
                {store.evidence.filter((e) => e.score === -1).length}
              </p>
              <Btn className="mt-2" onClick={() => store.acknowledgeLayer0('Analyst panel ACK')}>
                Acknowledge Layer-0
              </Btn>
            </div>
            <div>
              <div className="text-slate-500 mb-1">Recent evidence</div>
              <ul className="space-y-1">
                {store.evidence.slice(0, 5).map((e) => (
                  <li key={e.id} className="flex items-center gap-2">
                    <EvidenceBadge score={e.score} />
                    <span className="truncate text-slate-300">{e.title}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-[10px] text-slate-600">
              High-stakes strings (export.*, ladder.promote.L3/L4, datapack.replace) route through
              Layer-0 automatically.
            </p>
          </div>
        </Panel>
      )}
    </div>
  )
}

export default AnalystModule
