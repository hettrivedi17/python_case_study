const express = require('express');
const router = express.Router();
const { createNotice, getNotices, deleteNotice } = require('../controllers/noticeController');
const { auth, authorize } = require('../middleware/auth');

router.get('/', auth, getNotices);
router.post('/', auth, authorize('admin', 'company'), createNotice);
router.delete('/:id', auth, authorize('admin', 'company'), deleteNotice);

module.exports = router;
