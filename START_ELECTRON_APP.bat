@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo  D^&D 2024 Combat Tracker - Electron app
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
  echo Elso inditas: npm csomagok telepitese...
  call npm install
  if errorlevel 1 (
    echo.
    echo HIBA: npm install sikertelen.
    pause
    exit /b 1
  )
)

echo Electron app inditasa...
call npm run electron:dev
if errorlevel 1 (
  echo.
  echo HIBA: az Electron app nem indult el.
  pause
  exit /b 1
)

endlocal
