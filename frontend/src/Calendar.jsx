import React, { useState } from 'react';
import './Calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const navigateMonth = (direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(prevDate.getMonth() + direction);
      return newDate;
    });
  };

  const handleDateClick = (day) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalDays = 35; // 5 rows * 7 days

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-start-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      days.push(
        <div 
          key={`day-${day}`}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </div>
      );
    }

    // Fill the remaining slots with empty cells
    const remainingDays = totalDays - days.length;
    for (let i = 0; i < remainingDays; i++) {
      days.push(<div key={`empty-end-${i}`} className="calendar-day empty"></div>);
    }

    return days;
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <h2>{`${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}</h2>
        <div className="calendar-nav">
          <button onClick={() => navigateMonth(-1)}>&lt;</button>
          <button onClick={() => navigateMonth(1)}>&gt;</button>
        </div>
      </div>
      <div className="calendar-weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>
      <div className="calendar-days">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default Calendar;