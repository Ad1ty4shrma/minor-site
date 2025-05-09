const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Multer config

const {
  createOutpass,
  getAllOutpasses,
  updateOutpassStatus,
} = require('../controllers/outpassController');

// @route   POST /api/outpass/create
// @desc    Submit a new outpass with an image
router.post('/create', upload.single('image'), createOutpass);

// @route   GET /api/outpass
// @desc    Get all outpasses
router.get('/', getAllOutpasses);

// @route   PUT /api/outpass/:id
// @desc    Update outpass status
router.put('/:id', updateOutpassStatus);

module.exports = router;
