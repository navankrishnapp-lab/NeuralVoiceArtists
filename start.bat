@echo off
title Neural Voice Artist Launcher
echo Starting Neural Voice Artist Server...
start /b node server.js
timeout /t 2 >nul
echo Opening application in your browser...
start http://localhost:3000
exit