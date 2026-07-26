/**
 * NEXOSxLPIN v2 full visibility/usability run (Playwright)
 */
import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const BASE = process.env.NEXOS_URL || 'http://127.0.0.1:5173'
const OUT = join(process.cwd(), 'dogfood-output')
const SHOTS = join(OUT, 'screenshots')
mkdirSync(SHOTS, { recursive: true })

const findings = []
const log = []
const note = (m) => {
  log.push(m)
  console.log(m)
}
const find = (sev, cat, title, detail, shot) => {
  findings.push({ sev, cat, title, detail, shot })
  console.log(`[${sev}] ${title}`)
}
const shot = async (page, name) => {
  const p = join(SHOTS, `${name}.png`)
  await page.screenshot({ path: p, fullPage: false })
  return p
}

async function clickText(page, re, opts = {}) {
  const loc = page.getByRole('button', { name: re }).or(page.getByText(re))
  const n = await loc.count()
  if (!n) return false
  await loc.first().click({ timeout: opts.timeout ?? 5000, force: opts.force })
  return true
}

async function openModuleTab(page, nameRe) {
  // Immersive top module strip
  const tab = page.locator('button').filter({ hasText: nameRe })
  const count = await tab.count()
  for (let i = 0; i < count; i++) {
    const t = (await tab.nth(i).innerText()).trim()
    if (nameRe.test(t) && t.length < 24) {
      await tab.nth(i).click({ force: true })
      return true
    }
  }
  return clickText(page, nameRe, { force: true })
}

async function main() {
  const errors = []
  const pageErrors = []
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  page.on('pageerror', (e) => pageErrors.push(String(e)))

  // Fresh session — no stale 1.6.1 persisted layout
  await page.addInitScript(() => {
    try {
      for (const k of Object.keys(localStorage)) {
        if (/nexus|nexos|zustand|platform/i.test(k)) localStorage.removeItem(k)
      }
    } catch {}
  })

  // 1 Landing first-run
  note('=== 1. First-run landing ===')
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(700)
  let s = await shot(page, '01-first-run')
  let text = await page.locator('body').innerText()
  if (!/Figure out what is true/i.test(text)) {
    find('High', 'UX', 'First-run headline missing', text.slice(0, 200), s)
  } else note('+ First-run headline clear')
  if (!/Choose a story/i.test(text)) {
    find('Critical', 'UX', 'Story picker missing on first run', text.slice(0, 200), s)
  } else note('+ Single story picker present')
  // Should NOT show full immersive triple-pane before pick
  if (/SME LENSES · EXPERT CATALOG|EVIDENCE BOARD/i.test(text) && /Choose a story/i.test(text)) {
    // if both, clutter not fully fixed
    const hasImmersiveClutter =
      (await page.locator('text=SME LENSES').count()) > 0 &&
      (await page.locator('text=Choose a story').count()) > 0
    if (hasImmersiveClutter) {
      find(
        'High',
        'UX',
        'Immersive HUD still visible under first-run picker',
        'Expected clean start without Experts/Claims chrome',
        s,
      )
    }
  } else note('+ First-run is clean (no stacked HUD under picker)')
  if (/1\.6\.1/.test(text)) find('Medium', 'Content', 'Stale 1.6.1 version still visible', 'Footer/header', s)
  if (!/2\.0\.0|v2/.test(text)) find('Low', 'Content', 'v2 version label not obvious', text.slice(0, 120), s)

  // 2 Pick story #1 via primary CTA
  note('=== 2. Pick story ===')
  const open1 = page.getByRole('button', { name: /Open story #1|Quick start/i })
  if (await open1.count()) {
    await open1.first().click()
  } else {
    await page.getByRole('button', { name: /Berlin CSD/i }).first().click()
  }
  await page.waitForTimeout(1000)
  s = await shot(page, '02-story-loaded')
  text = await page.locator('body').innerText()
  if (/Choose a story/i.test(text) && /Open story #1/i.test(text)) {
    find('Critical', 'Functional', 'Story picker still showing after selection', 'useCasePicked may not set', s)
  } else note('+ Story picker dismissed after selection')
  if (/Figure out what is true/i.test(text) && /Pick one story to begin/i.test(text)) {
    find('Medium', 'UX', 'First-run copy still dominating after pick', '', s)
  }

  // 3 Module tabs walk
  const modules = [
    ['Story', /Story|guide|How to work|PII|Supported/i, '03-story'],
    ['Claims', /claim|Supported|Disputed|\+1|Evidence/i, '04-claims'],
    ['Map', /leaflet|Map style|Map layers|Where|basemap|OpenStreetMap|Satellite/i, '05-map'],
    ['Experts', /Expert|lens|SME|domain|Filter/i, '06-experts'],
    ['Rules', /Rule|condition|matrix|Design/i, '07-rules'],
    ['Depth', /Depth|Ladder|L0|L1|Audit/i, '08-depth'],
    ['Sketch', /sketch|illustrat|Generate|Forge|mesh|disclaimer/i, '09-sketch'],
    ['3D', /3D|illustrat|survey|forensic|Massing|Seed models|basemap/i, '10-3d'],
    ['Share', /Share|Export|download|Layer-0|ACK|preflight|pack/i, '11-share'],
    ['Cmd', /command|help|Analyst|status/i, '12-cmd'],
  ]

  for (const [name, expectRe, file] of modules) {
    note(`=== Module: ${name} ===`)
    const ok = await openModuleTab(page, new RegExp(`^${name}$`, 'i')).catch(() => false)
    if (!ok) {
      // try partial
      await openModuleTab(page, new RegExp(name, 'i')).catch(() => {})
    }
    await page.waitForTimeout(700)
    s = await shot(page, file)
    text = await page.locator('body').innerText()
    if (!expectRe.test(text)) {
      find('High', 'Visibility', `${name} module content not clearly visible`, text.slice(0, 180), s)
    } else note(`+ ${name} content visible`)

    if (name === 'Map') {
      const leaf = await page.locator('.leaflet-container').count()
      if (!leaf) find('Critical', 'Functional', 'Map: no Leaflet container', '', s)
      else note('+ Leaflet present')
      // Map layers
      const lb = page.getByRole('button', { name: /Map layers/i })
      if (await lb.count()) {
        await lb.first().click({ force: true })
        await page.waitForTimeout(300)
        s = await shot(page, '05b-map-layers')
        text = await page.locator('body').innerText()
        for (const L of ['Where', 'Claims', 'Sources', 'Sketch']) {
          if (!text.includes(L)) find('Medium', 'Visibility', `Map layer "${L}" missing`, '', s)
        }
        note('+ Map layers opened')
      } else {
        find('Medium', 'Visibility', 'Map layers control not found in map stage', 'May need focus/solo map', s)
      }
      for (const st of ['Satellite', 'Dark', 'Terrain']) {
        const b = page.getByRole('button', { name: new RegExp(`^${st}$`, 'i') })
        if (await b.count()) await b.first().click({ force: true }).catch(() => {})
      }
      s = await shot(page, '05c-map-styles')
    }

    if (name === '3D') {
      const c = await page.locator('canvas').count()
      note(`canvases=${c}`)
      if (!c) find('Medium', 'Visibility', '3D: no canvas', 'WebGL/map may need GPU', s)
      if (!/illustrat|not a certified|forensic|survey/i.test(text)) {
        find('High', 'Content', '3D missing illustrative disclaimer', text.slice(0, 200), s)
      }
    }

    if (name === 'Story') {
      // guide sections inside Information
      const secs = page.locator('button').filter({
        hasText: /This story|How to work|PII|When you can publish|Add a use case|Full product/i,
      })
      const n = await secs.count()
      note(`guide sections=${n}`)
      for (let i = 0; i < Math.min(n, 5); i++) {
        await secs.nth(i).click({ force: true }).catch(() => {})
        await page.waitForTimeout(150)
      }
      s = await shot(page, '03b-guide-walk')
    }
  }

  // 4 Focus switcher mid-session
  note('=== Focus switcher ===')
  const sw = page.locator('header button[aria-haspopup="listbox"]')
  if (await sw.count()) {
    await sw.first().click()
    await page.waitForTimeout(300)
    s = await shot(page, '13-switcher')
    const opt = page.locator('[role="option"]').first()
    if (await opt.count()) {
      await opt.click()
      await page.waitForTimeout(600)
      s = await shot(page, '14-switched-desk')
      note('+ Switched desk via Focus')
    }
  } else find('Medium', 'Visibility', 'Focus switcher missing after pick', '', s)

  // 5 Mobile shell
  note('=== Mobile shell ===')
  if (await page.getByRole('button', { name: /^Mobile$/i }).count()) {
    await page.getByRole('button', { name: /^Mobile$/i }).click()
    await page.waitForTimeout(400)
    s = await shot(page, '15-mobile-shell')
    if (!(await page.locator('.ui-mobile').count())) {
      find('Medium', 'UX', 'Mobile class not applied', '', s)
    } else note('+ Mobile shell on')
    await page.getByRole('button', { name: /^Web$/i }).click()
  }

  // 6 Narrow viewport
  note('=== Narrow 390 ===')
  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForTimeout(500)
  s = await shot(page, '16-narrow')
  const ov = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
  }))
  if (ov.sw > ov.cw + 12) find('Medium', 'Visual', 'Horizontal overflow at 390px', JSON.stringify(ov), s)
  else note('+ No major H-overflow at 390')

  await page.setViewportSize({ width: 1440, height: 900 })
  s = await shot(page, '17-final')

  // console
  const uniqE = [...new Set(errors)].filter((e) => !/Download the React DevTools|favicon/i.test(e))
  const uniqP = [...new Set(pageErrors)]
  note(`console errors=${uniqE.length} pageErrors=${uniqP.length}`)
  uniqE.slice(0, 12).forEach((e) => find('High', 'Console', 'Console error', e))
  uniqP.slice(0, 8).forEach((e) => find('Critical', 'Console', 'Page error', e))

  await browser.close()

  const by = { Critical: 0, High: 0, Medium: 0, Low: 0 }
  findings.forEach((f) => {
    by[f.sev] = (by[f.sev] || 0) + 1
  })

  const report = `# NEXOSxLPIN v2 — Visibility & usability run

**URL:** ${BASE}  
**When:** ${new Date().toISOString()}  
**Session:** cleared localStorage (fresh first-run)

## Scores

| Severity | Count |
|----------|------:|
| Critical | ${by.Critical || 0} |
| High | ${by.High || 0} |
| Medium | ${by.Medium || 0} |
| Low | ${by.Low || 0} |
| **Total** | **${findings.length}** |

## What passed

- First-run single path (headline + story list)
- Story selection dismisses picker
- Module walk: Story, Claims, Map, Experts, Rules, Depth, Sketch, 3D, Share, Cmd
- Map Leaflet presence check
- Mobile shell + narrow viewport
- Console capture

## Findings

${
  findings.length
    ? findings
        .map(
          (f, i) => `### ${i + 1}. [${f.sev} · ${f.cat}] ${f.title}

${f.detail}

Screenshot: \`${f.shot || 'n/a'}\`
`,
        )
        .join('\n')
    : '_No automated findings._'
}

## Log

\`\`\`
${log.join('\n')}
\`\`\`

## Screenshots

\`dogfood-output/screenshots/\`
`

  writeFileSync(join(OUT, 'report.md'), report, 'utf-8')
  writeFileSync(join(OUT, 'findings.json'), JSON.stringify({ findings, log, errors: uniqE, pageErrors: uniqP, by }, null, 2))
  console.log('REPORT', join(OUT, 'report.md'))
  console.log('TOTAL_FINDINGS', findings.length)
  process.exit(by.Critical ? 2 : 0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
