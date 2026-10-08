export const UsageModel = {
  name: 'Usage',
  schema: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }
};

export default UsageModel;
