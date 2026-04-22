const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  resume: { type: String, required: true }, // Path to the uploaded PDF
  status: { 
    type: String, 
    enum: ['Pending', 'Shortlisted', 'Interview Scheduled', 'Accepted', 'Rejected'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
