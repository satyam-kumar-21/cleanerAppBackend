import ScanHistory from '../models/ScanHistory.js';
import Device from '../models/Device.js';
import { sendSuccess, sendError } from '../utils/response.js';

// Create scan history
export const createScanHistory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const {
      deviceId,
      platform,
      scanType,
      totalScanned,
      itemsFound,
      cleanableSizeBytes,
      durationMs,
      categoryCounts,
      startedAt,
      completedAt,
      status,
    } = req.body;

    if (!deviceId || !platform) {
      return sendError(res, 'deviceId and platform are required', 400);
    }

    const scanHistory = await ScanHistory.create({
      userId,
      deviceId,
      platform,
      scanType: scanType || 'FULL',
      totalScanned: totalScanned || 0,
      itemsFound: itemsFound || 0,
      cleanableSizeBytes: cleanableSizeBytes || 0,
      durationMs: durationMs || 0,
      categoryCounts: categoryCounts || {},
      startedAt: startedAt || new Date(),
      completedAt: completedAt || new Date(),
      status: status || 'COMPLETED',
    });

    // Update device lastScanAt
    await Device.findOneAndUpdate(
      { userId, deviceId },
      { lastScanAt: new Date() }
    );

    sendSuccess(res, 'Scan history saved successfully', scanHistory, 201);
  } catch (error) {
    next(error);
  }
};

// Get scan history (paginated)
export const getScanHistory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20, deviceId } = req.query;

    const query = { userId };
    if (deviceId) {
      query.deviceId = deviceId;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [scans, total] = await Promise.all([
      ScanHistory.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      ScanHistory.countDocuments(query),
    ]);

    sendSuccess(res, 'Scan history retrieved successfully', {
      scans,
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

// Get single scan by ID
export const getScanById = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const scan = await ScanHistory.findOne({ _id: id, userId });

    if (!scan) {
      return sendError(res, 'Scan not found', 404);
    }

    sendSuccess(res, 'Scan retrieved successfully', scan);
  } catch (error) {
    next(error);
  }
};

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
