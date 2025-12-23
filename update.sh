#!/bin/bash

# Update-Skript für Textassistent
# Version 1.13.0

# Farben für bessere Lesbarkeit
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}║              🔄 Textassistent - Update                     ║${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Prüfe ob Git installiert ist
if ! command -v git >/dev/null 2>&1; then
    echo -e "${RED}❌ Git ist nicht installiert!${NC}"
    exit 1
fi

# Prüfe ob wir in einem Git Repository sind
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Kein Git Repository gefunden!${NC}"
    exit 1
fi

# Backup der .env Datei
if [ -f ".env" ]; then
    echo -e "${BLUE}[1/6] Sichere .env Datei...${NC}"
    cp .env .env.backup
    echo -e "${GREEN}✅ Backup erstellt (.env.backup)${NC}"
else
    echo -e "${YELLOW}⚠️  Keine .env Datei gefunden${NC}"
fi

# Git Pull
echo -e "${BLUE}[2/6] Hole neueste Änderungen von GitHub...${NC}"
git pull

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Fehler beim Git Pull${NC}"
    echo -e "${YELLOW}Tipp: Prüfe ob lokale Änderungen existieren: git status${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Git Pull erfolgreich${NC}"

# Installiere Dependencies
echo -e "${BLUE}[3/6] Installiere Dependencies...${NC}"
echo -e "${YELLOW}Dies kann einige Minuten dauern...${NC}"
npm run install:all

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Fehler bei der Installation${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Dependencies installiert${NC}"

# Build Frontend und Backend
echo -e "${BLUE}[4/6] Baue Projekt...${NC}"
npm run build:all

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Fehler beim Build${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build erfolgreich${NC}"

# Stelle .env wieder her (falls überschrieben)
if [ -f ".env.backup" ]; then
    echo -e "${BLUE}[5/6] Stelle .env Datei wieder her...${NC}"
    # Nur wiederherstellen wenn .env fehlt oder leer ist
    if [ ! -s ".env" ]; then
        cp .env.backup .env
        echo -e "${GREEN}✅ .env wiederhergestellt${NC}"
    else
        echo -e "${GREEN}✅ .env bereits vorhanden${NC}"
    fi
fi

# PM2 Restart
echo -e "${BLUE}[6/6] Starte Anwendung neu...${NC}"

# Prüfe ob PM2 installiert ist
if command -v pm2 >/dev/null 2>&1; then
    # Versuche PM2 Restart
    pm2 restart textassistent 2>/dev/null

    if [ $? -ne 0 ]; then
        echo -e "${YELLOW}⚠️  Prozess 'textassistent' nicht gefunden - versuche Neustart...${NC}"
        npm run pm2:start

        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ PM2 Start fehlgeschlagen${NC}"
            exit 1
        fi
    fi

    echo -e "${GREEN}✅ Anwendung neu gestartet${NC}"

    # Zeige PM2 Status
    echo ""
    echo -e "${BLUE}📊 PM2 Status:${NC}"
    pm2 status

else
    echo -e "${YELLOW}⚠️  PM2 ist nicht installiert${NC}"
    echo -e "${YELLOW}Starte Anwendung manuell mit: npm start${NC}"
fi

# Aufräumen
if [ -f ".env.backup" ]; then
    echo ""
    echo -e "${BLUE}💾 Backup behalten oder löschen?${NC}"
    read -p "Backup löschen? [y/N]: " delete_backup
    if [[ $delete_backup =~ ^[Yy]$ ]]; then
        rm .env.backup
        echo -e "${GREEN}✅ Backup gelöscht${NC}"
    else
        echo -e "${YELLOW}💾 Backup behalten: .env.backup${NC}"
    fi
fi

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}║              ✅ Update erfolgreich abgeschlossen!           ║${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}🌐 Die Anwendung läuft auf:${NC} http://localhost:3001"
echo ""
echo -e "${BLUE}Nützliche Befehle:${NC}"
echo -e "   ${YELLOW}pm2 logs${NC}       - Logs anzeigen"
echo -e "   ${YELLOW}pm2 status${NC}     - Status prüfen"
echo -e "   ${YELLOW}pm2 restart${NC}    - Neu starten"
echo -e "   ${YELLOW}pm2 stop${NC}       - Stoppen"
echo ""
