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
        className="relative bg-background dark:bg-[#202124] hover:bg-[rgba(26,115,232,0.04)] dark:hover:bg-[rgba(138,180,248,0.06)] p-2 min-h-[120px] flex flex-col"
        onClick={() => handleDayClick(day)}
      >
        <div className="flex items-center text-[12px] font-semibold text-foreground">
          <span>{format(day, 'EEE').toUpperCase()}</span>
          <span className="ml-1">{format(day, 'd')}</span>
        </div>
        <div className="mt-2 flex-1 space-y-1">
          {dayEvents
            .filter(event => event.isAllDay)
            .map((event, idx) => (
              <div
                key={idx}
                className="h-5 rounded-[4px] px-2 text-[12px] flex items-center overflow-hidden whitespace-nowrap text-ellipsis"
                style={{ backgroundColor: event.color || '#4285F4', color: '#fff' }}
              >
                {event.title}
              </div>
            ))}
          {dayEvents
            .filter(event => !event.isAllDay)
            .map((event, idx) => (
              <div
                key={idx}
                className="flex items-center text-[13px] leading-[18px] gap-[6px] overflow-hidden whitespace-nowrap text-ellipsis"
              >
                <span
                  className="inline-block w-[6px] h-[6px] rounded-full flex-shrink-0"
                  style={{ backgroundColor: event.color || '#34A853' }}
                ></span>
                <span>{format(event.start, 'h:mm a')}</span>
                <span className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
                  {event.title}
                </span>
              </div>
            ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={handlePreviousMonth}
          className="p-2 border rounded hover:bg-gray-100"
          aria-label="Previous month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="flex items-center">
          <h1 className="text-xl font-bold">
            {format(currentDate, 'MMMM yyyy')}
          </h1>
          <button 
            onClick={handleToday}
            className="px-3 py-2 border rounded hover:bg-gray-100 ml-4"
          >
            Today
          </button>
        </div>
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

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p>Loading calendar...</p>
        </div>
      ) : (
      <div className="relative overflow-auto">
        <div className="grid grid-cols-7 gap-px bg-[#E8EAED] dark:bg-[#3C4043] rounded-lg overflow-hidden w-max">
            {calendarDays.map((day, index) => renderDay(day, index))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthView; 