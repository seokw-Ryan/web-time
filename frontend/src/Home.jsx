import React, { useState } from 'react';
import './Home.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const dates = [];

    // Generate empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      dates.push(<div key={`empty-${i}`} className="empty-cell"></div>);
    }

    // Generate cells for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(
        <div key={`date-${i}`} className="date-cell">
          {i}
        </div>
      );
    }

    // Pad the remaining cells with empty cells to complete the grid
    const remainingCells = 7 - (dates.length % 7);
    for (let i = 0; i < remainingCells; i++) {
      dates.push(<div key={`empty-${dates.length + i}`} className="empty-cell"></div>);
    }

    // Wrap the date cells in rows
    const rows = [];
    for (let i = 0; i < dates.length; i += 7) {
      rows.push(
        <div key={`row-${i}`} className="calendar-row">
          {dates.slice(i, i + 7)}
        </div>
      );
    }

    return rows;
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <h2 className="calendar-title">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="calendar-nav">
          <button className="nav-btn">&lt;</button>
          <button className="nav-btn">&gt;</button>
        </div>
      </div>
      <div className="calendar-weekdays">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className="weekday">{day}</div>
        ))}
      </div>
      <div className="calendar-grid">{renderCalendar()}</div>
    </div>
  );
};

const Home = () => {
  return (
    <div className="home-container">
      <header className="header">
        <div className="logo-left">Daiw</div>
        <h1 className="logo">Home Page</h1>
      </header>
      <main className="main-content">
        <div className="section-header">
          <h2 className="section-title">Week</h2>
        </div>
        <section id="week" className="week-view">
          {/* Week view content goes here */}
        </section>
        <div className="bottom-container">
          <div className="section-container equal-size">
            <div className="section-header">
              <h2 className="section-title">Month</h2>
            </div>
            <section id="month" className="month-view">
              <Calendar />
            </section>
          </div>
          <div className="section-container equal-size">
            <div className="section-header">
              <h2 className="section-title">Day</h2>
            </div>
            <section id="day" className="day-view">
              <ul className="time-list">
                {Array.from({ length: 24 }, (_, i) => (
                  <li key={i} className="time-slot">
                    <span className="time-label">{`${i.toString().padStart(2, '0')}:00`}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;