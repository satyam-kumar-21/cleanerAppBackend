import { sendSuccess } from '../utils/response.js';

export const getScan = async (req, res, next) => {
  try {
    sendSuccess(res, 'Scan retrieved successfully', { resource: 'scan' });
  } catch (error) {
    next(error);
  }
};

export const handleScanAction = async (req, res, next) => {
  try {
    sendSuccess(res, 'Scan action executed successfully', req.body);
  } catch (error) {
    next(error);
  }
};
