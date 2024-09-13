import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useEvent } from '../contexts/EventContext';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const Calendar = ({ mode }) => {
  const [events, setEvents] = useState([]);
  const { currentUser } = useAuth();
  const { addEvent, updateEvent, deleteEvent } = useEvent();

  useEffect(() => {
    fetchEvents();
  }, [mode]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events', {
        headers: { Authorization: `Bearer ${currentUser.token}` },
        params: { mode }
      });
      setEvents(response.data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      })));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleSelectSlot = ({ start, end }) => {
    if (mode === 'plan' || (mode === 'record' && start >= new Date())) {
      const title = window.prompt('Enter a new title for your event');
      if (title) {
        const newEvent = { title, start, end };
        addEvent(newEvent);
        setEvents([...events, newEvent]);
      }
    }
  };

  const handleSelectEvent = (event) => {
    if (mode === 'plan' || (mode === 'record' && event.start >= new Date())) {
      const action = window.confirm('Do you want to edit this event? Click OK to edit, or Cancel to delete.');
      if (action) {
        const title = window.prompt('Enter new title for your event', event.title);
        if (title) {
          const updatedEvent = { ...event, title };
          updateEvent(updatedEvent);
          setEvents(events.map(e => e.id === event.id ? updatedEvent : e));
        }
      } else {
        deleteEvent(event);
        setEvents(events.filter(e => e.id !== event.id));
      }
    }
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    let style = {
      backgroundColor: '#3174ad',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };

    if (mode === 'plan' && start < new Date()) {
      style.backgroundColor = '#cccccc';
    }

    return { style };
  };

  return (
    <div className="calendar-container">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        selectable
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
};

export default Calendar;
