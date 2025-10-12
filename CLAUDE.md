# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A German grammar and spelling checker application using Google Gemini AI. The project is designed for homeserver deployment with a React frontend and Express backend.

**Tech Stack:**
- Frontend: React 19 + TypeScript + Vite + Tailwind CSS 4
- Backend: Express + Node.js + TypeScript
- AI: Google Gemini 2.0 Flash (via @google/genai)
- Cache: node-cache (in-memory, 1-hour TTL)
- Security: Helmet.js, CORS, express-rate-limit (30 req/15min per IP)
- Process Manager: PM2

## Development Commands

```bash
# Install all dependencies (frontend + backend)
npm run install:all

# Development (run both frontend and backend)
npm run dev:all

# Development (individual)
npm run dev          # Frontend only (Vite dev server on port 5173)
npm run dev:server   # Backend only (tsx on port 3001)

# Build
npm run build:all    # Build both frontend and backend
npm run build        # Frontend only (Vite build to dist/)
npm run build:server # Backend only (TypeScript to server/dist/)

# Production
npm start            # Start production server (NODE_ENV=production)

# PM2 Process Management
npm run pm2:start    # Start with PM2
npm run pm2:stop     # Stop PM2 process
npm run pm2:restart  # Restart PM2 process
npm run pm2:logs     # View PM2 logs
npm run pm2:status   # Check PM2 status
```

## Architecture

### Client-Server Communication Flow

1. **Frontend (React SPA)**
   - Entry: `index.tsx` → `App.tsx`
   - Service: `services/geminiService.ts` calls `/api/check-grammar`
   - Components in `components/` directory
   - First-run setup via `SetupPage.tsx` if API key not configured

2. **Backend (Express API)**
   - Entry: `server/index.ts`
   - Config: `server/configManager.ts` handles `.env` read/write operations
   - Serves static frontend in production from `dist/` folder
   - Routes:
     - `POST /api/check-grammar` - Main grammar checking endpoint
     - `GET /api/setup/status` - Check if API key is configured
     - `POST /api/setup/configure` - Save and validate API key
     - `GET /api/cache-stats` - Cache statistics
     - `GET /health` - Health check endpoint

3. **Request Flow**
   ```
   User Input → Frontend → /api/check-grammar →
   Check Cache → Call Gemini API → Store in Cache → Return Result
   ```

### Key Architecture Details

- **In-Memory Caching**: Uses SHA-256 hash of lowercased/trimmed text as cache key
- **Rate Limiting**: Applied to all `/api/*` routes (30 requests per 15 minutes per IP)
- **API Key Management**: Can be configured via web UI on first run; stored in `.env` file
- **Production Mode**: Backend serves frontend static files and handles SPA routing
- **Development Mode**: Frontend runs on port 5173 (Vite), backend on port 3001 with CORS enabled

## Environment Variables

Located in `.env` file (see `.env.example`):

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
NODE_ENV=production
VITE_API_URL=http://localhost:3001  # Optional, for development
```

## Building and Deployment

**Build Process:**
1. Frontend: Vite builds React app to `dist/` folder
2. Backend: TypeScript compiles to `server/dist/` folder
3. Production: Backend serves frontend static files from `dist/`

**PM2 Configuration:**
- Config file: `ecosystem.config.cjs`
- Process name: `german-grammar-checker`
- Logs: `logs/error.log` and `logs/out.log`
- Auto-restart: Yes
- Memory limit: 500MB

## Important Implementation Notes

- **Gemini Model**: Uses `gemini-2.0-flash-exp` with temperature 0.2
- **Text Limit**: 50,000 characters maximum per request
- **Cache TTL**: 3600 seconds (1 hour), check period: 600 seconds
- **ES Modules**: Both frontend and backend use `"type": "module"` in package.json
- **Path Resolution**: Backend uses `fileURLToPath` and `path.dirname` for ES module compatibility
- **API Key Validation**: Backend validates API key format and tests it against Gemini API before saving

## Common Development Tasks

**Adding new API endpoints:**
- Add route handlers in `server/index.ts`
- Apply rate limiting via `limiter` middleware
- Check API key configuration with `hasApiKey()` for protected routes

**Modifying Gemini prompt:**
- Edit prompt in `server/index.ts` line 176
- Consider cache implications (cache keyed by input text only, not prompt)

**Adjusting rate limits:**
- Modify `windowMs` and `max` values in `server/index.ts` line 58-60

**Updating cache settings:**
- Modify `NodeCache` configuration in `server/index.ts` line 30
