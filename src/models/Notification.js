export const NotificationModel = {
  name: 'Notification',
  schema: {
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }
};

export default NotificationModel;
