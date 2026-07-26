@echo off
setlocal
title NEXOSxLPIN - Grok Build 1.4.0 Enterprise Hub
cd /d "%~dp0"
echo.
echo  ============================================================
echo   NEXOSxLPIN 1.4.0 — FULL OWNERSHIP BUILD
echo   Brief: %CD%\GROK_BUILD.md
echo   SME 252 ^| Cong 56 ^| Web/Mobile ^| Desktop deploy
echo  ============================================================
echo.
where grok >nul 2>&1
if errorlevel 1 (
  if exist "%USERPROFILE%\.grok\bin\grok.exe" (
    set "GROK=%USERPROFILE%\.grok\bin\grok.exe"
  ) else (
    echo [ERROR] grok not found
    pause
    exit /b 1
  )
) else set "GROK=grok"
"%GROK%" --prompt-file "%CD%\GROK_BUILD.md" --always-approve --max-turns 100 --cwd "%CD%"
set ERR=%ERRORLEVEL%
echo Exit %ERR% — expect docs\HANDOFF_RETURN_TO_HERMES.md
pause
endlocal & exit /b %ERR%
