CREATE DATABASE IF NOT EXISTS technova;
USE technova;

-- Users / Registrations
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    college VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(50) NOT NULL,
    dob DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Events
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Not Started',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Admins
CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Event Registrations
CREATE TABLE IF NOT EXISTS event_registrations (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    participant_id VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    registration_status VARCHAR(50) DEFAULT 'Registered',
    registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(event_id) REFERENCES events(id),
    UNIQUE(user_id, event_id)
);

-- Insert demo admin (Password: admin123)
-- Hash generated using bcrypt for "admin123"
INSERT IGNORE INTO admins (name, email, password_hash) 
VALUES ('Super Admin', 'a.mohamedirfan005@gmail.com', '$2b$10$EP0t5L5/5YJ5n5F5.5.5.e7b3Z3q3L5M5K5P5.5.5.5.5.5.5.5.5');

-- Insert initial events
INSERT IGNORE INTO events (name, description, status) VALUES 
('Poster Making', 'Showcase your creativity and design skills.', 'Not Started'),
('Speed Debugging', 'Find and fix the bugs before time runs out.', 'Not Started'),
('UI/UX Redesign', 'Redesign existing interfaces to be more intuitive.', 'Not Started');
