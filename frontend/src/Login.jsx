import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });
      console.log('Login successful:', response.data);
      // Handle successful login (e.g., save token, redirect)
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div className="login-container">
      <h1 className="logo">daiw</h1>
      <form onSubmit={handleSubmit}>
        <h2>Sign in</h2>
        <div className="form-floating">
          <input
            type="email"
            className="form-control"
            id="floatingInput"
            placeholder="Email or Phone"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="floatingInput">Email or Phone</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>
        <div className="forgot-password">
          <a href="/forgot-password">Forgot password?</a>
        </div>
        <button className="btn btn-primary w-100 py-2" type="submit">
          Sign in
        </button>
        <div className="signup-link">
          New? <a href="/signup">Join now</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
