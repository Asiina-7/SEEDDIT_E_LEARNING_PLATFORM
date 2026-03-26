## 2.2.9 API Routes and Backend Architecture

The Seedit platform's backend is fundamentally structured around a RESTful API (Representational State Transfer) architecture. This decoupled design ensures that the frontend React application communicates seamlessly and securely with the Node.js/Express.js backend server. The API layer is responsible for routing all client requests, executing business logic via modular services, interacting with the underlying database, and returning standardized JSON responses.

### 2.2.9.1 Core Routing Principles
The API architecture is built upon the following core principles to ensure scalability, security, and maintainability:
1.  **Statelessness:** Every HTTP request from the client to the server contains all the necessary information to understand and process the request. The server does not store any session context; instead, authentication is managed via JSON Web Tokens (JWT) passed in the HTTP Authorization headers.
2.  **Resource-Based Structure:** API endpoints are strictly mapped to system resources (e.g., `/api/users`, `/api/courses`, `/api/payments`). HTTP verbs (GET, POST, PUT, DELETE) are used appropriately to signify the intended action on these resources, ensuring a clean and predictable interface.
3.  **Middleware Pipeline:** Requests pass through a structured middleware pipeline before reaching their designated controllers. This pipeline handles cross-cutting concerns such as Cross-Origin Resource Sharing (CORS) enforcement, request payload validation, error handling, and robust authentication checks.

### 2.2.9.2 Major API Modules

#### A. Authentication and User Management Routes (`/api/auth`)
These routes handle the secure onboarding and session management of users.
*   **`POST /api/auth/register`**: Accepts new user payloads (name, email, password, role). The controller hashes the password using bcrypt, stores the credentials, and issues an initial JWT.
*   **`POST /api/auth/login`**: Validates credentials against the database. Upon successful verification, it returns a cryptographically signed JWT containing the user's ID and role, establishing the stateless session.
*   **`GET /api/auth/me`**: A protected route that allows an authenticated client application to silently verify the validity of its active token and retrieve the current user's profile data without requiring a re-login.

#### B. Course Logistics and Content Delivery (`/api/courses`)
This module manages the vast majority of the static and streaming educational content.
*   **`GET /api/courses`**: Retrieves a paginated list of all publicly available courses, supporting complex query parameters for searching by category, mentor, or price.
*   **`GET /api/courses/{courseId}`**: Fetches the detailed metadata of a specific course, including its module hierarchy, syllabus, and mentor information.
*   **`POST /api/courses`**: A Mentor-exclusive endpoint protected by strict role-based middleware. It handles complex multipart formdata containing video blobs, PDFs, and textual metadata to dynamically generate new course entries in the database.
*   **`PUT /api/courses/{courseId}/modules/{moduleId}`**: Allows content creators to update specific subsections of their curriculum without re-uploading the entire course structure.

#### C. Secure Payment and Enrollment Orchestration (`/api/payments`)
These critical routes interface directly with the Razorpay gateway to handle financial transactions.
*   **`POST /api/payments/create-order`**: Initiated when a student clicks 'Buy Now'. The backend communicates securely with Razorpay to generate a unique Order ID bound to the purchase amount, preventing client-side price tampering.
*   **`POST /api/payments/verify-signature`**: Functions as the webhook catch-point. Upon a successful transaction on the frontend modal, Razorpay hits this endpoint with a signature. The controller cryptographically verifies the signature utilizing the secret key. If valid, it triggers an internal service to automatically grant the user database-level access to the course content.

#### D. Intelligent Tutoring System Endpoint (`/api/ai-tutor`)
This specialized route acts as the conduit between the user and the Groq/Mixtral language models.
*   **`POST /api/ai-tutor/ask`**: Protected to ensure only actively enrolled students can query the model. The frontend payload contains the user's question, the current video timestamp, and the course context. The Express.js backend securely appends the hidden developer prompt, forwards the request securely to the Groq API (bypassing any frontend exposure of API keys), and streams the generated response back to the client interface.

### 2.2.9.3 Error Handling and Status Codes
The API architecture strictly enforces standardized HTTP status codes to provide immediate, actionable feedback to the frontend application:
*   **`200 OK` & `201 Created`**: Signifies successful retrieval or creation of resources.
*   **`400 Bad Request`**: Indicates the client sent malformed data (e.g., missing required fields in a registration form).
*   **`401 Unauthorized`**: Returned when an API request lacks a valid JWT, immediately prompting the frontend to redirect the user to the login screen.
*   **`403 Forbidden`**: Returned when an authenticated user attempts to access an endpoint outside their privilege level (e.g., a Student attempting to hit a `POST /api/courses` route).
*   **`500 Internal Server Error`**: Caught globally by an error-handling middleware interceptor to prevent the application from crashing, logging the stack trace securely while returning a generic obfuscated error message to the client.
