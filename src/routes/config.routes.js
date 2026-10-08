import { Router } from 'express';
import { getConfig, handleConfigAction } from '../controllers/config.controller.js';

const router = Router();

router.get('/', getConfig);
router.post('/', handleConfigAction);

export default router;
