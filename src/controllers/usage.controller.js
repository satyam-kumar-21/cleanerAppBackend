import { sendSuccess } from '../utils/response.js';

export const getUsage = async (req, res, next) => {
  try {
    sendSuccess(res, 'Usage retrieved successfully', { resource: 'usage' });
  } catch (error) {
    next(error);
  }
};

export const handleUsageAction = async (req, res, next) => {
  try {
    sendSuccess(res, 'Usage action executed successfully', req.body);
  } catch (error) {
    next(error);
  }
};
