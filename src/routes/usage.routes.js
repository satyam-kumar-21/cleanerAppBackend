import { Router } from 'express';
import { getUsage, handleUsageAction } from '../controllers/usage.controller.js';

const router = Router();

router.get('/', getUsage);
router.post('/', handleUsageAction);

export default router;
