import { sendSuccess } from '../utils/response.js';

export const getCleanup = async (req, res, next) => {
  try {
    sendSuccess(res, 'Cleanup retrieved successfully', { resource: 'cleanup' });
  } catch (error) {
    next(error);
  }
};

export const handleCleanupAction = async (req, res, next) => {
  try {
    sendSuccess(res, 'Cleanup action executed successfully', req.body);
  } catch (error) {
    next(error);
  }
};
