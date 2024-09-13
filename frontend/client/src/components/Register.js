import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [timeZone, setTimeZone] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username || !email || !password || !timeZone) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const response = await axios.post('/api/auth/register', {
                username,
                email,
                password,
                timeZone
            });
            const { token } = response.data;
            login(token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during registration');
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="timeZone">Time Zone:</label>
                    <select
                        id="timeZone"
                        value={timeZone}
                        onChange={(e) => setTimeZone(e.target.value)}
                        required
                    >
                        <option value="">Select a time zone</option>
                        <option value="UTC-12:00">UTC-12:00</option>
                        <option value="UTC-11:00">UTC-11:00</option>
                        {/* Add more time zone options as needed */}
                        <option value="UTC+12:00">UTC+12:00</option>
                    </select>
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
