const Notice = require('../models/Notice');
const logActivity = require('../utils/activityLogger');
const User = require('../models/User');

exports.createNotice = async (req, res) => {
  try {
    const { title, content, targetRole } = req.body;
    const notice = new Notice({
      title,
      content,
      postedBy: req.user.id,
      userRole: req.user.role,
      targetRole: targetRole || 'all'
    });
    await notice.save();
    
    const user = await User.findById(req.user.id);
    await logActivity(user._id, user.name, 'Posted Notice', `Published: ${title}`, notice._id);
    
    res.status(201).json(notice);
  } catch (error) {
    console.error('Create Notice error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find()
      .populate('postedBy', 'name role')
      .sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    
    // Only author or admin can delete
    if (req.user.role !== 'admin' && notice.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
