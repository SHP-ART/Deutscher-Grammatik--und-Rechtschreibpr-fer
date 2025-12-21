#!/bin/bash

# Update-Skript für Deutscher Grammatik- und Rechtschreibprüfer
# Version 1.12.0

echo "🔄 Starte Update-Prozess..."

# Git Pull (funktioniert für öffentliche Repositories)
echo "📥 Hole neueste Änderungen von GitHub..."
git pull

if [ $? -ne 0 ]; then
    echo "❌ Fehler beim Git Pull"
    exit 1
fi

echo "✓ Git Pull erfolgreich"

# Installiere Dependencies
echo "📦 Installiere Dependencies..."
npm run install:all

if [ $? -ne 0 ]; then
    echo "❌ Fehler bei der Installation"
    exit 1
fi

echo "✓ Dependencies installiert"

# Build Frontend und Backend
echo "🔨 Baue Projekt..."
npm run build:all

if [ $? -ne 0 ]; then
    echo "❌ Fehler beim Build"
    exit 1
fi

echo "✓ Build erfolgreich"

# PM2 Restart (nur für Grammar Checker)
echo "🔄 Starte Anwendung neu..."
pm2 restart german-grammar-checker

if [ $? -ne 0 ]; then
    echo "⚠️  PM2 Restart fehlgeschlagen - versuche manuell zu starten"
    npm run pm2:start
fi

echo "✓ Anwendung neu gestartet"

# Zeige PM2 Status
echo ""
echo "📊 PM2 Status:"
pm2 status german-grammar-checker

echo ""
echo "✅ Update erfolgreich abgeschlossen!"
echo ""
echo "📝 Logs anzeigen: pm2 logs german-grammar-checker"
echo "📊 Status prüfen: pm2 status"
