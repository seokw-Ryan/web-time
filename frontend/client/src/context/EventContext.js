import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { getUserTimeZone } from '../utils/timezone';

const EventContext = createContext();

export const useEvent = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [mode, setMode] = useState('plan');
    const [loading, setLoading] = useState(true);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await api.getEvents();
            setEvents(response.data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const addEvent = async (eventData) => {
        try {
            const response = await api.createEvent({
                ...eventData,
                timeZone: getUserTimeZone()
            });
            setEvents([...events, response.data]);
        } catch (error) {
            console.error('Error adding event:', error);
        }
    };

    const updateEvent = async (eventId, eventData) => {
        try {
            const response = await api.updateEvent(eventId, eventData);
            setEvents(events.map(event => event.id === eventId ? response.data : event));
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    const deleteEvent = async (eventId) => {
        try {
            await api.deleteEvent(eventId);
            setEvents(events.filter(event => event.id !== eventId));
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const toggleMode = () => {
        setMode(prevMode => prevMode === 'plan' ? 'record' : 'plan');
    };

    const value = {
        events,
        mode,
        loading,
        fetchEvents,
        addEvent,
        updateEvent,
        deleteEvent,
        toggleMode
    };

    return (
        <EventContext.Provider value={value}>
            {children}
        </EventContext.Provider>
    );
};
