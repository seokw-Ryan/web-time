import { useState, useEffect } from 'react';
import { 
  format, 
  getDay, 
  isSameMonth, 
  isSameDay, 
  isToday 
} from 'date-fns';
import { CalendarEvent } from '../lib/types';
import { 
  getCalendarMonthDays, 
  getEventsForDay, 
  goToPreviousMonth, 
  goToNextMonth,
  goToToday
} from '../lib/dateUtils';
import { getEvents } from '../db/eventStore';
import { useNavigate } from 'react-router-dom';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MonthView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Load events and calendar days
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

  // Update calendar days when current date changes
  useEffect(() => {
    setCalendarDays(getCalendarMonthDays(currentDate));
  }, [currentDate]);

  // Month navigation
  const handlePreviousMonth = () => {
    setCurrentDate(goToPreviousMonth(currentDate));
  };

  const handleNextMonth = () => {
    setCurrentDate(goToNextMonth(currentDate));
  };

  const handleToday = () => {
    setCurrentDate(goToToday());
  };

  // View day detail
  const handleDayClick = (date: Date) => {
    navigate(`/day/${format(date, 'yyyy-MM-dd')}`);
  };

  // Get events for a specific day
  const getDayEvents = (day: Date) => {
    return getEventsForDay(events, day);
  };

  // Render day cell with events
  const renderDay = (day: Date, index: number) => {
    const isCurrentMonth = isSameMonth(day, currentDate);
    const isCurrentDay = isToday(day);
    const dayEvents = getDayEvents(day);
    
    return (
      <div 
        key={index}
        className={`calendar-cell p-1 ${
          isCurrentMonth ? 'bg-white' : 'bg-gray-100 text-gray-400'
        } ${isCurrentDay ? 'border-blue-500 border-2' : ''}`}
        onClick={() => handleDayClick(day)}
      >
        <div className="text-right w-full">
          <span className={`inline-block rounded-full w-7 h-7 text-center leading-7 ${
            isCurrentDay ? 'bg-blue-500 text-white' : ''
          }`}>
            {format(day, 'd')}
          </span>
        </div>
        
        <div className="mt-1 overflow-y-auto max-h-16">
          {dayEvents.slice(0, 3).map((event, eventIndex) => (
            <div 
              key={eventIndex}
              className={`text-xs truncate rounded px-1 my-1 ${
                event.isAllDay ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
              }`}
            >
              {event.title}
            </div>
          ))}
          {dayEvents.length > 3 && (
            <div className="text-xs text-gray-500 truncate px-1">
              +{dayEvents.length - 3} more
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">
          {format(currentDate, 'MMMM yyyy')}
        </h1>
        <div className="flex space-x-2">
          <button 
            onClick={handlePreviousMonth}
            className="p-2 border rounded hover:bg-gray-100"
            aria-label="Previous month"
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
            onClick={handleNextMonth}
            className="p-2 border rounded hover:bg-gray-100"
            aria-label="Next month"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading calendar...</p>
        </div>
      ) : (
        <>
          {/* Weekday headers */}
          <div className="calendar-grid mb-1">
            {WEEKDAYS.map((day, index) => (
              <div key={index} className="text-center font-medium py-2">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="calendar-grid h-[calc(100vh-240px)]">
            {calendarDays.map((day, index) => renderDay(day, index))}
          </div>
        </>
      )}
    </div>
  );
};

export default MonthView; 