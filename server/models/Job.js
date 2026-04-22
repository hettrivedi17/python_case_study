const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
  jobType: { type: String, enum: ['Full-time', 'Internship'], default: 'Full-time' },
  category: { type: String, default: 'Engineering' },
  deadline: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
