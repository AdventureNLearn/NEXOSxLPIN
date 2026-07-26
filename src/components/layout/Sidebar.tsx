import type { ReactNode } from 'react'
import {
  BookOpen,
  Boxes,
  ClipboardList,
  FileOutput,
  FlaskConical,
  Info,
  Map,
  ScanSearch,
  Box,
  Glasses,
} from 'lucide-react'
import type { ModuleId } from '../../types/core'
import { MODULE_META } from '../../types/core'
import { usePlatformStore } from '../../store/platformStore'
import { storyTabLabel } from '../../data/useCases/stories'

const ICONS: Record<ModuleId, ReactNode> = {
  information: <Info size={16} />,
  atlas: <Map size={16} />,
  'design-lab': <FlaskConical size={16} />,
  'research-hub': <BookOpen size={16} />,
  analyst: <ScanSearch size={16} />,
  'sme-lenses': <Glasses size={16} />,
  'audit-ladder': <ClipboardList size={16} />,
  'procedural-forge': <Boxes size={16} />,
  'massing-viewer': <Box size={16} />,
  'export-kit': <FileOutput size={16} />,
}

const ORDER: ModuleId[] = [
  'information',
  'atlas',
  'design-lab',
  'research-hub',
  'analyst',
  'sme-lenses',
  'audit-ladder',
  'procedural-forge',
  'massing-viewer',
  'export-kit',
]

export function Sidebar() {
  const active = usePlatformStore((s) => s.activeModule)
  const setModule = usePlatformStore((s) => s.setModule)
  const activeUseCaseId = usePlatformStore((s) => s.activeUseCaseId)

  return (
    <aside className="flex flex-col w-[56px] xl:w-[200px] shrink-0 border-r border-slate-800/90 bg-[#070b14]">
      <div className="flex items-center gap-2 px-3 py-3 border-b border-slate-800/80">
        <img
          src="/brand-mark.svg"
          alt=""
          width={22}
          height={22}
          className="shrink-0 rounded-sm"
        />
        <div className="hidden xl:block min-w-0">
          <div className="text-sm font-semibold tracking-tight text-slate-100">NEXOSxLPIN</div>
          <div className="text-[10px] text-slate-500 truncate">SME · map · claims</div>
        </div>
      </div>
      <nav className="flex-1 py-2 overflow-y-auto" aria-label="Story surfaces">
        <ul className="flex flex-col gap-0.5 px-1.5">
          {ORDER.map((id) => {
            const meta = MODULE_META[id]
            const label = storyTabLabel(activeUseCaseId, id, meta.label)
            const on = active === id
            return (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setModule(id)}
                  title={meta.description}
                  aria-label={label}
                  aria-current={on ? 'page' : undefined}
                  className={`w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 ${
                    on
                      ? 'bg-cyan-950/70 text-cyan-100 border border-cyan-800/50'
                      : 'text-slate-400 border border-transparent hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <span className={on ? 'text-cyan-300' : 'text-slate-500'}>{ICONS[id]}</span>
                  <span className="hidden xl:inline font-medium truncate">{label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="px-2 py-2 border-t border-slate-800/80 text-[9px] text-slate-600 text-center xl:text-left xl:px-3">
        AOS Nexus LPIN v2.1
      </div>
    </aside>
  )
}
