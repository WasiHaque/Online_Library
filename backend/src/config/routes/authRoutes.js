const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

// Authentication routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify/:token', authController.verifyEmail);

// Protected route example
router.get('/profile', auth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router; 