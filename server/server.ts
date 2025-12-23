import { createApp } from './app.js';
import { loadEnv, getEnvConfig } from './config/env.js';
import { initializeGeminiClient } from './config/gemini.js';
import { SERVER_CONSTANTS } from './utils/constants.js';

export function startServer(): void {
  loadEnv(import.meta.url);

  const envConfig = getEnvConfig();

  if (envConfig.apiKey) {
    initializeGeminiClient(envConfig.apiKey);
  }

  const app = createApp(envConfig.nodeEnv);

  const server = app.listen(envConfig.port, () => {
    console.log(`🚀 Server läuft auf Port ${envConfig.port}`);
    console.log(`📊 Cache aktiviert mit ${SERVER_CONSTANTS.CACHE.TTL / 60} Minuten TTL`);
    console.log(`🔒 Rate Limiting: ${SERVER_CONSTANTS.RATE_LIMIT.MAX_REQUESTS} Anfragen pro ${SERVER_CONSTANTS.RATE_LIMIT.WINDOW_MS / 60000} Minuten`);
    console.log(`🌍 Environment: ${envConfig.nodeEnv}`);
    console.log(`🤖 API Key configured: ${envConfig.apiKey ? 'Yes' : 'No'}`);
  });

  const shutdown = () => {
    console.log('\n🛑 Shutting down gracefully...');
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });

    setTimeout(() => {
      console.error('❌ Forcing shutdown');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}
