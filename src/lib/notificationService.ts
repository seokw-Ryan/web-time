import { Reminder } from './types';
import { getEventReminders } from '../db/eventStore';
import { formatDate } from './dateUtils';

// Store notification permission state
let currentPermission: NotificationPermission = 'default';

/**
 * Initialize the notification service and request permissions if needed
 */
export const initNotifications = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  currentPermission = Notification.permission;
  
  if (currentPermission === 'granted') {
    return true;
  }

  if (currentPermission !== 'denied') {
    try {
      const permission = await Notification.requestPermission();
      currentPermission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // @ts-ignore - TypeScript has strict literal comparison issues
  return currentPermission === 'granted';
};

/**
 * Show a notification for a reminder
 */
export const showNotification = (
  title: string,
  options: NotificationOptions = {}
): boolean => {
  if (currentPermission !== 'granted') {
    console.warn('Notification permission not granted');
    return false;
  }

  try {
    new Notification(title, options);
    return true;
  } catch (error) {
    console.error('Error showing notification:', error);
    return false;
  }
};

/**
 * Schedule a reminder notification
 */
export const scheduleReminder = (reminder: Reminder, eventTitle: string): void => {
  const now = new Date();
  const reminderTime = reminder.time;
  const delay = reminderTime.getTime() - now.getTime();

  // Don't schedule if the time is in the past
  if (delay <= 0) return;

  setTimeout(() => {
    const formattedTime = formatDate(reminderTime, 'h:mm a');
    showNotification(
      `Event Reminder: ${eventTitle}`,
      {
        body: reminder.message || `You have an event at ${formattedTime}`,
        icon: '/icons/notification-icon.png',
        tag: `reminder-${reminder.id}`,
        requireInteraction: true
      }
    );
  }, delay);
};

/**
 * Schedule all pending reminders for events
 */
export const schedulePendingReminders = async (events: any[]): Promise<void> => {
  if (currentPermission !== 'granted') {
    await initNotifications();
  }

  if (currentPermission !== 'granted') {
    console.warn('Cannot schedule reminders without notification permission');
    return;
  }

  for (const event of events) {
    const reminders = await getEventReminders(event.id);
    reminders.forEach(reminder => {
      // Only schedule reminders that are in the future
      if (reminder.time.getTime() > Date.now()) {
        scheduleReminder(reminder, event.title);
      }
    });
  }
}; 