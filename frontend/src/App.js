function App() {
  return (
    <div className="calendar-app">
      <header>
        <button className="menu-button">≡</button>
        <div className="logo">
          <img src="calendar-icon.png" alt="Calendar" />
          <span>Calendar</span>
        </div>
        <nav>
          <button>Today</button>
          <button>&lt;</button>
          <button>&gt;</button>
          <span>July 2024</span>
        </nav>
        <div className="right-controls">
          <input type="text" placeholder="Search" />
          <button>?</button>
          <button>⚙</button>
          <select>
            <option>Week</option>
          </select>
        </div>
      </header>
      <main>
        <aside>
          <button className="create-button">Create</button>
          <div className="mini-calendar">
            {/* Mini calendar component */}
          </div>
          <div className="search-people">
            <input type="text" placeholder="Search for people" />
          </div>
          <div className="my-calendars">
            <h3>My calendars</h3>
            <ul>
              <li>ryanc</li>
              <li>class</li>
              <li>Clubs</li>
              <li>Exercise</li>
            </ul>
          </div>
        </aside>
        <section className="main-calendar">
          {/* Main calendar grid */}
        </section>
      </main>
    </div>
  );
}

export default App;