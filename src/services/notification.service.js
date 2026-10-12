import User from "../models/User.js";

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const EXPO_BATCH_SIZE = 100;

export const sendPushNotification = async ({ userId, title, body, data = {} }) => {
  const query = {
    "preferences.notifications": true,
    expoPushTokens: { $exists: true, $ne: [] },
  };
  if (userId) query._id = userId;

  const users = await User.find(query).select("+expoPushTokens");
  const messages = users.flatMap((user) =>
    user.expoPushTokens.map((to) => ({
      to,
      title,
      body,
      data,
      sound: "default",
      priority: "high",
    }))
  );

  let sent = 0;
  const errors = [];

  for (let offset = 0; offset < messages.length; offset += EXPO_BATCH_SIZE) {
    const batch = messages.slice(offset, offset + EXPO_BATCH_SIZE);
    const response = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batch),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result?.errors?.[0]?.message || "Expo push service rejected the notification");
    }

    for (const ticket of result.data || []) {
      if (ticket.status === "ok") sent += 1;
      else errors.push(ticket.message || ticket.details?.error || "Expo rejected a push notification");
    }
  }

  return { sent, skipped: messages.length === 0, errors };
};

export const notificationService = {
  sendPushNotification,
};

export default notificationService;
