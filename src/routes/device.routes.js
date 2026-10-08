import { Router } from 'express';
import { getDevice, handleDeviceAction } from '../controllers/device.controller.js';

const router = Router();

router.get('/', getDevice);
router.post('/', handleDeviceAction);

export default router;
