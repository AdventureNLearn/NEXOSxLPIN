# PII Security & Agnostic Content Policy

**Status:** Product law for public distribution  
**Audience:** Operators, pack authors, LLM agents using this repo as a reasoning reference  

---

## 1. Purpose

NEXOSxLPIN is a **public high-stakes decision workbench**. Content must remain safe to share, fork, and train on without exposing private individuals or locking the product to one operator’s machine.

---

## 2. Definitions

| Term | Meaning |
|------|---------|
| **PII** | Names, emails, phones, addresses, account IDs, biometric identifiers, precise home locations, client matter IDs, or any data that identifies a private person |
| **High-level selector** | Topic family, industry sector, agency *type*, device *class*, process stage — not a named private party |
| **Defined research focus** | Operator has explicitly opened/created a desk, pack, or story that narrows scope (still without pasting secrets into the shared pack) |
| **Agnostic sample** | Training data free of client identity; public-agency *types* and generic place bands OK when not doxxing |

---

## 3. Selector posture (UI + packs)

1. **Default:** selectors and catalogs stay **high-level** (family → topic → desk).  
2. **Industry / congressional training desks** may name **public sectors, device classes, and generic oversight themes**.  
3. **Specific story focus** may use **public-event framing** and **public coordinates for facilities** when the story requires it — never private residences or unconsented persons.  
4. **Do not** pre-load real complainant names, license plates, faces, or home addresses into shipped packs.  
5. **Map pins** for training use generalized or well-known public sites; operator-added pins are local session data (not exported by default without review).

---

## 4. What may appear in the public repo

| Allowed | Not allowed |
|---------|-------------|
| Public agency types (e.g. “municipal FOIA office”) | Private individual full names in samples |
| Public statutes / FR / guidance URLs | API keys, tokens, `.env` secrets |
| Generic city/state **as legal regime examples** when relevant to industry research | Precise personal addresses |
| Device classes (ALPR camera, BWC, AQ sensor) | Client docket numbers from real matters |
| Fictionalized training narratives labeled as training | Scraped social profiles of private persons |
| GitHub org / skill repo citations (public) | Hard-coded single-user home paths as product requirements |

---

## 5. Path & machine identifiers

| Public docs say | Not in public docs |
|-----------------|--------------------|
| “Product root” / “clone or unzip directory” | Mandatory `C:\Users\<name>\…` |
| “Local disk preferred over cloud sync folders” | One operator’s OneDrive tree as the product home |
| `http://127.0.0.1:5173` as local dev URL | Binding identity to a hostname |

Install scripts may **detect** the install directory at runtime. They must not require a fixed personal username path.

---

## 6. Export & session data

- Export Kit is **explicit** and Layer-0 gated.  
- Operators are responsible for scrubbing PII before any public share.  
- Working-document trails should use roles (“Complainant A”) not real names in **shared** packs.  
- LLM agents reading this repo must **not** invent personal identifiers to “make examples realistic.”

---

## 7. LLM agents using this repo

When adopting the reasoning framework:

1. Preserve tri-state + Layer-0 + illustrative-3D rules.  
2. Do not copy local absolute paths from any operator machine into generated packs.  
3. Prefer high-level selectors unless the user defined a research focus.  
4. Do not weaken fidelity to sound more certain.  
5. Cite portable docs under `docs/` by relative path.

See [`LLM_REASONING_FRAMEWORK.md`](./LLM_REASONING_FRAMEWORK.md).

---

## 8. Audit checklist (every release)

- [ ] No secrets in tree (`rg` for `ghp_`, `sk-`, `.env`)  
- [ ] No `C:\Users\<person>` required paths in README/INSTALL  
- [ ] Sample packs free of private person identifiers  
- [ ] Selectors default to family/topic level  
- [ ] 3D disclaimer intact  
- [ ] Export still explicit  

---

**America First | Truth-Seeking**  
Public resource · high-stakes honesty · no doxxing · no secret sprawl
