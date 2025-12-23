import express from 'express';
import { checkGrammarRequest } from '../controllers/grammar.controller.js';
import { validateGrammarRequest } from '../middleware/validateRequest.js';
import { requireApiKey } from '../middleware/requireApiKey.js';

const router = express.Router();

router.post('/check-grammar', requireApiKey, validateGrammarRequest, checkGrammarRequest);

export default router;
