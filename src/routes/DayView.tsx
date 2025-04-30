import { useState, useEffect } from 'react';
import { format, parse, isToday, startOfDay, endOfDay } from 'date-fns';
import { useParams, useNavigate } from 'react-router-dom';
import { CalendarEvent } from '../lib/types';
import { getEvents } from '../db/eventStore';
import { 
  getEventsForDay, 
  generateTimeSlots, 
  goToPreviousDay, 
  goToNextDay,
  goToToday,
  formatDate
} from '../lib/dateUtils';

const DayView: React.FC = () => {
  const { date } = useParams<{ date?: string }>();
  const [currentDate, setCurrentDate] = useState<Date>(
    date ? parse(date, 'yyyy-MM-dd', new Date()) : new Date()
  );
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [timeSlots] = useState<number[]>(generateTimeSlots(0, 23));
  const navigate = useNavigate();

  // Load events
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const allEvents = await getEvents();
        setEvents(allEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Update URL when date changes
  useEffect(() => {
    const formattedDate = format(currentDate, 'yyyy-MM-dd');
    if (date !== formattedDate) {
      navigate(`/day/${formattedDate}`, { replace: true });
    }
  }, [currentDate, date, navigate]);

  // Day navigation
  const handlePreviousDay = () => {
    setCurrentDate(goToPreviousDay(currentDate));
  };

  const handleNextDay = () => {
    setCurrentDate(goToNextDay(currentDate));
  };

  const handleToday = () => {
    setCurrentDate(goToToday());
  };

  // Navigate to event details
  const handleEventClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  // Add new event
  const handleAddEvent = () => {
    // Navigate to new event form with current date pre-selected
    navigate(`/event/new?date=${format(currentDate, 'yyyy-MM-dd')}`);
  };

  // Get events for the current day
  const getDayEvents = () => {
    return getEventsForDay(events, currentDate);
  };

  // Get events for a specific hour
  const getHourEvents = (hour: number) => {
    const dayEvents = getDayEvents()
      .filter(event => !event.isAllDay)
      .filter(event => {
        const eventStart = event.start.getHours();
        const eventEnd = event.end.getHours();
        return eventStart <= hour && eventEnd >= hour;
      });
    
    return dayEvents;
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
          {isToday(currentDate) && (
            <span className="ml-2 text-sm bg-blue-500 text-white rounded-full px-2 py-1">
              Today
            </span>
          )}
        </h1>
        <div className="flex space-x-2">
          <button 
            onClick={handlePreviousDay}
            className="p-2 border rounded hover:bg-gray-100"
            aria-label="Previous day"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={handleToday}
            className="px-3 py-2 border rounded hover:bg-gray-100"
          >
            Today
          </button>
          <button 
            onClick={handleNextDay}
            className="p-2 border rounded hover:bg-gray-100"
            aria-label="Next day"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            onClick={handleAddEvent}
            className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Event
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading events...</p>
        </div>
      ) : (
        <div className="overflow-auto h-[calc(100vh-240px)] scrollbar scrollbar-thumb-border dark:scrollbar-thumb-border-dark">
          {/* All-day events */}
          <div className="mb-4">
            <h2 className="text-sm font-medium text-foreground-secondary dark:text-foreground-tertiary mb-2">ALL DAY</h2>
            <div className="bg-surface dark:bg-surface-muted rounded-lg shadow">
              {getDayEvents()
                .filter(event => event.isAllDay)
                .map((event, index) => (
                  <div 
                    key={index}
                    className="p-3 border-b border-border dark:border-border-muted last:border-0 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    onClick={() => handleEventClick(event.id)}
                  >
                    <div className="font-medium">{event.title}</div>
                    {event.location && (
                      <div className="text-sm text-foreground-secondary dark:text-foreground-tertiary">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </div>
                    )}
                  </div>
                ))}
              {getDayEvents().filter(event => event.isAllDay).length === 0 && (
                <div className="p-3 text-foreground-secondary dark:text-foreground-tertiary text-center">No all-day events</div>
              )}
            </div>
          </div>
          
          {/* Time-based events */}
          <div>
            <h2 className="text-sm font-medium text-foreground-secondary dark:text-foreground-tertiary mb-2">SCHEDULE</h2>
            <div className="bg-surface dark:bg-surface-muted rounded-lg shadow">
              {timeSlots.map((hour, index) => {
                const hourEvents = getHourEvents(hour);
                return (
                  <div key={index} className="flex border-b border-border dark:border-border-muted last:border-0">
                    <div className="w-16 py-3 px-2 text-right text-sm text-foreground-secondary dark:text-foreground-tertiary">
                      {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
                    </div>
                    <div className="flex-1 py-1 pl-4 border-l border-border dark:border-border-muted">
                      {hourEvents.map((event, eventIndex) => (
                        <div 
                          key={eventIndex}
                          className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 p-2 my-1 rounded cursor-pointer"
                          onClick={() => handleEventClick(event.id)}
                        >
                          <div className="font-medium">{event.title}</div>
                          <div className="text-xs">
                            {formatDate(event.start, 'h:mm a')} - {formatDate(event.end, 'h:mm a')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayView; 