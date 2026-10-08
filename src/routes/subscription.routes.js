import { Router } from 'express';
import { getSubscription, handleSubscriptionAction } from '../controllers/subscription.controller.js';

const router = Router();

router.get('/', getSubscription);
router.post('/', handleSubscriptionAction);

export default router;
