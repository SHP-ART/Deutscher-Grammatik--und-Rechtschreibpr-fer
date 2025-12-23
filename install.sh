#!/bin/bash

# Farben für bessere Lesbarkeit
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}║           🚀 Textassistent - Installation                  ║${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Funktion zum Prüfen von Befehlen
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 1. Prüfe Node.js Installation
echo -e "${BLUE}[1/6] Prüfe Node.js Installation...${NC}"
if ! command_exists node; then
    echo -e "${RED}❌ Node.js ist nicht installiert!${NC}"
    echo -e "${YELLOW}Bitte installiere Node.js (Version 18 oder höher):${NC}"
    echo -e "   Ubuntu/Debian: ${BLUE}curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt-get install -y nodejs${NC}"
    echo -e "   CentOS/RHEL:   ${BLUE}curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash - && sudo yum install -y nodejs${NC}"
    echo -e "   macOS:         ${BLUE}brew install node${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js Version zu alt! Benötigt: v18+, Installiert: v${NODE_VERSION}${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) gefunden${NC}"

# 2. Prüfe npm Installation
echo -e "${BLUE}[2/6] Prüfe npm Installation...${NC}"
if ! command_exists npm; then
    echo -e "${RED}❌ npm ist nicht installiert!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ npm $(npm -v) gefunden${NC}"

# 3. Prüfe Git Installation (optional)
echo -e "${BLUE}[3/6] Prüfe Git Installation...${NC}"
if ! command_exists git; then
    echo -e "${YELLOW}⚠️  Git ist nicht installiert (optional)${NC}"
else
    echo -e "${GREEN}✅ Git $(git --version | cut -d' ' -f3) gefunden${NC}"
fi

# 4. Installiere Dependencies
echo -e "${BLUE}[4/6] Installiere Dependencies...${NC}"
echo -e "${YELLOW}Dies kann einige Minuten dauern...${NC}"

npm run install:all
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Installation der Dependencies fehlgeschlagen!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependencies erfolgreich installiert${NC}"

# 5. Erstelle .env Datei
echo -e "${BLUE}[5/6] Konfiguriere Umgebungsvariablen...${NC}"
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo -e "${GREEN}✅ .env Datei erstellt${NC}"
        echo -e "${YELLOW}⚠️  WICHTIG: Bitte trage deinen GEMINI_API_KEY in die .env Datei ein!${NC}"
        echo ""
        echo -e "${BLUE}Wie du einen API-Key erhältst:${NC}"
        echo -e "   1. Besuche: ${BLUE}https://aistudio.google.com/app/apikey${NC}"
        echo -e "   2. Erstelle einen neuen API-Key"
        echo -e "   3. Trage ihn in die .env Datei ein:"
        echo -e "      ${YELLOW}GEMINI_API_KEY=dein_api_key_hier${NC}"
        echo ""
        read -p "Drücke Enter, wenn du den API-Key eingetragen hast..."
    else
        echo -e "${YELLOW}⚠️  Erstelle .env Datei manuell${NC}"
        cat > .env << EOF
# Backend Server Configuration
GEMINI_API_KEY=
PORT=3001
NODE_ENV=production

# Frontend Configuration (Optional - für Entwicklung)
VITE_API_URL=http://localhost:3001
EOF
        echo -e "${GREEN}✅ .env Datei erstellt${NC}"
        echo -e "${YELLOW}⚠️  Bitte trage deinen GEMINI_API_KEY ein!${NC}"
        read -p "Drücke Enter, wenn du fertig bist..."
    fi
else
    echo -e "${GREEN}✅ .env Datei existiert bereits${NC}"
fi

# 6. Prüfe/Installiere PM2 (für Production)
echo -e "${BLUE}[6/6] Prüfe PM2 Installation...${NC}"
if ! command_exists pm2; then
    echo -e "${YELLOW}⚠️  PM2 ist nicht installiert${NC}"
    read -p "Möchtest du PM2 global installieren? (empfohlen für Production) [y/N]: " install_pm2
    if [[ $install_pm2 =~ ^[Yy]$ ]]; then
        sudo npm install -g pm2
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ PM2 erfolgreich installiert${NC}"
        else
            echo -e "${YELLOW}⚠️  PM2 Installation fehlgeschlagen (nicht kritisch)${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  PM2 übersprungen${NC}"
    fi
else
    echo -e "${GREEN}✅ PM2 $(pm2 -v) gefunden${NC}"
fi

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}║              ✅ Installation abgeschlossen!                 ║${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}Nächste Schritte:${NC}"
echo ""
echo -e "${BLUE}📝 Entwicklungsmodus starten:${NC}"
echo -e "   ${YELLOW}./start.sh${NC}  oder  ${YELLOW}npm run dev:all${NC}"
echo ""
echo -e "${BLUE}🏗️  Production Build erstellen:${NC}"
echo -e "   ${YELLOW}npm run build:all${NC}"
echo ""
echo -e "${BLUE}🚀 Production mit PM2 starten:${NC}"
echo -e "   ${YELLOW}npm run pm2:start${NC}"
echo ""
echo -e "${BLUE}📊 PM2 Status anzeigen:${NC}"
echo -e "   ${YELLOW}npm run pm2:status${NC}"
echo ""
echo -e "${BLUE}📋 PM2 Logs anzeigen:${NC}"
echo -e "   ${YELLOW}npm run pm2:logs${NC}"
echo ""
echo -e "${GREEN}Die Anwendung läuft dann auf:${NC}"
echo -e "   🌐 http://localhost:3001"
echo ""
