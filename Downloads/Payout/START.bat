@echo off
title DOPAMINE-SERVICE
echo.
echo  ========================================
echo    DOPAMINE-SERVICE - Starting...
echo  ========================================
echo.

cd /d "%~dp0"

:: Kill any existing node server process to ensure clean startup
taskkill /F /IM node.exe >nul 2>&1

:: Start server in background
start /B node server.js

:: Wait 1 second for server to start
timeout /t 1 /nobreak >nul

:: Open browser
start http://localhost:8080

echo.
echo  [OK] Server is running at http://localhost:8080
echo  [OK] All data saves automatically to data.json
echo.
echo  Keep this window open while using the app.
echo.
pause >nul
