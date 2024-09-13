const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { validateRegistration, validateLogin } = require('../middleware/validation');

// User registration route
router.post('/register', validateRegistration, registerUser);

// User login route
router.post('/login', validateLogin, loginUser);

module.exports = router;
