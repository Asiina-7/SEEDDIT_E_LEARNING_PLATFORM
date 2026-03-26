import React, { useState, useEffect } from 'react';
import { Mail, X, CheckCircle, Bell, ArrowRight, Copy, Check } from 'lucide-react';

const MockEmailNotification = () => {
    const [emails, setEmails] = useState([]);
    const [copiedIndex, setCopiedIndex] = useState(null);

    useEffect(() => {
        const handleMockEmail = (event) => {
            const { email, name, code, type } = event.detail;
            const newEmail = {
                email,
                name,
                code,
                type,
                timestamp: Date.now()
            };
            setEmails(prev => [newEmail, ...prev].slice(0, 3)); // Keep only 3 latest

            // Auto-hide after 15 seconds
            setTimeout(() => {
                setEmails(prev => prev.filter(e => e.timestamp !== newEmail.timestamp));
            }, 15000);
        };

        window.addEventListener('mock-email-sent', handleMockEmail);
        return () => window.removeEventListener('mock-email-sent', handleMockEmail);
    }, []);

    const removeEmail = (timestamp) => {
        setEmails(prev => prev.filter(e => e.timestamp !== timestamp));
    };

    const handleCopy = (code, index) => {
        navigator.clipboard.writeText(code);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    if (emails.length === 0) return null;

    return (
        <div className="fixed top-24 right-6 z-[9999] flex flex-col gap-4 w-full max-w-sm pointer-events-none">
            {emails.map((email, idx) => (
                <div
                    key={email.timestamp}
                    className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-[2rem] p-6 shadow-2xl shadow-emerald-200/50 border border-emerald-100 flex gap-4 animate-slide-in relative overflow-hidden group"
                >
                    {/* Progress Bar (Auto-hide timer) */}
                    <div className="absolute bottom-0 left-0 h-1 bg-emerald-500/20 w-full">
                        <div className="h-full bg-emerald-500 animate-shrink-width"></div>
                    </div>

                    <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-200">
                            {email.type === 'verification' ? <Bell className="w-7 h-7" /> : <Mail className="w-7 h-7" />}
                        </div>
                    </div>

                    <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">New Message</span>
                            <button
                                onClick={() => removeEmail(email.timestamp)}
                                className="text-slate-300 hover:text-rose-500 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <h4 className="text-slate-900 font-black text-sm truncate">
                            {email.type === 'verification' ? 'Verify your Seedit Account' : 'Reset your Seedit Password'}
                        </h4>
                        <p className="text-slate-500 text-[10px] font-medium mt-1 leading-relaxed">
                            Hi <span className="text-slate-900 font-bold">{email.name}</span>, a secure code has been sent to <span className="text-slate-900 font-bold">{email.email}</span>. Please check your inbox to continue.
                        </p>

                        <div className="mt-4 flex items-center gap-3">
                            <a
                                href="https://mail.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-grow bg-emerald-600 text-white rounded-xl px-4 py-2.5 flex items-center justify-center gap-2 font-bold text-xs hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-100/50"
                            >
                                <Mail className="w-4 h-4" /> Open Webmail
                            </a>
                        </div>
                    </div>
                </div>
            ))}

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes slide-in {
                    from { transform: translateX(100%) scale(0.9); opacity: 0; }
                    to { transform: translateX(0) scale(1); opacity: 1; }
                }
                @keyframes shrink-width {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                .animate-slide-in {
                    animation: slide-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .animate-shrink-width {
                    animation: shrink-width 15s linear forwards;
                }
            `}} />
        </div>
    );
};

export default MockEmailNotification;
