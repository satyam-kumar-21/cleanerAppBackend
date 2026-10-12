import mongoose from 'mongoose';
import { sendSuccess } from '../utils/response.js';
import { sendPushNotification } from '../services/notification.service.js';

export const getNotification = async (req, res, next) => {
  try {
    sendSuccess(res, 'Notification retrieved successfully', { resource: 'notification' });
  } catch (error) {
    next(error);
  }
};

export const handleNotificationAction = async (req, res, next) => {
  try {
    const { userId, title, body, data } = req.body;
    if (userId !== undefined && (typeof userId !== 'string' || !mongoose.isValidObjectId(userId))) {
      return res.status(400).json({ success: false, message: 'A valid userId is required' });
    }
    if (
      typeof title !== 'string' || !title.trim() || title.length > 100 ||
      typeof body !== 'string' || !body.trim() || body.length > 500
    ) {
      return res.status(400).json({
        success: false,
        message: 'A title (max 100 characters) and body (max 500 characters) are required',
      });
    }
    if (data !== undefined && (!data || typeof data !== 'object' || Array.isArray(data))) {
      return res.status(400).json({ success: false, message: 'Notification data must be an object' });
    }

    const result = await sendPushNotification({
      userId,
      title: title.trim(),
      body: body.trim(),
      data,
    });
    sendSuccess(res, 'Notification delivery processed', result);
  } catch (error) {
    next(error);
  }
};
