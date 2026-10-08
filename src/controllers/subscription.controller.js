import { sendSuccess } from '../utils/response.js';

export const getSubscription = async (req, res, next) => {
  try {
    sendSuccess(res, 'Subscription retrieved successfully', { resource: 'subscription' });
  } catch (error) {
    next(error);
  }
};

export const handleSubscriptionAction = async (req, res, next) => {
  try {
    sendSuccess(res, 'Subscription action executed successfully', req.body);
  } catch (error) {
    next(error);
  }
};
