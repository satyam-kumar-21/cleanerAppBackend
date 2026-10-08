import { Router } from 'express';
import { getNotification, handleNotificationAction } from '../controllers/notification.controller.js';

const router = Router();

router.get('/', getNotification);
router.post('/', handleNotificationAction);

export default router;
