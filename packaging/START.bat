@echo off
setlocal
title AOS Nexus LPIN v2
cd /d "%~dp0"

echo.
echo  AOS Nexus LPIN v2
echo  Modular intelligence platform · evidence-gated · Layer-0
echo  http://localhost:5173
echo.

where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo [ERROR] npm.cmd not found. Run INSTALL.bat first.
  pause
  exit /b 1
)

if not exist "node_modules\" (
  echo node_modules missing — running npm.cmd install...
  call npm.cmd install
  if errorlevel 1 (
    echo Install failed.
    pause
    exit /b 1
  )
)

start "" "http://localhost:5173/"
call npm.cmd run dev
if errorlevel 1 (
  echo.
  echo Dev server exited with an error.
  pause
)
endlocal
