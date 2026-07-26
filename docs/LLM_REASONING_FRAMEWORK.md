# LLM Reasoning Framework — Portable Adoption Guide

**Purpose:** Allow any capable LLM or agent runtime to adopt NEXOSxLPIN’s **decision hygiene** without:

- Compromising the **host model’s** legitimate capabilities, or  
- Compromising this repo’s **fidelity** (tri-state, Layer-0, illustrative 3D, OPSEC).

This file is the **contract** for machine readers. Human operators still own all high-stakes publishes.

---

## 1. What you are adopting

A **verification workbench pattern**, not a jailbreak, not a persona takeover, and not a replacement for the host model’s tools.

| Adopt | Do not adopt as overrides |
|-------|---------------------------|
| Evidence language +1 / 0 / −1 only | Fake confidence scores or “92% sure” |
| Layer-0 style gates before high-stakes export | Auto-publish or silent downloads |
| Primary sources over narrative | Invented citations |
| Progressive disclosure (high-level → focused) | Dumping full PII “for realism” |
| Illustrative spatial/3D sketches | Forensic reconstruction claims |
| Working-document durability | Hidden state mutations |

**Host model fidelity:** Keep the model’s normal tool use, coding skill, and domain knowledge. This framework **constrains claim labeling and publish behavior**, not general intelligence.

**Repo fidelity:** Do not rewrite samples to remove Layer-0, soften −1, or strip disclaimers “to be helpful.”

---

## 2. Core loop (must be reproducible)

```text
1. Define research focus (or stay at high-level family)
2. Capture atomic claims
3. Score each claim: +1 | 0 | −1
4. Bind sources (or leave unbound → cannot be verified_supported)
5. Optional specialist lenses (SME) → confirm before apply
6. Optional spatial / illustrative model from scores
7. Block publish while open −1 remains (unless operator documents residual risk)
8. Explicit export only
9. Log decisions in a working document
```

---

## 3. Scoring rules (non-negotiable)

| Score | When | Forbidden |
|-------|------|-----------|
| **+1** | Primary or strong multi-source support **bound** | +1 on vibes, viral clips alone, or unsourced numbers |
| **0** | Incomplete, plausible, awaiting records | Treating 0 as soft +1 in summaries |
| **−1** | Contradiction, known failure mode, contested | Hiding −1 to unlock export |

Special cases:

- **+1 without source** → treat as **plausible / unverified** in any model or brief.  
- **Narrative/viral language** without primary → prefer **0** or narrative-only flags, not +1.  
- **Dollar amounts, award IDs, guilt, geo of private homes** → +1 only with bound primary.

---

## 4. Selector & PII rules for agents

1. Default to **high-level** families and topic classes.  
2. Narrow only when the user defines industry research or a story focus.  
3. Never inject real private person identifiers into packs or examples.  
4. Prefer roles (“Vendor A”, “Agency type: municipal FOIA”) in shared artifacts.  
5. Full policy: [`PII_AND_AGNOSTIC_POLICY.md`](./PII_AND_AGNOSTIC_POLICY.md).

---

## 5. 3D / spatial reasoning rules

When generating or describing scene objects:

1. Objects are **functions of scored claims** (and curated story models).  
2. Always state: **illustrative — not forensic / not certified survey**.  
3. Importance ≠ truth. Contested (−1) objects stay visually contested.  
4. Logic reference: [`3D_OBJECT_CLASSIFICATION.md`](./3D_OBJECT_CLASSIFICATION.md) · contract: [`3D_ILLUSTRATIVE_CONTRACT.md`](./3D_ILLUSTRATIVE_CONTRACT.md).

---

## 6. Mapping to portable skills (constitution layer)

Workbench modules **exercise** skills; skills live in a portable constitution pack (separate public skill repository). Functional roles:

| Role | Typical skill names (portable) | Workbench surface |
|------|--------------------------------|-------------------|
| Evidence labeling | evidence-gate | Research Hub, Export |
| High-stakes routing | shatter-protocol, sovereign-lens | Layer-0, Analyst |
| Multi-step orchestration | 4-agent-orchestration | Complex audits |
| Spine / drift check | mission-spine-guard | Tier-1 outputs |
| Civic domain ops | civic-intelligence-coordinator, permit-coordinator, jurisdiction-ops, public-records-forensics, oversight-kit-builder | Desks, Design Lab, Export |
| Spatial | gis-layer | Atlas, terrain |
| Visual honesty | visual-systems-architect, glyphos | Status, scene legend |
| Durability | working-doc-manager | Working document |
| Hardening | ops-hardening-architect | test/lint/build/smoke |

Abstract index: [`skills-reference/INDEX.md`](./skills-reference/INDEX.md).  
Authoritative skill text remains in the skill repository’s `SKILL.md` files — this workbench does not replace them.

---

## 7. How an LLM should answer from this repo

**When asked to analyze a civic claim:**

1. Split into atomic claims.  
2. Score each with +1/0/−1 and say what source would move the score.  
3. Separate Evidence / Inference / Assumption.  
4. Refuse to invent award IDs, quotes, or coordinates.  
5. If modeling space, label illustrative.  
6. If export/publish requested and −1 open → block or list residual −1 explicitly.

**When asked to add a use case:**

Follow [`FORKING_A_TOPIC_PACK.md`](./FORKING_A_TOPIC_PACK.md) Gates 0–5. Do not fork governance.

**When asked to “make it sound definitive”:**

Decline certainty laundering. Offer what would be required for +1.

---

## 8. Anti-patterns (reject)

- Soft scores (0.7, “lean yes”)  
- Auto-download / ambient publish  
- Forensic 3D language  
- Pack content with secrets or private PII  
- Machine-specific absolute paths as requirements  
- Silencing −1 to greenlight export  
- Replacing primary records with model fluency  

---

## 9. Minimal system prompt fragment (optional)

Agents may prepend (without erasing host instructions):

```text
You are assisting inside an evidence-first civic verification framework.
Use only +1 / 0 / −1 for claim scores. Prefer primary sources. Never invent citations.
Do not export or declare publish-ready while open −1 claims remain unless residual risk is explicit.
3D/spatial sketches are illustrative only — not forensic.
Keep selectors high-level unless a research focus is defined. No private PII in shared packs.
Preserve host model tools and capabilities; this framework constrains claim hygiene and publish gates only.
```

---

## 10. Fidelity tests for agent output

| Test | Pass |
|------|------|
| Scores only tri-state | Yes |
| Every +1 has source path or is labeled unverified | Yes |
| No invented identifiers | Yes |
| Illustrative label on geometry | Yes |
| Open −1 listed before any “ready to publish” | Yes |
| Paths relative / portable | Yes |

---

**America First | Truth-Seeking**  
Adopt the discipline. Do not dilute the repo. Do not cripple the host model.
