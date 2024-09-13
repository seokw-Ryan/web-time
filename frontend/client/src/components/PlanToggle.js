import React from 'react';
import { useEvent } from '../contexts/EventContext';

const PlanToggle = ({ mode, toggleMode }) => {
  const { fetchEvents } = useEvent();

  const handleToggle = () => {
    toggleMode();
    fetchEvents();
  };

  return (
    <div className="plan-toggle">
      <button
        className={`toggle-button ${mode === 'plan' ? 'active' : ''}`}
        onClick={handleToggle}
      >
        Plan
      </button>
      <button
        className={`toggle-button ${mode === 'record' ? 'active' : ''}`}
        onClick={handleToggle}
      >
        Record
      </button>
    </div>
  );
};

export default PlanToggle;
