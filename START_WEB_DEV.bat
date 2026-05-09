@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo  D^&D 2024 Combat Tracker - Web dev mode
echo ========================================
echo.

where npm >nul 2>nul
if errorlevel 1 (
  echo HIBA: A Node.js / npm nincs telepitve vagy nincs a PATH-ban.
  echo Toltsd le es telepitsd: https://nodejs.org/
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo npm csomagok telepitese...
  call npm install
  if errorlevel 1 (
    echo.
    echo HIBA: npm install sikertelen.
    pause
    exit /b 1
  )
)

echo Webes fejlesztoi mod inditasa...
call npm run dev
pause
endlocal
