import React from 'react';
import './Home.css';

const DayView = ({ date = new Date() }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  const formatHour = (hour) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour} ${ampm}`;
  };

  // Mock event data (replace with real data in your implementation)
  const events = [
    { id: 1, title: 'Workout (Walk)', start: '15:30', end: '16:30' }
  ];

  const getEventStyle = (event) => {
    const [startHour, startMinute] = event.start.split(':').map(Number);
    const [endHour, endMinute] = event.end.split(':').map(Number);
    const top = (startHour + startMinute / 60) * 60;
    const height = ((endHour + endMinute / 60) - (startHour + startMinute / 60)) * 60;
    return { top: `${top}px`, height: `${height}px` };
  };

  return (
    <div className="day-view">
      <div className="day-header">
        <div className="day-title">
          <span className="day-name">{date.toLocaleString('en-US', { weekday: 'short' }).toUpperCase()}</span>
          <span className="day-number">{date.getDate()}</span>
        </div>
        <div className="timezone">GMT+09</div>
      </div>
      <div className="time-slots">
        {hours.map(hour => (
          <div key={hour} className="time-slot">
            <div className="time-label">{formatHour(hour)}</div>
            <div className="time-content"></div>
          </div>
        ))}
        {events.map(event => (
          <div key={event.id} className="event" style={getEventStyle(event)}>
            {event.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayView;