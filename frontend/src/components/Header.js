import React from 'react';

const Header = ({ currentDate, onTodayClick, onPrevClick, onNextClick }) => (
    <header>
        <div className="menu-icon">≡</div>
        <h1>Calendar</h1>
        <button onClick={onTodayClick}>Today</button>
        <div className="nav-buttons">
            <button onClick={onPrevClick}>{"<"}</button>
            <button onClick={onNextClick}>{">"}</button>
        </div>
        <h2>{`${currentDate.toLocaleString('default', { month: 'short' })} - ${currentDate.getFullYear()}`}</h2>
        <div className="right-icons">
            <button>Search</button>
            <button>Help</button>
            <button>Settings</button>
        </div>
    </header>
);

export default Header;
