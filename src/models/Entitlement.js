export const EntitlementModel = {
  name: 'Entitlement',
  schema: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }
};

export default EntitlementModel;
