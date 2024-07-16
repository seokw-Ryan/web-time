const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Create a new user
router.post('/signup', userController.createUser);

// Get all users
router.get('/', userController.getAllUsers);

module.exports = router;