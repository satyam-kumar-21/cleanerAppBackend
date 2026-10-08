export const LicenseModel = {
  name: 'License',
  schema: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }
};

export default LicenseModel;
