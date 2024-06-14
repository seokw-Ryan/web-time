import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="header">
        <h1 className="logo">daiw</h1>
        <nav className="nav">
          <a href="#week" className="nav-link">Week</a>
          <a href="#month" className="nav-link">Month</a>
          <a href="#day" className="nav-link">Day</a>
        </nav>
      </header>
      <main className="main-content">
        <section id="week" className="week-view">
          <h2>Week</h2>
          {/* Week view content goes here */}
        </section>
        <section id="month" className="month-view">
          <h2>Month</h2>
          {/* Month view content goes here */}
        </section>
        <section id="day" className="day-view">
          <h2>Day</h2>
          {/* Day view content goes here */}
        </section>
      </main>
    </div>
  );
};

export default Home;
