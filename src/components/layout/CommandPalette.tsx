import { useEffect, useMemo, useState } from 'react'
import type { ModuleId } from '../../types/core'
import { MODULE_META } from '../../types/core'
import { usePlatformStore } from '../../store/platformStore'
import { USE_CASE_CATALOG } from '../../data/useCases/catalog'

interface Cmd {
  id: string
  label: string
  hint: string
  run: () => void
}

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const setModule = usePlatformStore((s) => s.setModule)
  const acknowledgeLayer0 = usePlatformStore((s) => s.acknowledgeLayer0)
  const applyConditions = usePlatformStore((s) => s.applyConditions)
  const setUseCase = usePlatformStore((s) => s.setUseCase)
  const formatLayout = usePlatformStore((s) => s.formatLayout)
  const setLayoutLocked = usePlatformStore((s) => s.setLayoutLocked)
  const layoutLocked = usePlatformStore((s) => s.workspace.layoutLocked)
  const setUiMode = usePlatformStore((s) => s.setUiMode)
  const runSmeLens = usePlatformStore((s) => s.runSmeLens)
  const [q, setQ] = useState('')

  const commands = useMemo<Cmd[]>(() => {
    const mods = (Object.keys(MODULE_META) as ModuleId[]).map((id) => ({
      id: `mod-${id}`,
      label: `Open ${MODULE_META[id].label}`,
      hint: MODULE_META[id].description,
      run: () => {
        setModule(id)
        onClose()
      },
    }))
    const cases = USE_CASE_CATALOG.map((p) => ({
      id: `uc-${p.id}`,
      label: `Use case ${p.label}`,
      hint: `${p.id} · ${p.family} · ${p.tagline}`,
      run: () => {
        setUseCase(p.id)
        onClose()
      },
    }))
    return [
      ...mods,
      ...cases,
      {
        id: 'l0-ack',
        label: 'Acknowledge Layer-0',
        hint: 'Arm high-stakes action clearance',
        run: () => {
          acknowledgeLayer0('Palette ACK')
          onClose()
        },
      },
      {
        id: 'apply-cond',
        label: 'Apply Design Lab conditions',
        hint: 'Write condition snapshot to working document',
        run: () => {
          applyConditions()
          onClose()
        },
      },
      {
        id: 'layout-format',
        label: 'Layout format',
        hint: 'Retile panes from preset + depth weights and lock',
        run: () => {
          formatLayout()
          onClose()
        },
      },
      {
        id: 'layout-lock',
        label: layoutLocked ? 'Layout unlock' : 'Layout lock',
        hint: 'Toggle splitter drag lock',
        run: () => {
          setLayoutLocked(!layoutLocked)
          onClose()
        },
      },
      {
        id: 'ui-web',
        label: 'UI mode · Web',
        hint: 'Multi-pane desktop shell',
        run: () => {
          setUiMode('web')
          onClose()
        },
      },
      {
        id: 'ui-mobile',
        label: 'UI mode · Mobile',
        hint: 'Single-column mobile shell',
        run: () => {
          setUiMode('mobile')
          onClose()
        },
      },
      {
        id: 'sme-evidence-gate',
        label: 'Run SME · Evidence Gate',
        hint: 'Primary tri-state adjudicator on active story',
        run: () => {
          setModule('sme-lenses')
          runSmeLens('sme-evidence-gate')
          onClose()
        },
      },
    ]
  }, [
    acknowledgeLayer0,
    applyConditions,
    formatLayout,
    layoutLocked,
    onClose,
    runSmeLens,
    setLayoutLocked,
    setModule,
    setUiMode,
    setUseCase,
  ])

  const filtered = commands.filter(
    (c) =>
      !q ||
      c.label.toLowerCase().includes(q.toLowerCase()) ||
      c.hint.toLowerCase().includes(q.toLowerCase()) ||
      c.id.toLowerCase().includes(q.toLowerCase()),
  )

  useEffect(() => {
    if (!open) setQ('')
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (open) onClose()
      }
      if (e.key === 'Escape' && open) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] bg-black/60 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-lg rounded-xl border border-slate-700 bg-slate-950 shadow-2xl overflow-hidden">
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Modules, use cases, layout format…"
          className="w-full bg-transparent px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 border-b border-slate-800 focus:outline-none"
        />
        <ul className="max-h-80 overflow-auto py-1">
          {filtered.length === 0 && (
            <li className="px-4 py-3 text-xs text-slate-500">No matches</li>
          )}
          {filtered.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className="w-full text-left px-4 py-2.5 hover:bg-slate-900 focus:bg-slate-900 focus:outline-none"
                onClick={c.run}
              >
                <div className="text-sm text-slate-100">{c.label}</div>
                <div className="text-[11px] text-slate-500">{c.hint}</div>
              </button>
            </li>
          ))}
        </ul>
        <div className="px-4 py-2 border-t border-slate-800 text-[10px] text-slate-600">
          Esc to close · Ctrl/Cmd+K toggle
        </div>
      </div>
    </div>
  )
}
