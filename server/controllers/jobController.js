const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');
const logActivity = require('../utils/activityLogger');

exports.createJob = async (req, res) => {
  try {
    const { title, description, location, salary, jobType, category, deadline } = req.body;
    const job = new Job({
      title,
      description,
      location,
      salary,
      jobType,
      category,
      deadline,
      companyId: req.user.id
    });
    await job.save();
    const user = await User.findById(req.user.id);
    await logActivity(user._id, user.name, 'Posted Job', `Created ${title} (${jobType})`, job._id);
    res.status(201).json(job);
  } catch (error) {
    console.error('Create Job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // If company, get only their jobs
    if (req.user.role === 'company') {
      query.companyId = req.user.id;
      const jobs = await Job.find(query).populate('companyId', 'name');
      return res.json(jobs);
    }
    
    const jobs = await Job.find(query).populate('companyId', 'name');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.id },
      req.body,
      { new: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, companyId: req.user.id });
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });
    // Also delete associated applications
    await Application.deleteMany({ jobId: req.params.id });
    const user = await User.findById(req.user.id);
    await logActivity(user._id, user.name, 'Deleted Job', `Removed ${job.title}`, job._id);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Delete Job error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCompanies = await User.countDocuments({ role: 'company' });
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();
    const totalInternships = await Job.countDocuments({ jobType: 'Internship' });
    
    // Get Internship Applications count
    const internshipJobs = await Job.find({ jobType: 'Internship' }).select('_id');
    const internshipJobIds = internshipJobs.map(j => j._id);
    const totalInternshipApplications = await Application.countDocuments({ jobId: { $in: internshipJobIds } });
    
    res.json({ 
      totalStudents, 
      totalCompanies, 
      totalJobs, 
      totalApplications, 
      totalInternships,
      totalInternshipApplications
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
