import express from 'express';
import {
  getAllReminders,
  getRemindersByEventId,
  createReminder,
  deleteReminder
} from '../controllers/remindersController';

const router = express.Router();

// Get all reminders
router.get('/', getAllReminders);

// Get all reminders for a specific event
router.get('/event/:eventId', getRemindersByEventId);

// Create a new reminder
router.post('/', createReminder);

// Delete a reminder by ID
router.delete('/:id', deleteReminder);

export default router;
