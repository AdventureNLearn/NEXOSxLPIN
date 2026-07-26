import type { ModuleId } from '../../types/core'
import { InformationModule } from '../modules/InformationModule'
import { AtlasModule } from '../modules/AtlasModule'
import { DesignLabModule } from '../modules/DesignLabModule'
import { ResearchHubModule } from '../modules/ResearchHubModule'
import { AnalystModule } from '../modules/AnalystModule'
import { SmeLensesModule } from '../modules/SmeLensesModule'
import { AuditLadderModule } from '../modules/AuditLadderModule'
import { ProceduralForgeModule } from '../modules/ProceduralForgeModule'
import { MassingViewerModule } from '../modules/MassingViewerModule'
import { ExportKitModule } from '../modules/ExportKitModule'

export interface ModuleHostProps {
  id: ModuleId
  /** Dense tile mode */
  embedded?: boolean
  /** Export compact strip */
  compact?: boolean
}

export function ModuleHost({ id, embedded, compact }: ModuleHostProps) {
  switch (id) {
    case 'information':
      return <InformationModule embedded={embedded} />
    case 'atlas':
      return <AtlasModule embedded={embedded} />
    case 'design-lab':
      return <DesignLabModule embedded={embedded} />
    case 'research-hub':
      return <ResearchHubModule embedded={embedded} />
    case 'analyst':
      return <AnalystModule embedded={embedded} />
    case 'sme-lenses':
      return <SmeLensesModule embedded={embedded} />
    case 'audit-ladder':
      return <AuditLadderModule embedded={embedded} />
    case 'procedural-forge':
      return <ProceduralForgeModule embedded={embedded} />
    case 'massing-viewer':
      return <MassingViewerModule embedded={embedded} />
    case 'export-kit':
      return <ExportKitModule compact={compact ?? embedded} />
    default:
      return <InformationModule embedded={embedded} />
  }
}
