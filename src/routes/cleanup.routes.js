import { Router } from 'express';
import {
  createCleanupHistory,
  getCleanupHistory,
  getCleanupById,
  deleteCleanup,
  getCleanup,
  handleCleanupAction
} from '../controllers/cleanup.controller.js';
import authenticate from '../middleware/auth.middleware.js';

const router = Router();

// Protected routes - require authentication
router.post('/', authenticate, createCleanupHistory);
router.get('/', authenticate, getCleanupHistory);
router.get('/:id', authenticate, getCleanupById);
router.delete('/:id', authenticate, deleteCleanup);

// Legacy routes (keeping for backward compatibility)
router.get('/legacy', getCleanup);
router.post('/legacy', handleCleanupAction);

export default router;
