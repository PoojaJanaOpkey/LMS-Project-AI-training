## Learning Management System Website

Consider yourself as senior angular full stack developer, you have been assigned to create a Learning Management System (LMS) website. The LMS will allow users to browse and enroll in courses, track their progress, and manage their learning experience. The website will have a modern and user-friendly interface, with features such as course catalogs, student dashboards, and admin panels for course management and implemet concepts

## Tecnology stack
- Frontend: HTML, CSS, Bootstrap, Angular 19
- Backend: ASP.NET Core Web API
- Database: MySQL

## Features

-
- Creating the Home Page Design using HTML & Bootstrap that has catchy hero section, dynamic statistics, feature cards,caraousels, popular courses, and call-to-action sections

- There should be a navbar with links to Home, Courses,subsections of courses with nexted dropdowns navigating to specific courses, Dashboard, and Admin Panel (visible only to admins).

- user should be able to switch to various sections using SPA Routing.

- UI should Responsive Design using Bootstrap to ensure the website looks great on all devices (desktops, tablets, and smartphones) and having Dynamic UI Elements such as animations, hover effects, and interactive components to enhance user engagement.

- User Authentication (Admin, Student) using reactive forms and template driven forms with validation and secure password handling.On successly login, users should be redirected to their respective dashboards.

- Course Management (CRUD operations for courses, modules, and lessons) with each section having its own page for creating, updating, and deleting courses, modules, and lessons. Admins should have access to these features through the admin panel.

- User Dashboard (View enrolled courses, progress tracking) where students can see the courses they are enrolled in, track their progress through modules and lessons, and access course materials . There should be progress bars , bar charts and others pictorial representations of the progress, courses enrolled and other stats.


- Student Dashboard (View enrolled courses, progress tracking) with proper pictorial representations of the progress, courses enrolled and other stats. Students should be able to access course materials, view their progress, and receive notifications about upcoming deadlines or new courses.

- Add functionality of having video calls also so that there can be live sessions for the courses. This can be implemented using WebRTC or integrating with third-party services like Zoom or Google Meet.

- Integrate a notification system to send alerts to students about course updates, deadlines, and announcements. This can be implemented using email notifications or in-app notifications.

- Implement a rating and review system for courses, allowing students to provide feedback and rate their learning experience. This can help other students make informed decisions about which courses to enroll in and also dashboard with appropriate pictorial representations of the ratings and reviews for each course. There should also be appropriate filters as per the data to sort the courses based on ratings, popularity, and other factors like time spend , cost etc.

- create a page for payment also where students can make payments for enrolling in courses. This can be implemented using payment gateways like Stripe or PayPal.
- Implement a search functionality to allow users to search for courses based on keywords, categories, or other filters. This can help users quickly find relevant courses and improve their overall experience on the platform.

- Every section should be accessible from the navbar and should have its own route for easy navigation. The website should be designed with a modern and user-friendly interface, ensuring a seamless learning experience for students and efficient course management for admins.

- You can take help of the following resources for design inspiration and implementation:
https://www.wix.com/website/templates where there are various templates for education and online learning platforms that can be used as a reference for designing the LMS website. You can also explore other design resources like Dribbble, Behance, and Awwwards for additional inspiration and ideas.

- A responsive Bootstrap-based slider should be integrated into the homepage or landing section.
- The slider should support both images and videos, allowing for dynamic content presentation.
- It should include navigation controls (arrows, dots) for easy browsing through the slides.

-The "Contact Us" section must include an embedded Google Map alongside a user-friendly contact form.
- The contact form should have fields for the user's name, email, subject, and message, with proper validation to ensure all required information is provided.
- The embedded Google Map should display the location of the LMS's physical office or headquarters, providing users with a visual reference for the organization's location.
- The portal must be optimized for search engines (SEO) to enhance discoverability and ranking.

- Contact form submissions should be securely routed to the administrator or owner's designated email addressa and the receiver should receive email on successful submission of the form.

Cross-browser compatibility is essential, including support for legacy browsers where applicable.
- Admin Dashboard (Manage courses, view student progress)
- Courses Catalog (Browse available courses, search functionality) with each course having a detailed page with description, syllabus, and enrollment option.
- Gallery (Showcase course materials, student projects, and events) including images, videos, and documents.

## Common Features
- Responsive UI (Bootstrap)
- Role-Based Access Control (RBAC)
- RESTful APIs
- Error Handling & Validation
- Notifications (Email/SMS - optional)
- Reactive and Template-Driven Forms with Validation
- Secure Authentication