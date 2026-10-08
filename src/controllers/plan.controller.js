import { sendSuccess } from '../utils/response.js';

export const getPlan = async (req, res, next) => {
  try {
    sendSuccess(res, 'Plan retrieved successfully', { resource: 'plan' });
  } catch (error) {
    next(error);
  }
};

export const handlePlanAction = async (req, res, next) => {
  try {
    sendSuccess(res, 'Plan action executed successfully', req.body);
  } catch (error) {
    next(error);
  }
};
