@echo off
setlocal EnableExtensions
title NEXOSxLPIN 1.6.1
cd /d "%~dp0"

echo.
echo  ============================================================
echo   NEXOSxLPIN 2.0.0  ^|  Truth desk v2  ^|  desks + SME + Massing
echo   Product root: %CD%
echo   http://127.0.0.1:5173
echo  ============================================================
echo.

where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo [ERROR] npm.cmd not found.
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

echo [OK] Starting Vite dev server...
echo     Browser will open shortly. Leave this window open.
echo.

REM Open browser after a short delay in a separate process (no empty title - avoids START bugs)
start "NEXOSxLPIN-browser" /min cmd.exe /c "timeout /t 4 /nobreak >nul & start http://127.0.0.1:5173/"

call npm.cmd run dev -- --host 127.0.0.1 --port 5173
set ERR=%ERRORLEVEL%
if not "%ERR%"=="0" (
  echo.
  echo [ERROR] Dev server exited with code %ERR%
  pause
)
endlocal & exit /b %ERR%
