// server/controllers/eventsController.ts
import { Request, Response } from 'express';
import * as EventModel from '../models/eventModel';
import { v4 as uuidv4 } from 'uuid';

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await EventModel.getAllEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events' });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await EventModel.getEventById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event' });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const id = uuidv4();
    const newEvent = { ...req.body, id };
    await EventModel.createEvent(newEvent);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event' });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const updated = await EventModel.updateEvent(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    await EventModel.deleteEvent(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event' });
  }
};
