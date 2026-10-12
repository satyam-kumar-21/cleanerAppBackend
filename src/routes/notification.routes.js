import { Router } from 'express';
import { getNotification, handleNotificationAction } from '../controllers/notification.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import requireAdmin from '../middleware/admin.middleware.js';

const router = Router();

router.use(authMiddleware);
router.get('/', getNotification);
router.post('/', requireAdmin, handleNotificationAction);

export default router;
