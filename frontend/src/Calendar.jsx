import React, { useState } from 'react';
import './Home.css'; // We'll create this CSS file for styling

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    // Here you can add logic to open a modal or form for data input
    console.log(`Clicked on: ${day}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`);
  };

  const renderCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate && 
        day === selectedDate.getDate() && 
        currentDate.getMonth() === selectedDate.getMonth() && 
        currentDate.getFullYear() === selectedDate.getFullYear();
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isSelected ? 'selected' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <h2>{`${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}</h2>
        <div className="calendar-nav">
          <button onClick={handlePrevMonth}>&lt;</button>
          <button onClick={handleNextMonth}>&gt;</button>
        </div>
      </div>
      <div className="calendar-weekdays">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
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