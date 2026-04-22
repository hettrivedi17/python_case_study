const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userName: { type: String, required: true },
  action: { type: String, required: true }, // e.g., 'Applied for Job', 'Posted a Job', 'Registered'
  details: { type: String }, // e.g., 'Applied for Software Engineer role'
  targetId: { type: mongoose.Schema.Types.ObjectId }, // e.g., JobId or ApplicationId
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', activitySchema);
