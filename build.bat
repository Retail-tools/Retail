@echo off
REM Regenerates data/tools.js from the tools\*\tool.json manifests.
cd /d "%~dp0"
node scripts\build-tools.js
pause
