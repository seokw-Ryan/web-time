const express = require('express');
const taskController = require('../controllers/taskController');

const router = express.Router();

// Create a new task for a user
router.post('/users/:userId/tasks', taskController.createTaskForUser);

// Get tasks for a user
router.get('/users/:userId/tasks', taskController.getTasksForUser);

module.exports = router;
