# One-time hygiene: ensure local C: work layout exists (non-destructive)
$ErrorActionPreference = 'Continue'

$dirs = @(
  'C:\NEXOSxLPIN',
  'C:\LocalDesktop',
  'C:\WorkLocal',
  'C:\NEXOSxLPIN\releases'
)
foreach ($d in $dirs) {
  New-Item -ItemType Directory -Force -Path $d | Out-Null
  Write-Host "OK $d"
}

$map = 'C:\NEXOSxLPIN\docs\GROK_BUILD_WORK_MAP.md'
if (Test-Path $map) {
  Copy-Item $map 'C:\WorkLocal\GROK_BUILD_WORK_MAP.md' -Force
  Copy-Item 'C:\NEXOSxLPIN\docs\LOCAL_STORAGE_MIGRATION.md' 'C:\WorkLocal\LOCAL_STORAGE_MIGRATION.md' -Force -ErrorAction SilentlyContinue
  Copy-Item $map 'C:\LocalDesktop\GROK_BUILD_WORK_MAP.md' -Force -ErrorAction SilentlyContinue
}

Write-Host ''
Write-Host 'Migration layout ready.'
Write-Host '  App:          C:\NEXOSxLPIN'
Write-Host '  Local launch: C:\LocalDesktop'
Write-Host '  Extra local:  C:\WorkLocal'
Write-Host '  Lineage:      C:\Nexus (archive - safe to leave)'
Write-Host ''
Write-Host 'OneDrive: keep personal files only; do not put node_modules or app trees there.'
