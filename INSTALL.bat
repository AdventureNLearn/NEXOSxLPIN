@echo off
setlocal EnableExtensions
title NEXOSxLPIN — Install
cd /d "%~dp0"

echo.
echo  ============================================================
echo   NEXOSxLPIN — One-shot install
echo   Install to a LOCAL path (C:\...) for best speed
echo  ============================================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js not found. Install LTS from https://nodejs.org/
  pause
  exit /b 1
)
where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo [ERROR] npm.cmd not found.
  pause
  exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do set NODEVER=%%v
echo [OK] Node %NODEVER%
echo.

echo [1/3] npm.cmd install...
call npm.cmd install
if errorlevel 1 (
  echo [ERROR] install failed.
  pause
  exit /b 1
)

echo [2/3] npm.cmd run build...
call npm.cmd run build
if errorlevel 1 (
  echo [WARN] build failed — dev may still work
) else (
  echo [OK] dist ready
)

echo [3/3] Desktop shortcut...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\create-desktop-shortcut.ps1"
if errorlevel 1 (
  echo [WARN] shortcut failed — use START.bat
)

echo.
echo  Done. Launch START.bat  or  Desktop NEXOSxLPIN
echo  http://localhost:5173
echo.
set /p LAUNCH="Start now? [Y/n] "
if /i "%LAUNCH%"=="n" goto end
call "%~dp0START.bat"
:end
pause
endlocal
