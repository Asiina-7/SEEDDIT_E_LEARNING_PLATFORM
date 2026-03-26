import React from 'react';

const Privacy = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Privacy Policy</h1>

                <div className="space-y-8 text-slate-600 leading-relaxed">
                    <p className="text-lg">
                        At Seedit Academy, we take your privacy seriously. This policy describes how we collect, use, and handle your information when you use our services.
                    </p>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
                        <div className="space-y-4">
                            <p>We collect several types of information for various purposes:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><strong>Personal Data:</strong> Email address, first name, last name, and profile information you provide.</li>
                                <li><strong>Usage Data:</strong> Information about how you access and use the platform, including course progress and quiz results.</li>
                                <li><strong>Cookies:</strong> We use cookies and similar tracking technologies to track activity on our service and hold certain information.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">2. Use of Data</h2>
                        <div className="space-y-4">
                            <p>We use the collected data for various purposes:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>To provide and maintain our Service</li>
                                <li>To notify you about changes to our Service</li>
                                <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
                                <li>To provide customer support</li>
                                <li>To gather analysis or valuable information so that we can improve our Service</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">3. Data Security</h2>
                        <p>
                            The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage, is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">4. Third-Party Service Providers</h2>
                        <p>
                            We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, or to perform Service-related services. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">5. Links to Other Sites</h2>
                        <p>
                            Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">6. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at support@seedit.academy.
                        </p>
                    </section>

                    <footer className="pt-8 border-t border-slate-100 text-sm text-slate-400">
                        Last updated: February 10, 2026
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
