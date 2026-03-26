import React, { useState } from 'react';
import { Mail, ChevronLeft, Send, CheckCircle } from 'lucide-react';
import authService from '../services/authService';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await authService.forgotPassword(email);
            setIsSent(true);
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
                    {!isSent ? (
                        <>
                            <div className="flex items-center gap-2 mb-8">
                                <a href="#/login" className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
                                    <ChevronLeft className="w-5 h-5" />
                                </a>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Forgot Password</h1>
                            </div>

                            <p className="text-slate-500 font-medium mb-8">
                                Enter your email address and we'll send you a 6-digit code to reset your password.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-sm font-bold animate-shake">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-emerald-200 hover:bg-emerald-500 hover:translate-y-[-2px] transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:translate-y-0"
                                >
                                    {isLoading ? 'Processing...' : (
                                        <>Send Reset Code <Send className="w-4 h-4" /></>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-600 mx-auto mb-8 animate-bounce-soft">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Code Sent!</h2>
                            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                                We've sent a 6-digit verification code to <span className="text-slate-900 font-black">{email}</span>. Please check your inbox (and spam).
                            </p>
                            <a
                                href="#/reset-password"
                                className="block w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95"
                            >
                                Enter Reset Code
                            </a>
                            <button
                                onClick={() => setIsSent(false)}
                                className="mt-6 text-sm font-black text-emerald-600 uppercase tracking-widest hover:underline"
                            >
                                Resend Email
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes bounce-soft {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-soft {
                    animation: bounce-soft 3s ease-in-out infinite;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.2s ease-in-out 0s 2;
                }
            `}} />
        </div>
    );
};

export default ForgotPassword;
