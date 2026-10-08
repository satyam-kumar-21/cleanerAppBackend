import { sendSuccess } from '../utils/response.js';

export const getSupport = async (req, res, next) => {
  try {
    sendSuccess(res, 'Support retrieved successfully', { resource: 'support' });
  } catch (error) {
    next(error);
  }
};

export const handleSupportAction = async (req, res, next) => {
  try {
    sendSuccess(res, 'Support action executed successfully', req.body);
  } catch (error) {
    next(error);
  }
};
