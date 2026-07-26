# Fix NEXOSxLPIN desktop shortcuts → current product root
$ErrorActionPreference = 'Stop'

$nexos = 'C:\Dev\products\NEXOSxLPIN'
if (-not (Test-Path (Join-Path $nexos 'START.bat'))) {
  throw "START.bat missing at $nexos"
}
if (-not (Test-Path (Join-Path $nexos 'package.json'))) {
  throw "package.json missing at $nexos"
}

$cmd = Join-Path $env:SystemRoot 'System32\cmd.exe'
$bat = Join-Path $nexos 'START.bat'
$vbs = Join-Path $nexos 'launch-nexos.vbs'

$icon = $null
foreach ($n in @('nexos-lpin-v140.ico', 'nexos-lpin.ico', 'nexos-lpin-v111.ico', 'compass-rose.ico')) {
  $c = Join-Path $nexos $n
  if (Test-Path $c) { $icon = $c; break }
}

# Harden VBS (relative to its own folder)
$vbsBody = @'
' NEXOSxLPIN launcher — always uses this script's folder
Option Explicit
Dim sh, fso, root, bat, cmdline
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
root = fso.GetParentFolderName(WScript.ScriptFullName)
bat = root & "\START.bat"
If Not fso.FileExists(bat) Then
  MsgBox "START.bat not found:" & vbCrLf & bat, vbCritical, "NEXOSxLPIN"
  WScript.Quit 1
End If
sh.CurrentDirectory = root
cmdline = "cmd.exe /k cd /d """ & root & """ && call ""START.bat"""
sh.Run cmdline, 1, False
'@
Set-Content -Path $vbs -Value $vbsBody -Encoding ASCII

$desks = New-Object System.Collections.Generic.List[string]
foreach ($d in @(
    'C:\LocalDesktop',
    'C:\Dev\Desktop',
    [Environment]::GetFolderPath('Desktop'),
    (Join-Path $env:USERPROFILE 'OneDrive\Desktop'),
    (Join-Path $env:USERPROFILE 'Desktop')
  )) {
  if ($d -and (Test-Path $d) -and -not $desks.Contains($d)) {
    [void]$desks.Add($d)
  }
}

$sh = New-Object -ComObject WScript.Shell
$argsLine = '/k cd /d "' + $nexos + '" && call "START.bat"'

foreach ($desk in $desks) {
  foreach ($old in @(
      'NEXOSxLPIN.lnk',
      'NEXOS LPIN.lnk',
      'NEXOSxLPIN 1.6.lnk',
      'NEXOSxLPIN 1.3.lnk',
      'AOS Nexus LPIN v2.lnk',
      'AOS Nexus LPIN v2.1.lnk'
    )) {
    $op = Join-Path $desk $old
    if (Test-Path $op) {
      Remove-Item -LiteralPath $op -Force -ErrorAction SilentlyContinue
    }
  }

  $lnk = Join-Path $desk 'NEXOSxLPIN.lnk'
  $s = $sh.CreateShortcut($lnk)
  # Most reliable on Windows: cmd.exe is always a real application
  $s.TargetPath = $cmd
  $s.Arguments = $argsLine
  $s.WorkingDirectory = $nexos
  $s.WindowStyle = 1
  $s.Description = 'NEXOSxLPIN 2.0.0-experimental | C:\Dev\products\NEXOSxLPIN'
  if ($icon) { $s.IconLocation = "$icon,0" }
  $s.Save()
  Write-Host "OK $lnk"
  Write-Host "  Target=$($s.TargetPath)"
  Write-Host "  Args=$($s.Arguments)"
  Write-Host "  Work=$($s.WorkingDirectory)"
}

$readme = @"
NEXOSxLPIN 2.0.0-experimental
Product: C:\Dev\products\NEXOSxLPIN
Shortcut: cmd.exe -> START.bat
URL: http://127.0.0.1:5173
Requires: Node.js LTS (npm.cmd on PATH)
"@
foreach ($desk in @('C:\LocalDesktop', 'C:\Dev\Desktop', (Join-Path $env:USERPROFILE 'OneDrive\Desktop'))) {
  if ($desk -and (Test-Path $desk)) {
    Set-Content -Path (Join-Path $desk 'NEXOSxLPIN-README.txt') -Value $readme -Encoding UTF8
  }
}

Write-Host '--- verify ---'
foreach ($desk in $desks) {
  $p = Join-Path $desk 'NEXOSxLPIN.lnk'
  if (Test-Path $p) {
    $s = $sh.CreateShortcut($p)
    $te = Test-Path $s.TargetPath
    Write-Host "$p targetExists=$te"
  }
}

# Smoke START.bat exists via cmd
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = $cmd
$psi.Arguments = '/c cd /d "' + $nexos + '" && if exist START.bat (echo START_OK) else (echo START_MISSING)'
$psi.RedirectStandardOutput = $true
$psi.UseShellExecute = $false
$psi.CreateNoWindow = $true
$proc = [Diagnostics.Process]::Start($psi)
$out = $proc.StandardOutput.ReadToEnd()
$proc.WaitForExit()
Write-Host "smoke: $($out.Trim())"
Write-Host "DONE product=$nexos"
