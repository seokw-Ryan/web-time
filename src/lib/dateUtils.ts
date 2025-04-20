import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  eachDayOfInterval,
  eachWeekOfInterval,
  isSameDay,
  isSameMonth,
  format,
  addDays,
  addWeeks,
  addMonths,
  subMonths,
  subWeeks,
  subDays,
  getHours,
  getMinutes,
  setHours,
  setMinutes
} from 'date-fns';
import { CalendarEvent } from './types';
import { RRule } from 'rrule';

/**
 * Get all days in a month including days from previous/next month to fill weeks
 */
export const getCalendarMonthDays = (date: Date) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  return eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });
};

/**
 * Get all days in the specified week
 */
export const getCalendarWeekDays = (date: Date) => {
  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(date);

  return eachDayOfInterval({
    start: weekStart,
    end: weekEnd
  });
};

/**
 * Generate time slots for a day or week view
 */
export const generateTimeSlots = (startHour = 0, endHour = 23, hourStep = 1) => {
  const slots = [];
  for (let hour = startHour; hour <= endHour; hour += hourStep) {
    slots.push(hour);
  }
  return slots;
};

/**
 * Check if an event occurs on a specific day
 */
export const doesEventOccurOnDay = (event: CalendarEvent, date: Date): boolean => {
  // Simple case - non-recurring event
  if (!event.recurrenceRule) {
    const eventStart = startOfDay(event.start);
    const eventEnd = endOfDay(event.end);
    const targetDate = startOfDay(date);
    
    return targetDate >= eventStart && targetDate <= eventEnd;
  }
  
  // Recurring event
  try {
    const rule = RRule.fromString(event.recurrenceRule);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    
    // Check if any occurrence falls on the target date
    const occurrences = rule.between(
      new Date(Math.max(dayStart.getTime(), event.start.getTime())),
      dayEnd,
      true
    );
    
    return occurrences.length > 0;
  } catch (error) {
    console.error('Error processing recurrence rule:', error);
    return false;
  }
};

/**
 * Filter events that occur on a specific day
 */
export const getEventsForDay = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  return events.filter(event => doesEventOccurOnDay(event, date));
};

/**
 * Format a date with the specified format string
 */
export const formatDate = (date: Date, formatStr: string): string => {
  return format(date, formatStr);
};

/**
 * Navigation helpers
 */
export const goToPreviousMonth = (date: Date): Date => subMonths(date, 1);
export const goToNextMonth = (date: Date): Date => addMonths(date, 1);
export const goToPreviousWeek = (date: Date): Date => subWeeks(date, 1);
export const goToNextWeek = (date: Date): Date => addWeeks(date, 1);
export const goToPreviousDay = (date: Date): Date => subDays(date, 1);
export const goToNextDay = (date: Date): Date => addDays(date, 1);
export const goToToday = (): Date => new Date(); 