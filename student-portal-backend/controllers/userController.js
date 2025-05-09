// student-portal-backend/controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Not strictly needed here if matchPassword is on model, but good to have for other ops

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public (or Admin only in production)
exports.registerUser = async (req, res) => {
  const { name, email, password, role, studentId } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password, // Will be hashed by pre-save hook
      role: role || 'student', // Default to student if not provided
      studentId
    });

    await user.save();

    // For registration, you might not want to send a token immediately,
    // or you might want to, depending on your flow.
    // For simplicity, we'll just send a success message.
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { userId: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error('Register error:', error.message);
    if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide an email and password' });
  }

  try {
    // Check for user
    const user = await User.findOne({ email }).select('+password'); // Explicitly select password

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials (user not found)' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials (password mismatch)' });
    }

    // User matched, create JWT
    const payload = {
      user: {
        id: user._id,
        role: user.role,
        name: user.name
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET, // You need to set this in your .env file
      { expiresIn: '1h' }, // Token expiration (e.g., 1 hour)
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          token,
          user: { // Send some user info back, excluding password
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};