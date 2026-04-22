const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userRole: { type: String, enum: ['admin', 'company'], default: 'admin' },
  targetRole: { type: String, enum: ['all', 'student', 'company'], default: 'all' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notice', noticeSchema);
