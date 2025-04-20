import { createEvent as createICSEvent, EventAttributes } from 'ics';
import { CalendarEvent } from './types';
import { RRule } from 'rrule';
import { format } from 'date-fns';

/**
 * Convert a date to ICS format [year, month, day, hour, minute]
 */
export const dateToICSFormat = (date: Date): [number, number, number, number, number] => {
  return [
    date.getFullYear(),
    date.getMonth() + 1, // ICS uses 1-indexed months
    date.getDate(),
    date.getHours(),
    date.getMinutes()
  ];
};

/**
 * Export a single event to ICS format
 */
export const exportEventToICS = (event: CalendarEvent): Promise<string> => {
  return new Promise((resolve, reject) => {
    const icsEvent: EventAttributes = {
      start: dateToICSFormat(event.start),
      end: dateToICSFormat(event.end),
      title: event.title,
      description: event.description || '',
      location: event.location || '',
      status: event.recurrenceRule ? 'CONFIRMED' : undefined,
      busyStatus: 'BUSY',
      productId: 'minimal-calendar-app'
    };

    // Add recurrence rule if available
    if (event.recurrenceRule) {
      icsEvent.recurrenceRule = event.recurrenceRule;
    }

    createICSEvent(icsEvent, (error, value) => {
      if (error) {
        reject(error);
      } else {
        resolve(value || '');
      }
    });
  });
};

/**
 * Export multiple events to ICS format
 */
export const exportEventsToICS = async (events: CalendarEvent[]): Promise<string> => {
  try {
    const icsPromises = events.map(event => exportEventToICS(event));
    const icsContents = await Promise.all(icsPromises);
    
    // Combine all events into a single ICS file
    const combinedICS = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Minimal Calendar App//EN',
      'CALSCALE:GREGORIAN',
      ...icsContents.map(content => 
        // Remove BEGIN:VCALENDAR and END:VCALENDAR from individual events
        content.replace(/BEGIN:VCALENDAR\r?\n|END:VCALENDAR\r?\n/g, '')
      ),
      'END:VCALENDAR'
    ].join('\r\n');
    
    return combinedICS;
  } catch (error) {
    console.error('Error exporting events to ICS:', error);
    throw error;
  }
};

/**
 * Download ICS content as a file
 */
export const downloadICS = (icsContent: string, filename = 'calendar-events.ics') => {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Parse an ICS file and import events
 * This is a simplified version - a full ICS parser would need to handle more edge cases
 */
export const parseICSFile = (icsContent: string): Partial<CalendarEvent>[] => {
  const events: Partial<CalendarEvent>[] = [];
  let currentEvent: Partial<CalendarEvent> | null = null;
  
  const lines = icsContent.split(/\r?\n/);
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('BEGIN:VEVENT')) {
      currentEvent = {
        isAllDay: false
      };
    } else if (line.startsWith('END:VEVENT') && currentEvent) {
      events.push(currentEvent);
      currentEvent = null;
    } else if (currentEvent) {
      // Parse event properties
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':');
      
      switch (key) {
        case 'SUMMARY':
          currentEvent.title = value;
          break;
        case 'DESCRIPTION':
          currentEvent.description = value;
          break;
        case 'LOCATION':
          currentEvent.location = value;
          break;
        case 'DTSTART':
          currentEvent.start = parseICSDate(value);
          if (value.indexOf('T') === -1) {
            currentEvent.isAllDay = true;
          }
          break;
        case 'DTEND':
          currentEvent.end = parseICSDate(value);
          break;
        case 'RRULE':
          currentEvent.recurrenceRule = value;
          break;
        default:
          // Handle other properties as needed
          break;
      }
    }
  }
  
  return events;
};

/**
 * Parse an ICS date string (yyyyMMddTHHmmssZ or yyyyMMdd)
 */
function parseICSDate(value: string): Date {
  // Handle all-day events (no time component)
  if (value.indexOf('T') === -1) {
    const year = parseInt(value.substr(0, 4));
    const month = parseInt(value.substr(4, 2)) - 1; // JavaScript months are 0-indexed
    const day = parseInt(value.substr(6, 2));
    return new Date(year, month, day);
  }
  
  // Handle events with time
  const year = parseInt(value.substr(0, 4));
  const month = parseInt(value.substr(4, 2)) - 1;
  const day = parseInt(value.substr(6, 2));
  const hour = parseInt(value.substr(9, 2));
  const minute = parseInt(value.substr(11, 2));
  const second = parseInt(value.substr(13, 2));
  
  // Handle UTC dates
  if (value.endsWith('Z')) {
    return new Date(Date.UTC(year, month, day, hour, minute, second));
  }
  
  return new Date(year, month, day, hour, minute, second);
}

/**
 * Read ICS file content
 */
export const readICSFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target) {
        const content = e.target.result as string;
        resolve(content);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read ICS file'));
    };
    
    reader.readAsText(file);
  });
}; 