import { useState, type ReactNode } from 'react'
import { Panel, EvidenceBadge } from '../ui/primitives'
import { usePlatformStore } from '../../store/platformStore'
import {
  resolveStory,
  claimStatusLabel,
  type ClaimStatus,
} from '../../data/useCases/stories'

const GUIDE_SECTIONS = [
  { id: 'story', label: 'This story' },
  { id: 'how', label: 'How to work a story' },
  { id: 'experimental', label: 'Experimental status' },
  { id: 'sme', label: 'Expert check' },
  { id: 'scores', label: 'Supported · uncertain · disputed' },
  { id: 'map-model', label: 'Map & model' },
  { id: 'pii', label: 'PII & selectors' },
  { id: 'publish', label: 'When you can publish' },
  { id: 'packs', label: 'Add a use case' },
  { id: 'guide', label: 'Full product guide' },
] as const

export function InformationModule({ embedded }: { embedded?: boolean } = {}) {
  const activeUseCaseId = usePlatformStore((s) => s.activeUseCaseId)
  const picked = usePlatformStore((s) => s.workspace.useCasePicked)
  const story = resolveStory(activeUseCaseId)
  const [section, setSection] =
    useState<(typeof GUIDE_SECTIONS)[number]['id']>('story')

  return (
    <div className={`h-full flex min-h-0 ${embedded ? 'gap-2' : 'gap-3'}`}>
      <nav className={`${embedded ? 'w-32' : 'w-44'} shrink-0 flex flex-col gap-0.5 overflow-auto`}>
        {GUIDE_SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSection(s.id)}
            aria-current={section === s.id ? 'page' : undefined}
            className={`text-left rounded-md px-2.5 py-2 text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 ${
              section === s.id
                ? 'bg-cyan-950/60 text-cyan-100 border border-cyan-800/40'
                : 'text-slate-400 hover:bg-slate-900 border border-transparent'
            }`}
          >
            {s.label}
          </button>
        ))}
      </nav>
      <Panel title={story && picked ? story.title : 'Story desk'} className="flex-1">
        <article className="max-w-3xl space-y-4 text-[13px] leading-relaxed text-slate-300">
          {section === 'story' &&
            (picked && story ? (
              <StoryBody story={story} />
            ) : (
              <p className="text-slate-500">
                Pick a story from the header (family → desk) or a map pin. Selectors stay high-level
                until you choose a research focus. Map, claims, and rules then follow the same plot.
              </p>
            ))}
          {section === 'how' && <HowToWork />}
          {section === 'experimental' && <ExperimentalHelp />}
          {section === 'sme' && <SmeHelp />}
          {section === 'scores' && <ScoresHelp />}
          {section === 'map-model' && <MapModelHelp />}
          {section === 'pii' && <PiiHelp />}
          {section === 'publish' && <PublishHelp />}
          {section === 'packs' && <PacksHelp />}
          {section === 'guide' && <ProductGuide />}
        </article>
      </Panel>
    </div>
  )
}

function H({ children }: { children: ReactNode }) {
  return <h3 className="text-sm font-semibold text-slate-100 tracking-wide">{children}</h3>
}

function StoryBody({
  story,
}: {
  story: NonNullable<ReturnType<typeof resolveStory>>
}) {
  return (
    <div className="space-y-4">
      <p className="text-[11px] text-cyan-600/90 uppercase tracking-[0.12em]">{story.where}</p>
      <p className="text-[14px] text-slate-200 leading-relaxed">{story.lede}</p>
      <div className="rounded-md border border-slate-800 bg-slate-950/50 p-3">
        <H>Why it matters</H>
        <p className="mt-1 text-slate-400">{story.stakes}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <H>What we can stand on</H>
          <ul className="mt-1 list-disc pl-4 space-y-1 text-slate-400">
            {story.knownSoFar.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div>
          <H>Still foggy</H>
          <ul className="mt-1 list-disc pl-4 space-y-1 text-slate-400">
            {story.stillOpen.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <H>The claims (plain language)</H>
        <ul className="mt-2 space-y-2">
          {story.claims.map((c) => (
            <li
              key={c.plain}
              className="rounded-md border border-slate-800 px-3 py-2 flex gap-2 items-start"
            >
              <EvidenceBadge score={c.score} />
              <div>
                <div className="text-slate-100 text-[13px]">{c.plain}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  <StatusWord status={c.status} /> — {c.why}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-md border border-cyan-900/40 bg-cyan-950/20 p-3 text-[12px] text-cyan-100/90">
        <span className="text-[10px] uppercase tracking-wide text-cyan-500">Next beat</span>
        <p className="mt-1">{story.nextStep}</p>
      </div>
      <div>
        <H>How each surface serves this story</H>
        <dl className="mt-2 space-y-2 text-[12px]">
          {(
            [
              ['Map', story.surfaces.map],
              ['Claims', story.surfaces.research],
              ['Story rules', story.surfaces.design],
              ['Depth', story.surfaces.ladder],
              ['Model / 3D', story.surfaces.model],
              ['Publish pack', story.surfaces.export],
              ['Sources', story.surfaces.sources],
            ] as const
          ).map(([k, v]) => (
            <div key={k} className="border-b border-slate-800/80 pb-1.5">
              <dt className="text-slate-200 font-medium">{k}</dt>
              <dd className="text-slate-500">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}

function StatusWord({ status }: { status: ClaimStatus }) {
  const color =
    status === 'supported'
      ? 'text-emerald-400'
      : status === 'disputed'
        ? 'text-rose-400'
        : 'text-amber-400'
  return <span className={color}>{claimStatusLabel(status)}</span>
}

function HowToWork() {
  return (
    <div className="space-y-3">
      <H>A simple loop</H>
      <ol className="list-decimal pl-5 space-y-2 text-slate-400">
        <li>
          <strong className="text-slate-200">Choose a family</strong> — high-level topic first;
          open a desk only when focus is defined.
        </li>
        <li>
          <strong className="text-slate-200">Read the story</strong> — what happened, where (public
          framing), why it matters.
        </li>
        <li>
          <strong className="text-slate-200">Map it</strong> — public geography; grey pins are other
          desks.
        </li>
        <li>
          <strong className="text-slate-200">Weigh claims</strong> — supported, not proven yet, or
          disputed (+1 / 0 / −1 only).
        </li>
        <li>
          <strong className="text-slate-200">Run an SME lens</strong> — confirm before applying
          scores to the ledger.
        </li>
        <li>
          <strong className="text-slate-200">Set story rules</strong> — conditions and care level.
        </li>
        <li>
          <strong className="text-slate-200">Model only if it helps</strong> — illustrative 3D
          stand-ins, never certified surveys.
        </li>
        <li>
          <strong className="text-slate-200">Publish only what survives</strong> — open −1 blocks
          the pack until resolved or residual risk is explicit.
        </li>
      </ol>
      <p className="text-[11px] text-slate-500">
        Pipelines (repo): <code className="text-cyan-600/90">docs/RESEARCH_PIPELINES.md</code>
      </p>
    </div>
  )
}

function ExperimentalHelp() {
  return (
    <div className="space-y-3">
      <H>This build is EXPERIMENTAL</H>
      <p className="text-slate-400">
        NEXOSxLPIN is a <strong className="text-slate-200">public experiment</strong> — a training
        and research desk for human judgment. It is{' '}
        <strong className="text-slate-200">not</strong> legal, medical, or forensic software. UI and
        assistive tools will change.
      </p>
      <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
        <li>
          <strong className="text-slate-200">Stable-ish:</strong> pick a story, score claims, Share
          gate on open disputed lines.
        </li>
        <li>
          <strong className="text-slate-200">Beta:</strong> map, immersive stage, assistant coach.
        </li>
        <li>
          <strong className="text-slate-200">Lab:</strong> 3D sketches, full expert catalog, mobile,
          auto-scale craft.
        </li>
        <li>
          <strong className="text-slate-200">Planned:</strong> claim miner, contradiction assist, SME
          top-3 — not fully wired yet.
        </li>
      </ul>
      <p className="text-[11px] text-slate-500">
        Repo: <code className="text-cyan-600/90">docs/EXPERIMENTAL_STATUS.md</code> ·{' '}
        <code className="text-cyan-600/90">docs/OPSEC_PUBLIC_RELEASE.md</code>
      </p>
    </div>
  )
}

function SmeHelp() {
  return (
    <div className="space-y-3">
      <H>252 Subject Matter Expert lenses</H>
      <p className="text-slate-400">
        SME Lenses are training personas across governance and technical domains. Each reads active
        claims and returns dispositions. They are <strong className="text-slate-200">not</strong>{' '}
        licenses, legal advice, or substitutes for primary records.
      </p>
      <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
        <li>
          <strong className="text-slate-200">Core governance</strong> — evidence gate, Layer-0,
          working document, narrative integrity.
        </li>
        <li>
          <strong className="text-slate-200">Public records</strong> — FOIA-class documents, permits,
          contracts, minutes.
        </li>
        <li>
          <strong className="text-slate-200">Jurisdiction</strong> — authority maps, routing,
          preemption patterns.
        </li>
        <li>
          <strong className="text-slate-200">Oversight</strong> — influence, procurement ethics, COI,
          fiscal transparency.
        </li>
        <li>
          <strong className="text-slate-200">Sector regulatory</strong> — environment, health,
          transport, land use, elections, privacy.
        </li>
        <li>
          <strong className="text-slate-200">Method + technical packs</strong> — audit ladder,
          verification playbooks, engineering-adjacent training domains.
        </li>
      </ul>
      <p className="text-slate-400">
        Open <strong className="text-slate-200">SME Lenses</strong>, multi-select if needed, run
        analysis, then <strong className="text-slate-200">confirm apply</strong>. Analyst:{' '}
        <code className="text-cyan-500/90">sme list</code> /{' '}
        <code className="text-cyan-500/90">sme evidence-gate</code>.
      </p>
    </div>
  )
}

function ScoresHelp() {
  return (
    <div className="space-y-3">
      <H>Three answers only</H>
      <ul className="space-y-2 text-slate-400">
        <li className="flex gap-2">
          <EvidenceBadge score={1} />
          <span>
            <strong className="text-slate-200">Supported (+1)</strong> — strong primary or
            multi-outlet agreement <em>with sources bound</em>. Without sources, treat as plausible
            / unverified in models.
          </span>
        </li>
        <li className="flex gap-2">
          <EvidenceBadge score={0} />
          <span>
            <strong className="text-slate-200">Not proven yet (0)</strong> — incomplete, contested,
            or waiting on a document. Not a soft yes.
          </span>
        </li>
        <li className="flex gap-2">
          <EvidenceBadge score={-1} />
          <span>
            <strong className="text-slate-200">Disputed (−1)</strong> — contradicts primary material
            or known failure mode. Blocks publishing until resolved.
          </span>
        </li>
      </ul>
      <p className="text-[11px] text-slate-500">
        Agent contract: <code className="text-cyan-600/90">docs/LLM_REASONING_FRAMEWORK.md</code>
      </p>
    </div>
  )
}

function MapModelHelp() {
  return (
    <div className="space-y-3">
      <H>Mapping</H>
      <p className="text-slate-400">
        The map is public geography for the active desk. Bright pin = current focus. Grey pins =
        other desks. Scene pins are story-internal loci — not private homes.
      </p>
      <H>Modeling</H>
      <p className="text-slate-400">
        Models are optional <strong className="text-slate-200">illustrative</strong> sketches driven
        by scored claims and curated story models. They help think about space and risk. They are
        not surveys, not evidence of guilt, and not engineering drawings.
      </p>
      <p className="text-[11px] text-slate-500">
        Logic: <code className="text-cyan-600/90">docs/3D_OBJECT_CLASSIFICATION.md</code> · Contract:{' '}
        <code className="text-cyan-600/90">docs/3D_ILLUSTRATIVE_CONTRACT.md</code>
      </p>
    </div>
  )
}

function PiiHelp() {
  return (
    <div className="space-y-3">
      <H>PII security</H>
      <p className="text-slate-400">
        This product is a <strong className="text-slate-200">public high-stakes resource</strong>.
        Sample packs and shared exports must not carry private person identifiers, secrets, or
        client matter IDs.
      </p>
      <H>Selector posture</H>
      <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
        <li>
          <strong className="text-slate-200">Default:</strong> high-level families and topic classes.
        </li>
        <li>
          <strong className="text-slate-200">Industry / training desks:</strong> public sectors and
          device classes — not named private parties.
        </li>
        <li>
          <strong className="text-slate-200">Defined story focus:</strong> public-event framing and
          public facility context only when required.
        </li>
        <li>
          Never put emails, phones, home addresses, plates, or unconsented names into shipped packs.
        </li>
      </ul>
      <p className="text-[11px] text-slate-500">
        Full policy: <code className="text-cyan-600/90">docs/PII_AND_AGNOSTIC_POLICY.md</code>
      </p>
    </div>
  )
}

function PublishHelp() {
  return (
    <div className="space-y-3">
      <H>Publish pack</H>
      <p className="text-slate-400">
        Nothing downloads until you ask. If any claim is still disputed (−1), the pack stays closed
        under Layer-0 unless you explicitly document residual risk per your process. Scrub PII before
        any public share.
      </p>
      <p className="text-slate-400">
        ACK on the status bar is intentional. Export Kit is button-only.
      </p>
    </div>
  )
}

function PacksHelp() {
  return (
    <div className="space-y-3">
      <H>Add or fork a use case</H>
      <p className="text-slate-400">
        Domain depth lives in <strong className="text-slate-200">data packs</strong> — not new
        product brands and not softened gates.
      </p>
      <ol className="list-decimal pl-5 space-y-1.5 text-slate-400">
        <li>Gate 0 — Intent lock (topic + success metric + non-negotiables)</li>
        <li>Gate 1 — Swap catalogs, matrices, sources, storyModels</li>
        <li>Gate 2 — Visual parity (claim colors, mesh tags, disclaimer)</li>
        <li>Gate 3 — test · lint · build · smoke</li>
        <li>Gate 4 — Working document trail</li>
        <li>Gate 5 — Package zip with INSTALL/START</li>
      </ol>
      <p className="text-[11px] text-slate-500">
        Guide: <code className="text-cyan-600/90">docs/FORKING_A_TOPIC_PACK.md</code> · Open model:{' '}
        <code className="text-cyan-600/90">docs/OPEN_DEVELOPMENT.md</code>
      </p>
    </div>
  )
}

function ProductGuide() {
  return (
    <div className="space-y-3 text-slate-400">
      <H>NEXOSxLPIN — evidence-first workbench</H>
      <p>
        Installable LPIN hub: <strong className="text-slate-200">252 SME lenses</strong>,{' '}
        <strong className="text-slate-200">56 congressional training desks</strong>, investigation
        tops, map-linked work, tri-state evidence, Layer-0 export gates, Web/Mobile shells,
        claim-linked <strong className="text-slate-200">illustrative</strong> 3D.
      </p>
      <H>Workspace</H>
      <p>
        <strong className="text-slate-200">Immersive</strong> investigative stage with intelligent
        module switching (header story switcher, Massing, Map, sidebar modules). Header{' '}
        <strong className="text-slate-200">Web | Mobile</strong> toggles shell density.
      </p>
      <H>Surfaces (modules)</H>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong className="text-slate-200">Information</strong> — story + portable product guide
        </li>
        <li>
          <strong className="text-slate-200">Atlas</strong> — map pins + investigation graph
        </li>
        <li>
          <strong className="text-slate-200">Design Lab</strong> — condition matrices / story rules
        </li>
        <li>
          <strong className="text-slate-200">Research Hub</strong> — claims, sources, scoring
        </li>
        <li>
          <strong className="text-slate-200">Analyst</strong> — command runtime
        </li>
        <li>
          <strong className="text-slate-200">SME Lenses</strong> — 252 experts, multi-select, confirm
          apply
        </li>
        <li>
          <strong className="text-slate-200">Audit Ladder</strong> — L0→L4 depth
        </li>
        <li>
          <strong className="text-slate-200">Procedural Forge / Massing</strong> — illustrative models
          + terrain context
        </li>
        <li>
          <strong className="text-slate-200">Export Kit</strong> — preflight + explicit download
        </li>
      </ul>
      <H>Repo docs (ship with install)</H>
      <p className="font-mono text-[11px] text-cyan-600/90 leading-relaxed">
        docs/DOC_INDEX.md · OPEN_DEVELOPMENT.md · RESEARCH_PIPELINES.md · FORKING_A_TOPIC_PACK.md ·
        PII_AND_AGNOSTIC_POLICY.md · LLM_REASONING_FRAMEWORK.md · 3D_OBJECT_CLASSIFICATION.md ·
        skills-reference/INDEX.md
      </p>
      <H>Analyst commands (high signal)</H>
      <p className="font-mono text-[11px] text-cyan-600/90 leading-relaxed">
        help · modules · open · ack · layer0 status · score · sme list|count|domains|search|run ·
        desk list · evidence summary · export check · ui web|mobile · status
      </p>
      <H>Principles</H>
      <ul className="list-disc pl-5 space-y-1">
        <li>Story first; jargon second</li>
        <li>High-level selectors until focus is defined</li>
        <li>Primary sources over social; confirm before Apply</li>
        <li>Supported / not proven / disputed — only three scores</li>
        <li>Explicit publish · Layer-0 for high-stakes</li>
        <li>No client PII in sample packs · training ≠ legal advice</li>
        <li>3D illustrative only — never forensic</li>
      </ul>
      <H>Install</H>
      <p>
        Extract or clone → Node.js LTS → <code className="text-cyan-500/90">INSTALL.bat</code> /{' '}
        <code className="text-cyan-500/90">install.sh</code> →{' '}
        <code className="text-cyan-500/90">START.bat</code> /{' '}
        <code className="text-cyan-500/90">start.sh</code> → local URL in the start banner. See{' '}
        <code className="text-cyan-500/90">docs/INSTALL.md</code>.
      </p>
    </div>
  )
}

export default InformationModule
