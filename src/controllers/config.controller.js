import { sendSuccess } from '../utils/response.js';

export const getConfig = async (req, res, next) => {
  try {
    sendSuccess(res, 'Config retrieved successfully', { resource: 'config' });
  } catch (error) {
    next(error);
  }
};

export const handleConfigAction = async (req, res, next) => {
  try {
    sendSuccess(res, 'Config action executed successfully', req.body);
  } catch (error) {
    next(error);
  }
};
