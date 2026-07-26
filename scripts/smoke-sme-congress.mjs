/**
 * Offline smoke for NEXOSxLPIN 2.0.x — 252 lenses + 100 stories + verify + forge + open docs.
 */
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const fail = (m) => {
  console.error('SMOKE FAIL:', m)
  process.exit(1)
}

const lenses = readFileSync(join(root, 'src/data/sme/lenses.ts'), 'utf8')
const tech = readFileSync(join(root, 'src/data/sme/technicalLenses.ts'), 'utf8')
const gov14 = readFileSync(join(root, 'src/data/sme/governanceExpansion14.ts'), 'utf8')
const tech14 = readFileSync(join(root, 'src/data/sme/technicalExpansion14.ts'), 'utf8')
const rules = readFileSync(join(root, 'src/lib/sme/rules.ts'), 'utf8')
const cong = readFileSync(join(root, 'src/data/useCases/congressDesks.ts'), 'utf8')
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))

if (!/^2\.0\.\d+$/.test(pkg.version)) fail(`package.json version ${pkg.version} not in 2.0.x`)
if (!lenses.includes('GOVERNANCE_EXPANSION_14')) fail('missing GOVERNANCE_EXPANSION_14 merge')
if (!tech.includes('TECHNICAL_EXPANSION_14')) fail('missing TECHNICAL_EXPANSION_14 merge')
if (!gov14.includes('GOVERNANCE_EXPANSION_14')) fail('governanceExpansion14 pack missing')
if (!tech14.includes('TECHNICAL_EXPANSION_14')) fail('technicalExpansion14 pack missing')

const gov14Ids = [...gov14.matchAll(/id: '(sme-[a-z0-9-]+)'/g)].map((m) => m[1])
const tech14Ids = [...tech14.matchAll(/id: '(sme-[a-z0-9-]+)'/g)].map((m) => m[1])
if (gov14Ids.length !== 33) fail(`gov14 ids ${gov14Ids.length} !== 33`)
if (tech14Ids.length !== 39) fail(`tech14 ids ${tech14Ids.length} !== 39`)

const ruleKeys = [...rules.matchAll(/'(sme-[a-z0-9-]+)':/g)].map((m) => m[1])
const uniqueRules = new Set(ruleKeys)
if (uniqueRules.size < 252) fail(`LENS_RULES keys ${uniqueRules.size} < 252`)

const congIds = [...cong.matchAll(/id: '(cong-\d{2}-[a-z0-9-]+)'/g)].map((m) => m[1])
const uniqueCong = [...new Set(congIds)]
if (uniqueCong.length !== 56) fail(`congress desk ids ${uniqueCong.length} !== 56`)
if (!cong.includes('hardenExtraClaims')) fail('missing hardenExtraClaims for desk-specific claims')
if (!cong.includes('getCongressDeskSeedMeta')) fail('missing getCongressDeskSeedMeta export')

for (const f of [
  'src/data/useCases/congressSourcesExpansion14.ts',
  'src/data/useCases/congressStoriesExpansion14.ts',
  'src/lib/verify/claimLedger.ts',
  'src/lib/verify/pipeline.ts',
  'src/lib/verify/dedupe.ts',
  'src/lib/grok/researchAgent.ts',
  'src/lib/security/urlSafety.ts',
  'src/lib/forge/objectReasoning.ts',
  'docs/INSTALL.md',
  'docs/DOC_INDEX.md',
  'docs/OPEN_DEVELOPMENT.md',
  'docs/PII_AND_AGNOSTIC_POLICY.md',
  'docs/LLM_REASONING_FRAMEWORK.md',
  'docs/FORKING_A_TOPIC_PACK.md',
  'docs/RESEARCH_PIPELINES.md',
  'docs/3D_ILLUSTRATIVE_CONTRACT.md',
  'docs/3D_OBJECT_CLASSIFICATION.md',
  'docs/LAYER_SEPARATION_AND_POTENTIALS.md',
  'src/lib/forge/potentials.ts',
  'src/lib/map/mappingLayer.ts',
  'docs/EXPERIMENTAL_STATUS.md',
  'docs/OPSEC_PUBLIC_RELEASE.md',
  'docs/COMMIT_PLAN.md',
  'docs/VISUAL_ASSISTANT_INSTRUCTION_SET.md',
  'src/lib/product/maturity.ts',
  'src/lib/assist/analysisCoach.ts',
  'src/components/layout/VisualAssistant.tsx',
  'docs/NEXOSxLPIN_UI_Supercharge_Spec_v1.0.md',
  'docs/UI_P0_HOW_TO_USE.md',
  'src/lib/ui/claimStatus.ts',
  'src/components/ui/ClaimStatus.tsx',
  'src/lib/forge/terrainFromMap.ts',
  'src/lib/map/mapFilters.ts',
  'src/lib/map/geoScale.ts',
  'src/lib/map/scaleAccurateFeatures.ts',
  'src/lib/map/investigationLayers.ts',
  'src/components/layout/WelcomeBanner.tsx',
  'src/components/layout/SpatialLayerStack.tsx',
  'src/components/layout/UseCaseSwitcher.tsx',
  'src/components/modules/InformationModule.tsx',
  'LICENSE',
  'CONTRIBUTING.md',
  'START.bat',
  'INSTALL.bat',
]) {
  if (!existsSync(join(root, f))) fail(`missing ${f}`)
}
const uiSpec = readFileSync(join(root, 'docs/NEXOSxLPIN_UI_Supercharge_Spec_v1.0.md'), 'utf8')
if (!uiSpec.includes('UI Supercharge Spec v1.0')) fail('UI Supercharge Spec missing title')
if (!uiSpec.includes('Layer-0') || !uiSpec.includes('plausible')) {
  fail('UI Supercharge Spec missing non-negotiable language')
}
const claimStatus = readFileSync(join(root, 'src/lib/ui/claimStatus.ts'), 'utf8')
if (!claimStatus.includes('#22c55e') || !claimStatus.includes('#a78bfa')) {
  fail('claimStatus missing Spec status pin colors')
}
if (!claimStatus.includes('highestStakesStatus') || !claimStatus.includes('pinColorForStatus')) {
  fail('claimStatus missing pin helpers for Massing reuse')
}
const terrainSrc = readFileSync(join(root, 'src/lib/forge/terrainFromMap.ts'), 'utf8')
if (!terrainSrc.includes('buildTerrainMesh') || !terrainSrc.includes('inferTerrainProfile')) {
  fail('terrainFromMap missing builders')
}
const mapFiltersSrc = readFileSync(join(root, 'src/lib/map/mapFilters.ts'), 'utf8')
if (!mapFiltersSrc.includes('computeTrueMapFilters') || !mapFiltersSrc.includes('BASEMAPS')) {
  fail('mapFilters missing true geo filter system')
}
if (!mapFiltersSrc.includes('World_Imagery') || !mapFiltersSrc.includes('opentopomap')) {
  fail('mapFilters missing real basemap tile endpoints')
}
const geoScale = readFileSync(join(root, 'src/lib/map/geoScale.ts'), 'utf8')
if (!geoScale.includes('wgs84ToEnu') || !geoScale.includes('isScaleSelectable')) {
  fail('geoScale missing ENU / selectability gates')
}
if (!geoScale.includes('METER') && !geoScale.includes('meters')) {
  fail('geoScale must document meter units')
}
const wsDefault = readFileSync(join(root, 'src/types/useCase.ts'), 'utf8')
if (!wsDefault.includes("viewMode: 'immersive'")) {
  fail('DEFAULT_WORKSPACE must be immersive-only')
}

const ledger = readFileSync(join(root, 'src/lib/verify/claimLedger.ts'), 'utf8')
if (!ledger.includes('buildClaimLedger')) fail('claimLedger missing buildClaimLedger')
const agent = readFileSync(join(root, 'src/lib/grok/researchAgent.ts'), 'utf8')
if (!agent.includes('runGrokResearchAgent')) fail('researchAgent missing runGrokResearchAgent')
if (!agent.includes('publicGrokUrl')) fail('researchAgent missing publicGrokUrl')
const forgeReason = readFileSync(join(root, 'src/lib/forge/objectReasoning.ts'), 'utf8')
if (!forgeReason.includes('reasonSceneObjects')) fail('objectReasoning missing reasonSceneObjects')
if (!forgeReason.includes('plausible_unverified')) fail('objectReasoning missing plausible_unverified')
if (!forgeReason.includes('seedEvidentiaryModels') && !readFileSync(join(root, 'src/store/platformStore.ts'), 'utf8').includes('seedEvidentiaryModels')) {
  fail('store missing seedEvidentiaryModels')
}
const catalog = readFileSync(join(root, 'src/data/forge/meshCatalog.ts'), 'utf8')
const famIds = [...catalog.matchAll(/id:\s*'(mf-[a-z0-9-]+)'/g)].map((m) => m[1])
// count f( calls roughly via id field in f( helpers - MESH_FAMILIES entries
const fCalls = [...catalog.matchAll(/\bf\(\s*'mf-/g)].length
if (fCalls < 100) fail(`mesh families f() entries ${fCalls} < 100`)
if (new Set(famIds).size < 100 && fCalls < 100) fail('mesh catalog under 100 unique families')
if (!catalog.includes('assertCatalogUnique')) fail('mesh catalog missing uniqueness assert')
if (!existsSync(join(root, 'src/lib/forge/meshRecipeEngine.ts'))) {
  fail('missing meshRecipeEngine.ts')
}
if (!existsSync(join(root, 'src/data/useCases/storyCorpus100.ts'))) {
  fail('missing storyCorpus100.ts')
}
if (!existsSync(join(root, 'src/data/useCases/corpusSeeds100.json'))) {
  fail('missing corpusSeeds100.json')
}
const corpusJson = JSON.parse(
  readFileSync(join(root, 'src/data/useCases/corpusSeeds100.json'), 'utf8'),
)
if (!Array.isArray(corpusJson) || corpusJson.length !== 33) {
  fail(`corpus seeds ${corpusJson?.length} !== 33`)
}
const geoCount = corpusJson.filter((s) => s.topic === 'geopolitical').length
if (geoCount !== 10) fail(`geopolitical seeds ${geoCount} !== 10`)
// catalog should merge corpus profiles
const catalogSrc = readFileSync(join(root, 'src/data/useCases/catalog.ts'), 'utf8')
if (!catalogSrc.includes('CORPUS_PROFILES')) fail('catalog missing CORPUS_PROFILES merge')
if (!readFileSync(join(root, 'package.json'), 'utf8').includes('"2.0.0"')) {
  fail('package.json not 2.0.0')
}
// Open-pack docs must stay PII-agnostic (no hard-coded personal home paths in public INSTALL)
const installMd = readFileSync(join(root, 'docs/INSTALL.md'), 'utf8')
if (/C:\\\\Users\\\\[^P\n]+/i.test(installMd) || /C:\\Users\\Chris/i.test(installMd)) {
  fail('INSTALL.md contains personal user path')
}
const infoMod = readFileSync(join(root, 'src/components/modules/InformationModule.tsx'), 'utf8')
if (!infoMod.includes('PII') || !infoMod.includes('252')) {
  fail('InformationModule missing PII section or 252 SME count')
}
const switcher = readFileSync(join(root, 'src/components/layout/UseCaseSwitcher.tsx'), 'utf8')
if (!switcher.includes('expanded') || !switcher.includes('families first')) {
  fail('UseCaseSwitcher missing progressive family expand')
}
const llm = readFileSync(join(root, 'docs/LLM_REASONING_FRAMEWORK.md'), 'utf8')
if (!llm.includes('+1 / 0 / −1') && !llm.includes('+1 / 0 / -1')) {
  fail('LLM framework missing tri-state language')
}

// 100-story catalogue: gen-explore + 10 trends + 56 congress + 33 seeds
const storyCorpus = readFileSync(join(root, 'src/data/useCases/storyCorpus100.ts'), 'utf8')
if (!storyCorpus.includes('catalogueByTopic')) fail('storyCorpus100 missing catalogueByTopic')
if (!catalogSrc.includes('CONGRESS_DESK_PROFILES')) fail('catalog missing CONGRESS_DESK_PROFILES merge')
if (!catalogSrc.includes('CORPUS_PROFILES')) fail('catalog missing CORPUS_PROFILES merge')

const inlineCatalogIds = [
  ...catalogSrc.matchAll(/id:\s*'(gen-explore|trend-\d{2}-[a-z0-9-]+)'/g),
].map((m) => m[1])
const uniqueInline = new Set(inlineCatalogIds)
// gen-explore + trend-01…10
if (uniqueInline.size !== 11) fail(`inline catalog tops ${uniqueInline.size} !== 11`)
const keptTops = uniqueInline.size + uniqueCong.length // 11 + 56 = 67
if (keptTops !== 67) fail(`kept tops ${keptTops} !== 67`)
const totalStories = keptTops + corpusJson.length // 67 + 33 = 100
if (totalStories !== 100) {
  fail(`total stories ${totalStories} !== 100 (kept ${keptTops} + seeds ${corpusJson.length})`)
}

const topicCounts = {}
for (const s of corpusJson) {
  topicCounts[s.topic] = (topicCounts[s.topic] || 0) + 1
}

console.log('SMOKE OK')
console.log(
  JSON.stringify(
    {
      version: pkg.version,
      totalStories,
      keptTops,
      corpusSeeds: corpusJson.length,
      geopolitical: geoCount,
      topics: topicCounts,
      meshFamilies: fCalls,
      gov14: gov14Ids.length,
      tech14: tech14Ids.length,
      ruleKeys: uniqueRules.size,
      congDesks: uniqueCong.length,
      verify: true,
      grokAgent: true,
      uiSuperchargeSpec: true,
      claimStatusP0: true,
      immersiveOnly: true,
      mapTerrain: true,
      trueMapFilters: true,
      scaleAccurateMassing: true,
      openDocs: true,
      piiPolicy: true,
      llmFramework: true,
      progressiveSelectors: true,
    },
    null,
    2,
  ),
)
