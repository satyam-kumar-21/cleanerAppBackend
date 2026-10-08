import { Router } from 'express';
import { getSupport, handleSupportAction } from '../controllers/support.controller.js';

const router = Router();

router.get('/', getSupport);
router.post('/', handleSupportAction);

export default router;
