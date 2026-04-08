-- Quick fix: Update existing users with working password hash
-- Password for all users: "password" (lowercase, simple for testing)
USE lmsdbnew;

-- Update all existing users with a working BCrypt hash for password "password"
UPDATE Users SET PasswordHash = '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' WHERE Email = 'admin@lms.com';
UPDATE Users SET PasswordHash = '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' WHERE Email = 'john.doe@student.com';
UPDATE Users SET PasswordHash = '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' WHERE Email = 'jane.smith@student.com';
UPDATE Users SET PasswordHash = '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' WHERE Email = 'mike.j@student.com';
UPDATE Users SET PasswordHash = '$2a$11$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy' WHERE Email = 'sarah.w@student.com';

SELECT 'Passwords updated! Use password: "password" (lowercase) for all users' AS Message;
SELECT Email, Role FROM Users;
