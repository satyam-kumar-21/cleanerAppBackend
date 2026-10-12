import User from "../models/User.js";

// GET /api/v1/users/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get user profile",
    });
  }
};

// PATCH /api/v1/users/me
export const updateMe = async (req, res) => {
  try {
    const { name, avatar, preferences, expoPushToken } = req.body;

    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;

    if (preferences !== undefined) {
      if (!preferences || typeof preferences !== "object" || Array.isArray(preferences)) {
        return res.status(400).json({ success: false, message: "Preferences must be an object" });
      }

      const allowedPreferences = ["language", "theme", "notifications"];
      if (Object.keys(preferences).some((key) => !allowedPreferences.includes(key))) {
        return res.status(400).json({ success: false, message: "Unsupported preference" });
      }

      const { language, theme, notifications } = preferences;
      if (language !== undefined && !["en", "hi", "es", "fr", "de", "zh"].includes(language)) {
        return res.status(400).json({ success: false, message: "Unsupported language" });
      }
      if (theme !== undefined && !["light", "dark"].includes(theme)) {
        return res.status(400).json({ success: false, message: "Unsupported theme" });
      }
      if (notifications !== undefined && typeof notifications !== "boolean") {
        return res.status(400).json({ success: false, message: "Notifications preference must be boolean" });
      }

      if (!user.preferences) user.preferences = {};
      if (language !== undefined) user.preferences.language = language;
      if (theme !== undefined) user.preferences.theme = theme;
      if (notifications !== undefined) {
        user.preferences.notifications = notifications;
        if (!notifications) user.expoPushTokens = [];
      }
    }

    if (expoPushToken !== undefined) {
      if (
        typeof expoPushToken !== "string" ||
        !/^Expo(?:nent)?PushToken\[[^\]]+\]$/.test(expoPushToken)
      ) {
        return res.status(400).json({ success: false, message: "Invalid Expo push token" });
      }
      if (!user.preferences.notifications) {
        return res.status(400).json({ success: false, message: "Enable notifications before registering a device" });
      }
      user.expoPushTokens.addToSet(expoPushToken);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

// DELETE /api/v1/users/me
export const deleteMe = async (req, res) => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Soft delete — marks as DELETED, doesn't remove from DB
    user.status = "DELETED";
    await user.save();

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete account",
    });
  }
};

export default { getMe, updateMe, deleteMe };