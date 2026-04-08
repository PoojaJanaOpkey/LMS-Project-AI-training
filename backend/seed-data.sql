-- LMS Database Seed Data
USE lmsdbnew;

-- Insert Users (Passwords are hashed for "Password123")
-- BCrypt hash: $2a$11$9z3o1J3Z3Z3Z3Z3Z3Z3Z3e7Cz7Cz7Cz7Cz7Cz7Cz7Cz7Cz7Cz7C
-- For testing: Email with any of the emails below, Password: Password123
INSERT INTO Users (FirstName, LastName, Email, PasswordHash, Role, CreatedAt) VALUES
('Admin', 'User', 'admin@lms.com', '$2a$11$7EqJtq98hPqEX7fNZaFWoO7hHqBhLBJFpJt8FJe3eoK8JhMOKjd3e', 'Admin', NOW()),
('John', 'Doe', 'john.doe@student.com', '$2a$11$7EqJtq98hPqEX7fNZaFWoO7hHqBhLBJFpJt8FJe3eoK8JhMOKjd3e', 'Student', NOW()),
('Jane', 'Smith', 'jane.smith@student.com', '$2a$11$7EqJtq98hPqEX7fNZaFWoO7hHqBhLBJFpJt8FJe3eoK8JhMOKjd3e', 'Student', NOW()),
('Mike', 'Johnson', 'mike.j@student.com', '$2a$11$7EqJtq98hPqEX7fNZaFWoO7hHqBhLBJFpJt8FJe3eoK8JhMOKjd3e', 'Student', NOW()),
('Sarah', 'Williams', 'sarah.w@student.com', '$2a$11$7EqJtq98hPqEX7fNZaFWoO7hHqBhLBJFpJt8FJe3eoK8JhMOKjd3e', 'Student', NOW());

-- Insert Courses
INSERT INTO Courses (Title, Description, Category, Level, Price, Duration, ImageUrl, InstructorName, CreatedAt) VALUES
('Web Development Bootcamp', 'Complete web development course covering HTML, CSS, JavaScript, React, Node.js and more', 'Web Development', 'Beginner', 49.99, 120, 'https://via.placeholder.com/400x300?text=Web+Dev', 'Dr. Emily Carter', NOW()),
('Python for Data Science', 'Master Python programming and data analysis with Pandas, NumPy, and data visualization', 'Data Science', 'Intermediate', 59.99, 80, 'https://via.placeholder.com/400x300?text=Python+DS', 'Prof. Robert Lee', NOW()),
('Digital Marketing Masterclass', 'Learn SEO, Social Media Marketing, Email Marketing, and Content Marketing strategies', 'Marketing', 'Beginner', 39.99, 60, 'https://via.placeholder.com/400x300?text=Marketing', 'Lisa Anderson', NOW()),
('Machine Learning A-Z', 'Complete machine learning course with Python, TensorFlow, and real-world projects', 'Data Science', 'Advanced', 79.99, 150, 'https://via.placeholder.com/400x300?text=ML', 'Dr. James Wilson', NOW()),
('UI/UX Design Fundamentals', 'Master user interface and user experience design principles with Figma and Adobe XD', 'Design', 'Beginner', 44.99, 50, 'https://via.placeholder.com/400x300?text=UI+UX', 'Maria Garcia', NOW()),
('Full Stack JavaScript', 'Build full stack applications with MongoDB, Express, React, and Node.js (MERN)', 'Web Development', 'Advanced', 69.99, 100, 'https://via.placeholder.com/400x300?text=MERN', 'Chris Thompson', NOW());

-- Insert Modules for Course 1 (Web Development Bootcamp)
INSERT INTO Modules (CourseId, Title, Description, OrderIndex) VALUES
(1, 'HTML & CSS Basics', 'Learn the fundamentals of HTML and CSS', 1),
(1, 'JavaScript Fundamentals', 'Master JavaScript programming basics', 2),
(1, 'React Framework', 'Build modern web apps with React', 3),
(1, 'Backend with Node.js', 'Create server-side applications', 4);

-- Insert Modules for Course 2 (Python for Data Science)
INSERT INTO Modules (CourseId, Title, Description, OrderIndex) VALUES
(2, 'Python Basics', 'Introduction to Python programming', 1),
(2, 'Data Analysis with Pandas', 'Master data manipulation with Pandas', 2),
(2, 'Data Visualization', 'Create stunning visualizations', 3);

-- Insert Modules for Course 3 (Digital Marketing)
INSERT INTO Modules (CourseId, Title, Description, OrderIndex) VALUES
(3, 'Introduction to Digital Marketing', 'Overview of digital marketing landscape', 1),
(3, 'SEO Mastery', 'Search engine optimization techniques', 2),
(3, 'Social Media Marketing', 'Leverage social platforms for business', 3);

-- Insert Lessons for Module 1 (HTML & CSS Basics)
INSERT INTO Lessons (ModuleId, Title, Content, VideoUrl, Duration, OrderIndex) VALUES
(1, 'Introduction to HTML', 'Learn HTML structure and basic tags', 'https://www.youtube.com/watch?v=example1', 30, 1),
(1, 'HTML Forms and Tables', 'Master forms and table creation', 'https://www.youtube.com/watch?v=example2', 45, 2),
(1, 'CSS Fundamentals', 'Styling with CSS properties', 'https://www.youtube.com/watch?v=example3', 40, 3),
(1, 'CSS Flexbox and Grid', 'Modern layout techniques', 'https://www.youtube.com/watch?v=example4', 50, 4);

-- Insert Lessons for Module 2 (JavaScript Fundamentals)
INSERT INTO Lessons (ModuleId, Title, Content, VideoUrl, Duration, OrderIndex) VALUES
(2, 'JavaScript Variables and Data Types', 'Understanding JS fundamentals', 'https://www.youtube.com/watch?v=example5', 35, 1),
(2, 'Functions and Arrays', 'Working with functions and arrays', 'https://www.youtube.com/watch?v=example6', 40, 2),
(2, 'DOM Manipulation', 'Interacting with HTML elements', 'https://www.youtube.com/watch?v=example7', 45, 3);

-- Insert Lessons for Module 3 (React Framework)
INSERT INTO Lessons (ModuleId, Title, Content, VideoUrl, Duration, OrderIndex) VALUES
(3, 'React Components', 'Building reusable components', 'https://www.youtube.com/watch?v=example8', 50, 1),
(3, 'State and Props', 'Managing component state', 'https://www.youtube.com/watch?v=example9', 45, 2),
(3, 'React Hooks', 'Modern React with hooks', 'https://www.youtube.com/watch?v=example10', 55, 3);

-- Insert Enrollments
INSERT INTO Enrollments (StudentId, CourseId, CompletionPercentage, Status, EnrollmentDate, LastAccessedAt) VALUES
(2, 1, 65, 'Active', NOW(), NOW()),
(2, 3, 100, 'Completed', DATE_SUB(NOW(), INTERVAL 30 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
(3, 1, 30, 'Active', NOW(), NOW()),
(3, 2, 45, 'Active', NOW(), NOW()),
(4, 4, 20, 'Active', NOW(), NOW()),
(5, 1, 85, 'Active', NOW(), NOW()),
(5, 5, 100, 'Completed', DATE_SUB(NOW(), INTERVAL 60 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY));

-- Insert Ratings
INSERT INTO Ratings (StudentId, CourseId, RatingValue, Review, CreatedAt) VALUES
(2, 3, 5, 'Amazing course! Learned so much about digital marketing. Highly recommended!', NOW()),
(3, 1, 4, 'Great content and well structured. The instructor explains everything clearly.', NOW()),
(3, 2, 5, 'Best Python course I have taken. Very practical and hands-on.', NOW()),
(5, 5, 5, 'Excellent UI/UX course. The design principles are explained perfectly!', NOW()),
(4, 4, 4, 'Good machine learning course but quite challenging for beginners.', NOW());

-- Insert Payments
INSERT INTO Payments (StudentId, CourseId, Amount, PaymentMethod, Status, TransactionId, PaymentDate) VALUES
(2, 1, 49.99, 'Stripe', 'Completed', 'TXN-2024-001', DATE_SUB(NOW(), INTERVAL 45 DAY)),
(2, 3, 39.99, 'PayPal', 'Completed', 'TXN-2024-002', DATE_SUB(NOW(), INTERVAL 30 DAY)),
(3, 1, 49.99, 'Stripe', 'Completed', 'TXN-2024-003', DATE_SUB(NOW(), INTERVAL 20 DAY)),
(3, 2, 59.99, 'Stripe', 'Completed', 'TXN-2024-004', DATE_SUB(NOW(), INTERVAL 15 DAY)),
(4, 4, 79.99, 'PayPal', 'Completed', 'TXN-2024-005', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(5, 1, 49.99, 'Stripe', 'Completed', 'TXN-2024-006', DATE_SUB(NOW(), INTERVAL 65 DAY)),
(5, 5, 44.99, 'Stripe', 'Completed', 'TXN-2024-007', DATE_SUB(NOW(), INTERVAL 60 DAY));

-- Insert Gallery Items
INSERT INTO GalleryItems (Title, Description, Type, FilePath, ThumbnailPath, UploadedAt) VALUES
('Student Project: E-commerce Website', 'Amazing e-commerce project built by our student using React and Node.js', 'Image', '/uploads/gallery/ecommerce-project.jpg', '/uploads/gallery/thumbs/ecommerce-project.jpg', NOW()),
('Graduation Ceremony 2024', 'Our successful graduates receiving their certificates', 'Image', '/uploads/gallery/graduation-2024.jpg', '/uploads/gallery/thumbs/graduation-2024.jpg', DATE_SUB(NOW(), INTERVAL 10 DAY)),
('Course Introduction Video', 'Welcome to our Learning Management System', 'Video', '/uploads/gallery/intro-video.mp4', '/uploads/gallery/thumbs/intro-video.jpg', NOW()),
('Machine Learning Workshop', 'Students working on ML projects during our workshop', 'Image', '/uploads/gallery/ml-workshop.jpg', '/uploads/gallery/thumbs/ml-workshop.jpg', DATE_SUB(NOW(), INTERVAL 5 DAY)),
('Student Success Story', 'Interview with our top performing student', 'Video', '/uploads/gallery/success-story.mp4', '/uploads/gallery/thumbs/success-story.jpg', DATE_SUB(NOW(), INTERVAL 15 DAY));

-- Display summary
SELECT 'Data seeded successfully!' AS Status;
SELECT COUNT(*) AS TotalUsers FROM Users;
SELECT COUNT(*) AS TotalCourses FROM Courses;
SELECT COUNT(*) AS TotalModules FROM Modules;
SELECT COUNT(*) AS TotalLessons FROM Lessons;
SELECT COUNT(*) AS TotalEnrollments FROM Enrollments;
SELECT COUNT(*) AS TotalRatings FROM Ratings;
SELECT COUNT(*) AS TotalPayments FROM Payments;
SELECT COUNT(*) AS TotalGalleryItems FROM GalleryItems;
