<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Deutscher Grammatik- und Rechtschreibprüfer

Optimiert für Homeserver-Deployment mit Backend-API, Caching und Rate-Limiting.

## Features

### 🚀 Funktionalität
- Deutsche Grammatik- und Rechtschreibprüfung mit Google Gemini AI
- Optionale **GROSSBUCHSTABEN-Ausgabe** per Checkbox
- Backend-Server mit Express für sichere API-Key-Verwaltung
- Intelligentes Caching (1 Stunde TTL) für häufige Anfragen
- Rate-Limiting (30 Anfragen/15 Min pro IP)
- PM2-Support für Prozessmanagement
- Responsive React-Frontend

### 🎨 Modernes Design
- **Animierter Gradient-Header** (Indigo → Purple → Pink)
- **Glassmorphismus-Effekte** mit Backdrop-Filter
- **Wellen-Animation** am Header-Ende
- **3-Ring Loading-Spinner** mit Farbverläufen
- **Hover-Effekte** und flüssige Übergänge
- **Farbcodierte Textbereiche** (Indigo für Input, Grün für Output)
- **Dunkler Gradient-Footer** mit animierten Elementen

## Quick Start

**Voraussetzungen:** Node.js 20+

```bash
# Automatisches Setup-Script ausführen
./setup.sh
```

Das Script führt automatisch aus:
- Dependencies installieren
- `.env` erstellen
- Projekt bauen
- Optional: PM2 installieren und starten

Öffne http://localhost:3001

## Manuelle Installation

Siehe [INSTALL.md](INSTALL.md) für detaillierte Schritt-für-Schritt-Anleitung.

## Lokale Entwicklung

**Voraussetzungen:** Node.js 20+

```bash
# Dependencies installieren
npm run install:all

# Frontend & Backend parallel starten (empfohlen)
NODE_ENV=development npm run dev:all

# Frontend: http://localhost:5173
# Backend:  http://localhost:3001
```

**Hinweis:** In der Entwicklung laufen Frontend und Backend auf separaten Ports für Hot-Reload und schnellere Entwicklung.

## Production Deployment

```bash
# Alles bauen
npm run build:all

# Mit PM2 starten (empfohlen)
npm run pm2:start

# Oder ohne PM2
npm start
```

Siehe [INSTALL.md](INSTALL.md) und [DEPLOYMENT.md](DEPLOYMENT.md) für Details.

## Architektur

### Backend
- **Framework**: Express + Node.js + TypeScript
- **AI-Integration**: Google Gemini 2.0 Flash API
- **Cache**: node-cache (In-Memory, 1h TTL)
- **Security**: Helmet.js, CORS, Rate-Limiting
- **Environment**: dotenv für Konfiguration

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4 mit Custom Animations
- **Features**:
  - Responsive Design
  - Real-time Hot-Reload
  - Moderne UI mit Gradienten und Animationen
  - Glassmorphismus-Effekte

## Ressourcenverbrauch

- RAM: ~100-200 MB
- CPU: Minimal
- Storage: ~150 MB (mit Dependencies)

View original app in AI Studio: https://ai.studio/apps/drive/1zdoy2aJyI5aRdWh4BmCEXh8laSw1gDkd
