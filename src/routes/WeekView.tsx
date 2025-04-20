import { useState, useEffect } from 'react';
import { format, addDays, isToday, isSameDay } from 'date-fns';
import { CalendarEvent } from '../lib/types';
import { 
  getCalendarWeekDays, 
  getEventsForDay, 
  generateTimeSlots,
  goToPreviousWeek,
  goToNextWeek,
  goToToday
} from '../lib/dateUtils';
import { getEvents } from '../db/eventStore';
import { useNavigate } from 'react-router-dom';

const WeekView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [weekDays, setWeekDays] = useState<Date[]>([]);
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

  // Update week days when current date changes
  useEffect(() => {
    setWeekDays(getCalendarWeekDays(currentDate));
  }, [currentDate]);

  // Week navigation
  const handlePreviousWeek = () => {
    setCurrentDate(goToPreviousWeek(currentDate));
  };

  const handleNextWeek = () => {
    setCurrentDate(goToNextWeek(currentDate));
  };

  const handleToday = () => {
    setCurrentDate(goToToday());
  };

  // Navigate to event details
  const handleEventClick = (eventId: string) => {
    navigate(`/event/${eventId}`);
  };

  // Navigate to day view
  const handleDayClick = (date: Date) => {
    navigate(`/day/${format(date, 'yyyy-MM-dd')}`);
  };

  // Get events for a specific day
  const getDayEvents = (day: Date) => {
    return getEventsForDay(events, day);
  };

  // Get events that occur during a specific hour
  const getHourEvents = (day: Date, hour: number) => {
    const dayEvents = getDayEvents(day);
    return dayEvents.filter(event => {
      const eventStart = event.start.getHours();
      const eventEnd = event.end.getHours();
      return (
        (eventStart <= hour && eventEnd >= hour) || 
        event.isAllDay
      );
    });
  };

  // Render a time slot cell for a specific day and hour
  const renderTimeSlot = (day: Date, hour: number) => {
    const hourEvents = getHourEvents(day, hour);
    const isCurrentDay = isToday(day);
    
    return (
      <div 
        className={`calendar-time-slot-cell border p-1 ${
          isCurrentDay ? 'bg-blue-50' : ''
        }`}
        onClick={() => handleDayClick(day)}
      >
        {hourEvents.map((event, index) => (
          <div 
            key={index}
            className={`text-xs truncate rounded px-1 my-1 cursor-pointer ${
              event.isAllDay 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-green-100 text-green-700'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              handleEventClick(event.id);
            }}
          >
            {event.title}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">
          {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
        </h1>
        <div className="flex space-x-2">
          <button 
            onClick={handlePreviousWeek}
            className="p-2 border rounded hover:bg-gray-100"
            aria-label="Previous week"
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
            onClick={handleNextWeek}
            className="p-2 border rounded hover:bg-gray-100"
            aria-label="Next week"
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
        <div className="overflow-auto h-[calc(100vh-240px)]">
          {/* Day headers */}
          <div className="grid grid-cols-8 border-b sticky top-0 bg-white z-10">
            <div className="p-2 border-r"></div> {/* Empty cell for time labels */}
            {weekDays.map((day, index) => (
              <div 
                key={index} 
                className={`p-2 text-center cursor-pointer ${
                  isToday(day) ? 'bg-blue-100 font-bold' : ''
                }`}
                onClick={() => handleDayClick(day)}
              >
                <div>{format(day, 'EEE')}</div>
                <div className={`h-8 w-8 rounded-full mx-auto flex items-center justify-center ${
                  isToday(day) ? 'bg-blue-500 text-white' : ''
                }`}>
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>
          
          {/* All-day events */}
          <div className="grid grid-cols-8 border-b">
            <div className="p-2 border-r text-xs">All Day</div>
            {weekDays.map((day, dayIndex) => {
              const allDayEvents = getDayEvents(day).filter(e => e.isAllDay);
              return (
                <div 
                  key={dayIndex} 
                  className={`p-1 ${isToday(day) ? 'bg-blue-50' : ''}`}
                >
                  {allDayEvents.map((event, eventIndex) => (
                    <div 
                      key={eventIndex}
                      className="text-xs truncate bg-blue-100 text-blue-700 p-1 mb-1 rounded cursor-pointer"
                      onClick={() => handleEventClick(event.id)}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
          
          {/* Time slots */}
          {timeSlots.map((hour, hourIndex) => (
            <div key={hourIndex} className="grid grid-cols-8 border-b">
              <div className="p-1 border-r text-xs text-right pr-2">
                {format(new Date().setHours(hour, 0, 0, 0), 'h a')}
              </div>
              {weekDays.map((day, dayIndex) => (
                <div key={dayIndex} className="border-r">
                  {renderTimeSlot(day, hour)}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeekView; 