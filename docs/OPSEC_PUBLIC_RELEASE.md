# OPSEC — public release durability

**Scope:** What must be true before this tree is pushed to a public GitHub remote.  
**Companion:** `docs/PII_AND_AGNOSTIC_POLICY.md`, `docs/EXPERIMENTAL_STATUS.md`

---

## 1. Hard rules (non-negotiable)

| Rule | Standard |
|------|----------|
| No secrets | No API keys, tokens, `.env`, PEM, private credentials in git |
| No private PII | No home addresses, phones, SSNs, private emails in sample packs |
| No local machine paths in **public** docs | Use `<product-root>`, relative paths, or “clone directory” |
| No doxxing / targeting packs | High-level selectors unless operator-defined research desk |
| No forensic overclaim | 3D/map = illustrative; scores = operator judgment |
| Experimental labeling | Channel visible in UI + README + GitHub description |
| Releases offline | `releases/` gitignored — attach zips via GitHub Releases if needed |
| Agent scratch offline | `.hermes/`, `dogfood-output/`, logs gitignored |

---

## 2. Allowed public content

- Public statutes, agency URLs, newsroom links used as **training** cites  
- Synthetic / generic training desks  
- MIT source, docs that teach method  
- Org name on GitHub (public identity) when used as **maintainer**, not as private PII  

---

## 3. Must stay out of git

```
node_modules/
dist/
releases/          # except optional .gitkeep
.hermes/
dogfood-output/
docs/archive-local/
.env*
*.pem / *.key
*.log
docs/_extracted_*
```

---

## 4. Pre-push checklist

```bash
# From product root
rg -n "C:\\\\Users|C:/Users" --glob '!node_modules' --glob '!dist' --glob '!releases' --glob '!.git'
rg -n "ghp_|sk-[a-zA-Z0-9]{10,}|xox[baprs]-" --glob '!node_modules' --glob '!package-lock.json'
rg -n "LocalDesktop|AppData\\\\|OneDrive\\\\" --glob '!node_modules' --glob '!docs/archive-local' --glob '!releases'
npm test && npm run lint && npm run build
node scripts/smoke-sme-congress.mjs
```

**Pass criteria:** no personal home paths in tracked public set; no secret patterns; gates green.

---

## 5. What we did for this packaging pass

- Experimental maturity constants + UI badges/disclaimers  
- `dogfood-output/` and `docs/archive-local/` ignored  
- Local absolute-path builder handoffs moved under `docs/archive-local/` (not for public clone)  
- README / QUICKSTART / VERSION experimental channel  
- Commit plan documents intentional history  

---

## 6. Residual risk (accepted for experimental)

| Risk | Mitigation |
|------|------------|
| Training desks reference real public events | Labeled training; not live casework |
| Broad SME catalog can be misread as authority | Confirm-apply + experimental labels |
| External map tile / audio hosts | CSP allowlist; failures non-fatal |
| Future forks re-add local paths | CONTRIBUTING + this doc |

---

## 7. Incident response

If a secret or private path is pushed:

1. Rotate the credential immediately  
2. `git filter-repo` / BFG history purge if needed  
3. Force-push only with maintainer consensus on a **private** recovery branch policy  
4. Document in a public security note without repeating the secret  

---

**Public resource · high-stakes honesty · no doxxing · no secret sprawl**
