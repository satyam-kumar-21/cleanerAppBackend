import { Router } from 'express';
import {
  getPrioritySupportQueue,
  getSupport,
  handleSupportAction,
  updatePrioritySupportTicket,
} from '../controllers/support.controller.js';
import authenticate from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);
router.get('/queue', getPrioritySupportQueue);
router.patch('/:id/status', updatePrioritySupportTicket);
router.get('/', getSupport);
router.post('/', handleSupportAction);

export default router;
