# 2.2 The Proposed System

## 2.2.1 Introduction to the Proposed System
The proposed system is a complete, modern digital learning platform designed to fix the problems found in the existing education systems. Unlike old systems where students, teachers, and admins have to use many different websites and tools to get things done, this new platform brings everything together into one unified application. 

The main goal of this proposed system is to make learning smooth, interactive, and automated. It offers a single place where students can watch lesson videos, take quizzes, track their progress, and safely pay for premium courses. For administrators and mentors, the system provides powerful tools to manage users, create new courses, and track what students are doing in real-time. By moving all these tasks to one smart system, we remove manual work, reduce mistakes, and create a much better experience for everyone.

## 2.2.2 Primary Objectives
To make sure the proposed system is useful and successful, we have set the following objectives:
*   **Centralized Learning Experience:** To combine video holding, reading materials, quizzes, and tests into one easy-to-use platform.
*   **Automated Payments and Enrollment:** To use a secure payment gateway (Razorpay) so students get instant access to courses right after they pay, without waiting for manual human approval.
*   **Role-Based Dashboards:** To give different views and tools to Students, Mentors, and Administrators, depending on what they need to do.
*   **Interactive Mentorship and AI:** To add features like an AI Tutor and simple ways for students to ask mentors questions instantly.
*   **Detailed Progress Tracking:** To help students see how far they have come in a course and allow mentors to see if a student is falling behind.
*   **High Security:** To keep student data, passwords, and payment information completely safe from unauthorized access.

## 2.2.3 Key Features of the System
The proposed system introduces several powerful features expressed in simple English:
1.  **Continuous Video Player:** When a student clicks "Start Learning," the system plays the course videos in the right order. When one video finishes, the next one can start, much like watching a playlist.
2.  **Instant Quiz System:** After finishing a set of videos, students can take a quiz directly on the same page. The system checks the answers instantly and gives a score.
3.  **Real-Time Dashboard:** As soon as a user logs in, they see a beautiful dashboard showing their active courses, percentage of completion, and recent announcements. 
4.  **Secure Checkout:** A smooth checkout page where students can enter their card or UPI details safely to buy a course. 
5.  **Admin Control Panel:** A special hidden area only for owners (Admins) to add new courses, change prices, and remove bad users.

## 2.2.4 Detailed Module Descriptions
The system is divided into several main "Modules" or parts to keep the software organized.

### A. User Management and Authentication Module
This module handles everything about logging in and creating accounts. It controls who is who. 
*   **Registration:** New users can sign up by giving their name, email, and password. The system checks to make sure the email is valid.
*   **Login & Security:** Users log in with their email and password. The system uses secure tokens (like a digital ID card) to keep them securely logged in while they learn.
*   **Role Checking:** When a user logs in, the system checks if they are a "Student," a "Mentor," or an "Admin" and sends them to the correct dashboard.

### B. Course and Content Management Module
This is where the learning material lives. 
*   **Course Creation:** Admins and mentors can create a new course structure by uploading videos, typing descriptions, and setting a price.
*   **Category Sorting:** Courses are sorted into subjects (like Programming, Art, Math) so students can find what they want easily using a search bar.
*   **Content Delivery:** The system streams the videos smoothly over the internet so students do not have to download large files to their phones or laptops.

### C. Student Progress and Assessment Module
This module keeps track of what the student is doing.
*   **Progress Tracking:** The system remembers exactly which video a student watched last. If they close the browser and come back tomorrow, they can start exactly where they left off.
*   **Quizzes:** Teachers can create multiple-choice questions. Students click on the answers, and the system grading happens in just one second. 
*   **Certificates (Future Scope):** Once progress hits 100%, the system can generate a digital certificate of completion.

### D. Revenue and Payment Integration Module
Making sure the creator gets paid and the student gets access without delay.
*   **Razorpay Gateway:** The system connects safely to the bank through Razorpay. It handles real money.
*   **Auto-Enrollment:** The moment the bank says "Payment Successful," this module automatically adds the course to the student's dashboard. No human needs to check it.
*   **Payment History:** Students can see a list of everything they bought, and Admins can see a list of all money earned.

## 2.2.5 System Architecture 
The proposed platform is built using a modern "Client-Server" architecture.
*   **Frontend (The Client):** This is the part the user sees and clicks on (built with React). It is designed to be very fast and beautiful, with pleasing colors and smooth animations.
*   **Backend (The Server):** This is the brain of the project (built with Node.js and Express). It runs in the background. When the frontend asks for a video or a quiz, the backend fetches it and sends it back safely.
*   **Database:** This is the filing cabinet. It permanently stores all user names, passwords, course texts, and payment records. 

*(Note: Add your System Architecture Diagram here in your final report)*

## 2.2.6 Data Flow Overview (DFD Explanation)
To understand how information moves in this system, we use Data Flow Diagrams (DFDs).

### Context Level Diagram (Level 0)
Imagine a big circle representing the whole "Educational System".
*   **Students** send "Login Info" and "Payments" into the circle, and receive "Course Videos" and "Quiz Scores" back.
*   **Admins** send "New Courses" and "System Updates" into the circle, and receive "Revenue Reports" and "User Lists" back.
*   **Payment Gateway (External)** receives "Money Request" from the circle and gives back a "Success Receipt".

### Level 1 Diagram
Here we open the system up to see the main steps:
1.  **Registration Process:** User info goes in, gets saved in the User Database.
2.  **Browsing Process:** Student requests a course list, the system fetches it from the Course Database.
3.  **Payment Process:** Student clicks "Buy", info flows to the external bank, the bank sends back approval, and the system updates the Enrollment Database.

*(Note: Add your DFD Diagrams here in your final report)*

## 2.2.7 Entity-Relationship (ER) Model Explanation
The Database is highly organized. The main "Entities" (tables) are:
*   **User Entity:** Contains User ID, Full Name, Email, Encrypted Password, and Role (Admin/Student).
*   **Course Entity:** Contains Course ID, Title, Description, Video URLs, Price, and Mentor ID (who created it).
*   **Enrollment Entity:** Connects a User to a Course. It tracks the Date Joined and the Completion Percentage.
*   **Payment Entity:** Tracks Transaction ID, Amount, Status (Success/Failed), and ties it to the specific User and Course.

These entities are linked. For example, One User can have Many Enrollments. One Course can have Many Quizzes. 

*(Note: Add your ER Diagram here in your final report)*

## 2.2.8 UML System Modeling
We use UML diagrams to plan user actions visually.

### Use Case Diagram Description
*   **The Student Actor** can: Register, Search Courses, Buy Course, Watch Video, Take Quiz, View Profile.
*   **The Admin Actor** can: Login, Add Course, Update Video, View All Payments, Ban User.
*   **The Payment Gateway Actor** can: Verify Transaction, Decline Transaction.

### Sequence Diagram: Payment Process
1.  Student clicks "Checkout" on Frontend.
2.  Frontend asks Backend to "Create Order".
3.  Backend creates a secure order ID with Razorpay and gives it to Frontend.
4.  Frontend opens the Bank window. Student pays.
5.  Bank tells Backend "Payment is good".
6.  Backend saves data in DB and tells Frontend "Success".
7.  Frontend unlocks the course for the Student.

*(Note: Add your Use Case and Sequence Diagrams here in your final report)*

## 2.2.9 System Requirements (Hardware and Software)
To run and develop this system, the basic requirements are:
**Server / Development Requirements:**
*   **Processor:** Intel Core i5 or similar (for running the local server smoothly).
*   **Memory (RAM):** 8 GB minimum (16 GB recommended for smooth coding).
*   **Storage:** At least 256GB SSD.

**Software Requirements:**
*   **Frontend Framework:** React.js / Vite.
*   **Backend Framework:** Node.js with Express.js.
*   **Database:** MongoDB or local mock JS data (Depending on final deployment).
*   **Payment Tech:** Razorpay API.
*   **Editor:** Visual Studio Code.

**End-User Requirements (For the student):**
*   Any modern web browser (Google Chrome, Safari, Firefox).
*   A stable internet connection to stream videos.
*   A smartphone, tablet, or laptop.

## 2.2.10 Advantages of the Proposed System
Because of the complete redesign, the proposed system offers many great benefits:
1.  **Saves Time:** Students don't have to wait for admins to give them course access. Automation takes care of it instantly.
2.  **Mobile Friendly:** The interface is designed to look beautiful and work perfectly on both large computer screens and small mobile phones.
3.  **Cost Effective:** By keeping all tools in one platform (videos, quizzes, payments), the creators do not have to pay for five different software subscriptions.
4.  **Data Driven:** Admins get a clear view of how much money is made and how many students are learning, which helps in making better business choices.
5.  **Scalable:** If the user count goes from 100 students to 10,000 students, the automated server and database can handle the extra load very well.

## 2.2.11 Conclusion of the Proposed System
In conclusion, the proposed educational platform is a giant leap forward from the existing old systems. By using modern web technologies like React and secure payment gateways, we have created an environment that is not just a digital classroom, but a complete business solution for online education. It is faster, safer, totally automated, and offers a premium layout that will impress users right from the start. This system is fully prepared to provide an excellent online learning experience today and has the strong foundation needed to grow in the future.

---

### *A Note for Reaching exactly 15 Pages in your Final Word Document:*
To format this text so it spans 15 pages for your college or office project report, follow these formatting steps:
1.  **Create a Title Page** (1 page)
2.  **Use large headings (Size 16, Bold)** and standard paragraph text (Size 12 text, Times New Roman or Arial).
3.  **Set Line Spacing to 1.5 or 2.0 (Double Spacing)**. This is a standard requirement for academic reports and will stretch the text significantly.
4.  **Insert Diagrams:** You MUST insert full-page or half-page images where I have left notes (e.g., `*(Note: Add your DFD Diagrams...)*`). For 15 pages, you will need to add:
    *   System Architecture Diagram (1 page)
    *   Data Flow Diagram Level 0 and Level 1 (2 pages)
    *   Use Case Diagram (1 page)
    *   Sequence Diagram (1 page)
    *   Entity Relationship (ER) Diagram (1 page)
    *   4 to 5 Screenshots of your actual working UI (Login page, Dashboard, Video Player, Checkout). (3 to 4 pages)
5.  Combined with your 2-page Existing System document, these texts and diagrams will perfectly fill 15 high-quality, professional pages.
