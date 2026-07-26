# Portable skills reference (abstract index)

This directory summarizes **roles** of the governance / civic skill constitution so the workbench repo stays self-explaining for humans and LLMs.

**Authoritative text:** skill repository `SKILL.md` files (portable MIT skill tree).  
**This workbench:** exercises those roles in UI modules; it does not vend red-team exploit playbooks.

Public skill constitution (companion): search the publisher’s **AOS / LPIN skills** repository.  
Local operators may also keep a mirrored skills tree in their agent runtime.

---

## Core (always on for high-stakes)

| Skill role | Activation | Workbench binding |
|------------|------------|-------------------|
| **evidence-gate** | Every claim score / export | Research Hub, Export Kit, SME apply |
| **shatter-protocol** | Tier-1 / ambiguous high-stakes | Layer-0 preflight |
| **sovereign-lens** | Narrative integrity, module-0 routing | Analyst, Information principles |
| **mission-spine-guard** | Drift from truth-seeking spine | Working document, PR review |
| **4-agent-orchestration** | Multi-source / multi-jurisdiction | Complex desk runs |
| **working-doc-manager** | Multi-step durability | In-app + `docs/WORKING_DOCUMENT.md` |
| **values-alignment-check** | Identity / mission tokens | Contribution review |

## Civic intelligence

| Skill role | Activation | Workbench binding |
|------------|------------|-------------------|
| **civic-intelligence-coordinator** | Any civic domain fork | Pack authoring |
| **public-records-forensics** | Permits, minutes, contracts | Sources, ledger |
| **jurisdiction-ops** | Authority / preemption maps | Design Lab, Atlas |
| **permit-coordinator** | Installation / pathway conditions | Design Lab matrices |
| **oversight-kit-builder** | Citizen audit packs | Export Kit |
| **regulatory-routing-engine** | Cross-agency routing | Analyst / desks |
| **influence-mapping-analyst** | Entity–claim graphs | Atlas graph, Research |
| **construction-oversight** | Build / install conditions | Topic packs |
| **assessor-enrichment** | Parcel / assessment public data | Optional spatial packs |
| **state-onboarding-playbook** | Jurisdiction expand | Fork guide Gate 1 |

## Visual / spatial

| Skill role | Activation | Workbench binding |
|------------|------------|-------------------|
| **gis-layer** | Pins, public basemaps | Atlas, terrain-from-map |
| **visual-systems-architect** | Status-legible diagrams | Claim status P0, scene legend |
| **glyphos** | Symbolic status encodings | Badges, rails |

## Hardening

| Skill role | Activation | Workbench binding |
|------------|------------|-------------------|
| **ops-hardening-architect** | Release gates | test/lint/build/smoke |
| **anti-pattern-scanner** | Soft scores, narrative laundering | PR / SME narrative flags |
| **agnostic-evidence-analyst** | Domain-neutral claim hygiene | All desks |
| **reasoning-architect** | Structure of inferences | Information / pipelines |

## Explicitly out of scope for this public workbench repo

Offensive security operator skills (exploit, privesc, exfil, etc.) are **not** part of the civic workbench surface. Do not ship them inside sample packs or Information module copy. Keep the public product focused on **verification, oversight, and portable evidence discipline**.

---

## Integration rules

1. Skills declare purpose, triggers, integration points, OPSEC in their `SKILL.md`.  
2. Workbench packs cite skill **roles** by name when documenting forks.  
3. Never “implement” a skill by deleting Layer-0.  
4. LLM adopters: use [`../LLM_REASONING_FRAMEWORK.md`](../LLM_REASONING_FRAMEWORK.md).

**America First | Truth-Seeking**
