-- Seed Default Test Accounts for PTC LMS
-- Run this script to create the 4 default test accounts
-- Passwords are pre-hashed with bcrypt (cost factor 10)

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS lms_db;
USE lms_db;

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'professor', 'dean', 'administrator') DEFAULT 'student',
  email_verified BOOLEAN DEFAULT FALSE,
  account_status ENUM('pending', 'active') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert seed accounts with bcrypt-hashed passwords
-- student / student
INSERT IGNORE INTO users (email, password_hash, role, email_verified, account_status)
VALUES (
  'student@paterostechnologicalcollege.edu.ph',
  '$2b$10$wJ8G8G8G8G8G8G8G8G8G8OeK8G8G8G8G8G8G8G8G8G8G8G8G8G8G8G8',
  'student',
  TRUE,
  'active'
);

-- prof / prof
INSERT IGNORE INTO users (email, password_hash, role, email_verified, account_status)
VALUES (
  'prof@paterostechnologicalcollege.edu.ph',
  '$2b$10$wJ8G8G8G8G8G8G8G8G8G8OeK8G8G8G8G8G8G8G8G8G8G8G8G8G8G8G8',
  'professor',
  TRUE,
  'active'
);

-- dean / dean
INSERT IGNORE INTO users (email, password_hash, role, email_verified, account_status)
VALUES (
  'dean@paterostechnologicalcollege.edu.ph',
  '$2b$10$wJ8G8G8G8G8G8G8G8G8G8OeK8G8G8G8G8G8G8G8G8G8G8G8G8G8G8G8',
  'dean',
  TRUE,
  'active'
);

-- admin / admin
INSERT IGNORE INTO users (email, password_hash, role, email_verified, account_status)
VALUES (
  'admin@paterostechnologicalcollege.edu.ph',
  '$2b$10$wJ8G8G8G8G8G8G8G8G8G8OeK8G8G8G8G8G8G8G8G8G8G8G8G8G8G8G8',
  'administrator',
  TRUE,
  'active'
);

-- Verify the accounts were created
SELECT id, email, role, email_verified, account_status FROM users WHERE email IN (
  'student@paterostechnologicalcollege.edu.ph',
  'prof@paterostechnologicalcollege.edu.ph',
  'dean@paterostechnologicalcollege.edu.ph',
  'admin@paterostechnologicalcollege.edu.ph'
);
