import Device from '../models/Device.js';
import { sendSuccess, sendError } from '../utils/response.js';

// Check if device exists for user
export const checkDevice = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { deviceId } = req.params;

    if (!deviceId) {
      return sendError(res, 'deviceId is required', 400);
    }

    const device = await Device.findOne({ userId, deviceId });

    if (device) {
      sendSuccess(res, 'Device found', device);
    } else {
      sendSuccess(res, 'Device not found', null);
    }
  } catch (error) {
    next(error);
  }
};

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

    // Check if device already exists
    const existingDevice = await Device.findOne({ userId, deviceId });

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

    if (existingDevice) {
      // Update existing device
      Object.assign(existingDevice, deviceData);
      await existingDevice.save();
      
      console.log(`Device ${deviceId} updated for user ${userId}`);
      sendSuccess(res, 'Device updated successfully', existingDevice, 200);
    } else {
      // Create new device with proper duplicate handling
      try {
        const device = await Device.findOneAndUpdate(
          { userId, deviceId },
          deviceData,
          { 
            new: true, 
            upsert: true, 
            runValidators: true,
            setDefaultsOnInsert: true
          }
        );
        
        console.log(`Device ${deviceId} registered for user ${userId}`);
        sendSuccess(res, 'Device registered successfully', device, 201);
      } catch (duplicateError) {
        // Handle potential race condition - if device was created between our check and upsert
        if (duplicateError.code === 11000) {
          const device = await Device.findOne({ userId, deviceId });
          if (device) {
            Object.assign(device, deviceData);
            await device.save();
            
            console.log(`Device ${deviceId} updated after duplicate key error for user ${userId}`);
            sendSuccess(res, 'Device updated successfully', device, 200);
          } else {
            throw duplicateError;
          }
        } else {
          throw duplicateError;
        }
      }
    }
  } catch (error) {
    console.error('Device registration error:', error);
    next(error);
  }
};

// Get all user devices
export const getUserDevices = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const devices = await Device.find({ userId }).sort({ lastSeenAt: -1 });
    const seenDeviceIds = new Set();
    const uniqueDevices = devices.filter((device) => {
      if (seenDeviceIds.has(device.deviceId)) return false;
      seenDeviceIds.add(device.deviceId);
      return true;
    });

    sendSuccess(res, 'Devices retrieved successfully', uniqueDevices);
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
      'manufacturer',
      'model',
      'osVersion',
      'appVersion',
      'architecture',
      'processorName',
      'coreCount',
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

// Remove a device belonging to the authenticated user
export const removeDevice = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const device = await Device.findOne({ _id: id, userId });

    if (!device) {
      return sendError(res, 'Device not found', null, 404);
    }

    await Device.deleteMany({ userId, deviceId: device.deviceId });

    sendSuccess(res, 'Device removed successfully', { id: device._id });
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
