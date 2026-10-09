import CleanupHistory from '../models/CleanupHistory.js';
import Device from '../models/Device.js';
import { sendSuccess, sendError } from '../utils/response.js';

// Create cleanup history
export const createCleanupHistory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const {
      deviceId,
      platform,
      itemsProcessed,
      itemsCleaned,
      itemsSkipped,
      bytesFreed,
      durationMs,
      status,
      categories,
    } = req.body;

    if (!deviceId || !platform) {
      return sendError(res, 'deviceId and platform are required', 400);
    }

    const cleanupHistory = await CleanupHistory.create({
      userId,
      deviceId,
      platform,
      itemsProcessed: itemsProcessed || 0,
      itemsCleaned: itemsCleaned || 0,
      itemsSkipped: itemsSkipped || 0,
      bytesFreed: bytesFreed || 0,
      durationMs: durationMs || 0,
      status: status || 'COMPLETED',
      categories: categories || [],
    });

    // Update device lastCleanedAt and lastBytesFreed
    await Device.findOneAndUpdate(
      { userId, deviceId },
      {
        lastCleanedAt: new Date(),
        lastBytesFreed: bytesFreed || 0,
      }
    );

    sendSuccess(res, 'Cleanup history saved successfully', cleanupHistory, 201);
  } catch (error) {
    next(error);
  }
};

// Get cleanup history (paginated)
export const getCleanupHistory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20, deviceId } = req.query;

    const query = { userId };
    if (deviceId) {
      query.deviceId = deviceId;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [cleanups, total] = await Promise.all([
      CleanupHistory.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      CleanupHistory.countDocuments(query),
    ]);

    sendSuccess(res, 'Cleanup history retrieved successfully', {
      cleanups,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get single cleanup by ID
export const getCleanupById = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const cleanup = await CleanupHistory.findOne({ _id: id, userId });

    if (!cleanup) {
      return sendError(res, 'Cleanup record not found', 404);
    }

    sendSuccess(res, 'Cleanup retrieved successfully', cleanup);
  } catch (error) {
    next(error);
  }
};

export const getCleanup = async (req, res, next) => {
  try {
    sendSuccess(res, 'Cleanup retrieved successfully', { resource: 'cleanup' });
  } catch (error) {
    next(error);
  }
};

export const handleCleanupAction = async (req, res, next) => {
  try {
    sendSuccess(res, 'Cleanup action executed successfully', req.body);
  } catch (error) {
    next(error);
  }
};
