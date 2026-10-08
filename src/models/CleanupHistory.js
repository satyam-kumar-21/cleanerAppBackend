export const CleanupHistoryModel = {
  name: 'CleanupHistory',
  schema: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }
};

export default CleanupHistoryModel;
