import React from 'react';

const Terms = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Terms of Service</h1>

                <div className="space-y-8 text-slate-600 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using Seedit Academy, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. Seedit provides an e-learning platform where users can access and purchase educational courses.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">2. Access to Services</h2>
                        <p>
                            Seedit Academy is an open e-learning platform. You can access educational content directly without needing to create an account. Some features may be personalized but do not require formal registration at this time.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">3. Course Enrollment and Access</h2>
                        <p>
                            When you enroll in a course, you get a license to view it via the Seedit platform. Courses are for your personal, non-commercial use only. You may not share your account or course content with others.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">4. Free Access</h2>
                        <p>
                            All courses on the Seedit platform are currently provided free of charge for educational purposes. We do not require any payment information to access our learning materials.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">5. Content Ownership</h2>
                        <p>
                            All content on the Seedit platform, including text, videos, graphics, and code, is the property of Seedit or its content providers and is protected by intellectual property laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">6. Prohibited Conduct</h2>
                        <p>
                            You agree not to use the service for any illegal purposes or to conduct any activity that infringes on the rights of others. This includes but is not limited to harassment, distribution of malware, or unauthorized access to our systems.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">7. Changes to Terms</h2>
                        <p>
                            Seedit reserves the right to modify these terms at any time. We will notify users of any significant changes via email or through the platform.
                        </p>
                    </section>

                    <footer className="pt-8 border-t border-slate-100 text-sm text-slate-400">
                        Last updated: February 19, 2026
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Terms;
