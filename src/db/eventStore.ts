// @ts-nocheck
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { CalendarEvent, Reminder } from '../lib/types';

const API_BASE = 'http://localhost:3000'; // change to your backend URL in prod

// Events CRUD
export const getEvents = async (): Promise<CalendarEvent[]> => {
  try {
    const res = await axios.get<CalendarEvent[]>(`${API_BASE}/events`);
    return res.data.map(event => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    }));
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return [];
  }
};

export const getEvent = async (id: string): Promise<CalendarEvent | null> => {
  try {
    const res = await axios.get<CalendarEvent>(`${API_BASE}/events/${id}`);
    const event = res.data;
    return {
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    };
  } catch (error) {
    console.error(`Failed to fetch event ${id}:`, error);
    return null;
  }
};

export const createEvent = async (eventData: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => {
  try {
    const res = await axios.post<CalendarEvent>(`${API_BASE}/events`, eventData);
    return res.data;
  } catch (error) {
    console.error('Failed to create event:', error);
    throw new Error('Failed to create event');
  }
};

export const updateEvent = async (id: string, eventData: Partial<CalendarEvent>): Promise<CalendarEvent> => {
  try {
    const res = await axios.put<CalendarEvent>(`${API_BASE}/events/${id}`, eventData);
    return res.data;
  } catch (error) {
    console.error(`Failed to update event ${id}:`, error);
    throw error;
  }
};

export const deleteEvent = async (id: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_BASE}/events/${id}`);
    return true;
  } catch (error) {
    console.error(`Failed to delete event ${id}:`, error);
    return false;
  }
};

// Reminders CRUD
export const getReminders = async (): Promise<Reminder[]> => {
  try {
    const res = await axios.get<Reminder[]>(`${API_BASE}/reminders`);
    return res.data.map(reminder => ({
      ...reminder,
      time: new Date(reminder.time),
    }));
  } catch (error) {
    console.error('Failed to fetch reminders:', error);
    return [];
  }
};

export const getEventReminders = async (eventId: string): Promise<Reminder[]> => {
  try {
    const res = await axios.get<Reminder[]>(`${API_BASE}/events/${eventId}/reminders`);
    return res.data.map(reminder => ({
      ...reminder,
      time: new Date(reminder.time),
    }));
  } catch (error) {
    console.error(`Failed to fetch reminders for event ${eventId}:`, error);
    return [];
  }
};

export const createReminder = async (reminderData: Omit<Reminder, 'id'>): Promise<Reminder> => {
  try {
    const res = await axios.post<Reminder>(`${API_BASE}/reminders`, reminderData);
    return res.data;
  } catch (error) {
    console.error('Failed to create reminder:', error);
    throw new Error('Failed to create reminder');
  }
};

export const deleteReminder = async (id: string): Promise<boolean> => {
  try {
    await axios.delete(`${API_BASE}/reminders/${id}`);
    return true;
  } catch (error) {
    console.error(`Failed to delete reminder ${id}:`, error);
    return false;
  }
};
