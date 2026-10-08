import { Router } from 'express';
import { getPlan, handlePlanAction } from '../controllers/plan.controller.js';

const router = Router();

router.get('/', getPlan);
router.post('/', handlePlanAction);

export default router;
