# NEXOSxLPIN desktop shortcuts - portable
# Resolves product root from this script location (.../scripts -> parent).
# Uses wscript + launch-nexos.vbs when present to avoid broken .bat TargetPath launches.
$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Split-Path -Parent $scriptDir
if (-not (Test-Path (Join-Path $repoRoot 'START.bat'))) {
  if (Test-Path (Join-Path (Get-Location) 'START.bat')) {
    $repoRoot = (Get-Location).Path
  } else {
    throw 'NEXOSxLPIN product root not found (expected START.bat next to scripts/).'
  }
}

$cmdExe = Join-Path $env:SystemRoot 'System32\cmd.exe'
$vbs = Join-Path $repoRoot 'launch-nexos.vbs'
$icon = $null
foreach ($name in @('nexos-lpin-v140.ico', 'nexos-lpin.ico', 'nexos-lpin-v111.ico', 'compass-rose.ico')) {
  $c = Join-Path $repoRoot $name
  if (Test-Path $c) { $icon = $c; break }
}

$localDeskCandidates = @(
  (Join-Path $env:SystemDrive 'LocalDesktop'),
  (Join-Path $env:USERPROFILE 'LocalDesktop')
)
$localDesk = $null
foreach ($d in $localDeskCandidates) {
  try {
    New-Item -ItemType Directory -Force -Path $d | Out-Null
    $localDesk = $d
    break
  } catch { }
}

$targets = New-Object System.Collections.Generic.List[string]
if ($localDesk) { [void]$targets.Add($localDesk) }
$userDesk = [Environment]::GetFolderPath('Desktop')
if ($userDesk -and (Test-Path $userDesk) -and -not $targets.Contains($userDesk)) {
  [void]$targets.Add($userDesk)
}
# Public desktop is optional; skip if not writable
$publicDesk = Join-Path $env:PUBLIC 'Desktop'
if ($publicDesk -and (Test-Path $publicDesk) -and -not $targets.Contains($publicDesk)) {
  try {
    $testFile = Join-Path $publicDesk ('.nexos-write-test-' + [guid]::NewGuid().ToString('N'))
    [IO.File]::WriteAllText($testFile, 'ok')
    Remove-Item -LiteralPath $testFile -Force -ErrorAction SilentlyContinue
    [void]$targets.Add($publicDesk)
  } catch {
    Write-Host "WARN: skip non-writable Public Desktop"
  }
}
if ($targets.Count -eq 0) {
  throw 'No writable Desktop folder found for shortcuts.'
}

$sh = New-Object -ComObject WScript.Shell

function Remove-StaleShortcuts([string]$desktop) {
  foreach ($old in @(
      'AOS Nexus LPIN v2.lnk',
      'AOS Nexus LPIN v2.1.lnk',
      'Nexus RSD Compliance.lnk',
      'NEXOSxLPIN.lnk',
      'NEXOSxLPIN 1.3.lnk',
      'NEXOS LPIN.lnk',
      'NEXOSxLPIN 1.6.lnk'
    )) {
    $p = Join-Path $desktop $old
    if (Test-Path $p) { Remove-Item -LiteralPath $p -Force -ErrorAction SilentlyContinue }
  }
}

function New-NexosShortcut([string]$desktop) {
  try {
    Remove-StaleShortcuts $desktop
    $lnkPath = Join-Path $desktop 'NEXOSxLPIN.lnk'
    $s = $sh.CreateShortcut($lnkPath)

    if (Test-Path $vbs) {
      $s.TargetPath = 'wscript.exe'
      $s.Arguments = '"' + $vbs + '"'
      $s.WorkingDirectory = $repoRoot
    } else {
      $s.TargetPath = $cmdExe
      $s.Arguments = '/k cd /d "' + $repoRoot + '" && call START.bat'
      $s.WorkingDirectory = $repoRoot
    }

    $s.WindowStyle = 1
    $s.Description = 'NEXOSxLPIN evidence-first civic verification workbench'
    if ($icon -and (Test-Path $icon) -and $icon.ToLower().EndsWith('.ico')) {
      $s.IconLocation = ($icon + ',0')
    }
    $s.Save()
    Write-Host ("Shortcut: " + $lnkPath)
    Write-Host ("  Target: " + $s.TargetPath + " " + $s.Arguments)
    return $true
  } catch {
    Write-Host ("WARN: could not write shortcut under " + $desktop + " - " + $_.Exception.Message)
    return $false
  }
}

$ok = 0
foreach ($desk in $targets) {
  if (New-NexosShortcut $desk) { $ok++ }
}
if ($ok -lt 1) {
  throw 'No desktop shortcuts could be written.'
}

if ($localDesk) {
  $localOnly = @(
    @{
      Name = 'Grok Build.lnk'
      Target = Join-Path $env:USERPROFILE '.grok\launch-grok-build.cmd'
      Work = Join-Path $env:USERPROFILE '.grok'
      Desc = 'Optional coding agent launcher'
    },
    @{
      Name = 'Hermes Agent.lnk'
      Target = Join-Path $env:LOCALAPPDATA 'Programs\hermes-desktop\hermes-agent.exe'
      Work = Join-Path $env:LOCALAPPDATA 'Programs\hermes-desktop'
      Desc = 'Optional agent desktop'
    }
  )
  foreach ($item in $localOnly) {
    if (Test-Path $item.Target) {
      $lnk = Join-Path $localDesk $item.Name
      $s = $sh.CreateShortcut($lnk)
      $s.TargetPath = $item.Target
      $s.WorkingDirectory = $item.Work
      $s.Description = $item.Desc
      $s.Save()
      Write-Host ("Optional tool: " + $lnk)
    }
  }

  $readmeLines = @(
    'Local launcher folder',
    '=====================',
    'NEXOSxLPIN.lnk  ->  product START.bat (via launch-nexos.vbs when present)',
    ('Product root:   ' + $repoRoot),
    'App URL:        http://127.0.0.1:5173',
    '',
    'Install: double-click INSTALL.bat in the product root (requires Node.js LTS).',
    'Docs:    docs/INSTALL.md | docs/OPEN_DEVELOPMENT.md | docs/DOC_INDEX.md',
    '',
    'PII: do not put personal data, client names, or secrets into sample packs.'
  )
  Set-Content -Path (Join-Path $localDesk 'NEXOSxLPIN-README.txt') -Value $readmeLines -Encoding UTF8
}

Write-Host ("Product: " + $repoRoot)
Write-Host ("Shortcuts written: " + $ok + " location(s)")
