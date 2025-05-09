// student-portal-backend/routes/reportr.js
const express = require('express');
const router = express.Router();
// Import both controller functions
const { submitReport, getAllReports } = require('../controllers/reportc');

// @route   POST /api/reports/submit
// @desc    Submit a new bullying report
router.post('/submit', submitReport);

// @route   GET /api/reports
// @desc    Get all bullying reports
// @access  Protected (should be for admin/warden only in a real app)
router.get('/', getAllReports); // <--- ADD THIS LINE

module.exports = router;