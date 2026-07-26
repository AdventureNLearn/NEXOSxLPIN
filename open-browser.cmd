@echo off
REM Wait until Vite answers on 127.0.0.1:5173, then open Edge/Chrome.
REM Fixes "refused to connect" when the browser opened before the server was ready.
setlocal EnableExtensions
set "URL=http://127.0.0.1:5173/"
set "MAX_WAIT=90"
set /a N=0

echo Waiting for NEXOSxLPIN at %URL% ...

:waitloop
powershell.exe -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:5173/' -UseBasicParsing -TimeoutSec 2; if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) { exit 0 } else { exit 1 } } catch { exit 1 }" >nul 2>&1
if not errorlevel 1 goto open

set /a N+=1
if %N% gtr %MAX_WAIT% (
  echo.
  echo [ERROR] Server did not respond within %MAX_WAIT%s.
  echo Keep the black NEXOSxLPIN console open. Then open:
  echo   %URL%
  echo.
  exit /b 1
)
REM Windows timeout (not bash)
ping -n 2 127.0.0.1 >nul
goto waitloop

:open
echo [OK] Server is up — opening browser...

if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
  start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" "%URL%"
  exit /b 0
)
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" (
  start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" "%URL%"
  exit /b 0
)
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" "%URL%"
  exit /b 0
)
if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" (
  start "" "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" "%URL%"
  exit /b 0
)

powershell.exe -NoProfile -Command "Start-Process '%URL%'"
exit /b 0
