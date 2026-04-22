const express = require('express');
const router = express.Router();
const { applyForJob, getApplications, updateStatus } = require('../controllers/applicationController');
const { auth, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', auth, authorize('student'), upload.single('resume'), applyForJob);
router.get('/', auth, getApplications);
router.put('/:id/status', auth, authorize(['company', 'admin']), updateStatus);

module.exports = router;
