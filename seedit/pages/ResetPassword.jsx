import React, { useState } from 'react';
import { Shield, ChevronLeft, Lock, CheckCircle, ArrowRight } from 'lucide-react';
import authService from '../services/authService';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        email: '',
        code: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        if (formData.code.length !== 6) {
            return setError('Reset code must be 6 digits');
        }

        setIsLoading(true);
        setError('');

        try {
            await authService.resetPassword(formData.email, formData.code, formData.password);
            setIsSuccess(true);
        } catch (err) {
            setError(err.message || 'Invalid code or email');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100">
                    {!isSuccess ? (
                        <>
                            <div className="flex items-center gap-2 mb-8">
                                <a href="#/forgot-password" className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
                                    <ChevronLeft className="w-5 h-5" />
                                </a>
                                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reset Password</h1>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">6-Digit Code</label>
                                    <div className="relative group">
                                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                                        <input
                                            type="text"
                                            required
                                            maxLength={6}
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-black tracking-[0.5em] text-center text-slate-900"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">New Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                                        <input
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium text-slate-900"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1">Confirm Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                                        <input
                                            type="password"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
                                    className="w-full mt-4 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-slate-800 hover:translate-y-[-2px] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                                >
                                    {isLoading ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-600 mx-auto mb-8 animate-success-pop">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Success!</h2>
                            <p className="text-slate-500 font-medium mb-10">
                                Your password has been updated. You can now login with your new credentials.
                            </p>
                            <a
                                href="#/login"
                                className="block w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-emerald-200 hover:bg-emerald-500 hover:translate-y-[-2px] transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                Back to Login <ArrowRight className="w-4 h-4" />
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes success-pop {
                    0% { transform: scale(0.5); opacity: 0; }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-success-pop {
                    animation: success-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                .animate-shake {
                    animation: shake 0.2s ease-in-out 0s 2;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
            `}} />
        </div>
    );
};

export default ResetPassword;
