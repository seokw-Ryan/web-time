import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainCalendar from './components/MainCalendar';
import './styles/styles.css';

const App = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const handleTodayClick = () => {
        setCurrentDate(new Date());
    };

    const handlePrevClick = () => {
        const prevMonth = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        setCurrentDate(new Date(prevMonth));
    };

    const handleNextClick = () => {
        const nextMonth = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
        setCurrentDate(new Date(nextMonth));
    };

    return (
        <div className="calendar-app">
            <Header
                currentDate={currentDate}
                onTodayClick={handleTodayClick}
                onPrevClick={handlePrevClick}
                onNextClick={handleNextClick}
            />
            <div className="main-content">
                <Sidebar />
                <MainCalendar currentDate={currentDate} />
            </div>
        </div>
    );
};

export default App;
