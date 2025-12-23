import express from 'express';
import { getSetupStatus, configureSetup } from '../controllers/setup.controller.js';
import { validateSetupRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.get('/setup/status', getSetupStatus);
router.post('/setup/configure', validateSetupRequest, configureSetup);

export default router;
