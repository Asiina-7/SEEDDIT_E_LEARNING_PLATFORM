# Seedit E-Learning Platform - UML Diagrams

You can use these Mermaid UML diagrams in your project report. Many markdown editors (like GitHub, Notion, or Obsidian) support Mermaid natively. You can also paste these code blocks into [Mermaid Live Editor](https://mermaid.live/) to generate high-quality images for your Word document.

## 1. Use Case Diagram

This diagram illustrates the primary actors (Student, Mentor, Admin) and their interactions with the Seedit platform.

```mermaid
usecaseDiagram
    actor Student
    actor Mentor
    actor Admin

    package "Seedit Platform" {
        usecase "Login / Register" as UC1
        usecase "Browse Courses" as UC2
        usecase "Purchase Course (Razorpay)" as UC3
        usecase "View Enrolled Courses" as UC4
        usecase "Watch Videos Sequentially" as UC5
        usecase "Interact with AI Tutor" as UC6
        usecase "Create New Course" as UC7
        usecase "Upload Videos/Resources" as UC8
        usecase "Manage Users & Roles" as UC9
        usecase "Monitor Payments" as UC10
    }

    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5
    Student --> UC6

    Mentor --> UC1
    Mentor --> UC7
    Mentor --> UC8
    Mentor --> UC2

    Admin --> UC1
    Admin --> UC9
    Admin --> UC10
```

## 2. Activity / Data Flow Diagram: Payment & Enrollment

This diagram shows the step-by-step flow of a student purchasing a course and getting enrolled via Razorpay.

```mermaid
sequenceDiagram
    participant Student
    participant Frontend (React)
    participant Backend (Node.js)
    participant Razorpay

    Student->>Frontend (React): Clicks "Buy Course"
    Frontend (React)->>Backend (Node.js): Request Order Creation (Course ID, User ID)
    Backend (Node.js)->>Razorpay: Create Order API Call
    Razorpay-->>Backend (Node.js): Return Order ID
    Backend (Node.js)-->>Frontend (React): Send Order Details & Key
    Frontend (React)->>Student: Open Razorpay Checkout Modal
    Student->>Razorpay: Enters Payment Details & Pays
    Razorpay-->>Frontend (React): Payment Success (Payment ID, Signature)
    Frontend (React)->>Backend (Node.js): Send Signature for Verification
    Backend (Node.js)->>Backend (Node.js): Verify Signature Details
    Backend (Node.js)->>Database: Update Status to "Paid" & Enroll Student
    Backend (Node.js)-->>Frontend (React): Verification Success
    Frontend (React)->>Student: Redirect to "My Courses" (Enrolled)
```

## 3. Entity-Relationship (ER) Diagram / Class Model

This diagram outlines the core data models and their relationships within the database.

```mermaid
erDiagram
    USER ||--o{ ENROLLMENT : "has"
    USER {
        string _id PK
        string name
        string email
        string password_hash
        string role "student, mentor, admin"
    }

    COURSE ||--o{ MODULE : "contains"
    COURSE ||--o{ ENROLLMENT : "includes"
    COURSE {
        string _id PK
        string title
        string description
        string mentor_id FK
        number price
        string thumbnail_url
    }

    MODULE ||--o{ VIDEO : "has"
    MODULE {
        string _id PK
        string course_id FK
        string title
        number order_index
    }

    VIDEO {
        string _id PK
        string module_id FK
        string url
        string title
        number order_index
    }

    PAYMENT }|--|| USER : "made_by"
    PAYMENT }|--|| COURSE : "for"
    PAYMENT {
        string _id PK
        string user_id FK
        string course_id FK
        string razorpay_order_id
        string razorpay_payment_id
        string status "success, pending, failed"
    }

    ENROLLMENT {
        string _id PK
        string user_id FK
        string course_id FK
        string enrolled_at
        number progress_percentage
    }
```

## 4. Flowchart: AI Tutor Interaction

This diagram demonstrates how the AI tutor handles a student's question based on their current lesson context.

```mermaid
flowchart TD
    A[Student Asks Question] --> B{Is user in an active lesson?}
    B -- Yes --> C[Get Current Lesson Context]
    B -- No --> D[Use General Context]
    C --> E[Combine Context + Question prompt]
    D --> E
    E --> F[Send Prompt to AI Service / Groq Model]
    F --> G[Receive AI Response]
    G --> H[Display Response to Student in Chat Interface]
```
