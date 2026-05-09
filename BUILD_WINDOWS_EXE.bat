@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo  D^&D 2024 Combat Tracker - EXE build
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

echo Windows EXE keszitese...
call npm run electron:build:win
if errorlevel 1 (
  echo.
  echo HIBA: az EXE build sikertelen.
  pause
  exit /b 1
)

echo.
echo Kesz. A telepito/portable EXE itt talalhato:
echo %cd%\release
echo.
explorer "%cd%\release"
pause
endlocal
