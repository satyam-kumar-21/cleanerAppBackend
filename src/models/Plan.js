export const PlanModel = {
  name: 'Plan',
  schema: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }
};

export default PlanModel;
