import { Router } from 'express';
import { getCleanup, handleCleanupAction } from '../controllers/cleanup.controller.js';

const router = Router();

router.get('/', getCleanup);
router.post('/', handleCleanupAction);

export default router;
