@echo off
chcp 65001 >nul
cls

echo ============================================================
echo 🚀 Deutscher Grammatik- und Rechtschreibprüfer - Start
echo ============================================================
echo.

REM Prüfe ob node_modules existieren
if not exist "node_modules\" (
    echo ⚠️  Dependencies fehlen. Installiere Pakete...
    call npm run install:all
    if errorlevel 1 (
        echo ❌ Installation fehlgeschlagen!
        pause
        exit /b 1
    )
    echo ✅ Dependencies installiert
)

if not exist "server\node_modules\" (
    echo ⚠️  Server Dependencies fehlen. Installiere Pakete...
    call npm run install:all
    if errorlevel 1 (
        echo ❌ Installation fehlgeschlagen!
        pause
        exit /b 1
    )
    echo ✅ Dependencies installiert
)

REM Prüfe ob .env existiert
if not exist ".env" (
    echo ⚠️  .env Datei fehlt!
    if exist ".env.example" (
        echo 📝 Erstelle .env aus .env.example...
        copy .env.example .env >nul
        echo ⚠️  Bitte GEMINI_API_KEY in .env eintragen!
        echo ℹ️  Öffne .env und trage deinen API-Key ein.
        pause
    ) else (
        echo ❌ Keine .env.example gefunden!
        pause
        exit /b 1
    )
)

REM Beende laufende Node-Prozesse auf den Ports (optional)
echo 🧹 Beende alte Prozesse...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo ✅ Bereit zum Starten
echo 🚀 Starte Entwicklungsserver...
echo.
echo Frontend: http://localhost:5173/
echo Backend:  http://localhost:3001/
echo.
echo 💡 Tipp: Drücke Strg+C zum Beenden
echo ============================================================
echo.

REM Starte die Anwendung
call npm run dev:all
