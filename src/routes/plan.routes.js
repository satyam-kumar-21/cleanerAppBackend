import { Router } from 'express';
import { getPlan } from '../controllers/plan.controller.js';

const router = Router();

router.get('/', getPlan);

export default router;
