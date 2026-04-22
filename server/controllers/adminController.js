const User = require('../models/User');
const Application = require('../models/Application');
const Job = require('../models/Job');
const Activity = require('../models/Activity');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const companies = await User.find({ role: 'company' }).select('name email createdAt');
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getSystemActivity = async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .populate('user', 'name role');
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStudentDetails = async (req, res) => {
  try {
    const student = await User.findById(req.params.id).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    
    const applications = await Application.find({ studentId: req.params.id })
      .populate({ path: 'jobId', select: 'title', populate: { path: 'companyId', select: 'name' } });
      
    res.json({ student, applications });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
