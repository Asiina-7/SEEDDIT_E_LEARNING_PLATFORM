# 2. SYSTEM STUDY

## 2.1 The Existing System
The current educational landscape is dominated by traditional Learning Management Systems (LMS) that function primarily as static repositories for course materials. These platforms often lack personalization, offering a one-size-fits-all approach that fails to adapt to individual learning paces. Significant limitations exist in real-time academic support; students facing conceptual roadblocks must rely on delayed communication channels such as forums or emails, leading to frustration and high attrition rates.

Furthermore, existing systems present friction for content creators. Mentors struggle with disjointed interfaces when uploading multimedia content or linking supplementary resources to specific video timestamps. Administrative and payment processes are equally inefficient. Monetization often relies on clunky third-party redirects that increase cart abandonment, and the lack of automated enrollment post-payment degrades the user experience. Overall, legacy platforms suffer from UI bloat and disconnected modules, creating a fragmented experience for students, mentors, and administrators alike.

## 2.2 The Proposed System
To overcome these critical limitations, we propose "Seedit", a modern, intelligent, and highly interactive E-Learning Platform. Built on a robust Single Page Application (SPA) architecture using React (Vite) for the frontend and a scalable Node.js backend, Seedit transitions digital education from passive consumption to an active, personalized journey.

**Key Features of the Proposed System:**
*   **Intelligent AI Tutor:** The hallmark of Seedit is a context-aware AI tutor powered by advanced large language models (e.g., Groq's Mixtral 8x7B). It understands the specific lesson a student is viewing and provides instant, personalized explanations to overcome learning blockages in real-time, simulating a 1-on-1 tutoring experience.
*   **Role-Based Access Control (RBAC):** Seedit provides dedicated, optimized dashboards for Students, Mentors, and Administrators. Students enjoy a distraction-free environment with enforced sequential video playback; Mentors have streamlined tools for dynamic multi-module course creation; and Administrators possess centralized oversight capabilities.
*   **Integrated Payment Gateway:** The system integrates Razorpay directly into the native checkout flow, enabling seamless, secure transactions without external redirects. Successful payments instantly and automatically trigger course enrollment.
*   **Modern Architecture & Scalability:** Utilizing reactive state management and modular services (`authService`, `courseService`, `paymentService`), the platform ensures lightning-fast performance, high maintainability, and seamless scalability for future enhancements.

In conclusion, the proposed Seedit platform offers a highly feasible, cost-effective, and technically superior alternative to traditional LMS. By prioritizing AI-driven support, frictionless transactions, and tailored user experiences, it promises enhanced learning outcomes and significant operational efficiency.
