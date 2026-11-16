const express = require('express');
const router = express.Router();

const {
    register,
    login,
    getProfile
} = require('../controllers/authController');

const {
    authenticateToken
} = require('../middleware/authMiddleware');

// REGISTER
router.post('/register', register);

// LOGIN
router.post('/login', login);

// GET PROFILE (Protected)
router.get('/me', authenticateToken, getProfile);

module.exports = router;