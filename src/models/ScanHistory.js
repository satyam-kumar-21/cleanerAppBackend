export const ScanHistoryModel = {
  name: 'ScanHistory',
  schema: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }
};

export default ScanHistoryModel;
