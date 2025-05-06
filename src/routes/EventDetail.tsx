import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { format, parse, setHours, setMinutes } from 'date-fns';
import { CalendarEvent, Reminder } from '../lib/types';
import { 
  getEvent, 
  createEvent, 
  updateEvent, 
  deleteEvent,
  getEventReminders,
  createReminder,
  deleteReminder
} from '../db/eventStore';
import { RRule } from 'rrule';
import { exportEventToICS, downloadICS } from '../lib/icsUtils';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isNewEvent = id === 'new';
  const searchParams = new URLSearchParams(location.search);
  const preselectedDate = searchParams.get('date');

  // Event form state
  const [eventData, setEventData] = useState<Partial<CalendarEvent>>({
    title: '',
    description: '',
    isAllDay: false,
    start: preselectedDate 
      ? parse(preselectedDate, 'yyyy-MM-dd', new Date()) 
      : new Date(),
    end: preselectedDate 
      ? parse(preselectedDate, 'yyyy-MM-dd', new Date()) 
      : new Date(new Date().setHours(new Date().getHours() + 1)),
    location: '',
    color: '#3b82f6', // Default blue color
  });

  // Reminders state
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newReminder, setNewReminder] = useState<Omit<Reminder, 'id' | 'eventId'>>({
    time: new Date(new Date().setMinutes(new Date().getMinutes() - 30)),
    type: 'notification',
    message: 'Event reminder'
  });

  // Recurrence state
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<string>('WEEKLY');
  const [recurrenceInterval, setRecurrenceInterval] = useState<number>(1);
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date | null>(null);

  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(!isNewEvent);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Load event data if editing an existing event
  useEffect(() => {
    const loadEventData = async () => {
      if (!isNewEvent && id) {
        try {
          const event = await getEvent(id);
          if (event) {
            setEventData(event);
            
            // Check for recurrence rule
            if (event.recurrenceRule) {
              setIsRecurring(true);
              const rule = RRule.fromString(event.recurrenceRule);
              setRecurrenceFrequency(rule.options.freq.toString());
              setRecurrenceInterval(rule.options.interval || 1);
              if (rule.options.until) {
                setRecurrenceEndDate(rule.options.until);
              }
            }
            
            // Load reminders
            const eventReminders = await getEventReminders(id);
            setReminders(eventReminders);
          } else {
            // Event not found, redirect to calendar
            navigate('/');
          }
        } catch (error) {
          console.error('Error loading event:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadEventData();
  }, [id, isNewEvent, navigate]);

  // Event form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEventData(prev => ({ ...prev, [name]: checked }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'startDate') {
      const newDate = parse(value, 'yyyy-MM-dd', new Date());
      
      // Preserve time
      if (eventData.start) {
        newDate.setHours(
          eventData.start.getHours(),
          eventData.start.getMinutes()
        );
      }
      
      setEventData(prev => ({ 
        ...prev, 
        start: newDate,
        // If end date is before new start date, update it
        end: prev.end && prev.end < newDate ? newDate : prev.end
      }));
    } else if (name === 'endDate') {
      const newDate = parse(value, 'yyyy-MM-dd', new Date());
      
      // Preserve time
      if (eventData.end) {
        newDate.setHours(
          eventData.end.getHours(),
          eventData.end.getMinutes()
        );
      }
      
      setEventData(prev => ({ ...prev, end: newDate }));
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [hours, minutes] = value.split(':').map(Number);
    
    if (name === 'startTime') {
      setEventData(prev => {
        if (!prev.start) return prev;
        const newDate = new Date(prev.start);
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        return { 
          ...prev, 
          start: newDate,
          // If end time is before new start time, update it to be 1 hour later
          end: prev.end && prev.end < newDate 
            ? new Date(new Date(newDate).setHours(newDate.getHours() + 1)) 
            : prev.end
        };
      });
    } else if (name === 'endTime') {
      setEventData(prev => {
        if (!prev.end) return prev;
        const newDate = new Date(prev.end);
        newDate.setHours(hours);
        newDate.setMinutes(minutes);
        return { ...prev, end: newDate };
      });
    }
  };

  // Recurrence handlers
  const handleRecurrenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsRecurring(e.target.checked);
  };

  const handleRecurrenceFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRecurrenceFrequency(e.target.value);
  };

  const handleRecurrenceIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecurrenceInterval(parseInt(e.target.value) || 1);
  };

  const handleRecurrenceEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRecurrenceEndDate(value ? parse(value, 'yyyy-MM-dd', new Date()) : null);
  };

  // Generate RRule string
  const generateRecurrenceRule = (): string | undefined => {
    if (!isRecurring || !eventData.start) return undefined;
    
    const options: any = {
      freq: RRule[recurrenceFrequency as keyof typeof RRule],
      interval: recurrenceInterval,
      dtstart: eventData.start
    };
    
    if (recurrenceEndDate) {
      options.until = recurrenceEndDate;
    }
    
    const rule = new RRule(options);
    return rule.toString();
  };

  // Reminder handlers
  const handleReminderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewReminder(prev => ({ ...prev, [name]: value }));
  };

  const handleReminderTimeChange = (offset: number) => {
    const time = new Date((eventData.start as Date).getTime() - offset * 60000);
    setNewReminder(prev => ({ ...prev, time }));
  };

  const handleAddReminder = async () => {
    if (!id || isNewEvent || !eventData.start) return;
    
    try {
      const reminder = await createReminder({
        eventId: id,
        time: newReminder.time,
        type: newReminder.type,
        message: newReminder.message
      });
      
      setReminders(prev => [...prev, reminder]);
      
      // Reset for next reminder
      setNewReminder({
        time: new Date(new Date().setMinutes(new Date().getMinutes() - 30)),
        type: 'notification',
        message: 'Event reminder'
      });
    } catch (error) {
      console.error('Error adding reminder:', error);
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    try {
      await deleteReminder(reminderId);
      setReminders(prev => prev.filter(r => r.id !== reminderId));
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  // Save event
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventData.title || !eventData.start || !eventData.end) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Generate recurrence rule if needed
      const recurrenceRule = generateRecurrenceRule();
      
      const eventToSave: Partial<CalendarEvent> = {
        ...eventData,
        recurrenceRule
      };
      
      if (isNewEvent) {
        // Create new event
        const createdEvent = await createEvent(eventToSave as Omit<CalendarEvent, 'id'>);
        
        // If there are reminders, create them
        for (const reminder of reminders) {
          await createReminder({
            eventId: createdEvent.id,
            time: reminder.time,
            type: reminder.type,
            message: reminder.message
          });
        }
        
        navigate(`/event/${createdEvent.id}`);
      } else if (id) {
        // Update existing event
        await updateEvent(id, eventToSave);
        // Reminders are managed separately
      }
      
      navigate(-1);
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete event
  const handleDeleteEvent = async () => {
    if (!id || isNewEvent) return;
    
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      await deleteEvent(id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
      setIsDeleting(false);
    }
  };

  // Export event to ICS
  const handleExportToICS = async () => {
    if (isNewEvent || !eventData.id) return;
    
    try {
      const icsContent = await exportEventToICS(eventData as CalendarEvent);
      downloadICS(icsContent, `${eventData.title}.ics`);
    } catch (error) {
      console.error('Error exporting event to ICS:', error);
      alert('Failed to export event. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading event details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <form onSubmit={handleSaveEvent}>
        <h1 className="text-2xl font-bold mb-6 dark:text-white">
          {isNewEvent ? 'Create New Event' : 'Edit Event'}
        </h1>
        
        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleInputChange}
            className="w-full p-2 border dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        
        {/* All day toggle */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="isAllDay"
            name="isAllDay"
            checked={eventData.isAllDay}
            onChange={handleCheckboxChange}
            className="mr-2"
          />
          <label htmlFor="isAllDay" className="text-gray-700 dark:text-gray-200 font-medium">
            All Day Event
          </label>
        </div>
        
        {/* Date and time inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Start date/time */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={eventData.start ? format(eventData.start, 'yyyy-MM-dd') : ''}
              onChange={handleDateChange}
              className="w-full p-2 border dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
            
            {!eventData.isAllDay && (
              <div className="mt-2">
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={eventData.start ? format(eventData.start, 'HH:mm') : ''}
                  onChange={handleTimeChange}
                  className="w-full p-2 border dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            )}
          </div>
          
          {/* End date/time */}
          <div>
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="endDate"
              value={eventData.end ? format(eventData.end, 'yyyy-MM-dd') : ''}
              onChange={handleDateChange}
              className="w-full p-2 border dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
            
            {!eventData.isAllDay && (
              <div className="mt-2">
                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={eventData.end ? format(eventData.end, 'HH:mm') : ''}
                  onChange={handleTimeChange}
                  className="w-full p-2 border dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Location */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={eventData.location || ''}
            onChange={handleInputChange}
            className="w-full p-2 border dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        
        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={eventData.description || ''}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-2 border dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          ></textarea>
        </div>
        
        {/* Color picker */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
            Color
          </label>
          <input
            type="color"
            name="color"
            value={eventData.color || '#3b82f6'}
            onChange={handleInputChange}
            className="w-full p-1 h-10 border dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Recurrence section */}
        <div className="mb-6 border-t dark:border-gray-700 pt-4">
          <h2 className="text-lg font-medium mb-3 dark:text-white">Recurrence</h2>
          
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              id="isRecurring"
              checked={isRecurring}
              onChange={handleRecurrenceChange}
              className="mr-2"
            />
            <label htmlFor="isRecurring" className="text-gray-700 dark:text-gray-200 font-medium">
              Repeat this event
            </label>
          </div>
          
          {isRecurring && (
            <div className="pl-6 border-l-2 border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                    Repeat every
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      min="1"
                      value={recurrenceInterval}
                      onChange={handleRecurrenceIntervalChange}
                      className="w-16 p-2 border dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2 dark:bg-gray-700 dark:text-white"
                    />
                    <select
                      value={recurrenceFrequency}
                      onChange={handleRecurrenceFrequencyChange}
                      className="p-2 border dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="DAILY">Days</option>
                      <option value="WEEKLY">Weeks</option>
                      <option value="MONTHLY">Months</option>
                      <option value="YEARLY">Years</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                    Ends on (optional)
                  </label>
                  <input
                    type="date"
                    value={recurrenceEndDate ? format(recurrenceEndDate, 'yyyy-MM-dd') : ''}
                    onChange={handleRecurrenceEndDateChange}
                    className="w-full p-2 border dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Reminders section - only show for existing events */}
        {!isNewEvent && (
          <div className="mb-6 border-t dark:border-gray-700 pt-4">
            <h2 className="text-lg font-medium mb-3 dark:text-white">Reminders</h2>
            
            {/* Existing reminders */}
            {reminders.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2 text-gray-500 dark:text-gray-400">CURRENT REMINDERS</h3>
                <ul className="space-y-2">
                  {reminders.map(reminder => (
                    <li key={reminder.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="dark:text-gray-200">
                        {format(reminder.time, 'MMM d, yyyy h:mm a')} 
                        {reminder.type === 'notification' && ' (Notification)'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteReminder(reminder.id)}
                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Add new reminder */}
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
              <h3 className="text-sm font-medium mb-2 dark:text-gray-200">Add Reminder</h3>
              <div className="flex flex-wrap gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => handleReminderTimeChange(15 * 60)} // 15 hours
                  className="px-3 py-1 border dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200"
                >
                  15 hours before
                </button>
                <button
                  type="button"
                  onClick={() => handleReminderTimeChange(60)} // 1 hour
                  className="px-3 py-1 border dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200"
                >
                  1 hour before
                </button>
                <button
                  type="button"
                  onClick={() => handleReminderTimeChange(30)} // 30 minutes
                  className="px-3 py-1 border dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200"
                >
                  30 minutes before
                </button>
                <button
                  type="button"
                  onClick={() => handleReminderTimeChange(15)} // 15 minutes
                  className="px-3 py-1 border dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200"
                >
                  15 minutes before
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <input
                  type="datetime-local"
                  name="reminderTime"
                  value={format(newReminder.time, "yyyy-MM-dd'T'HH:mm")}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    setNewReminder(prev => ({ ...prev, time: date }));
                  }}
                  className="p-2 border dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <select
                  name="type"
                  value={newReminder.type}
                  onChange={handleReminderChange}
                  className="p-2 border dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="notification">Notification</option>
                  <option value="email" disabled>Email (Coming soon)</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddReminder}
                  className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Reminder
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex flex-wrap justify-between pt-4 border-t dark:border-gray-700">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
            >
              Cancel
            </button>
            
            {!isNewEvent && (
              <button
                type="button"
                onClick={handleDeleteEvent}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            )}
          </div>
          
          <div className="flex space-x-2">
            {!isNewEvent && (
              <button
                type="button"
                onClick={handleExportToICS}
                className="px-4 py-2 border dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
              >
                Export to ICS
              </button>
            )}
            
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Event'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EventDetail; 