// server/controllers/remindersController.ts
import { Request, Response } from 'express';
import * as ReminderModel from '../models/reminderModel';
import { v4 as uuidv4 } from 'uuid';

export const getAllReminders = async (req: Request, res: Response) => {
  try {
    const reminders = await ReminderModel.getAllReminders();
    res.json(reminders);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ message: 'Failed to fetch reminders' });
  }
};

export const getRemindersByEventId = async (req: Request, res: Response) => {
  try {
    const { eventId } = req.params;
    const reminders = await ReminderModel.getRemindersByEventId(eventId);
    res.json(reminders);
  } catch (error) {
    console.error(`Error fetching reminders for event ${req.params.eventId}:`, error);
    res.status(500).json({ message: 'Failed to fetch reminders' });
  }
};

export const createReminder = async (req: Request, res: Response) => {
  try {
    const id = uuidv4();
    const newReminder = { ...req.body, id };
    await ReminderModel.createReminder(newReminder);
    res.status(201).json(newReminder);
  } catch (error) {
    console.error('Error creating reminder:', error);
    res.status(500).json({ message: 'Failed to create reminder' });
  }
};

export const deleteReminder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await ReminderModel.deleteReminder(id);
    res.status(204).end();
  } catch (error) {
    console.error(`Error deleting reminder ${req.params.id}:`, error);
    res.status(500).json({ message: 'Failed to delete reminder' });
  }
};