import express from 'express';
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/eventsController';

const router = express.Router();

router.get('/', getAllEvents);
// router.get('/:id', getEventById); //something weird error with this, fix later
router.post('/', createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;
