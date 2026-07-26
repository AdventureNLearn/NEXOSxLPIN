# Creates Desktop shortcut: AOS Nexus LPIN v2.1 (Windows)
$ErrorActionPreference = 'Stop'

$repoRoot = $null
foreach ($candidate in @('C:\Nexus\v2.1', 'C:\Nexus\dev')) {
  if (Test-Path (Join-Path $candidate 'package.json')) {
    $repoRoot = $candidate
    break
  }
}

if (-not $repoRoot) {
  $pkgDir = Split-Path -Parent $PSScriptRoot
  $repoRoot = $pkgDir
  if (-not (Test-Path (Join-Path $repoRoot 'package.json'))) {
    $repoRoot = Split-Path -Parent $pkgDir
  }
}

$startCmd = Join-Path $repoRoot 'START.bat'
if (-not (Test-Path $startCmd)) {
  $startCmd = Join-Path $repoRoot 'start-nexus.cmd'
}
if (-not (Test-Path $startCmd)) {
  throw "Launcher not found under $repoRoot"
}

$icon = Join-Path $repoRoot 'compass-rose.ico'
if (-not (Test-Path $icon)) {
  $icon = Join-Path $repoRoot 'icons\compass-rose.ico'
}

function Get-DesktopPaths {
  @(
    [Environment]::GetFolderPath('Desktop'),
    (Join-Path $env:USERPROFILE 'OneDrive\Desktop'),
    (Join-Path $env:USERPROFILE 'Desktop')
  ) | Where-Object { $_ -and (Test-Path $_) } | Select-Object -Unique
}

$desktops = @(Get-DesktopPaths)
if ($desktops.Count -eq 0) { throw 'Desktop folder not found' }

$sh = New-Object -ComObject WScript.Shell
$created = @()
foreach ($desktop in $desktops) {
  foreach ($old in @(
      'AOS Nexus LPIN v2.lnk',
      'AOS Nexus LPIN v2.1.lnk',
      'Nexus RSD Compliance.lnk',
      'Nexus.lnk'
    )) {
    $p = Join-Path $desktop $old
    if (Test-Path $p) { Remove-Item -LiteralPath $p -Force -ErrorAction SilentlyContinue }
  }

  $lnkPath = Join-Path $desktop 'AOS Nexus LPIN v2.1.lnk'
  $s = $sh.CreateShortcut($lnkPath)
  $s.TargetPath = $startCmd
  $s.WorkingDirectory = $repoRoot
  $s.WindowStyle = 1
  $s.Description = 'AOS Nexus LPIN v2.1 — investigations, tiled workspace, Layer-0 export'
  if ((Test-Path $icon) -and $icon.ToLower().EndsWith('.ico')) {
    $s.IconLocation = "$icon,0"
  }
  $s.Save()
  $created += $lnkPath
}

Write-Host "Shortcut(s):"
$created | ForEach-Object { Write-Host "  $_" }
Write-Host "Target:   $startCmd"
Write-Host "WorkDir:  $repoRoot"
