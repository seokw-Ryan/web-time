-- Create the database
CREATE DATABASE homepage_db;

-- Connect to the database
\c homepage_db;

-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);

-- Create the tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    due_date TIMESTAMP,
    reminder TIMESTAMP
);

-- Insert test data into users table
INSERT INTO users (username, password) VALUES 
('testuser1', '$2b$10$O1Rv3RHv3K2j8L9vDQ4nCOnlAKdL9w/jpoe6u6J2FxtSZ9jYwGoeq'), -- password is 'password1' hashed with bcrypt
('testuser2', '$2b$10$F1Rv4RHv4K3j8M9vDQ4nCOnlAKdL9w/jpoe6u6J2FxtSZ9jYwGoeq'); -- password is 'password2' hashed with bcrypt

-- Insert test data into tasks table
INSERT INTO tasks (user_id, title, description, due_date, reminder) VALUES 
(1, 'Test Task 1', 'This is a test task for user 1.', '2023-07-15 10:00:00', '2023-07-15 09:00:00'),
(1, 'Test Task 2', 'This is another test task for user 1.', '2023-07-16 14:00:00', '2023-07-16 13:30:00'),
(2, 'Test Task 3', 'This is a test task for user 2.', '2023-07-17 16:00:00', '2023-07-17 15:45:00');

-- Select data from users table to verify
SELECT * FROM users;

-- Select data from tasks table to verify
SELECT * FROM tasks;
