@echo off
REM Robust launcher for desktop shortcuts — keeps a console, avoids cmd /c quote bugs
setlocal
cd /d "%~dp0"
title NEXOSxLPIN launcher
call "%~dp0START.bat"
if errorlevel 1 pause
endlocal
