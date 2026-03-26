import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import authService from '../services/authService';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef([]);

    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate('/login');
        }
    }, [email, navigate]);

    const handleChange = (index, value) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const data = e.clipboardData.getData('text').substring(0, 6).split('');
        const newOtp = [...otp];
        data.forEach((char, i) => {
            if (!isNaN(Number(char))) {
                newOtp[i] = char;
            }
        });
        setOtp(newOtp);
        inputRefs.current[Math.min(data.length, 5)]?.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await authService.verifyEmail(email, code);
            setSuccess('Email verified successfully! Redirecting...');
            setTimeout(() => {
                navigate('/login', { state: { message: 'Verification successful! You can now login.' } });
            }, 2000);
        } catch (err) {
            setError(err.message || 'Verification failed. Please check the code and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError(null);
        setSuccess(null);

        try {
            await authService.resendVerificationCode(email);
            setSuccess('Verification code resent to your email.');
        } catch (err) {
            setError(err.message || 'Failed to resend code. Please try again later.');
        } finally {
            setResending(false);
        }
    };

    if (!email) return null;

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-md w-full space-y-8 relative z-10">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl text-white shadow-xl shadow-emerald-200 mb-6 animate-pulse-slow">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Verify your email</h2>
                    <p className="mt-2 text-slate-500">
                        We've sent a 6-digit code to <span className="font-bold text-slate-900">{email}</span>
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 border border-white p-8 sm:p-10">
                    {/* Status Alerts */}
                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 animate-shake">
                            <p className="text-sm text-red-600 font-medium leading-tight">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-start gap-3 animate-fade-in">
                            <p className="text-sm text-emerald-600 font-medium leading-tight">{success}</p>
                        </div>
                    )}

                    <form className="space-y-8" onSubmit={handleSubmit}>
                        <div className="flex justify-between gap-2 sm:gap-4">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    value={data}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={handlePaste}
                                    className="w-full h-12 sm:h-14 text-center text-xl font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-300"
                                />
                            ))}
                        </div>

                        <div className="space-y-4">
                            <button
                                type="submit"
                                disabled={isLoading || otp.some(v => v === '')}
                                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-200"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Verify Email <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={resending}
                                    className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors disabled:opacity-50"
                                >
                                    {resending ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <RefreshCw className="w-4 h-4" />
                                    )}
                                    Resend Code
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <p className="text-center text-sm font-medium text-slate-500">
                    Entered the wrong email?{' '}
                    <Link to="/register" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
                        Change it
                    </Link>
                </p>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 3s infinite ease-in-out;
                }
            `}} />
        </div>
    );
};

export default VerifyEmail;
