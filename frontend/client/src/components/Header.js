import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PlanToggle from './PlanToggle';

const Header = ({ mode, toggleMode }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <h1>Time Management App</h1>
        {isAuthenticated && <PlanToggle mode={mode} toggleMode={toggleMode} />}
      </div>
      <nav className="header-nav">
        {isAuthenticated ? (
          <>
            <Link to="/">Dashboard</Link>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
