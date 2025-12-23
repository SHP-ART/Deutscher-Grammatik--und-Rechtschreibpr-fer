#!/bin/bash

# Farben für bessere Lesbarkeit
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Textassistent - Start Script${NC}"
echo "======================================================================"

# Prüfe ob node_modules existieren
if [ ! -d "node_modules" ] || [ ! -d "server/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Dependencies fehlen. Installiere Pakete...${NC}"
    npm run install:all
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Installation fehlgeschlagen!${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Dependencies installiert${NC}"
fi

# Prüfe und beende laufende Prozesse auf Port 5173 (Frontend)
if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠️  Port 5173 ist belegt. Beende Prozess...${NC}"
    lsof -ti:5173 | xargs kill -9 2>/dev/null
    sleep 1
fi

# Prüfe und beende laufende Prozesse auf Port 3001 (Backend)
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${YELLOW}⚠️  Port 3001 ist belegt. Beende Prozess...${NC}"
    lsof -ti:3001 | xargs kill -9 2>/dev/null
    sleep 1
fi

# Prüfe ob .env existiert
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env Datei fehlt!${NC}"
    if [ -f ".env.example" ]; then
        echo -e "${BLUE}📝 Erstelle .env aus .env.example...${NC}"
        cp .env.example .env
        echo -e "${YELLOW}⚠️  Bitte GEMINI_API_KEY in .env eintragen!${NC}"
        echo -e "${BLUE}ℹ️  Öffne .env und trage deinen API-Key ein.${NC}"
        read -p "Drücke Enter, wenn du fertig bist..."
    else
        echo -e "${RED}❌ Keine .env.example gefunden!${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Ports sind frei${NC}"
echo -e "${BLUE}🚀 Starte Textassistent...${NC}"
echo ""
echo -e "${GREEN}📱 Frontend:${NC} http://localhost:5173/"
echo -e "${GREEN}⚙️  Backend:${NC}  http://localhost:3001/"
echo ""
echo -e "${BLUE}ℹ️  Funktionen:${NC}"
echo -e "   • Grammatik- und Rechtschreibprüfung"
echo -e "   • Text als E-Mail formatieren"
echo -e "   • KFZ-Werkstatt Rechnungstext"
echo -e "   • Google-Recherche mit Quellen"
echo -e "   • Gemini 2.5 & 3.0 Flash Modelle"
echo ""
echo -e "${YELLOW}💡 Tipp: Drücke Ctrl+C zum Beenden${NC}"
echo "======================================================================"
echo ""

# Starte die Anwendung
npm run dev:all
