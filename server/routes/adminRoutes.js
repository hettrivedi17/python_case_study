const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, getCompanies, getSystemActivity, getStudentDetails } = require('../controllers/adminController');
const { auth, authorize } = require('../middleware/auth');

router.get('/users', auth, authorize('admin'), getAllUsers);
router.delete('/users/:id', auth, authorize('admin'), deleteUser);
router.get('/companies', auth, authorize('admin'), getCompanies);
router.get('/activity', auth, authorize('admin'), getSystemActivity);
router.get('/student/:id', auth, authorize('admin'), getStudentDetails);

module.exports = router;
