import { sendSuccess } from '../utils/response.js';

export const getAdmin = async (req, res, next) => {
  try {
    sendSuccess(res, 'Admin retrieved successfully', { resource: 'admin' });
  } catch (error) {
    next(error);
  }
};

export const handleAdminAction = async (req, res, next) => {
  try {
    sendSuccess(res, 'Admin action executed successfully', req.body);
  } catch (error) {
    next(error);
  }
};
