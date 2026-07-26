@echo off
setlocal EnableExtensions
title NEXOSxLPIN 2.0.0-experimental
cd /d "%~dp0"

echo.
echo  ============================================================
echo   NEXOSxLPIN 2.0.0  ^|  Truth desk v2
echo   Product root: %CD%
echo   URL: http://127.0.0.1:5173/
echo  ============================================================
echo.

where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo [ERROR] npm.cmd not found on PATH.
  echo Install Node.js LTS from https://nodejs.org/ then re-run.
  echo.
  pause
  exit /b 1
)

if not exist "package.json" (
  echo [ERROR] package.json missing in %CD%
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo [1/2] npm.cmd install...
  call npm.cmd install
  if errorlevel 1 (
    echo [ERROR] npm install failed.
    pause
    exit /b 1
  )
)

REM Free port 5173 if a stale Vite/node is holding it
echo [OK] Ensuring port 5173 is free...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
  "$ErrorActionPreference='SilentlyContinue';" ^
  "$pids = @(Get-NetTCPConnection -LocalPort 5173 | Select-Object -ExpandProperty OwningProcess -Unique);" ^
  "foreach ($p in $pids) { if ($p -and $p -ne 0) { Stop-Process -Id $p -Force; Write-Host ('Freed PID ' + $p) } };" ^
  "Start-Sleep -Milliseconds 800;" ^
  "if (Get-NetTCPConnection -LocalPort 5173) { exit 2 } else { exit 0 }"
if errorlevel 2 (
  echo [WARN] Port 5173 still busy — trying once more...
  timeout /t 2 /nobreak >nul
  powershell.exe -NoProfile -ExecutionPolicy Bypass -Command ^
    "$ErrorActionPreference='SilentlyContinue';" ^
    "Get-NetTCPConnection -LocalPort 5173 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force };" ^
    "Start-Sleep -Seconds 1"
)

echo [OK] Starting Vite on 127.0.0.1:5173 ...
echo     Leave THIS window open while you use the app.
echo     Browser opens automatically when the server is ready.
echo.

REM Waiter polls until HTTP 200 then opens Edge
start "NEXOSxLPIN-browser" /min cmd.exe /c "call \"%~dp0open-browser.cmd\""

call npm.cmd run dev
set ERR=%ERRORLEVEL%
if not "%ERR%"=="0" (
  echo.
  echo [ERROR] Dev server exited with code %ERR%
  echo If you see "Port 5173 is already in use", close other NEXOSxLPIN windows and retry.
  pause
)
endlocal & exit /b %ERR%
