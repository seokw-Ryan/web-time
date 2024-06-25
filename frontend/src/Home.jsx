import React from 'react';
import Calendar from './Calendar';
import DayView from './DayView';
import './Home.css';

const WeekView = () => {
  // Placeholder for Week View
  return (
    <div className="week-view">
      <p>Week view content to be implemented</p>
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
          <WeekView />
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
              <DayView />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;