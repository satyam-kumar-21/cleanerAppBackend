import { Router } from 'express';
import { getLicense, handleLicenseAction } from '../controllers/license.controller.js';

const router = Router();

router.get('/', getLicense);
router.post('/', handleLicenseAction);

export default router;
