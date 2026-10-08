import { sendSuccess } from '../utils/response.js';

export const getLicense = async (req, res, next) => {
  try {
    sendSuccess(res, 'License retrieved successfully', { resource: 'license' });
  } catch (error) {
    next(error);
  }
};

export const handleLicenseAction = async (req, res, next) => {
  try {
    sendSuccess(res, 'License action executed successfully', req.body);
  } catch (error) {
    next(error);
  }
};
