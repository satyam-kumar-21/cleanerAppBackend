import Device from '../models/Device.js';
import { sendSuccess, sendError } from '../utils/response.js';

// Register or update device
export const registerDevice = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const {
      deviceId,
      deviceName,
      manufacturer,
      model,
      platform,
      osVersion,
      appVersion,
      architecture,
      processorName,
      coreCount,
      totalRamBytes,
      availableRamBytes,
      totalStorageBytes,
      freeStorageBytes,
      usedStorageBytes,
      batteryLevel,
      isCharging,
    } = req.body;

    if (!deviceId || !platform) {
      return sendError(res, 'deviceId and platform are required', 400);
    }

    const deviceData = {
      userId,
      deviceId,
      deviceName: deviceName || 'My Device',
      manufacturer,
      model,
      platform,
      osVersion,
      appVersion,
      architecture,
      processorName,
      coreCount,
      totalRamBytes,
      availableRamBytes,
      totalStorageBytes,
      freeStorageBytes,
      usedStorageBytes,
      batteryLevel,
      isCharging,
      lastSeenAt: new Date(),
      status: 'ACTIVE',
    };

    const device = await Device.findOneAndUpdate(
      { userId, deviceId },
      deviceData,
      { new: true, upsert: true, runValidators: true }
    );

    sendSuccess(res, 'Device registered successfully', device, 201);
  } catch (error) {
    next(error);
  }
};

// Get all user devices
export const getUserDevices = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const devices = await Device.find({ userId }).sort({ lastSeenAt: -1 });

    sendSuccess(res, 'Devices retrieved successfully', devices);
  } catch (error) {
    next(error);
  }
};

// Get single device by ID
export const getDeviceById = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const device = await Device.findOne({ _id: id, userId });

    if (!device) {
      return sendError(res, 'Device not found', 404);
    }

    sendSuccess(res, 'Device retrieved successfully', device);
  } catch (error) {
    next(error);
  }
};

// Update device
export const updateDevice = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const device = await Device.findOne({ _id: id, userId });

    if (!device) {
      return sendError(res, 'Device not found', 404);
    }

    const allowedUpdates = [
      'deviceName',
      'totalRamBytes',
      'availableRamBytes',
      'totalStorageBytes',
      'freeStorageBytes',
      'usedStorageBytes',
      'batteryLevel',
      'isCharging',
      'lastScanAt',
      'lastCleanedAt',
      'lastBytesFreed',
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        device[field] = req.body[field];
      }
    });

    device.lastSeenAt = new Date();
    await device.save();

    sendSuccess(res, 'Device updated successfully', device);
  } catch (error) {
    next(error);
  }
};

// Heartbeat - update last seen
export const heartbeat = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const device = await Device.findOneAndUpdate(
      { _id: id, userId },
      {
        lastSeenAt: new Date(),
        ...(req.body.availableRamBytes && { availableRamBytes: req.body.availableRamBytes }),
        ...(req.body.freeStorageBytes && { freeStorageBytes: req.body.freeStorageBytes }),
        ...(req.body.batteryLevel !== undefined && { batteryLevel: req.body.batteryLevel }),
        ...(req.body.isCharging !== undefined && { isCharging: req.body.isCharging }),
      },
      { new: true }
    );

    if (!device) {
      return sendError(res, 'Device not found', 404);
    }

    sendSuccess(res, 'Heartbeat recorded', device);
  } catch (error) {
    next(error);
  }
};

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
