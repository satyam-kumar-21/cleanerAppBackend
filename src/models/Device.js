export const DeviceModel = {
  name: 'Device',
  schema: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }
};

export default DeviceModel;
