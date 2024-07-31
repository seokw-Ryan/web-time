import React from 'react';

const Sidebar = () => (
    <aside>
        <button className="create-button">Create</button>
        <div className="mini-calendar">
            {/* Mini calendar implementation */}
        </div>
        <div className="calendars-list">
            <h3>My calendars</h3>
            {/* List of calendars */}
        </div>
    </aside>
);

export default Sidebar;
