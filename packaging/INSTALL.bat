@echo off
setlocal EnableExtensions
title AOS Nexus LPIN v2 — Install
cd /d "%~dp0"

echo.
echo  ============================================================
echo   AOS Nexus LPIN v2 — One-shot install (Windows)
echo  ============================================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js not found on PATH.
  echo         Install LTS from https://nodejs.org/ then re-run INSTALL.bat
  echo.
  pause
  exit /b 1
)

where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo [ERROR] npm.cmd not found. Reinstall Node.js LTS with npm included.
  pause
  exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do set NODEVER=%%v
echo [OK] Node %NODEVER%
echo.

echo [1/4] Installing dependencies (npm.cmd install^)...
call npm.cmd install
if errorlevel 1 (
  echo [ERROR] npm install failed.
  pause
  exit /b 1
)
echo [OK] Dependencies installed.
echo.

echo [2/4] Production build (npm.cmd run build^)...
call npm.cmd run build
if errorlevel 1 (
  echo [WARN] Build failed — you can still use npm.cmd run dev
) else (
  echo [OK] Build complete (dist\ ready for preview / iOS host^).
)
echo.

echo [3/4] Creating Desktop shortcut "AOS Nexus LPIN v2"...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\create-desktop-shortcut.ps1"
if errorlevel 1 (
  echo [WARN] Shortcut creation failed — use START.bat instead.
) else (
  echo [OK] Desktop shortcut ready.
)
echo.

echo [4/4] Done.
echo.
echo  ------------------------------------------------------------
echo   Launch:
echo     • Desktop: "AOS Nexus LPIN v2"
echo     • Or START.bat / start-nexus.cmd
echo     • Dev:  http://localhost:5173
echo     • Prod: npm.cmd run preview  → http://localhost:4173
echo  ------------------------------------------------------------
echo.
set /p LAUNCH="Start AOS Nexus LPIN v2 now? [Y/n] "
if /i "%LAUNCH%"=="n" goto end
if /i "%LAUNCH%"=="N" goto end
call "%~dp0START.bat"
goto end

:end
echo.
pause
endlocal
