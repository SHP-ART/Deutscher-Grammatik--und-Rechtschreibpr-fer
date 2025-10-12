# Deployment Anleitung für Homeserver

## Voraussetzungen

- Node.js 20+ ([Download](https://nodejs.org/))
- Gemini API Key (von [Google AI Studio](https://ai.google.dev/))
- Optional: PM2 für Prozessmanagement

## Schnelle Installation

### Automatisches Setup

```bash
git clone <repository-url>
cd Deutscher-Grammatik--und-Rechtschreibpr-fer
./setup.sh
```

Das Setup-Script führt alle notwendigen Schritte automatisch aus.

## Manuelle Installation

### 1. Repository klonen

```bash
git clone <repository-url>
cd Deutscher-Grammatik--und-Rechtschreibpr-fer
```

### 2. Umgebungsvariablen konfigurieren

```bash
cp .env.example .env
```

Trage deinen Gemini API Key in `.env` ein:

```env
GEMINI_API_KEY=dein_api_key_hier
PORT=3001
NODE_ENV=production
```

### 3. Dependencies installieren

```bash
npm run install:all
```

### 4. Projekt bauen

```bash
npm run build:all
```

### 5. Server starten

**Option A: Mit PM2 (Empfohlen)**

```bash
npm install -g pm2
npm run pm2:start
```

**Option B: Direkt mit Node**

```bash
npm start
```

Die App ist nun unter `http://localhost:3001` erreichbar.

## PM2 Prozessmanagement

### PM2 Autostart bei Systemstart

```bash
# PM2 Autostart konfigurieren
pm2 startup

# Aktuellen Prozess speichern
pm2 save
```

### PM2 Befehle

```bash
npm run pm2:status    # Status anzeigen
npm run pm2:logs      # Logs anzeigen
npm run pm2:restart   # Neustart
npm run pm2:stop      # Stoppen
```

## Konfiguration

### Port ändern

In `.env`:

```env
PORT=8080
```

### Cache-Dauer anpassen

In `server/index.ts:27`:

```typescript
const cache = new NodeCache({
  stdTTL: 7200,      // 2 Stunden statt 1
  checkperiod: 600
});
```

### Rate Limiting anpassen

In `server/index.ts:44-47`:

```typescript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 Minuten
  max: 50,                    // 50 Anfragen statt 30
});
```

## Monitoring

### Logs anzeigen

**Mit PM2:**
```bash
npm run pm2:logs
```

**Ohne PM2:**
```bash
# Logs gehen nach stdout/stderr
# Optional: Logs in Datei umleiten
npm start > logs/app.log 2>&1
```

### Cache-Statistiken

```bash
curl http://localhost:3001/api/cache-stats
```

### Health Check

```bash
curl http://localhost:3001/health
```

## Sicherheit

- API Key wird nur serverseitig gespeichert
- Rate Limiting schützt vor Missbrauch
- Helmet.js für HTTP-Header-Sicherheit
- CORS deaktiviert in Production
- Memory-Limits mit PM2

## Ressourcenverbrauch

- **RAM**: ~100-200 MB
- **CPU**: Minimal (nur bei Anfragen)
- **Storage**: ~150 MB (mit node_modules)
- **Netzwerk**: Abhängig von Gemini API Nutzung

## Optimierungen

1. **Caching**: Häufige Anfragen werden 1 Stunde gecacht
2. **Rate Limiting**: Max 30 Anfragen pro 15 Min pro IP
3. **Text-Limit**: Max 50.000 Zeichen pro Anfrage
4. **Kompression**: Automatisch durch Express
5. **PM2 Cluster Mode**: Optional für Multi-Core

## Firewall konfigurieren

### Linux (ufw)

```bash
sudo ufw allow 3001
sudo ufw reload
```

### Linux (firewalld)

```bash
sudo firewall-cmd --permanent --add-port=3001/tcp
sudo firewall-cmd --reload
```

## Troubleshooting

### Server startet nicht

**PM2:**
```bash
npm run pm2:logs
```

**Ohne PM2:**
```bash
# Prüfe ob Port bereits belegt
lsof -i :3001
```

Prüfe ob `GEMINI_API_KEY` in `.env` gesetzt ist:

```bash
cat .env | grep GEMINI_API_KEY
```

### Verbindungsfehler

Prüfe Firewall-Regeln (siehe oben) und ob Server läuft:

```bash
npm run pm2:status
# oder
ps aux | grep node
```

### Cache leeren

Server neu starten:

```bash
npm run pm2:restart
# oder ohne PM2
# CTRL+C und npm start
```

### Build-Fehler

```bash
rm -rf node_modules server/node_modules dist server/dist
npm run install:all
npm run build:all
```

## Backup

Nur `.env` Datei sichern - keine Datenbank erforderlich!

```bash
cp .env .env.backup
```

## Updates

```bash
git pull
npm run install:all
npm run build:all
npm run pm2:restart
```

## Als Systemd Service

Alternative zu PM2 - siehe [INSTALL.md](INSTALL.md) für Details.

## Performance-Tuning

### PM2 Cluster Mode (Multi-Core)

In `ecosystem.config.cjs`:

```javascript
instances: 'max',  // statt instances: 1
exec_mode: 'cluster'  // statt 'fork'
```

Neustart:

```bash
npm run pm2:restart
```
