import { Router } from 'express';
import { getScan, handleScanAction } from '../controllers/scan.controller.js';

const router = Router();

router.get('/', getScan);
router.post('/', handleScanAction);

export default router;
