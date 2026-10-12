import { Router } from 'express';
import {
  createScanHistory,
  getScanHistory,
  getScanById,
  deleteScan,
  getScan,
  handleScanAction
} from '../controllers/scan.controller.js';
import authenticate from '../middleware/auth.middleware.js';

const router = Router();

// Protected routes - require authentication
router.post('/', authenticate, createScanHistory);
router.get('/', authenticate, getScanHistory);
router.get('/:id', authenticate, getScanById);
router.delete('/:id', authenticate, deleteScan);

// Legacy routes (keeping for backward compatibility)
router.get('/legacy', getScan);
router.post('/legacy', handleScanAction);

export default router;
