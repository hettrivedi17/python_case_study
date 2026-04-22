const express = require('express');
const router = express.Router();
const { createJob, getJobs, updateJob, deleteJob, getStats } = require('../controllers/jobController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, getJobs);
router.post('/', auth, authorize('company'), createJob);
router.put('/:id', auth, authorize('company'), updateJob);
router.delete('/:id', auth, authorize('company'), deleteJob);

// Public stats (authenticated)
router.get('/stats', auth, getStats);

module.exports = router;
