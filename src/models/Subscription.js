export const SubscriptionModel = {
  name: 'Subscription',
  schema: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }
};

export default SubscriptionModel;
