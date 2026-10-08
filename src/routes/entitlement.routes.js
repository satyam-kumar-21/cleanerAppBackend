import { Router } from 'express';
import { getEntitlement, handleEntitlementAction } from '../controllers/entitlement.controller.js';

const router = Router();

router.get('/', getEntitlement);
router.post('/', handleEntitlementAction);

export default router;
