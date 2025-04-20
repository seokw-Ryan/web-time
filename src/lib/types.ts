export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  isAllDay: boolean;
  recurrenceRule?: string; // RRULE string format
  reminders?: Reminder[];
  location?: string;
  color?: string;
}

export interface Reminder {
  id: string;
  eventId: string;
  time: Date;
  type: 'notification' | 'email';
  message?: string;
}

export interface CalendarViewState {
  currentDate: Date;
  view: 'month' | 'week' | 'day';
  events: CalendarEvent[];
  loading: boolean;
  error: Error | null;
}

export interface RecurrenceSettings {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: Date;
  occurrences?: number;
  weekdays?: number[]; // 0-6 for Sunday-Saturday
  monthDay?: number;
  monthByDay?: {
    day: number; // 0-6 for Sunday-Saturday
    instance: number; // 1-5 or -1 for last
  };
} 