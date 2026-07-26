/** Congressional sources expansion cong-21…40 — generated */
import type { ActiveSource } from '../../types/useCase'

function s(id: string, title: string, url: string, why: string, kind: ActiveSource['kind'], publisher?: string, publicRecord = true, tags: string[] = []): ActiveSource {
  return { id, title, url, why, kind, publisher, publicRecord, tags }
}

export const CONGRESS_SOURCES_EXPANSION: Record<string, ActiveSource[]> = {
  'cong-21-spectrum-fcc': [
    s('cong-21-spectrum-fcc-src-1', 'Congress.gov', 'https://www.congress.gov/', 'Bill and committee materials', 'official', 'Congress.gov', true, ["spectrum","fcc","wireless","auction"]),
    s('cong-21-spectrum-fcc-src-2', 'FCC', 'https://www.fcc.gov/', 'Spectrum licensing and auction public notices.', 'official', 'FCC', true, ["spectrum","fcc","wireless","auction"]),
    s('cong-21-spectrum-fcc-src-3', 'Congress.gov search: spectrum auction', 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22spectrum%20auction%22%7D', 'Legislation search for this desk family', 'official', 'Congress.gov', true, ['legislation']),
    s('cong-21-spectrum-fcc-src-4', 'GAO', 'https://www.gao.gov/', 'Independent evaluations', 'official', 'GAO', true, ['audit']),
    s('cong-21-spectrum-fcc-src-5', 'CRS', 'https://crsreports.congress.gov/', 'Legislative analysis', 'official', 'CRS', true, ['crs']),
  ],
  'cong-22-pharma-patents': [
    s('cong-22-pharma-patents-src-1', 'Congress.gov', 'https://www.congress.gov/', 'Bill and committee materials', 'official', 'Congress.gov', true, ["pharma","patent","orange book","generic"]),
    s('cong-22-pharma-patents-src-2', 'FDA Orange Book', 'https://www.fda.gov/drugs/drug-approvals-and-databases/orange-book-data-files', 'Patent/exclusivity listings affecting generic entry.', 'official', 'FDA Orange Book', true, ["pharma","patent","orange book","generic"]),
    s('cong-22-pharma-patents-src-3', 'Congress.gov search: Orange Book patent', 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22Orange%20Book%20patent%22%7D', 'Legislation search for this desk family', 'official', 'Congress.gov', true, ['legislation']),
    s('cong-22-pharma-patents-src-4', 'GAO', 'https://www.gao.gov/', 'Independent evaluations', 'official', 'GAO', true, ['audit']),
    s('cong-22-pharma-patents-src-5', 'CRS', 'https://crsreports.congress.gov/', 'Legislative analysis', 'official', 'CRS', true, ['crs']),
  ],
  'cong-23-space-commerce': [
    s('cong-23-space-commerce-src-1', 'Congress.gov', 'https://www.congress.gov/', 'Bill and committee materials', 'official', 'Congress.gov', true, ["space","launch","faa","satellite"]),
    s('cong-23-space-commerce-src-2', 'FAA commercial space', 'https://www.faa.gov/space', 'Commercial launch licensing public materials.', 'official', 'FAA commercial space', true, ["space","launch","faa","satellite"]),
    s('cong-23-space-commerce-src-3', 'Congress.gov search: commercial space launch', 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22commercial%20space%20launch%22%7D', 'Legislation search for this desk family', 'official', 'Congress.gov', true, ['legislation']),
    s('cong-23-space-commerce-src-4', 'GAO', 'https://www.gao.gov/', 'Independent evaluations', 'official', 'GAO', true, ['audit']),
    s('cong-23-space-commerce-src-5', 'CRS', 'https://crsreports.congress.gov/', 'Legislative analysis', 'official', 'CRS', true, ['crs']),
  ],
  'cong-24-maritime-jones': [
    s('cong-24-maritime-jones-src-1', 'Congress.gov', 'https://www.congress.gov/', 'Bill and committee materials', 'official', 'Congress.gov', true, ["maritime","jones act","shipbuilding","shipping"]),
    s('cong-24-maritime-jones-src-2', 'MARAD', 'https://www.maritime.dot.gov/', 'Maritime administration public programs.', 'official', 'MARAD', true, ["maritime","jones act","shipbuilding","shipping"]),
    s('cong-24-maritime-jones-src-3', 'Congress.gov search: Jones Act maritime', 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22Jones%20Act%22%7D', 'Legislation search for this desk family', 'official', 'Congress.gov', true, ['legislation']),
    s('cong-24-maritime-jones-src-4', 'GAO', 'https://www.gao.gov/', 'Independent evaluations', 'official', 'GAO', true, ['audit']),
    s('cong-24-maritime-jones-src-5', 'CRS', 'https://crsreports.congress.gov/', 'Legislative analysis', 'official', 'CRS', true, ['crs']),
  ],
  'cong-25-agribusiness': [
    s('cong-25-agribusiness-src-1', 'Congress.gov', 'https://www.congress.gov/', 'Bill and committee materials', 'official', 'Congress.gov', true, ["agriculture","packers","usda","competition"]),
    s('cong-25-agribusiness-src-2', 'USDA AMS', 'https://www.ams.usda.gov/', 'Market news and competition-related public materials.', 'official', 'USDA AMS', true, ["agriculture","packers","usda","competition"]),
    s('cong-25-agribusiness-src-3', 'Congress.gov search: packers stockyards', 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22Packers%20and%20Stockyards%22%7D', 'Legislation search for this desk family', 'official', 'Congress.gov', true, ['legislation']),
    s('cong-25-agribusiness-src-4', 'GAO', 'https://www.gao.gov/', 'Independent evaluations', 'official', 'GAO', true, ['audit']),
    s('cong-25-agribusiness-src-5', 'CRS', 'https://crsreports.congress.gov/', 'Legislative analysis', 'official', 'CRS', true, ['crs']),
  ],
  'cong-26-housing-gse': [
    s('cong-26-housing-gse-src-1', 'Congress.gov', 'https://www.congress.gov/', 'Bill and committee materials', 'official', 'Congress.gov', true, ["housing","gse","mortgage","appraisal"]),
    s('cong-26-housing-gse-src-2', 'FHFA', 'https://www.fhfa.gov/', 'GSE oversight public materials.', 'official', 'FHFA', true, ["housing","gse","mortgage","appraisal"]),
    s('cong-26-housing-gse-src-3', 'Congress.gov search: GSE housing finance', 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22GSE%20housing%20finance%22%7D', 'Legislation search for this desk family', 'official', 'Congress.gov', true, ['legislation']),
    s('cong-26-housing-gse-src-4', 'GAO', 'https://www.gao.gov/', 'Independent evaluations', 'official', 'GAO', true, ['audit']),
    s('cong-26-housing-gse-src-5', 'CRS', 'https://crsreports.congress.gov/', 'Legislative analysis', 'official', 'CRS', true, ['crs']),
  ],
  'cong-27-student-loans': [
    s('cong-27-student-loans-src-1', 'Congress.gov', 'https://www.congress.gov/', 'Bill and committee materials', 'official', 'Congress.gov', true, ["student loans","servicing","ed","borrower"]),
    s('cong-27-student-loans-src-2', 'Federal Student Aid', 'https://studentaid.gov/', 'Servicing and borrower public materials.', 'official', 'Federal Student Aid', true, ["student loans","servicing","ed","borrower"]),
    s('cong-27-student-loans-src-3', 'Congress.gov search: student loan servicing', 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22student%20loan%20servicing%22%7D', 'Legislation search for this desk family', 'official', 'Congress.gov', true, ['legislation']),
    s('cong-27-student-loans-src-4', 'GAO', 'https://www.gao.gov/', 'Independent evaluations', 'official', 'GAO', true, ['audit']),
    s('cong-27-student-loans-src-5', 'CRS', 'https://crsreports.congress.gov/', 'Legislative analysis', 'official', 'CRS', true, ['crs']),
  ],
  'cong-28-cyber-circia': [
    s('cong-28-cyber-circia-src-1', 'Congress.gov', 'https://www.congress.gov/', 'Bill and committee materials', 'official', 'Congress.gov', true, ["cyber","circia","cisa","incident"]),
    s('cong-28-cyber-circia-src-2', 'CISA', 'https://www.cisa.gov/', 'Cyber incident reporting and sector guidance.', 'official', 'CISA', true, ["cyber","circia","cisa","incident"]),
    s('cong-28-cyber-circia-src-3', 'Congress.gov search: CIRCIA cyber incident', 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22CIRCIA%22%7D', 'Legislation search for this desk family', 'official', 'Congress.gov', true, ['legislation']),
    s('cong-28-cyber-circia-src-4', 'GAO', 'https://www.gao.gov/', 'Independent evaluations', 'official', 'GAO', true, ['audit']),
    s('cong-28-cyber-circia-src-5', 'CRS', 'https://crsreports.congress.gov/', 'Legislative analysis', 'official', 'CRS', true, ['crs']),
  ],
  'cong-29-ai-copyright': [
    s('cong-29-ai-copyright-src-1', 'Congress.gov', 'https://www.congress.gov/', 'Bill and committee materials', 'official', 'Congress.gov', true, ["copyright","ai","training data","licensing"]),
    s('cong-29-ai-copyright-src-2', 'Copyright Office', 'https://www.copyright.gov/', 'Copyright office public materials on AI and registration.', 'official', 'Copyright Office', true, ["copyright","ai","training data","licensing"]),
    s('cong-29-ai-copyright-src-3', 'Congress.gov search: AI copyright training data', 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22artificial%20intelligence%20copyright%22%7D', 'Legislation search for this desk family', 'official', 'Congress.gov', true, ['legislation']),
    s('cong-29-ai-copyright-src-4', 'GAO', 'https://www.gao.gov/', 'Independent evaluations', 'official', 'GAO', true, ['audit']),
    s('cong-29-ai-copyright-src-5', 'CRS', 'https://crsreports.congress.gov/', 'Legislative analysis', 'official', 'CRS', true, ['crs']),
  ],
  'cong-30-fedramp-cloud': [
    s('cong-30-fedramp-cloud-src-1', 'Congress.gov', 'https://www.congress.gov/', 'Bill and committee materials', 'official', 'Congress.gov', true, ["fedramp","cloud","saas","authorization"]),
    s('cong-30-fedramp-cloud-src-2', 'FedRAMP', 'https://www.fedramp.gov/', 'Authorization program public materials.', 'official', 'FedRAMP', true, ["fedramp","cloud","saas","authorization"]),
    s('cong-30-fedramp-cloud-src-3', 'Congress.gov search: FedRAMP cloud', 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22FedRAMP%22%7D', 'Legislation search for this desk family', 'official', 'Congress.gov', true, ['legislation']),
    s('cong-30-fedramp-cloud-src-4', 'GAO', 'https://www.gao.gov/', 'Independent evaluations', 'official', 'GAO', true, ['audit']),
    s('cong-30-fedramp-cloud-src-5', 'CRS', 'https://crsreports.congress.gov/', 'Legislative analysis', 'official', 'CRS', true, ['crs']),
  ],
  'cong-31-insurance-climate': [
    s('cong-31-insurance-climate-src-1', 'Congress.gov', 'https://www.congress.gov/', 'Bill and committee materials', 'official', 'Congress.gov', true, ["insurance","climate","risk model","naic"]),
    s('cong-31-insurance-climate-src-2', 'NAIC', 'https://content.naic.org/', 'Insurance regulatory association public resources.', 'official', 'NAIC', true, ["insurance","climate","risk model","naic"]),
    s('cong-31-insurance-climate-src-3', 'Congress.gov search: insurance climate risk', 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22insurance%20climate%20risk%22%7D', 'Legislation search for this desk family', 'official', 'Congress.gov', true, ['legislation']),
    s('cong-31-insurance-climate-src-4', 'GAO', 'https://www.gao.gov/', 'Independent evaluations', 'official', 'GAO', true, ['audit']),
    s('cong-31-insurance-climate-src-5', 'CRS', 'https://crsreports.congress.gov/', 'Legislative analysis', 'official', 'CRS', true, ['crs']),
  ],
  'cong-32-rail-safety': [
    s('cong-32-rail-safety-src-1', 'Congress.gov', 'https://www.congress.gov/', 'Bill and committee materials', 'official', 'Congress.gov', true, ["rail","fra","tank car","safety"]),
    s('cong-32-rail-safety-src-2', 'FRA', 'https://railroads.dot.gov/', 'Rail safety rules and accident data public materials.', 'official', 'FRA', true, ["rail","fra","tank car","safety"]),
    s('cong-32-rail-safety-src-3', 'Congress.gov search: rail safety tank car', 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22rail%20safety%22%7D', 'Legislation search for this desk family', 'official', 'Congress.gov', true, ['legislation']),
    s('cong-32-rail-safety-src-4', 'GAO', 'https://www.gao.gov/', 'Independent evaluations', 'official', 'GAO', true, ['audit']),
    s('cong-32-rail-safety-src-5', 'CRS', 'https://crsreports.congress.gov/', 'Legislative analysis', 'official', 'CRS', true, ['crs']),
  ],
  'cong-33-cfats-chem': [
    s('cong-33-cfats-chem-src-1', 'Congress.gov', 'https://www.congress.gov/', 'Bill and committee materials', 'official', 'Congress.gov', true, ["cfats","chemical","security","facility"]),
    s('cong-33-cfats-chem-src-2', 'CISA chemical security', 'https://www.cisa.gov/chemical-security', 'Chemical facility security program public materials.', 'official', 'CISA chemical security', true, ["cfats","chemical","security","facility"]),
    s('cong-33-cfats-chem-src-3', 'Congress.gov search: CFATS chemical facility', 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22CFATS%22%7D', 'Legislation search for this desk family', 'official', 'Congress.gov', true, ['legislation']),
    s('cong-33-cfats-chem-src-4', 'GAO', 'https://www.gao.gov/', 'Independent evaluations', 'official', 'GAO', true, ['audit']),
    s('cong-33-cfats-chem-src-5', 'CRS', 'https://crsreports.congress.gov/', 'Legislative analysis', 'official', 'CRS', true, ['crs']),
  ],
  'cong-34-export-bis': [
    s('cong-34-export-bis-src-1', 'Congress.gov', 'https://www.congress.gov/', 'Bill and committee materials', 'official', 'Congress.gov', true, ["export","bis","entity list","ear"]),
    s('cong-34-export-bis-src-2', 'BIS', 'https://www.bis.doc.gov/', 'Export administration public materials and lists.', 'official', 'BIS', true, ["export","bis","entity list","ear"]),
    s('cong-34-export-bis-src-3', 'Congress.gov search: export controls entity list', 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22export%20controls%22%7D', 'Legislation search for this desk family', 'official', 'Congress.gov', true, ['legislation']),
    s('cong-34-export-bis-src-4', 'GAO', 'https://www.gao.gov/', 'Independent evaluations', 'official', 'GAO', true, ['audit']),
    s('cong-34-export-bis-src-5', 'CRS', 'https://crsreports.congress.gov/', 'Legislative analysis', 'official', 'CRS', true, ['crs']),
  ],
  'cong-35-ofac-sanctions': [
    s('cong-35-ofac-sanctions-src-1', 'Congress.gov', 'https://www.congress.gov/', 'Bill and committee materials', 'official', 'Congress.gov', true, ["sanctions","ofac","banking","fintech"]),
    s('cong-35-ofac-sanctions-src-2', 'OFAC', 'https://ofac.treasury.gov/', 'Sanctions lists and compliance resources.', 'official', 'OFAC', true, ["sanctions","ofac","banking","fintech"]),
    s('cong-35-ofac-sanctions-src-3', 'Congress.gov search: sanctions OFAC compliance', 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22OFAC%20sanctions%22%7D', 'Legislation search for this desk family', 'official', 'Congress.gov', true, ['legislation']),
    s('cong-35-ofac-sanctions-src-4', 'GAO', 'https://www.gao.gov/', 'Independent evaluations', 'official', 'GAO', true, ['audit']),
    s('cong-35-ofac-sanctions-src-5', 'CRS', 'https://crsreports.congress.gov/', 'Legislative analysis', 'official', 'CRS', true, ['crs']),
  ],
  'cong-36-child-safety-apps': [
    s('cong-36-child-safety-apps-src-1', 'Congress.gov', 'https://www.congress.gov/', 'Bill and committee materials', 'official', 'Congress.gov', true, ["child safety","coppa","app store","age"]),
    s('cong-36-child-safety-apps-src-2', 'FTC', 'https://www.ftc.gov/', 'Consumer protection and COPPA-related public materials.', 'official', 'FTC', true, ["child safety","coppa","app store","age"]),
    s('cong-36-child-safety-apps-src-3', 'Congress.gov search: child online safety', 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22child%20online%20safety%22%7D', 'Legislation search for this desk family', 'official', 'Congress.gov', true, ['legislation']),
    s('cong-36-child-safety-apps-src-4', 'GAO', 'https://www.gao.gov/', 'Independent evaluations', 'official', 'GAO', true, ['audit']),
    s('cong-36-child-safety-apps-src-5', 'CRS', 'https://crsreports.congress.gov/', 'Legislative analysis', 'official', 'CRS', true, ['crs']),
  ],
  'cong-37-ticketing': [
    s('cong-37-ticketing-src-1', 'Congress.gov', 'https://www.congress.gov/', 'Bill and committee materials', 'official', 'Congress.gov', true, ["ticketing","antitrust","venues","live events"]),
    s('cong-37-ticketing-src-2', 'DOJ ATR', 'https://www.justice.gov/atr', 'Antitrust enforcement public materials.', 'official', 'DOJ ATR', true, ["ticketing","antitrust","venues","live events"]),
    s('cong-37-ticketing-src-3', 'Congress.gov search: ticketing competition', 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22ticket%20competition%22%7D', 'Legislation search for this desk family', 'official', 'Congress.gov', true, ['legislation']),
    s('cong-37-ticketing-src-4', 'GAO', 'https://www.gao.gov/', 'Independent evaluations', 'official', 'GAO', true, ['audit']),
    s('cong-37-ticketing-src-5', 'CRS', 'https://crsreports.congress.gov/', 'Legislative analysis', 'official', 'CRS', true, ['crs']),
  ],
  'cong-38-postal-lastmile': [
    s('cong-38-postal-lastmile-src-1', 'Congress.gov', 'https://www.congress.gov/', 'Bill and committee materials', 'official', 'Congress.gov', true, ["postal","package","last-mile","usps"]),
    s('cong-38-postal-lastmile-src-2', 'PRC', 'https://www.prc.gov/', 'Postal Regulatory Commission public materials.', 'official', 'PRC', true, ["postal","package","last-mile","usps"]),
    s('cong-38-postal-lastmile-src-3', 'Congress.gov search: postal reform package delivery', 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22postal%20reform%22%7D', 'Legislation search for this desk family', 'official', 'Congress.gov', true, ['legislation']),
    s('cong-38-postal-lastmile-src-4', 'GAO', 'https://www.gao.gov/', 'Independent evaluations', 'official', 'GAO', true, ['audit']),
    s('cong-38-postal-lastmile-src-5', 'CRS', 'https://crsreports.congress.gov/', 'Legislative analysis', 'official', 'CRS', true, ['crs']),
  ],
  'cong-39-pfas-water': [
    s('cong-39-pfas-water-src-1', 'Congress.gov', 'https://www.congress.gov/', 'Bill and committee materials', 'official', 'Congress.gov', true, ["pfas","water","epa","liability"]),
    s('cong-39-pfas-water-src-2', 'EPA PFAS', 'https://www.epa.gov/pfas', 'PFAS regulatory and scientific public materials.', 'official', 'EPA PFAS', true, ["pfas","water","epa","liability"]),
    s('cong-39-pfas-water-src-3', 'Congress.gov search: PFAS drinking water', 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22PFAS%20drinking%20water%22%7D', 'Legislation search for this desk family', 'official', 'Congress.gov', true, ['legislation']),
    s('cong-39-pfas-water-src-4', 'GAO', 'https://www.gao.gov/', 'Independent evaluations', 'official', 'GAO', true, ['audit']),
    s('cong-39-pfas-water-src-5', 'CRS', 'https://crsreports.congress.gov/', 'Legislative analysis', 'official', 'CRS', true, ['crs']),
  ],
  'cong-40-pqc-crypto': [
    s('cong-40-pqc-crypto-src-1', 'Congress.gov', 'https://www.congress.gov/', 'Bill and committee materials', 'official', 'Congress.gov', true, ["pqc","cryptography","nist","migration"]),
    s('cong-40-pqc-crypto-src-2', 'NIST PQC', 'https://csrc.nist.gov/projects/post-quantum-cryptography', 'PQC standardization public project pages.', 'official', 'NIST PQC', true, ["pqc","cryptography","nist","migration"]),
    s('cong-40-pqc-crypto-src-3', 'Congress.gov search: post-quantum cryptography', 'https://www.congress.gov/search?q=%7B%22source%22%3A%22legislation%22%2C%22search%22%3A%22post-quantum%20cryptography%22%7D', 'Legislation search for this desk family', 'official', 'Congress.gov', true, ['legislation']),
    s('cong-40-pqc-crypto-src-4', 'GAO', 'https://www.gao.gov/', 'Independent evaluations', 'official', 'GAO', true, ['audit']),
    s('cong-40-pqc-crypto-src-5', 'CRS', 'https://crsreports.congress.gov/', 'Legislative analysis', 'official', 'CRS', true, ['crs']),
  ],
}
