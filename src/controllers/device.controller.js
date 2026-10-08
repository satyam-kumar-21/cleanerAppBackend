import { sendSuccess } from '../utils/response.js';

export const getDevice = async (req, res, next) => {
  try {
    sendSuccess(res, 'Device retrieved successfully', { resource: 'device' });
  } catch (error) {
    next(error);
  }
};

export const handleDeviceAction = async (req, res, next) => {
  try {
    sendSuccess(res, 'Device action executed successfully', req.body);
  } catch (error) {
    next(error);
  }
};
