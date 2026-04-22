const Activity = require('../models/Activity');

const logActivity = async (userId, userName, action, details, targetId = null) => {
  try {
    const activity = new Activity({
      user: userId,
      userName,
      action,
      details,
      targetId
    });
    await activity.save();
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

module.exports = logActivity;
