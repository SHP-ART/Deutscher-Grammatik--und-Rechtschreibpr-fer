import express from 'express';
import { getCacheStatistics } from '../controllers/cache.controller.js';

const router = express.Router();

router.get('/cache-stats', getCacheStatistics);

export default router;
