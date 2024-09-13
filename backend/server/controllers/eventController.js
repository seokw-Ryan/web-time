const Event = require('../models/Event');
const User = require('../models/User');
const moment = require('moment-timezone');

// Get Events
exports.getEvents = async (req, res) => {
    try {
        const { userId, mode, startDate, endDate } = req.query;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let query = { userId };

        if (mode) {
            query.mode = mode;
            if (mode === 'plan') {
                query.startTime = { $gte: new Date() };
            }
        }

        if (startDate && endDate) {
            query.startTime = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const events = await Event.find(query).sort({ startTime: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving events', error: error.message });
    }
};

// Create Event
exports.createEvent = async (req, res) => {
    try {
        const { title, startTime, endTime, location, description, mode, userId } = req.body;

        if (!title || !startTime || !endTime || !location || !description || !mode || !userId) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userTimeZone = user.timeZone;
        const convertedStartTime = moment.tz(startTime, userTimeZone).toDate();
        const convertedEndTime = moment.tz(endTime, userTimeZone).toDate();

        const newEvent = new Event({
            title,
            startTime: convertedStartTime,
            endTime: convertedEndTime,
            location,
            description,
            mode,
            userId
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error: error.message });
    }
};

// Update Event
exports.updateEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { title, startTime, endTime, location, description, mode } = req.body;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (mode === 'plan' && new Date(event.startTime) < new Date()) {
            return res.status(400).json({ message: 'Cannot edit past events in plan mode' });
        }

        const user = await User.findById(event.userId);
        const userTimeZone = user.timeZone;

        event.title = title || event.title;
        event.startTime = startTime ? moment.tz(startTime, userTimeZone).toDate() : event.startTime;
        event.endTime = endTime ? moment.tz(endTime, userTimeZone).toDate() : event.endTime;
        event.location = location || event.location;
        event.description = description || event.description;
        event.mode = mode || event.mode;

        await event.save();
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error updating event', error: error.message });
    }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { userId } = req.body;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.userId.toString() !== userId) {
            return res.status(403).json({ message: 'User not authorized to delete this event' });
        }

        await Event.findByIdAndDelete(eventId);
        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
};
