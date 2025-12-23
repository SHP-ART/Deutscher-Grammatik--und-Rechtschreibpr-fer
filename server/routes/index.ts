import express from 'express';
import healthRoutes from './health.routes.js';
import setupRoutes from './setup.routes.js';
import grammarRoutes from './grammar.routes.js';
import cacheRoutes from './cache.routes.js';

const router = express.Router();

router.use('/', healthRoutes);
router.use('/api', setupRoutes);
router.use('/api', grammarRoutes);
router.use('/api', cacheRoutes);

export default router;
