#!/bin/bash

# Setup-Script für Deutscher Grammatik- und Rechtschreibprüfer
# Ohne Docker-Deployment

set -e

echo "🚀 Setup: Deutscher Grammatik- und Rechtschreibprüfer"
echo "=================================================="
echo ""

# Farben
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Node.js Version prüfen
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js ist nicht installiert!${NC}"
    echo "Bitte installiere Node.js 20+ von https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js Version zu alt ($(node -v))${NC}"
    echo "Bitte installiere Node.js 20+ von https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v) gefunden${NC}"

# .env erstellen falls nicht vorhanden
if [ ! -f .env ]; then
    echo ""
    echo -e "${YELLOW}⚙️  Erstelle .env Datei...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env erstellt${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  WICHTIG: Bitte trage deinen GEMINI_API_KEY in .env ein!${NC}"
    echo ""
    read -p "Drücke Enter zum Fortfahren, nachdem du den API Key eingetragen hast..."
else
    echo -e "${GREEN}✓ .env existiert bereits${NC}"
fi

# Dependencies installieren
echo ""
echo "📦 Installiere Dependencies..."
echo ""

echo "→ Frontend Dependencies..."
npm install

echo ""
echo "→ Backend Dependencies..."
cd server && npm install && cd ..

echo ""
echo -e "${GREEN}✓ Dependencies installiert${NC}"

# Bauen
echo ""
echo "🔨 Baue Projekt..."
echo ""

echo "→ Frontend Build..."
npm run build

echo ""
echo "→ Backend Build..."
npm run build:server

echo ""
echo -e "${GREEN}✓ Build abgeschlossen${NC}"

# Logs-Verzeichnis erstellen
mkdir -p logs

# PM2 installieren falls gewünscht
echo ""
read -p "Möchtest du PM2 für Prozessmanagement installieren? (empfohlen) [y/N]: " install_pm2

if [[ $install_pm2 =~ ^[Yy]$ ]]; then
    echo ""
    echo "📦 Installiere PM2 global..."
    if command -v pm2 &> /dev/null; then
        echo -e "${GREEN}✓ PM2 ist bereits installiert${NC}"
    else
        npm install -g pm2
        echo -e "${GREEN}✓ PM2 installiert${NC}"
    fi

    echo ""
    echo "🚀 Starte mit PM2..."
    npm run pm2:start

    echo ""
    echo -e "${GREEN}✓ Server läuft mit PM2!${NC}"
    echo ""
    echo "Nützliche PM2 Befehle:"
    echo "  npm run pm2:status   - Status anzeigen"
    echo "  npm run pm2:logs     - Logs anzeigen"
    echo "  npm run pm2:restart  - Neustart"
    echo "  npm run pm2:stop     - Stoppen"
    echo ""
    echo "PM2 beim Systemstart aktivieren:"
    echo "  pm2 startup"
    echo "  pm2 save"
else
    echo ""
    echo "Server manuell starten mit:"
    echo "  npm start"
fi

echo ""
echo "=================================================="
echo -e "${GREEN}✅ Setup abgeschlossen!${NC}"
echo "=================================================="
echo ""
echo "Die App ist erreichbar unter: http://localhost:3001"
echo ""
echo "Weitere Infos in README.md"
echo ""
