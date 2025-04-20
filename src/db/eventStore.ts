import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';
import { CalendarEvent, Reminder } from '../lib/types';

// Initialize localForage stores
const eventStore = localforage.createInstance({
  name: 'calendar-app',
  storeName: 'events'
});

const reminderStore = localforage.createInstance({
  name: 'calendar-app',
  storeName: 'reminders'
});

// Events CRUD
export const getEvents = async (): Promise<CalendarEvent[]> => {
  try {
    const keys = await eventStore.keys();
    const events: CalendarEvent[] = [];
    
    for (const key of keys) {
      const event = await eventStore.getItem<CalendarEvent>(key);
      if (event) {
        // Convert ISO date strings back to Date objects
        event.start = new Date(event.start);
        event.end = new Date(event.end);
        events.push(event);
      }
    }
    
    return events;
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return [];
  }
};

export const getEvent = async (id: string): Promise<CalendarEvent | null> => {
  try {
    const event = await eventStore.getItem<CalendarEvent>(id);
    if (event) {
      // Convert ISO date strings back to Date objects
      event.start = new Date(event.start);
      event.end = new Date(event.end);
      return event;
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch event ${id}:`, error);
    return null;
  }
};

export const createEvent = async (eventData: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> => {
  try {
    const id = uuidv4();
    const event: CalendarEvent = {
      ...eventData,
      id
    };
    
    await eventStore.setItem(id, event);
    return event;
  } catch (error) {
    console.error('Failed to create event:', error);
    throw new Error('Failed to create event');
  }
};

export const updateEvent = async (id: string, eventData: Partial<CalendarEvent>): Promise<CalendarEvent> => {
  try {
    const existingEvent = await getEvent(id);
    if (!existingEvent) {
      throw new Error(`Event with ID ${id} not found`);
    }
    
    const updatedEvent: CalendarEvent = {
      ...existingEvent,
      ...eventData
    };
    
    await eventStore.setItem(id, updatedEvent);
    return updatedEvent;
  } catch (error) {
    console.error(`Failed to update event ${id}:`, error);
    throw error;
  }
};

export const deleteEvent = async (id: string): Promise<boolean> => {
  try {
    await eventStore.removeItem(id);
    
    // Also delete associated reminders
    const reminders = await getReminders();
    const eventReminders = reminders.filter(r => r.eventId === id);
    
    for (const reminder of eventReminders) {
      await reminderStore.removeItem(reminder.id);
    }
    
    return true;
  } catch (error) {
    console.error(`Failed to delete event ${id}:`, error);
    return false;
  }
};

// Reminders CRUD
export const getReminders = async (): Promise<Reminder[]> => {
  try {
    const keys = await reminderStore.keys();
    const reminders: Reminder[] = [];
    
    for (const key of keys) {
      const reminder = await reminderStore.getItem<Reminder>(key);
      if (reminder) {
        // Convert ISO date strings back to Date objects
        reminder.time = new Date(reminder.time);
        reminders.push(reminder);
      }
    }
    
    return reminders;
  } catch (error) {
    console.error('Failed to fetch reminders:', error);
    return [];
  }
};

export const getEventReminders = async (eventId: string): Promise<Reminder[]> => {
  try {
    const allReminders = await getReminders();
    return allReminders.filter(reminder => reminder.eventId === eventId);
  } catch (error) {
    console.error(`Failed to fetch reminders for event ${eventId}:`, error);
    return [];
  }
};

export const createReminder = async (reminderData: Omit<Reminder, 'id'>): Promise<Reminder> => {
  try {
    const id = uuidv4();
    const reminder: Reminder = {
      ...reminderData,
      id
    };
    
    await reminderStore.setItem(id, reminder);
    return reminder;
  } catch (error) {
    console.error('Failed to create reminder:', error);
    throw new Error('Failed to create reminder');
  }
};

export const deleteReminder = async (id: string): Promise<boolean> => {
  try {
    await reminderStore.removeItem(id);
    return true;
  } catch (error) {
    console.error(`Failed to delete reminder ${id}:`, error);
    return false;
  }
}; 