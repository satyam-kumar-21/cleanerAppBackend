export const RemoteConfigModel = {
  name: 'RemoteConfig',
  schema: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }
};

export default RemoteConfigModel;
