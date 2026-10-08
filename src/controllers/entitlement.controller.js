import { sendSuccess } from '../utils/response.js';

export const getEntitlement = async (req, res, next) => {
  try {
    sendSuccess(res, 'Entitlement retrieved successfully', { resource: 'entitlement' });
  } catch (error) {
    next(error);
  }
};

export const handleEntitlementAction = async (req, res, next) => {
  try {
    sendSuccess(res, 'Entitlement action executed successfully', req.body);
  } catch (error) {
    next(error);
  }
};
