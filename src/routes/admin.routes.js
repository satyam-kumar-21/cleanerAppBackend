import { Router } from 'express';
import { getAdmin, handleAdminAction } from '../controllers/admin.controller.js';

const router = Router();

router.get('/', getAdmin);
router.post('/', handleAdminAction);

export default router;
