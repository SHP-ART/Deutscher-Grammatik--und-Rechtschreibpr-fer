# Installation

## Schnellstart (Automatisch)

```bash
# 1. Setup-Script ausführen
./setup.sh

# 2. Gemini API Key in .env eintragen (wird vom Script abgefragt)

# Das war's! Script installiert und startet alles automatisch.
```

## Manuelle Installation

### Voraussetzungen

- Node.js 20+ ([Download](https://nodejs.org/))
- Git

### Schritt-für-Schritt Anleitung

#### 1. Repository klonen

```bash
git clone <repository-url>
cd Deutscher-Grammatik--und-Rechtschreibpr-fer
```

#### 2. Umgebungsvariablen konfigurieren

```bash
cp .env.example .env
```

Öffne `.env` und trage deinen Gemini API Key ein:

```env
GEMINI_API_KEY=dein_api_key_hier
PORT=3001
NODE_ENV=production
```

#### 3. Dependencies installieren

```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

Oder mit einem Befehl:

```bash
npm run install:all
```

#### 4. Projekt bauen

```bash
# Alles bauen
npm run build:all

# Oder einzeln:
npm run build          # Frontend
npm run build:server   # Backend
```

#### 5. Starten

**Option A: Einfacher Start**

```bash
npm start
```

**Option B: Mit PM2 (Empfohlen für Production)**

```bash
# PM2 installieren
npm install -g pm2

# Server starten
npm run pm2:start

# Status prüfen
npm run pm2:status

# Logs anzeigen
npm run pm2:logs
```

### PM2 Auto-Start beim Systemstart

```bash
# PM2 Setup für Autostart
pm2 startup

# Aktuellen Zustand speichern
pm2 save
```

### Server ist jetzt erreichbar unter:

```
http://localhost:3001
```

oder

```
http://<deine-server-ip>:3001
```

## Entwicklungsmodus

```bash
# Frontend & Backend parallel starten
npm run dev:all

# Oder einzeln:
npm run dev         # Frontend (Port 5173)
npm run dev:server  # Backend (Port 3001)
```

## Nützliche Befehle

```bash
# PM2 Verwaltung
npm run pm2:start     # Starten
npm run pm2:stop      # Stoppen
npm run pm2:restart   # Neu starten
npm run pm2:logs      # Logs anzeigen
npm run pm2:status    # Status

# Build
npm run build:all     # Alles neu bauen

# Logs-Verzeichnis leeren
rm -rf logs/*
```

## Port ändern

In `.env`:

```env
PORT=8080
```

## Firewall öffnen (Linux)

```bash
sudo ufw allow 3001
```

## Als Systemd Service (Alternative zu PM2)

Erstelle `/etc/systemd/system/grammar-checker.service`:

```ini
[Unit]
Description=German Grammar Checker
After=network.target

[Service]
Type=simple
User=dein-user
WorkingDirectory=/pfad/zum/projekt
Environment=NODE_ENV=production
EnvironmentFile=/pfad/zum/projekt/.env
ExecStart=/usr/bin/node server/dist/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Aktivieren:

```bash
sudo systemctl enable grammar-checker
sudo systemctl start grammar-checker
sudo systemctl status grammar-checker
```

## Troubleshooting

### Port bereits belegt

```bash
# Prozess finden
lsof -i :3001

# Prozess beenden
kill -9 <PID>
```

### Build-Fehler

```bash
# Node Modules löschen und neu installieren
rm -rf node_modules server/node_modules
npm run install:all
npm run build:all
```

### PM2 Logs prüfen

```bash
npm run pm2:logs

# Oder direkt:
pm2 logs german-grammar-checker --lines 100
```

### API-Key-Fehler

Prüfe ob `GEMINI_API_KEY` in `.env` gesetzt ist:

```bash
cat .env | grep GEMINI_API_KEY
```

## Updates

```bash
git pull
npm run install:all
npm run build:all
npm run pm2:restart
```

## Deinstallation

```bash
# PM2 stoppen und entfernen
npm run pm2:stop
pm2 delete german-grammar-checker

# Oder mit systemd
sudo systemctl stop grammar-checker
sudo systemctl disable grammar-checker
sudo rm /etc/systemd/system/grammar-checker.service

# Projekt-Ordner löschen
cd ..
rm -rf Deutscher-Grammatik--und-Rechtschreibpr-fer
```

## Ressourcen

- **RAM**: ~100-200 MB
- **CPU**: Minimal (nur bei Anfragen)
- **Disk**: ~150 MB (mit node_modules)

## Support

Bei Problemen siehe auch [DEPLOYMENT.md](DEPLOYMENT.md) für weitere Details.
