const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const logActivity = require('../utils/activityLogger');

exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user.id;
    
    // 1. Prevent duplicate applications
    const existing = await Application.findOne({ studentId: userId, jobId });
    if (existing) return res.status(400).json({ message: 'You have already joined this opportunity' });

    // 2. Fetch student to check for stored resume
    const student = await User.findById(userId);
    let resumePath = '';

    if (req.file) {
      // Use uploaded file
      resumePath = req.file.path;
      // Update user's default resume if they don't have one
      if (!student.resume) {
        student.resume = resumePath;
        await student.save();
      }
    } else if (student.resume) {
      // Use stored resume (One-Click Join)
      resumePath = student.resume;
    } else {
      return res.status(400).json({ message: 'Please upload your resume to join' });
    }

    const application = new Application({
      studentId: userId,
      jobId,
      resume: resumePath
    });

    await application.save();
    const job = await Job.findById(jobId);
    await logActivity(student._id, student.name, 'Joined', `Joined ${job.title}`, application._id);
    
    res.status(201).json({ 
      message: 'You have successfully joined this opportunity', 
      application,
      resumeUsed: resumePath 
    });
  } catch (error) {
    console.error('Apply Job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getApplications = async (req, res) => {
  try {
    if (req.user.role === 'student') {
      const applications = await Application.find({ studentId: req.user.id })
        .populate({ path: 'jobId', populate: { path: 'companyId', select: 'name' } });
      return res.json(applications);
    }
    
    if (req.user.role === 'company') {
      // Find all jobs posted by this company
      const jobs = await Job.find({ companyId: req.user.id }).select('_id');
      const jobIds = jobs.map(j => j._id);
      
      const applications = await Application.find({ jobId: { $in: jobIds } })
        .populate('studentId', 'name email')
        .populate('jobId', 'title');
      return res.json(applications);
    }

    // Admin sees all
    const applications = await Application.find()
      .populate('studentId', 'name email')
      .populate('jobId', 'title');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate('jobId');
    
    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Only the company that posted the job or an admin can update status
    if (req.user.role === 'company' && application.jobId.companyId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    application.status = status;
    await application.save();
    
    const user = await User.findById(req.user.id);
    const student = await User.findById(application.studentId);
    await logActivity(user._id, user.name, 'Updated Status', `${status} for ${student.name}'s application`, application._id);
    
    res.json({ message: 'Status updated successfully', application });
  } catch (error) {
    console.error('Update Status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
