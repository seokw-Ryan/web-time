const express = require('express');
const router = express.Router();
const Event = require('./models/Event');

// Create
router.post('/events', async (req, res) => {
  try {
    const newEvent = await Event.create(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: "Error creating event", error: error.message });
  }
});

// Read (all events)
router.get('/events', async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error: error.message });
  }
});

// Read (single event)
router.get('/events/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching event", error: error.message });
  }
});

// Update
router.put('/events/:id', async (req, res) => {
  try {
    const [updated] = await Event.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedEvent = await Event.findByPk(req.params.id);
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(400).json({ message: "Error updating event", error: error.message });
  }
});

// Delete
router.delete('/events/:id', async (req, res) => {
  try {
    const deleted = await Event.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send("Event deleted");
    } else {
      res.status(404).json({ message: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting event", error: error.message });
  }
});

module.exports = router;