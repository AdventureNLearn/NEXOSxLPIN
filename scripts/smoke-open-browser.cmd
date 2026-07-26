@echo off
REM Smoke launcher path: open-browser waits for HTTP then opens Edge
setlocal EnableExtensions
cd /d "%~dp0\.."

echo === SMOKE open-browser.cmd ===
echo Product root: %CD%

if not exist "open-browser.cmd" (echo FAIL missing open-browser.cmd & exit /b 1)
if not exist "START.bat" (echo FAIL missing START.bat & exit /b 1)

findstr /C:"Waiting for NEXOSxLPIN" open-browser.cmd >nul || (echo FAIL open-browser must wait for server & exit /b 1)
findstr /C:"open-browser.cmd" START.bat >nul || (echo FAIL START must call open-browser & exit /b 1)
findstr /C:"Invoke-WebRequest" open-browser.cmd >nul || (echo FAIL open-browser must health-check HTTP & exit /b 1)

echo PASS: START wires open-browser
echo PASS: open-browser health-checks before launch

REM If server already up, open-browser should return quickly with 0
call "%CD%\open-browser.cmd"
if errorlevel 1 (
  echo FAIL: open-browser exit %ERRORLEVEL% — is Vite running?
  echo Start with START.bat and leave the console open.
  exit /b 1
)
echo PASS: open-browser exit 0
echo === SMOKE_OK ===
exit /b 0
