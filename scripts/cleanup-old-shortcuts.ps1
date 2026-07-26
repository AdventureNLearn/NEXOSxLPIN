# Remove legacy Nexus desktop shortcuts; keep only AOS Nexus LPIN v2 after recreate
$ErrorActionPreference = 'Continue'

function Get-DesktopPaths {
  @(
    [Environment]::GetFolderPath('Desktop'),
    (Join-Path $env:USERPROFILE 'OneDrive\Desktop'),
    (Join-Path $env:USERPROFILE 'Desktop')
  ) | Where-Object { $_ -and (Test-Path $_) } | Select-Object -Unique
}

$patterns = @(
  'Nexus RSD Compliance.lnk',
  'Nexus OS*.lnk',
  'Nexus.lnk',
  'AOS Nexus LPIN v2.lnk'  # remove before recreate for clean v2
)

$removed = @()
foreach ($desktop in Get-DesktopPaths) {
  foreach ($pat in $patterns) {
    Get-ChildItem -Path $desktop -Filter $pat -ErrorAction SilentlyContinue | ForEach-Object {
      Remove-Item -LiteralPath $_.FullName -Force
      $removed += $_.FullName
    }
  }
}

if ($removed.Count -eq 0) {
  Write-Host "No matching old shortcuts found."
} else {
  Write-Host "Removed:"
  $removed | ForEach-Object { Write-Host "  $_" }
}
