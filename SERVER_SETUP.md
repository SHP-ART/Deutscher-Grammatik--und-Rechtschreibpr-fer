# Server Setup - Textassistent

## 📋 Systemanforderungen

### Erforderlich
- **Node.js** v18 oder höher
- **npm** (kommt mit Node.js)
- **Minimum 512 MB RAM**
- **Minimum 500 MB Festplattenspeicher**

### Optional (empfohlen)
- **PM2** für Prozessmanagement
- **nginx** als Reverse Proxy
- **Git** zum Klonen des Repositories

---

## 🚀 Installation

### 1. Repository klonen
```bash
git clone <repository-url>
cd Deutscher-Grammatik--und-Rechtschreibpr-fer
```

### 2. Automatische Installation
```bash
chmod +x install.sh
./install.sh
```

Das Script installiert automatisch:
- ✅ Prüft Node.js und npm Version
- ✅ Installiert alle Dependencies (Frontend + Backend)
- ✅ Erstellt .env Datei
- ✅ Bietet PM2 Installation an

### 3. API-Key konfigurieren
Öffne die `.env` Datei und trage deinen Gemini API-Key ein:

```bash
nano .env
```

Trage ein:
```env
GEMINI_API_KEY=dein_api_key_hier
PORT=3001
NODE_ENV=production
```

**API-Key erhalten:**
1. Besuche: https://aistudio.google.com/app/apikey
2. Erstelle einen neuen API-Key
3. Kopiere ihn in die .env Datei

---

## 🏗️ Build & Deployment

### Development-Modus (lokal testen)
```bash
./start.sh
# oder
npm run dev:all
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Production Build
```bash
npm run build:all
```

Erstellt:
- `dist/` - Frontend (statische Dateien)
- `server/dist/` - Backend (kompiliertes TypeScript)

### Production starten (mit PM2)
```bash
npm run pm2:start
```

PM2 Commands:
```bash
npm run pm2:status   # Status anzeigen
npm run pm2:logs     # Logs anzeigen
npm run pm2:restart  # Neu starten
npm run pm2:stop     # Stoppen
```

---

## 🌐 Nginx Reverse Proxy (optional)

Erstelle eine nginx Konfiguration:

```bash
sudo nano /etc/nginx/sites-available/textassistent
```

Beispiel-Konfiguration:
```nginx
server {
    listen 80;
    server_name deine-domain.de;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Aktivieren:
```bash
sudo ln -s /etc/nginx/sites-available/textassistent /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔒 SSL mit Let's Encrypt (optional)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d deine-domain.de
```

Auto-Renewal testen:
```bash
sudo certbot renew --dry-run
```

---

## 📊 Systemd Service (Alternative zu PM2)

Erstelle Service-Datei:
```bash
sudo nano /etc/systemd/system/textassistent.service
```

Inhalt:
```ini
[Unit]
Description=Textassistent - Grammar Checker
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/pfad/zum/projekt
Environment=NODE_ENV=production
ExecStart=/usr/bin/node /pfad/zum/projekt/server/dist/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Aktivieren:
```bash
sudo systemctl daemon-reload
sudo systemctl enable textassistent
sudo systemctl start textassistent
sudo systemctl status textassistent
```

---

## 🐛 Troubleshooting

### Port bereits belegt
```bash
# Port 3001 freigeben
sudo lsof -ti:3001 | xargs kill -9

# Port 5173 freigeben (Development)
sudo lsof -ti:5173 | xargs kill -9
```

### PM2 Logs anzeigen
```bash
npm run pm2:logs
# oder
pm2 logs textassistent
```

### Neuinstallation
```bash
# Node modules löschen
rm -rf node_modules server/node_modules

# Build-Ordner löschen
rm -rf dist server/dist

# Neu installieren
./install.sh
```

### Memory Issues
PM2 Memory Limit setzen:
```bash
pm2 start ecosystem.config.cjs --max-memory-restart 500M
```

---

## 📈 Performance Tipps

1. **Node.js in Production-Modus:**
   ```bash
   export NODE_ENV=production
   ```

2. **PM2 Cluster-Modus:**
   ```javascript
   // ecosystem.config.cjs
   instances: 2  // 2 Instanzen starten
   ```

3. **Nginx Caching aktivieren**

4. **Gzip Kompression aktivieren**

---

## 🔧 Wartung

### Updates installieren
```bash
git pull
npm run install:all
npm run build:all
npm run pm2:restart
```

### Logs rotieren (PM2)
```bash
pm2 install pm2-logrotate
```

### Backup
Wichtige Dateien:
- `.env` - API-Key Konfiguration
- `ecosystem.config.cjs` - PM2 Konfiguration

---

## 📞 Support

Bei Problemen:
1. Prüfe Logs: `npm run pm2:logs`
2. Prüfe Node.js Version: `node -v` (min. v18)
3. Prüfe Ports: `sudo lsof -i :3001`
4. Prüfe .env Datei: API-Key gesetzt?

---

## 📝 Checkliste für Production

- [ ] Node.js v18+ installiert
- [ ] Dependencies installiert (`npm run install:all`)
- [ ] .env Datei mit GEMINI_API_KEY konfiguriert
- [ ] Production Build erstellt (`npm run build:all`)
- [ ] PM2 installiert und konfiguriert
- [ ] Anwendung startet (`npm run pm2:start`)
- [ ] Nginx Reverse Proxy konfiguriert (optional)
- [ ] SSL Zertifikat installiert (optional)
- [ ] Firewall konfiguriert (Port 80/443 öffnen)
- [ ] Auto-Start bei Server-Neustart aktiviert
