import { Router } from 'express';
import {
  registerDevice,
  getUserDevices,
  getDeviceById,
  updateDevice,
  heartbeat,
  getDevice,
  handleDeviceAction,
  checkDevice
} from '../controllers/device.controller.js';
import authenticate from '../middleware/auth.middleware.js';

const router = Router();

// Protected routes - require authentication
router.post('/register', authenticate, registerDevice);
router.get('/check/:deviceId', authenticate, checkDevice);
router.get('/', authenticate, getUserDevices);
router.get('/:id', authenticate, getDeviceById);
router.patch('/:id', authenticate, updateDevice);
router.post('/:id/heartbeat', authenticate, heartbeat);

// Legacy routes (keeping for backward compatibility)
router.get('/legacy', getDevice);
router.post('/legacy', handleDeviceAction);

export default router;
