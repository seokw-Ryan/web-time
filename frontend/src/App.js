import React from 'react';
import Home from './Home';
import './App.css'; // Importing App-specific styles
import Login from './Login';
import Signup from './Signup';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path = "/signup" element={<Signup />} />
            </Routes>
          </div>
      </Router>
    </div>
  );
}

export default App;
