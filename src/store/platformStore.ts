/**
 * Nexus platform store — agnostic runtime state.
 * Persists working document, conditions, ladder, assets, evidence.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  ActiveConditions,
  AuditLadderState,
  DataPack,
  DetailLevel,
  EvidenceItem,
  EvidenceScore,
  Layer0State,
  ModuleId,
  ProceduralAsset,
  ResearchNote,
  SessionMode,
  WorkingDocument,
} from '../types/core'
import { emptyLadder, MODULE_META, uid } from '../types/core'
import { createIdleLayer0, evaluateLayer0 } from '../core/layer0'
import { unresolvedNegatives } from '../core/evidence'
import {
  appendEntry,
  createWorkingDocument,
  logExport,
  logGeneration,
  logRewrite,
} from '../core/workingDocument'
import { SAMPLE_PACK } from '../data/packs/samplePack'
import {
  generateAsset,
  optimizeAsset,
  setDeployProgress,
  type GenerateInput,
} from '../lib/forge/generators'
import type { ActiveSource, WorkspaceState, WorkspaceViewMode } from '../types/useCase'
import { ALL_MODULE_PANES, DEFAULT_WORKSPACE } from '../types/useCase'
import type { SmeBriefing } from '../types/sme'
import { sourcesAsPackRefs } from '../data/useCases/activeSources'
import { DEFAULT_USE_CASE_ID, getUseCase } from '../data/useCases/catalog'
import {
  buildSimulationAssets,
  getSimulation,
} from '../data/useCases/simulations'

import {
  conditionsFromDesignStory,
  getDesignStory,
} from '../data/useCases/designMatrices'
import {
  closePaneInWorkspace,
  openPaneInWorkspace,
} from '../layout/formatLayout'
import { PRESET_PRIMARY_FRACTION } from '../layout/presets'
import { DEFAULT_SME_LENS_ID, getSmeLens } from '../data/sme/lenses'
import { analyzeWithLens } from '../lib/sme/analyze'
import { buildClaimLedger, ledgerToEvidence } from '../lib/verify/claimLedger'
import { resolveStory } from '../data/useCases/stories'
import {
  meshAccentColor,
  reasonSceneObjects,
  reasonScenePotentials,
} from '../lib/forge/objectReasoning'
import { assembleSceneFromPotentials } from '../lib/forge/itemOptimize'

export interface PlatformState {
  version: string
  activeModule: ModuleId
  sessionMode: SessionMode
  layer0: Layer0State
  layer0AckToken: string | null
  workingDocument: WorkingDocument
  dataPack: DataPack
  conditions: ActiveConditions | null
  evidence: EvidenceItem[]
  researchNotes: ResearchNote[]
  ladder: AuditLadderState
  assets: ProceduralAsset[]
  activeAssetId: string | null
  compareMode: boolean
  lastAction: string | null
  statusMessage: string
  /** Analyst command log seed (investigation simulation) */
  analystLog: string[]
  /** Active sources with URLs for the current investigation */
  activeSources: ActiveSource[]

  /** Active SME lens id (detail pane) */
  activeSmeLensId: string
  /** Multi-select checkbox selection for batch run */
  selectedSmeLensIds: string[]
  /** Last generated SME briefing (primary/active) */
  lastSmeBriefing: SmeBriefing | null
  /** Multi-run briefings from "Run selected" */
  lastSmeBriefingSet: SmeBriefing[]

  /** Active use-case profile id */
  activeUseCaseId: string
  workspace: WorkspaceState
  /** Enterprise UI shell: web multi-pane vs mobile single-column */
  uiMode: 'web' | 'mobile'

  setModule: (id: ModuleId) => void
  setSessionMode: (mode: SessionMode) => void
  setUiMode: (mode: 'web' | 'mobile') => void
  setUseCase: (id: string) => void
  setAnalystLog: (lines: string[]) => void
  appendAnalystLog: (line: string) => void
  setActiveSmeLens: (id: string) => void
  toggleSmeLensSelection: (id: string) => void
  setSelectedSmeLenses: (ids: string[]) => void
  clearSmeSelection: () => void
  runSmeLens: (lensId?: string) => SmeBriefing
  runSelectedSmeLenses: () => SmeBriefing[]
  commitSmeBriefToWorkingDoc: () => boolean
  applySmeScoresToEvidence: () => number
  formatLayout: () => void
  setLayoutLocked: (locked: boolean) => void
  setPrimaryFraction: (n: number) => void
  setSecondaryFraction: (n: number) => void
  maximizePane: (id: ModuleId | null) => void
  /** Full-stage one module (map/desk/etc.) — closes other panes, maximizes */
  soloPane: (id: ModuleId) => void
  /** Exit solo/maximize and rebuild multi-pane tiles (not expand-all tabs) */
  restoreLayout: () => void
  /** Rebuild evidence board from desk-specific sourced claim ledger (no boilerplate) */
  rebuildClaimBoard: () => void
  closePane: (id: ModuleId) => void
  setSingleModuleMode: (on: boolean) => void
  setViewMode: (mode: WorkspaceViewMode) => void
  expandAllPanes: () => void
  reorderPanes: (fromIndex: number, toIndex: number) => void
  acknowledgeLayer0: (reason: string) => void
  clearLayer0Ack: () => void
  requestAction: (action: string, reason?: string) => { allowed: boolean; message: string }

  loadDataPack: (pack: DataPack) => void
  setConditionSelection: (axisId: string, optionId: string) => void
  setConditionNotes: (notes: string) => void
  applyConditions: () => void

  addEvidence: (item: Omit<EvidenceItem, 'id' | 'createdAt'> & { id?: string }) => void
  setEvidenceScore: (id: string, score: EvidenceScore) => void
  removeEvidence: (id: string) => void

  addResearchNote: (title: string, body: string, score: EvidenceScore) => void
  updateResearchNote: (id: string, patch: Partial<ResearchNote>) => void

  setLadderLevel: (level: DetailLevel) => void
  markLadderPopulated: (level: DetailLevel, score: EvidenceScore, note: string) => void

  generateProceduralAsset: (input: Omit<GenerateInput, 'conditions'>) => ProceduralAsset | null
  /** Build critical evidentiary models from claims/evidence for active desk */
  seedEvidentiaryModels: () => number
  optimizeActiveAsset: () => void
  setAssetDeploy: (progress: number) => void
  setActiveAsset: (id: string | null) => void
  setCompareMode: (on: boolean) => void
  rewriteActiveAsset: (description: string) => void

  appendWorkingNote: (title: string, body: string, moduleId?: ModuleId) => void
  recordExport: (title: string, body: string) => boolean

  getActiveAsset: () => ProceduralAsset | null
  moduleLabel: (id: ModuleId) => string
}

function defaultConditions(pack: DataPack): ActiveConditions | null {
  const matrix = pack.conditionMatrices[0]
  if (!matrix) return null
  const selections: Record<string, string> = {}
  for (const axis of matrix.axes) {
    if (axis.options[0]) selections[axis.id] = axis.options[0].id
  }
  return {
    matrixId: matrix.id,
    selections,
    notes: '',
    updatedAt: new Date().toISOString(),
  }
}

export const usePlatformStore = create<PlatformState>()(
  persist(
    (set, get) => ({
      version: '2.0.0',
      activeModule: 'information',
      sessionMode: 'explore',
      uiMode: 'web',
      layer0: createIdleLayer0(),
      layer0AckToken: null,
      workingDocument: createWorkingDocument('NEXOSxLPIN Working Document'),
      dataPack: SAMPLE_PACK,
      conditions: defaultConditions(SAMPLE_PACK),
      evidence: [...SAMPLE_PACK.sampleEvidence],
      researchNotes: [],
      ladder: emptyLadder(0),
      assets: [],
      activeAssetId: null,
      compareMode: false,
      lastAction: null,
      statusMessage: 'NEXOSxLPIN 2.0.0 · Pick a story to begin',
      analystLog: [
        'Welcome. Pick a story to load the map and claims.',
        'Mark claims Supported / Not proven / Disputed before sharing.',
        'Type help for optional power commands.',
      ],
      activeSources: [],
      activeSmeLensId: DEFAULT_SME_LENS_ID,
      selectedSmeLensIds: [],
      lastSmeBriefing: null,
      lastSmeBriefingSet: [],
      activeUseCaseId: DEFAULT_USE_CASE_ID,
      workspace: {
        ...DEFAULT_WORKSPACE,
        openPanes: [...ALL_MODULE_PANES],
        focusedPane: 'atlas',
        useCasePicked: false,
        singleModuleMode: false,
        layoutLocked: false,
        primaryFraction: 0.48,
        viewMode: 'immersive',
      },

      setModule: (id) => {
        const s = get()
        const profile = getUseCase(s.activeUseCaseId)
        const openPanes = openPaneInWorkspace(s.workspace.openPanes, id, profile.paneWeights)
        set({
          activeModule: id,
          workspace: {
            ...s.workspace,
            openPanes,
            focusedPane: id,
            maximizedPane: s.workspace.viewMode === 'tabs' ? null : s.workspace.maximizedPane === id ? id : null,
            singleModuleMode: s.workspace.viewMode === 'tabs' ? false : s.workspace.singleModuleMode,
            useCasePicked: true,
          },
          lastAction: `module:${id}`,
          statusMessage: `${MODULE_META[id].label} active`,
        })
      },

      setSessionMode: (mode) => set({ sessionMode: mode, lastAction: `mode:${mode}` }),

      setUiMode: (mode) =>
        set({
          uiMode: mode,
          lastAction: `ui:${mode}`,
          statusMessage: mode === 'mobile' ? 'UI · Mobile shell' : 'UI · Web shell',
          workspace:
            mode === 'mobile'
              ? {
                  ...get().workspace,
                  viewMode: get().workspace.viewMode === 'immersive' ? 'tabs' : get().workspace.viewMode,
                  singleModuleMode: true,
                }
              : {
                  ...get().workspace,
                  singleModuleMode: false,
                },
        }),

      setAnalystLog: (lines) => set({ analystLog: lines }),
      appendAnalystLog: (line) =>
        set((s) => ({ analystLog: [...s.analystLog, line].slice(-200) })),

      setActiveSmeLens: (id) => {
        const lens = getSmeLens(id)
        set({
          activeSmeLensId: lens.id,
          lastAction: `sme:select:${lens.id}`,
          statusMessage: `SME · ${lens.short} — ${lens.tagline}`,
        })
      },

      toggleSmeLensSelection: (id) => {
        const lens = getSmeLens(id)
        set((s) => {
          const has = s.selectedSmeLensIds.includes(lens.id)
          const selectedSmeLensIds = has
            ? s.selectedSmeLensIds.filter((x) => x !== lens.id)
            : [...s.selectedSmeLensIds, lens.id]
          return {
            selectedSmeLensIds,
            lastAction: has ? `sme:deselect:${lens.id}` : `sme:multiselect:${lens.id}`,
            statusMessage: has
              ? `SME deselected · ${lens.short}`
              : `SME selected · ${lens.short} · ${selectedSmeLensIds.length} total`,
          }
        })
      },

      setSelectedSmeLenses: (ids) => {
        const clean = Array.from(new Set(ids.map((id) => getSmeLens(id).id)))
        set({
          selectedSmeLensIds: clean,
          lastAction: `sme:set-selection:${clean.length}`,
          statusMessage: `SME selection · ${clean.length} lens(es)`,
        })
      },

      clearSmeSelection: () =>
        set({
          selectedSmeLensIds: [],
          lastAction: 'sme:clear-selection',
          statusMessage: 'SME multi-select cleared',
        }),

      runSmeLens: (lensId) => {
        const s = get()
        const id = lensId || s.activeSmeLensId || DEFAULT_SME_LENS_ID
        const lens = getSmeLens(id)
        const profile = getUseCase(s.activeUseCaseId)
        const matrix = s.dataPack.conditionMatrices.find((m) => m.id === s.conditions?.matrixId)
        const condSummary = s.conditions
          ? Object.entries(s.conditions.selections)
              .map(([axisId, optId]) => {
                const axis = matrix?.axes.find((a) => a.id === axisId)
                const opt = axis?.options.find((o) => o.id === optId)
                return `${axis?.label ?? axisId}: ${opt?.label ?? optId}`
              })
              .join(' · ')
          : undefined
        const brief = analyzeWithLens(id, {
          useCaseId: s.activeUseCaseId,
          useCaseLabel: profile.label,
          evidence: s.evidence,
          researchNoteTitles: s.researchNotes.map((n) => n.title),
          sourceTitles: s.activeSources.map((src) => src.title),
          openQuestions: profile.report?.openQuestions,
          conditionsSummary: condSummary,
          ladderLevel: s.ladder.current,
          layer0Active: s.layer0.active,
          unresolvedNegatives: unresolvedNegatives(s.evidence).length,
        })
        set({
          activeSmeLensId: lens.id,
          lastSmeBriefing: brief,
          lastSmeBriefingSet: [brief],
          activeModule: 'sme-lenses',
          sessionMode: 'analyze',
          workspace: {
            ...s.workspace,
            openPanes: openPaneInWorkspace(s.workspace.openPanes, 'sme-lenses', profile.paneWeights),
            focusedPane: 'sme-lenses',
            useCasePicked: true,
          },
          analystLog: [
            ...s.analystLog,
            `› SME · ${lens.short}: ${brief.headline}`,
            `› actions · ${brief.actions.length} · posture ${brief.posture === 1 ? '+1' : brief.posture === -1 ? '−1' : '0'} · ${brief.urgency}`,
          ].slice(-200),
          lastAction: `sme:run:${lens.id}`,
          statusMessage: `SME briefing · ${lens.short} · ${brief.stats.supported}+/${brief.stats.contested}0/${brief.stats.disqualified}−`,
        })
        return brief
      },

      runSelectedSmeLenses: () => {
        const s = get()
        const ids =
          s.selectedSmeLensIds.length > 0
            ? s.selectedSmeLensIds
            : [s.activeSmeLensId || DEFAULT_SME_LENS_ID]
        const profile = getUseCase(s.activeUseCaseId)
        const matrix = s.dataPack.conditionMatrices.find((m) => m.id === s.conditions?.matrixId)
        const condSummary = s.conditions
          ? Object.entries(s.conditions.selections)
              .map(([axisId, optId]) => {
                const axis = matrix?.axes.find((a) => a.id === axisId)
                const opt = axis?.options.find((o) => o.id === optId)
                return `${axis?.label ?? axisId}: ${opt?.label ?? optId}`
              })
              .join(' · ')
          : undefined
        const analyzeCtx = {
          useCaseId: s.activeUseCaseId,
          useCaseLabel: profile.label,
          evidence: s.evidence,
          researchNoteTitles: s.researchNotes.map((n) => n.title),
          sourceTitles: s.activeSources.map((src) => src.title),
          openQuestions: profile.report?.openQuestions,
          conditionsSummary: condSummary,
          ladderLevel: s.ladder.current,
          layer0Active: s.layer0.active,
          unresolvedNegatives: unresolvedNegatives(s.evidence).length,
        }
        const briefs: SmeBriefing[] = ids.map((id) => analyzeWithLens(id, analyzeCtx))
        const primary = briefs[briefs.length - 1]!
        const logLines = briefs.map((b) => {
          const lens = getSmeLens(b.lensId)
          return `› SME multi · ${lens.short}: ${b.headline}`
        })
        set({
          activeSmeLensId: primary.lensId,
          lastSmeBriefing: primary,
          lastSmeBriefingSet: briefs,
          activeModule: 'sme-lenses',
          sessionMode: 'analyze',
          workspace: {
            ...s.workspace,
            openPanes: openPaneInWorkspace(s.workspace.openPanes, 'sme-lenses', profile.paneWeights),
            focusedPane: 'sme-lenses',
            useCasePicked: true,
          },
          analystLog: [...s.analystLog, ...logLines, `› SME multi-run complete · ${briefs.length} lens(es)`].slice(
            -200,
          ),
          lastAction: `sme:run-selected:${briefs.length}`,
          statusMessage: `SME multi-run · ${briefs.length} briefing(s) · primary ${primary.lensName}`,
        })
        return briefs
      },

      commitSmeBriefToWorkingDoc: () => {
        const s = get()
        const brief = s.lastSmeBriefing
        if (!brief) {
          set({ statusMessage: 'No SME briefing to commit — run analysis first' })
          return false
        }
        set({
          workingDocument: appendEntry(s.workingDocument, {
            kind: 'note',
            title: `SME · ${brief.lensName}`,
            body: brief.workingDocMarkdown,
            score: brief.posture,
            moduleId: 'sme-lenses',
            meta: {
              lensId: brief.lensId,
              urgency: brief.urgency,
              claims: brief.stats.claims,
            },
          }),
          lastAction: `sme:commit:${brief.lensId}`,
          statusMessage: `SME brief committed to working document · ${brief.lensName}`,
        })
        return true
      },

      applySmeScoresToEvidence: () => {
        const s = get()
        const brief = s.lastSmeBriefing
        if (!brief) {
          set({ statusMessage: 'No SME briefing — run analysis first' })
          return 0
        }
        const byId = new Map(brief.claimReads.map((r) => [r.claimId, r]))
        let n = 0
        const next = s.evidence.map((ev) => {
          const read = byId.get(ev.id)
          if (!read || read.smeScore === ev.score) return ev
          n += 1
          return {
            ...ev,
            score: read.smeScore,
            tags: [...new Set([...(ev.tags ?? []), `sme:${brief.lensId}`])],
          }
        })
        set({
          evidence: next,
          workingDocument: appendEntry(s.workingDocument, {
            kind: 'evidence',
            title: `SME scores applied · ${brief.lensName}`,
            body: `Updated ${n} claim score(s) from ${brief.lensId} dispositions.`,
            score: brief.posture,
            moduleId: 'sme-lenses',
            meta: { updated: n, lensId: brief.lensId },
          }),
          lastAction: `sme:apply:${brief.lensId}`,
          statusMessage: n
            ? `Applied ${n} SME score(s) to evidence ledger`
            : 'No score changes — ledger already matches SME dispositions',
        })
        return n
      },

      setUseCase: (id) => {
        try {
          const profile = getUseCase(id)
          const sim = getSimulation(id)
          const s = get()
          // Always expand full module set so every tab is available for review
          const withAtlas = [...ALL_MODULE_PANES] as ModuleId[]
          const focus = (
            profile.defaultOpen?.[0] && withAtlas.includes(profile.defaultOpen[0])
              ? profile.defaultOpen[0]
              : 'atlas'
          ) as ModuleId
          const now = new Date().toISOString()
          const prevView = get().workspace.viewMode

          // —— Full simulation path (preferred) ——
          if (sim) {
            const reportNote: ResearchNote | null = profile.report
              ? {
                  id: uid('rn-brief'),
                  title: profile.report.headline || profile.label,
                  body: [
                    profile.report.executiveSummary || '',
                    '',
                    '### Open questions',
                    ...(profile.report.openQuestions ?? []).map((q) => `- ${q}`),
                    '',
                    '### Verification playbook',
                    ...(profile.report.verificationPlaybook ?? []).map(
                      (step, i) => `${i + 1}. ${step}`,
                    ),
                    '',
                    `### Map · ${sim.mapPin.cityHint ?? sim.mapPin.label}`,
                    `${sim.mapPin.lat.toFixed(4)}, ${sim.mapPin.lng.toFixed(4)}`,
                  ].join('\n'),
                  score: 0,
                  material: 'secondary',
                  tags: ['full-report', 'investigation', 'simulation', profile.id],
                  createdAt: now,
                  updatedAt: now,
                }
              : null

            let wd = createWorkingDocument(
              `WD · ${profile.label.replace(/^[①-⑩]\s*/, '')}`,
            )
            wd = {
              ...wd,
              entries: [
                {
                  id: uid('wde'),
                  at: now,
                  kind: 'decision',
                  title: `Investigation loaded: ${profile.label}`,
                  body: [
                    profile.tagline,
                    `id=${profile.id}`,
                    `map=${sim.mapPin.lat}, ${sim.mapPin.lng} (${sim.mapPin.cityHint ?? ''})`,
                    `evidence=${sim.evidence.length} · notes=${sim.researchNotes.length}`,
                    `scene pins=${sim.scenePoints.length}`,
                    'Click other map pins to switch investigations (inactive pins grey).',
                  ].join('\n'),
                  score: 1,
                  moduleId: 'atlas',
                  meta: { useCaseId: profile.id },
                },
              ],
            }
            for (const e of sim.wdEntries) {
              wd = appendEntry(wd, e)
            }
            if (profile.report?.fullBriefMarkdown) {
              wd = appendEntry(wd, {
                kind: 'note',
                title: `Full report: ${profile.report.headline}`,
                body: profile.report.fullBriefMarkdown,
                score: 0,
                moduleId: 'research-hub',
                meta: { reportId: profile.id },
              })
            }

            // Seed story-relevant scene objects (vehicle/path/crowd/…) — never a lone traffic pole
            const storyConditionsEarly =
              conditionsFromDesignStory(profile.id, sim.designNotes) ?? {
                ...sim.conditions,
                notes: sim.designNotes || sim.conditions.notes,
                updatedAt: now,
              }
            const ledgerClaims = resolveStory(profile.id)?.claims
            const sceneReport = reasonSceneObjects({
              deskId: profile.id,
              claims: ledgerClaims,
              evidence: sim.evidence,
            })
            const scenePick = (
              sceneReport.objects.filter((o) => o.importance === 'critical').length
                ? sceneReport.objects.filter((o) => o.importance === 'critical')
                : sceneReport.objects
            ).slice(0, 12)
            const assets =
              scenePick.length > 0
                ? scenePick.map((o) =>
                    generateAsset({
                      name: o.name,
                      assetType: o.assetType,
                      description: [
                        o.description,
                        `Verifiability: ${o.verifiability}`,
                        o.relatedClaimHint ? `Claim: ${o.relatedClaimHint}` : '',
                        `Flags: ${o.flags.join(', ')}`,
                      ]
                        .filter(Boolean)
                        .join('\n'),
                      conditions: storyConditionsEarly,
                      score: o.score,
                      verifiability: o.verifiability,
                      reasoning: o.reasoning,
                      flags: o.flags,
                      relatedClaimHint: o.relatedClaimHint,
                      sourceIds: o.sourceIds,
                      importance: o.importance,
                      accentColor: meshAccentColor(o.verifiability),
                    }),
                  )
                : buildSimulationAssets(sim)
            const packSources = sourcesAsPackRefs(sim.sources)
            const designStory = getDesignStory(profile.id)
            const storyConditions = storyConditionsEarly
            const pack = {
              ...SAMPLE_PACK,
              meta: {
                ...SAMPLE_PACK.meta,
                id: `pack-sim-${profile.id}`,
                name: `Sim Pack · ${sim.mapPin.shortLabel}`,
                description: designStory
                  ? `CJ jurisdictional pack · ${designStory.matrix.name}`
                  : `Simulation pack for ${profile.label}. Map-linked investigation desk.`,
                domainHint: 'citizen-journalism',
              },
              // Story-driven Design Lab (not roads/structures)
              conditionMatrices: designStory
                ? [designStory.matrix]
                : SAMPLE_PACK.conditionMatrices,
              spatialPoints: sim.scenePoints,
              graphNodes: sim.graphNodes,
              graphEdges: sim.graphEdges,
              sampleEvidence: sim.evidence,
              sampleSources: packSources,
            }

            const sourcesNote: ResearchNote = {
              id: uid('rn-sources'),
              title: `Active sources · ${sim.mapPin.shortLabel} (${sim.sources.length})`,
              body: [
                'One-click sources for this investigation. Prefer official / wire before social.',
                '',
                ...sim.sources.map(
                  (src) =>
                    `- **[${src.kind}] ${src.title}** — ${src.why}\n  ${src.url}`,
                ),
              ].join('\n'),
              score: 1,
              material: 'secondary',
              tags: ['sources', 'investigation', profile.id],
              createdAt: now,
              updatedAt: now,
            }

            wd = appendEntry(wd, {
              kind: 'note',
              title: `Sources loaded (${sim.sources.length})`,
              body: sim.sources
                .slice(0, 8)
                .map((src) => `${src.title}: ${src.url}`)
                .join('\n'),
              score: 1,
              moduleId: 'research-hub',
              meta: { sources: sim.sources.length },
            })

            // Prefer sourced claim ledger over boilerplate sim evidence
            const storyClaims = resolveStory(profile.id)?.claims
            const ledger = buildClaimLedger(
              profile.id,
              storyClaims?.map((c) => ({
                plain: c.plain,
                score: c.score,
                why: c.why,
                sourceIds: c.sourceIds,
              })),
            )
            const ledgerRows = ledgerToEvidence(profile.id, ledger)
            const ledgerEvidence: EvidenceItem[] =
              ledgerRows.length > 0
                ? ledgerRows.map((r, i) => ({
                    id: uid(`ev-ledger-${i}`),
                    title: r.title,
                    summary: r.summary,
                    score: r.score,
                    confidence:
                      r.score === 1 ? 'high' : r.score === -1 ? 'medium' : 'low',
                    material: r.material,
                    tags: [...r.tags, profile.id],
                    sourceRefs: r.sourceRefs,
                    createdAt: now,
                    moduleId: 'research-hub' as ModuleId,
                  }))
                : sim.evidence.map((e) => ({
                    ...e,
                    tags: [...(e.tags ?? []), profile.id],
                    createdAt: now,
                  }))

            set({
              activeUseCaseId: profile.id,
              activeModule: focus,
              sessionMode: sim.sessionMode,
              dataPack: pack,
              conditions: storyConditions,
              evidence: ledgerEvidence,
              researchNotes: [
                sourcesNote,
                ...(designStory
                  ? [
                      {
                        id: uid('rn-design'),
                        title: `Design Lab · ${designStory.matrix.name}`,
                        body: [
                          designStory.intelligenceBrief,
                          '',
                          '### Apply effects',
                          ...designStory.applyEffects.map((x) => `- ${x}`),
                          '',
                          '### Default axes',
                          ...Object.entries(designStory.defaultSelections).map(
                            ([k, v]) => `- ${k}: ${v}`,
                          ),
                        ].join('\n'),
                        score: 1 as const,
                        material: 'secondary' as const,
                        tags: ['design-lab', 'jurisdiction', 'investigation', profile.id],
                        createdAt: now,
                        updatedAt: now,
                      },
                    ]
                  : []),
                ...(reportNote ? [reportNote] : []),
                ...sim.researchNotes.map((n) => ({
                  ...n,
                  tags: [...(n.tags ?? []), profile.id],
                  updatedAt: now,
                })),
              ],
              ladder: sim.ladder,
              assets,
              activeAssetId: assets[0]?.id ?? null,
              compareMode: false,
              analystLog: [
                ...sim.analystLog,
                `› sources · ${sim.sources.length} active links loaded for ${sim.mapPin.shortLabel}`,
                designStory
                  ? `› design · ${designStory.matrix.name} (CJ jurisdictional matrix)`
                  : '› design · fallback matrix',
                'Open Research Hub → Active sources · Design Lab switches with the story.',
              ],
              activeSources: sim.sources,
              workingDocument: wd,
              workspace: {
                openPanes: withAtlas,
                focusedPane: focus,
                maximizedPane: null,
                layoutLocked: prevView === 'tiles' ? false : get().workspace.layoutLocked,
                primaryFraction: PRESET_PRIMARY_FRACTION[profile.layoutPreset] ?? 0.48,
                secondaryFraction: 0.55,
                singleModuleMode: false,
                useCasePicked: true,
                viewMode: prevView || 'tabs',
              },
              lastAction: `usecase:${profile.id}`,
              statusMessage: `Investigation #${profile.trendRank ?? '—'} · ${sim.mapPin.shortLabel} · ${sim.evidence.length} claims · ${sim.sources.length} sources · all tabs open`,
            })
            return
          }

          // —— Fallback: report claims only ——
          const reportClaims = profile.report?.claims ?? []
          const injectedEvidence: EvidenceItem[] = reportClaims.map((c) => ({
            id: uid(`ev-${c.id}`),
            title: (c.statement || 'Claim').slice(0, 120),
            summary: c.notes || '',
            score: c.score,
            confidence: c.confidence ?? 'medium',
            material: c.material ?? 'secondary',
            tags: [...(c.tags ?? []), 'trend-desk', profile.id],
            sourceRefs: [`report:${profile.id}`],
            createdAt: now,
            moduleId: 'research-hub' as ModuleId,
          }))

          set({
            activeUseCaseId: profile.id,
            activeModule: focus,
            sessionMode: 'analyze',
            evidence: injectedEvidence,
            researchNotes: [],
            activeSources: [],
            workspace: {
              openPanes: withAtlas,
              focusedPane: focus,
              maximizedPane: null,
              layoutLocked: false,
              primaryFraction: PRESET_PRIMARY_FRACTION[profile.layoutPreset] ?? 0.48,
              secondaryFraction: 0.55,
              singleModuleMode: false,
              useCasePicked: true,
              viewMode: prevView || 'tabs',
            },
            workingDocument: appendEntry(s.workingDocument, {
              kind: 'decision',
              title: `Investigation activated: ${profile.label}`,
              body: profile.tagline,
              score: 1,
              moduleId: 'research-hub',
            }),
            lastAction: `usecase:${profile.id}`,
            statusMessage: `Use case · ${profile.label}`,
          })
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          set({
            lastAction: 'usecase:error',
            statusMessage: `Use-case failed: ${message}`,
          })
          console.error('[setUseCase]', err)
        }
      },

      formatLayout: () => {
        const s = get()
        const profile = getUseCase(s.activeUseCaseId)
        const open =
          s.workspace.openPanes.length > 0
            ? s.workspace.openPanes
            : [...ALL_MODULE_PANES]
        set({
          workspace: {
            ...s.workspace,
            openPanes: open,
            // Do not force-lock — user asked to resize when unlocked
            layoutLocked: s.workspace.layoutLocked,
            maximizedPane: null,
            singleModuleMode: false,
            primaryFraction: PRESET_PRIMARY_FRACTION[profile.layoutPreset] ?? s.workspace.primaryFraction,
            secondaryFraction: 0.55,
            viewMode: s.workspace.viewMode === 'immersive' ? 'immersive' : s.workspace.viewMode,
          },
          lastAction: 'layout:format',
          statusMessage: `Layout formatted · ${s.workspace.layoutLocked ? 'locked' : 'unlocked (drag splitters)'}`,
          workingDocument: appendEntry(s.workingDocument, {
            kind: 'decision',
            title: 'Layout format',
            body: `Preset ${profile.layoutPreset} · panes ${open.join(', ')} · ${s.workspace.viewMode}`,
            score: 1,
            moduleId: s.activeModule,
          }),
        })
      },

      setLayoutLocked: (locked) =>
        set((s) => ({
          workspace: { ...s.workspace, layoutLocked: locked },
          lastAction: `layout:lock:${locked}`,
          statusMessage: locked
            ? 'Layout locked'
            : 'Layout unlocked — drag cyan splitters to resize',
        })),

      setPrimaryFraction: (n) =>
        set((s) => ({
          workspace: {
            ...s.workspace,
            primaryFraction: Math.min(0.72, Math.max(0.22, n)),
          },
        })),

      setSecondaryFraction: (n) =>
        set((s) => ({
          workspace: {
            ...s.workspace,
            secondaryFraction: Math.min(0.78, Math.max(0.22, n)),
          },
        })),

      maximizePane: (id) =>
        set((s) => {
          const snap =
            id && s.workspace.openPanes.length > 1 && !s.workspace.maximizedPane
              ? [...s.workspace.openPanes]
              : s.workspace.restoreOpenPanes ?? null
          return {
            workspace: {
              ...s.workspace,
              maximizedPane: id,
              focusedPane: id ?? s.workspace.focusedPane,
              singleModuleMode: false,
              restoreOpenPanes: id ? snap : null,
              openPanes: id
                ? s.workspace.openPanes.includes(id)
                  ? s.workspace.openPanes
                  : [id, ...s.workspace.openPanes]
                : s.workspace.openPanes,
            },
            activeModule: id ?? s.activeModule,
            lastAction: id ? `layout:max:${id}` : 'layout:restore',
            statusMessage: id
              ? `Fullscreen · ${MODULE_META[id].label} · details integrated`
              : 'Layout restored',
          }
        }),

      soloPane: (id) =>
        set((s) => {
          const snap =
            s.workspace.openPanes.length > 1
              ? [...s.workspace.openPanes]
              : s.workspace.restoreOpenPanes ?? null
          return {
            activeModule: id,
            workspace: {
              ...s.workspace,
              openPanes: [id],
              focusedPane: id,
              maximizedPane: id,
              singleModuleMode: false,
              restoreOpenPanes: snap,
              // Prefer tiles-friendly fractions when leaving solo later
              primaryFraction: id === 'atlas' ? 0.68 : s.workspace.primaryFraction,
            },
            lastAction: `layout:solo:${id}`,
            statusMessage:
              id === 'atlas'
                ? 'Desk map fullscreen · large map + high-level brief docked'
                : `Solo fullscreen · ${MODULE_META[id].label}`,
          }
        }),

      restoreLayout: () =>
        set((s) => {
          const profile = getUseCase(s.activeUseCaseId)
          const fromSnap = s.workspace.restoreOpenPanes?.filter((p) =>
            ALL_MODULE_PANES.includes(p),
          )
          const openPanes =
            fromSnap && fromSnap.length >= 2
              ? fromSnap
              : profile.defaultOpen?.length
                ? [...profile.defaultOpen]
                : ['atlas', 'research-hub', 'export-kit']
          const focus =
            (s.workspace.focusedPane && openPanes.includes(s.workspace.focusedPane)
              ? s.workspace.focusedPane
              : openPanes.includes(s.activeModule)
                ? s.activeModule
                : openPanes[0]) ?? 'atlas'
          return {
            activeModule: focus as ModuleId,
            workspace: {
              ...s.workspace,
              openPanes: openPanes as ModuleId[],
              focusedPane: focus as ModuleId,
              maximizedPane: null,
              restoreOpenPanes: null,
              singleModuleMode: false,
              layoutLocked: s.workspace.viewMode === 'tiles' ? false : s.workspace.layoutLocked,
            },
            lastAction: 'layout:restore-multi',
            statusMessage:
              s.workspace.viewMode === 'tiles'
                ? 'Tiles restored — drag tiles to reorder · splitters to resize · ⛶ maximize'
                : 'Multi-pane layout restored',
          }
        }),

      rebuildClaimBoard: () => {
        const s = get()
        const story = resolveStory(s.activeUseCaseId)
        const ledger = buildClaimLedger(
          s.activeUseCaseId,
          story?.claims.map((c) => ({
            plain: c.plain,
            score: c.score,
            why: c.why,
            sourceIds: c.sourceIds,
          })),
        )
        const rows = ledgerToEvidence(s.activeUseCaseId, ledger)
        const now = new Date().toISOString()
        const evidence: EvidenceItem[] = rows.map((r, i) => ({
          id: uid(`ev-ledger-${i}`),
          title: r.title,
          summary: r.summary,
          score: r.score,
          confidence: r.score === 1 ? 'high' : r.score === -1 ? 'medium' : 'low',
          material: r.material,
          tags: r.tags,
          sourceRefs: r.sourceRefs,
          createdAt: now,
          moduleId: 'research-hub',
        }))
        set({
          evidence,
          lastAction: 'claims:rebuild',
          statusMessage: `Claim board rebuilt · ${evidence.length} sourced lines · multi-loop ready`,
        })
      },

      closePane: (id) => {
        const s = get()
        const profile = getUseCase(s.activeUseCaseId)
        const openPanes = closePaneInWorkspace(s.workspace.openPanes, id, profile.paneWeights)
        const focus = openPanes.includes(s.workspace.focusedPane as ModuleId)
          ? s.workspace.focusedPane
          : openPanes[0] ?? null
        // One pane left → treat as fullscreen solo so map/desk is large, not a tiny third column
        const soloLeft = openPanes.length === 1
        set({
          workspace: {
            ...s.workspace,
            openPanes,
            focusedPane: focus,
            maximizedPane: soloLeft
              ? openPanes[0]!
              : s.workspace.maximizedPane === id
                ? null
                : s.workspace.maximizedPane,
            restoreOpenPanes: soloLeft
              ? s.workspace.restoreOpenPanes ??
                (s.workspace.openPanes.length > 1 ? [...s.workspace.openPanes] : null)
              : s.workspace.restoreOpenPanes,
          },
          activeModule: (focus as ModuleId) ?? s.activeModule,
          lastAction: `layout:close:${id}`,
          statusMessage: soloLeft
            ? `Fullscreen · ${MODULE_META[openPanes[0]!].label}`
            : s.statusMessage,
        })
      },

      setSingleModuleMode: (on) =>
        set((s) => ({
          workspace: {
            ...s.workspace,
            singleModuleMode: on,
            maximizedPane: on ? s.activeModule : null,
            openPanes: on ? [s.activeModule] : s.workspace.openPanes.length ? s.workspace.openPanes : [...ALL_MODULE_PANES],
            viewMode: on ? 'tabs' : s.workspace.viewMode,
          },
          lastAction: `layout:single:${on}`,
          statusMessage: on ? 'Focus module mode' : 'Multi-pane workspace',
        })),

      setViewMode: (mode) =>
        set((s) => {
          const profile = getUseCase(s.activeUseCaseId)
          // Tiles need a usable 3–5 pane set — not all 10 modules crushed into tiny columns
          const tilePanes =
            s.workspace.openPanes.length >= 2 && s.workspace.openPanes.length <= 5
              ? s.workspace.openPanes
              : profile.defaultOpen?.length
                ? [...profile.defaultOpen]
                : (['atlas', 'research-hub', 'export-kit'] as ModuleId[])
          // Ensure atlas is present for spatial desks (tile preset path)
          const withAtlas =
            profile.layoutPreset === 'spatial-primary' && !tilePanes.includes('atlas')
              ? (['atlas', ...tilePanes.filter((p) => p !== 'atlas')].slice(0, 5) as ModuleId[])
              : tilePanes
          // Immersive is the only workspace mode — tabs/tiles requests normalize to immersive
          return {
            workspace: {
              ...s.workspace,
              viewMode: 'immersive',
              singleModuleMode: false,
              maximizedPane: null,
              restoreOpenPanes: null,
              layoutLocked: s.workspace.layoutLocked,
              openPanes: s.workspace.openPanes.length
                ? s.workspace.openPanes
                : withAtlas.length
                  ? withAtlas
                  : [...ALL_MODULE_PANES],
              primaryFraction: s.workspace.primaryFraction,
            },
            lastAction: 'layout:view:immersive',
            statusMessage:
              mode === 'immersive'
                ? 'Immersive HUD — sole workspace mode · stage Massing for full models + terrain'
                : 'Immersive only — Tabs/Tiles retired; staying in Immersive HUD',
          }
        }),

      expandAllPanes: () =>
        set((s) => ({
          workspace: {
            ...s.workspace,
            openPanes: [...ALL_MODULE_PANES],
            focusedPane: s.workspace.focusedPane ?? 'atlas',
            singleModuleMode: false,
            maximizedPane: null,
            viewMode: s.workspace.viewMode === 'tiles' ? 'tabs' : s.workspace.viewMode,
          },
          lastAction: 'layout:expand-all',
          statusMessage: 'All 9 modules open as tabs',
        })),

      reorderPanes: (fromIndex, toIndex) =>
        set((s) => {
          const panes = [...s.workspace.openPanes]
          if (
            fromIndex < 0 ||
            toIndex < 0 ||
            fromIndex >= panes.length ||
            toIndex >= panes.length ||
            fromIndex === toIndex
          ) {
            return {}
          }
          const [item] = panes.splice(fromIndex, 1)
          panes.splice(toIndex, 0, item!)
          return {
            workspace: { ...s.workspace, openPanes: panes },
            lastAction: 'layout:reorder',
          }
        }),

      acknowledgeLayer0: (reason) => {
        const token = uid('ack')
        const now = new Date().toISOString()
        set((s) => ({
          layer0AckToken: token,
          layer0: {
            active: true,
            reason: reason || 'Operator acknowledged Layer-0',
            lastCheckedAt: now,
            blockedActions: [],
          },
          workingDocument: appendEntry(s.workingDocument, {
            kind: 'layer0',
            title: 'Layer-0 acknowledged',
            body: reason || 'Operator acknowledged high-stakes pre-filter.',
            score: 1,
            moduleId: s.activeModule,
          }),
          lastAction: 'layer0:ack',
          statusMessage: 'Layer-0 acknowledged for next high-stakes action',
        }))
      },

      clearLayer0Ack: () => set({ layer0AckToken: null }),

      requestAction: (action, reason) => {
        const s = get()
        const neg = unresolvedNegatives(s.evidence).length
        const result = evaluateLayer0({
          action,
          acknowledged: Boolean(s.layer0AckToken),
          unresolvedNegative: neg,
          reason,
        })
        set({
          layer0: result.state,
          lastAction: `layer0:${action}:${result.allowed ? 'ok' : 'hold'}`,
          statusMessage: result.message,
          workingDocument: appendEntry(s.workingDocument, {
            kind: 'layer0',
            title: result.allowed ? 'Layer-0 cleared' : 'Layer-0 hold',
            body: result.message,
            score: result.score,
            moduleId: s.activeModule,
            meta: { action },
          }),
        })
        if (result.allowed && s.layer0AckToken) {
          // one-shot ack
          set({ layer0AckToken: null })
        }
        return { allowed: result.allowed, message: result.message }
      },

      loadDataPack: (pack) => {
        const gate = get().requestAction('datapack.replace', `Load pack ${pack.meta.name}`)
        if (!gate.allowed) return
        set((s) => ({
          dataPack: pack,
          conditions: defaultConditions(pack),
          evidence: [...pack.sampleEvidence],
          workingDocument: appendEntry(s.workingDocument, {
            kind: 'decision',
            title: `Data pack loaded: ${pack.meta.name}`,
            body: `${pack.meta.id}@${pack.meta.version} — ${pack.meta.description}`,
            score: 1,
            moduleId: 'export-kit',
          }),
          statusMessage: `Loaded ${pack.meta.name}`,
          lastAction: `pack:${pack.meta.id}`,
        }))
      },

      setConditionSelection: (axisId, optionId) =>
        set((s) => {
          if (!s.conditions) return {}
          return {
            conditions: {
              ...s.conditions,
              selections: { ...s.conditions.selections, [axisId]: optionId },
              updatedAt: new Date().toISOString(),
            },
            lastAction: `condition:${axisId}=${optionId}`,
          }
        }),

      setConditionNotes: (notes) =>
        set((s) =>
          s.conditions
            ? {
                conditions: {
                  ...s.conditions,
                  notes,
                  updatedAt: new Date().toISOString(),
                },
              }
            : {},
        ),

      applyConditions: () =>
        set((s) => {
          if (!s.conditions) return { statusMessage: 'No condition matrix active' }
          const matrix = s.dataPack.conditionMatrices.find((m) => m.id === s.conditions!.matrixId)
          const summary = Object.entries(s.conditions.selections)
            .map(([axisId, optId]) => {
              const axis = matrix?.axes.find((a) => a.id === axisId)
              const opt = axis?.options.find((o) => o.id === optId)
              return `${axis?.label ?? axisId}: ${opt?.label ?? optId}`
            })
            .join(' · ')
          return {
            workingDocument: appendEntry(s.workingDocument, {
              kind: 'condition',
              title: 'Conditions applied',
              body: summary + (s.conditions.notes ? `\nNotes: ${s.conditions.notes}` : ''),
              score: 1,
              moduleId: 'design-lab',
            }),
            statusMessage: 'Design Lab conditions applied to session',
            lastAction: 'conditions:apply',
            sessionMode: 'analyze',
          }
        }),

      addEvidence: (item) =>
        set((s) => {
          const full: EvidenceItem = {
            id: item.id ?? uid('ev'),
            title: item.title,
            summary: item.summary,
            score: item.score,
            confidence: item.confidence,
            material: item.material,
            tags: item.tags,
            sourceRefs: item.sourceRefs,
            createdAt: new Date().toISOString(),
            moduleId: item.moduleId ?? s.activeModule,
          }
          return {
            evidence: [full, ...s.evidence],
            workingDocument: appendEntry(s.workingDocument, {
              kind: 'evidence',
              title: `Evidence: ${full.title}`,
              body: full.summary,
              score: full.score,
              moduleId: full.moduleId,
            }),
            lastAction: `evidence:add:${full.id}`,
            statusMessage:
              full.score === -1
                ? '−1 evidence added — escalation required before export'
                : 'Evidence recorded',
          }
        }),

      setEvidenceScore: (id, score) =>
        set((s) => {
          if (score === -1) {
            const gate = evaluateLayer0({
              action: 'evidence.score.-1',
              acknowledged: true,
              unresolvedNegative: 0,
            })
            void gate
          }
          return {
            evidence: s.evidence.map((e) => (e.id === id ? { ...e, score } : e)),
            workingDocument: appendEntry(s.workingDocument, {
              kind: 'evidence',
              title: `Rescored evidence ${id}`,
              body: `New score: ${score === 1 ? '+1' : score === -1 ? '−1' : '0'}`,
              score,
              moduleId: 'research-hub',
            }),
            lastAction: `evidence:score:${id}`,
          }
        }),

      removeEvidence: (id) =>
        set((s) => ({
          evidence: s.evidence.filter((e) => e.id !== id),
          lastAction: `evidence:rm:${id}`,
        })),

      addResearchNote: (title, body, score) =>
        set((s) => {
          const note: ResearchNote = {
            id: uid('rn'),
            title,
            body,
            score,
            material: score === 1 ? 'primary' : score === -1 ? 'assumption' : 'derived',
            tags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          return {
            researchNotes: [note, ...s.researchNotes],
            evidence: [
              {
                id: uid('ev'),
                title: note.title,
                summary: note.body.slice(0, 280),
                score: note.score,
                confidence: score === 1 ? 'high' : 'medium',
                material: note.material,
                tags: ['research'],
                sourceRefs: [],
                createdAt: note.createdAt,
                moduleId: 'research-hub',
              },
              ...s.evidence,
            ],
            workingDocument: appendEntry(s.workingDocument, {
              kind: 'decision',
              title: `Research note: ${title}`,
              body,
              score,
              moduleId: 'research-hub',
            }),
            lastAction: `research:${note.id}`,
            statusMessage: 'Research note filed',
          }
        }),

      updateResearchNote: (id, patch) =>
        set((s) => ({
          researchNotes: s.researchNotes.map((n) =>
            n.id === id ? { ...n, ...patch, updatedAt: new Date().toISOString() } : n,
          ),
        })),

      setLadderLevel: (level) =>
        set((s) => {
          if (level >= 3) {
            const gate = get().requestAction(
              level >= 4 ? 'ladder.promote.L4' : 'ladder.promote.L3',
              `Promote ladder to L${level}`,
            )
            if (!gate.allowed) return { statusMessage: gate.message }
          }
          const unlocked = Math.max(s.ladder.unlocked, level) as DetailLevel
          return {
            ladder: { ...s.ladder, current: level, unlocked },
            workingDocument: appendEntry(s.workingDocument, {
              kind: 'decision',
              title: `Audit ladder → L${level}`,
              body: `Current detail level set to L${level}.`,
              score: 1,
              moduleId: 'audit-ladder',
            }),
            lastAction: `ladder:L${level}`,
            statusMessage: `Audit ladder at L${level}`,
          }
        }),

      markLadderPopulated: (level, score, note) =>
        set((s) => ({
          ladder: {
            ...s.ladder,
            populated: { ...s.ladder.populated, [level]: true },
            scores: { ...s.ladder.scores, [level]: score },
            notes: { ...s.ladder.notes, [level]: note },
            unlocked: Math.max(s.ladder.unlocked, level) as DetailLevel,
          },
          workingDocument: appendEntry(s.workingDocument, {
            kind: 'evidence',
            title: `L${level} populated`,
            body: note,
            score,
            moduleId: 'audit-ladder',
          }),
          lastAction: `ladder:pop:L${level}`,
        })),

      generateProceduralAsset: (input) => {
        const s = get()
        const asset = generateAsset({ ...input, conditions: s.conditions })
        const profile = getUseCase(s.activeUseCaseId)
        const openPanes = openPaneInWorkspace(
          s.workspace.openPanes,
          'procedural-forge',
          profile.paneWeights,
        )
        set({
          assets: [asset, ...s.assets.filter((a) => a.name !== asset.name)],
          activeAssetId: asset.id,
          sessionMode: 'generate',
          activeModule: 'procedural-forge',
          workspace: {
            ...s.workspace,
            openPanes,
            focusedPane: 'procedural-forge',
            singleModuleMode: false,
          },
          workingDocument: logGeneration(
            s.workingDocument,
            `Generated asset: ${asset.name}`,
            [
              `${asset.assetType} v${asset.version}`,
              asset.description,
              asset.verifiability ? `Verifiability: ${asset.verifiability}` : '',
              asset.flags?.length ? `Flags: ${asset.flags.join(', ')}` : '',
              asset.reasoning?.slice(0, 3).join('\n') ?? '',
              `Conditions: ${
                asset.conditionsSnapshot
                  ? JSON.stringify(asset.conditionsSnapshot.selections)
                  : 'none'
              }`,
            ]
              .filter(Boolean)
              .join('\n'),
          ),
          lastAction: `forge:gen:${asset.id}`,
          statusMessage: `Generated ${asset.name}${
            asset.verifiability ? ` · ${asset.verifiability}` : ''
          }`,
        })
        return asset
      },

      seedEvidentiaryModels: () => {
        const s = get()
        const story = resolveStory(s.activeUseCaseId)
        // Dan-style: PotentialObjects → per-item coarse → optimize → assemble (never monolith)
        const pots = reasonScenePotentials({
          deskId: s.activeUseCaseId,
          claims: story?.claims,
          evidence: s.evidence,
        })
        if (!pots.length) {
          set({
            lastAction: 'forge:seed:empty',
            statusMessage: 'No modelable potentials in claims/evidence for this desk',
          })
          return 0
        }
        const assembled = assembleSceneFromPotentials(pots, s.conditions, { maxItems: 12 })
        const generated = assembled.assets
        if (!generated.length) {
          set({
            lastAction: 'forge:seed:empty',
            statusMessage: 'Assemble produced no items',
          })
          return 0
        }
        const profile = getUseCase(s.activeUseCaseId)
        const openPanes = openPaneInWorkspace(
          openPaneInWorkspace(s.workspace.openPanes, 'procedural-forge', profile.paneWeights),
          'massing-viewer',
          profile.paneWeights,
        )
        set({
          assets: [...generated, ...s.assets],
          activeAssetId: generated[0]!.id,
          sessionMode: 'generate',
          activeModule: 'massing-viewer',
          workspace: {
            ...s.workspace,
            openPanes,
            focusedPane: 'massing-viewer',
            singleModuleMode: false,
          },
          workingDocument: logGeneration(
            s.workingDocument,
            `Seeded ${generated.length} per-item models (Dan pipeline)`,
            assembled.methodNote +
              '\n' +
              assembled.items
                .map((i) => `- ${i.name} · ${i.stage} · ${i.asset.verifiability ?? 'n/a'}`)
                .join('\n'),
          ),
          lastAction: `forge:seed:dan:${generated.length}`,
          statusMessage: `Seeded ${generated.length} items (per-item optimize) · ${assembled.methodNote.slice(0, 80)}…`,
        })
        return generated.length
      },

      optimizeActiveAsset: () => {
        const s = get()
        const cur = s.assets.find((a) => a.id === s.activeAssetId)
        if (!cur) return
        const next = optimizeAsset(cur)
        set({
          assets: s.assets.map((a) => (a.id === next.id ? next : a)),
          workingDocument: logRewrite(
            s.workingDocument,
            `Optimized: ${next.name}`,
            next.optimizeNotes.join('\n') || 'Optimization pass complete.',
          ),
          lastAction: `forge:opt:${next.id}`,
          statusMessage: `Optimized ${next.name}`,
        })
      },

      setAssetDeploy: (progress) => {
        const s = get()
        const cur = s.assets.find((a) => a.id === s.activeAssetId)
        if (!cur) return
        const next = setDeployProgress(cur, progress)
        set({
          assets: s.assets.map((a) => (a.id === next.id ? next : a)),
          lastAction: `forge:deploy:${progress}`,
        })
      },

      setActiveAsset: (id) => set({ activeAssetId: id, lastAction: `asset:${id}` }),

      setCompareMode: (on) => set({ compareMode: on }),

      rewriteActiveAsset: (description) => {
        const s = get()
        const cur = s.assets.find((a) => a.id === s.activeAssetId)
        if (!cur) return
        const regenerated = generateAsset({
          name: cur.name,
          assetType: cur.assetType,
          description,
          conditions: s.conditions,
        })
        const next: ProceduralAsset = {
          ...regenerated,
          id: cur.id,
          version: cur.version + 1,
          beforeParts: cur.parts,
          createdAt: cur.createdAt,
        }
        set({
          assets: s.assets.map((a) => (a.id === cur.id ? next : a)),
          workingDocument: logRewrite(
            s.workingDocument,
            `Rewrite v${next.version}: ${next.name}`,
            description,
          ),
          lastAction: `forge:rewrite:${next.id}`,
          statusMessage: `Rewrote ${next.name} → v${next.version}`,
        })
      },

      appendWorkingNote: (title, body, moduleId) =>
        set((s) => ({
          workingDocument: appendEntry(s.workingDocument, {
            kind: 'note',
            title,
            body,
            moduleId: moduleId ?? s.activeModule,
          }),
        })),

      recordExport: (title, body) => {
        const gate = get().requestAction('export.kit', title)
        if (!gate.allowed) return false
        set((s) => ({
          workingDocument: logExport(s.workingDocument, title, body),
          sessionMode: 'export',
          lastAction: 'export:kit',
          statusMessage: `Export recorded: ${title}`,
        }))
        return true
      },

      getActiveAsset: () => {
        const s = get()
        return s.assets.find((a) => a.id === s.activeAssetId) ?? null
      },

      moduleLabel: (id) => MODULE_META[id].label,
    }),
    {
      // v1.4 — 252 SME + uiMode web/mobile
      name: 'nexos-lpin-v1',
      version: 4,
      partialize: (s) => ({
        version: s.version,
        activeModule: s.activeModule,
        sessionMode: s.sessionMode,
        uiMode: s.uiMode,
        workingDocument: s.workingDocument,
        conditions: s.conditions,
        evidence: s.evidence,
        researchNotes: s.researchNotes,
        ladder: s.ladder,
        assets: s.assets,
        activeAssetId: s.activeAssetId,
        dataPack: s.dataPack,
        activeUseCaseId: s.activeUseCaseId,
        activeSmeLensId: s.activeSmeLensId,
        selectedSmeLensIds: s.selectedSmeLensIds,
        workspace: {
          openPanes: s.workspace.openPanes,
          focusedPane: s.workspace.focusedPane,
          maximizedPane: null,
          restoreOpenPanes: null,
          layoutLocked: s.workspace.layoutLocked,
          primaryFraction: s.workspace.primaryFraction,
          secondaryFraction: s.workspace.secondaryFraction,
          singleModuleMode: s.workspace.singleModuleMode,
          useCasePicked: s.workspace.useCasePicked,
          viewMode: s.workspace.viewMode,
        },
        activeSources: s.activeSources,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<PlatformState>
        // Keep saved open panes as-is (do NOT force all modules — that crushed tiles into tiny columns)
        const savedPanes = p.workspace?.openPanes?.filter((id) => ALL_MODULE_PANES.includes(id))
        const openPanes =
          savedPanes && savedPanes.length > 0
            ? Array.from(new Set(savedPanes))
            : current.workspace.openPanes
        const ws = {
          ...DEFAULT_WORKSPACE,
          ...current.workspace,
          ...(p.workspace ?? {}),
          openPanes,
          singleModuleMode: false,
          maximizedPane: null as null,
          restoreOpenPanes: null,
          // Always Immersive (sole workspace mode)
          viewMode: 'immersive' as const,
        }
        const activeModule =
          p.activeModule && ALL_MODULE_PANES.includes(p.activeModule)
            ? p.activeModule
            : current.activeModule
        return {
          ...current,
          ...p,
          version: current.version,
          uiMode: p.uiMode === 'mobile' || p.uiMode === 'web' ? p.uiMode : current.uiMode,
          activeModule,
          activeSmeLensId: p.activeSmeLensId ?? current.activeSmeLensId ?? DEFAULT_SME_LENS_ID,
          selectedSmeLensIds: Array.isArray(p.selectedSmeLensIds)
            ? p.selectedSmeLensIds
            : current.selectedSmeLensIds ?? [],
          lastSmeBriefing: null,
          lastSmeBriefingSet: [],
          workspace: ws,
          activeUseCaseId: p.activeUseCaseId ?? current.activeUseCaseId,
          evidence: Array.isArray(p.evidence) ? p.evidence : current.evidence,
          researchNotes: Array.isArray(p.researchNotes) ? p.researchNotes : current.researchNotes,
          activeSources: Array.isArray(p.activeSources) ? p.activeSources : current.activeSources,
        }
      },
    },
  ),
)
