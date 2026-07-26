$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath
Write-Host "AOS Nexus LPIN v2" -ForegroundColor Cyan
Write-Host "Modular intelligence platform · evidence-gated · Layer-0" -ForegroundColor DarkGray
Write-Host "http://localhost:5173" -ForegroundColor Green
if (-not (Test-Path 'node_modules')) {
  Write-Host "Installing dependencies..." -ForegroundColor Yellow
  cmd /c "npm.cmd install"
}
Start-Process "http://localhost:5173/"
cmd /c "npm.cmd run dev"
