import { sendSuccess } from '../utils/response.js';
import User from '../models/User.js';
import SupportTicket from '../models/SupportTicket.js';

async function getPremiumUser(req) {
  const user = await User.findById(req.user.userId);
  if (!user || user.plan !== 'premium') return null;
  if (user.subscriptionExpiresAt && user.subscriptionExpiresAt <= new Date()) return null;
  return user;
}

export const getSupport = async (req, res, next) => {
  try {
    const user = await getPremiumUser(req);
    if (!user) {
      return res.status(403).json({ success: false, message: 'Priority support is available to Premium members only.' });
    }
    const tickets = await SupportTicket.find({ userId: user._id }).sort({ createdAt: -1 }).limit(50);
    sendSuccess(res, 'Support tickets retrieved successfully', { tickets });
  } catch (error) {
    next(error);
  }
};

export const handleSupportAction = async (req, res, next) => {
  try {
    const user = await getPremiumUser(req);
    if (!user) {
      return res.status(403).json({ success: false, message: 'Priority support is available to Premium members only.' });
    }
    const subject = typeof req.body.subject === 'string' ? req.body.subject.trim() : '';
    const message = typeof req.body.message === 'string' ? req.body.message.trim() : '';
    if (subject.length < 5 || subject.length > 120) {
      return res.status(400).json({ success: false, message: 'Subject must be between 5 and 120 characters.' });
    }
    if (message.length < 20 || message.length > 5000) {
      return res.status(400).json({ success: false, message: 'Message must be between 20 and 5000 characters.' });
    }
    const ticket = await SupportTicket.create({
      userId: user._id,
      subject,
      message,
      priority: 'PRIORITY',
    });
    sendSuccess(res, 'Priority support request submitted successfully.', ticket, 201);
  } catch (error) {
    next(error);
  }
};

export const getPrioritySupportQueue = async (req, res, next) => {
  try {
    const operator = await User.findById(req.user.userId);
    if (!operator || !['ADMIN', 'SUPER_ADMIN', 'SUPPORT'].includes(operator.role)) {
      return res.status(403).json({ success: false, message: 'Support-team access is required.' });
    }
    const tickets = await SupportTicket.find({ status: { $ne: 'RESOLVED' } })
      .populate('userId', 'name email')
      .sort({ createdAt: 1 })
      .limit(100);
    sendSuccess(res, 'Priority support queue retrieved successfully.', { tickets });
  } catch (error) {
    next(error);
  }
};

export const updatePrioritySupportTicket = async (req, res, next) => {
  try {
    const operator = await User.findById(req.user.userId);
    if (!operator || !['ADMIN', 'SUPER_ADMIN', 'SUPPORT'].includes(operator.role)) {
      return res.status(403).json({ success: false, message: 'Support-team access is required.' });
    }
    const { status } = req.body;
    if (!['OPEN', 'IN_PROGRESS', 'RESOLVED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Choose a valid support ticket status.' });
    }
    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Support ticket not found.' });
    }
    sendSuccess(res, 'Support ticket updated successfully.', ticket);
  } catch (error) {
    next(error);
  }
};
