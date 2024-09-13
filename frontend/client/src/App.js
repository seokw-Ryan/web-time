import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Calendar from './components/Calendar';
import Header from './components/Header';

function App() {
  const [mode, setMode] = useState('plan'); // 'plan' or 'record'
  const { currentUser } = useAuth();

  const toggleMode = () => {
    setMode(prevMode => prevMode === 'plan' ? 'record' : 'plan');
  };

  return (
    <div className="App">
      <Header mode={mode} toggleMode={toggleMode} />
      <Routes>
        <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!currentUser ? <Register /> : <Navigate to="/" />} />
        <Route 
          path="/" 
          element={currentUser ? <Calendar mode={mode} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </div>
  );
}

export default App;
