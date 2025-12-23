import express from 'express';
import path from 'path';
import { getCorsOptions, getHelmetOptions, getRateLimiter } from './config/security.js';
import { getProjectRoot, getFrontendPath } from './utils/path.util.js';
import { SERVER_CONSTANTS } from './utils/constants.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';

export function createApp(nodeEnv: string): express.Application {
  const app = express();

  app.set('trust proxy', true);

  app.use(requestLogger);
  app.use(getCorsOptions(nodeEnv));
  app.use(express.json({ limit: SERVER_CONSTANTS.MAX_REQUEST_SIZE }));
  app.use(getHelmetOptions());

  if (nodeEnv === 'production') {
    const { __dirname } = getProjectRoot(import.meta.url);
    const frontendPath = getFrontendPath(__dirname);
    console.log('Serving static files from:', frontendPath);
    app.use(express.static(frontendPath));
  }

  app.use('/api/', getRateLimiter(nodeEnv));

  app.use(routes);

  if (nodeEnv === 'production') {
    app.get('*', (req, res) => {
      const { __dirname } = getProjectRoot(import.meta.url);
      const frontendPath = getFrontendPath(__dirname);
      res.sendFile(path.join(frontendPath, 'index.html'));
    });
  }

  app.use(errorHandler);

  return app;
}
