import { sendSuccess } from '../utils/response.js';

export const getNotification = async (req, res, next) => {
  try {
    sendSuccess(res, 'Notification retrieved successfully', { resource: 'notification' });
  } catch (error) {
    next(error);
  }
};

export const handleNotificationAction = async (req, res, next) => {
  try {
    sendSuccess(res, 'Notification action executed successfully', req.body);
  } catch (error) {
    next(error);
  }
};
